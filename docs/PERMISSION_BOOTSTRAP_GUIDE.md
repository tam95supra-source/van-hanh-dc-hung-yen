# HƯỚNG DẪN CẤP QUYỀN MỘT LẦN — VẬN HÀNH DC HƯNG YÊN

OWNER: Nguyễn Văn Tâm

Mục tiêu: cấp đủ quyền cần cho toàn vòng đời dự án ngay từ đầu, không xin quyền nhỏ giọt; vẫn giới hạn vào project/resource mới để tránh ảnh hưởng dự án khác.

> Không paste API token, private key, client secret, refresh token hoặc password vào chat, issue, commit, Google Sheet hoặc log.

## 1. GitHub — hiện đã đủ quyền ChatGPT cơ bản

Repo: `tam95supra-source/van-hanh-dc-hung-yen`

Đã quan sát connector ChatGPT có admin + push trên repo mới. Không cần cấp lại repo cho ChatGPT ở thời điểm này.

OWNER kiểm tra thêm một lần trong GitHub:

1. Mở repo mới.
2. `Settings` -> `Actions` -> `General`.
3. Ở `Workflow permissions`, chọn **Read and write permissions**.
4. Save.
5. `Settings` -> `Secrets and variables` -> `Actions`.
6. Sau các bước Cloudflare/Google bên dưới, thêm toàn bộ secret/variable một lượt.

### Repository secrets cần chuẩn bị

- `CF_API_TOKEN`
- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `GOOGLE_OAUTH_CLIENT_SECRET` (nếu Gmail OAuth dùng client secret)
- `GMAIL_REFRESH_TOKEN` (khi hoàn tất Gmail OAuth)

### Repository variables

- `CF_ACCOUNT_ID`
- `CF_ZONE_ID`
- `GOOGLE_CLOUD_PROJECT_ID`
- `PROJECT_ID=VAN_HANH_DC_HUNG_YEN`
- `PRIMARY_DOMAIN=vanhanhdchungyen.cc.cd`
- `DRIVE_ROOT_ID=19r3s_kTjzncRdzffNntcePW5YZQ5Dxuh`
- `SHARED_SHEET_ID=1Zaf48k1jAmmZDxQPdZMkXPgP_8BWScs4bF2nXt46lHM`
- `GROUP_TEMPLATE_SHEET_ID=1QKu5gdLoJlMay40Rn4fefsrV29GLjaEz3_sehaDoRBU`

GitHub secret value không thể đọc lại sau khi lưu; đây là hành vi đúng.

## 2. Cloudflare — tạo một token mới dành riêng dự án

Không dùng Global API Key.

1. Đăng nhập Cloudflare.
2. Vào **My Profile -> API Tokens** (hoặc Account API Tokens nếu account hỗ trợ và muốn service token không phụ thuộc user).
3. `Create Token` -> `Create Custom Token`.
4. Tên: `van-hanh-dc-hung-yen-deploy`.
5. Cấp các quyền sau.

### Account permissions

- `Workers Scripts` -> `Write`
- `Workers CI` -> `Write`
- `D1` -> `Write`
- `Workers Tail` -> `Read`
- `Account Settings` -> `Read`

### Zone permissions

- `Zone` -> `Read`
- `DNS` -> `Write`
- `Workers Routes` -> `Write`

### Resource scope

- Account Resources: chỉ account đang chứa dự án.
- Zone Resources: chỉ zone chứa `vanhanhdchungyen.cc.cd`.

Không cấp:
- Billing Write.
- API Tokens Write.
- quyền zone/account khác không liên quan.
- R2 Write ở giai đoạn đầu vì R2 chưa là core dependency.

6. Create token.
7. Copy token đúng một lần.
8. Mở GitHub repo mới -> `Settings -> Secrets and variables -> Actions -> New repository secret`.
9. Tạo `CF_API_TOKEN` và paste token vào đó.
10. Thêm `CF_ACCOUNT_ID` và `CF_ZONE_ID` ở tab **Variables**, không cần coi hai ID này là secret.

Sau bước này AI/CI có thể tự tạo Worker/D1 mới và cấu hình route/domain mới trong phạm vi token.

## 3. Google Cloud — tạo project mới nhưng dùng account Google hiện tại

Tạo Google Cloud project mới dành riêng dự án. Không tái sử dụng project GCP của PICK PACK 1291.

Tên hiển thị đề xuất: `Vận hành DC Hưng Yên`

Project ID: chọn ID mới hợp lệ và duy nhất, ví dụ `van-hanh-dc-hung-yen-2026` nếu tên ngắn đã có người dùng.

### Enable APIs một lần

Trong `APIs & Services -> Library`, bật:

- Google Drive API
- Google Sheets API
- Gmail API

Nếu sau này dùng API Google khác, chỉ thêm khi requirement mới thật sự cần; ba API trên là scope đã xác định hiện tại.

## 4. Google Service Account — Drive + Sheets runtime

Tạo service account mới trong GCP project mới, ví dụ:

`van-hanh-runtime`

Mục đích: Cloud Service/LAN sync worker thao tác Drive/Sheets của **project mới**.

### Tạo credential

1. `IAM & Admin -> Service Accounts`.
2. Create service account.
3. Không cần cấp Owner/Editor toàn GCP project nếu không cần.
4. Tạo JSON key cho service account để runtime ngoài Google Cloud có thể ký OAuth token.
5. Download file JSON một lần và giữ kín.
6. GitHub repo mới -> Actions secrets -> tạo `GOOGLE_SERVICE_ACCOUNT_JSON`, paste toàn bộ JSON vào secret.
7. Không commit file JSON.

### Share Drive root cho service account

Google Drive root dự án mới:
`VẬN HÀNH DC HƯNG YÊN`

Folder ID:
`19r3s_kTjzncRdzffNntcePW5YZQ5Dxuh`

1. Mở folder root.
2. Share.
3. Nhập email của service account vừa tạo.
4. Cấp **Editor**.
5. Không share toàn My Drive.

Quyền folder sẽ kế thừa xuống tài nguyên con. Runtime chỉ được resolve ID từ `PROJECT_RESOURCE_REGISTRY`.

### Runtime scopes

Drive/Sheets service identity sử dụng OAuth scopes cần thiết cho Drive/Sheets. Dù scope API có thể rộng để sửa file, ACL của service account chỉ nên cho thấy project root mới.

## 5. Gmail API — quyền gửi mail, không đọc inbox

Chức năng OTP/reset password chỉ cần gửi mail.

Scope mục tiêu:
`https://www.googleapis.com/auth/gmail.send`

Không cần `gmail.readonly`, `gmail.modify` hoặc quyền đọc hộp thư nếu requirement không đổi.

Với Gmail cá nhân, service account thông thường không tự impersonate mailbox. Vì vậy tạo OAuth client cho tài khoản Gmail OWNER và lấy refresh token send-only.

### OAuth consent

1. GCP project mới -> `Google Auth Platform` / `OAuth consent screen`.
2. App name: `Vận hành DC Hưng Yên`.
3. User support/developer contact: email OWNER.
4. Nếu ở Testing, thêm email OWNER vào Test users.
5. Scope: chỉ `gmail.send` cho chức năng gửi mail.

### OAuth client

1. `Credentials -> Create credentials -> OAuth client ID`.
2. Tạo client phù hợp flow lấy refresh token của backend.
3. Lưu Client ID; Client Secret là secret.
4. Sau khi OWNER authorize Gmail send, lưu refresh token vào GitHub secret `GMAIL_REFRESH_TOKEN`.
5. Lưu client secret vào `GOOGLE_OAUTH_CLIENT_SECRET` nếu implementation yêu cầu.

Không paste refresh token/client secret vào chat.

## 6. Google Apps Script — tạo project mới, không dùng GAS cũ

GAS không dùng làm hot path realtime. Chỉ giữ cho compatibility/admin/recovery job khi kiến trúc yêu cầu.

1. Mở `script.new` bằng account OWNER.
2. Tên project: `VẬN HÀNH DC HƯNG YÊN - SYSTEM`.
3. Trong Project Settings, liên kết với **Google Cloud project mới** ở trên.
4. Di chuyển Apps Script file vào folder `06_HỆ_THỐNG` của Drive mới nếu Drive UI cho phép.
5. Chưa deploy web app cho tới khi code/system contract được tạo.

Không dùng Script ID/deployment của PICK PACK 1291.

## 7. Google Drive/Sheets mới — đã tạo

Root:
- `VẬN HÀNH DC HƯNG YÊN`

Cây chính:
- `00_DỮ_LIỆU_DÙNG_CHUNG`
- `01_NGHIỆP_VỤ_THEO_LAN_GROUP`
- `02_ẢNH_VÀ_BIÊN_BẢN_THEO_GROUP`
- `03_LOG`
- `04_BACKUP`
- `05_XUẤT_DỮ_LIỆU`
- `06_HỆ_THỐNG`

GSheet mới:
- `DỮ LIỆU DÙNG CHUNG - VẬN HÀNH DC HƯNG YÊN`
- `MẪU NGHIỆP VỤ LAN GROUP - VẬN HÀNH DC HƯNG YÊN`

LAN Group thực tế sẽ được SUPERADMIN tạo/assign. Mỗi group sẽ có workbook + folder ảnh/biên bản riêng được đăng ký bằng ID.

## 8. Domain

Domain chính đã có:
`vanhanhdchungyen.cc.cd`

Không cần tạo account/domain mới.

Khi Cloudflare token PASS, CI sẽ tạo Worker mới và attach Custom Domain/route mới. Không reuse Worker của PICK PACK 1291.

Beta domain đề xuất giữ sẵn:
`beta.vanhanhdchungyen.cc.cd`

Chưa public Stable cho tới khi OWNER chốt release sau này.

## 9. Những thứ không thể hoặc không nên "tạo account mới" trong cùng mô hình

Các container/account sau được dùng chung nhưng resource bên trong tách mới:

- GitHub user account: dùng account hiện tại, repo mới.
- Cloudflare account: dùng account hiện tại, Worker/D1/resource mới.
- Cloudflare DNS zone chứa domain: dùng zone hiện tại; chỉ record/route dự án mới tách riêng.
- Google account / My Drive quota: dùng account hiện tại; folder/resource mới nhưng storage quota vẫn dùng chung account.
- Gmail mailbox/quota: dùng mailbox hiện tại; OAuth/GCP project mới nhưng mailbox quota không trở thành quota độc lập.
- Apps Script user quota: project GAS mới nhưng một số quota vẫn tính theo user/account.

Vì vậy xóa PICK PACK 1291 sau này có thể dọn resource và ngăn traffic cũ tiêu quota, nhưng không biến các quota cấp account/user thành quota mới.

## 10. Resource có thể tạo mới hoàn toàn song song

- GitHub repository: DONE.
- Google Drive project root: DONE.
- Google Sheets shared/template: DONE.
- Google Cloud project: PENDING OWNER.
- OAuth client: PENDING OWNER.
- Service account: PENDING OWNER.
- Apps Script project: PENDING OWNER.
- Cloudflare Worker: sẽ tự tạo sau CF token.
- Cloudflare D1 DB: sẽ tự tạo sau CF token.
- Cloudflare custom domain/route: sẽ tự cấu hình sau CF token.
- GitHub Actions workflow/CI: đang được bootstrap trong repo mới.
- LAN cluster/node identities: sẽ sinh trong quá trình build LAN control plane.
- Android signer/APK: DEFERRED theo lệnh OWNER.

## 11. PICK PACK 1291

Hiện tại:
- chỉ đọc tham khảo;
- cấm commit/push/delete/deploy;
- cấm dùng runtime resource cũ làm fallback;
- chưa xóa.

Chỉ sau dự án mới DONE + backup/readback/acceptance PASS + OWNER ra lệnh retire thì mới xóa project/resource cũ.

## 12. Khi OWNER hoàn tất quyền

OWNER chỉ cần báo các bước đã hoàn thành, không gửi secret value.

Tối thiểu cần xác nhận:
1. `CF_API_TOKEN` đã nằm trong GitHub Actions secret.
2. `CF_ACCOUNT_ID`, `CF_ZONE_ID` đã nằm trong GitHub variables.
3. Google Cloud project mới đã tạo + 3 API đã bật.
4. Service account đã tạo, JSON đã vào `GOOGLE_SERVICE_ACCOUNT_JSON`, và service account đã được Editor trên Drive root mới.
5. OAuth Gmail send-only đã tạo; refresh token/client secret đã vào GitHub secrets khi sẵn sàng.
6. Apps Script project mới đã tạo/link GCP project mới.

Sau đó AI/CI tiếp tục provisioning và verify tự động.

## Official references

- Cloudflare API token permissions: https://developers.cloudflare.com/fundamentals/api/reference/permissions/
- Cloudflare token creation: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
- Cloudflare D1 create: https://developers.cloudflare.com/d1/tutorials/build-a-comments-api/
- Cloudflare Workers Custom Domains: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- GitHub Actions secrets: https://docs.github.com/en/actions/concepts/security/secrets
- Google Drive API: https://developers.google.com/workspace/drive/api/
- Google Sheets API: https://developers.google.com/workspace/sheets/api/
- Gmail API: https://developers.google.com/workspace/gmail/api/
