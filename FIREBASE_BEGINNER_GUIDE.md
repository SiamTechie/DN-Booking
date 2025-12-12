# คู่มือเชื่อมต่อ Firebase สำหรับผู้เริ่มต้น
## ระบบจองนัดหมาย DN Center

---

## 📚 สารบัญ

1. [Firebase คืออะไร?](#firebase-คืออะไร)
2. [ขั้นตอนที่ 1: สร้างบัญชี Firebase](#ขั้นตอนที่-1-สร้างบัญชี-firebase)
3. [ขั้นตอนที่ 2: ติดตั้งเครื่องมือ](#ขั้นตอนที่-2-ติดตั้งเครื่องมือ)
4. [ขั้นตอนที่ 3: สร้าง Firebase Project](#ขั้นตอนที่-3-สร้าง-firebase-project)
5. [ขั้นตอนที่ 4: เปิดใช้งาน Firestore](#ขั้นตอนที่-4-เปิดใช้งาน-firestore)
6. [ขั้นตอนที่ 5: เชื่อมต่อเว็บไซต์กับ Firebase](#ขั้นตอนที่-5-เชื่อมต่อเว็บไซต์กับ-firebase)
7. [ขั้นตอนที่ 6: สร้าง Cloud Functions](#ขั้นตอนที่-6-สร้าง-cloud-functions)
8. [ขั้นตอนที่ 7: ตั้งค่าระบบส่งอีเมล](#ขั้นตอนที่-7-ตั้งค่าระบบส่งอีเมล)
9. [ขั้นตอนที่ 8: ทดสอบระบบ](#ขั้นตอนที่-8-ทดสอบระบบ)
10. [ขั้นตอนที่ 9: Deploy เว็บไซต์](#ขั้นตอนที่-9-deploy-เว็บไซต์)
11. [แก้ปัญหาที่พบบ่อย](#แก้ปัญหาที่พบบ่อย)

---

## Firebase คืออะไร?

**Firebase** เป็นแพลตฟอร์มของ Google ที่ช่วยให้เราสร้างเว็บแอปพลิเคชันได้โดยไม่ต้องจัดการ Server เอง

**สิ่งที่เราจะใช้:**
- ✅ **Firestore** = ฐานข้อมูลเก็บข้อมูลการจอง
- ✅ **Cloud Functions** = โค้ดที่ทำงานบน Server (บันทึกการจอง, ส่งอีเมล)
- ✅ **Hosting** = โฮสต์เว็บไซต์ให้คนอื่นเข้าถึงได้
- ✅ **Extensions** = ส่งอีเมลอัตโนมัติ

**ค่าใช้จ่าย:**
- 🆓 **ฟรี** สำหรับผู้ใช้น้อย (Spark Plan)
- 💰 **~70-175 บาท/เดือน** สำหรับ 500 การจอง (Blaze Plan)

---

## ขั้นตอนที่ 1: สร้างบัญชี Firebase

### 1.1 เข้าเว็บไซต์ Firebase

1. เปิดเบราว์เซอร์ไปที่ https://console.firebase.google.com
2. คลิก **"Get Started"** หรือ **"เริ่มต้นใช้งาน"**
3. Login ด้วย **Google Account** ของคุณ

![Firebase Console](https://via.placeholder.com/800x400?text=Firebase+Console)

### 1.2 ยอมรับข้อตกลง

- อ่านและติ๊กยอมรับ Terms of Service
- คลิก **"Continue"**

✅ **เสร็จแล้ว!** ตอนนี้คุณมีบัญชี Firebase แล้ว

---

## ขั้นตอนที่ 2: ติดตั้งเครื่องมือ

### 2.1 ติดตั้ง Node.js

**Node.js คืออะไร?** = โปรแกรมที่ช่วยให้เรารัน JavaScript บนเครื่องคอมพิวเตอร์

**วิธีติดตั้ง:**

1. ไปที่ https://nodejs.org
2. ดาวน์โหลด **LTS version** (แนะนำ)
3. Double-click ไฟล์ที่ดาวน์โหลดมา
4. คลิก Next → Next → Install
5. รอจนติดตั้งเสร็จ

**ตรวจสอบว่าติดตั้งสำเร็จ:**

เปิด Command Prompt (Windows) หรือ Terminal (Mac) แล้วพิมพ์:

```bash
node --version
```

ถ้าเห็นเลขเวอร์ชัน เช่น `v18.17.0` แสดงว่าติดตั้งสำเร็จแล้ว ✅

```bash
npm --version
```

ควรเห็นเลขเวอร์ชัน เช่น `9.6.7` ✅

### 2.2 ติดตั้ง Firebase CLI

**Firebase CLI คืออะไร?** = โปรแกรมช่วยจัดการ Firebase ผ่าน Command Line

**วิธีติดตั้ง:**

เปิด Command Prompt หรือ Terminal แล้วพิมพ์:

```bash
npm install -g firebase-tools
```

รอสักครู่ (อาจใช้เวลา 1-2 นาที)

**ตรวจสอบว่าติดตั้งสำเร็จ:**

```bash
firebase --version
```

ควรเห็นเลขเวอร์ชัน เช่น `13.0.0` ✅

### 2.3 Login เข้า Firebase

```bash
firebase login
```

1. เบราว์เซอร์จะเปิดขึ้นมา
2. เลือก Google Account ของคุณ
3. คลิก **"Allow"** เพื่ออนุญาต
4. กลับมาดูที่ Terminal ควรเห็น **"Success! Logged in as your-email@gmail.com"** ✅

---

## ขั้นตอนที่ 3: สร้าง Firebase Project

### 3.1 สร้าง Project ใหม่

1. ไปที่ https://console.firebase.google.com
2. คลิก **"Add project"** หรือ **"เพิ่มโปรเจ็กต์"**

### 3.2 กรอกข้อมูล Project

**ขั้นที่ 1: ตั้งชื่อ Project**

```
Project name: DN Booking System
```

- คลิก **"Continue"**

**ขั้นที่ 2: Google Analytics** (เลือกได้)

- ✅ ติ๊ก "Enable Google Analytics" (แนะนำ)
- คลิก **"Continue"**

**ขั้นที่ 3: เลือก Analytics Account**

- เลือก "Default Account for Firebase" หรือสร้างใหม่
- คลิก **"Create project"**

**รอสักครู่...**

ประมาณ 30 วินาที Firebase จะสร้าง Project ให้

✅ เมื่อเห็นข้อความ **"Your new project is ready"** → คลิก **"Continue"**

### 3.3 ปรับ Project ID (ถ้าต้องการ)

Project ID จะถูกสร้างอัตโนมัติ เช่น `dn-booking-system-a1b2c`

ถ้าต้องการเปลี่ยน:
1. ไปที่ **Project Settings** (ไอคอนเฟือง ⚙️)
2. ดู **Project ID** - สามารถแก้ได้ในครั้งแรกเท่านั้น

---

## ขั้นตอนที่ 4: เปิดใช้งาน Firestore

### 4.1 สร้าง Firestore Database

1. จากหน้า Firebase Console → คลิกเมนู **"Firestore Database"** (ซ้ายมือ)
2. คลิก **"Create database"**

### 4.2 เลือกโหมด Security

เลือก **"Start in test mode"** (สำหรับทดสอบก่อน)

> ⚠️ **สำคัญ:** Test mode จะเปิดให้ทุกคนเข้าถึงได้ 30 วัน เราจะตั้งค่า Security ใหม่ในภายหลัง

คลิก **"Next"**

### 4.3 เลือก Region (Location)

เลือก **"asia-southeast1 (Singapore)"** - ใกล้ไทยที่สุด

คลิก **"Enable"**

**รอสักครู่...** Firestore กำลังเตรียมฐานข้อมูล

✅ เมื่อเสร็จจะเห็นหน้า Firestore Database พร้อมใช้งาน

### 4.4 ตรวจสอบว่าสร้างสำเร็จ

คุณจะเห็น:
- แท็บ **"Data"** - ดูข้อมูลในฐานข้อมูล
- แท็บ **"Rules"** - กำหนดกฎความปลอดภัย
- แท็บ **"Indexes"** - สร้าง Index สำหรับ Query ที่ซับซ้อน

---

## ขั้นตอนที่ 5: เชื่อมต่อเว็บไซต์กับ Firebase

### 5.1 ลงทะเบียนเว็บแอป

1. ที่หน้า Firebase Console → คลิกไอคอน **Web (`</>`)**
   - อยู่ตรงกลางหน้า หรือที่ **"Project Overview"**
2. กรอก **App nickname**: `DN Booking Web`
3. ✅ ติ๊ก **"Also set up Firebase Hosting"**
4. คลิก **"Register app"**

### 5.2 คัดลอก Firebase Config

คุณจะเห็นโค้ดแบบนี้:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDsUYa3A80GWKkGW5LHJNevoMyfwaIxXrA",
  authDomain: "booking-475115.firebaseapp.com",
  projectId: "booking-475115",
  storageBucket: "booking-475115.firebasestorage.app",
  messagingSenderId: "566516479215",
  appId: "1:566516479215:web:c5b96d4d151162ac2c971a",
  measurementId: "G-H8GY3F8WHX"
};
```

**📋 คัดลอกโค้ดนี้ไว้** - เราจะใช้ในขั้นตอนถัดไป

คลิก **"Continue to console"**

### 5.3 เตรียมโฟลเดอร์โปรเจค

เปิด Command Prompt/Terminal แล้วไปที่โฟลเดอร์ของคุณ:

```bash
cd d:\DN-Booking\Book
```

### 5.4 ติดตั้ง Firebase ในโปรเจค

```bash
firebase init
```

**จะมีคำถามให้ตอบ:**

#### คำถามที่ 1: Which Firebase features?

กด **Space** เพื่อเลือก (จะมี `*` หน้า):

```
◯ Realtime Database
● Firestore
◯ Functions
● Hosting
◯ Storage
◯ Emulators
```

เลือก:
- ✅ **Firestore** (กด Space)
- ✅ **Functions** (กด Space)
- ✅ **Hosting** (กด Space)

กด **Enter** เพื่อยืนยัน

#### คำถามที่ 2: Select a default Firebase project

- เลือก **"Use an existing project"**
- กด Enter
- เลือก **"dn-booking-system"** (ที่เราสร้างไว้)
- กด Enter

#### คำถามที่ 3: Firestore Rules

```
? What file should be used for Firestore Rules?
```

- พิมพ์: `firestore.rules`
- กด Enter

#### คำถามที่ 4: Firestore Indexes

```
? What file should be used for Firestore indexes?
```

- พิมพ์: `firestore.indexes.json`
- กด Enter

#### คำถามที่ 5: Functions Language

```
? What language would you like to use for Functions?
```

- เลือก **JavaScript**
- กด Enter

#### คำถามที่ 6: ESLint

```
? Do you want to use ESLint?
```

- พิมพ์: `N` (ไม่ใช้ก็ได้สำหรับผู้เริ่มต้น)
- กด Enter

#### คำถามที่ 7: Install dependencies

```
? Do you want to install dependencies now?
```

- พิมพ์: `Y`
- กด Enter

**รอสักครู่...** (1-2 นาที)

#### คำถามที่ 8: Public directory

```
? What do you want to use as your public directory?
```

- พิมพ์: `.` (จุด - หมายถึงโฟลเดอร์ปัจจุบัน)
- กด Enter

#### คำถามที่ 9: Single-page app

```
? Configure as a single-page app?
```

- พิมพ์: `N`
- กด Enter

#### คำถามที่ 10: GitHub deployment

```
? Set up automatic builds and deploys with GitHub?
```

- พิมพ์: `N`
- กด Enter

✅ **เสร็จแล้ว!** คุณจะเห็นโฟลเดอร์และไฟล์ใหม่:

```
d:\DN-Booking\Book\
├── functions/           # โฟลเดอร์สำหรับ Cloud Functions
│   ├── index.js        # ไฟล์เขียนโค้ด Functions
│   └── package.json
├── firestore.rules     # กฎความปลอดภัยของ Firestore
├── firestore.indexes.json
├── firebase.json       # Config หลัก
└── .firebaserc         # เก็บ Project ID
```

### 5.5 แก้ไขไฟล์ index.html เพื่อเชื่อมต่อ Firebase

เปิดไฟล์ `index.html` แล้วเพิ่มโค้ดนี้ **ก่อนแท็ก `</body>`:**

```html
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-functions-compat.js"></script>

    <script>
        // Firebase Configuration
        const firebaseConfig = {
            apiKey: "AIzaSyC1234567890abcdefghijk",           // ← ใส่ของคุณ
            authDomain: "dn-booking-system.firebaseapp.com",   // ← ใส่ของคุณ
            projectId: "dn-booking-system",                    // ← ใส่ของคุณ
            storageBucket: "dn-booking-system.appspot.com",    // ← ใส่ของคุณ
            messagingSenderId: "123456789012",                 // ← ใส่ของคุณ
            appId: "1:123456789012:web:abc123def456"           // ← ใส่ของคุณ
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        // Get references
        const db = firebase.firestore();
        const functions = firebase.functions('asia-southeast1');
    </script>

</body>
</html>
```

**⚠️ สำคัญ:** แทนที่ค่าใน `firebaseConfig` ด้วยค่าจริงที่คุณคัดลอกไว้จากขั้นตอน 5.2

### 5.6 ทดสอบการเชื่อมต่อ

เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ แล้ว:

1. กด **F12** เพื่อเปิด Developer Tools
2. ไปที่แท็บ **Console**
3. พิมพ์:

```javascript
firebase.app().name
```

ถ้าเห็น `"[DEFAULT]"` แสดงว่าเชื่อมต่อสำเร็จ ✅

---

## ขั้นตอนที่ 6: สร้าง Cloud Functions

Cloud Functions คือโค้ดที่รันบน Server ของ Firebase

### 6.1 เปิดใช้งาน Blaze Plan (จ่ายตามใช้)

⚠️ **Cloud Functions ต้องใช้ Blaze Plan** แต่ไม่ต้องกังวล:
- มี Free tier ให้ใช้ฟรีทุกเดือน
- ค่าใช้จ่ายจริงประมาณ 70-175 บาท/เดือน สำหรับ 500 การจอง
- ต้องใส่บัตรเครดิต (แต่จะไม่หักถ้าไม่เกิน Free quota)

**วิธีอัพเกรด:**

1. ที่ Firebase Console → ไปที่ **"Spark (Free)"** (มุมซ้ายล่าง)
2. คลิก **"Upgrade"**
3. เลือก **"Blaze Plan"**
4. ใส่ข้อมูลบัตรเครดิต
5. คลิก **"Purchase"**

✅ อัพเกรดสำเร็จ

### 6.2 แก้ไขไฟล์ functions/index.js

เปิดไฟล์ `functions/index.js` แล้วลบทุกอย่างออก แล้ววางโค้ดนี้:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// ========================================
// Function 1: สร้างการจอง
// ========================================
exports.createAppointment = functions
  .region('asia-southeast1')
  .https.onCall(async (data, context) => {
    try {
      const {
        appointmentDate,
        appointmentTime,
        companyName,
        visitorName,
        phone,
        email,
        recommendedProduct,
        notes
      } = data;

      // 1. Validate ข้อมูล
      if (!appointmentDate || !appointmentTime || !companyName || !visitorName || !phone || !email) {
        throw new functions.https.HttpsError('invalid-argument', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      }

      // 2. ตรวจสอบว่าช่วงเวลายังว่างอยู่หรือไม่
      const slotId = `${appointmentDate}__${appointmentTime}`;
      const slotRef = db.collection('timeSlots').doc(slotId);

      const result = await db.runTransaction(async (transaction) => {
        const slotDoc = await transaction.get(slotRef);

        if (!slotDoc.exists) {
          throw new Error('ไม่พบช่วงเวลานี้ในระบบ');
        }

        const slotData = slotDoc.data();

        if (!slotData.isAvailable || slotData.currentBookings >= slotData.maxBookings) {
          throw new Error('ขออภัย ช่วงเวลานี้ถูกจองเต็มแล้ว');
        }

        // 3. สร้างการจองใหม่
        const appointmentRef = db.collection('appointments').doc();

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
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          cancelledAt: null
        });

        // 4. อัพเดท time slot ให้เป็นไม่ว่าง
        transaction.update(slotRef, {
          isAvailable: false,
          currentBookings: admin.firestore.FieldValue.increment(1),
          appointmentId: appointmentRef.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return appointmentRef.id;
      });

      return {
        success: true,
        appointmentId: result,
        message: 'จองเวลาสำเร็จ'
      };

    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new functions.https.HttpsError('aborted', error.message);
    }
  });

// ========================================
// Function 2: ดึงช่วงเวลาที่ว่าง
// ========================================
exports.getAvailableSlots = functions
  .region('asia-southeast1')
  .https.onCall(async (data, context) => {
    try {
      const { date } = data;

      if (!date) {
        throw new functions.https.HttpsError('invalid-argument', 'กรุณาระบุวันที่');
      }

      // 1. ตรวจสอบว่าเป็นวันปิดหรือไม่
      const closedDateDoc = await db.collection('closedDates').doc(date).get();

      if (closedDateDoc.exists && closedDateDoc.data().isActive) {
        return {
          isClosed: true,
          reason: closedDateDoc.data().reason || 'วันหยุด',
          slots: []
        };
      }

      // 2. ดึง time slots ทั้งหมดของวันนี้
      const slotsSnapshot = await db.collection('timeSlots')
        .where('date', '==', date)
        .get();

      const slots = slotsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          time: data.time,
          available: data.isAvailable,
          currentBookings: data.currentBookings || 0,
          maxBookings: data.maxBookings || 1
        };
      });

      // เรียงตามเวลา
      slots.sort((a, b) => a.time.localeCompare(b.time));

      return {
        isClosed: false,
        slots: slots
      };

    } catch (error) {
      console.error('Error getting slots:', error);
      throw new functions.https.HttpsError('aborted', error.message);
    }
  });

// ========================================
// Function 3: ยกเลิกการจอง
// ========================================
exports.cancelAppointment = functions
  .region('asia-southeast1')
  .https.onCall(async (data, context) => {
    try {
      const { appointmentId, email } = data;

      if (!appointmentId || !email) {
        throw new functions.https.HttpsError('invalid-argument', 'ข้อมูลไม่ครบถ้วน');
      }

      const appointmentRef = db.collection('appointments').doc(appointmentId);

      await db.runTransaction(async (transaction) => {
        const appointmentDoc = await transaction.get(appointmentRef);

        if (!appointmentDoc.exists) {
          throw new Error('ไม่พบการจองนี้ในระบบ');
        }

        const appointmentData = appointmentDoc.data();

        // ตรวจสอบว่าอีเมลตรงกันหรือไม่
        if (appointmentData.email !== email) {
          throw new Error('ไม่มีสิทธิ์ยกเลิกการจองนี้');
        }

        if (appointmentData.status === 'cancelled') {
          throw new Error('การจองนี้ถูกยกเลิกไปแล้ว');
        }

        // อัพเดทสถานะเป็น cancelled
        transaction.update(appointmentRef, {
          status: 'cancelled',
          cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // คืนช่วงเวลากลับมาให้ว่าง
        const slotId = `${appointmentData.appointmentDate}__${appointmentData.appointmentTime}`;
        const slotRef = db.collection('timeSlots').doc(slotId);

        transaction.update(slotRef, {
          isAvailable: true,
          currentBookings: admin.firestore.FieldValue.increment(-1),
          appointmentId: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      return {
        success: true,
        message: 'ยกเลิกการจองเรียบร้อยแล้ว'
      };

    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw new functions.https.HttpsError('aborted', error.message);
    }
  });

// ========================================
// Function 4: ดึงประกาศที่ Active
// ========================================
exports.getAnnouncements = functions
  .region('asia-southeast1')
  .https.onCall(async (data, context) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const announcementsSnapshot = await db.collection('announcements')
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

    } catch (error) {
      console.error('Error getting announcements:', error);
      // ถ้า error เรื่อง index ให้คืนค่า array ว่าง
      return [];
    }
  });

// ========================================
// Function 5: ส่งอีเมลยืนยัน (Trigger)
// ========================================
exports.sendConfirmationEmail = functions
  .region('asia-southeast1')
  .firestore.document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    const appointment = snap.data();
    const appointmentId = context.params.appointmentId;

    try {
      // ดึง email template
      const templateDoc = await db.collection('emailTemplates')
        .doc('booking-confirmation')
        .get();

      if (!templateDoc.exists) {
        console.log('Email template not found');
        return;
      }

      const template = templateDoc.data();

      // แทนที่ placeholders
      const subject = template.subject.replace('{{appointmentDate}}', appointment.appointmentDate);

      const cancelUrl = `https://your-domain.web.app/cancel?id=${appointmentId}&email=${encodeURIComponent(appointment.email)}`;

      let html = template.html
        .replace(/{{visitorName}}/g, appointment.visitorName)
        .replace(/{{appointmentDate}}/g, appointment.appointmentDate)
        .replace(/{{appointmentTime}}/g, appointment.appointmentTime)
        .replace(/{{companyName}}/g, appointment.companyName)
        .replace(/{{recommendedProduct}}/g, appointment.recommendedProduct || '-')
        .replace(/{{cancelUrl}}/g, cancelUrl);

      // เพิ่มข้อมูลลงใน mail collection (ใช้กับ Trigger Email Extension)
      await db.collection('mail').add({
        to: appointment.email,
        message: {
          subject: subject,
          html: html
        }
      });

      console.log(`✅ Confirmation email queued for ${appointment.email}`);

    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  });
```

**บันทึกไฟล์** (Ctrl+S หรือ Cmd+S)

### 6.3 Deploy Functions

เปิด Terminal ที่โฟลเดอร์ `d:\DN-Booking\Book` แล้วพิมพ์:

```bash
firebase deploy --only functions
```

**รอสักครู่...** (อาจใช้เวลา 2-5 นาที)

คุณจะเห็นผลลัพธ์:

```
✔  functions[createAppointment(asia-southeast1)] Successful create operation.
✔  functions[getAvailableSlots(asia-southeast1)] Successful create operation.
✔  functions[cancelAppointment(asia-southeast1)] Successful create operation.
✔  functions[getAnnouncements(asia-southeast1)] Successful create operation.
✔  functions[sendConfirmationEmail(asia-southeast1)] Successful create operation.

✔  Deploy complete!
```

✅ **Functions พร้อมใช้งานแล้ว!**

### 6.4 ดู Functions ที่สร้าง

1. ไปที่ Firebase Console
2. คลิก **"Functions"** (เมนูซ้าย)
3. คุณจะเห็น Functions ทั้ง 5 ตัว:
   - `createAppointment`
   - `getAvailableSlots`
   - `cancelAppointment`
   - `getAnnouncements`
   - `sendConfirmationEmail`

---

## ขั้นตอนที่ 7: ตั้งค่าระบบส่งอีเมล

### 7.1 ติดตั้ง Trigger Email Extension

1. ไปที่ Firebase Console → **"Extensions"** (เมนูซ้าย)
2. คลิก **"Install Extensions"** หรือ **"Browse Extensions"**
3. ค้นหา **"Trigger Email"**
4. คลิก **"Install"**

### 7.2 ตั้งค่า Extension

จะมีคำถามให้ตอบ:

#### คำถามที่ 1: Billing

- ยืนยันว่าใช้ Blaze Plan
- คลิก **"Next"**

#### คำถามที่ 2: Review APIs

- คลิก **"Enable"** เพื่อเปิดใช้ APIs ที่จำเป็น

#### คำถามที่ 3: Configure Extension

**SMTP connection URI:**

**ถ้าใช้ Gmail:**

```
smtp://your-email@gmail.com:your-app-password@smtp.gmail.com:587
```

**วิธีสร้าง App Password:**
1. ไปที่ https://myaccount.google.com/apppasswords
2. เปิด 2-Step Verification ก่อน
3. สร้าง App Password ใหม่
4. คัดลอก password 16 หลักที่ได้
5. ใส่แทน `your-app-password` ข้างบน

**ถ้าใช้ SendGrid (แนะนำ):**

1. สมัคร SendGrid: https://sendgrid.com/free
2. สร้าง API Key
3. ใส่:

```
smtp://apikey:SG.your-api-key@smtp.sendgrid.net:587
```

**Email documents collection:**

```
mail
```

**Default FROM email address:**

```
DN Center Booking <noreply@dncenter.com>
```

**Default REPLY-TO email address:**

```
procurement@dncenter.com
```

**Users collection (optional):**

เว้นว่าง (ไม่ใช้)

**Templates collection (optional):**

```
emailTemplates
```

คลิก **"Install extension"**

**รอสักครู่...** (1-2 นาที)

✅ เมื่อเสร็จจะเห็น **"Extension installed successfully"**

### 7.3 ทดสอบส่งอีเมล

ไปที่ Firestore Database:

1. คลิก **"Start collection"**
2. Collection ID: `mail`
3. คลิก **"Next"**
4. Document ID: `test001`
5. เพิ่ม Field:

```
to: your-email@gmail.com
message: (type: map)
  └─ subject: "ทดสอบส่งอีเมล"
  └─ text: "นี่คือการทดสอบระบบส่งอีเมลของ DN Booking"
```

6. คลิก **"Save"**

**รอสักครู่...** ตรวจสอบกล่องข้อความของคุณ

✅ ถ้าได้รับอีเมล = ตั้งค่าสำเร็จ!

---

## ขั้นตอนที่ 8: ทดสอบระบบ

### 8.1 สร้างข้อมูลเริ่มต้น (Seed Data)

สร้างไฟล์ `seed-data.js` ในโฟลเดอร์ `functions/`:

```javascript
// functions/seed-data.js
const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedData() {
  console.log('🌱 Starting seed...');

  // 1. Settings
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
    slotDuration: 30,
    maxAdvanceBooking: 60,
    minAdvanceBooking: 1,
    lunchBreak: { start: '12:00', end: '14:00' },
    autoConfirm: true
  });
  console.log('✅ Settings created');

  // 2. Announcements
  await db.collection('announcements').add({
    title: 'เอกสารประกอบการเข้าพบ',
    message: 'กรุณาพกนามบัตรและแคตตาล็อกสินค้าเพื่อประกอบการพิจารณา',
    type: 'info',
    isActive: true,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    priority: 1
  });
  console.log('✅ Announcement created');

  // 3. Time Slots (7 วันข้างหน้า)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const batch = db.batch();
  let count = 0;

  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    // ข้ามวันหยุด
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    timeSlots.forEach(time => {
      const slotId = `${dateStr}__${time}`;
      const slotRef = db.collection('timeSlots').doc(slotId);

      batch.set(slotRef, {
        date: dateStr,
        time: time,
        isAvailable: true,
        maxBookings: 1,
        currentBookings: 0,
        appointmentId: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      count++;
    });
  }

  await batch.commit();
  console.log(`✅ Created ${count} time slots`);

  // 4. Email Template
  await db.collection('emailTemplates').doc('booking-confirmation').set({
    subject: 'ยืนยันการจองเวลา DN Center - {{appointmentDate}}',
    html: `
      <h1>ยืนยันการจองเรียบร้อย</h1>
      <p>เรียน คุณ {{visitorName}}</p>
      <p>ขอบคุณที่จองเวลาเข้าพบทีมจัดซื้อของ DN Center</p>
      <h3>รายละเอียดการนัดหมาย:</h3>
      <ul>
        <li><strong>วันที่:</strong> {{appointmentDate}}</li>
        <li><strong>เวลา:</strong> {{appointmentTime}} น.</li>
        <li><strong>บริษัท:</strong> {{companyName}}</li>
        <li><strong>สินค้าแนะนำ:</strong> {{recommendedProduct}}</li>
      </ul>
      <p><a href="{{cancelUrl}}">คลิกที่นี่เพื่อยกเลิกการจอง</a></p>
    `,
    text: 'ยืนยันการจองเวลา DN Center'
  });
  console.log('✅ Email template created');

  console.log('🎉 Seed completed!');
  process.exit(0);
}

seedData().catch(console.error);
```

**ดาวน์โหลด Service Account Key:**

1. ไปที่ Firebase Console → ⚙️ **Project Settings**
2. แท็บ **"Service accounts"**
3. คลิก **"Generate new private key"**
4. คลิก **"Generate key"**
5. จะได้ไฟล์ `.json` มา
6. เปลี่ยนชื่อเป็น `service-account-key.json`
7. วางในโฟลเดอร์ `functions/`

**รันคำสั่ง Seed:**

```bash
cd functions
node seed-data.js
```

คุณจะเห็น:

```
🌱 Starting seed...
✅ Settings created
✅ Announcement created
✅ Created 60 time slots
✅ Email template created
🎉 Seed completed!
```

### 8.2 แก้ไข index.html ให้เชื่อมกับ Functions

เปิดไฟล์ `index.html` แล้วแทนที่ส่วน JavaScript ทั้งหมด (ตั้งแต่ `<script>` ถึง `</script>` ก่อน Firebase SDK) ด้วยโค้ดนี้:

```javascript
<script>
    document.addEventListener('DOMContentLoaded', async function() {
        // State management
        const state = {
            currentDate: new Date(),
            selectedDate: null,
            selectedTimeSlot: null
        };

        // Get Cloud Functions
        const createAppointment = firebase.functions().httpsCallable('createAppointment');
        const getAvailableSlots = firebase.functions().httpsCallable('getAvailableSlots');
        const cancelAppointment = firebase.functions().httpsCallable('cancelAppointment');
        const getAnnouncements = firebase.functions().httpsCallable('getAnnouncements');

        // Load announcements
        async function loadAnnouncements() {
            try {
                const result = await getAnnouncements();
                if (result.data && result.data.length > 0) {
                    const announcementList = result.data.map(ann =>
                        `<li>${ann.message}</li>`
                    ).join('');

                    document.querySelector('.announcement-card ul').innerHTML = announcementList;
                }
            } catch (error) {
                console.error('Error loading announcements:', error);
            }
        }

        // Display the current month and year
        function updateMonthDisplay() {
            const formatter = new Intl.DateTimeFormat('th-TH', { month: 'long', year: 'numeric' });
            document.getElementById('current-month').textContent = formatter.format(state.currentDate);
        }

        // Generate calendar
        function generateCalendar() {
            const calendarBody = document.getElementById('calendar-body');
            calendarBody.innerHTML = '';

            const year = state.currentDate.getFullYear();
            const month = state.currentDate.getMonth();

            const firstDay = new Date(year, month, 1);
            const startingDay = firstDay.getDay();
            const lastDay = new Date(year, month + 1, 0);
            const totalDays = lastDay.getDate();
            const today = new Date();

            let date = 1;

            for (let i = 0; i < 6; i++) {
                const row = document.createElement('tr');

                for (let j = 0; j < 7; j++) {
                    const cell = document.createElement('td');

                    if (i === 0 && j < startingDay) {
                        cell.innerHTML = '<button class="calendar-day empty"></button>';
                    } else if (date > totalDays) {
                        cell.innerHTML = '<button class="calendar-day empty"></button>';
                    } else {
                        const currentDateObj = new Date(year, month, date);
                        const isPast = currentDateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        const isToday = date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                        const isSelected = state.selectedDate && date === state.selectedDate.getDate() && month === state.selectedDate.getMonth() && year === state.selectedDate.getFullYear();

                        let classes = ['calendar-day'];
                        if (isPast) classes.push('disabled');
                        if (isToday) classes.push('today');
                        if (isSelected) classes.push('selected');

                        const button = document.createElement('button');
                        button.className = classes.join(' ');
                        button.textContent = date;
                        button.setAttribute('data-date', `${year}-${month+1}-${date}`);

                        if (!isPast) {
                            button.addEventListener('click', function() {
                                selectDate(currentDateObj);
                            });
                        }

                        cell.appendChild(button);
                        date++;
                    }

                    row.appendChild(cell);
                }

                calendarBody.appendChild(row);
                if (date > totalDays) break;
            }
        }

        // Select date
        async function selectDate(date) {
            state.selectedDate = date;
            state.selectedTimeSlot = null;

            // Update calendar display
            generateCalendar();

            // Update selected date display
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('selected-date-display').textContent = date.toLocaleDateString('th-TH', options);

            // Load time slots from Firebase
            await loadTimeSlots(date);

            // Update booking summary
            updateBookingSummary();
        }

        // Load time slots from Firebase
        async function loadTimeSlots(date) {
            const timeSlotsContainer = document.getElementById('time-slots');
            timeSlotsContainer.innerHTML = '<div style="text-align:center;padding:20px;">กำลังโหลด...</div>';

            try {
                const dateStr = date.toISOString().split('T')[0];
                const result = await getAvailableSlots({ date: dateStr });

                timeSlotsContainer.innerHTML = '';

                if (result.data.isClosed) {
                    timeSlotsContainer.innerHTML = `
                        <div style="grid-column: 1/-1; text-align:center; padding:20px; color:#ef4444;">
                            <strong>วันนี้ปิดทำการ</strong><br>
                            ${result.data.reason}
                        </div>
                    `;
                    return;
                }

                if (result.data.slots.length === 0) {
                    timeSlotsContainer.innerHTML = `
                        <div style="grid-column: 1/-1; text-align:center; padding:20px;">
                            ยังไม่มีช่วงเวลาให้จองสำหรับวันนี้
                        </div>
                    `;
                    return;
                }

                result.data.slots.forEach(slot => {
                    const slotEl = document.createElement('div');
                    slotEl.className = 'time-slot';
                    slotEl.textContent = slot.time;
                    slotEl.setAttribute('data-time', slot.time);

                    if (!slot.available) {
                        slotEl.classList.add('disabled');
                    } else {
                        slotEl.addEventListener('click', function() {
                            selectTimeSlot(slot.time);
                        });
                    }

                    timeSlotsContainer.appendChild(slotEl);
                });

            } catch (error) {
                console.error('Error loading slots:', error);
                timeSlotsContainer.innerHTML = `
                    <div style="grid-column: 1/-1; text-align:center; padding:20px; color:#ef4444;">
                        เกิดข้อผิดพลาดในการโหลดข้อมูล
                    </div>
                `;
            }
        }

        // Select time slot
        function selectTimeSlot(time) {
            state.selectedTimeSlot = time;

            // Update time slot display
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('selected');
            });
            document.querySelector(`[data-time="${time}"]`).classList.add('selected');

            // Update booking summary
            updateBookingSummary();

            // Enable form
            document.getElementById('book-btn').disabled = false;
        }

        // Update booking summary
        function updateBookingSummary() {
            const summaryEl = document.getElementById('booking-summary');

            if (state.selectedDate && state.selectedTimeSlot) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const dateStr = state.selectedDate.toLocaleDateString('th-TH', options);
                summaryEl.innerHTML = `
                    <strong>วันที่:</strong> ${dateStr}
                    <br>
                    <strong>เวลา:</strong> ${state.selectedTimeSlot} น.
                `;
                summaryEl.classList.remove('empty');
                summaryEl.classList.add('filled');
            } else if (state.selectedDate) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const dateStr = state.selectedDate.toLocaleDateString('th-TH', options);
                summaryEl.innerHTML = `
                    <strong>วันที่ที่เลือก:</strong> ${dateStr}<br>
                    <span>กรุณาเลือกช่วงเวลา</span>
                `;
                summaryEl.classList.remove('empty', 'filled');
            } else {
                summaryEl.textContent = 'กรุณาเลือกวันที่และเวลาที่ต้องการก่อนดำเนินการต่อ';
                summaryEl.classList.add('empty');
                summaryEl.classList.remove('filled');
            }
        }

        // Initialize
        updateMonthDisplay();
        generateCalendar();
        loadAnnouncements();

        // Month navigation
        document.getElementById('prev-month').addEventListener('click', function() {
            state.currentDate.setMonth(state.currentDate.getMonth() - 1);
            updateMonthDisplay();
            generateCalendar();
        });

        document.getElementById('next-month').addEventListener('click', function() {
            state.currentDate.setMonth(state.currentDate.getMonth() + 1);
            updateMonthDisplay();
            generateCalendar();
        });

        // Form submission
        document.getElementById('appointment-form').addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('book-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังบันทึก...';

            const appointmentData = {
                appointmentDate: state.selectedDate.toISOString().split('T')[0],
                appointmentTime: state.selectedTimeSlot,
                companyName: document.getElementById('company-name').value.trim(),
                visitorName: document.getElementById('visitor-name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                recommendedProduct: document.getElementById('recommended-product').value.trim(),
                notes: document.getElementById('notes').value.trim()
            };

            try {
                const result = await createAppointment(appointmentData);

                if (result.data.success) {
                    // Update confirmation details
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    document.getElementById('conf-date').textContent = state.selectedDate.toLocaleDateString('th-TH', options);
                    document.getElementById('conf-time').textContent = state.selectedTimeSlot;
                    document.getElementById('conf-company').textContent = appointmentData.companyName;
                    document.getElementById('conf-visitor').textContent = appointmentData.visitorName;
                    document.getElementById('conf-phone').textContent = appointmentData.phone;
                    document.getElementById('conf-email').textContent = appointmentData.email;
                    document.getElementById('conf-product').textContent = appointmentData.recommendedProduct || '-';
                    document.getElementById('conf-notes').textContent = appointmentData.notes || '-';

                    // Show confirmation
                    document.getElementById('booking-content').style.display = 'none';
                    document.getElementById('confirmation').style.display = 'block';
                }

            } catch (error) {
                console.error('Error creating appointment:', error);
                alert('เกิดข้อผิดพลาด: ' + (error.message || 'กรุณาลองใหม่อีกครั้ง'));
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> ยืนยันการนัดหมาย';
            }
        });

        // New booking
        document.getElementById('new-booking').addEventListener('click', function() {
            // Reset state
            state.selectedDate = null;
            state.selectedTimeSlot = null;
            state.currentDate = new Date();

            // Reset form
            document.getElementById('appointment-form').reset();
            document.getElementById('book-btn').disabled = true;
            document.getElementById('book-btn').innerHTML = '<i class="fas fa-calendar-check"></i> ยืนยันการนัดหมาย';

            // Reset display
            document.getElementById('booking-content').style.display = 'block';
            document.getElementById('confirmation').style.display = 'none';

            // Reset calendar
            updateMonthDisplay();
            generateCalendar();
            document.getElementById('selected-date-display').textContent = 'กรุณาเลือกวันที่ก่อน';
            document.getElementById('time-slots').innerHTML = `
                <div class="time-slot disabled">09:00</div>
                <div class="time-slot">09:30</div>
                <div class="time-slot">10:00</div>
                <div class="time-slot disabled">10:30</div>
                <div class="time-slot">11:00</div>
                <div class="time-slot">11:30</div>
                <div class="time-slot disabled">14:00</div>
                <div class="time-slot">14:30</div>
                <div class="time-slot">15:00</div>
            `;

            // Reset booking summary
            updateBookingSummary();
        });
    });
</script>
```

**บันทึกไฟล์**

### 8.3 ทดสอบการจองในเครื่อง

```bash
firebase serve
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5000`

ลองทำการจอง:

1. เลือกวันที่
2. เลือกเวลา
3. กรอกข้อมูล
4. คลิก "ยืนยันการนัดหมาย"

✅ ถ้าเห็นหน้ายืนยัน = สำเร็จ!

ตรวจสอบที่ Firestore Database คุณจะเห็นข้อมูลใน Collection `appointments`

---

## ขั้นตอนที่ 9: Deploy เว็บไซต์

### 9.1 Deploy ขึ้น Firebase Hosting

```bash
firebase deploy
```

รอสักครู่... (1-2 นาที)

คุณจะเห็น:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/dn-booking-system
Hosting URL: https://dn-booking-system.web.app
```

✅ **เว็บไซต์ของคุณพร้อมใช้งานแล้ว!**

### 9.2 เข้าชมเว็บไซต์

เปิดเบราว์เซอร์ไปที่ URL ที่ได้ เช่น:

```
https://dn-booking-system.web.app
```

🎉 **ระบบจองนัดหมายของคุณทำงานแล้ว!**

### 9.3 ตั้งค่า Custom Domain (ถ้าต้องการ)

ถ้าคุณมี Domain เช่น `booking.dncenter.com`:

1. ไปที่ Firebase Console → **"Hosting"**
2. คลิก **"Add custom domain"**
3. ใส่ domain ของคุณ
4. ทำตามขั้นตอนการยืนยันความเป็นเจ้าของ
5. เพิ่ม DNS records ตามที่ Firebase บอก

---

## แก้ปัญหาที่พบบ่อย

### ❌ ปัญหา: Functions deploy ไม่ได้

**อาการ:** `Error: HTTP Error: 403, Billing account not configured`

**แก้ไข:**
- ต้องอัพเกรดเป็น Blaze Plan ก่อน
- ไปที่ Firebase Console → Upgrade

---

### ❌ ปัญหา: ไม่ได้รับอีเมล

**เช็คอันดับแรก:**
1. ตรวจสอบ Spam folder
2. ดูใน Firestore collection `mail` → document ที่สร้าง → field `delivery.state` ควรเป็น `SUCCESS`

**ถ้ายัง error:**
- ตรวจสอบ SMTP URI ให้ถูกต้อง
- ลอง resend ใหม่

---

### ❌ ปัญหา: Firestore Security Rules

**อาการ:** `Error: Missing or insufficient permissions`

**แก้ไข:**

แก้ไฟล์ `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ เปิดทั้งหมดก่อน (สำหรับทดสอบ)
    }
  }
}
```

Deploy:

```bash
firebase deploy --only firestore:rules
```

> ⚠️ **สำคัญ:** หลังทดสอบเสร็จให้ใช้ Security Rules ที่เข้มงวดกว่านี้

---

### ❌ ปัญหา: Time slots ไม่แสดง

**เช็ค:**
1. ดูใน Firestore → Collection `timeSlots` มีข้อมูลหรือไม่
2. รัน seed script อีกครั้ง: `node functions/seed-data.js`

---

### ❌ ปัญหา: ค่าใช้จ่าย Firebase สูง

**วิธีลด:**
1. Enable caching สำหรับ Hosting
2. จำกัด queries ใน Firestore
3. ใช้ Indexes อย่างมีประสิทธิภาพ

**ดูค่าใช้จ่าย:**
- Firebase Console → ⚙️ Settings → Usage and billing

---

## 🎓 สรุป

คุณได้เรียนรู้:

✅ สร้าง Firebase Project
✅ ตั้งค่า Firestore Database
✅ เขียนและ Deploy Cloud Functions
✅ ติดตั้งและใช้ Firebase Extensions
✅ เชื่อมต่อเว็บไซต์กับ Firebase
✅ Deploy เว็บไซต์ขึ้น Firebase Hosting

---

## 📚 อ่านเพิ่มเติม

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Get Started](https://firebase.google.com/docs/firestore/quickstart)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

## 💬 ติดต่อสอบถาม

หากมีข้อสงสัยหรือต้องการความช่วยเหลือ:
- Email: dev-team@dncenter.com
- Firebase Support: https://firebase.google.com/support

---

**เอกสารนี้สร้างขึ้นเมื่อ:** 2 พฤศจิกายน 2568
**เวอร์ชัน:** 1.0 (สำหรับผู้เริ่มต้น)
**ผู้จัดทำ:** Development Team
