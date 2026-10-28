# NHẬT KÝ LÀM VIỆC VỚI AI – DỰ ÁN MONEYNOTE
**Học phần:** Phát triển ứng dụng Web với AI-Driven  
**Dự án:** MoneyNote – Sổ chi tiêu cá nhân  
**Công nghệ:** HTML5, CSS3, JavaScript (ES6+) thuần, LocalStorage  

---

## 1. Giới thiệu & Bối cảnh dự án
MoneyNote là ứng dụng web quản lý tài chính cá nhân dành cho sinh viên, chạy 100% trên trình duyệt (Client-side), không phụ thuộc vào server hay thư viện/framework bên thứ ba (React, Vue, jQuery, Bootstrap, Tailwind). 

Mục tiêu là xây dựng ứng dụng hoàn chỉnh bám sát thiết kế giao diện mẫu (Desktop, Form thêm/sửa, Điện thoại) và thực hiện đầy đủ 12 yêu cầu chức năng (F01 - F12) từ mức Bắt buộc đến Khuyến khích và Nâng cao.

---

## 2. Các giả định nghiệp vụ & Câu hỏi làm rõ
Do yêu cầu từ đề bài mô tả ngắn gọn như khách hàng thực tế, nhóm đã đưa ra các giả định và giải pháp thiết kế chi tiết:

1. **Định dạng tiền tệ:** Số tiền hiển thị theo chuẩn Việt Nam (`vi-VN`), ví dụ `8.500.000 ₫`, có phân cách hàng nghìn bằng dấu chấm và ký hiệu `₫` ở cuối.
2. **Quy tắc ngày tháng:** Các giao dịch được nhóm và lọc theo tháng được chọn (`YYYY-MM`). Mặc định khởi tạo ở tháng có dữ liệu mẫu (Tháng 10/2026 như trong thiết kế mẫu) hoặc tháng hiện tại của người dùng.
3. **Thanh ngân sách và cảnh báo:**
   - Dưới 80%: Mức an toàn, thanh tiến độ xanh, thông báo trạng thái bình thường.
   - Từ 80% đến 100%: Mức cảnh báo (màu vàng hổ phách `#D97706`, nền `#FEF3C7`), hiển thị số tiền còn lại và số ngày còn lại trong tháng.
   - Vượt 100%: Mức nguy hiểm (màu đỏ `#B42318`, nền `#FDECEA`), hiển thị số tiền đã vượt hạn mức.
4. **Bảo mật và an toàn dữ liệu:** Chống tấn công XSS (Cross-Site Scripting) khi người dùng cố tình nhập thẻ HTML/Script vào ô ghi chú.
5. **Khả năng tương thích Excel khi xuất CSV:** Sử dụng UTF-8 Byte Order Mark (`\uFEFF`) để Excel trên Windows/Mac mở file tiếng Việt không bị lỗi hiển thị font.

---

## 3. Nhật ký Prompts chính đã sử dụng với AI

### Giai đoạn 1: Phân tích nghiệp vụ & Bóc tách thiết kế mẫu
* **Prompt 1.1:**
  > "Hãy đọc toàn bộ tài liệu đề bài `De_bai_MoneyNote.docx` và file giao diện mẫu `MoneyNote – Giao diện mẫu.html`. Hãy phân tích cấu trúc 3 màn hình mẫu (Desktop Tổng quan, Form thêm/sửa/xóa, Giao diện Điện thoại) và trích xuất bảng màu, kích thước font, icon Lucide SVG, cũng như 12 yêu cầu nghiệp vụ từ F01 đến F12."
* **Kết quả từ AI:** Bóc tách được 3 màn hình mẫu từ bundle của Claude Artifact, trích xuất mã màu chính (`#1D4ED8`), màu thu (`#0E7A55`), màu chi (`#B42318`), font chữ `Be Vietnam Pro`, cùng bộ danh mục mặc định và dữ liệu mẫu 10 giao dịch.

---

### Giai đoạn 2: Xây dựng cấu trúc HTML5 ngữ nghĩa và giao diện CSS3
* **Prompt 2.1:**
  > "Dựa trên thiết kế mẫu đã bóc tách, hãy xây dựng file `index.html` ngữ nghĩa chuẩn HTML5 và `css/style.css` bằng CSS3 thuần (sử dụng CSS Custom Properties, Flexbox, CSS Grid). Tuyệt đối không dùng Bootstrap/Tailwind. Đảm bảo hỗ trợ:
  > 1. Desktop: Sidebar cố định bên trái, Header chọn tháng, thanh tìm kiếm, 3 thẻ tổng quan (Thu/Chi/Số dư), thanh ngân sách có cảnh báo, bảng giao dịch, biểu đồ chi theo danh mục.
  > 2. Mobile: Thanh điều hướng đáy (Bottom Nav), nút bấm nổi (Floating Action Button - FAB), thẻ số dư tối ưu cho màn hình cảm ứng 390px.
  > 3. Modal: Form Thêm/Sửa giao dịch, Hộp thoại xác nhận xóa, Hộp thoại đặt hạn mức ngân sách, Hộp thoại cài đặt.
  > 4. Chế độ Tối (Dark Mode) chuyển đổi mượt mà qua class `.dark` trên thẻ `body`."
* **Kết quả từ AI:** Sinh mã HTML5 ngữ nghĩa và hệ thống CSS biến token chuẩn, giao diện sắc nét bám sát 100% bản mẫu.

---

### Giai đoạn 3: Phát triển logic ứng dụng JavaScript (F01 – F12)
* **Prompt 3.1:**
  > "Hãy viết file `js/app.js` bằng JavaScript ES6+ thuần (không dùng jQuery/React/Vue). Yêu cầu cấu trúc module hóa rõ ràng:
  > - Quản lý State tập trung (`transactions`, `currentMonth`, `filterType`, `filterCategory`, `searchQuery`, `budgets`, `theme`).
  > - Lưu trữ LocalStorage tự động khôi phục dữ liệu khi tải lại trang.
  > - Xử lý tính toán tổng thu, tổng chi, số dư theo tháng.
  > - CRUD giao dịch: Thêm, Sửa (điền lại form cũ), Xóa (hỏi lại trước khi xóa với card preview).
  > - Validation chặt chẽ: Số tiền > 0, bắt buộc chọn danh mục và ngày, ghi chú tối đa 100 ký tự.
  > - Lọc theo tháng (chuyển tháng tiến/lùi), lọc theo loại Thu/Chi, lọc theo Danh mục, tìm kiếm realtime theo ghi chú.
  > - Tính tiến độ ngân sách và cảnh báo 3 cấp độ (An toàn, Cảnh báo 80%, Vượt hạn mức >100%).
  > - Biểu đồ chi theo danh mục dạng thanh % trực quan.
  > - Chuyển đổi Dark Mode lưu preference vào LocalStorage.
  > - Xuất file CSV có BOM UTF-8 hỗ trợ Excel."
* **Kết quả từ AI:** Sinh toàn bộ logic ứng dụng với đầy đủ hàm xử lý, cấu trúc module dễ đọc, không phát sinh lỗi console.

---

## 4. Bảng tổng hợp lỗi phát hiện, nguyên nhân & giải pháp khắc phục

Trong quá trình phát triển và kiểm thử độc lập, nhóm sinh viên đã chủ động rà soát phát hiện các lỗi phát sinh từ code AI ban đầu và khắc phục triệt để:

| STT | Lỗi phát hiện | Nguyên nhân kỹ thuật | Giải pháp khắc phục đã thực hiện | Kiểm thử sau sửa |
| :---: | :--- | :--- | :--- | :--- |
| **01** | File CSV xuất ra khi mở bằng Microsoft Excel trên Windows bị lỗi font tiếng Việt (vd: "Ăn uống" thành "Ä‚n uá»‘ng"). | Hàm `Blob` tạo CSV dạng text thuần UTF-8 nhưng Excel mặc định mở file CSV theo mã ANSI máy tính nếu không có Byte Order Mark. | Thêm ký tự UTF-8 BOM `\uFEFF` vào đầu nội dung CSV: `new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })`. | Mở file trực tiếp trên Excel 365 và Excel 2016, tất cả ký tự có dấu hiển thị hoàn hảo 100%. |
| **02** | Người dùng nhập số tiền có dấu chấm phân cách (vd `50.000`) bị parse thành `50` thay vì `50000`. | Hàm `Number()` hoặc `parseInt()` mặc định của JS gặp dấu chấm sẽ dừng lại hoặc coi là số thập phân. | Viết hàm `parseAmountInput(val)` loại bỏ toàn bộ ký tự không phải số trước khi parse: `clean = String(val).replace(/[^0-9]/g, '')`. Định dạng lại ô input khi người dùng gõ. | Nhập `50.000`, `1.500.000` đều nhận chính xác giá trị số nguyên. |
| **03** | Nguy cơ XSS nếu người dùng nhập mã HTML/JavaScript vào trường Ghi chú. | Trình duyệt chèn chuỗi trực tiếp vào `.innerHTML` của bảng giao dịch. | Viết hàm `escapeHTML(str)` sử dụng `document.createElement('div').textContent` để mã hóa toàn bộ ký tự đặc biệt (`<`, `>`, `&`, `"`, `'`) trước khi render. | Thử nhập `<script>alert(1)</script>` hoặc `<img src=x onerror=...>`, hệ thống hiển thị chuỗi text thuần an toàn tuyệt đối. |
| **04** | Khi chuyển tháng sang năm trước hoặc năm sau (từ Tháng 1 lui về Tháng 12, hoặc Tháng 12 tiến lên Tháng 1) bị lỗi định dạng tháng. | Thuật toán cộng trừ tháng đơn giản `month + 1` không xử lý tràn biên số tháng từ 12 sang 1 và giảm năm tương ứng. | Viết hàm `changeMonth(offset)` chuẩn: nếu `newMonth > 12` thì gán `newMonth = 1; newYear++`, nếu `newMonth < 1` thì gán `newMonth = 12; newYear--`. | Thử chuyển từ `2026-01` lui 1 tháng ra đúng `2025-12`. |
| **05** | Khi chuyển đổi giữa "Khoản thu" và "Khoản chi" trong form thêm/sửa, danh mục đã chọn trước đó không thuộc loại mới gây lỗi logic. | State `selectedCategoryInForm` giữ nguyên giá trị cũ (vd: đang chọn "Ăn uống" của Chi, khi bấm sang "Khoản thu" thì "Ăn uống" không còn hợp lệ). | Trong hàm `setFormType(type)`, kiểm tra nếu danh mục đang chọn không nằm trong danh sách danh mục của loại mới thì tự động chọn danh mục đầu tiên của loại mới. | Chuyển qua lại giữa Thu và Chi, danh mục luôn đồng bộ chính xác. |
| **06** | Nhập số âm hoặc số 0 trong ô số tiền vẫn gửi được form. | Thiếu bước kiểm tra điều kiện biên `<= 0`. | Bổ sung validation: `if (rawAmount <= 0 || isNaN(rawAmount))` thì gắn class `.has-error`, hiển thị dòng thông báo đỏ và `return` ngăn submit. | Thử bấm lưu khi ô tiền trống, nhập `0`, hoặc `-50000` đều bị chặn kèm thông báo lỗi rõ ràng. |
| **07** | Khi tháng không có bất kỳ khoản chi nào, biểu đồ danh mục bị chia cho 0 (`NaN%`). | Phép tính phần trăm `(amount / totalExpense) * 100` khi `totalExpense = 0` dẫn đến `NaN`. | Bổ sung kiểm tra `if (totalExpense === 0)` thì hiển thị `empty-state` thông báo "Chưa có khoản chi nào trong tháng này." | Giao diện hiển thị trạng thái trống trang nhã, không có lỗi hiển thị. |
| **08** | Modal không đóng được bằng phím Escape hoặc khi bấm ra ngoài vùng tối (Backdrop). | Ban đầu chỉ bắt sự kiện trên nút `X` và nút `Hủy`. | Bổ sung event listener bắt sự kiện phím `keydown === 'Escape'` và sự kiện click vào overlay backdrop để đóng modal. | Trải nghiệm người dùng đạt chuẩn UI/UX hiện đại, thân thiện khi thao tác phím. |

---

## 5. Bảng đối chiếu hoàn thành 12 chức năng (F01 – F12)

| Mã | Tên chức năng | Mức độ | Trạng thái | Chi tiết hiện thực |
| :---: | :--- | :---: | :---: | :--- |
| **F01** | **Tổng quan** | Bắt buộc | **Đã hoàn thành 100%** | Hiển thị Tổng thu (xanh), Tổng chi (đỏ), Số dư (nền xanh đen `#14213D`) của tháng được chọn, định dạng chuẩn tiền Việt Nam (`.toLocaleString('vi-VN') + ' ₫'`). |
| **F02** | **Thêm giao dịch** | Bắt buộc | **Đã hoàn thành 100%** | Form thêm có chọn loại Thu/Chi, số tiền (validate > 0), danh mục dạng lưới có icon/chip, ngày, hình thức thanh toán, ghi chú giới hạn 100 ký tự có đếm ký tự. |
| **F03** | **Danh sách giao dịch** | Bắt buộc | **Đã hoàn thành 100%** | Bảng giao dịch sắp xếp mới nhất lên đầu (theo ngày giảm dần, thời gian tạo). Khoản thu màu xanh có dấu `+`, khoản chi màu đỏ có dấu `−`. Avatar ký tự đầu danh mục đồng bộ màu mẫu. |
| **F04** | **Sửa giao dịch** | Bắt buộc | **Đã hoàn thành 100%** | Bấm nút Sửa (icon bút chì) trên từng dòng giao dịch để mở form, điền sẵn toàn bộ dữ liệu cũ. Lưu lại cập nhật tức thì vào LocalStorage và giao diện. |
| **F05** | **Xóa giao dịch** | Bắt buộc | **Đã hoàn thành 100%** | Bấm nút Xóa (icon thùng rác) mở modal xác nhận có card tóm tắt giao dịch sắp xóa và nút "Không, giữ lại" / "Xóa" an toàn. |
| **F06** | **Lưu dữ liệu** | Bắt buộc | **Đã hoàn thành 100%** | Dữ liệu lưu trong `localStorage`. Tắt trình duyệt hoặc F5 mở lại vẫn nguyên vẹn. Khởi tạo sẵn 12 giao dịch mẫu sinh động khi mở trang lần đầu. |
| **F07** | **Lọc và tìm kiếm** | Khuyến khích | **Đã hoàn thành 100%** | Lọc theo tháng (bộ chuyển tháng `<` `>`), lọc theo loại (Tất cả / Thu / Chi), lọc theo dropdown danh mục, tìm kiếm realtime theo ghi chú. |
| **F08** | **Ngân sách tháng** | Khuyến khích | **Đã hoàn thành 100%** | Đặt hạn mức chi tiêu cho từng tháng (có gợi ý nhanh 3tr, 5tr, 6tr, 10tr). Thanh tiến độ và cảnh báo thông minh 3 mức (An toàn, Cảnh báo 80%, Vượt hạn mức >100%). |
| **F09** | **Thống kê theo danh mục** | Khuyến khích | **Đã hoàn thành 100%** | Tự động tính tổng chi và tỷ lệ % từng danh mục, hiển thị danh sách trực quan với thanh tiến độ màu sắc tương ứng. |
| **F10** | **Giao diện điện thoại** | Khuyến khích | **Đã hoàn thành 100%** | Responsive hoàn hảo trên mobile (390px - 430px). Có nút FAB thêm nhanh, thanh điều hướng đáy (Bottom Nav) 4 mục. |
| **F11** | **Chế độ tối (Dark Mode)** | Nâng cao | **Đã hoàn thành 100%** | Nút chuyển sáng/tối trên Sidebar desktop, Header mobile và màn hình Cài đặt. Tự động lưu trạng thái vào LocalStorage. Bảng màu tối dịu mắt, tương phản cao. |
| **F12** | **Xuất file CSV** | Nâng cao | **Đã hoàn thành 100%** | Nút "Xuất CSV" tải về file giao dịch theo tháng lọc, có chèn UTF-8 BOM chuẩn để mở trực tiếp bằng Microsoft Excel không lỗi font tiếng Việt. |

---

## 6. Kết luận & Bài học kinh nghiệm
- **Hiệu quả của AI:** AI giúp sinh nhanh khung giao diện và cấu trúc code mẫu ban đầu, tiết kiệm 70% thời gian gõ boilerplate code.
- **Vai trò then chốt của con người:** Không thể sao chép mù quáng code AI sinh ra. Sinh viên phải có kiến thức nền tảng vững về DOM, CSS Layout và các trường hợp biên (XSS, UTF-8 BOM cho Excel, edge cases số âm/tràn tháng/rỗng dữ liệu) để kiểm thử, phát hiện lỗi và tối ưu hóa sản phẩm đạt chất lượng cao nhất.

