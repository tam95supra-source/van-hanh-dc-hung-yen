# CURRENT STATE

```yaml
project: "VẬN HÀNH DC HƯNG YÊN"
repository: "tam95supra-source/van-hanh-dc-hung-yen"
branch: "main"
state_revision: 11
last_checkpoint_at: "2026-09-10T10:45:00+07:00"
phase: "SETUP_READY"
code_status: "APPROVED_FOR_SETUP_AND_IMPLEMENTATION"

current_task:
  id: "SETUP-001"
  title: "One-time service/permission setup for Beta Pick Pack 1291 on DC Core"
  status: "IN_PROGRESS"

last_completed_step:
  id: "SETUP-001-S2-CLOUDFLARE-ZONE-CREATION-DIAGNOSIS"
  summary: "Cloudflare UI blocks Add site with 'You are not allowed to create new zones at this time'. This is a Cloudflare zone-creation restriction, not caused by missing Worker or Google GCP project. DNSHE operates cc.cd as a public registration suffix and cc.cd is present in the Public Suffix List, so vanhanhdchungyen.cc.cd is intended to be independently registrable/delegatable."

next_step:
  summary: "Owner must contact Cloudflare via the abuse/review path shown by Cloudflare (abusereply@cloudflare.com for non-Enterprise), explaining control of vanhanhdchungyen.cc.cd through DNSHE and requesting zone creation review. Do not create Worker/GCP as a fix for this error. While Cloudflare review is pending, continue independent S3 Google Cloud/OAuth and S6 Android signing. After Cloudflare allows zone creation: onboard vanhanhdchungyen.cc.cd, delegate DNSHE nameservers to Cloudflare, then scope BETA/STABLE tokens to Specific zone and rerun verification."

do_not_repeat:
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
  - "Không attach lan.* hoặc beta-lan.* vào Worker public; LAN domain chỉ local khi hạ tầng cho phép, localhost là fallback."
  - "Không dùng Beta/Stable chung Worker/D1/GAS/OAuth/package/local DB/LAN state."
  - "Không dùng version live cũ/chưa xác minh như public mới nhất."
  - "Không xóa changelog của version đã public/phát hành."
  - "Không ghi secret/token/password/signer/private data vào repo."

read_next:
  - "ops/ai/TASK_LEDGER.md"
  - "ops/setup/RESOURCE_REGISTRY.md"
  - ".github/workflows/setup-verify-cloudflare.yml"
  - "ops/setup/GOOGLE_SHEETS_MODEL_PICKPACK1291.md"
  - "ops/ai/RUN_LOG.md"

live_beta: "NOT_DEPLOYED"
live_stable: "NOT_DEPLOYED"
known_blockers:
  - "SETUP_S1_ENV_SECRETS_VARIABLES_PENDING_PROVIDER_VALUES"
  - "SETUP_S2_CLOUDFLARE_ZONE_CREATION_RESTRICTED_REVIEW_REQUIRED"
  - "SETUP_S3_GOOGLE_GCP_OAUTH_OWNER_UI_REQUIRED"
  - "SETUP_S6_ANDROID_SIGNING_OWNER_CONTROLLED"
  - "LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE"
  - "FREE_PLAN_CAPACITY_REQUIRES_BETA_STRESS_SOAK_MEASUREMENT"

notes:
  - "DNSHE publicly documents cc.cd as a public domain registration namespace; cc.cd was added to the Public Suffix List in late 2025."
  - "Cloudflare official troubleshooting for zone-add restrictions of this class directs non-Enterprise users to abusereply@cloudflare.com with a detailed explanation of their association/control of the zone."
  - "Cloudflare validation workflow=.github/workflows/setup-verify-cloudflare.yml. Previous zone_count=0 remains consistent with target zone not existing in the account."
  - "GitHub environments beta/stable are operationally verified by workflow resolution; stable required-reviewer protection is active."
  - "Drive project root owner/private readback PASS. BETA root ID=1EpUI49xbFUtgzR3mh3M0EQu7qYYsswB5; STABLE root ID=1c6RNTOHOzaX6GrQFOEd64h9rndPoeiFI."
  - "Public beta/stable remain NOT_DEPLOYED. LAN hostnames remain intentionally non-public."
  - "LAN Probe plan file: ops/setup/LAN_PROBE_PLAN.md; plan READY, empirical gate OPEN."
  - "GitHub checkpoint là nguồn trạng thái công việc chính thức; trí nhớ chat chỉ là tạm thời."
  - "Ưu tiên chạy song song các bước độc lập; serialize khi có dependency/shared mutable state/race risk."
```
