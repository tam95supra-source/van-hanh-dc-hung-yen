#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "ops" / "PROJECT_RESOURCE_REGISTRY.json"
PERMISSIONS = ROOT / "ops" / "PERMISSION_MANIFEST.json"
EXPECTED_PROJECT = "VAN_HANH_DC_HUNG_YEN"
EXPECTED_REPO = "tam95supra-source/van-hanh-dc-hung-yen"
LEGACY_REPO = "tam95supra-source/pick-pack-1291"

SECRET_KEY_RE = re.compile(r"(?:token|password|secret|private[_-]?key|refresh[_-]?token)$", re.I)
PLACEHOLDER_VALUES = {None, "", "PENDING", "NOT_CREATED"}


def fail(msg: str) -> None:
    print(f"BOUNDARY_FAIL: {msg}", file=sys.stderr)
    raise SystemExit(1)


def walk(obj, path="$"):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield f"{path}.{k}", k, v
            yield from walk(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk(v, f"{path}[{i}]")


def main() -> None:
    if not REGISTRY.exists():
        fail("missing ops/PROJECT_RESOURCE_REGISTRY.json")
    if not PERMISSIONS.exists():
        fail("missing ops/PERMISSION_MANIFEST.json")

    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    permissions = json.loads(PERMISSIONS.read_text(encoding="utf-8"))

    if registry.get("project_id") != EXPECTED_PROJECT:
        fail("project_id mismatch")
    if registry.get("canonical_repo") != EXPECTED_REPO:
        fail("canonical_repo mismatch")
    if registry.get("boundary_mode") != "ALLOWLIST_FAIL_CLOSED":
        fail("boundary must be ALLOWLIST_FAIL_CLOSED")

    legacy = registry.get("legacy_reference") or {}
    if legacy.get("repository") != LEGACY_REPO:
        fail("legacy reference repo mismatch")
    if legacy.get("mode") != "READ_ONLY_REFERENCE":
        fail("legacy project must remain READ_ONLY_REFERENCE")
    if legacy.get("runtime_use") != "FORBIDDEN":
        fail("legacy runtime use must be FORBIDDEN")

    drive = registry.get("google_drive") or {}
    root = drive.get("root") or {}
    if not root.get("id"):
        fail("new Google Drive root ID missing")
    if root.get("name") != "VẬN HÀNH DC HƯNG YÊN":
        fail("new Google Drive root name mismatch")

    for key in ("shared_data", "lan_group_business", "group_documents", "logs", "backups", "exports", "system"):
        item = (drive.get("folders") or {}).get(key) or {}
        if not item.get("id"):
            fail(f"missing registered Drive folder ID: {key}")

    for key in ("shared_data", "lan_group_template"):
        item = (drive.get("sheets") or {}).get(key) or {}
        if not item.get("id"):
            fail(f"missing registered Sheet ID: {key}")

    # Public repo must contain references/names only, never actual secret values.
    for doc_name, doc in (("registry", registry), ("permission manifest", permissions)):
        for path, key, value in walk(doc):
            if SECRET_KEY_RE.search(str(key)) and isinstance(value, str):
                upper = value.upper()
                allowed_reference = (
                    value in PLACEHOLDER_VALUES
                    or upper.startswith("DEFERRED")
                    or upper.startswith("PENDING")
                    or upper.startswith("NOT_")
                    or upper.endswith("_REFERENCE")
                    or upper.endswith("_CONFIG")
                    or "SECRET_REFERENCE" in upper
                    or "SECRET_NAME" in upper
                )
                if value and not allowed_reference:
                    fail(f"possible plaintext secret in {doc_name} at {path}")

    serialized = json.dumps(registry, ensure_ascii=False)
    if "pick-pack-1291" in serialized and '"READ_ONLY_REFERENCE"' not in serialized:
        fail("legacy project appears outside explicit read-only reference")

    print("BOUNDARY_PASS")


if __name__ == "__main__":
    main()
