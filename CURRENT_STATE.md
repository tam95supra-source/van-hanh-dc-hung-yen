# CURRENT STATE

```yaml
project: "VẬN HÀNH DC HƯNG YÊN"
repository: "tam95supra-source/van-hanh-dc-hung-yen"
branch: "main"
state_revision: 6
last_checkpoint_at: "2026-09-10T09:08:00+07:00"
phase: "SETUP_READY"
code_status: "APPROVED_FOR_SETUP_AND_IMPLEMENTATION"

current_task:
  id: "SETUP-001"
  title: "One-time service/permission setup for Beta Pick Pack 1291 on DC Core"
  status: "IN_PROGRESS"

last_completed_step:
  id: "SETUP-001-S5"
  summary: "Google Drive runtime roots BETA/STABLE đã được tạo mới và readback PASS dưới project root hiện hữu; mỗi env có 00_SHARED..07_SYSTEM, tách biệt hoàn toàn."

next_step:
  summary: "S1 GitHub Environments beta/stable chưa thể xác minh/tạo bằng GitHub connector hiện tại vì connector không expose Environments/Secrets API. Owner cần thao tác Settings -> Environments. Song song tiếp tục S2 Cloudflare, S3 Google Cloud/OAuth và S6 Android signing khi Owner thao tác/cấp quyền; S4 Apps Script phụ thuộc S3."

do_not_repeat:
  - "Không tạo lại Drive runtime roots 10_RUNTIME_BETA / 20_RUNTIME_STABLE hoặc các child folders đã PASS."
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
  - "ops/setup/GOOGLE_SHEETS_MODEL_PICKPACK1291.md"
  - "ops/ai/RUN_LOG.md"

live_beta: "NOT_DEPLOYED"
live_stable: "NOT_DEPLOYED"
known_blockers:
  - "SETUP_S1_GITHUB_ENVIRONMENTS_REQUIRES_OWNER_UI_OR_TOOL_WITH_ENVIRONMENT_ADMIN_API"
  - "LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE"
  - "FREE_PLAN_CAPACITY_REQUIRES_BETA_STRESS_SOAK_MEASUREMENT"

notes:
  - "Drive project root owner/private readback PASS. BETA root ID=1EpUI49xbFUtgzR3mh3M0EQu7qYYsswB5; STABLE root ID=1c6RNTOHOzaX6GrQFOEd64h9rndPoeiFI."
  - "GitHub checkpoint là nguồn trạng thái công việc chính thức; trí nhớ chat chỉ là tạm thời."
  - "Platform scope = toàn DC; cluster = team/operational boundary; feature/permission linh hoạt."
  - "Cluster đầu tiên = Pick Pack 1291; business source/logic cũ là strong read-only reference."
  - "Sheets model Pick Pack 1291 đã được generalize theo Core mới: workbook env+cluster+quarter; master snapshot + append-only business/history tabs; old technical/admin tabs không làm authority."
  - "Sau Pick Pack Beta PASS -> Stable; sau đó tiếp tục Beta cluster khác như Invent 1291."
  - "Checkpoint mục tiêu <=15 phút; soft batch limit 18 phút."
  - "Ưu tiên chạy song song các bước độc lập; serialize khi có dependency/shared mutable state/race risk."
  - "Beta/stable live chỉ ghi sau public readback. Changelog bất biến theo version."
```
