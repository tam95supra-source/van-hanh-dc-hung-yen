PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS lan_groups (
  group_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE','DISABLED')),
  authority_mode TEXT NOT NULL DEFAULT 'CLOUD_ACTIVE' CHECK(authority_mode IN ('CLOUD_ACTIVE','LAN_ACTIVE','OFFLINE_LOCAL','RECONCILING')),
  routing_revision INTEGER NOT NULL DEFAULT 1,
  authority_epoch INTEGER NOT NULL DEFAULT 1,
  active_master_node_id TEXT,
  sheet_file_id TEXT,
  document_folder_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  user_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('USER','ADMIN','SUPERADMIN')),
  email TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE','DISABLED')),
  default_group_id TEXT,
  auth_revision INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(default_group_id) REFERENCES lan_groups(group_id)
);

CREATE TABLE IF NOT EXISTS group_memberships (
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('USER','ADMIN','SUPERADMIN')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE','DISABLED')),
  can_force_lan INTEGER NOT NULL DEFAULT 0 CHECK(can_force_lan IN (0,1)),
  assigned_by TEXT NOT NULL,
  assigned_at TEXT NOT NULL,
  PRIMARY KEY(group_id, user_id),
  FOREIGN KEY(group_id) REFERENCES lan_groups(group_id),
  FOREIGN KEY(user_id) REFERENCES accounts(user_id)
);

CREATE TABLE IF NOT EXISTS authority_leases (
  group_id TEXT PRIMARY KEY,
  authority_type TEXT NOT NULL CHECK(authority_type IN ('CLOUD','LAN')),
  authority_epoch INTEGER NOT NULL,
  generation TEXT NOT NULL,
  master_node_id TEXT,
  lease_until_ms INTEGER,
  routing_revision INTEGER NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(group_id) REFERENCES lan_groups(group_id)
);

CREATE TABLE IF NOT EXISTS entity_heads (
  group_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  last_event_id TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(group_id, entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS events (
  event_id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  group_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  business_date TEXT NOT NULL,
  entity_revision INTEGER NOT NULL,
  actor_user_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  authority_epoch INTEGER NOT NULL,
  payload_json TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  received_at TEXT NOT NULL,
  FOREIGN KEY(group_id) REFERENCES lan_groups(group_id),
  FOREIGN KEY(actor_user_id) REFERENCES accounts(user_id)
);

CREATE INDEX IF NOT EXISTS idx_events_group_date ON events(group_id, business_date, received_at);
CREATE INDEX IF NOT EXISTS idx_events_entity ON events(group_id, entity_type, entity_id, entity_revision);
CREATE INDEX IF NOT EXISTS idx_events_actor ON events(group_id, actor_user_id, received_at);

CREATE TABLE IF NOT EXISTS outbox (
  outbox_id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  destination TEXT NOT NULL CHECK(destination IN ('GOOGLE_SHEETS','GOOGLE_DRIVE','AUDIT')),
  state TEXT NOT NULL DEFAULT 'PENDING' CHECK(state IN ('PENDING','SENDING','ACKED','TERMINAL','ERROR')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT,
  last_error_code TEXT,
  ack_reference TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(event_id, destination),
  FOREIGN KEY(event_id) REFERENCES events(event_id),
  FOREIGN KEY(group_id) REFERENCES lan_groups(group_id)
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox(state, next_attempt_at, group_id);

CREATE TABLE IF NOT EXISTS conflicts (
  conflict_id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  incoming_event_id TEXT NOT NULL,
  expected_revision INTEGER,
  actual_revision INTEGER,
  state TEXT NOT NULL DEFAULT 'OPEN' CHECK(state IN ('OPEN','RESOLVED','REJECTED')),
  details_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  resolved_at TEXT,
  resolved_by TEXT,
  FOREIGN KEY(group_id) REFERENCES lan_groups(group_id)
);

CREATE INDEX IF NOT EXISTS idx_conflicts_open ON conflicts(group_id, state, created_at);

CREATE TABLE IF NOT EXISTS image_records (
  image_id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  document_id TEXT NOT NULL,
  drive_file_id TEXT,
  sha256 TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  durable_confirmed INTEGER NOT NULL DEFAULT 0 CHECK(durable_confirmed IN (0,1)),
  cache_state TEXT NOT NULL DEFAULT 'PENDING' CHECK(cache_state IN ('PENDING','CACHED','EVICTABLE','EVICTED','ERROR')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(group_id) REFERENCES lan_groups(group_id)
);

CREATE INDEX IF NOT EXISTS idx_images_group_durable ON image_records(group_id, durable_confirmed, created_at);

CREATE TABLE IF NOT EXISTS audit_log (
  audit_id TEXT PRIMARY KEY,
  group_id TEXT,
  actor_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_group_time ON audit_log(group_id, created_at);
