# CURRENT STATE

```yaml
project: "VẬN HÀNH DC HƯNG YÊN"
repository: "tam95supra-source/van-hanh-dc-hung-yen"
branch: "main"
state_revision: 14
last_checkpoint_at: "2026-09-10T11:17:00+07:00"
phase: "SETUP_READY"
code_status: "APPROVED_FOR_SETUP_AND_IMPLEMENTATION"

current_task:
  id: "SETUP-001"
  title: "One-time service/permission setup for Beta Pick Pack 1291 on DC Core"
  status: "IN_PROGRESS"

last_completed_step:
  id: "SETUP-001-S2-WORKERSDEV-DASHBOARD-RENAME-DIAGNOSIS"
  summary: "Owner attempted Dashboard rename from `1291.workers.dev` to `hungyen.workers.dev`; Cloudflare returned generic `could not be registered`. This does not prove an account failure. Cloudflare documents account workers.dev subdomain as configurable, but the requested account subdomain must be registrable/available. The agreed target remains `vanhanhdchungyen`, not `hungyen`."

next_step:
  summary: "Owner retries Dashboard Change using exact target `vanhanhdchungyen`. If that also returns `could not be registered`, capture screenshot and keep `1291.workers.dev` as interim route rather than destructive delete/recreate. AI then continues Worker/D1 setup using the surviving account subdomain. S3 Google Cloud/OAuth and S6 Android signing remain independent."

do_not_repeat:
  - "Không DELETE workers.dev subdomain `1291` bằng API để ép đổi tên; giữ route hiện tại nếu rename target không đăng ký được."
  - "Không coi lỗi đăng ký `hungyen.workers.dev` là bằng chứng toàn bộ Workers.dev không khả dụng; thử đúng target đã chốt `vanhanhdchungyen` trước."
  - "Không đổi Worker resource names vhdchy-beta/vhdchy-stable thành beta/stable chỉ để rút gọn workers.dev URL."
  - "Không public LAN qua workers.dev; LAN giữ local DNS preferred names hoặc localhost fallback."
  - "Không coi workers.dev là thay thế vĩnh viễn canonical custom domains; đây là interim/fallback route trong lúc Cloudflare custom zone bị chặn."
  - "Không chẩn đoán zone_count=0 là token scope lỗi khi zone chưa tồn tại trong Cloudflare account."
  - "Không coi việc thiếu Worker hoặc GCP project là nguyên nhân của Cloudflare Add site restriction."
  - "Không cố bypass Cloudflare zone-creation restriction bằng tài khoản khác; dùng review/support path chính thức."
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
  - ".github/workflows/setup-workers-dev.yml"
  - ".github/workflows/setup-verify-cloudflare.yml"
  - "ops/ai/RUN_LOG.md"

live_beta: "NOT_DEPLOYED"
live_stable: "NOT_DEPLOYED"
known_blockers:
  - "SETUP_S1_ENV_SECRETS_VARIABLES_PENDING_PROVIDER_VALUES"
  - "SETUP_S2_WORKERSDEV_TARGET_AVAILABILITY_UNCONFIRMED"
  - "SETUP_S2_CLOUDFLARE_CUSTOM_ZONE_CREATION_RESTRICTED_REVIEW_REQUIRED"
  - "SETUP_S3_GOOGLE_GCP_OAUTH_OWNER_UI_REQUIRED"
  - "SETUP_S6_ANDROID_SIGNING_OWNER_CONTROLLED"
  - "LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE"
  - "FREE_PLAN_CAPACITY_REQUIRES_BETA_STRESS_SOAK_MEASUREMENT"

notes:
  - "Cloudflare account ID verified: d79b87776e86d8edc8f4a0a94302ca76."
  - "Current workers.dev account subdomain remains 1291.workers.dev."
  - "Owner screenshot 2026-09-10 shows rename attempt specifically targeted hungyen.workers.dev and Cloudflare returned generic registration failure."
  - "Cloudflare docs support Dashboard Workers & Pages -> Change next to Your subdomain; exact availability/registration policy for a requested name is provider-controlled."
  - "After desired account subdomain becomes vanhanhdchungyen, fixed Worker names imply interim URLs vhdchy-beta.vanhanhdchungyen.workers.dev and vhdchy-stable.vanhanhdchungyen.workers.dev. If rename remains unavailable, use vhdchy-beta.1291.workers.dev / vhdchy-stable.1291.workers.dev instead."
  - "Cloudflare custom-zone review remains open; it does not block workers.dev or account-level Workers/D1 work."
  - "GitHub environments beta/stable are operationally verified; stable required-reviewer protection is active."
  - "Drive project root owner/private readback PASS. BETA root ID=1EpUI49xbFUtgzR3mh3M0EQu7qYYsswB5; STABLE root ID=1c6RNTOHOzaX6GrQFOEd64h9rndPoeiFI."
  - "LAN Probe plan file: ops/setup/LAN_PROBE_PLAN.md; plan READY, empirical gate OPEN."
  - "GitHub checkpoint là nguồn trạng thái công việc chính thức; trí nhớ chat chỉ là tạm thời."
  - "Ưu tiên chạy song song các bước độc lập; serialize khi có dependency/shared mutable state/race risk."
```
