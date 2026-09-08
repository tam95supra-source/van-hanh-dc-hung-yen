# DECISIONS

## D-001 — Repository chính thức

Status: `ACTIVE`

Repository duy nhất hiện được phép cho dự án:
`tam95supra-source/van-hanh-dc-hung-yen` / branch `main`.

## D-002 — Không phụ thuộc trí nhớ chat

Status: `ACTIVE`

Trạng thái công việc phải được checkpoint lên GitHub. Trí nhớ AI/lịch sử chat không phải nguồn sự thật độc lập.

## D-003 — Startup tối giản

Status: `ACTIVE`

Mọi lượt thực thi đọc `AI_BOOTSTRAP.md` + `CURRENT_STATE.md` trước; chỉ đọc thêm file cần thiết hoặc được `read_next` chỉ định.

## D-004 — Checkpoint liên tục

Status: `ACTIVE`

Checkpoint sau atomic step, quyết định mới, kết quả test/CI quan trọng, trước thao tác dài và khi chuẩn bị dừng.

Mục tiêu checkpoint <=15 phút; soft work batch limit 18 phút.

## D-005 — Chưa chốt code nghiệp vụ

Status: `ACTIVE`

Dự án hiện ở `PLANNING`. Nội dung code/config/workflow cũ không được coi là nền tảng hợp lệ và đã được loại khỏi cây `main` mới. Không tự triển khai code nghiệp vụ cho đến khi có chỉ thị mới rõ ràng.

## D-006 — Phạm vi dịch vụ

Status: `PENDING`

Phạm vi các dịch vụ bên ngoài sẽ được bổ sung sau. Cho đến lúc đó AI không tự suy đoán quyền thao tác dịch vụ.

## D-007 — Ưu tiên thực thi song song an toàn

Status: `ACTIVE`

Trước khi thực thi phải phân tích dependency. Các bước độc lập, không tranh chấp shared state và không có thứ tự bắt buộc phải được ưu tiên chạy song song để giảm thời gian. Các bước có dependency, cùng ghi shared state hoặc có nguy cơ race/destructive conflict phải chạy tuần tự.

## D-008 — Live beta/stable phải phản ánh public thực tế mới nhất

Status: `ACTIVE`

Khi có môi trường public, `live_beta` và `live_stable` chỉ được coi là hợp lệ sau khi xác minh public/deployment thực tế trong phạm vi dịch vụ được phép. Sau deploy/promote/rollback phải xác minh và cập nhật ngay. Nếu không xác minh được thì ghi `UNVERIFIED`/`UNKNOWN`, không dùng thông tin cũ như bản live mới nhất.

## D-009 — Changelog version là lịch sử bất biến

Status: `ACTIVE`

Mọi version đã public/phát hành phải giữ changelog lâu dài trong repo. Không xóa changelog cũ hoặc âm thầm ghi đè lịch sử. Mỗi version dùng file riêng dưới `changelogs/beta/` hoặc `changelogs/stable/`; correction phải được ghi rõ thay vì xóa dấu vết cũ.