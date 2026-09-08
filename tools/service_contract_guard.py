#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
required = [
    'src/index.ts','src/guards.ts','src/realtime.ts','src/types.ts','migrations/0001_core.sql','wrangler.template.jsonc'
]
for rel in required:
    if not (ROOT / rel).exists():
        raise SystemExit(f'SERVICE_CONTRACT_FAIL missing {rel}')

sql = (ROOT / 'migrations/0001_core.sql').read_text(encoding='utf-8')
for table in ['lan_groups','accounts','group_memberships','authority_leases','entity_heads','events','outbox','conflicts','image_records','audit_log']:
    if not re.search(rf'CREATE TABLE IF NOT EXISTS\s+{re.escape(table)}\b', sql, re.I):
        raise SystemExit(f'SERVICE_CONTRACT_FAIL missing table {table}')

index = (ROOT / 'src/index.ts').read_text(encoding='utf-8')
for marker in ['/v1/bootstrap','/v1/events','/v1/realtime','/v1/authority/force-lan','requireCloudAuthority','idempotency_key','ENTITY_REVISION_CONFLICT']:
    if marker not in index:
        raise SystemExit(f'SERVICE_CONTRACT_FAIL missing marker {marker}')

realtime = (ROOT / 'src/realtime.ts').read_text(encoding='utf-8')
for marker in ['acceptWebSocket','getWebSockets','WS_MUTATION_FORBIDDEN']:
    if marker not in realtime:
        raise SystemExit(f'SERVICE_CONTRACT_FAIL realtime guard missing {marker}')

wrangler = (ROOT / 'wrangler.template.jsonc').read_text(encoding='utf-8')
if 'van-hanh-dc-hung-yen' not in wrangler or 'GroupRealtime' not in wrangler or '__D1_DATABASE_ID__' not in wrangler:
    raise SystemExit('SERVICE_CONTRACT_FAIL wrangler boundary/template invalid')
if 'pick-pack-1291' in '\n'.join((ROOT / r).read_text(encoding='utf-8') for r in required):
    raise SystemExit('SERVICE_CONTRACT_FAIL legacy runtime reference detected')
print('SERVICE_CONTRACT_PASS')
