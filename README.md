# GDGoC PTIT Gen 5 Recruitment

MVP full-stack cho tuyển thành viên: API nộp đơn, dashboard nội bộ có password, Supabase/Postgres và export CSV. Landing page và form UI công khai chưa nằm trong phạm vi này.

## Stack

- Next.js 16 App Router + TypeScript
- Supabase Postgres (`applications.answers` là JSONB)
- Zod validate config và payload ở server
- Tailwind CSS
- CSV export: mở trực tiếp bằng Google Sheets hoặc Excel

CSV được chọn thay Google Sheets API ở MVP vì không cần service account, OAuth hay credentials Google. Đổi lại export là thao tác thủ công, không đồng bộ realtime. Có thể thay endpoint `GET /api/dashboard/export` bằng Sheets API sau này.

## Setup

1. Tạo Supabase project, sau đó chạy migration trong Supabase SQL Editor hoặc Supabase CLI:

   ```bash
   supabase db push
   ```

   Migration: `supabase/migrations/20260817000000_create_applications.sql`.

2. Tạo `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DASHBOARD_PASSWORD=a-long-unique-password
   DASHBOARD_SESSION_SECRET=a-different-long-random-secret
   DASHBOARD_SESSION_HOURS=8
   ```

   Không đặt `SUPABASE_SERVICE_ROLE_KEY` ở client hoặc biến `NEXT_PUBLIC_*`; key này chỉ được dùng trong server routes/pages.

3. Cài và chạy:

   ```bash
   npm install
   npm run dev
   ```

Dashboard ở `http://localhost:3000/dashboard`. Đăng nhập qua `/dashboard/login`.

## Config động

Chỉ cần sửa JSON (không đổi schema database):

- `config/questions.json`: discriminated union `multiple_choice` / `essay`.
- `config/majors.json`: danh sách option ngành.
- `config/departments.json`: danh sách ban chuyên môn.
- `config/settings.json`: `applicationOpenAt`, `applicationCloseAt` ISO-8601 có timezone. API tự chặn nộp ngoài khoảng thời gian này.

Config được import vào bundle server; sau khi đổi config hãy redeploy trên Vercel (hoặc restart server dev) để áp dụng.

## API

### Submit application

`POST /api/apply` (public). Câu trả lời multiple choice lưu option id, tự luận lưu string.

```bash
curl -X POST http://localhost:3000/api/apply \
  -H 'Content-Type: application/json' \
  -d '{
    "full_name":"Nguyễn Văn A",
    "email":"a@example.com",
    "phone":"0900000000",
    "facebook_url":"https://facebook.com/example",
    "student_year":2,
    "student_id":"B22DCCN001",
    "date_of_birth":"2004-01-15",
    "university":"Học viện Công nghệ Bưu chính Viễn thông",
    "department":"tech",
    "gender":"male",
    "major":"cntt",
    "answers":[
      {"question_id":"motivation","value":"Tôi muốn đóng góp cho cộng đồng công nghệ PTIT và học hỏi từ các dự án thực tế."},
      {"question_id":"interests","value":["technology","community"]},
      {"question_id":"commitment","value":"yes"}
    ]
  }'
```

Các endpoint dashboard yêu cầu session cookie:

- `GET /api/dashboard/applications?status=&major=&search=&page=&pageSize=`
- `PATCH /api/dashboard/applications/:id` body `{ "status": "approved" | "rejected" }`
- `GET /api/dashboard/export` tải toàn bộ đơn CSV; option id được chuyển thành nhãn.

## Deploy Vercel

Kết nối repository với Vercel, thêm bốn biến môi trường ở trên cho Production/Preview, rồi deploy. Không thêm service role key vào source control.

## Validation

```bash
npm run lint
npm run build
```
