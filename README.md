# VẬN HÀNH DC HƯNG YÊN

Repository chính thức cho dự án **VẬN HÀNH DC HƯNG YÊN**.

## Trạng thái hiện tại

- Giai đoạn: `SETUP_READY`.
- Code status: `APPROVED_FOR_SETUP_AND_IMPLEMENTATION`.
- Branch làm việc mặc định: `main`.
- Nguồn trạng thái công việc: `CURRENT_STATE.md`.
- Quy tắc AI bắt buộc: `AI_BOOTSTRAP.md`.
- Nền tảng phục vụ toàn DC; cluster đầu tiên triển khai Beta là **Pick Pack 1291**.
- PICK PACK 1291 cũ là **READ-ONLY strong reference**; không migrate dữ liệu test cũ và không runtime fallback.

## Thứ tự đọc tối thiểu cho AI

1. `AI_BOOTSTRAP.md`
2. `CURRENT_STATE.md`
3. Các file trong `read_next`.
4. Khi làm Google/Sheets/Pick Pack projection: `ops/setup/GOOGLE_SHEETS_MODEL_PICKPACK1291.md`.
5. Khi mở phiên chat mới: `ops/ai/HANDOFF_NEXT_CHAT.md`.

Không dùng lịch sử chat hay trí nhớ mô hình làm nguồn trạng thái chính thức.