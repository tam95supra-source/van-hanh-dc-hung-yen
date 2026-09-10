# LAN PROBE PLAN — HY1 / HY2

Status: `PLAN_READY_TEST_NOT_RUN`

Authority: Master Spec V2 + Runbook V2. LAN feasibility is decided only by real HY1/HY2 measurement; no architectural guessing.

## Scope

Run the same portable Probe build on real company networks HY1 and HY2 with at least:
- 1 Windows laptop
- 1 Android PDA (target device class includes NLS-MT90 / Android 11)
- if available, a second laptop for Master/Backup path verification

No admin privilege is assumed. Do not change corporate firewall/router policy just to force a PASS.

## Test matrix per network

1. Record network fingerprint: local IP/subnet/default gateway/SSID label only for diagnostics; SSID is not cluster identity.
2. Laptop -> PDA direct IP reachability where Android permits a listener/test endpoint.
3. PDA -> laptop HTTP inbound.
4. PDA -> laptop WebSocket inbound and bidirectional small-message echo.
5. Discovery: mDNS and/or UDP broadcast/multicast visibility.
6. Laptop localhost HTTP/WebSocket proxy path.
7. Windows user-level startup feasibility: portable execution + Startup/Task Scheduler under user context if corporate policy permits.
8. Sleep/resume: laptop sleeps, resumes, reconnects; Probe reports reconnect time and stale-peer cleanup.
9. Network interruption/reconnect: disable/re-enable Wi-Fi or move through a controlled disconnect; verify session re-establishment without duplicate logical events.
10. If second laptop exists: laptop A <-> laptop B reachability and WebSocket path for future Master/Backup replication.

## Measurements

For same-cluster LAN path under a network that permits peer-to-peer:
- target >=90% messages under 500 ms
- 100% under 2000 ms
- no silent message loss
- reconnect outcome and time recorded

## Result codes

- `PASS_LAN_CAPABLE`: required peer-to-peer HTTP/WebSocket path works and latency target is met.
- `PASS_WITH_LIMITATIONS`: core peer path works but discovery/startup/sleep behavior has documented limitations; localhost fallback remains available.
- `FAIL_NETWORK_LIMITATION`: corporate network/client isolation/firewall policy blocks required peer path. Do not spend build time bypassing infrastructure; use Cloud on that network.
- `FAIL_PROBE_SOFTWARE`: failure attributable to Probe implementation; fix Probe and rerun before concluding network limitation.

## Evidence to checkpoint

For each HY1/HY2 run store only non-secret diagnostics:
- Probe version/SHA256
- date/time and network label
- device model/OS/app build IDs
- pass/fail per matrix item
- latency p50/p90/p95/max and loss count
- discovery result
- sleep/reconnect result
- relevant error codes
- final result code

Never store Wi-Fi password, auth token, private IP if Owner later classifies it sensitive, or personal data.

## Gate

`LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE` remains OPEN until both required real-network runs are recorded. A network marked `FAIL_NETWORK_LIMITATION` does not block Beta Cloud operation; it limits LAN availability on that network.
