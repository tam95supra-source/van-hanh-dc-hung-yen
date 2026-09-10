# HANDOFF — PHIÊN CHAT MỚI

## Prompt copy

Tiếp tục dự án VẬN HÀNH DC HƯNG YÊN từ checkpoint GitHub, KHÔNG dựa vào trí nhớ của phiên chat cũ.

Trước khi làm bất kỳ việc gì:

1. Dùng GitHub connector đọc `AI_BOOTSTRAP.md`, `CURRENT_STATE.md`, `ops/ai/DECISIONS.md` và `ops/ai/TASK_LEDGER.md` trong repo `tam95supra-source/van-hanh-dc-hung-yen`.
2. Đọc `ops/setup/GOOGLE_SHEETS_MODEL_PICKPACK1291.md`.
3. Master Spec V2 + Runbook V2 (Owner có thể attach trong chat mới) là authority chi tiết. PICK PACK 1291 cũ chỉ được READ/REUSE có chọn lọc làm reference, không deploy/write/runtime fallback.
4. Không migrate dữ liệu Pick Pack cũ vì dữ liệu đó là test.
5. Không hỏi lại các vấn đề kiến trúc đã chốt. Hai điểm LAN feasibility và Free capacity phải giải bằng test thật.
6. Luôn phân tích việc nào chạy song song được; checkpoint GitHub sau mỗi atomic step/decision/test quan trọng.

Nhiệm vụ đầu tiên: tiếp tục `SETUP-001` — one-time service/permission setup. Kiểm tra trạng thái thực tế đã làm/chưa làm rồi bắt đầu từ bước chưa hoàn thành đầu tiên, không làm lại bước đã PASS.

Mục tiêu cuối SETUP-001:
- GitHub environments beta/stable + secrets/variables.
- Cloudflare scoped tokens/resources/domain setup.
- Google GCP/OAuth/Apps Script/Drive runtime roots.
- Google Sheets projection model sẵn cho cluster Pick Pack 1291.
- Android signing Beta/Stable.
- LAN Probe plan.

Sau SETUP-001: khóa P1 contracts rồi chạy song song Service/D1, Google projection/archive, Android shell, Web shell, LAN Probe/Agent và port nghiệp vụ Pick Pack 1291.

## Quy tắc resume

- Nếu checkpoint ghi `IN_PROGRESS`, xác minh kết quả trước khi chạy lại.
- Nếu Owner phải click/authorize một bước UI, hướng dẫn chính xác một bước/lần và lưu ID/result ngay sau khi hoàn thành.
- Không tạo lại OAuth/App Script/token/keystore nếu đã có và còn hợp lệ.
- Không mở thêm vòng hỏi kiến trúc trừ khi test thực tế hoặc một cluster mới làm lộ vấn đề chưa thể biết trước.