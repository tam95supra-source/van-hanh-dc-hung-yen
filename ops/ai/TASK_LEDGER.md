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

Status: `READY`

Mục tiêu: cấu hình một lần đủ quyền và tách môi trường để từ đó AI/CI build liên tục mà không yêu cầu Owner cấp lại cùng loại quyền.

Dependency/order:

1. `S0` checkpoint scope/authority — DONE.
2. `S1` GitHub Environments `beta`/`stable` + secrets/variables — OWNER/AI setup.
3. `S2` Cloudflare scoped tokens + account/zone IDs — có thể song song S3/S5/S6.
4. `S3` Google Cloud BETA/STABLE + APIs + OAuth clients/refresh tokens — song song S2/S5/S6.
5. `S4` Apps Script BETA/STABLE bootstrap + web-app deployment + Sheets projection automation — phụ thuộc S3; Sheets model đã DONE.
6. `S5` Drive runtime roots BETA/STABLE — song song S2/S3/S6.
7. `S6` Android Beta/Stable signing + encrypted backup — song song S2/S3/S5.
8. `S7` Lock P1 contracts: IDs/event/permission/API/schema/release.
9. `S8+` Cloud/Google/App/Web/LAN workstreams chạy song song theo contract.

Empirical gates, không phải câu hỏi kiến trúc:
- `LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE`
- `FREE_PLAN_CAPACITY_REQUIRES_BETA_STRESS_SOAK_MEASUREMENT`

## NEXT

Mở phiên chat mới theo `ops/ai/HANDOFF_NEXT_CHAT.md`, đọc checkpoint rồi thực hiện `SETUP-001` từ bước chưa hoàn thành đầu tiên. Không mở lại vòng hỏi kiến trúc trừ khi test thực tế hoặc một cluster nghiệp vụ mới làm lộ vấn đề chưa thể biết trước.
