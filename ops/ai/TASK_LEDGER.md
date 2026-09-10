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

## SETUP-001 — One-time service/permission setup

Status: `READY`

Mục tiêu: cấu hình một lần đủ quyền và tách môi trường để từ đó AI/CI build liên tục mà không yêu cầu Owner cấp lại cùng loại quyền.

Dependency/order:

1. `S0` checkpoint scope/authority — DONE.
2. `S1` GitHub Environments `beta`/`stable` + secrets/variables — OWNER/AI setup.
3. `S2` Cloudflare scoped tokens + account/zone IDs — có thể song song S3/S4.
4. `S3` Google Cloud BETA/STABLE + APIs + OAuth clients/refresh tokens — song song S2.
5. `S4` Apps Script BETA/STABLE bootstrap + web-app deployment — phụ thuộc S3.
6. `S5` Drive runtime roots BETA/STABLE — song song S2/S3.
7. `S6` Android Beta/Stable signing + encrypted backup — song song S2/S3/S5.
8. `S7` Lock P1 contracts: IDs/event/permission/API/schema/release.
9. `S8+` Cloud/Google/App/Web/LAN workstreams chạy song song theo contract.

Empirical gates, không phải câu hỏi kiến trúc:
- `LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE`
- `FREE_PLAN_CAPACITY_REQUIRES_BETA_STRESS_SOAK_MEASUREMENT`

## NEXT

Thực hiện `SETUP-001` theo one-time runbook; không mở lại vòng hỏi kiến trúc trừ khi test thực tế hoặc một cluster nghiệp vụ mới làm lộ vấn đề chưa thể biết trước.