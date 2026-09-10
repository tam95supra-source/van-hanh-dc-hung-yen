# DECISIONS

## D-001 — Repository chính thức

Status: `ACTIVE`

Repository ghi/sửa/deploy chính thức:
`tam95supra-source/van-hanh-dc-hung-yen` / branch `main`.

## D-002 — Không phụ thuộc trí nhớ chat

Status: `ACTIVE`

Trạng thái công việc phải checkpoint lên GitHub. Trí nhớ AI/lịch sử chat không phải nguồn sự thật độc lập.

## D-003 — Startup tối giản

Status: `ACTIVE`

Mọi lượt thực thi đọc `AI_BOOTSTRAP.md` + `CURRENT_STATE.md` trước; chỉ đọc thêm file cần thiết hoặc được `read_next` chỉ định.

## D-004 — Checkpoint liên tục

Status: `ACTIVE`

Checkpoint sau atomic step, quyết định mới, kết quả test/CI quan trọng, trước thao tác dài và khi chuẩn bị dừng. Mục tiêu <=15 phút; soft work batch limit 18 phút.

## D-005 — Chưa chốt code nghiệp vụ

Status: `SUPERSEDED_BY_D-010`

Quyết định cũ giữ để biết lịch sử. OWNER đã chốt đủ kiến trúc để chuyển sang setup/build.

## D-006 — Phạm vi dịch vụ

Status: `SUPERSEDED_BY_D-011`

Phạm vi dịch vụ không còn PENDING; đã được OWNER duyệt theo Master Spec/Runbook.

## D-007 — Ưu tiên thực thi song song an toàn

Status: `ACTIVE`

Trước khi thực thi phải phân tích dependency. Các bước độc lập, không tranh chấp shared state và không có thứ tự bắt buộc phải được ưu tiên chạy song song. Các bước có dependency/shared mutable state/race risk phải chạy tuần tự.

## D-008 — Live beta/stable phải phản ánh public thực tế mới nhất

Status: `ACTIVE`

Sau deploy/promote/rollback phải xác minh public thực tế rồi cập nhật `live_beta`/`live_stable`; nếu chưa xác minh ghi `UNVERIFIED`/`UNKNOWN`.

## D-009 — Changelog version là lịch sử bất biến

Status: `ACTIVE`

Mọi version đã public/phát hành phải giữ changelog lâu dài trong repo; không xóa/ghi đè lịch sử. Correction phải ghi rõ.

## D-010 — Scope nền tảng toàn DC

Status: `ACTIVE`

VẬN HÀNH DC HƯNG YÊN là nền tảng cho toàn DC. Cluster được hiểu là team/operational boundary có `cluster_id`; feature và permission được bật/cấp linh hoạt theo cluster + action, không hard-code một cluster = một nghiệp vụ.

## D-011 — Phạm vi dịch vụ được phép

Status: `ACTIVE`

Được thiết kế/triển khai trong phạm vi: GitHub repo chính; Cloudflare Workers/D1/Durable Objects/R2 optional/DNS custom domain; Google Drive/Sheets/Apps Script/OAuth; Android APK; Windows LAN Agent/local DB. Secret phải ở secret store.

## D-012 — PICK PACK 1291 là read-only strong reference

Status: `ACTIVE`

OWNER cho phép đọc/reuse có chọn lọc source, logic, UI, test và nghiệp vụ PICK PACK 1291 cho cluster Pick Pack 1291. Không được write/deploy/delete/reference-project hoặc runtime fallback sang tài nguyên cũ nếu không có chỉ thị mới. Master Spec VHDCHY luôn thắng khi mâu thuẫn.

## D-013 — Cluster đầu tiên và rollout

Status: `ACTIVE`

Build ổn định `Beta Pick Pack 1291` trên DC Core mới -> test/stress/soak -> OWNER acceptance -> `Stable Pick Pack 1291`. Sau đó tiếp tục Beta cluster khác như Invent 1291 trong khi Stable Pick Pack tiếp tục chạy.

## D-014 — Không migrate dữ liệu Pick Pack cũ

Status: `ACTIVE`

Dữ liệu employee/resource/history của project Pick Pack 1291 cũ là test data, không migrate sang VHDCHY. Beta mới dùng synthetic/controlled test data; Stable sau này dùng dữ liệu mới tạo trong hệ thống mới.

## D-015 — Hai điểm phải đo thực tế

Status: `ACTIVE`

Khả năng LAN trong mạng công ty phải quyết định bằng LAN Probe HY1/HY2. Khả năng trụ Free Plan phải quyết định bằng đo quota khi Beta stress/soak. Hai điểm này không phải blocker để setup/build và không tiếp tục hỏi suy đoán.

## D-016 — Beta/Stable isolation

Status: `ACTIVE`

Beta/Stable tách Worker, D1, DO state, package/session/local DB, Google Cloud/OAuth/Apps Script/Drive runtime root, LAN state và R2 nếu bật. Promotion chỉ promote source/schema/config đã duyệt, không copy wholesale runtime data.

## D-017 — Domain

Status: `ACTIVE`

Stable Cloud canonical target `vanhanhdchungyen.cc.cd`; Beta Cloud canonical target `beta.vanhanhdchungyen.cc.cd`. LAN preferred `lan.vanhanhdchungyen.cc.cd` và `beta-lan.vanhanhdchungyen.cc.cd` chỉ dùng local nếu hạ tầng cho phép; không attach Worker public; localhost proxy là fallback. Khi custom zone chưa khả dụng, D-025 cho phép public Cloud chạy tạm qua `workers.dev`; canonical custom-domain targets không bị thay thế.

## D-018 — Free-first

Status: `ACTIVE`

Tối ưu request/CPU, D1 read/write/storage, Durable Objects, Drive/Sheets, R2, realtime/cache trước Paid. Không polling; indexed query + delta + batch + archive verified. Paid chỉ khi tối ưu hợp lý vẫn không trụ và không được hy sinh data safety/UX để giữ Free.

## D-019 — Root/security đặc biệt

Status: `ACTIVE`

Root username `admin`; root identity immutable. Root time-string password và 4-digit OTP semantics giữ đúng Master Spec, không mở lại trừ khi OWNER yêu cầu. Owner/storage account: `tam95.supra@gmail.com`.

## D-020 — Offline/LAN authority

Status: `ACTIVE`

Mỗi cluster chỉ một canonical authority; nhánh split không canonical vẫn được dùng mọi chức năng theo permission và ghi local/pending. Hội tụ bằng event/idempotency/conflict, không silent overwrite. LAN Agent portable/localhost fallback; PDA có thể emergency Master nhưng user role không đổi.

## D-021 — Event/correction/conflict

Status: `ACTIVE`

Mutation dùng immutable event/idempotency/version/device sequence. Raw event không rewrite; correction/tombstone/reversal là event mới. Admin/Super resolve conflict theo permission; escalation 30m Admin, 60m Superadmin, 4h Owner.

## D-022 — Version/OTA

Status: `ACTIVE`

APK Beta/Stable riêng; required version bắt buộc khi device biết release mới. Old pending event luôn được replay/migrate; nếu business rule mới không map chắc thì Version Conflict + manual correction, không drop. Rollback Android dùng higher versionCode với previous stable code/config.

## D-023 — Archive/backup

Status: `ACTIVE`

Drive long-term; Sheets projection; JSONL.gz + manifest/checksum + workbook theo env+cluster+quarter; D1 hot/indexed; snapshot ~6h, 7 daily + 4 weekly baseline; restore test quarterly. History/audit/text giữ dài hạn đến khi Owner special purge.

## D-024 — Repo sẵn sàng chuyển setup/build

Status: `ACTIVE`

Từ checkpoint 2026-09-10, dự án chuyển `SETUP_READY` / `APPROVED_FOR_SETUP_AND_IMPLEMENTATION`. Bước tiếp theo là one-time service/permission setup, sau đó khóa contracts và triển khai các workstream song song.

## D-025 — Interim Cloudflare workers.dev

Status: `ACTIVE`

Do Cloudflare đang chặn tạo custom zone `vanhanhdchungyen.cc.cd`, OWNER chốt tiếp tục build/test Cloud qua `workers.dev` trong thời gian chờ review. Account Workers subdomain mục tiêu là `vanhanhdchungyen.workers.dev` nếu tên còn khả dụng.

Giữ nguyên Worker resource names theo Runbook: `vhdchy-beta` và `vhdchy-stable`. Vì `workers.dev` bắt buộc URL theo `<worker-name>.<account-subdomain>.workers.dev`, interim public URLs tương ứng sẽ là:
- Beta: `vhdchy-beta.vanhanhdchungyen.workers.dev`
- Stable target: `vhdchy-stable.vanhanhdchungyen.workers.dev`

Không đổi Worker names thành `beta`/`stable` chỉ để rút gọn URL. Không public LAN qua `workers.dev`; LAN vẫn dùng local DNS preferred names theo D-017 hoặc localhost fallback. Khi custom zone được Cloudflare cho phép, attach canonical custom domains theo D-017 và coi `workers.dev` là fallback/test route, không phải production canonical domain dài hạn.