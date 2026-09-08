# CLOUD SERVICE CORE — VẬN HÀNH DC HƯNG YÊN

Status: implementation bootstrap; deployment requires OWNER one-time permissions.

## Components

- Cloudflare Worker: authenticated HTTP API and project/group boundary.
- D1: operational structured store.
- SQLite-backed Durable Object `GroupRealtime`: one realtime room per LAN Group using WebSocket Hibernation.
- Durable outbox: Google Sheet/Drive projection is asynchronous and never blocks the UI transaction path.

Cloudflare currently supports SQLite Durable Objects on Workers Free. Hibernation is used so idle realtime clients do not keep the object billed as active duration.

## Mutation path

`local-first client -> authenticated HTTP event -> project/group membership guard -> Cloud authority epoch guard -> D1 transactional batch(event + entity head + outbox) -> ACK -> GroupRealtime delta broadcast`.

WebSocket clients are forbidden from publishing business mutations. This keeps one canonical commit path and makes reconnect/replay deterministic.

## Realtime quota design

- No 5-second HTTP polling.
- No application heartbeat unless transport requires it.
- One DO broadcast trigger per committed business mutation.
- Clients receive compact delta envelopes, then patch local state.
- For bursty modules, later adapter may coalesce multiple UI deltas into one frame; business events remain individually durable in D1.

## Group fence

Every business request requires:
- project ID;
- authenticated user/session;
- exact group ID;
- registered active group membership (except SUPERADMIN global authority);
- device ID;
- authority epoch on mutations.

If group authority is LAN, the Cloud mutation endpoint fails with `AUTHORITY_NOT_CLOUD`. This prevents Cloud/LAN dual-writer split brain.

## Idempotency and offline reconcile

Every mutation has `event_id` + `idempotency_key` + entity revision. The server computes a stable payload hash.

- replay same idempotency key + same payload/revision -> returns duplicate ACK;
- same key with different payload/revision -> `IDEMPOTENCY_CONFLICT`;
- unexpected entity revision -> conflict record + `ENTITY_REVISION_CONFLICT`;
- no blind last-write-wins.

## Authority

`authority_leases` stores group-level authority type, epoch, generation, master node, routing revision and lease metadata.

ADMIN/SUPERADMIN can force LAN only through the guarded authority endpoint. USER cannot force LAN. Full LAN lease/election/standby implementation lives in the LAN Agent phase; Cloud side already fences writes by epoch/type.

## Google projection

`outbox` is durable. Initial destination for structured events is `GOOGLE_SHEETS`; image metadata and Drive upload jobs will use the same event/outbox model.

No Google call occurs inside the commit-critical D1 transaction.

## Dynamic resources

Provider IDs are not hardcoded in business code. `wrangler.template.jsonc` contains a D1 placeholder and `tools/render_wrangler.py` injects the exact created database ID during CI. Cloud resource receipts are artifacts until verified and registered canonically.

## Not implemented yet

- Production auth token mint/login and preserved SUPERADMIN credential flows.
- Google projection worker/runtime credential.
- LAN Agent Windows implementation and replica/quorum protocol.
- Concrete business reducers for attendance/labor/PDA/DO/documents.
- Domain attach/public release.
- Android APK/signing.

These are subsequent layers; current core intentionally establishes authority, event, idempotency, group isolation and realtime primitives first.
