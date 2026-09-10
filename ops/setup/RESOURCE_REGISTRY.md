# RESOURCE REGISTRY

Non-secret resource registry for one-time setup. Secret/token/private-key values must never be stored here.

## GitHub Environments

Verified by setup workflow execution 2026-09-10:
- `beta` — EXISTS; setup verification job can enter environment and read environment secret name `CLOUDFLARE_API_TOKEN`.
- `stable` — EXISTS; required-reviewer protection is active (verification job waits for approval).
- Environment secrets/variables: PARTIAL; Cloudflare secret name is present in `beta`; remaining provider values still pending.

## Cloudflare

### BETA — FIX_REQUIRED

- Owner confirmed `VHDCHY-BETA-CI` created and stored as GitHub `beta` environment secret `CLOUDFLARE_API_TOKEN`.
- Validation workflow: `.github/workflows/setup-verify-cloudflare.yml`.
- Diagnostic run `34433999726`: token authentication/account read succeeded, then zone lookup returned zero accessible zones.
- Confirmation run `34434041556`: direct lookup of `vanhanhdchungyen.cc.cd` again returned zero accessible zones.
- Conclusion: token secret exists and is accepted for account-level API access, but Zone resource/Zone Read scope for `vanhanhdchungyen.cc.cd` is missing or incorrectly scoped. Do not mark S2 PASS until fixed and rerun succeeds.
- Account ID / Zone ID: not recorded yet because exact target zone was not accessible to token.

### STABLE — OWNER_CONFIRMED_TOKEN / VALIDATION_WAITING

- Owner confirmed `VHDCHY-STABLE-CI` created and stored as GitHub `stable` environment secret `CLOUDFLARE_API_TOKEN`.
- Stable verification job is waiting on environment required-reviewer protection; validate after token scope correction.
- Account ID / Zone ID: pending successful verification.

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

Add only after actual creation/readback or explicit Owner confirmation when provider admin readback is unavailable:
- Cloudflare account ID / zone ID / Worker / D1 / public domain status after token validation PASS.
- GCP project IDs/numbers and OAuth client identifiers (never client secret/refresh token).
- Apps Script Script ID / Deployment ID / exec URL according to Runbook sensitivity rules.
- Android signer SHA256 fingerprints only (never keystore/password/private key).
- LAN Probe build/test identifiers and HY1/HY2 result.
