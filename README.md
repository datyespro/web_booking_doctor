# Hướng dẫn Cài đặt và Chạy Dự án

Dự án này bao gồm hai phần: `client` (Frontend) và `server` (Backend).

## Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên được khuyến nghị)
- npm (thường đi kèm với Node.js)

## 1. Cài đặt Server (Backend)

1. Mở terminal và di chuyển vào thư mục `server`:
   ```bash
   cd server
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Cấu hình Firebase:
   - Bạn cần có file `service-account.json` từ Firebase Console.
   - Đặt file này vào thư mục gốc của `server` (`server/service-account.json`).
4. Chạy server:
   ```bash
   npm run dev
   ```
   Server sẽ chạy tại `http://localhost:8080`.

## 2. Cài đặt Client (Frontend)

1. Mở một terminal mới và di chuyển vào thư mục `client`:
   ```bash
   cd client
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Chạy ứng dụng:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đang bận).

## Lưu ý
- Đảm bảo cả hai terminal (server và client) đều đang chạy khi phát triển.
- Nếu gặp lỗi kết nối database, hãy kiểm tra lại file `service-account.json`.

## Hướng dẫn chi tiết
Để xem hướng dẫn cài đặt chi tiết trên máy mới (bao gồm cấu hình môi trường và tải mã nguồn), vui lòng xem file [INSTALL.md](INSTALL.md).
