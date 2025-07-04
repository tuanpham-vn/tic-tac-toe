# Yêu Cầu Tạo Game Cờ Ca-rô

## 1. Cấu trúc cơ bản
- Bảng 10x10 ô
- Điều kiện thắng: 5 ô liên tiếp (ngang, dọc hoặc chéo)
- Hai người chơi lần lượt đánh X và O
- Tên mặc định: "Méo" (X) và "Cù" (O)
- Người thua được đánh trước ở ván tiếp theo

## 2. Giao diện người chơi
- Layout 3 cột: Thông tin người chơi 1 - Bảng chơi - Thông tin người chơi 2
- Mỗi người chơi hiển thị:
  + Avatar động vật (từ Font Awesome)
  + Ô nhập tên (có thể chỉnh sửa)
  + Điểm số
  + Ký hiệu đánh (X/O)
- Nút điều khiển: "Bắt đầu", "Chơi Lại", "Chơi Tiếp"

## 3. Hiệu ứng và Animation

### a) Avatar người chơi
- Nền màu xanh nhạt (#e8f5e9)
- Nền đậm hơn khi đến lượt (#d8f485)
- Vòng tròn pulse animation màu đỏ/xanh theo người chơi
- Hiệu ứng lắc lư khi đến lượt

### b) Hiệu ứng chiến thắng
- 5 ô thắng hiển thị icon mặt cười (fa-face-laugh-wink) màu vàng
- Animation: xoay 5 độ và phóng to
- Thông báo chiến thắng sau 3 giây với:
  + Avatar người thắng
  + Tên người thắng
  + Lời chúc mừng ngẫu nhiên (từ danh sách có sẵn)

## 4. Danh sách lời chúc mừng
```javascript
const congratMessages = [
    "🎉 Xuất sắc! Bạn đã chiến thắng một cách đầy thuyết phục!",
    "🌟 Wow! Đúng là bậc thầy cờ ca-rô!",
    "🏆 Chiến thắng tuyệt vời! Đối thủ không có cửa!",
    "👑 Quá đỉnh! Xứng đáng là nhà vô địch!",
    "🎮 Game hay quá! Thắng đẹp như phim!",
    "⭐ Đẳng cấp! Không ai cản được bạn!",
    "🎯 Chính xác từng nước đi! Quá xuất sắc!",
    "🌈 Tuyệt vời ông mặt trời! Thắng quá xứng đáng!",
    "💫 Siêu sao cờ ca-rô đây rồi!",
    "🔥 Quá hot! Đối thủ phải chào thua!",
    "🎉 Đẹp trai quá! Đối thủ không thể chịu được!",
    "🔥 Đỉnh nóc kịch trần bay phấp phới!"
];
```

## 5. Responsive Design
- Desktop: Layout 3 cột với khoảng cách rộng rãi
- Mobile (iPhone 11 - 414x896):
  + Layout dọc
  + Font size và padding nhỏ hơn
  + Ẩn các góc trang trí
  + Tự động co giãn bảng theo màn hình

## 6. Màu sắc chủ đạo
- Player 1 (X): Màu đỏ (#ff6b6b)
- Player 2 (O): Màu xanh (#0000ff)
- Nền: Màu xám nhạt (#f9f7f7)
- Font: Fredoka
- Viền bảng: Màu vàng (#ffd868)

## 7. Chi tiết thông báo chiến thắng
- Overlay toàn màn hình (rgba(0, 0, 0, .9))
- Nội dung trong khung (rgba(255, 255, 255, 0.3))
- Animation fadeIn từ trên xuống
- Hiển thị: Avatar, tên người thắng, lời chúc mừng
- Nút "Chơi Tiếp" để bắt đầu ván mới

## 8. Tính năng bổ sung
- Click vào avatar để đổi
- Hiệu ứng nhấp nháy cho nút "Bắt đầu" khi click vào bảng trước khi bắt đầu game
- Lưu người thắng/thua để xác định người đi trước ở ván tiếp theo
- Tự động cập nhật và hiển thị điểm số

## Yêu cầu kỹ thuật
- Sử dụng HTML5, CSS3, và JavaScript thuần
- Font Awesome cho các icon
- Font Google Fredoka
- Responsive design
- Animation mượt mà với transform và transition # tic-tac-toe
Game for my daughter
