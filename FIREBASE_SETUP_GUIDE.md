# คู่มือการสร้างระบบจองนัดหมาย DN Center บน Firebase

## ภาพรวม Firebase Architecture

```
Firebase Services ที่จะใช้:
├── Firebase Hosting        → เว็บไซต์ Frontend
├── Firestore Database      → ฐานข้อมูลหลัก
├── Cloud Functions         → Backend Logic + API
├── Firebase Authentication → (Optional) ระบบ Login สำหรับ Admin
├── Firebase Storage        → เก็บไฟล์รูปภาพ
└── Firebase Extensions     → ส่งอีเมล (Trigger Email)
```

---

## ขั้นตอนที่ 1: ข้อมูลที่ต้องเตรียม

### 1.1 ข้อมูลโครงการ Firebase

**ข้อมูลที่ต้องมี:**
- [ ] บัญชี Google Account
- [ ] ชื่อโครงการ (Project Name): `dn-booking-system`
- [ ] Project ID: `dn-booking-system` (ต้องไม่ซ้ำกับโครงการอื่น)
- [ ] Region แนะนำ: `asia-southeast1` (สิงคโปร์ - ใกล้ไทยที่สุด)

### 1.2 ข้อมูลธุรกิจและกฎเกณฑ์

**ข้อมูลที่ต้องชัดเจนก่อนเริ่มพัฒนา:**

#### A. กฎการจองเวลา
```yaml
เวลาทำการ:
  วันจันทร์-ศุกร์: 09:00-17:00
  วันเสาร์-อาทิทย์: ปิด

ช่วงเวลาแต่ละนัด:
  ระยะเวลา: 30 นาที
  ช่วงเช้า: 09:00-12:00
  พักเที่ยง: 12:00-14:00 (ไม่รับจอง)
  ช่วงบ่าย: 14:00-17:00

จำนวนผู้เข้าพบต่อช่วง:
  จำนวนสูงสุด: 1 คน/ช่วง (หรือมากกว่าถ้ามีห้องประชุมหลายห้อง)

ระยะเวลาล่วงหน้า:
  จองล่วงหน้าขั้นต่ำ: 1 วัน (24 ชั่วโมง)
  จองล่วงหน้าสูงสุด: 60 วัน

การยกเลิก:
  ยกเลิกล่วงหน้า: อย่างน้อย 24 ชั่วโมง
```

#### B. วันหยุดและวันปิดพิเศษ
```javascript
// รายการวันหยุดประจำปี 2568
const holidays2025 = [
  { date: '2025-01-01', name: 'วันขึ้นปีใหม่' },
  { date: '2025-04-13', name: 'วันสงกรานต์' },
  { date: '2025-04-14', name: 'วันสงกรานต์' },
  { date: '2025-04-15', name: 'วันสงกรานต์' },
  { date: '2025-05-01', name: 'วันแรงงาน' },
  { date: '2025-12-31', name: 'วันสิ้นปี' }
  // เพิ่มวันหยุดอื่นๆ ตามที่บริษัทกำหนด
];

// วันปิดพิเศษ (ซ่อมแซม, อบรม, ฯลฯ)
const specialClosedDates = [
  { date: '2025-10-12', reason: 'วันหยุดพิเศษ' },
  { date: '2025-10-23', reason: 'วันหยุดพิเศษ' }
];
```

#### C. ข้อมูลติดต่อและการแจ้งเตือน
```yaml
อีเมลบริษัท:
  ผู้ดูแลหลัก: admin@dncenter.com
  ทีมจัดซื้อ: procurement@dncenter.com
  แผนก CC: booking@dncenter.com

LINE Notify:
  Token: (ต้องสร้างจาก LINE Notify)
  Group: DN Center Booking Notifications

ข้อความอีเมล:
  ชื่อผู้ส่ง: DN Center Booking System
  Reply-to: procurement@dncenter.com
```

#### D. ประกาศและข้อความ
```javascript
// ข้อความต้อนรับ
const welcomeMessage = "กำหนดเวลาส่วนตัวกับทีมจัดซื้อของเรา";

// เอกสารที่ต้องเตรียม
const requiredDocuments = [
  "นามบัตรบริษัท",
  "แคตตาล็อกสินค้า",
  "ใบเสนอราคา (ถ้ามี)"
];

// กฎการแต่งกาย
const dresscode = "Smart Casual หรือ ชุดทำงาน";
```

---

## ขั้นตอนที่ 2: โครงสร้างฐานข้อมูล Firestore

### 2.1 Collections และ Documents

```
firestore/
├── appointments/              # การจองทั้งหมด
│   └── {appointmentId}
│       ├── appointmentDate: "2025-11-05"
│       ├── appointmentTime: "10:00"
│       ├── companyName: "บริษัท ABC จำกัด"
│       ├── visitorName: "คุณสมชาย"
│       ├── phone: "0812345678"
│       ├── email: "somchai@abc.com"
│       ├── recommendedProduct: "สินค้า XYZ"
│       ├── notes: "ต้องการดูตัวอย่าง"
│       ├── status: "confirmed" | "pending" | "cancelled" | "completed"
│       ├── createdAt: Timestamp
│       ├── updatedAt: Timestamp
│       └── cancelledAt: Timestamp | null
│
├── timeSlots/                 # ช่วงเวลาที่ว่าง
│   └── {date}__{time}         # เช่น "2025-11-05__10:00"
│       ├── date: "2025-11-05"
│       ├── time: "10:00"
│       ├── isAvailable: true
│       ├── maxBookings: 1
│       ├── currentBookings: 0
│       ├── appointmentId: null | "appt123"
│       └── updatedAt: Timestamp
│
├── closedDates/               # วันปิดทำการ
│   └── {dateId}               # เช่น "2025-10-12"
│       ├── date: "2025-10-12"
│       ├── reason: "วันหยุดพิเศษ"
│       ├── type: "holiday" | "special" | "maintenance"
│       ├── isActive: true
│       └── createdAt: Timestamp
│
├── announcements/             # ประกาศข่าวสาร
│   └── {announcementId}
│       ├── title: "ประกาศวันหยุด"
│       ├── message: "ปิดทำการวันที่..."
│       ├── type: "info" | "warning" | "urgent"
│       ├── isActive: true
│       ├── startDate: "2025-10-01"
│       ├── endDate: "2025-10-31"
│       ├── priority: 1
│       └── createdAt: Timestamp
│
├── settings/                  # การตั้งค่าระบบ
│   └── general
│       ├── businessHours:
│       │   ├── monday: { open: "09:00", close: "17:00", isOpen: true }
│       │   ├── tuesday: { open: "09:00", close: "17:00", isOpen: true }
│       │   └── ...
│       ├── slotDuration: 30   # นาที
│       ├── maxAdvanceBooking: 60  # วัน
│       ├── minAdvanceBooking: 1   # วัน
│       ├── lunchBreak: { start: "12:00", end: "14:00" }
│       └── autoConfirm: true
│
└── emailTemplates/            # Template อีเมล
    ├── booking-confirmation
    │   ├── subject: "ยืนยันการจองเวลา DN Center"
    │   ├── html: "..."
    │   └── text: "..."
    └── booking-reminder
        ├── subject: "เตือนนัดหมาย DN Center"
        ├── html: "..."
        └── text: "..."
```

### 2.2 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // อนุญาตให้อ่านข้อมูล appointments ของตัวเองเท่านั้น (ใช้ email เป็น key)
    match /appointments/{appointmentId} {
      allow read: if request.auth != null || resource.data.email == request.query.email;
      allow create: if request.resource.data.status == 'pending';
      allow update: if request.auth != null; // เฉพาะ Admin
      allow delete: if request.auth != null; // เฉพาะ Admin
    }

    // อนุญาตให้ทุกคนอ่าน timeSlots
    match /timeSlots/{slotId} {
      allow read: if true;
      allow write: if request.auth != null; // เฉพาะ Admin หรือ Cloud Function
    }

    // อนุญาตให้ทุกคนอ่าน closedDates
    match /closedDates/{dateId} {
      allow read: if true;
      allow write: if request.auth != null; // เฉพาะ Admin
    }

    // อนุญาตให้ทุกคนอ่าน announcements ที่ active
    match /announcements/{announcementId} {
      allow read: if resource.data.isActive == true;
      allow write: if request.auth != null; // เฉพาะ Admin
    }

    // อนุญาตให้ทุกคนอ่าน settings
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null; // เฉพาะ Admin
    }

    // เฉพาะ Admin
    match /emailTemplates/{templateId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2.3 Firestore Indexes

```javascript
// สร้าง Composite Indexes เหล่านี้ใน Firebase Console
[
  {
    collectionGroup: 'appointments',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'appointmentDate', order: 'ASCENDING' },
      { fieldPath: 'appointmentTime', order: 'ASCENDING' }
    ]
  },
  {
    collectionGroup: 'appointments',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'appointmentDate', order: 'ASCENDING' }
    ]
  },
  {
    collectionGroup: 'appointments',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'email', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionGroup: 'timeSlots',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'date', order: 'ASCENDING' },
      { fieldPath: 'isAvailable', order: 'ASCENDING' }
    ]
  },
  {
    collectionGroup: 'announcements',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'isActive', order: 'ASCENDING' },
      { fieldPath: 'priority', order: 'DESCENDING' }
    ]
  }
]
```

---

## ขั้นตอนที่ 3: ข้อมูลเริ่มต้นที่ต้อง Seed

### 3.1 สคริปต์ Seed ข้อมูล Settings

```javascript
// seed-settings.js
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

async function seedSettings() {
  // 1. Business Hours
  await db.collection('settings').doc('general').set({
    businessHours: {
      monday: { open: '09:00', close: '17:00', isOpen: true },
      tuesday: { open: '09:00', close: '17:00', isOpen: true },
      wednesday: { open: '09:00', close: '17:00', isOpen: true },
      thursday: { open: '09:00', close: '17:00', isOpen: true },
      friday: { open: '09:00', close: '17:00', isOpen: true },
      saturday: { open: '09:00', close: '12:00', isOpen: false },
      sunday: { open: '09:00', close: '12:00', isOpen: false }
    },
    slotDuration: 30, // นาที
    maxAdvanceBooking: 60, // วัน
    minAdvanceBooking: 1, // วัน
    lunchBreak: {
      start: '12:00',
      end: '14:00'
    },
    autoConfirm: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log('✅ Settings seeded successfully');
}

seedSettings();
```

### 3.2 สคริปต์ Seed วันหยุด

```javascript
// seed-holidays.js
async function seedHolidays() {
  const holidays = [
    { date: '2025-01-01', name: 'วันขึ้นปีใหม่', type: 'holiday' },
    { date: '2025-02-12', name: 'วันตรุษจีน', type: 'holiday' },
    { date: '2025-04-06', name: 'วันจักรี', type: 'holiday' },
    { date: '2025-04-13', name: 'วันสงกรานต์', type: 'holiday' },
    { date: '2025-04-14', name: 'วันสงกรานต์', type: 'holiday' },
    { date: '2025-04-15', name: 'วันสงกรานต์', type: 'holiday' },
    { date: '2025-05-01', name: 'วันแรงงาน', type: 'holiday' },
    { date: '2025-05-05', name: 'วันฉัตรมงคล', type: 'holiday' },
    { date: '2025-05-12', name: 'วันพืชมงคล', type: 'holiday' },
    { date: '2025-07-28', name: 'วันเฉลิมพระชนมพรรษา ร.10', type: 'holiday' },
    { date: '2025-07-29', name: 'ชดเชยวันเฉลิมพระชนมพรรษา', type: 'holiday' },
    { date: '2025-08-12', name: 'วันแม่', type: 'holiday' },
    { date: '2025-10-13', name: 'วันปิยมหาราช', type: 'holiday' },
    { date: '2025-10-23', name: 'วันปิยมหาราช (ชดเชย)', type: 'holiday' },
    { date: '2025-12-05', name: 'วันพ่อ', type: 'holiday' },
    { date: '2025-12-10', name: 'วันรัฐธรรมนูญ', type: 'holiday' },
    { date: '2025-12-31', name: 'วันสิ้นปี', type: 'holiday' }
  ];

  const batch = db.batch();

  holidays.forEach(holiday => {
    const docRef = db.collection('closedDates').doc(holiday.date);
    batch.set(docRef, {
      ...holiday,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  await batch.commit();
  console.log(`✅ ${holidays.length} holidays seeded successfully`);
}

seedHolidays();
```

### 3.3 สคริปต์ Seed ประกาศ

```javascript
// seed-announcements.js
async function seedAnnouncements() {
  const announcements = [
    {
      title: 'เอกสารประกอบการเข้าพบ',
      message: 'กรุณาพกนามบัตรและแคตตาล็อกสินค้าเพื่อประกอบการพิจารณา',
      type: 'info',
      isActive: true,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      priority: 1
    },
    {
      title: 'แจ้งวันหยุดพิเศษเดือนตุลาคม',
      message: 'ปิดทำการวันที่ 12 ต.ค. และ 23 ต.ค.',
      type: 'warning',
      isActive: true,
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      priority: 2
    }
  ];

  for (const announcement of announcements) {
    await db.collection('announcements').add({
      ...announcement,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  console.log(`✅ ${announcements.length} announcements seeded successfully`);
}

seedAnnouncements();
```

### 3.4 สคริปต์สร้าง Time Slots อัตโนมัติ

```javascript
// seed-timeslots.js
async function generateTimeSlots(startDate, endDate) {
  const slots = [];
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay();

    // ข้ามวันเสาร์ (6) และอาทิทย์ (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      timeSlots.forEach(time => {
        slots.push({
          id: `${dateStr}__${time}`,
          date: dateStr,
          time: time,
          isAvailable: true,
          maxBookings: 1,
          currentBookings: 0,
          appointmentId: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Batch write (500 documents at a time)
  const batchSize = 500;
  for (let i = 0; i < slots.length; i += batchSize) {
    const batch = db.batch();
    const batchSlots = slots.slice(i, i + batchSize);

    batchSlots.forEach(slot => {
      const docRef = db.collection('timeSlots').doc(slot.id);
      batch.set(docRef, slot);
    });

    await batch.commit();
    console.log(`✅ Batch ${i / batchSize + 1} completed (${batchSlots.length} slots)`);
  }

  console.log(`✅ Total ${slots.length} time slots created`);
}

// สร้าง time slots สำหรับ 3 เดือนข้างหน้า
const today = new Date();
const threeMonthsLater = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));

generateTimeSlots(today, threeMonthsLater);
```

### 3.5 Email Templates

```javascript
// seed-email-templates.js
async function seedEmailTemplates() {
  // 1. Confirmation Email
  await db.collection('emailTemplates').doc('booking-confirmation').set({
    subject: 'ยืนยันการจองเวลา DN Center - {{appointmentDate}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Sarabun', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #5c199a 0%, #7731d8 100%); color: white; padding: 30px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #666; }
          .value { color: #333; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #5c199a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ยืนยันการจองเวลาเรียบร้อย</h1>
          </div>
          <div class="content">
            <p>เรียน คุณ{{visitorName}}</p>
            <p>ขอบคุณที่จองเวลาเข้าพบทีมจัดซื้อของ DN Center</p>

            <div class="details">
              <h3>รายละเอียดการนัดหมาย</h3>
              <div class="detail-row">
                <span class="label">วันที่:</span>
                <span class="value">{{appointmentDate}}</span>
              </div>
              <div class="detail-row">
                <span class="label">เวลา:</span>
                <span class="value">{{appointmentTime}} น.</span>
              </div>
              <div class="detail-row">
                <span class="label">บริษัท:</span>
                <span class="value">{{companyName}}</span>
              </div>
              <div class="detail-row">
                <span class="label">สินค้าแนะนำ:</span>
                <span class="value">{{recommendedProduct}}</span>
              </div>
            </div>

            <h3>เอกสารที่ต้องเตรียม:</h3>
            <ul>
              <li>นามบัตรบริษัท</li>
              <li>แคตตาล็อกสินค้า</li>
              <li>ใบเสนอราคา (ถ้ามี)</li>
            </ul>

            <p><strong>สถานที่:</strong> DN Center, 123 ถนนสุขุมวิท กรุงเทพฯ</p>

            <center>
              <a href="{{cancelUrl}}" class="button">ยกเลิกการนัดหมาย</a>
            </center>
          </div>
          <div class="footer">
            <p>หากมีข้อสงสัย กรุณาติดต่อ: procurement@dncenter.com | 02-XXX-XXXX</p>
            <p>© 2025 DN Center. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
ยืนยันการจองเวลา DN Center

เรียน คุณ{{visitorName}}

ขอบคุณที่จองเวลาเข้าพบทีมจัดซื้อของ DN Center

รายละเอียดการนัดหมาย:
- วันที่: {{appointmentDate}}
- เวลา: {{appointmentTime}} น.
- บริษัท: {{companyName}}
- สินค้าแนะนำ: {{recommendedProduct}}

เอกสารที่ต้องเตรียม:
- นามบัตรบริษัท
- แคตตาล็อกสินค้า
- ใบเสนอราคา (ถ้ามี)

สถานที่: DN Center, 123 ถนนสุขุมวิท กรุงเทพฯ

หากต้องการยกเลิก: {{cancelUrl}}

หากมีข้อสงสัย กรุณาติดต่อ: procurement@dncenter.com | 02-XXX-XXXX
    `
  });

  // 2. Reminder Email
  await db.collection('emailTemplates').doc('booking-reminder').set({
    subject: 'เตือนนัดหมาย DN Center วันพรุ่งนี้',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Sarabun', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 30px; text-align: center; }
          .content { background: #fff7ed; padding: 30px; }
          .reminder { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 เตือนนัดหมายพรุ่งนี้</h1>
          </div>
          <div class="content">
            <p>เรียน คุณ{{visitorName}}</p>
            <p>นี่คือการเตือนว่าคุณมีนัดหมายกับทีมจัดซื้อ DN Center</p>

            <div class="reminder">
              <h3>📅 {{appointmentDate}}</h3>
              <h3>🕐 {{appointmentTime}} น.</h3>
              <p><strong>บริษัท:</strong> {{companyName}}</p>
            </div>

            <p><strong>อย่าลืม:</strong></p>
            <ul>
              <li>✅ นามบัตรบริษัท</li>
              <li>✅ แคตตาล็อกสินค้า</li>
              <li>✅ ใบเสนอราคา (ถ้ามี)</li>
            </ul>

            <p>📍 <strong>สถานที่:</strong> DN Center, 123 ถนนสุขุมวิท กรุงเทพฯ</p>
            <p>📞 <strong>ติดต่อ:</strong> 02-XXX-XXXX</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
เตือนนัดหมายพรุ่งนี้

เรียน คุณ{{visitorName}}

นี่คือการเตือนว่าคุณมีนัดหมายกับทีมจัดซื้อ DN Center

วันที่: {{appointmentDate}}
เวลา: {{appointmentTime}} น.
บริษัท: {{companyName}}

อย่าลืม:
- นามบัตรบริษัท
- แคตตาล็อกสินค้า
- ใบเสนอราคา (ถ้ามี)

สถานที่: DN Center, 123 ถนนสุขุมวิท กรุงเทพฯ
ติดต่อ: 02-XXX-XXXX
    `
  });

  console.log('✅ Email templates seeded successfully');
}

seedEmailTemplates();
```

---

## ขั้นตอนที่ 4: Cloud Functions ที่ต้องสร้าง

### 4.1 รายการ Functions หลัก

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// ========================================
// 1. สร้างการจอง (Create Appointment)
// ========================================
exports.createAppointment = functions
  .region('asia-southeast1')
  .https.onCall(async (data, context) => {
    const { appointmentDate, appointmentTime, companyName, visitorName, phone, email, recommendedProduct, notes } = data;

    // 1. Validate input
    if (!appointmentDate || !appointmentTime || !companyName || !visitorName || !phone || !email) {
      throw new functions.https.HttpsError('invalid-argument', 'ข้อมูลไม่ครบถ้วน');
    }

    // 2. ตรวจสอบว่าช่วงเวลายังว่างอยู่หรือไม่
    const slotId = `${appointmentDate}__${appointmentTime}`;
    const slotRef = admin.firestore().collection('timeSlots').doc(slotId);

    try {
      const result = await admin.firestore().runTransaction(async (transaction) => {
        const slotDoc = await transaction.get(slotRef);

        if (!slotDoc.exists) {
          throw new Error('ไม่พบช่วงเวลานี้');
        }

        const slotData = slotDoc.data();

        if (!slotData.isAvailable || slotData.currentBookings >= slotData.maxBookings) {
          throw new Error('ช่วงเวลานี้ถูกจองแล้ว');
        }

        // 3. สร้างการจอง
        const appointmentRef = admin.firestore().collection('appointments').doc();
        transaction.set(appointmentRef, {
          appointmentDate,
          appointmentTime,
          companyName,
          visitorName,
          phone,
          email,
          recommendedProduct: recommendedProduct || '',
          notes: notes || '',
          status: 'confirmed',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 4. อัพเดท time slot
        transaction.update(slotRef, {
          isAvailable: false,
          currentBookings: slotData.currentBookings + 1,
          appointmentId: appointmentRef.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return appointmentRef.id;
      });

      return { success: true, appointmentId: result };

    } catch (error) {
      throw new functions.https.HttpsError('aborted', error.message);
    }
  });

// ========================================
// 2. ดึงช่วงเวลาที่ว่าง (Get Available Slots)
// ========================================
exports.getAvailableSlots = functions
  .region('asia-southeast1')
  .https.onCall(async (data, context) => {
    const { date } = data;

    if (!date) {
      throw new functions.https.HttpsError('invalid-argument', 'กรุณาระบุวันที่');
    }

    // ตรวจสอบว่าเป็นวันปิดหรือไม่
    const closedDateDoc = await admin.firestore().collection('closedDates').doc(date).get();
    if (closedDateDoc.exists && closedDateDoc.data().isActive) {
      return {
        isClosed: true,
        reason: closedDateDoc.data().reason,
        slots: []
      };
    }

    // ดึง time slots
    const slotsSnapshot = await admin.firestore()
      .collection('timeSlots')
      .where('date', '==', date)
      .where('isAvailable', '==', true)
      .get();

    const slots = slotsSnapshot.docs.map(doc => ({
      time: doc.data().time,
      available: doc.data().isAvailable
    }));

    return { isClosed: false, slots };
  });

// ========================================
// 3. ยกเลิกการจอง (Cancel Appointment)
// ========================================
exports.cancelAppointment = functions
  .region('asia-southeast1')
  .https.onCall(async (data, context) => {
    const { appointmentId, email } = data;

    if (!appointmentId || !email) {
      throw new functions.https.HttpsError('invalid-argument', 'ข้อมูลไม่ครบถ้วน');
    }

    const appointmentRef = admin.firestore().collection('appointments').doc(appointmentId);

    try {
      await admin.firestore().runTransaction(async (transaction) => {
        const appointmentDoc = await transaction.get(appointmentRef);

        if (!appointmentDoc.exists) {
          throw new Error('ไม่พบการจอง');
        }

        const appointmentData = appointmentDoc.data();

        // ตรวจสอบ email
        if (appointmentData.email !== email) {
          throw new Error('ไม่มีสิทธิ์ยกเลิกการจองนี้');
        }

        if (appointmentData.status === 'cancelled') {
          throw new Error('การจองนี้ถูกยกเลิกแล้ว');
        }

        // อัพเดทสถานะการจอง
        transaction.update(appointmentRef, {
          status: 'cancelled',
          cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // คืนช่วงเวลา
        const slotId = `${appointmentData.appointmentDate}__${appointmentData.appointmentTime}`;
        const slotRef = admin.firestore().collection('timeSlots').doc(slotId);

        transaction.update(slotRef, {
          isAvailable: true,
          currentBookings: admin.firestore.FieldValue.increment(-1),
          appointmentId: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      return { success: true, message: 'ยกเลิกการจองเรียบร้อย' };

    } catch (error) {
      throw new functions.https.HttpsError('aborted', error.message);
    }
  });

// ========================================
// 4. ส่งอีเมลยืนยันอัตโนมัติ (Trigger on create)
// ========================================
exports.sendConfirmationEmail = functions
  .region('asia-southeast1')
  .firestore.document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    const appointment = snap.data();
    const appointmentId = context.params.appointmentId;

    // ดึง email template
    const templateDoc = await admin.firestore()
      .collection('emailTemplates')
      .doc('booking-confirmation')
      .get();

    if (!templateDoc.exists) {
      console.error('Email template not found');
      return;
    }

    const template = templateDoc.data();

    // แทนที่ placeholders
    const subject = template.subject.replace('{{appointmentDate}}', appointment.appointmentDate);
    let html = template.html
      .replace(/{{visitorName}}/g, appointment.visitorName)
      .replace(/{{appointmentDate}}/g, appointment.appointmentDate)
      .replace(/{{appointmentTime}}/g, appointment.appointmentTime)
      .replace(/{{companyName}}/g, appointment.companyName)
      .replace(/{{recommendedProduct}}/g, appointment.recommendedProduct || '-')
      .replace(/{{cancelUrl}}/g, `https://your-domain.com/cancel?id=${appointmentId}&email=${appointment.email}`);

    // ใช้ Firebase Extension: Trigger Email
    await admin.firestore().collection('mail').add({
      to: appointment.email,
      message: {
        subject: subject,
        html: html
      }
    });

    console.log(`Confirmation email sent to ${appointment.email}`);
  });

// ========================================
// 5. ส่งอีเมลเตือนก่อนนัดหมาย (Scheduled - ทุก 1 ชั่วโมง)
// ========================================
exports.sendReminderEmails = functions
  .region('asia-southeast1')
  .pubsub.schedule('every 1 hours')
  .timeZone('Asia/Bangkok')
  .onRun(async (context) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // หาการจองที่เป็นวันพรุ่งนี้
    const appointmentsSnapshot = await admin.firestore()
      .collection('appointments')
      .where('appointmentDate', '==', tomorrowStr)
      .where('status', '==', 'confirmed')
      .get();

    const templateDoc = await admin.firestore()
      .collection('emailTemplates')
      .doc('booking-reminder')
      .get();

    if (!templateDoc.exists) {
      console.error('Reminder template not found');
      return;
    }

    const template = templateDoc.data();

    // ส่งอีเมลทีละรายการ
    const promises = appointmentsSnapshot.docs.map(async (doc) => {
      const appointment = doc.data();

      let html = template.html
        .replace(/{{visitorName}}/g, appointment.visitorName)
        .replace(/{{appointmentDate}}/g, appointment.appointmentDate)
        .replace(/{{appointmentTime}}/g, appointment.appointmentTime)
        .replace(/{{companyName}}/g, appointment.companyName);

      await admin.firestore().collection('mail').add({
        to: appointment.email,
        message: {
          subject: template.subject,
          html: html
        }
      });
    });

    await Promise.all(promises);
    console.log(`Sent ${promises.length} reminder emails`);
  });

// ========================================
// 6. ดึงประกาศที่ Active (Get Active Announcements)
// ========================================
exports.getAnnouncements = functions
  .region('asia-southeast1')
  .https.onCall(async (data, context) => {
    const today = new Date().toISOString().split('T')[0];

    const announcementsSnapshot = await admin.firestore()
      .collection('announcements')
      .where('isActive', '==', true)
      .where('startDate', '<=', today)
      .where('endDate', '>=', today)
      .orderBy('startDate')
      .orderBy('priority', 'desc')
      .get();

    const announcements = announcementsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return announcements;
  });

// ========================================
// 7. สร้าง Time Slots อัตโนมัติ (ทุกวันเที่ยงคืน)
// ========================================
exports.generateDailyTimeSlots = functions
  .region('asia-southeast1')
  .pubsub.schedule('0 0 * * *')
  .timeZone('Asia/Bangkok')
  .onRun(async (context) => {
    // สร้าง time slots สำหรับ 60 วันข้างหน้า
    const date = new Date();
    date.setDate(date.getDate() + 60);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    // ข้ามวันหยุดสุดสัปดาห์
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return;
    }

    // ตรวจสอบว่าเป็นวันปิดหรือไม่
    const closedDateDoc = await admin.firestore()
      .collection('closedDates')
      .doc(dateStr)
      .get();

    if (closedDateDoc.exists && closedDateDoc.data().isActive) {
      console.log(`Skipping ${dateStr} - Closed date`);
      return;
    }

    // สร้าง time slots
    const timeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    const batch = admin.firestore().batch();

    timeSlots.forEach(time => {
      const slotId = `${dateStr}__${time}`;
      const slotRef = admin.firestore().collection('timeSlots').doc(slotId);

      batch.set(slotRef, {
        date: dateStr,
        time: time,
        isAvailable: true,
        maxBookings: 1,
        currentBookings: 0,
        appointmentId: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
    console.log(`Created ${timeSlots.length} time slots for ${dateStr}`);
  });
```

### 4.2 Dependencies สำหรับ Cloud Functions

```json
// functions/package.json
{
  "name": "dn-booking-functions",
  "version": "1.0.0",
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0"
  },
  "engines": {
    "node": "18"
  }
}
```

---

## ขั้นตอนที่ 5: การตั้งค่า Email (Trigger Email Extension)

### 5.1 ติดตั้ง Extension

```bash
# ใช้ Firebase CLI
firebase ext:install firestore-send-email --project=dn-booking-system
```

### 5.2 ข้อมูลที่ต้องกรอกตอนติดตั้ง

```yaml
SMTP Connection URI:
  smtp://username:password@smtp.gmail.com:587
  # หรือใช้ SendGrid, AWS SES, Mailgun

From Email Address:
  noreply@dncenter.com

From Display Name:
  DN Center Booking System

Email Documents Collection:
  mail

Users Collection (optional):
  # เว้นว่างถ้าไม่ใช้

Templates Collection (optional):
  emailTemplates
```

### 5.3 ตั้งค่า Gmail SMTP (ถ้าใช้ Gmail)

1. เปิด 2-Step Verification ใน Google Account
2. สร้าง App Password: https://myaccount.google.com/apppasswords
3. ใช้ App Password แทน password ปกติ

```
SMTP URI: smtp://your-email@gmail.com:app-password@smtp.gmail.com:587
```

---

## ขั้นตอนที่ 6: Environment Variables

### 6.1 ไฟล์ `.env` สำหรับ Local Development

```bash
# .env.local
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=dn-booking-system.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dn-booking-system
VITE_FIREBASE_STORAGE_BUCKET=dn-booking-system.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Admin Email
ADMIN_EMAIL=admin@dncenter.com

# LINE Notify (optional)
LINE_NOTIFY_TOKEN=your-line-notify-token
```

### 6.2 Firebase Functions Config

```bash
# ตั้งค่าผ่าน CLI
firebase functions:config:set \
  email.admin="admin@dncenter.com" \
  email.procurement="procurement@dncenter.com" \
  line.notify_token="your-token"

# ดูค่าที่ตั้งไว้
firebase functions:config:get
```

---

## ขั้นตอนที่ 7: Checklist การเริ่มต้น

### ✅ ก่อนเริ่มเขียนโค้ด

- [ ] สร้าง Firebase Project
- [ ] เปิดใช้งาน Firestore Database
- [ ] เปิดใช้งาน Cloud Functions (Blaze Plan - Pay as you go)
- [ ] เปิดใช้งาน Firebase Hosting
- [ ] เปิดใช้งาน Firebase Storage
- [ ] ติดตั้ง Firebase CLI: `npm install -g firebase-tools`
- [ ] Login: `firebase login`
- [ ] Init project: `firebase init`

### ✅ เตรียมข้อมูล

- [ ] รวบรวมรายการวันหยุดประจำปี
- [ ] กำหนดเวลาทำการชัดเจน
- [ ] เตรียม Email Templates (ภาษาไทย)
- [ ] เตรียมโลโก้และรูปภาพ Background
- [ ] กำหนด Business Rules (จองล่วงหน้ากี่วัน, ยกเลิกกี่ชั่วโมง)

### ✅ Setup SMTP/Email

- [ ] เลือก Email Service (Gmail/SendGrid/AWS SES)
- [ ] สร้าง App Password หรือ API Key
- [ ] ติดตั้ง Trigger Email Extension
- [ ] ทดสอบส่งอีเมล

### ✅ Seed ข้อมูลเริ่มต้น

- [ ] Run `seed-settings.js`
- [ ] Run `seed-holidays.js`
- [ ] Run `seed-announcements.js`
- [ ] Run `seed-timeslots.js`
- [ ] Run `seed-email-templates.js`

### ✅ Deploy

- [ ] Deploy Firestore Rules: `firebase deploy --only firestore:rules`
- [ ] Deploy Cloud Functions: `firebase deploy --only functions`
- [ ] Deploy Hosting: `firebase deploy --only hosting`
- [ ] ทดสอบ End-to-End

---

## ขั้นตอนที่ 8: คำสั่งที่ใช้บ่อย

```bash
# ติดตั้ง Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# สร้างโปรเจค
firebase init

# Deploy ทั้งหมด
firebase deploy

# Deploy เฉพาะ Functions
firebase deploy --only functions

# Deploy เฉพาะ Hosting
firebase deploy --only hosting

# Deploy เฉพาะ Firestore Rules
firebase deploy --only firestore:rules

# ดู Logs ของ Functions
firebase functions:log

# ทดสอบ Functions ในเครื่อง
firebase emulators:start

# ดู Functions Config
firebase functions:config:get

# ตั้งค่า Functions Config
firebase functions:config:set key="value"
```

---

## ประมาณการค่าใช้จ่าย Firebase (รายเดือน)

### Spark Plan (ฟรี) - พอดูใจ

- Firestore: 50,000 reads/วัน ฟรี
- Cloud Functions: 2M invocations/เดือน ฟรี
- Hosting: 10GB bandwidth/เดือน ฟรี

**เหมาะกับ:** ทดสอบ หรือ ผู้ใช้น้อยกว่า 100 คน/เดือน

### Blaze Plan (จ่ายตามใช้) - แนะนำ

**สมมติ: 500 การจองต่อเดือน**

- Firestore Reads: ~15,000 reads = $0.50
- Firestore Writes: ~5,000 writes = $0.60
- Cloud Functions: ~10,000 invocations = $0.40
- Hosting: 5GB bandwidth = $0.20
- Email (SendGrid): ส่งฟรี 100 emails/วัน = $0

**รวม: ~$2-5 USD/เดือน (~70-175 บาท)**

---

## สรุป: ขั้นตอนการเริ่มต้น

### Week 1: Setup

1. สร้าง Firebase Project
2. Setup Firestore Database + Rules
3. เตรียมข้อมูล Settings, Holidays, Announcements

### Week 2: Backend

4. เขียน Cloud Functions (7 functions)
5. ติดตั้ง Email Extension
6. Seed ข้อมูลเริ่มต้น

### Week 3: Frontend

7. ดัดแปลง index.html ให้เชื่อมกับ Firebase
8. เพิ่ม Firebase SDK
9. เขียน JavaScript เรียก Cloud Functions

### Week 4: Testing & Deploy

10. ทดสอบ End-to-End
11. Deploy ขึ้น Firebase Hosting
12. ทดสอบ Production

---

## ติดต่อสอบถาม

หากมีข้อสงสัยในการ Setup กรุณาติดต่อ:
- **เอกสาร Firebase:** https://firebase.google.com/docs
- **ชุมชน Firebase:** https://firebase.google.com/community

---

**เอกสารนี้สร้างขึ้นเมื่อ:** 2 พฤศจิกายน 2568
**ผู้จัดทำ:** Development Team
