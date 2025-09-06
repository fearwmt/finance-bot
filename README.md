# Finance Bot 💰
Mini AI Finance Assistant (NestJS + Next.js)

## Run Backend
cd finance-bot-backend
npm install
npm run start:dev

## Run Frontend
cd finance-bot-frontend
npm install
npm run dev

## สร้างไฟล์ .env ในโฟลเดอร์ finance-bot-backend แล้วใส่ค่าOPENAI_API_KEYที่ส่งให้ทางอีเมล

## Features
- บันทึกรายรับ/รายจ่าย ได้ด้วยการพิมพ์ข้อความธรรมดา เช่น `เงินเดือน 25000` หรือ `กาแฟ 50` 
- แสดง **สรุปการเงิน** (Income, Expense, Balance)
- คำนวณ **Forecast สิ้นเดือน** จากค่าใช้จ่ายเฉลี่ย
- ถาม-ตอบทั่วไปได้เหมือน ChatGPT เช่น `เล่าเรื่องตลก`, `AI คืออะไร?`

