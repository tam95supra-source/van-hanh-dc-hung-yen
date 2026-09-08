# CẤP QUYỀN MỘT LẦN — VẬN HÀNH DC HƯNG YÊN

Mục tiêu: OWNER làm **một lượt** để ChatGPT + GitHub Actions tiếp tục tự động hóa repo, Worker/D1, Google Drive/Sheets/Gmail/Apps Script. Không gửi secret trong chat.

## 1. GitHub — đã đủ quyền ChatGPT

Repo: `tam95supra-source/van-hanh-dc-hung-yen`

ChatGPT đã được kiểm tra có `admin + push`.

OWNER chỉ kiểm tra:

`Repo -> Settings -> Actions -> General`

- Actions permissions: **Allow all actions and reusable workflows**.
- Workflow permissions: **Read and write permissions**.
- Bật **Allow GitHub Actions to create and approve pull requests** nếu giao diện có mục này.

Không cần PAT GitHub riêng ở giai đoạn hiện tại.

---

## 2. Cloudflare — CHỈ 5 QUYỀN, KHÔNG CÓ ZONE ID

Vào:

`Cloudflare -> My Profile -> API Tokens -> Create Token -> Create Custom Token`

Tên token:

`van-hanh-dc-hung-yen-automation`

### Chọn chính xác 5 dòng Account permission

| Phạm vi | Permission | Mức | Dùng để |
|---|---|---|---|
| Account | **Workers Scripts** | **Edit** | tạo/sửa/deploy Worker, version, secret/binding, Durable Object, Custom Domain |
| Account | **D1** | **Edit** | tạo DB, migration, query/write, import/export/backup |
| Account | **Workers Tail** | **Read** | đọc log runtime |
| Account | **Account Settings** | **Read** | discovery/readback account cho CI/Wrangler |
| Account | **Account Analytics** | **Read** | đọc usage/analytics phục vụ quota guard |

### Resource scope

`Account Resources -> Include -> chọn đúng Cloudflare account đang dùng`

### KHÔNG thêm các quyền sau

- Zone
- DNS
- Workers Routes
- Workers CI
- R2
- KV
- Pages
- Tunnel
- Billing
- API Tokens

**Lý do:** dự án dùng Worker làm origin. Luồng đúng là **Workers Custom Domain**, không phải Workers Route. Cloudflare API gắn domain vào Worker chấp nhận `Workers Scripts Edit/Write`; `Workers Routes` chỉ dùng cho API `/zones/{zone_id}/workers/routes`. Vì account hiện chưa có Zone ID được xác minh cho `vanhanhdchungyen.cc.cd`, không được tự thêm Zone/DNS/Routes để “cho đủ”.

Sau khi tạo token:

### GitHub Actions Secret

`CF_API_TOKEN` = token vừa tạo

### GitHub Actions Variable

`CF_ACCOUNT_ID` = Account ID của Cloudflare

**Không tạo `CF_ZONE_ID`.**

Trong giai đoạn build, Worker có thể chạy/readback qua `workers.dev`. Khi DNS authority/domain được xác minh, hệ thống mới gắn `vanhanhdchungyen.cc.cd`. Nếu domain không nằm trong active Cloudflare zone thì Cloudflare không cho tạo Worker Custom Domain trên hostname đó; đây là điều kiện DNS/domain, không phải thiếu API permission.

---

## 3. Google Cloud — tạo đúng 1 project mới

Tạo project mới bằng tài khoản OWNER:

- Name: `Vận hành DC Hưng Yên`
- Project ID: ID mới duy nhất, không dùng project PICK PACK 1291.

Bật **4 API**:

1. Google Drive API
2. Google Sheets API
3. Gmail API
4. Apps Script API

Lưu 2 giá trị vào GitHub Actions Variables:

- `GOOGLE_CLOUD_PROJECT_ID`
- `GOOGLE_CLOUD_PROJECT_NUMBER`

---

## 4. Google OAuth OWNER — cấp một lần

Dự án dùng **OAuth của OWNER**, không dùng service account làm chủ dữ liệu My Drive. Google xác nhận service account không có storage quota và không phù hợp làm chủ file bền vững trong My Drive cá nhân; OAuth người dùng làm file thuộc OWNER và tính vào quota OWNER.

Vào `Google Auth Platform` của project mới.

### Branding / Audience

- App name: `Vận hành DC Hưng Yên`
- Support email: email OWNER
- Audience: **External** nếu dùng Gmail cá nhân
- Khi đã chuẩn bị dùng lâu dài: chuyển **In Production** trước khi lấy refresh token cuối cùng. Ở Testing, refresh token có thời hạn ngắn.

### Data Access — thêm chính xác 7 scope

```text
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/spreadsheets
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/script.projects
https://www.googleapis.com/auth/script.deployments
https://www.googleapis.com/auth/script.metrics
https://www.googleapis.com/auth/script.processes
```

Ý nghĩa:

- `drive`: tự động tạo/đọc/sửa/xóa folder, ảnh, backup, export trong Drive.
- `spreadsheets`: tạo/đọc/ghi GSheet dùng chung và từng LAN Group.
- `gmail.send`: chỉ gửi OTP/reset mail; **không đọc inbox**.
- `script.projects`: CI tạo/cập nhật Apps Script source/manifest.
- `script.deployments`: CI tạo/cập nhật deployment.
- `script.metrics`: đọc metrics Apps Script.
- `script.processes`: đọc trạng thái execution/process để giám sát lỗi.

Không cấp:

- `gmail.readonly`
- `gmail.modify`
- `https://mail.google.com/`

**Lưu ý bảo vệ:** scope `drive` về kỹ thuật có thể truy cập Drive của OWNER. Vì vậy runtime bắt buộc fail-closed bằng `DRIVE_ROOT_ID` + `PROJECT_RESOURCE_REGISTRY`; không được search tên và tự chọn resource ngoài `VẬN HÀNH DC HƯNG YÊN`.

---

## 5. Tạo OAuth Client + Refresh Token

`Google Auth Platform -> Clients -> Create Client -> Web application`

Name:

`VAN_HANH_DC_HUNG_YEN_AUTOMATION`

Authorized redirect URI:

```text
https://developers.google.com/oauthplayground
```

Sau khi tạo Client:

1. Mở Google OAuth Playground.
2. Bánh răng -> bật **Use your own OAuth credentials**.
3. Nhập Client ID + Client Secret vừa tạo.
4. Step 1: dán đủ **7 scope** ở mục 4.
5. `Authorize APIs` -> đăng nhập đúng tài khoản OWNER -> Allow.
6. Step 2 -> `Exchange authorization code for tokens`.
7. Copy **Refresh token**.

### GitHub Actions Secrets — đúng 3 Google secret

```text
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REFRESH_TOKEN
```

Không cần:

- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `GMAIL_REFRESH_TOKEN` riêng

Một refresh token này đã chứa các scope đã authorize.

---

## 6. Google Apps Script

Tạo project mới:

`VẬN HÀNH DC HƯNG YÊN - SYSTEM`

Trong Apps Script:

`Project Settings -> Google Cloud Platform Project -> Change project`

Nhập **Google Cloud Project Number** ở mục 3.

Lấy `Script ID` và lưu GitHub Actions Variable:

`GAS_SCRIPT_ID`

Nếu source GAS dùng `UrlFetchApp`, `appsscript.json` sẽ thêm scope runtime:

```text
https://www.googleapis.com/auth/script.external_request
```

Scope này thuộc manifest của Apps Script; OWNER không phải tạo thêm GitHub secret.

---

## 7. DANH SÁCH CUỐI CÙNG PHẢI CÓ TRONG GITHUB

### Secrets

```text
CF_API_TOKEN
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REFRESH_TOKEN
```

### Variables

```text
CF_ACCOUNT_ID
GOOGLE_CLOUD_PROJECT_ID
GOOGLE_CLOUD_PROJECT_NUMBER
GAS_SCRIPT_ID
```

### Không có

```text
CF_ZONE_ID
GOOGLE_SERVICE_ACCOUNT_JSON
GMAIL_REFRESH_TOKEN
```

Drive root ID, Sheet IDs, folder IDs và domain lấy từ `ops/PROJECT_RESOURCE_REGISTRY.json`, không nhập lặp vào GitHub thành nguồn authority thứ hai.

---

## 8. CHECKLIST OWNER — 7 VIỆC

1. GitHub Actions = `Read and write permissions` (+ cho Actions tạo PR nếu có lựa chọn).
2. Tạo Cloudflare token **đúng 5 Account permissions** ở mục 2; lưu `CF_API_TOKEN` + `CF_ACCOUNT_ID`.
3. Tạo Google Cloud project mới.
4. Bật đúng Drive + Sheets + Gmail + Apps Script API.
5. Google Auth Platform: thêm đúng **7 OAuth scopes** ở mục 4; cấu hình Audience/Publishing.
6. Tạo OAuth Web Client + lấy Refresh Token; lưu đúng 3 Google secrets.
7. Tạo Apps Script project mới, link GCP Project Number và lưu `GAS_SCRIPT_ID`.

OWNER báo `1-7 OK`; không gửi token/secret value trong chat.

Sau 1-7 OK, GitHub Actions có đủ credential để AI/CI tiếp tục provisioning Worker/D1, deploy/readback, Google Drive/Sheets/Gmail/GAS, quota monitoring và backup/restore theo `PROJECT_BOUNDARY`.

## Đã đối chiếu tài liệu chính thức 08/09/2026

- Cloudflare API token permissions: https://developers.cloudflare.com/fundamentals/api/reference/permissions/
- Worker Create/Deploy: https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/methods/create/
- Worker Attach Domain: https://developers.cloudflare.com/api/resources/workers/subresources/domains/methods/update/
- Workers Routes API: https://developers.cloudflare.com/api/resources/workers/subresources/routes/methods/create/
- Workers Custom Domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- D1 Create/List/Query: https://developers.cloudflare.com/api/resources/d1/
- Google Drive ownership/service accounts: https://developers.google.com/workspace/drive/api/guides/about-shareddrives
- Google Drive file ownership: https://developers.google.com/workspace/drive/api/guides/create-file
- Gmail scope `gmail.send`: https://developers.google.com/resources/api-libraries/documentation/gmail/v1/java/latest/com/google/api/services/gmail/GmailScopes.html
- Apps Script scopes: https://developers.google.com/resources/api-libraries/documentation/script/v1/java/latest/com/google/api/services/script/ScriptScopes.html
- Google OAuth Testing/Production behavior: https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification
