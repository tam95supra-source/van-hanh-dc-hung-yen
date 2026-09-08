# VERSION / LIVE / CHANGELOG POLICY

## Live beta và stable

- Khi dự án có môi trường public, `live_beta` và `live_stable` trong checkpoint phải phản ánh đúng phiên bản đang public thực tế mới nhất, không được lấy từ ghi nhớ chat hoặc metadata cũ.
- Trước khi ghi/cập nhật live version, phải kiểm tra nguồn public/deployment thực tế trong phạm vi dịch vụ đã được người dùng cho phép.
- Nếu chưa có quyền hoặc chưa thể xác minh nguồn public, ghi `UNVERIFIED`/`UNKNOWN`; không dùng một version cũ như thể vẫn là bản live mới nhất.
- Mọi deploy/promote/rollback làm thay đổi public beta hoặc stable phải cập nhật checkpoint ngay sau khi xác minh kết quả.

## Changelog bất biến theo version

- Changelog của mọi version đã từng public hoặc được phát hành phải được giữ vĩnh viễn trong repository; không xóa hoặc ghi đè lịch sử để chỉ giữ bản mới nhất.
- Mỗi version có changelog riêng để tránh file khởi động phình to.
- Quy ước dự kiến:
  - `changelogs/beta/<version>.md`
  - `changelogs/stable/<version>.md`
- Changelog đã chốt của một version là append-only về lịch sử. Nếu cần sửa sai tài liệu, ghi correction rõ ràng; không âm thầm xóa dấu vết cũ.
- `CURRENT_STATE.md` chỉ giữ con trỏ/version live mới nhất; chỉ đọc changelog lịch sử khi tác vụ cần.

## Quan hệ beta/stable

- `beta` và `stable` là hai trạng thái public độc lập khi được triển khai.
- Không suy luận stable đang ở version nào từ beta, và ngược lại.
- Promotion từ beta sang stable phải được xác minh ở public stable trước khi cập nhật `live_stable`.
