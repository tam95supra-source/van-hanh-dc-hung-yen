# PROJECT BOUNDARY POLICY — VẬN HÀNH DC HƯNG YÊN

OWNER: Nguyễn Văn Tâm
Status: MANDATORY / FAIL-CLOSED

## 1. Scope duy nhất

Mọi runtime, CI, migration, backup, restore, sync và AI automation của dự án chỉ được thao tác các resource đã đăng ký ACTIVE trong `ops/PROJECT_RESOURCE_REGISTRY.json`.

Không có trong registry = không được đọc/ghi/sync/deploy/xóa.

## 2. Repo cũ

`tam95supra-source/pick-pack-1291` chỉ là `READ_ONLY_REFERENCE`.

Được phép:
- đọc logic, schema, tab/header, invariant, test và tài liệu để tham khảo khi rebuild;
- đối chiếu hành vi đã OWNER nghiệm thu.

Cấm:
- commit/push/update/delete;
- deploy/release/rerun thay đổi runtime;
- dùng DB/Sheet/folder/service/domain/resource cũ làm fallback runtime của dự án mới;
- ghi dữ liệu mới vào resource cũ.

Chỉ khi dự án mới DONE và OWNER có lệnh retire/xóa riêng mới xử lý tài nguyên cũ.

## 3. Không tìm resource theo tên gần giống

Cấm tự động:
- search Drive rồi chọn file vì tên giống;
- chọn Sheet theo title thay vì registered file ID;
- chọn database/service/domain theo prefix gần giống;
- fallback sang project/resource khác khi resource mới lỗi;
- dùng chat/memory làm runtime authority.

Runtime phải resolve theo registered ID/config canonical.

## 4. Google Drive / Sheets

Root duy nhất: resource `google_drive.root` trong registry.

Dữ liệu dùng chung chỉ nằm trong resource `shared_data` và chỉ gồm dataset được policy cho phép dùng chung.

Dữ liệu nghiệp vụ phải route:
`authenticated user -> assigned LAN Group -> registered group resource -> exact workbook/folder IDs`.

Nếu user chưa có group, group disabled, hoặc resource group không khớp registry: FAIL CLOSED.
Không được fallback sang group khác.

## 5. LAN Group

LAN Group do SUPERADMIN chỉ định membership USER/ADMIN.

ADMIN được bật/force LAN trong group được SUPERADMIN giao.
Mỗi group có authority state riêng nhưng tại một thời điểm chỉ có một writer authority hợp lệ.

SSID, Wi-Fi name, subnet hoặc tên bộ phận không phải identity của group.

## 6. Secrets

Token, OAuth credential, API secret, signing key, password và private key không được lưu plaintext trong repo, Sheet, log hoặc tài liệu public.
Registry chỉ lưu reference/secret-name/secret-store location, không lưu secret value.

## 7. Import / migration

Dữ liệu ngoài project chỉ được đi qua migration/import job có:
- nguồn được OWNER/manifest cho phép;
- source resource ID cố định;
- read-only source;
- target resource ID đã registered;
- validation + count/checksum/readback;
- audit receipt.

Không tự crawl hoặc nhập dữ liệu từ resource lân cận.

## 8. Backup

Backup chỉ được tạo từ registered resource.
Backup chỉ PASS sau restore thử + compare/checksum.
Replica/cache/fallback không tự được coi là backup.

## 9. Deployment bootstrap

Trước startup/deploy production, guard phải xác minh tối thiểu:
- project_id;
- canonical repo;
- environment;
- registered service/database IDs;
- Drive root ID;
- per-group workbook/folder IDs;
- authority generation/epoch khi áp dụng.

Bất kỳ mismatch nào => hard FAIL trước write.
