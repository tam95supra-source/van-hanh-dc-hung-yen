# CURRENT STATE — VẬN HÀNH DC HƯNG YÊN

- updated_at: 2026-09-08T13:29:00+07:00
- status: PERMISSION_AUDIT_COMPLETE_AWAITING_OWNER_BOOTSTRAP
- owner: Nguyễn Văn Tâm
- canonical_repo: tam95supra-source/van-hanh-dc-hung-yen
- primary_domain: vanhanhdchungyen.cc.cd
- apk_signing_release: DEFERRED_BY_OWNER

## Completed

- GitHub repo mới tồn tại; ChatGPT connector đã readback `admin + push`.
- Google Drive root mới + cây folder dự án đã tạo.
- GSheet dùng chung và template LAN Group mới đã tạo; có 2 Sheet bootstrap cũ hơn đang giữ lại tạm để đối chiếu schema, chưa runtime và chưa xóa.
- `PROJECT_BOUNDARY` / resource registry / architecture mới đã tạo.
- PICK PACK 1291 bị khóa `READ_ONLY_REFERENCE`; cấm write/delete/deploy/runtime fallback.
- Đã audit implementation thật PICK PACK 1291 và ghi `ops/LEGACY_RESOURCE_AUDIT.json`.
- Permission manifest v3 đã chắt lọc lại từ audit, không còn suy từ tên provider/workflow.
- Cloudflare initial dependency: Worker + D1 + Durable Object + Account Analytics; không Zone/DNS/Workers Routes/Zone ID/R2/KV/Pages/Tunnel.
- Google initial dependency: Drive API + Sheets API + Gmail API trực tiếp bằng OWNER OAuth; Apps Script bị loại khỏi initial rebuild.
- Deno/Render/Turso cloud DR: DEFER; LAN + tested backup/restore là initial DR.

## Pending OWNER one-time permission bootstrap

Theo `ops/PERMISSION_MANIFEST.json` / `docs/PERMISSION_BOOTSTRAP_GUIDE.md`:

- Cloudflare: `Workers Scripts Edit`, `D1 Edit`, `Account Analytics Read`; `CF_API_TOKEN` + `CF_ACCOUNT_ID`.
- Google Cloud project mới: bật Drive API + Sheets API + Gmail API.
- OWNER OAuth: `drive` + `gmail.send`, offline refresh token; GitHub lưu Client ID variable, Client Secret + Refresh Token secrets.

Không tạo Apps Script, service account JSON, `CF_ZONE_ID`, DR-provider token hoặc Android signing ở giai đoạn này.

## Next action

OWNER hoàn tất checklist quyền 1-5. Sau đó CI tự provisioning/readback Worker+D1, Google direct integration, service/LAN secret material, quota guard, backup/export/restore test và resource registry. Không deploy/publish APK.
