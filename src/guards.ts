import type { Env, RequestContext, SessionClaims } from './types';

const encoder = new TextEncoder();

function b64urlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const raw = atob(padded);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function bytesToB64url(value: ArrayBuffer): string {
  let raw = '';
  for (const byte of new Uint8Array(value)) raw += String.fromCharCode(byte);
  return btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyBearer(token: string, keyText: string): Promise<SessionClaims> {
  const parts = token.split('.');
  if (parts.length !== 2) throw new Error('AUTH_TOKEN_FORMAT');
  const [payloadPart, signaturePart] = parts;
  const key = await crypto.subtle.importKey('raw', encoder.encode(keyText), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expected = bytesToB64url(await crypto.subtle.sign('HMAC', key, encoder.encode(payloadPart)));
  if (!constantTimeEqual(expected, signaturePart)) throw new Error('AUTH_TOKEN_SIGNATURE');
  const claims = JSON.parse(new TextDecoder().decode(b64urlToBytes(payloadPart))) as SessionClaims;
  if (!claims.sub || !claims.role || !Array.isArray(claims.groups) || !claims.exp || !claims.auth_revision) throw new Error('AUTH_TOKEN_CLAIMS');
  if (claims.exp <= Math.floor(Date.now() / 1000)) throw new Error('AUTH_TOKEN_EXPIRED');
  return claims;
}

export async function requireContext(request: Request, env: Env): Promise<RequestContext> {
  if (request.headers.get('X-Project-ID') !== env.PROJECT_ID) throw new Error('PROJECT_BOUNDARY_MISMATCH');
  const groupId = request.headers.get('X-Group-ID')?.trim();
  const deviceId = request.headers.get('X-Device-ID')?.trim();
  const auth = request.headers.get('Authorization');
  if (!groupId) throw new Error('GROUP_REQUIRED');
  if (!deviceId) throw new Error('DEVICE_REQUIRED');
  if (!auth?.startsWith('Bearer ')) throw new Error('AUTH_REQUIRED');
  if (!env.AUTH_HMAC_KEY) throw new Error('AUTH_NOT_CONFIGURED');
  const claims = await verifyBearer(auth.slice(7), env.AUTH_HMAC_KEY);
  if (claims.role !== 'SUPERADMIN' && !claims.groups.includes(groupId)) throw new Error('GROUP_TOKEN_SCOPE_DENIED');

  const membership = await env.DB.prepare(
    `SELECT gm.role, gm.status, gm.can_force_lan, a.status AS account_status, a.auth_revision
       FROM group_memberships gm
       JOIN accounts a ON a.user_id = gm.user_id
      WHERE gm.group_id = ?1 AND gm.user_id = ?2`
  ).bind(groupId, claims.sub).first<{ role: string; status: string; can_force_lan: number; account_status: string; auth_revision: number }>();

  if (claims.role !== 'SUPERADMIN') {
    if (!membership || membership.status !== 'ACTIVE' || membership.account_status !== 'ACTIVE') throw new Error('GROUP_MEMBERSHIP_DENIED');
    if (membership.auth_revision !== claims.auth_revision) throw new Error('AUTH_REVISION_STALE');
  } else {
    const account = await env.DB.prepare(`SELECT status, auth_revision FROM accounts WHERE user_id = ?1`).bind(claims.sub).first<{status:string;auth_revision:number}>();
    if (!account || account.status !== 'ACTIVE' || account.auth_revision !== claims.auth_revision) throw new Error('SUPERADMIN_DENIED');
  }
  return { claims, groupId, deviceId };
}

export async function requireCloudAuthority(env: Env, groupId: string, authorityEpoch: number): Promise<void> {
  const lease = await env.DB.prepare(
    `SELECT authority_type, authority_epoch FROM authority_leases WHERE group_id = ?1`
  ).bind(groupId).first<{ authority_type: string; authority_epoch: number }>();
  if (!lease) throw new Error('AUTHORITY_NOT_INITIALIZED');
  if (lease.authority_type !== 'CLOUD') throw new Error('AUTHORITY_NOT_CLOUD');
  if (lease.authority_epoch !== authorityEpoch) throw new Error('AUTHORITY_EPOCH_STALE');
}

export async function requireForceLanPermission(env: Env, ctx: RequestContext): Promise<void> {
  if (ctx.claims.role === 'SUPERADMIN') return;
  if (ctx.claims.role !== 'ADMIN') throw new Error('ADMIN_REQUIRED');
  const row = await env.DB.prepare(
    `SELECT can_force_lan FROM group_memberships WHERE group_id = ?1 AND user_id = ?2 AND status = 'ACTIVE'`
  ).bind(ctx.groupId, ctx.claims.sub).first<{can_force_lan:number}>();
  if (!row || row.can_force_lan !== 1) throw new Error('FORCE_LAN_DENIED');
}
