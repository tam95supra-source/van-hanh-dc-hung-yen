# CẤP QUYỀN MỘT LẦN — VẬN HÀNH DC HƯNG YÊN

Bản này thay thế toàn bộ hướng dẫn quyền trước. Nguồn quyết định: `ops/LEGACY_RESOURCE_AUDIT.json` + implementation thật của PICK PACK 1291 + kiến trúc rebuild mới + tài liệu provider hiện hành.

**Không gửi token/client secret/refresh token vào chat.**

## 1. GitHub — không cần tạo PAT

Repo: `tam95supra-source/van-hanh-dc-hung-yen`.

ChatGPT đã được readback có `admin + push`.

OWNER chỉ kiểm tra `Repo -> Settings -> Actions -> General`:

- Actions được bật.
- Workflow permissions: **Read and write permissions** để các workflow tương lai có thể cập nhật canonical state khi workflow đó khai báo `contents: write`.

Workflow vẫn phải khai báo quyền riêng trong YAML; không dùng PAT riêng ở giai đoạn này.

## 2. Cloudflare — 1 token, đúng 3 quyền

Vào `Cloudflare -> My Profile -> API Tokens` (user token) hoặc `Manage Account -> API Tokens` nếu account token hỗ trợ các endpoint cần dùng -> `Create Token -> Custom Token`.

Tên: `van-hanh-dc-hung-yen-automation`.

Chọn **Account permissions**:

| Type | Permission | Level | Vì sao cần |
|---|---|---|---|
| Account | **Workers Scripts** | **Edit** | tạo/deploy/readback Worker, Durable Object, static assets, cron, settings, secrets, tail, workers.dev, Worker Custom Domain |
| Account | **D1** | **Edit** | tạo/list/query/migrate/export/import/delete D1 mới + backup/restore |
| Account | **Account Analytics** | **Read** | đọc `rowsRead`, `rowsWritten`, storage/usage để quota guard giữ dự án <=50% free allocation |

**Account Resources:** Include -> chọn đúng account Cloudflare dùng cho dự án.

Không thêm: Zone, DNS, Workers Routes, Workers Tail riêng, Account Settings riêng, Workers CI, R2, KV, Pages, Tunnel, Billing, API Tokens.

Lý do:
- implementation cũ gắn domain qua account-level `/accounts/{account}/workers/domains`, không dùng Zone ID;
- API Attach Domain hiện chấp nhận `Workers Scripts Write`;
- Workers Scripts Write cũng chấp nhận cho Worker settings/list/tail APIs;
- `D1 Write` bao phủ vòng đời D1 cần cho provisioning/restore;
- `Account Analytics Read` là quyền riêng duy nhất thêm vào vì OWNER yêu cầu quota guard <=50%.

Sau khi tạo:

**GitHub Secret**
- `CF_API_TOKEN`

**GitHub Variable**
- `CF_ACCOUNT_ID`

Lấy Account ID: Cloudflare `Account Home -> Search -> Copy account ID`, hoặc `Workers & Pages -> Account Details`.

**Không tạo `CF_ZONE_ID`.** Build/readback trước bằng `workers.dev`; chỉ attach `vanhanhdchungyen.cc.cd` khi hostname được Cloudflare xác nhận đủ điều kiện.

## 3. Google Cloud — chỉ 3 API

Tạo project Google Cloud mới cho `Vận hành DC Hưng Yên`; không dùng project PICK PACK 1291.

Enable chính xác:
1. **Google Drive API**
2. **Google Sheets API**
3. **Gmail API**

**Không bật Apps Script API** ở rebuild ban đầu.

Lưu `Project ID` vào GitHub Variable:
- `GOOGLE_CLOUD_PROJECT_ID`

## 4. Google OAuth OWNER — chỉ 2 scope

Tạo OAuth client cho tài khoản OWNER. Runtime cần chạy khi OWNER không mở trình duyệt nên phải lấy **offline refresh token**.

### Google Auth Platform
- App name: `Vận hành DC Hưng Yên`
- Audience: External nếu dùng Gmail cá nhân.
- Trước khi lấy refresh token dùng lâu dài: **Publishing status = In production**. Ở `Testing`, authorization/refresh token cho các scope này hết hạn sau 7 ngày.

### Data Access — thêm chính xác

```text
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/gmail.send
```

Giải thích:
- `drive`: backend quản lý tự động cây Drive dự án đã được tạo sẵn; Google Sheets API cũng chấp nhận scope `drive`, nên **không cần thêm `spreadsheets`**.
- `gmail.send`: chỉ gửi OTP/reset mail; không đọc inbox.

Không thêm: `spreadsheets`, `gmail.readonly`, `gmail.modify`, `mail.google.com`, bất kỳ scope Apps Script nào.

**Lưu ý:** `drive` là restricted scope và về kỹ thuật cho OAuth token quyền Drive rộng. Dự án bù bằng `PROJECT_BOUNDARY` fail-closed: runtime chỉ được dùng `DRIVE_ROOT_ID` và các resource ID đã đăng ký; không được search tên rồi tự chọn file ngoài dự án. Nếu Google yêu cầu verification cho restricted scope trước khi cho phép mô hình vận hành lâu dài, xử lý verification; không quay lại GAS/service account để né quyền.

## 5. Tạo OAuth Client + Refresh Token

`Google Auth Platform -> Clients -> Create Client -> Web application`.

Name: `VAN_HANH_DC_HUNG_YEN_AUTOMATION`.

Authorized redirect URI:

```text
https://developers.google.com/oauthplayground
```

Sau đó:
1. Mở Google OAuth Playground.
2. Settings -> bật **Use your own OAuth credentials**.
3. Nhập Client ID + Client Secret.
4. Step 1: authorize đúng 2 scope ở mục 4.
5. Bảo đảm flow yêu cầu offline access; `access_type=offline`, `prompt=consent`.
6. Đăng nhập đúng tài khoản OWNER và Allow.
7. Exchange authorization code for tokens.
8. Copy Refresh Token vào GitHub Secret.

### GitHub cần có cuối cùng

**Secrets**
```text
CF_API_TOKEN
GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REFRESH_TOKEN
```

**Variables**
```text
CF_ACCOUNT_ID
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_CLOUD_PROJECT_ID
```

Không có:
```text
CF_ZONE_ID
GOOGLE_SERVICE_ACCOUNT_JSON
GAS_SCRIPT_ID
GAS_DEPLOYMENT_ID
DENO_DEPLOY_TOKEN
RENDER_API_KEY
TURSO_API_TOKEN
R2/KV credentials
Android signing secrets
```

## 6. Sau khi OWNER cấp xong

AI/CI tự làm phần còn lại:
- verify token scopes bằng API readback;
- tạo D1 mới;
- migrate schema;
- deploy Worker + Durable Object;
- sinh service auth/session + LAN enrollment/fencing secrets vào secret store;
- đưa Google OAuth secrets cần thiết sang Worker secret store;
- triển khai direct Sheets projection theo `LAN_GROUP`;
- triển khai Drive ảnh/biên bản;
- triển khai Gmail OTP;
- tạo quota guard + backup/export/restore test;
- đăng ký resource IDs vào `PROJECT_RESOURCE_REGISTRY`.

## 7. Vì sao không còn Apps Script / Deno / Render / Turso

Audit code cũ cho thấy:
- GAS auth/OTP -> thay bằng Cloud/LAN auth + Gmail API;
- GAS Stable Sheet bridge -> thay bằng direct Sheets API;
- GAS fallback web app -> thay bằng LAN + PDA offline local;
- Deno/Render/Turso -> cloud DR cũ; kiến trúc mới dùng LAN + backup/restore tested, nên DEFER;
- R2 trong workflow Beta127 là Requirement R2, không phải Cloudflare R2 Storage.

Không cấp quyền cho một provider chỉ vì dự án cũ từng có nó.

## Checklist OWNER — 5 việc

1. GitHub Actions được bật; Workflow permissions = `Read and write permissions`.
2. Cloudflare: tạo token đúng **3 quyền**; lưu `CF_API_TOKEN` + `CF_ACCOUNT_ID`.
3. Google Cloud: tạo project mới; bật đúng **Drive + Sheets + Gmail API**; lưu `GOOGLE_CLOUD_PROJECT_ID`.
4. Google Auth Platform: In production; thêm đúng **2 scope** `drive` + `gmail.send`; tạo Web OAuth Client.
5. Lấy offline Refresh Token; lưu `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN` đúng Secret/Variable như trên.

Xong báo `1-5 OK`; không gửi secret value trong chat.
