# RESOURCE REGISTRY

Non-secret resource registry for one-time setup. Secret/token/private-key values must never be stored here.

## GitHub Environments

Verified by setup workflow execution 2026-09-10:
- `beta` — EXISTS; setup verification job can enter environment and read environment secret name `CLOUDFLARE_API_TOKEN`.
- `stable` — EXISTS; required-reviewer protection is active (verification job waits for approval).
- Environment secrets/variables: PARTIAL; Cloudflare secret name is present in `beta`; remaining provider values still pending.

## Cloudflare

### Account — VERIFIED 2026-09-10

- `CF_ACCOUNT_ID`: `d79b87776e86d8edc8f4a0a94302ca76`
- Current account `workers.dev` subdomain: `1291.workers.dev`
- OWNER-approved target account subdomain: `vanhanhdchungyen.workers.dev`
- API change attempt via run `34435410482` returned HTTP 409 / Cloudflare `10036: Account already has an associated subdomain`.
- Cloudflare dashboard documentation supports changing the account subdomain via Workers & Pages -> Change next to Your subdomain; manual dashboard change is required rather than deleting the existing subdomain by API.
- Canonical Worker names remain `vhdchy-beta` / `vhdchy-stable`.
- Interim URL format after successful account-subdomain change: `vhdchy-beta.vanhanhdchungyen.workers.dev` and `vhdchy-stable.vanhanhdchungyen.workers.dev`.
- Until changed, any deployed Worker would use `*.1291.workers.dev`.

### BETA — PARTIAL

- Owner confirmed `VHDCHY-BETA-CI` created and stored as GitHub `beta` environment secret `CLOUDFLARE_API_TOKEN`.
- Account-level API access verified; token can read the single scoped account and call Workers APIs.
- Validation workflow: `.github/workflows/setup-verify-cloudflare.yml`.
- workers.dev setup workflow: `.github/workflows/setup-workers-dev.yml`.
- Custom zone `vanhanhdchungyen.cc.cd` does not exist because Cloudflare currently blocks Add site for this account; this is separate from account-level Workers access.

### STABLE — OWNER_CONFIRMED_TOKEN / VALIDATION_WAITING

- Owner confirmed `VHDCHY-STABLE-CI` created and stored as GitHub `stable` environment secret `CLOUDFLARE_API_TOKEN`.
- Stable verification job is gated by environment required-reviewer protection.
- Custom-zone validation deferred until Cloudflare allows zone creation.

### Custom zone — BLOCKED_EXTERNAL_REVIEW

- Desired zone: `vanhanhdchungyen.cc.cd`.
- Cloudflare Add site currently returns `You are not allowed to create new zones at this time`.
- Review/support with Cloudflare remains open; not a blocker for workers.dev, Workers account APIs, D1 or independent Google setup.
- `CF_ZONE_ID`: pending until the zone can actually be onboarded.

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
- Cloudflare zone ID / Worker / D1 / public deployment status.
- GCP project IDs/numbers and OAuth client identifiers (never client secret/refresh token).
- Apps Script Script ID / Deployment ID / exec URL according to Runbook sensitivity rules.
- Android signer SHA256 fingerprints only (never keystore/password/private key).
- LAN Probe build/test identifiers and HY1/HY2 result.
