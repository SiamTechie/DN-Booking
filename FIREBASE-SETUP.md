# คู่มือตั้งค่า Firebase Firestore สำหรับระบบจองนัดหมาย DN Center

## ภาพรวม
ระบบจองนัดหมาย DN Center ได้ถูกอัพเกรดให้ใช้ Firebase Firestore เป็นฐานข้อมูล แทนการใช้ LocalStorage ซึ่งจะทำให้:
- ข้อมูลการจองถูกเก็บบน Cloud แทนในเบราว์เซอร์
- สามารถเข้าถึงข้อมูลได้จากหลายอุปกรณ์
- มีการอัพเดทข้อมูลแบบ Real-time
- ข้อมูลปลอดภัยและมี Backup อัตโนมัติ

## ขั้นตอนการตั้งค่า Firebase

### 1. รับ Firebase Configuration

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือกโปรเจค `booking-475115` ของคุณ
3. ไปที่ **Project Settings** (ไอคอนเฟือง) > **General**
4. เลื่อนลงไปที่ส่วน **Your apps**
5. ถ้ายังไม่มี Web App:
   - คลิก **Add app** > เลือก **Web** (ไอคอน `</>`)
   - ตั้งชื่อแอป เช่น "DN Booking Web App"
   - เช็คถูก **Also set up Firebase Hosting**
   - คลิก **Register app**
6. คัดลอก Firebase Configuration Object ที่แสดงขึ้นมา จะมีรูปแบบประมาณนี้:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "booking-475115.firebaseapp.com",
  projectId: "booking-475115",
  storageBucket: "booking-475115.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

### 2. อัพเดท Firebase Config ใน index.html

1. เปิดไฟล์ `index.html`
2. ค้นหาบรรทัดที่มี `// TODO: Replace with actual Firebase config`
3. แทนที่ค่า `YOUR_API_KEY`, `YOUR_MESSAGING_SENDER_ID`, และ `YOUR_APP_ID` ด้วยค่าจริงจาก Firebase Console:

```javascript
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // แทนที่ด้วย apiKey จริง
    authDomain: "booking-475115.firebaseapp.com",
    projectId: "booking-475115",
    storageBucket: "booking-475115.firebasestorage.app",
    messagingSenderId: "123456789012", // แทนที่ด้วย messagingSenderId จริง
    appId: "1:123456789012:web:abcdefghijklmnop" // แทนที่ด้วย appId จริง
};
```

### 3. อัพเดท Firebase Config ใน admin.html

ทำแบบเดียวกันใน `admin.html` - ค้นหา `// TODO: Replace with actual Firebase config` และอัพเดทค่าต่างๆ ให้ตรงกับใน index.html

### 4. Deploy Firestore Rules

Firestore Rules กำหนดว่าใครสามารถอ่านหรือเขียนข้อมูลได้ ไฟล์ `firestore.rules` ได้ถูกอัพเดทแล้ว ให้ deploy ด้วยคำสั่ง:

```bash
firebase deploy --only firestore:rules
```

หรือ deploy ทั้งหมดพร้อมกัน:

```bash
firebase deploy
```

### 5. ทดสอบระบบ

#### ทดสอบการจองใหม่:
1. เปิดหน้า `index.html`
2. เลือกวันที่และเวลา
3. กรอกข้อมูลการจอง
4. กดยืนยันการจอง
5. เปิด Firebase Console > Firestore Database
6. ตรวจสอบว่ามีข้อมูลใน collection `bookings`

#### ทดสอบ Real-time Updates:
1. เปิดหน้า `admin.html` ในหนึ่งแท็บ
2. เปิดหน้า `index.html` ในอีกหนึ่งแท็บ
3. สร้างการจองใหม่จาก `index.html`
4. ตรวจสอบว่าการจองปรากฏทันทีในหน้า `admin.html` (ไม่ต้องรีเฟรช)

#### ทดสอบการแก้ไข/ลบ:
1. เข้าหน้า `admin.html`
2. แก้ไขการจอง - ตรวจสอบว่าอัพเดทใน Firestore
3. ลบการจอง - ตรวจสอบว่าถูกลบใน Firestore

## โครงสร้างข้อมูลใน Firestore

### Collection: `bookings`
แต่ละ document ใน collection นี้มีโครงสร้างดังนี้:

```javascript
{
  id: "auto-generated-id",
  date: "2024-12-25",           // รูปแบบ YYYY-MM-DD
  time: "09:00",                 // รูปแบบ HH:MM
  companyName: "ชื่อบริษัท",
  visitorName: "ชื่อผู้เข้าพบ",
  phone: "081-234-5678",
  email: "example@company.com",
  recommendedProduct: "สินค้าที่แนะนำ",
  notes: "หมายเหตุ",
  createdAt: "2024-12-15T10:30:00.000Z",  // ISO timestamp
  updatedAt: "2024-12-15T11:00:00.000Z"   // ISO timestamp (ถ้ามีการแก้ไข)
}
```

### Collection: `settings`
มี document เดียว (ID: `main`) ที่เก็บการตั้งค่าทั้งหมด:

```javascript
{
  operatingDays: [1, 2, 3, 4, 5],  // วันที่เปิดทำการ (0=อาทิตย์, 1=จันทร์, ...)
  closedDates: [                    // วันหยุดพิเศษ
    "2024-12-25",
    "2025-01-01"
  ],
  timeSlots: [                      // ช่วงเวลาที่เปิดให้จอง
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ],
  announcements: [                  // ประกาศต่างๆ
    {
      id: "announce-1",
      message: "ข้อความประกาศ"
    }
  ]
}
```

## Firestore Security Rules

ไฟล์ `firestore.rules` มีการตั้งค่าความปลอดภัยดังนี้:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Settings collection - ทุกคนอ่านได้, เฉพาะ authenticated users เขียนได้
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Bookings collection - ทุกคนอ่านและสร้างได้, เฉพาะ authenticated users แก้ไข/ลบได้
    match /bookings/{bookingId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

**สิทธิ์การเข้าถึง:**
- **อ่านข้อมูล (read)**: ทุกคนสามารถอ่านการตั้งค่าและรายการจองได้
- **สร้างการจอง (create)**: ทุกคนสามารถสร้างการจองใหม่ได้
- **แก้ไข/ลบ (update/delete)**: ต้อง authenticate ก่อน (ผ่านหน้า admin)

## ฟีเจอร์ Real-time Updates

### ในหน้า admin.html:

1. **Firestore Listener**: ระบบจะอัพเดททันทีเมื่อมีการเปลี่ยนแปลงข้อมูลใน Firestore
   ```javascript
   db.collection('bookings').onSnapshot((snapshot) => {
       // อัพเดท UI ทันที
   });
   ```

2. **Auto-refresh Fallback**: ยังคงมีการ refresh ทุก 10 วินาทีเป็น backup
   ```javascript
   setInterval(async function() {
       // ตรวจสอบข้อมูลใหม่
   }, 10000);
   ```

### ในหน้า index.html:

- ใช้ระบบ async/await สำหรับการโหลดและบันทึกข้อมูล
- แสดง error message ถ้าการบันทึกล้มเหลว

## การแก้ปัญหา

### ข้อมูลไม่ถูกบันทึก

1. **ตรวจสอบ Console**:
   - กด F12 เพื่อเปิด Developer Tools
   - ไปที่แท็บ Console
   - ดูว่ามี error อะไร

2. **ตรวจสอบ Firebase Config**:
   - ตรวจสอบว่า `apiKey`, `messagingSenderId`, และ `appId` ถูกต้อง
   - ตรวจสอบว่า `projectId` เป็น `booking-475115`

3. **ตรวจสอบ Firestore Rules**:
   - ไปที่ Firebase Console > Firestore Database > Rules
   - ตรวจสอบว่า rules ถูก deploy แล้ว
   - ถ้ายังไม่ได้ deploy ให้รัน `firebase deploy --only firestore:rules`

### ข้อมูลไม่อัพเดท Real-time

1. ตรวจสอบว่าเบราว์เซอร์รองรับ WebSocket
2. ตรวจสอบว่าไม่มี Firewall หรือ Proxy บล็อก
3. ลองรีเฟรชหน้าเว็บ
4. ตรวจสอบ Console ว่ามีข้อความ "Bookings updated via Firestore listener"

### Permission Denied Error

ถ้าเจอ error ประเภท "Permission denied":
1. ตรวจสอบว่า Firestore Rules ถูก deploy แล้ว
2. สำหรับการแก้ไข/ลบ ต้อง login ผ่านหน้า admin ก่อน
3. ตรวจสอบว่า session ยังไม่หมดอายุ (30 นาที)

### ข้อมูลเดิมจาก LocalStorage หายไป

ข้อมูลเดิมที่เก็บใน LocalStorage จะไม่ถูก migrate อัตโนมัติ คุณมีสองทางเลือก:

1. **สร้างข้อมูลใหม่**: เริ่มต้นใหม่ใน Firestore (แนะนำ)
2. **Export/Import수동**:
   - เปิด Console (F12)
   - รัน: `console.log(localStorage.getItem('dn-center-bookings'))`
   - คัดลอกข้อมูล
   - นำไปสร้างเป็น documents ใน Firestore ผ่าน Firebase Console

## ข้อมูลเพิ่มเติม

- Firebase Firestore Documentation: https://firebase.google.com/docs/firestore
- Firebase Console: https://console.firebase.google.com/
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started

## สรุป

หลังจากตั้งค่าเสร็จแล้ว ระบบจะมีคุณสมบัติดังนี้:

✅ เก็บข้อมูลบน Cloud (Firestore)
✅ อัพเดทข้อมูลแบบ Real-time
✅ เข้าถึงข้อมูลได้จากหลายอุปกรณ์
✅ ข้อมูลปลอดภัยด้วย Security Rules
✅ ส่งอีเมลแจ้งเตือนอัตโนมัติ (EmailJS)
✅ มี Backup และ Version Control อัตโนมัติ

หากมีปัญหาในการตั้งค่า กรุณาตรวจสอบ Console และดูข้อความ error ที่แสดง
