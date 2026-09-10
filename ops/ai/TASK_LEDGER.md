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
2. [~] `S1` GitHub Environments `beta`/`stable` + secrets/variables — ENVIRONMENTS_CREATED_OWNER_CONFIRMED 2026-09-10; secrets/variables PENDING. Connector không expose Environment admin/secrets readback nên không ghi fully PASS cho tới khi cấu hình env values hoàn tất.
3. [ ] `S2` Cloudflare scoped tokens + account/zone IDs — PENDING; có thể song song S3/S6.
4. [ ] `S3` Google Cloud BETA/STABLE + APIs + OAuth clients/refresh tokens — PENDING; có thể song song S2/S6.
5. [ ] `S4` Apps Script BETA/STABLE bootstrap + web-app deployment + Sheets projection automation — PENDING; phụ thuộc S3; Bootstrap Kit đã sẵn.
6. [x] `S5` Drive runtime roots BETA/STABLE — PASS 2026-09-10. Root IDs lưu tại `ops/setup/RESOURCE_REGISTRY.md`; mỗi env đã readback đủ `00_SHARED..07_SYSTEM`.
7. [ ] `S6` Android Beta/Stable signing + encrypted backup — PENDING/OWNER-CONTROLLED.
8. [x] `LAN-PLAN` HY1/HY2 Probe plan — READY 2026-09-10 tại `ops/setup/LAN_PROBE_PLAN.md`; physical test vẫn OPEN.
9. [ ] `S7` Lock P1 contracts: IDs/event/permission/API/schema/release — chỉ bắt đầu sau khi SETUP-001 đủ điều kiện.
10. [ ] `S8+` Cloud/Google/App/Web/LAN workstreams chạy song song theo contract.

Empirical gates, không phải câu hỏi kiến trúc:
- `LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE` — PLAN READY, TEST NOT RUN.
- `FREE_PLAN_CAPACITY_REQUIRES_BETA_STRESS_SOAK_MEASUREMENT` — NOT RUN.

## NEXT

Bắt đầu S2 Cloudflare và S3 Google Cloud/OAuth song song; S6 Android signing cũng độc lập nhưng cần giữ private key/backup Owner-controlled. Sau khi provider tạo xong IDs/credentials, nhập các secrets/variables vào GitHub `beta`/`stable` rồi đóng S1. AI không làm lại S5 hoặc viết lại LAN Probe plan.
