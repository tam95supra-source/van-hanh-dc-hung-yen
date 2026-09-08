# CHANGELOG ARCHIVE

Kho lưu lịch sử thay đổi theo từng version public/phát hành.

Quy tắc:

- Không xóa changelog của version cũ.
- Không tái sử dụng file changelog của version khác.
- Không âm thầm sửa lịch sử đã chốt; correction phải ghi rõ nội dung sửa và thời điểm.
- Beta và stable lưu riêng.
- `CURRENT_STATE.md` chỉ giữ con trỏ live hiện tại để resume nhanh; không nhét toàn bộ lịch sử vào startup context.

Cấu trúc:

- `changelogs/beta/<version>.md`
- `changelogs/stable/<version>.md`

Mỗi changelog nên chứa tối thiểu: version, kênh beta/stable, thời điểm public/phát hành, commit/SHA hoặc build/deploy ID nếu có, thay đổi chính, migration/breaking change nếu có, và correction nếu phát sinh.
