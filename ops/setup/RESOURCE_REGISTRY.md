# RESOURCE REGISTRY

Non-secret resource registry for one-time setup. Secret/token/private-key values must never be stored here.

## Google Drive

Project root (existing, verified owner/private):
- Name: `VẬN HÀNH DC HƯNG YÊN`
- Folder ID: `19r3s_kTjzncRdzffNntcePW5YZQ5Dxuh`

### BETA — PASS 2026-09-10

- Runtime root: `10_RUNTIME_BETA`
- Folder ID: `1EpUI49xbFUtgzR3mh3M0EQu7qYYsswB5`
- Children verified: `00_SHARED`, `01_CLUSTERS`, `02_MEDIA`, `03_ARCHIVE`, `04_BACKUP`, `05_LOG`, `06_EXPORT`, `07_SYSTEM`

### STABLE — PASS 2026-09-10

- Runtime root: `20_RUNTIME_STABLE`
- Folder ID: `1c6RNTOHOzaX6GrQFOEd64h9rndPoeiFI`
- Children verified: `00_SHARED`, `01_CLUSTERS`, `02_MEDIA`, `03_ARCHIVE`, `04_BACKUP`, `05_LOG`, `06_EXPORT`, `07_SYSTEM`

## Pending registry entries

Add only after actual creation/readback:
- GitHub Environments `beta` / `stable` (no secret values)
- Cloudflare account ID / zone ID / Worker / D1 / public domain status
- GCP project IDs/numbers and OAuth client identifiers (never client secret/refresh token)
- Apps Script Script ID / Deployment ID / exec URL according to Runbook sensitivity rules
- Android signer SHA256 fingerprints only (never keystore/password/private key)
- LAN Probe build/test identifiers and HY1/HY2 result
