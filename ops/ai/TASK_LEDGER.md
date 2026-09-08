# TASK LEDGER

## BOOTSTRAP-001 — Reset repo và thiết lập bộ nhớ vận hành AI

Status: `DONE`

- [x] Xác định repo chính thức: `tam95supra-source/van-hanh-dc-hung-yen`.
- [x] Xác định branch mặc định: `main`.
- [x] Loại bỏ toàn bộ nội dung code/config/workflow cũ khỏi cây làm việc mới của `main`.
- [x] Tạo quy tắc vận hành cứng cho AI.
- [x] Tạo checkpoint state tối giản.
- [x] Tạo ledger/decision/run log.

## NEXT

Chưa có task triển khai code nghiệp vụ được phê duyệt.

Khi có task mới:

1. Tạo ID task mới.
2. Ghi mục tiêu và trạng thái `PENDING`/`IN_PROGRESS`.
3. Chia thành atomic steps đủ nhỏ để checkpoint thường xuyên.
4. Cập nhật `CURRENT_STATE.md` để `read_next` chỉ trỏ đúng tài liệu cần thiết.