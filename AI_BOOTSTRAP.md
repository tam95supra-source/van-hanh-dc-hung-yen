# AI BOOTSTRAP — HARD OPERATING RULES

## 1. Phạm vi được phép

Repository duy nhất đang được phép thao tác cho dự án này:

- `tam95supra-source/van-hanh-dc-hung-yen`
- Branch mặc định: `main`

Không đọc/ghi/sửa repository khác cho công việc của dự án này nếu chưa có chỉ thị mới của người dùng và chưa cập nhật lại phạm vi này.

Phạm vi dịch vụ bên ngoài hiện **chưa được khai báo**. Không tự suy đoán quyền thao tác dịch vụ.

## 2. Nguồn sự thật

- Với trạng thái công việc, quyết định, việc đã làm/chưa làm: GitHub checkpoint là nguồn chính thức.
- Với trạng thái kỹ thuật thực tế của code/config/database/service/public deployment: phải kiểm tra trạng thái thực tế khi tác vụ yêu cầu; không suy diễn từ chat.
- Chỉ thị mới, rõ ràng của người dùng có thể thay đổi kế hoạch cũ; thay đổi phải được checkpoint trước hoặc ngay sau bước nguyên tử đầu tiên có liên quan.
- Trí nhớ AI và lịch sử chat không được dùng như nguồn sự thật độc lập.

## 3. Quy trình bắt đầu MỌI lượt thực thi

1. Đọc `AI_BOOTSTRAP.md`.
2. Đọc `CURRENT_STATE.md`.
3. Kiểm tra đúng repo/branch/môi trường.
4. Chỉ đọc thêm file nằm trong `read_next` hoặc thực sự cần cho tác vụ hiện tại.
5. Đối chiếu `last_completed_step`, `next_step`, `do_not_repeat` trước khi chạy tool.
6. Không làm lại việc đã được xác nhận hoàn thành.
7. Phân tích dependency của công việc trước khi thực thi: bước nào độc lập thì ưu tiên chạy song song an toàn; bước nào phụ thuộc dữ liệu/trạng thái của bước trước thì chạy tuần tự.

Mục tiêu: lấy đủ ngữ cảnh với ít token nhất; không quét toàn repo nếu không cần.

## 4. Quy tắc xử lý song song

Mặc định phải tìm cơ hội chạy song song để giảm thời gian thực thi.

Được ưu tiên song song khi các công việc:

- không phụ thuộc kết quả lẫn nhau;
- không cùng sửa một file/shared mutable state;
- không có thứ tự bắt buộc;
- không tạo rủi ro race condition, quota/resource conflict hoặc thao tác phá hủy chồng chéo.

Ví dụ phù hợp: đọc nhiều file độc lập, kiểm tra nhiều nguồn độc lập, phân tích/test các thành phần không phụ thuộc nhau.

Phải chạy tuần tự khi:

- bước B cần output/SHA/ID/trạng thái từ bước A;
- cùng ghi một file/ref/branch/shared state có nguy cơ conflict;
- deploy/migration/data mutation có thứ tự hoặc transaction dependency;
- song song làm tăng rủi ro sai trạng thái hoặc phải làm lại.

Trước thao tác dài chạy song song, checkpoint từng trạng thái/định danh cần thiết để nếu một nhánh bị cắt có thể resume riêng, không làm lại các nhánh đã xong.

## 5. Quy tắc checkpoint bắt buộc

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

## 6. Nội dung checkpoint tối thiểu

Cập nhật `CURRENT_STATE.md` với:

- `state_revision`
- `last_checkpoint_at`
- `current_task`
- `status`
- `last_completed_step`
- `next_step`
- `do_not_repeat`
- commit/SHA/run ID/error ID quan trọng nếu có
- `live_beta` và `live_stable` khi đã có môi trường public
- `read_next` tối thiểu cho lượt sau

Đồng thời cập nhật file chuyên biệt khi cần:

- `ops/ai/TASK_LEDGER.md`: tiến độ task/step.
- `ops/ai/DECISIONS.md`: quyết định đã chốt và quyết định bị thay thế.
- `ops/ai/RUN_LOG.md`: nhật ký checkpoint ngắn gọn, không chép raw log dài.
- `ops/ai/VERSION_POLICY.md`: quy tắc live/version/changelog.
- `changelogs/`: changelog bất biến theo từng version.

Nếu không có thay đổi trạng thái thì không tạo commit chỉ để ghi “đã đọc”, tránh lãng phí.

## 7. Live beta / stable phải là trạng thái public mới nhất

Khi dự án có public beta/stable:

- `live_beta` và `live_stable` phải phản ánh phiên bản đang public thực tế mới nhất, không phải thông tin lịch sử hoặc ghi nhớ cũ.
- Trước khi sử dụng các trường này cho quyết định deploy/release/debug, phải xác minh nguồn public/deployment thực tế trong phạm vi dịch vụ đã được phép.
- Sau mọi deploy/promote/rollback làm thay đổi public beta/stable, phải xác minh kết quả rồi cập nhật GitHub ngay.
- Nếu không thể xác minh an toàn thì ghi `UNVERIFIED`/`UNKNOWN`; không giữ một version cũ và gọi nó là live mới nhất.
- Nếu phát hiện GitHub stale so với public thực tế, sửa checkpoint trước khi tiếp tục quyết định phụ thuộc version.

Không suy luận stable từ beta hoặc beta từ stable. Hai môi trường được theo dõi độc lập.

## 8. Changelog bất biến theo version

- Mọi version đã public/phát hành phải có changelog được lưu lại vĩnh viễn trong repo.
- Không xóa changelog version cũ để chỉ giữ version mới.
- Không âm thầm ghi đè lịch sử changelog đã chốt; nếu cần sửa sai tài liệu, ghi correction rõ ràng.
- Mỗi version dùng file riêng để lịch sử không làm phình context khởi động.
- Quy ước: `changelogs/beta/<version>.md` và `changelogs/stable/<version>.md`.
- `CURRENT_STATE.md` chỉ giữ live pointer hiện tại; changelog lịch sử chỉ đọc khi tác vụ cần.

## 9. Khi tool/CI bị cắt hoặc kết quả không chắc chắn

- Không tự coi thao tác là thành công.
- Lượt kế tiếp phải đọc checkpoint trước, sau đó kiểm tra commit/run/service thực tế nếu cần.
- Nếu checkpoint trước thao tác ghi `IN_PROGRESS`, tiếp tục từ bước xác minh kết quả của thao tác đó; không chạy lại ngay.
- Nếu trạng thái không thể xác minh an toàn, đánh dấu `BLOCKED/UNKNOWN`; không bịa kết quả.

## 10. Tối ưu token và thời gian

- Luôn đọc 2 file đầu mối trước: `AI_BOOTSTRAP.md` + `CURRENT_STATE.md`.
- Chỉ mở ledger/decision/log/changelog hoặc source file liên quan khi `read_next`/tác vụ yêu cầu.
- Ưu tiên gom các read/check độc lập thành nhóm chạy song song an toàn.
- Không đọc lại raw CI log nếu đã có kết luận + run/job ID đủ dùng.
- Không lưu transcript chat đầy đủ; chỉ lưu facts, quyết định, trạng thái, ID và bước tiếp theo.
- `CURRENT_STATE.md` phải luôn ngắn và đủ để resume nhanh.
- Log/changelog dài không được đưa vào bootstrap; chỉ đọc theo nhu cầu.

## 11. Chống nhớ sai / làm lại

Trước mọi thay đổi quan trọng, phải trả lời được từ nguồn đã kiểm tra:

- Đang ở task nào?
- Bước cuối đã hoàn thành là gì?
- Bước tiếp theo là gì?
- Việc gì cấm làm lại?
- Repo/branch/môi trường nào đang được phép?
- Nếu tác vụ phụ thuộc public version: beta/stable live thực tế hiện là gì và đã được xác minh chưa?

Nếu dữ liệu trong chat mâu thuẫn với checkpoint cũ, ưu tiên chỉ thị mới rõ ràng của người dùng cho mục tiêu mới, nhưng phải ghi nhận sự thay đổi vào GitHub; không âm thầm chọn một phiên bản.

## 12. Nguyên tắc an toàn dữ liệu

- Không ghi secret/token/password vào repository.
- Không xóa/ghi đè dữ liệu ngoài phạm vi đã cho phép.
- Thao tác phá hủy phải có ủy quyền rõ ràng của người dùng.
- Không tự mở rộng phạm vi repo/service.

## 13. Quy tắc kết thúc lượt thực thi

Nếu đã thay đổi bất kỳ trạng thái nào, trước khi trả lời cuối cùng phải cố gắng checkpoint GitHub trong cùng lượt tool. Nếu nền tảng đã cắt quyền tool trước checkpoint, phải nói rõ checkpoint nào chưa ghi; lượt tiếp theo bắt đầu bằng xác minh thực tế thay vì dựa vào trí nhớ.