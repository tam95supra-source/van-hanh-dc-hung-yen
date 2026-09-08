import { requireCloudAuthority, requireContext, requireForceLanPermission } from './guards';
import type { Env, EventInput, RequestContext } from './types';
export { GroupRealtime } from './realtime';

const jsonHeaders = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders });
}

function errorResponse(error: unknown): Response {
  const code = error instanceof Error ? error.message : 'INTERNAL_ERROR';
  const clientCodes = new Set([
    'PROJECT_BOUNDARY_MISMATCH','GROUP_REQUIRED','DEVICE_REQUIRED','AUTH_REQUIRED','AUTH_NOT_CONFIGURED','AUTH_TOKEN_FORMAT',
    'AUTH_TOKEN_SIGNATURE','AUTH_TOKEN_CLAIMS','AUTH_TOKEN_EXPIRED','GROUP_TOKEN_SCOPE_DENIED','GROUP_MEMBERSHIP_DENIED',
    'AUTH_REVISION_STALE','SUPERADMIN_DENIED','AUTHORITY_NOT_INITIALIZED','AUTHORITY_NOT_CLOUD','AUTHORITY_EPOCH_STALE',
    'ADMIN_REQUIRED','FORCE_LAN_DENIED','EVENT_INVALID','EVENT_GROUP_MISMATCH','ENTITY_REVISION_CONFLICT','IDEMPOTENCY_CONFLICT'
  ]);
  return json({ ok: false, error: code }, clientCodes.has(code) ? 409 : 500);
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(object[k])}`).join(',')}}`;
}

async function sha256(text: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function validateEvent(input: unknown): asserts input is EventInput {
  if (!input || typeof input !== 'object') throw new Error('EVENT_INVALID');
  const v = input as Record<string, unknown>;
  const strings = ['event_id','idempotency_key','group_id','entity_type','entity_id','event_type','business_date'];
  if (strings.some((k) => typeof v[k] !== 'string' || !(v[k] as string).trim())) throw new Error('EVENT_INVALID');
  if (!Number.isInteger(v.entity_revision) || (v.entity_revision as number) < 1) throw new Error('EVENT_INVALID');
  if (!Number.isInteger(v.authority_epoch) || (v.authority_epoch as number) < 1) throw new Error('EVENT_INVALID');
}

async function postEvent(request: Request, env: Env, ctx: RequestContext): Promise<Response> {
  const input = await request.json();
  validateEvent(input);
  if (input.group_id !== ctx.groupId) throw new Error('EVENT_GROUP_MISMATCH');
  await requireCloudAuthority(env, ctx.groupId, input.authority_epoch);

  const payloadJson = stableStringify(input.payload ?? null);
  const payloadHash = await sha256(payloadJson);
  const now = new Date().toISOString();

  const existing = await env.DB.prepare(
    `SELECT event_id, payload_hash, entity_revision FROM events WHERE idempotency_key = ?1`
  ).bind(input.idempotency_key).first<{event_id:string;payload_hash:string;entity_revision:number}>();
  if (existing) {
    if (existing.payload_hash !== payloadHash || existing.entity_revision !== input.entity_revision) throw new Error('IDEMPOTENCY_CONFLICT');
    return json({ ok: true, duplicate: true, event_id: existing.event_id });
  }

  const head = await env.DB.prepare(
    `SELECT revision FROM entity_heads WHERE group_id = ?1 AND entity_type = ?2 AND entity_id = ?3`
  ).bind(ctx.groupId, input.entity_type, input.entity_id).first<{revision:number}>();
  const expectedRevision = (head?.revision ?? 0) + 1;
  if (input.entity_revision !== expectedRevision) {
    const conflictId = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO conflicts(conflict_id,group_id,entity_type,entity_id,incoming_event_id,expected_revision,actual_revision,state,details_json,created_at)
       VALUES(?1,?2,?3,?4,?5,?6,?7,'OPEN',?8,?9)`
    ).bind(conflictId, ctx.groupId, input.entity_type, input.entity_id, input.event_id, expectedRevision, input.entity_revision,
      JSON.stringify({ idempotency_key: input.idempotency_key }), now).run();
    throw new Error('ENTITY_REVISION_CONFLICT');
  }

  const eventStmt = env.DB.prepare(
    `INSERT INTO events(event_id,idempotency_key,group_id,entity_type,entity_id,event_type,business_date,entity_revision,actor_user_id,device_id,authority_epoch,payload_json,payload_hash,received_at)
     VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14)`
  ).bind(input.event_id,input.idempotency_key,ctx.groupId,input.entity_type,input.entity_id,input.event_type,input.business_date,
    input.entity_revision,ctx.claims.sub,ctx.deviceId,input.authority_epoch,payloadJson,payloadHash,now);
  const headStmt = env.DB.prepare(
    `INSERT INTO entity_heads(group_id,entity_type,entity_id,revision,last_event_id,updated_at)
     VALUES(?1,?2,?3,?4,?5,?6)
     ON CONFLICT(group_id,entity_type,entity_id) DO UPDATE SET revision=excluded.revision,last_event_id=excluded.last_event_id,updated_at=excluded.updated_at`
  ).bind(ctx.groupId,input.entity_type,input.entity_id,input.entity_revision,input.event_id,now);
  const outboxStmt = env.DB.prepare(
    `INSERT INTO outbox(outbox_id,event_id,group_id,destination,state,attempt_count,created_at,updated_at)
     VALUES(?1,?2,?3,'GOOGLE_SHEETS','PENDING',0,?4,?4)`
  ).bind(crypto.randomUUID(),input.event_id,ctx.groupId,now);

  await env.DB.batch([eventStmt, headStmt, outboxStmt]);

  const room = env.GROUP_REALTIME.get(env.GROUP_REALTIME.idFromName(ctx.groupId));
  await room.fetch('https://group-realtime/broadcast', {
    method: 'POST',
    body: JSON.stringify({ type: 'delta', group_id: ctx.groupId, event_id: input.event_id, entity_type: input.entity_type, entity_id: input.entity_id, revision: input.entity_revision })
  });
  return json({ ok: true, duplicate: false, event_id: input.event_id, revision: input.entity_revision }, 201);
}

async function realtime(request: Request, env: Env, ctx: RequestContext): Promise<Response> {
  if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') return json({ ok: false, error: 'WEBSOCKET_REQUIRED' }, 426);
  const room = env.GROUP_REALTIME.get(env.GROUP_REALTIME.idFromName(ctx.groupId));
  const headers = new Headers(request.headers);
  headers.set('X-User-ID', ctx.claims.sub);
  headers.set('X-Device-ID', ctx.deviceId);
  return room.fetch(new Request('https://group-realtime/connect', { headers }));
}

async function bootstrap(env: Env, ctx: RequestContext): Promise<Response> {
  const [group, lease] = await Promise.all([
    env.DB.prepare(`SELECT group_id,display_name,status,routing_revision,authority_epoch,active_master_node_id FROM lan_groups WHERE group_id=?1`).bind(ctx.groupId).first(),
    env.DB.prepare(`SELECT authority_type,authority_epoch,generation,master_node_id,lease_until_ms,routing_revision FROM authority_leases WHERE group_id=?1`).bind(ctx.groupId).first()
  ]);
  if (!group || !lease) return json({ ok: false, error: 'GROUP_NOT_INITIALIZED' }, 404);
  return json({ ok: true, project_id: env.PROJECT_ID, group, authority: lease });
}

async function forceLan(request: Request, env: Env, ctx: RequestContext): Promise<Response> {
  await requireForceLanPermission(env, ctx);
  const body = await request.json<{ master_node_id?: string; generation?: string }>();
  if (!body.master_node_id || !body.generation) return json({ ok:false,error:'LAN_MASTER_REQUIRED' },400);
  const current = await env.DB.prepare(`SELECT authority_epoch,routing_revision FROM authority_leases WHERE group_id=?1`).bind(ctx.groupId).first<{authority_epoch:number;routing_revision:number}>();
  if (!current) return json({ok:false,error:'AUTHORITY_NOT_INITIALIZED'},409);
  const epoch = current.authority_epoch + 1;
  const routing = current.routing_revision + 1;
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(`UPDATE authority_leases SET authority_type='LAN',authority_epoch=?2,generation=?3,master_node_id=?4,lease_until_ms=NULL,routing_revision=?5,updated_by=?6,updated_at=?7 WHERE group_id=?1`).bind(ctx.groupId,epoch,body.generation,body.master_node_id,routing,ctx.claims.sub,now),
    env.DB.prepare(`UPDATE lan_groups SET authority_mode='LAN_ACTIVE',authority_epoch=?2,routing_revision=?3,active_master_node_id=?4,updated_at=?5 WHERE group_id=?1`).bind(ctx.groupId,epoch,routing,body.master_node_id,now),
    env.DB.prepare(`INSERT INTO audit_log(audit_id,group_id,actor_user_id,action,target_type,target_id,details_json,created_at) VALUES(?1,?2,?3,'FORCE_LAN','LAN_GROUP',?2,?4,?5)`).bind(crypto.randomUUID(),ctx.groupId,ctx.claims.sub,JSON.stringify({epoch,routing,master_node_id:body.master_node_id}),now)
  ]);
  return json({ok:true,authority_type:'LAN',authority_epoch:epoch,routing_revision:routing,master_node_id:body.master_node_id});
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/health') return json({ ok: true, project_id: env.PROJECT_ID, service: 'van-hanh-dc-hung-yen-service' });
    try {
      const ctx = await requireContext(request, env);
      if (url.pathname === '/v1/bootstrap' && request.method === 'GET') return bootstrap(env, ctx);
      if (url.pathname === '/v1/events' && request.method === 'POST') return postEvent(request, env, ctx);
      if (url.pathname === '/v1/realtime' && request.method === 'GET') return realtime(request, env, ctx);
      if (url.pathname === '/v1/authority/force-lan' && request.method === 'POST') return forceLan(request, env, ctx);
      return json({ ok: false, error: 'NOT_FOUND' }, 404);
    } catch (error) {
      return errorResponse(error);
    }
  }
};
