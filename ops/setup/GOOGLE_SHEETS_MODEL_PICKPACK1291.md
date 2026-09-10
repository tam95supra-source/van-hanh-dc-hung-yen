# GOOGLE SHEETS MODEL — CLUSTER PICK PACK 1291

Status: `APPROVED_REFERENCE_MODEL`

## Authority

- Google Sheets là projection/human-readable archive/đối soát; không phải business authority.
- App/Web/PDA không ghi trực tiếp nhiều tab.
- Canonical mutation phải commit Service/D1 hoặc LAN authority trước, sau đó một writer duy nhất projection qua outbox/batch.
- PICK PACK 1291 cũ là strong reference cho tab/field, nhưng Core VHDCHY mới thắng nếu mâu thuẫn.

## Workbook lifecycle

- Một workbook cho mỗi `environment + cluster_id + quarter`.
- Tên kỹ thuật: `BETA_<cluster_id>_<YYYY>_Q<n>` hoặc `STABLE_<cluster_id>_<YYYY>_Q<n>`.
- Automation tìm bằng file/workbook ID + cluster_id, không phụ thuộc display name.
- Quarter mới tạo workbook mới và copy master snapshot hiện tại.
- Closed quarter không rewrite raw rows; correction append vào `12_CONFLICT_CORRECTION` + machine correction package.
- Machine source phục hồi vẫn là JSONL.gz + manifest/checksum; workbook là bản người đọc.

## Tabs baseline

1. `00_META` — env/cluster/quarter/schema/checkpoint/manifest metadata.
2. `01_NHAN_SU_SNAPSHOT` — employee_id, MNV, name, phone, status, main position, NCC, department, site, warehouse, start/permanent-leave dates, note, portrait ref, audit.
3. `02_PDA` — resource_id, serial, last5, source/owner, owner_cluster, state, availability, note.
4. `03_USER_PICK` — resource_id, user number, user_pick, source/owner, state, availability, note.
5. `04_BAN_PACK` — resource_id, pack table name, source/owner, state, availability, note.
6. `05_USER_PACK` — resource_id, pack_table_ref, user_pack, source/owner, state, availability, note.
7. `06_RA_VAO_TRONG_CA` — business_date, shift_id/name snapshot, session_id, employee_id/MNV/name, positions, PDA/User Pick/Bàn Pack/User Pack, ENTER/EXIT/CORRECTION, actor/time/event/app_version.
8. `07_RESOURCE_EVENTS` — assign/release/reissue/borrow/transfer history with resource_id, owner/used cluster, session/employee, reason, approver, event.
9. `08_CONG_NHAT` — labor_id/session/employee/business_date/shift/type/start/end/state/note/deduct_staff/events/correction/app_version.
10. `09_LICH_SU_NGHIEP_VU` — canonical event human projection: event/entity/session/employee/business_date/actor/device/time/summary/version/correction link.
11. `10_NHAN_HANG_ROT` — record_id, business_date, location, QR, DO, package_count, state, note, actor, timestamps, event_id.
12. `11_BIEN_BAN_METADATA` — document/category/business_date/uploader/page count/Drive refs/hash summary/note/status/event; binary image stays Drive.
13. `12_CONFLICT_CORRECTION` — conflict evidence, resolver decision/reason/time, correction_event_id.
14. `13_IMPORT_AUDIT` — import job/source hash/domain/counts/actor/result file/note.

## Old Pick Pack tabs intentionally not copied as authority

- `Danh sách Admin`: accounts/permissions must stay D1 + encrypted offline snapshot, not Google Sheet authority.
- `LAN AUTHORITY FENCE`, `LAN PRESENCE`, fallback/emergency technical ledgers: keep live technical state in D1/LAN/Drive logs; only create a separate technical workbook if a real support/recovery need appears.
- Fixed Ca1/Ca2/HC semantics: not used; current shift_id rules apply.

## Projection/write rules

- Master tabs `01-05`: batch snapshot/upsert, not event authority.
- Event/history tabs `06-13`: append-only or append-derived projection.
- Use Sheets batch APIs; do not write one cell/row per network request.
- D1 outbox retains retry/idempotency until Google ACK.
- Keep spreadsheet_id/tab IDs/checkpoints in D1 catalog; do not search/list all Drive per operation.
- Technical heartbeat/presence does not continuously write to Sheets.
- Closed quarters do not poll/read back continuously; read only for verification, archive/history request, or DR.

## Setup functions to implement

- `ensureQuarterWorkbook(environment, cluster_id, business_date)`
- `projectMasterSnapshots()`
- `projectEventsBatch()`
- `closeQuarterWorkbook()`
- `verifyWorkbookProjection()`
- `rebuildQuarterWorkbookFromArchive()`

## Reference basis

Selected from PICK PACK 1291 reference/live schema: `DANH SÁCH NHÂN SỰ`, PDA, USER PICK, BÀN PACK, USER PACK, `RA - VÀO TRONG CA`, `THÔNG TIN USER CỦA NLĐ`, `CÔNG NHẬT`, `LỊCH SỬ NGHIỆP VỤ`, `OUTBOUND / Nhận hàng rớt`; generalized to current DC Core rules.