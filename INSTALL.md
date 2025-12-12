# Hướng Dẫn Cài Đặt Chi Tiết

Tài liệu này hướng dẫn chi tiết cách cài đặt và chạy dự án **Web Hospital** trên một máy tính mới.

## 1. Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các phần mềm sau:

-   **Node.js**: Phiên bản 18 trở lên. [Tải tại đây](https://nodejs.org/).
-   **Git**: Để tải mã nguồn về. [Tải tại đây](https://git-scm.com/).
-   **Trình quản lý gói (npm)**: Thường đi kèm khi cài Node.js.

## 2. Tải Mã Nguồn

Mở terminal (hoặc Command Prompt/PowerShell) và chạy lệnh sau để tải dự án về:

```bash
git clone <đường-dẫn-git-repo-của-bạn>
cd web_hospital
```

## 3. Cài Đặt Server (Backend)

Server chịu trách nhiệm xử lý dữ liệu và kết nối với cơ sở dữ liệu Firebase.

1.  **Di chuyển vào thư mục server:**
    ```bash
    cd server
    ```

2.  **Cài đặt các thư viện phụ thuộc:**
    ```bash
    npm install
    ```

3.  **Cấu hình Firebase (QUAN TRỌNG):**
    -   Dự án sử dụng Firebase Admin SDK để kết nối database.
    -   Bạn cần có file `service-account.json` chứa khóa bí mật từ Firebase Console.
    -   **Bước thực hiện:**
        1.  Truy cập [Firebase Console](https://console.firebase.google.com/).
        2.  Vào **Project Settings** -> **Service accounts**.
        3.  Nhấn **Generate new private key** để tải file JSON về.
        4.  Đổi tên file thành `service-account.json`.
        5.  Copy file này vào thư mục gốc của server: `web_hospital/server/service-account.json`.

4.  **Cấu hình biến môi trường (Tùy chọn):**
    -   Mặc định server chạy trên port `8080`.
    -   Nếu muốn đổi port, tạo file `.env` trong thư mục `server` và thêm dòng: `PORT=3000` (hoặc port bạn muốn).

5.  **Chạy Server:**
    ```bash
    npm run dev
    ```
    -   Khi thấy thông báo `Server is running on port 8080` và `Firestore connected successfully`, server đã sẵn sàng.

## 4. Cài Đặt Client (Frontend)

Client là giao diện người dùng chạy trên trình duyệt.

1.  **Mở một terminal mới** (giữ terminal server đang chạy).

2.  **Di chuyển vào thư mục client:**
    ```bash
    cd client
    ```
    *(Nếu đang ở thư mục server, dùng `cd ../client`)*

3.  **Cài đặt thư viện:**
    ```bash
    npm install
    ```

4.  **Cấu hình (Nếu cần thiết):**
    -   **API URL**: Mặc định client kết nối tới `http://127.0.0.1:8080`. Nếu bạn chạy server trên máy khác hoặc port khác, hãy sửa file `client/src/config/axios.ts`.
    -   **Firebase Config**: Thông tin kết nối Firebase Client nằm trong `client/src/config/firebase.ts`. Nếu dùng dự án Firebase khác, hãy cập nhật file này.

5.  **Chạy ứng dụng:**
    ```bash
    npm run dev
    ```
    -   Truy cập địa chỉ hiện ra trên terminal (thường là `http://localhost:5173`) để sử dụng web.

## 5. Tóm Tắt Các Bước Chạy Lại Sau Này

Mỗi lần muốn chạy web, bạn cần mở 2 cửa sổ terminal:

**Terminal 1 (Server):**
```bash
cd server
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```
