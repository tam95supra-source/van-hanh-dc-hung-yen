# Vận hành DC Hưng Yên

Dự án vận hành DC Hưng Yên.

- Tên sản phẩm: **Vận hành DC Hưng Yên**
- Domain chính: `vanhanhdchungyen.cc.cd`
- Canonical repository: `tam95supra-source/van-hanh-dc-hung-yen`
- OWNER: Nguyễn Văn Tâm
- Trạng thái hiện tại: **REBUILD / LOGIC + INFRASTRUCTURE SETUP**
- APK/signing/release: **DEFERRED theo lệnh OWNER**

## Project boundary

Dự án chỉ được đọc/ghi các resource được đăng ký trong `ops/PROJECT_RESOURCE_REGISTRY.json`.

Repo cũ `tam95supra-source/pick-pack-1291` là **READ_ONLY_REFERENCE**. Không được sửa, deploy, xóa hay sử dụng resource runtime của dự án cũ trong dự án này. Sau khi dự án mới hoàn tất và OWNER ra lệnh riêng, dự án cũ mới được retire/xóa.

## Dữ liệu Google

Google Drive root mới: `VẬN HÀNH DC HƯNG YÊN`.

- Dữ liệu dùng chung: danh sách nhân sự và các danh mục/cấu hình được OWNER chốt là dùng chung.
- Dữ liệu nghiệp vụ: tách theo `LAN Group` do SUPERADMIN chỉ định.
- User/Admin thuộc group nào thì nghiệp vụ, DO, biên bản, ảnh, lịch sử và projection Google Sheet đi đúng group đó.
- Không fallback sang Sheet/folder của group khác.

## Kiến trúc chốt

- Cloud: PDA/Web <> Service <> operational DB <> async Google projection.
- LAN: PDA/Web <> LAN master laptop <> local durable DB <> async Google projection.
- ADMIN được force LAN trong group được SUPERADMIN chỉ định.
- Sticky master; failover chỉ khi master thực sự mất authority; master cũ quay lại thành standby, không tự giành lại master.
- Offline hoàn toàn: PDA vẫn local-first làm nghiệp vụ; hiển thị cảnh báo chưa đồng bộ toàn hệ thống.
- Ảnh: Google Drive là durable store; service chỉ transport/cache/spool ngắn hạn.
- Mục tiêu quota: <= 50% free allocation; project-cache warn 75%, auto-evict 90% của project budget và chỉ với bản sao đã durable-confirmed.
