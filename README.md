# ระบบจองเวลานัดหมาย DN Center

## ภาพรวมของระบบ

ระบบจองเวลาเข้าพบทีมจัดซื้อของ DN Center เป็นเว็บแอปพลิเคชันแบบ Single-Page Application ที่พัฒนาด้วย HTML, CSS และ JavaScript แบบ Vanilla (ไม่ใช้ Framework)

**ไฟล์หลัก:** `index.html`

---

## ฟีเจอร์หลักของระบบ

### 1. ปฏิทินเลือกวันที่
- แสดงปฏิทินรายเดือนพร้อมปุ่มเปลี่ยนเดือน (ย้อนกลับ/ถัดไป)
- ไฮไลท์วันที่ปัจจุบันด้วยสีส้ม
- ปิดการใช้งานวันที่ผ่านมาแล้ว (ไม่สามารถจองย้อนหลังได้)
- แสดงวันที่ที่เลือกด้วยสีม่วง
- รองรับการแสดงผลภาษาไทย

**ที่อยู่ในโค้ด:** บรรทัด 626-655

### 2. ช่วงเวลาที่ว่าง
- ช่วงเช้า: 09:00 - 11:30 น.
- ช่วงบ่าย: 14:00 - 16:30 น.
- ช่วงเวลาละ 30 นาที (รวม 12 ช่วงเวลาต่อวัน)
- แสดงสถานะว่าง/ไม่ว่างของแต่ละช่วงเวลา
- ปัจจุบันใช้ระบบสุ่มสถานะความว่าง (70% จะว่าง)

**ที่อยู่ในโค้ด:** บรรทัด 657-677, 868-894

### 3. ฟอร์มข้อมูลการนัดหมาย

**ข้อมูลที่จำเป็น (Required):**
- ชื่อบริษัท
- ชื่อผู้เข้าพบ
- เบอร์โทรศัพท์
- อีเมล

**ข้อมูลเพิ่มเติม (Optional):**
- สินค้าที่แนะนำ
- หมายเหตุเพิ่มเติม

**ที่อยู่ในโค้ด:** บรรทัด 680-721

### 4. หน้ายืนยันการจอง
- แสดงแอนิเมชันความสำเร็จ (เครื่องหมายถูก)
- สรุปข้อมูลการจองทั้งหมด
- ปุ่มสำหรับสร้างนัดหมายใหม่

**ที่อยู่ในโค้ด:** บรรทัด 724-770

### 5. แบนเนอร์ประกาศ
- แสดงข่าวสารและประกาศสำคัญ
- ปัจจุบันฮาร์ดโค้ดในไฟล์ (วันหยุดเดือนตุลาคม, เอกสารประกอบ)

**ที่อยู่ในโค้ด:** บรรทัด 612-621

---

## โครงสร้างเทคนิค

### State Management

```javascript
const state = {
    currentDate: new Date(),    // เดือน/ปีที่กำลังแสดงในปฏิทิน
    selectedDate: null,         // วันที่ที่ผู้ใช้เลือก
    selectedTimeSlot: null      // ช่วงเวลาที่ผู้ใช้เลือก
};
```

**ที่อยู่ในโค้ด:** บรรทัด 777-781

### ฟังก์ชันหลัก

| ฟังก์ชัน | หน้าที่ | ที่อยู่ในโค้ด |
|---------|---------|---------------|
| `generateCalendar()` | สร้างตารางปฏิทินรายเดือน | 790-847 |
| `selectDate()` | จัดการเมื่อผู้ใช้เลือกวันที่ | 850-865 |
| `generateTimeSlots()` | สร้างช่วงเวลาที่ว่าง | 868-894 |
| `selectTimeSlot()` | จัดการเมื่อผู้ใช้เลือกเวลา | 897-911 |
| `updateBookingSummary()` | อัพเดทข้อมูลสรุปการจอง | 914-939 |
| `updateMonthDisplay()` | อัพเดทการแสดงเดือน/ปี | 784-787 |

### ระบบสี (Color Scheme)

```css
--primary-color: #5c199a;      /* สีม่วงหลัก (DN Center Brand) */
--primary-light: #7731d8;      /* สีม่วงอ่อน */
--primary-dark: #3f0f70;       /* สีม่วงเข้ม */
--success-color: #12b76a;      /* สีเขียว (สำเร็จ) */
--warning-color: #f59e0b;      /* สีเหลือง (คำเตือน) */
--error-color: #ef4444;        /* สีแดง (ข้อผิดพลาด) */
```

**วันที่ปัจจุบัน:** สีส้ม (#ff9013)

**ที่อยู่ในโค้ด:** บรรทัด 9-30

### Responsive Design

| ขนาดหน้าจอ | เลย์เอาท์ |
|------------|----------|
| Desktop | 2 คอลัมน์ (ปฏิทิน + เวลา) |
| Tablet (≤768px) | 1 คอลัมน์ เรียงซ้อนกัน |
| Mobile (≤480px) | 1 คอลัมน์ + ช่วงเวลา 1 คอลัมน์ |

**ที่อยู่ในโค้ด:** บรรทัด 554-600

---

## จุดเด่นของระบบ

✅ **UI/UX ที่ทันสมัย** - ใช้ Gradient, Shadow และ Transition ที่ลื่นไหล
✅ **รองรับภาษาไทย** - ใช้ `Intl.DateTimeFormat` สำหรับการแสดงวันที่
✅ **Accessibility** - มี Label แบบ `sr-only` สำหรับ Screen Reader
✅ **ป้องกันการจองย้อนหลัง** - ปิดการใช้งานวันที่ในอดีต
✅ **Visual Feedback** - ทุกการกระทำมี Feedback ที่ชัดเจน
✅ **Responsive** - รองรับทุกขนาดหน้าจอ

---

## ข้อจำกัดและจุดที่ต้องพัฒนา

### 🔴 จุดสำคัญที่ต้องแก้ไข

#### 1. **ไม่มีการเชื่อมต่อ Backend**
- **ปัญหา:** ข้อมูลการจองไม่ถูกบันทึกไว้ที่ไหน (บรรทัด 959-984)
- **แนะนำ:** ต้องพัฒนา API Endpoint สำหรับ:
  - บันทึกข้อมูลการจอง
  - ดึงข้อมูลช่วงเวลาที่ว่าง
  - ตรวจสอบการจองซ้ำ
  - ส่งอีเมลยืนยัน

#### 2. **ระบบตรวจสอบความว่างแบบ Mock**
- **ปัญหา:** ใช้ `Math.random()` ในการกำหนดว่าช่วงไหนว่าง (บรรทัด 884)
- **แนะนำ:** เชื่อมต่อกับฐานข้อมูลเพื่อดึงข้อมูลความว่างจริง

#### 3. **ไม่มีการตรวจสอบความถูกต้องของข้อมูล**
- **ปัญหา:** ไม่มี Validation สำหรับรูปแบบเบอร์โทรและอีเมล
- **แนะนำ:** เพิ่ม Pattern Validation และ Error Message

#### 4. **ไม่มีการป้องกันการจองซ้ำ**
- **ปัญหา:** หลายคนสามารถจองวันเดียวกัน เวลาเดียวกันได้
- **แนะนำ:** ต้องมีระบบ Lock หรือ Real-time Update

#### 5. **ประกาศข่าวสารแบบ Hardcode**
- **ปัญหา:** ข้อความประกาศฝังอยู่ในโค้ด (บรรทัด 617-618)
- **แนะนำ:** ดึงข้อมูลจาก CMS หรือ Config File

### 🟡 จุดที่ควรปรับปรุง

#### 6. **ไม่มีการจัดการ Timezone**
- อาจเกิดปัญหาหากผู้ใช้อยู่ต่างโซนเวลา
- ควรเก็บวันที่/เวลาในรูปแบบ UTC

#### 7. **ไม่มี Loading State**
- ควรมี Spinner หรือ Skeleton Screen ขณะโหลดข้อมูล

#### 8. **ไม่มี Error Handling**
- ถ้า API ล้มเหลว ผู้ใช้จะไม่รู้ว่าเกิดอะไรขึ้น
- ควรมี Error Message และ Retry Logic

#### 9. **ไฟล์ Background Image**
- Path: `'./2kcpsm3cl5.jpg'` (บรรทัด 41)
- ต้องตรวจสอบว่าไฟล์มีอยู่จริง

#### 10. **ข้อความขาดหาย**
- Label "วันที่:" หายไปในบรรทัด 921
- ควรเพิ่ม: `<strong>วันที่:</strong>`

---

## แผนการพัฒนาที่แนะนำ

### Phase 1: Backend Integration (สำคัญที่สุด)

**1.1 สร้าง Database Schema**
```sql
-- ตาราง appointments
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    visitor_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    recommended_product VARCHAR(255),
    notes TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_appointment (appointment_date, appointment_time)
);

-- ตาราง time_slots
CREATE TABLE time_slots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    max_bookings INT DEFAULT 1,
    current_bookings INT DEFAULT 0
);

-- ตาราง announcements
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE
);
```

**1.2 สร้าง API Endpoints**

| Method | Endpoint | หน้าที่ |
|--------|----------|---------|
| GET | `/api/time-slots?date=YYYY-MM-DD` | ดึงช่วงเวลาที่ว่างในวันที่กำหนด |
| POST | `/api/appointments` | บันทึกการจองใหม่ |
| GET | `/api/appointments/:id` | ดูรายละเอียดการจอง |
| PUT | `/api/appointments/:id` | แก้ไขการจอง |
| DELETE | `/api/appointments/:id` | ยกเลิกการจอง |
| GET | `/api/announcements` | ดึงประกาศที่ Active |

**1.3 ตัวอย่าง API Response**

```json
// GET /api/time-slots?date=2025-11-05
{
  "date": "2025-11-05",
  "slots": [
    { "time": "09:00", "available": true },
    { "time": "09:30", "available": false },
    { "time": "10:00", "available": true }
  ]
}

// POST /api/appointments
{
  "appointment_date": "2025-11-05",
  "appointment_time": "10:00",
  "company_name": "บริษัท ABC จำกัด",
  "visitor_name": "คุณสมชาย",
  "phone": "081-234-5678",
  "email": "somchai@abc.com",
  "recommended_product": "สินค้า XYZ",
  "notes": "ต้องการดูตัวอย่างสินค้า"
}
```

### Phase 2: Form Validation

**2.1 เพิ่ม Client-side Validation**
```javascript
// ตรวจสอบเบอร์โทร (รูปแบบไทย)
const phonePattern = /^0[0-9]{1,2}-?[0-9]{3}-?[0-9]{4}$/;

// ตรวจสอบอีเมล
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// แสดง Error Message แบบ Real-time
```

**2.2 เพิ่ม Server-side Validation**
- Double-check ทุกข้อมูลที่ส่งมาจาก Client
- ป้องกัน SQL Injection และ XSS

### Phase 3: Email Notification

**3.1 ส่งอีเมลยืนยันหลังจอง**
- ใช้ SMTP Service (เช่น SendGrid, AWS SES)
- Template สำหรับอีเมลยืนยัน
- รวม iCalendar (.ics) สำหรับเพิ่มใน Google Calendar

**3.2 ส่งอีเมลเตือนก่อนนัดหมาย**
- ส่งล่วงหน้า 1 วันและ 1 ชั่วโมง
- ใช้ Cron Job หรือ Queue System

### Phase 4: Admin Panel

**4.1 หน้าจัดการการจอง**
- ดูรายการจองทั้งหมด
- ยืนยัน/ยกเลิกการจอง
- ปิด-เปิดช่วงเวลา

**4.2 หน้าจัดการประกาศ**
- เพิ่ม/แก้ไข/ลบประกาศ
- กำหนดวันที่แสดง

**4.3 หน้า Dashboard**
- สถิติการจอง
- อัตราการยกเลิก
- ช่วงเวลาที่นิยม

### Phase 5: Improvements

**5.1 เพิ่ม Features**
- ระบบค้นหาการจอง (ใส่อีเมลหรือเบอร์โทร)
- ระบบแก้ไข/ยกเลิกการจอง
- Google Calendar / Outlook Integration
- LINE Notify สำหรับการแจ้งเตือน
- Multi-language Support (ไทย/อังกฤษ)

**5.2 Performance**
- ใช้ CDN สำหรับ Static Files
- Lazy Loading สำหรับ Images
- Caching API Responses

**5.3 Security**
- HTTPS บังคับ
- CSRF Protection
- Rate Limiting สำหรับ API
- Captcha สำหรับป้องกัน Bot

---

## การติดตั้งและใช้งาน

### ปัจจุบัน (Frontend Only)
1. วางไฟล์ `index.html` และ `2kcpsm3cl5.jpg` ในโฟลเดอร์เดียวกัน
2. เปิดไฟล์ `index.html` ด้วย Web Browser
3. ระบบจะทำงานแบบ Offline (ไม่บันทึกข้อมูล)

### อนาคต (Full Stack)
```bash
# Frontend
npm install
npm run build

# Backend
cd backend
npm install
npm run migrate
npm run start

# ตั้งค่า Environment Variables
DATABASE_URL=mysql://user:pass@localhost:3306/dnbooking
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

---

## โครงสร้างไฟล์ที่แนะนำ

```
DN-Booking/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── calendar.js
│   │   ├── booking.js
│   │   └── api.js
│   └── assets/
│       └── images/
│           └── background.jpg
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── appointmentController.js
│   │   │   └── timeslotController.js
│   │   ├── models/
│   │   │   ├── Appointment.js
│   │   │   └── TimeSlot.js
│   │   ├── routes/
│   │   │   └── api.js
│   │   ├── services/
│   │   │   ├── emailService.js
│   │   │   └── notificationService.js
│   │   └── middleware/
│   │       ├── validation.js
│   │       └── auth.js
│   ├── config/
│   │   └── database.js
│   └── package.json
├── admin/
│   └── dashboard.html
└── README.md
```

---

## เทคโนโลยีที่แนะนำ

### Backend
- **Node.js + Express** หรือ **PHP + Laravel**
- **MySQL** หรือ **PostgreSQL** สำหรับฐานข้อมูล
- **Redis** สำหรับ Caching

### Frontend (ถ้าต้องการ Refactor)
- **Vue.js** หรือ **React** - สำหรับ Component-based
- **Tailwind CSS** - สำหรับ Styling
- **Axios** - สำหรับ HTTP Requests

### Email & Notification
- **SendGrid** หรือ **AWS SES** - สำหรับ Email
- **LINE Notify API** - สำหรับแจ้งเตือนผ่าน LINE

### Deployment
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** AWS EC2, DigitalOcean, Heroku
- **Database:** AWS RDS, DigitalOcean Managed Databases

---

## ข้อควรระวัง

### Security
1. **ป้องกัน SQL Injection** - ใช้ Prepared Statements
2. **ป้องกัน XSS** - Sanitize Input ทั้ง Client และ Server
3. **ป้องกัน CSRF** - ใช้ CSRF Token
4. **Rate Limiting** - จำกัดจำนวน Request ต่อ IP

### Performance
1. **Database Indexing** - สร้าง Index สำหรับ `appointment_date` และ `appointment_time`
2. **Caching** - Cache ช่วงเวลาที่ว่างอย่างน้อย 5 นาที
3. **Connection Pooling** - ใช้ Connection Pool สำหรับ Database

### UX
1. **Loading States** - แสดงสถานะการโหลด
2. **Error Messages** - ข้อความผิดพลาดต้องชัดเจนเป็นภาษาไทย
3. **Confirmation** - ยืนยันก่อนยกเลิกการจอง

---

## ติดต่อและสนับสนุน

หากมีข้อสงสัยเกี่ยวกับระบบนี้ กรุณาติดต่อทีมพัฒนา:
- **อีเมล:** dev-team@dncenter.com
- **LINE:** @dncenter-dev

---

## License

© 2025 DN Center - All Rights Reserved

---

**เอกสารนี้สร้างขึ้นเมื่อ:** 2 พฤศจิกายน 2568
**เวอร์ชัน:** 1.0
**ผู้จัดทำ:** Development Team
