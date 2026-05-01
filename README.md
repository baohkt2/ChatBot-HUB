# Cổng Thông Tin Tư Vấn Tuyển Sinh Đào Tạo Từ Xa HUB (HUB AI Chatbot)

Cổng thông tin tư vấn tuyển sinh và hỗ trợ hỏi đáp trực tuyến sử dụng trí tuệ nhân tạo dành cho hệ đào tạo từ xa của **Trường Đại học Ngân hàng TP.HCM (HUB)**.

## 🚀 Tính Năng Chính

- **Hỏi đáp AI:** Trợ lý ảo hỗ trợ trả lời mọi thắc mắc về chương trình đào tạo, học phí, văn bằng, điều kiện xét tuyển linh hoạt 24/7.
- **Thông tin tổng quan:** Tra cứu nhanh chóng mức học phí, thời gian và hình thức đào tạo.
- **Danh sách ngành đào tạo:** Chi tiết về 5 ngành đào tạo trọng điểm (Ngôn ngữ Anh, Luật Kinh tế, Quản trị Kinh doanh, Kế toán, Tài chính - Ngân hàng).
- **Liên hệ:** Thông tin kết nối hotline, email, website và địa chỉ nộp hồ sơ tại các cơ sở.

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS v4, Lucide React Icons
- **Bundler:** Vite
- **AI Integration:** Groq API / Gemini API (Hỗ trợ fallback thông minh bằng cơ sở dữ liệu cục bộ).

## 💻 Hướng Dẫn Cài Đặt và Chạy Cục Bộ

### Yêu cầu hệ thống:
- Đã cài đặt **Node.js** (Phiên bản LTS được khuyến nghị)

### Các bước thực hiện:

1. **Clone repository:**
   ```bash
   git clone <repository_url>
   cd hub-distance-learning-ai-chatbot
   ```

2. **Cài đặt các dependencies:**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo file `.env.local` hoặc chỉnh sửa file `.env` và thêm key API:
   ```env
   GROQ_API_KEY="your_groq_api_key_here"
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Chạy ứng dụng ở chế độ phát triển:**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ mặc định: [http://localhost:3000](http://localhost:3000)

## 📦 Xây Dựng Bản Production

Để build ứng dụng cho môi trường production:
```bash
npm run build
```
Bản build sẽ được tạo trong thư mục `dist`.
