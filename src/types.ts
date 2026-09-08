export type Role = 'USER' | 'ADMIN' | 'SUPERADMIN';
export type AuthorityType = 'CLOUD' | 'LAN';

export interface Env {
  DB: D1Database;
  GROUP_REALTIME: DurableObjectNamespace;
  PROJECT_ID: string;
  AUTH_HMAC_KEY: string;
}

export interface SessionClaims {
  sub: string;
  role: Role;
  groups: string[];
  exp: number;
  auth_revision: number;
}

export interface EventInput {
  event_id: string;
  idempotency_key: string;
  group_id: string;
  entity_type: string;
  entity_id: string;
  event_type: string;
  business_date: string;
  entity_revision: number;
  authority_epoch: number;
  payload: unknown;
}

export interface RequestContext {
  claims: SessionClaims;
  groupId: string;
  deviceId: string;
}
