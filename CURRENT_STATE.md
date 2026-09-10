# CURRENT STATE

```yaml
project: "VẬN HÀNH DC HƯNG YÊN"
repository: "tam95supra-source/van-hanh-dc-hung-yen"
branch: "main"
state_revision: 16
last_checkpoint_at: "2026-09-10T11:23:00+07:00"
phase: "SETUP_READY"
code_status: "APPROVED_FOR_SETUP_AND_IMPLEMENTATION"

current_task:
  id: "SETUP-001"
  title: "One-time service/permission setup for Beta Pick Pack 1291 on DC Core"
  status: "IN_PROGRESS"

last_completed_step:
  id: "SETUP-001-S2-CLOUDFLARE-ACCOUNT-SUSPENSION-DIAGNOSIS"
  summary: "OWNER provided Cloudflare email showing the account is suspended for Terms of Service review. The notice explicitly says current services are not impacted but new domains cannot be added while under review. This directly explains the Add-site restriction. It is also a plausible cause of workers.dev subdomain rename failures, but the email does not explicitly confirm that rename operation is blocked, so that part remains unproven."

next_step:
  summary: "Treat Cloudflare S2 as provider-blocked pending Trust & Safety review. Owner contacts abusereply@cloudflare.com using the suspension email thread and requests review/reinstatement. Do not spend more setup time retrying domain/subdomain mutations until the suspension is cleared. Continue independent S3 Google Cloud/OAuth and S6 Android signing; evaluate fallback cloud provider if Owner wants to avoid waiting on Cloudflare."

do_not_repeat:
  - "Không tiếp tục thử Add site/rename workers.dev nhiều lần khi account đang suspended for Terms of Service review."
  - "Không suy đoán mọi Cloudflare mutation đều bị khóa; email chỉ xác nhận rõ new domains bị chặn, workers.dev rename chỉ là khả năng cao nhưng chưa được provider xác nhận."
  - "Không chấp nhận `1291.workers.dev` hoặc URL public chứa account-subdomain `1291` làm target của VHDCHY."
  - "Không DELETE workers.dev subdomain `1291` bằng API trước khi tên thay thế được đăng ký thành công."
  - "Không public LAN qua workers.dev; LAN giữ local DNS preferred names hoặc localhost fallback."
  - "Không coi workers.dev là thay thế vĩnh viễn canonical custom domains; đây là interim/fallback route."
  - "Không chẩn đoán zone_count=0 là token scope lỗi khi zone chưa tồn tại trong Cloudflare account."
  - "Không coi việc thiếu Worker hoặc GCP project là nguyên nhân của Cloudflare Add site restriction."
  - "Không cố bypass Cloudflare restriction bằng tài khoản khác; dùng review/support path chính thức."
  - "Không yêu cầu tạo lại GitHub Environments beta/stable; workflow đã xác nhận tồn tại."
  - "Không tạo lại Drive runtime roots 10_RUNTIME_BETA / 20_RUNTIME_STABLE hoặc các child folders đã PASS."
  - "Không viết lại LAN Probe plan từ đầu; tiếp tục bằng build Probe và test HY1/HY2 khi đến bước thực thi."
  - "Không khôi phục code/config/workflow cũ đã bị loại khỏi main như authority của dự án mới."
  - "Được READ/REUSE có chọn lọc pick-pack-1291 làm reference; CẤM write/deploy/runtime fallback sang dự án cũ nếu không có chỉ thị mới."
  - "Không migrate employee/resource/history từ Pick Pack 1291 cũ vì dữ liệu cũ là test."
  - "Không dùng Google Sheets làm business authority; Sheets chỉ projection/human-readable archive/đối soát."
  - "Không cho App/Web/PDA ghi Google Sheets trực tiếp; projection qua một Service/Gateway writer + outbox/batch."
  - "Không dùng Beta/Stable chung Worker/D1/GAS/OAuth/package/local DB/LAN state."
  - "Không dùng version live cũ/chưa xác minh như public mới nhất."
  - "Không xóa changelog của version đã public/phát hành."
  - "Không ghi secret/token/password/signer/private data vào repo."

read_next:
  - "ops/ai/TASK_LEDGER.md"
  - "ops/setup/RESOURCE_REGISTRY.md"
  - "ops/ai/RUN_LOG.md"
  - "ops/ai/DECISIONS.md"

live_beta: "NOT_DEPLOYED"
live_stable: "NOT_DEPLOYED"
known_blockers:
  - "SETUP_S1_ENV_SECRETS_VARIABLES_PENDING_PROVIDER_VALUES"
  - "SETUP_S2_CLOUDFLARE_ACCOUNT_SUSPENDED_TOS_REVIEW"
  - "SETUP_S3_GOOGLE_GCP_OAUTH_OWNER_UI_REQUIRED"
  - "SETUP_S6_ANDROID_SIGNING_OWNER_CONTROLLED"
  - "LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE"
  - "FREE_PLAN_CAPACITY_REQUIRES_BETA_STRESS_SOAK_MEASUREMENT"

notes:
  - "Cloudflare account ID previously verified: d79b87776e86d8edc8f4a0a94302ca76."
  - "Cloudflare suspension notice shown by Owner states: account suspended for possible Terms of Service violation; current services continue, but adding new domains is disabled during review; Trust & Safety contact is abusereply@cloudflare.com."
  - "This notice directly accounts for Add-site failure and supersedes earlier speculation that the issue was merely zone scope or target availability."
  - "workers.dev rename failure may be related to suspension, but is not explicitly covered by the notice; do not state it as proven."
  - "GitHub environments beta/stable are operationally verified; stable required-reviewer protection is active."
  - "Drive project root owner/private readback PASS. BETA root ID=1EpUI49xbFUtgzR3mh3M0EQu7qYYsswB5; STABLE root ID=1c6RNTOHOzaX6GrQFOEd64h9rndPoeiFI."
  - "LAN Probe plan file: ops/setup/LAN_PROBE_PLAN.md; plan READY, empirical gate OPEN."
  - "GitHub checkpoint là nguồn trạng thái công việc chính thức; trí nhớ chat chỉ là tạm thời."
  - "Ưu tiên chạy song song các bước độc lập; serialize khi có dependency/shared mutable state/race risk."
```
