# RUN LOG

## 2026-09-09 00:27 +07 — BOOTSTRAP-001

- Xác nhận repo chính thức: `tam95supra-source/van-hanh-dc-hung-yen`.
- Xác nhận branch: `main`.
- Người dùng cho phép reset nội dung repo vì dữ liệu/code cũ chưa được chốt.
- Dựng lại bộ file nền cho cơ chế resume/checkpoint AI.
- Trạng thái sau reset: `PLANNING`; chưa có code nghiệp vụ được phê duyệt.
- Quy tắc checkpoint: mục tiêu <=15 phút; soft batch limit 18 phút; checkpoint trước thao tác dài.

## 2026-09-09 03:41 +07 — BOOTSTRAP-002

- Bổ sung nguyên tắc luôn phân tích dependency và ưu tiên thực thi song song các bước độc lập, an toàn.
- Shared-state write, dependency chain, migration/deploy có thứ tự hoặc thao tác có race/destructive risk phải tuần tự.
- Tạo `ops/ai/VERSION_POLICY.md`.
- `live_beta`/`live_stable` phải dựa trên public/deployment thực tế mới nhất sau khi xác minh; không dùng dữ liệu cũ như live hiện tại.
- Khi chưa có quyền/phạm vi để xác minh public, trạng thái dùng `UNVERIFIED`/`UNKNOWN`.
- Khởi tạo `changelogs/beta/` và `changelogs/stable/`.
- Changelog theo version là lịch sử phải lưu giữ; không xóa version cũ và không âm thầm ghi đè lịch sử.
- Lần checkpoint đầu của BOOTSTRAP-002 bị connector chặn; đã đọc lại state và checkpoint lại thành công trước khi tiếp tục.

Raw chat/log không được lưu vào đây. Chỉ lưu dữ kiện đủ để phục hồi công việc nhanh.
