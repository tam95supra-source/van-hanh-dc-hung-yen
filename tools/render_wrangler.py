#!/usr/bin/env python3
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'wrangler.template.jsonc'
target = ROOT / 'wrangler.generated.jsonc'
database_id = os.environ.get('D1_DATABASE_ID', '').strip()
if not database_id:
    raise SystemExit('D1_DATABASE_ID is required')
raw = source.read_text(encoding='utf-8').replace('__D1_DATABASE_ID__', database_id)
if '__D1_DATABASE_ID__' in raw:
    raise SystemExit('D1 database placeholder was not replaced')
json.loads(raw)
target.write_text(raw, encoding='utf-8')
print(target)
