# CURRENT STATE — VẬN HÀNH DC HƯNG YÊN

- updated_at: 2026-09-08T12:26:00+07:00
- status: INFRASTRUCTURE_BOOTSTRAP
- owner: Nguyễn Văn Tâm
- canonical_repo: tam95supra-source/van-hanh-dc-hung-yen
- primary_domain: vanhanhdchungyen.cc.cd
- apk_signing_release: DEFERRED_BY_OWNER

## Completed

- GitHub repo mới tồn tại và ChatGPT connector đã quan sát admin/push access.
- Google Drive root mới: VẬN HÀNH DC HƯNG YÊN.
- Cây thư mục mới đã tạo: shared data / LAN Group business / group documents / logs / backups / exports / system.
- GSheet dùng chung mới đã tạo và đặt đúng folder.
- GSheet template nghiệp vụ LAN Group mới đã tạo và đặt đúng folder.
- Repo mới có PROJECT_BOUNDARY_POLICY + PROJECT_RESOURCE_REGISTRY + ARCHITECTURE_CURRENT + PERMISSION_MANIFEST.
- Repo PICK PACK 1291 bị khóa ở vai trò READ_ONLY_REFERENCE đối với dự án mới.

## Pending owner permission

- Cloudflare custom API token + account/zone IDs cần đưa vào GitHub Actions secrets.
- Google Cloud project mới + Drive/Sheets/Gmail APIs + runtime identity/OAuth.
- Apps Script project mới nếu giữ lớp compatibility/admin jobs.

## Next action

OWNER thực hiện one-time permission bootstrap theo `ops/PERMISSION_MANIFEST.json` và tài liệu hướng dẫn cấp quyền. Sau đó tiếp tục tự động provisioning Cloudflare Worker/D1, Google runtime, resource readback và CI bootstrap.
