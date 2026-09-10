# CURRENT STATE

```yaml
project: "VẬN HÀNH DC HƯNG YÊN"
repository: "tam95supra-source/van-hanh-dc-hung-yen"
branch: "main"
state_revision: 4
last_checkpoint_at: "2026-09-10T07:44:29+07:00"
phase: "SETUP_READY"
code_status: "APPROVED_FOR_SETUP_AND_IMPLEMENTATION"

current_task:
  id: "SETUP-001"
  title: "One-time service/permission setup for Beta Pick Pack 1291 on DC Core"
  status: "READY"

last_completed_step:
  id: "SPEC-V2"
  summary: "Owner chốt toàn bộ kiến trúc Core DC + cluster Pick Pack 1291 đầu tiên; 60 đề xuất PH14R approved; không migrate dữ liệu Pick Pack cũ; Master Spec V2 và setup runbook đã tạo/QA."

next_step:
  summary: "Thực hiện one-time setup: GitHub beta/stable environments, Cloudflare scoped tokens/resources, Google GCP/OAuth/Apps Script bootstrap, Drive runtime roots, Android signing; sau đó khóa contracts và build Beta theo các workstream song song."

do_not_repeat:
  - "Không khôi phục code/config/workflow cũ đã bị loại khỏi main như authority của dự án mới."
  - "Được READ/REUSE có chọn lọc pick-pack-1291 làm reference; CẤM write/deploy/runtime fallback sang dự án cũ nếu không có chỉ thị mới."
  - "Không migrate employee/resource/history từ Pick Pack 1291 cũ vì dữ liệu cũ là test."
  - "Không attach lan.* hoặc beta-lan.* vào Worker public; LAN domain chỉ local khi hạ tầng cho phép, localhost là fallback."
  - "Không dùng Beta/Stable chung Worker/D1/GAS/OAuth/package/local DB/LAN state."
  - "Không dùng version live cũ/chưa xác minh như public mới nhất."
  - "Không xóa changelog của version đã public/phát hành."
  - "Không ghi secret/token/password/signer/private data vào repo."

read_next:
  - "ops/ai/DECISIONS.md"
  - "ops/ai/VERSION_POLICY.md"

live_beta: "NOT_DEPLOYED"
live_stable: "NOT_DEPLOYED"
known_blockers:
  - "LAN_FEASIBILITY_REQUIRES_REAL_HY1_HY2_PROBE"
  - "FREE_PLAN_CAPACITY_REQUIRES_BETA_STRESS_SOAK_MEASUREMENT"

notes:
  - "GitHub checkpoint là nguồn trạng thái công việc chính thức; trí nhớ chat chỉ là tạm thời."
  - "Platform scope = toàn DC; cluster = team/operational boundary; feature/permission linh hoạt."
  - "Cluster đầu tiên = Pick Pack 1291; business source/logic cũ là strong read-only reference."
  - "Sau Pick Pack Beta PASS -> Stable; sau đó tiếp tục Beta cluster khác như Invent 1291."
  - "Checkpoint mục tiêu <=15 phút; soft batch limit 18 phút."
  - "Ưu tiên chạy song song các bước độc lập; serialize khi có dependency/shared mutable state/race risk."
  - "Beta/stable live chỉ ghi sau public readback. Changelog bất biến theo version."
```
