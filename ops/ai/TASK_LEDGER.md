# TASK LEDGER

## BOOTSTRAP-001 — Reset repo và thiết lập bộ nhớ vận hành AI

Status: `DONE`

- [x] Xác định repo chính thức: `tam95supra-source/van-hanh-dc-hung-yen`.
- [x] Xác định branch mặc định: `main`.
- [x] Loại bỏ toàn bộ nội dung code/config/workflow cũ khỏi cây làm việc mới của `main`.
- [x] Tạo quy tắc vận hành cứng cho AI.
- [x] Tạo checkpoint state tối giản.
- [x] Tạo ledger/decision/run log.

## BOOTSTRAP-002 — Song song, live version và changelog bất biến

Status: `DONE`

- [x] Bổ sung nguyên tắc phân tích dependency và ưu tiên chạy song song các bước độc lập.
- [x] Quy định shared-state write/dependency/destructive step phải serialize khi cần.
- [x] Tạo `ops/ai/VERSION_POLICY.md`.
- [x] Quy định `live_beta` và `live_stable` phải phản ánh public mới nhất sau verify.
- [x] Tạo kho `changelogs/` tách beta/stable; changelog mỗi version bất biến.

## SPEC-V2 — Chốt Core toàn DC + Pick Pack 1291 cluster đầu tiên

Status: `DONE`

- [x] Platform scope = toàn DC; cluster = team/operational boundary; feature/permission linh hoạt.
- [x] Pick Pack 1291 = strong read-only reference + cluster Beta đầu tiên.
- [x] Beta/Stable isolation, Cloud/LAN/offline/realtime/free-first/archive/version/OTA/recovery đã chốt.
- [x] Không migrate data Pick Pack cũ vì dữ liệu test.
- [x] LAN feasibility và Free capacity chuyển thành test gates.
- [x] Dự án đủ điều kiện chuyển từ planning sang setup/build.

## DOC-SHEETS-001 — Google Sheets model cho Pick Pack 1291

Status: `DONE`

- [x] Tham khảo các tab/field Pick Pack 1291 cũ có chọn lọc.
- [x] Chuyển sang workbook `environment + cluster_id + quarter`.
- [x] Google Sheets chỉ projection/human-readable archive; không authority.
- [x] Master tabs snapshot/upsert; business/history/conflict tabs append/projection qua one writer + outbox/batch.
- [x] Không mang `Danh sách Admin`, LAN fence/presence/fallback technical tabs cũ thành authority của workbook nghiệp vụ mới.
- [x] Lưu model tại `ops/setup/GOOGLE_SHEETS_MODEL_PICKPACK1291.md`.
- [x] Tạo `ops/ai/HANDOFF_NEXT_CHAT.md` để resume ở phiên mới.

## SETUP-001 — One-time service/permission setup

Status: `IN_PROGRESS`

Mục tiêu: cấu hình một lần đủ quyền và tách môi trường để từ đó AI/CI build liên tục mà không yêu cầu Owner cấp lại cùng loại quyền.

Dependency/order và trạng thái thực tế:

1. [x] `S0` checkpoint scope/authority — DONE.
2. [~] `S1` GitHub Environments `beta`/`stable` + secrets/variables — ENVIRONMENTS_VERIFIED_BY_WORKFLOW; `stable` required-reviewer protection active; secrets/variables still PARTIAL until all provider values exist.
3. [~] `S2` Cloudflare — PARTIAL. BETA/STABLE tokens owner-created; account-level BETA access verified. `CF_ACCOUNT_ID=d79b87776e86d8edc8f4a0a94302ca76`. Account already has workers.dev subdomain `1291.workers.dev`. OWNER approved changing to `vanhanhdchungyen.workers.dev`; API update returned Cloudflare 10036 because the account already has an associated subdomain, so dashboard `Workers & Pages -> Change` is the safe next step. Custom zone `vanhanhdchungyen.cc.cd` remains separately blocked by Cloudflare Add-site review.
4. [ ] `S3` Google Cloud BETA/STABLE + APIs + OAuth clients/refresh tokens — PENDING; independent of S2 and may proceed in parallel.
5. [ ] `S4` Apps Script BETA/STABLE bootstrap + web-app deployment + Sheets projection automation — PENDING; depends on S3; Bootstrap Kit ready.
6. [x] `S5` Drive runtime roots BETA/STABLE — PASS 2026-09-10. Root IDs stored in `ops/setup/RESOURCE_REGISTRY.md`; each env readback contains `00_SHARED..07_SYSTEM`.
7. [ ] `S6` Android Beta/Stable signing + encrypted backup — PENDING/OWNER-CONTROLLED; independent of S2/S3.
8. [x] `LAN-PLAN` HY1/HY2 Probe plan — READY 2026-09-10 at `ops/setup/LAN_PROBE_PLAN.md`; physical test still OPEN.
9. [ ] `S7` Lock P1 contracts: IDs/event/permission/API/schema/release — only after SETUP-001 is sufficiently ready.
10. [ ] `S8+` Cloud/Google/App/Web/LAN workstreams parallelize after contracts.

Cloudflare evidence:
- `.github/workflows/setup-verify-cloudflare.yml` verified BETA token/account API access.
- `.github/workflows/setup-workers-dev.yml` run `34435410482` read `CF_ACCOUNT_ID=d79b87776e86d8edc8f4a0a94302ca76` and current `CURRENT_WORKERS_DEV_SUBDOMAIN=1291`; PUT target `vanhanhdchungyen` returned HTTP 409 / Cloudflare `10036: Account already has an associated subdomain`.
- Cloudflare docs state account workers.dev subdomain can be changed in Dashboard: Workers & Pages -> Change next to Your subdomain.
- OWNER approved interim workers.dev route while custom zone review is pending. Fixed Worker names remain `vhdchy-beta` / `vhdchy-stable`; after desired account subdomain change, URLs will be `vhdchy-beta.vanhanhdchungyen.workers.dev` and `vhdchy-stable.vanhanhdchungyen.workers.dev`.
- LAN is not exposed on workers.dev.

Empirical gates, not architecture questions:
- `LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE` — PLAN READY, TEST NOT RUN.
- `FREE_PLAN_CAPACITY_REQUIRES_BETA_STRESS_SOAK_MEASUREMENT` — NOT RUN.

## NEXT

Owner changes the existing Workers account subdomain from `1291` to `vanhanhdchungyen` in Cloudflare Dashboard if the target is available. AI then readbacks workers.dev and can continue account-level Worker/D1 setup without waiting for custom-zone review. In parallel, start S3 Google Cloud/OAuth and S6 Android signing. Custom zone review remains open but no longer blocks Beta build/test through workers.dev.
