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
- [x] Quy định các shared-state write/dependency/destructive step phải chạy tuần tự khi cần để tránh race condition.
- [x] Tạo `ops/ai/VERSION_POLICY.md`.
- [x] Quy định `live_beta` và `live_stable` phải phản ánh public thực tế mới nhất sau khi xác minh.
- [x] Quy định nếu chưa xác minh được thì dùng `UNVERIFIED`/`UNKNOWN`, không dùng version cũ như live hiện tại.
- [x] Tạo kho `changelogs/` tách beta/stable.
- [x] Quy định changelog mỗi version phải được giữ lâu dài, không xóa lịch sử.

## NEXT

Chưa có task triển khai code nghiệp vụ được phê duyệt.

Khi có task mới:

1. Tạo ID task mới.
2. Ghi mục tiêu và trạng thái `PENDING`/`IN_PROGRESS`.
3. Lập dependency graph ngắn; nhóm bước độc lập để chạy song song an toàn.
4. Chia các nhánh thành atomic steps đủ nhỏ để checkpoint thường xuyên.
5. Cập nhật `CURRENT_STATE.md` để `read_next` chỉ trỏ đúng tài liệu cần thiết.
