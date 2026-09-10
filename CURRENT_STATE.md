# CURRENT STATE

```yaml
project: "VẬN HÀNH DC HƯNG YÊN"
repository: "tam95supra-source/van-hanh-dc-hung-yen"
branch: "main"
state_revision: 9
last_checkpoint_at: "2026-09-10T10:34:00+07:00"
phase: "SETUP_READY"
code_status: "APPROVED_FOR_SETUP_AND_IMPLEMENTATION"

current_task:
  id: "SETUP-001"
  title: "One-time service/permission setup for Beta Pick Pack 1291 on DC Core"
  status: "IN_PROGRESS"

last_completed_step:
  id: "SETUP-001-S2-CLOUDFLARE-BETA-VALIDATION"
  summary: "Đã chạy GitHub Actions kiểm tra thật Cloudflare BETA. Secret tồn tại và token qua account/token verification, nhưng target zone vanhanhdchungyen.cc.cd trả 0 accessible zones. S2 chưa PASS; cần sửa Zone resource/scope. Stable validation đang chờ required reviewer."

next_step:
  summary: "Owner sửa cả 2 Cloudflare token để Zone resource bao gồm đúng vanhanhdchungyen.cc.cd và có Zone Read + DNS Write + Workers Routes Write; sau đó rerun workflow xác minh để lấy CF_ACCOUNT_ID/CF_ZONE_ID. Song song có thể bắt đầu S3 Google Cloud/OAuth và S6 Android signing."

do_not_repeat:
  - "Không tạo lại GitHub Environments beta/stable; workflow đã xác nhận tồn tại."
  - "Không tạo lại hai Cloudflare token nếu dashboard cho phép Edit token; sửa resource/scope hiện có trước."
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
  - "SETUP_S2_CLOUDFLARE_ZONE_SCOPE_FIX_REQUIRED"
  - "SETUP_S3_GOOGLE_GCP_OAUTH_OWNER_UI_REQUIRED"
  - "SETUP_S6_ANDROID_SIGNING_OWNER_CONTROLLED"
  - "LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE"
  - "FREE_PLAN_CAPACITY_REQUIRES_BETA_STRESS_SOAK_MEASUREMENT"

notes:
  - "Cloudflare validation workflow=.github/workflows/setup-verify-cloudflare.yml. Run 34433999726 proved BETA token/account verification then zone_count=0. Run 34434041556 confirmed target zone inaccessible."
  - "GitHub environments beta/stable are operationally verified by workflow resolution; stable required-reviewer protection is active."
  - "Drive project root owner/private readback PASS. BETA root ID=1EpUI49xbFUtgzR3mh3M0EQu7qYYsswB5; STABLE root ID=1c6RNTOHOzaX6GrQFOEd64h9rndPoeiFI."
  - "Public beta/stable remain NOT_DEPLOYED. LAN hostnames remain intentionally non-public."
  - "LAN Probe plan file: ops/setup/LAN_PROBE_PLAN.md; plan READY, empirical gate OPEN."
  - "GitHub checkpoint là nguồn trạng thái công việc chính thức; trí nhớ chat chỉ là tạm thời."
  - "Ưu tiên chạy song song các bước độc lập; serialize khi có dependency/shared mutable state/race risk."
```
