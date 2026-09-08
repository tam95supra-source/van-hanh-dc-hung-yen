# CẤP QUYỀN MỘT LẦN — VẬN HÀNH DC HƯNG YÊN

Mục tiêu: sau checklist này, ChatGPT + GitHub Actions có đủ quyền để tiếp tục tự động hóa repo, Cloudflare, Google Drive/Sheets/Gmail/Apps Script của dự án mới. Không cấp nhỏ giọt.

**Không gửi token/secret vào chat. Chỉ lưu trong GitHub Actions Secrets.**

## 1. GitHub — gần như đã DONE

Repo: `tam95supra-source/van-hanh-dc-hung-yen`

ChatGPT hiện đã có `admin + push` trên repo mới.

OWNER chỉ cần kiểm tra:

`Repo -> Settings -> Actions -> General`

- Actions permissions: **Allow all actions and reusable workflows**.
- Workflow permissions: **Read and write permissions**.
- Bật **Allow GitHub Actions to create and approve pull requests** nếu có checkbox này.

Không cần tạo PAT GitHub riêng ở giai đoạn này. `GITHUB_TOKEN` của workflow sẽ dùng cho commit/release/PR trong chính repo.

## 2. Cloudflare — tạo đúng 1 API token

Vào `Cloudflare -> My Profile -> API Tokens -> Create Token -> Create Custom Token`.

Tên: `van-hanh-dc-hung-yen-automation`

### Account permissions

| Permission | Level | Mục đích |
|---|---|---|
| Workers Scripts | Write | tạo/sửa/deploy Worker, Durable Object, Custom Domain |
| D1 | Write | tạo DB, migration, query/write, backup/restore automation |
| Workers Tail | Read | đọc log runtime |
| Account Settings | Read | discovery/readback account |
| Account Analytics | Read | đọc Workers/D1 usage để quota guard <=50% |

### Zone permissions

| Permission | Level | Mục đích |
|---|---|---|
| Zone | Read | resolve/verify zone |
| DNS | Write | tạo/sửa DNS record khi cần |
| Workers Routes | Write | route Worker nếu dùng route thay/custom domain |

### Resource scope

- Account Resources: **Include -> đúng Cloudflare account đang dùng**.
- Zone Resources: **Include -> đúng zone chứa `vanhanhdchungyen.cc.cd`**.

Không cấp Billing Write, API Tokens Write, R2 Write, KV Write nếu chưa có requirement mới.

Sau khi tạo token:

`GitHub repo -> Settings -> Secrets and variables -> Actions -> Secrets`

Tạo:

- `CF_API_TOKEN` = token vừa tạo.

Tab Variables tạo:

- `CF_ACCOUNT_ID`
- `CF_ZONE_ID`

Lưu ý: `Workers Scripts Write` và `D1 Write` là account-scoped, Cloudflare không khóa cứng được riêng từng Worker/D1 trong cùng account. Vì vậy repo có `PROJECT_BOUNDARY` fail-closed để cấm đụng PICK PACK 1291.

## 3. Google Cloud — tạo 1 project mới

Tạo project mới bằng tài khoản OWNER.

Tên: `Vận hành DC Hưng Yên`

Project ID: chọn ID duy nhất, ví dụ `van-hanh-dc-hung-yen-2026`.

Bật **4 API**:

1. Google Drive API
2. Google Sheets API
3. Gmail API
4. Apps Script API

Không dùng Google Cloud project của PICK PACK 1291.

## 4. Google OAuth — cấp toàn bộ scope cần một lần

**Không dùng Service Account làm runtime Drive chính.** Runtime dùng OAuth của OWNER để file/ảnh tạo ra thuộc Google Drive của OWNER và dùng đúng quota Drive của OWNER.

Vào `Google Auth Platform` của project mới.

### Branding / Audience

- App name: `Vận hành DC Hưng Yên`
- User support email: email OWNER
- Audience: External nếu tài khoản cá nhân.
- Publishing status: **In Production** trước khi lấy refresh token dùng lâu dài. Testing có refresh token thời hạn ngắn.
- Nếu Google hiện cảnh báo app chưa verify và đây là personal-use app dưới 100 users, OWNER có thể tiếp tục authorize cho tài khoản của mình theo chính sách Google hiện hành.

### Data Access — thêm chính xác 5 OAuth scopes

```text
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/spreadsheets
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/script.projects
https://www.googleapis.com/auth/script.deployments
```

Ý nghĩa:

- `drive`: tạo/đọc/sửa/xóa folder, ảnh, file, backup trong Drive. Đây là scope rộng cần thiết cho backend tự quản lý cây thư mục dự án không qua Google Picker; code bắt buộc fence bằng `DRIVE_ROOT_ID`.
- `spreadsheets`: đọc/ghi/tạo/cập nhật các GSheet dùng chung và GSheet theo LAN Group.
- `gmail.send`: **chỉ gửi mail**, không đọc inbox, không sửa/xóa mail.
- `script.projects`: tạo và cập nhật source/manifests của Apps Script.
- `script.deployments`: tạo/cập nhật deployment Apps Script.

Không cấp: `gmail.readonly`, `gmail.modify`, `mail.google.com`.

## 5. Tạo OAuth Client + refresh token một lần

Trong `Google Auth Platform -> Clients`:

1. `Create Client` -> **Web application**.
2. Name: `VAN_HANH_DC_HUNG_YEN_AUTOMATION`.
3. Authorized redirect URI thêm:

```text
https://developers.google.com/oauthplayground
```

4. Create.
5. Ghi lại `Client ID` và `Client Secret`.

Mở Google OAuth Playground:

1. Bấm biểu tượng bánh răng.
2. Bật **Use your own OAuth credentials**.
3. Nhập Client ID + Client Secret của project mới.
4. Step 1: dán cả 5 scope ở mục 4.
5. `Authorize APIs` -> đăng nhập đúng tài khoản OWNER -> Allow.
6. Step 2 -> `Exchange authorization code for tokens`.
7. Copy **Refresh token**.

GitHub Actions Secrets tạo đúng 3 secret:

- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REFRESH_TOKEN`

Không cần `GOOGLE_SERVICE_ACCOUNT_JSON` và không cần `GMAIL_REFRESH_TOKEN` riêng: cùng refresh token đã chứa toàn bộ 5 scope.

GitHub Actions Variables:

- `GOOGLE_CLOUD_PROJECT_ID`
- `GOOGLE_CLOUD_PROJECT_NUMBER`

## 6. Google Drive / Sheets — quyền thực tế

Drive root mới đã tạo:

`VẬN HÀNH DC HƯNG YÊN`

Runtime OAuth là tài khoản OWNER nên không cần share folder cho service account.

Luật runtime bắt buộc:

- Chỉ resolve/read/write file nằm trong `PROJECT_RESOURCE_REGISTRY` và dưới `DRIVE_ROOT_ID` của dự án mới.
- Không search theo tên rồi tự chọn file.
- Không fallback sang Drive/Sheet PICK PACK 1291.
- LAN Group nào chỉ ghi workbook/folder của LAN Group đó.

## 7. Google Apps Script — tạo 1 lần để CI quản lý tiếp

Tạo `script.new` bằng tài khoản OWNER.

Tên: `VẬN HÀNH DC HƯNG YÊN - SYSTEM`.

Trong `Project Settings`:

- `Google Cloud Platform (GCP) Project` -> Change project.
- Nhập **Project number** của Google Cloud project mới.

Lấy `Script ID`, lưu vào GitHub Actions Variable:

- `GAS_SCRIPT_ID`

Apps Script manifest khi build sẽ được CI quản lý. Nếu GAS dùng `UrlFetchApp`, manifest sẽ có thêm runtime scope:

```text
https://www.googleapis.com/auth/script.external_request
```

Các scope Drive/Sheets/Gmail dùng trong GAS sẽ bám đúng nghiệp vụ cần thiết; không dùng `mail.google.com`.

Sau lần deploy đầu, CI sẽ ghi `GAS_DEPLOYMENT_ID` vào registry/variable nếu cần.

## 8. Secrets / Variables cuối cùng cần có

### GitHub Actions Secrets

```text
CF_API_TOKEN
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REFRESH_TOKEN
```

### GitHub Actions Variables

```text
CF_ACCOUNT_ID
CF_ZONE_ID
GOOGLE_CLOUD_PROJECT_ID
GOOGLE_CLOUD_PROJECT_NUMBER
GAS_SCRIPT_ID
```

Các ID Drive/Sheet/domain/resource khác lấy từ `ops/PROJECT_RESOURCE_REGISTRY.json`; không nhân bản thành nhiều nguồn authority.

## 9. ChatGPT — quyền hiện tại

- GitHub connector: **PASS — admin + push repo mới**.
- Google Drive connector: **PASS — đã tạo folder/Sheet mới**.
- Cloudflare: không có connector provisioning phù hợp; GitHub Actions dùng `CF_API_TOKEN` để tự động hóa.
- Google runtime: GitHub Actions dùng 3 OAuth secrets ở trên.

OWNER không cần gửi bất kỳ secret nào cho ChatGPT.

## 10. Checklist OWNER — chỉ cần làm 8 việc

1. GitHub Actions = `Read and write permissions` + cho phép Actions tạo PR.
2. Tạo Cloudflare token đúng 8 permission ở mục 2; lưu `CF_API_TOKEN`, `CF_ACCOUNT_ID`, `CF_ZONE_ID`.
3. Tạo Google Cloud project mới.
4. Bật Drive API + Sheets API + Gmail API + Apps Script API.
5. Google Auth Platform: thêm đúng 5 OAuth scope và chuyển `In Production`.
6. Tạo OAuth Web Client + lấy refresh token qua OAuth Playground; lưu 3 Google secrets.
7. Tạo Apps Script project mới, link đúng Google Cloud Project Number, lưu `GAS_SCRIPT_ID`.
8. Báo `1-8 OK`; không gửi giá trị token/secret.

Sau 1-8 OK, AI/CI có thể tiếp tục tự tạo Worker/D1, deploy service, quản lý Google Drive/Sheets/GAS, quota readback, backup/restore và các resource mới theo PROJECT_BOUNDARY mà không cần xin quyền lặt vặt.

## Nguồn chính thức đã rà 08/09/2026

- Cloudflare API token permissions: https://developers.cloudflare.com/fundamentals/api/reference/permissions/
- Cloudflare D1 create permission: https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/create/
- Cloudflare Worker custom domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- Cloudflare Analytics token: https://developers.cloudflare.com/analytics/graphql-api/getting-started/authentication/api-token-auth/
- Google Drive API: https://developers.google.com/workspace/drive/api/
- Google Sheets API: https://developers.google.com/workspace/sheets/api/
- Gmail OAuth scopes: https://developers.google.com/resources/api-libraries/documentation/gmail/v1/java/latest/com/google/api/services/gmail/GmailScopes.html
- Apps Script OAuth scopes: https://developers.google.com/resources/api-libraries/documentation/script/v1/java/latest/com/google/api/services/script/ScriptScopes.html
- Google OAuth testing/production token behavior: https://developers.google.com/health/setup
- GitHub Actions secrets: https://docs.github.com/en/actions/concepts/security/secrets
