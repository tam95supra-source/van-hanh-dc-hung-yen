# ARCHITECTURE CURRENT — VẬN HÀNH DC HƯNG YÊN

Status: OWNER-APPROVED LOGIC / IMPLEMENTATION PENDING

## Normal mode

PDA / Website -> local-first UI/state -> Cloud Service -> operational DB -> realtime delta -> durable outbox -> Google Sheets projection.

Ảnh/biên bản: client/LAN/service spool -> Google Drive durable store; service không giữ binary lâu dài mặc định.

## LAN mode

- SUPERADMIN gán USER/ADMIN vào LAN Group.
- ADMIN được force LAN cho group mình được giao.
- Trong một group, route Cloud/LAN là group-level authority, không phải từng client tự chọn.
- 1 ACTIVE_MASTER laptop + standby/replica nếu có nhiều admin laptop.
- Sticky master: không đổi vì ping/CPU; chỉ failover khi master mất authority/lease hợp lệ.
- Master cũ quay lại -> stale epoch -> writer fenced -> catch-up -> standby; không auto-failback.
- Khi Internet mất nhưng Wi-Fi/LAN còn: PDA/Web vẫn realtime nội bộ với LAN master; Google/Cloud xếp hàng chờ.

### Trường hợp phổ biến chỉ có 1 laptop + PDA

- Laptop là LAN master.
- PDA là client local-first; PDA có thể tham gia witness metadata nhưng không trở thành full LAN Service master.
- Nếu laptop mất và không còn authority LAN hợp lệ: PDA chuyển OFFLINE_LOCAL, vẫn thực hiện nghiệp vụ và queue local.

### Khi có 2-3+ laptop admin

- Chỉ một writer master.
- Laptop còn lại replica/standby.
- Cần fencing/epoch/lease và voter/witness để không split-brain.
- Không tự đổi master nếu master hiện tại vẫn healthy.

## Offline local

Nếu cả Cloud và LAN không reachable:
- PDA vẫn cho phép toàn bộ nghiệp vụ local-first theo rule có thể kiểm tra local.
- mutation append durable local queue.
- UI phải báo rõ dữ liệu chưa đồng bộ toàn hệ thống và có thể chưa thấy thay đổi từ PDA khác.
- reconnect -> replay idempotent + version/fence/conflict handling; không last-write-wins mù quáng.

## LAN Group / Google routing

Bỏ routing theo bộ phận/site.

Canonical routing:
`user -> LAN Group assigned by SUPERADMIN -> registered group resource IDs`.

Dữ liệu dùng chung có thể dùng chung, ví dụ danh sách nhân sự và catalog được OWNER chốt.

Dữ liệu nghiệp vụ phải tách per group, gồm tối thiểu:
- vào/ra/phiên;
- công nhật;
- tài nguyên/PDA assignment và nghiệp vụ liên quan;
- user pick/pack/bàn pack nếu là trạng thái nghiệp vụ group;
- lịch sử nghiệp vụ;
- DO/hàng rớt;
- biên bản + metadata + ảnh;
- nghiệp vụ phát sinh sau này trừ khi được OWNER chốt là global/shared.

Mỗi group dùng workbook/folder riêng. Runtime resolve bằng ID trong registry, không theo tên.

## Google data role

- Operational DB/LAN DB: authority xử lý realtime.
- Google Sheet: async projection/reporting/đối soát, không nằm trên hot path mỗi thao tác.
- Google Drive: durable primary binary store cho ảnh/biên bản.

## Storage guard

Provider usage design target <= 50% free allocation hiện hành.
Project cache/spool budget nằm trong phần budget đó:
- 75% project budget: cảnh báo + cho ADMIN/SUPERADMIN dọn.
- 90% project budget: auto-evict oldest-first nhưng chỉ với cache/spool đã có durable-confirmed copy.
- Không tự xóa sole copy/pending/pinned/hold/checksum-unverified.

Nếu Drive cần thêm dung lượng dài hạn, OWNER có thể chủ động nâng cấp; hệ thống không tự phát sinh phí.

## Rebuild

- Rebuild kỹ thuật sạch trên account nhà cung cấp hiện có nhưng resource/project mới.
- Repo cũ PICK PACK 1291 chỉ read-only reference.
- Giữ và port logic/invariant/UI/business rule đã OWNER chốt, không bê nguyên coupling/rác implementation cũ.
- APK/signing/release tạm hoãn; trước mắt hoàn thiện logic, data model, cloud/LAN service, Google integration, permissions, backup/restore và quota gates.
