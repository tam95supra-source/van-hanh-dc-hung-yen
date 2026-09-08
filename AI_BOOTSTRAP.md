# AI BOOTSTRAP — HARD OPERATING RULES

## 1. Phạm vi được phép

Repository duy nhất đang được phép thao tác cho dự án này:

- `tam95supra-source/van-hanh-dc-hung-yen`
- Branch mặc định: `main`

Không đọc/ghi/sửa repository khác cho công việc của dự án này nếu chưa có chỉ thị mới của người dùng và chưa cập nhật lại phạm vi này.

Phạm vi dịch vụ bên ngoài hiện **chưa được khai báo**. Không tự suy đoán quyền thao tác dịch vụ.

## 2. Nguồn sự thật

- Với trạng thái công việc, quyết định, việc đã làm/chưa làm: GitHub checkpoint là nguồn chính thức.
- Với trạng thái kỹ thuật thực tế của code/config/database/service: phải kiểm tra trạng thái thực tế khi tác vụ yêu cầu; không suy diễn từ chat.
- Chỉ thị mới, rõ ràng của người dùng có thể thay đổi kế hoạch cũ; thay đổi phải được checkpoint trước hoặc ngay sau bước nguyên tử đầu tiên có liên quan.
- Trí nhớ AI và lịch sử chat không được dùng như nguồn sự thật độc lập.

## 3. Quy trình bắt đầu MỌI lượt thực thi

1. Đọc `AI_BOOTSTRAP.md`.
2. Đọc `CURRENT_STATE.md`.
3. Kiểm tra đúng repo/branch/môi trường.
4. Chỉ đọc thêm file nằm trong `read_next` hoặc thực sự cần cho tác vụ hiện tại.
5. Đối chiếu `last_completed_step`, `next_step`, `do_not_repeat` trước khi chạy tool.
6. Không làm lại việc đã được xác nhận hoàn thành.

Mục tiêu: lấy đủ ngữ cảnh với ít token nhất; không quét toàn repo nếu không cần.

## 4. Quy tắc checkpoint bắt buộc

Nếu có thay đổi trạng thái, mỗi lượt thực thi phải checkpoint GitHub. Không chờ đến cuối một chuỗi dài.

Checkpoint khi xảy ra MỘT trong các điều kiện:

- hoàn thành một atomic step;
- có quyết định mới hoặc thay đổi yêu cầu;
- có commit/config/migration/deploy mới;
- có kết quả test/CI quan trọng;
- phát hiện lỗi/blocker quan trọng;
- trước một thao tác dài hoặc có nguy cơ tool bị cắt;
- khoảng 10–15 phút kể từ checkpoint gần nhất;
- chuẩn bị dừng dù công việc đã xong hay còn dở.

Mục tiêu thời gian:

- `CHECKPOINT_TARGET <= 15 phút`
- `SOFT_WORK_BATCH_LIMIT = 18 phút`

Khi gần 18 phút: không mở thêm cụm việc mới; ưu tiên ghi checkpoint.

Không giả định có thể ngắt một tool call đang chạy ở phút 15/18. Vì vậy trước tool call có khả năng kéo dài phải checkpoint trạng thái `IN_PROGRESS`, ghi rõ thao tác sắp chạy và định danh cần thiết.

## 5. Nội dung checkpoint tối thiểu

Cập nhật `CURRENT_STATE.md` với:

- `state_revision`
- `last_checkpoint_at`
- `current_task`
- `status`
- `last_completed_step`
- `next_step`
- `do_not_repeat`
- commit/SHA/run ID/error ID quan trọng nếu có
- `read_next` tối thiểu cho lượt sau

Đồng thời cập nhật file chuyên biệt khi cần:

- `ops/ai/TASK_LEDGER.md`: tiến độ task/step.
- `ops/ai/DECISIONS.md`: quyết định đã chốt và quyết định bị thay thế.
- `ops/ai/RUN_LOG.md`: nhật ký checkpoint ngắn gọn, không chép raw log dài.

Nếu không có thay đổi trạng thái thì không tạo commit chỉ để ghi “đã đọc”, tránh lãng phí.

## 6. Khi tool/CI bị cắt hoặc kết quả không chắc chắn

- Không tự coi thao tác là thành công.
- Lượt kế tiếp phải đọc checkpoint trước, sau đó kiểm tra commit/run/service thực tế nếu cần.
- Nếu checkpoint trước thao tác ghi `IN_PROGRESS`, tiếp tục từ bước xác minh kết quả của thao tác đó; không chạy lại ngay.
- Nếu trạng thái không thể xác minh an toàn, đánh dấu `BLOCKED/UNKNOWN`; không bịa kết quả.

## 7. Tối ưu token và thời gian

- Luôn đọc 2 file đầu mối trước: `AI_BOOTSTRAP.md` + `CURRENT_STATE.md`.
- Chỉ mở ledger/decision/log hoặc source file liên quan khi `read_next`/tác vụ yêu cầu.
- Không đọc lại raw CI log nếu đã có kết luận + run/job ID đủ dùng.
- Không lưu transcript chat đầy đủ; chỉ lưu facts, quyết định, trạng thái, ID và bước tiếp theo.
- `CURRENT_STATE.md` phải luôn ngắn và đủ để resume nhanh.
- Log dài phải được tóm tắt hoặc luân chuyển thay vì làm file khởi động phình to.

## 8. Chống nhớ sai / làm lại

Trước mọi thay đổi quan trọng, phải trả lời được từ nguồn đã kiểm tra:

- Đang ở task nào?
- Bước cuối đã hoàn thành là gì?
- Bước tiếp theo là gì?
- Việc gì cấm làm lại?
- Repo/branch/môi trường nào đang được phép?

Nếu dữ liệu trong chat mâu thuẫn với checkpoint cũ, ưu tiên chỉ thị mới rõ ràng của người dùng cho mục tiêu mới, nhưng phải ghi nhận sự thay đổi vào GitHub; không âm thầm chọn một phiên bản.

## 9. Nguyên tắc an toàn dữ liệu

- Không ghi secret/token/password vào repository.
- Không xóa/ghi đè dữ liệu ngoài phạm vi đã cho phép.
- Thao tác phá hủy phải có ủy quyền rõ ràng của người dùng.
- Không tự mở rộng phạm vi repo/service.

## 10. Quy tắc kết thúc lượt thực thi

Nếu đã thay đổi bất kỳ trạng thái nào, trước khi trả lời cuối cùng phải cố gắng checkpoint GitHub trong cùng lượt tool. Nếu nền tảng đã cắt quyền tool trước checkpoint, phải nói rõ checkpoint nào chưa ghi; lượt tiếp theo bắt đầu bằng xác minh thực tế thay vì dựa vào trí nhớ.