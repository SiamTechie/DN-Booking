# 🚀 Quick Start: ตั้งค่า Google Workspace SMTP สำหรับ DN Booking

## 📋 สิ่งที่คุณต้องทำ (ใช้เวลาประมาณ 30-45 นาที)

### ✅ ขั้นตอนที่ 1: สร้าง Group Email `no-reply@drugnetcenter.com` (5 นาที)

1. **เข้า Google Admin Console**
   - ไปที่: https://admin.google.com
   - Login ด้วยบัญชี Admin

2. **สร้าง Group**
   - คลิก **Groups** (กลุ่ม) ในเมนูด้านซ้าย
   - คลิก **Create group** (สร้างกลุ่ม)

3. **กรอกข้อมูล**
   ```
   Group name: DN Booking Notifications
   Group email: no-reply@drugnetcenter.com
   Group description: อีเมลสำหรับส่งการแจ้งเตือนการจอง
   ```

4. **ตั้งค่า Access Settings**
   ```
   Who can join: Only invited users
   Who can view conversations: Group members
   Who can post: Anyone on the internet ⚠️ สำคัญ!
   Who can view members: Group members
   ```
   
   > ⚠️ **สำคัญ:** ต้องเลือก "Anyone on the internet" ที่ "Who can post" เพื่อให้ส่งจาก SMTP ได้

5. **เพิ่มสมาชิก**
   - คลิก **Add members**
   - เพิ่ม:
     - `pur.admin@drugnetcenter.com`
     - `pur.sriprai@drugnetcenter.com`
   - คลิก **Add to group**

6. **บันทึก**
   - คลิก **Create group**

✅ **เสร็จแล้ว!** ตอนนี้ `no-reply@drugnetcenter.com` พร้อมใช้งาน

---

### ✅ ขั้นตอนที่ 2: สร้าง App Password (5 นาที)

1. **เข้า Google Account**
   - ไปที่: https://myaccount.google.com
   - Login ด้วย `pur.admin@drugnetcenter.com`

2. **เปิด 2-Step Verification** (ถ้ายังไม่ได้เปิด)
   - คลิก **Security** (ความปลอดภัย)
   - เลื่อนลงหา **2-Step Verification**
   - คลิก **Get started** และทำตามขั้นตอน

3. **สร้าง App Password**
   - กลับไปที่ **Security**
   - เลื่อนลงหา **App passwords**
   - คลิก **App passwords**
   - เลือก:
     - **Select app:** Mail
     - **Select device:** Other (Custom name)
     - พิมพ์: `DN Booking System`
   - คลิก **GENERATE**

4. **คัดลอก App Password**
   ```
   ตัวอย่าง: abcd efgh ijkl mnop
   ```
   
   > ⚠️ **สำคัญ:** เก็บรหัสนี้ไว้ในที่ปลอดภัย! จะไม่แสดงอีกครั้ง

✅ **เสร็จแล้ว!** คุณมี App Password แล้ว

---

### ✅ ขั้นตอนที่ 3: ติดตั้ง Firebase Functions (15 นาที)

#### 3.1 ติดตั้ง Firebase CLI

เปิด PowerShell และรันคำสั่ง:

```powershell
# ติดตั้ง Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# เข้าโฟลเดอร์โปรเจค
cd d:\DN-Booking\Book

# Initialize Functions
firebase init functions
```

**เลือกตัวเลือกดังนี้:**
- **Select a default Firebase project:** เลือก `booking-475115`
- **What language would you like to use?** JavaScript
- **Do you want to use ESLint?** Yes
- **Do you want to install dependencies now?** Yes

#### 3.2 ติดตั้ง Nodemailer

```powershell
cd functions
npm install nodemailer
cd ..
```

#### 3.3 แก้ไขไฟล์ `functions/index.js`

เปิดไฟล์ `d:\DN-Booking\Book\functions\index.js` และแทนที่ทั้งหมดด้วย:

```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

admin.initializeApp();

// ตั้งค่า SMTP Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'pur.admin@drugnetcenter.com',
        pass: functions.config().gmail.password
    }
});

// ฟังก์ชันสร้าง HTML Email
function createEmailHTML(bookingData, action) {
    const actionText = {
        'created': 'สร้างการจองใหม่',
        'updated': 'แก้ไขการจอง',
        'cancelled': 'ยกเลิกการจอง'
    };
    
    const actionClass = {
        'created': 'created',
        'updated': 'updated',
        'cancelled': 'cancelled'
    };
    
    const greetingMessage = {
        'created': 'ขอบคุณที่ทำการจองนัดหมายกับเรา รายละเอียดการจองของคุณมีดังนี้:',
        'updated': 'การจองของคุณได้รับการแก้ไขแล้ว รายละเอียดใหม่มีดังนี้:',
        'cancelled': 'การจองของคุณได้ถูกยกเลิกแล้ว รายละเอียดการจองที่ถูกยกเลิก:'
    };
    
    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('th-TH', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #5c3a9e 0%, #7851a9 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin-bottom: 20px; }
        .status-created { background: #d4edda; color: #155724; }
        .status-updated { background: #fff3cd; color: #856404; }
        .status-cancelled { background: #f8d7da; color: #721c24; }
        .info-card { background: #f8f9fa; border-left: 4px solid #5c3a9e; padding: 15px; margin: 15px 0; border-radius: 4px; }
        .info-row { padding: 8px 0; border-bottom: 1px solid #e9ecef; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: 600; color: #5c3a9e; }
        .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>DN CENTER</h1>
            <p>ระบบนัดหมายทีมจัดซื้อ</p>
        </div>
        <div class="content">
            <span class="status-badge status-${actionClass[action]}">${actionText[action]}</span>
            <p>เรียน คุณ${bookingData.visitorName},</p>
            <p>${greetingMessage[action]}</p>
            <div class="info-card">
                <div class="info-row"><span class="info-label">📅 วันที่:</span> ${formatDate(bookingData.date)}</div>
                <div class="info-row"><span class="info-label">🕐 เวลา:</span> ${bookingData.time} น.</div>
                <div class="info-row"><span class="info-label">🏢 บริษัท:</span> ${bookingData.companyName}</div>
                <div class="info-row"><span class="info-label">👤 ผู้เข้าพบ:</span> ${bookingData.visitorName}</div>
                <div class="info-row"><span class="info-label">📞 เบอร์โทร:</span> ${bookingData.phone}</div>
                <div class="info-row"><span class="info-label">📧 อีเมล:</span> ${bookingData.email}</div>
                ${bookingData.recommendedProduct ? `<div class="info-row"><span class="info-label">📦 สินค้า:</span> ${bookingData.recommendedProduct}</div>` : ''}
                ${bookingData.notes ? `<div class="info-row"><span class="info-label">📝 หมายเหตุ:</span> ${bookingData.notes}</div>` : ''}
            </div>
            <p>หากต้องการเปลี่ยนแปลงหรือยกเลิกการนัดหมาย กรุณาติดต่อเรา</p>
        </div>
        <div class="footer">
            <p><strong>DN Center</strong></p>
            <p>📧 Email: pur.admin@drugnetcenter.com</p>
        </div>
    </div>
</body>
</html>
    `;
}

// API Endpoint สำหรับส่งอีเมล
exports.sendBookingEmail = functions.https.onCall(async (data, context) => {
    try {
        const { bookingData, action } = data;
        
        const actionText = {
            'created': 'ยืนยันการจองนัดหมาย',
            'updated': 'แจ้งเตือนการแก้ไขการจอง',
            'cancelled': 'แจ้งเตือนการยกเลิกการจอง'
        };
        
        const subject = `[DN Center] ${actionText[action]} - ${bookingData.visitorName}`;
        const html = createEmailHTML(bookingData, action);
        
        // ส่งอีเมลถึงลูกค้า
        const customerEmail = await transporter.sendMail({
            from: '"DN Center Booking" <no-reply@drugnetcenter.com>',
            to: bookingData.email,
            subject: subject,
            html: html
        });
        
        // ส่งอีเมลถึง Group (Admin + Sriprai)
        const adminEmail = await transporter.sendMail({
            from: '"DN Center Booking" <no-reply@drugnetcenter.com>',
            to: 'no-reply@drugnetcenter.com', // ส่งไปที่ Group
            subject: `[Admin] ${subject}`,
            html: html
        });
        
        // บันทึก Log
        await admin.firestore().collection('email_logs').add({
            to: bookingData.email,
            subject: subject,
            action: action,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'sent',
            messageId: customerEmail.messageId
        });
        
        return {
            success: true,
            customerEmail: true,
            adminEmail: true,
            messageId: customerEmail.messageId
        };
        
    } catch (error) {
        console.error('Email error:', error);
        
        await admin.firestore().collection('email_logs').add({
            to: data.bookingData?.email || 'unknown',
            action: data.action,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'failed',
            error: error.message
        });
        
        throw new functions.https.HttpsError('internal', error.message);
    }
});
```

#### 3.4 ตั้งค่า App Password

```powershell
# แทนที่ YOUR_APP_PASSWORD ด้วย App Password ที่ได้จากขั้นตอนที่ 2
firebase functions:config:set gmail.password="abcd efgh ijkl mnop"

# ตรวจสอบ
firebase functions:config:get
```

#### 3.5 Deploy Functions

```powershell
firebase deploy --only functions
```

รอประมาณ 2-3 นาที จนเห็นข้อความ:
```
✔  Deploy complete!
Function URL: https://us-central1-booking-475115.cloudfunctions.net/sendBookingEmail
```

✅ **เสร็จแล้ว!** Backend พร้อมใช้งาน

---

### ✅ ขั้นตอนที่ 4: แก้ไข Frontend (10 นาที)

#### 4.1 สร้างไฟล์ `email-service.js`

สร้างไฟล์ใหม่: `d:\DN-Booking\Book\email-service.js`

```javascript
/**
 * Email Service สำหรับ DN Booking System
 * ใช้ Firebase Functions แทน EmailJS
 */

// กำหนด Firebase Functions
const sendBookingEmailFunction = firebase.functions().httpsCallable('sendBookingEmail');

async function sendBookingNotification(bookingData, action = 'created') {
    try {
        console.log('📧 Sending email notification...', { action, to: bookingData.email });
        
        // เรียก Firebase Function
        const result = await sendBookingEmailFunction({
            bookingData: bookingData,
            action: action
        });
        
        console.log('✅ Email sent successfully:', result.data);
        
        return {
            success: true,
            customerEmail: result.data.customerEmail,
            adminEmail: result.data.adminEmail
        };
        
    } catch (error) {
        console.error('❌ Email sending error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
```

#### 4.2 แก้ไข `index.html`

**ค้นหา:**
```html
<!-- EmailJS SDK -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

**แทนที่ด้วย:**
```html
<!-- Email Service -->
<script src="email-service.js"></script>
```

**ค้นหา:**
```javascript
// Initialize EmailJS
(function() {
    emailjs.init('5Og5BTJsHVGqulp5c');
})();

// Email notification functions
function sendBookingNotification(bookingData, action = 'created') {
    // ... EmailJS code ...
}
```

**ลบทั้งหมด** (เพราะมีใน `email-service.js` แล้ว)

#### 4.3 แก้ไข `admin.html`

ทำเหมือนกับ `index.html`:

1. เพิ่ม `<script src="email-service.js"></script>`
2. ลบ EmailJS SDK
3. ลบฟังก์ชัน `sendBookingNotification` เดิม

---

### ✅ ขั้นตอนที่ 5: ทดสอบ (5 นาที)

#### 5.1 ทดสอบในเบราว์เซอร์

1. เปิด `index.html` ในเบราว์เซอร์
2. เปิด Console (กด F12)
3. ทดสอบส่งอีเมล:

```javascript
// วาง code นี้ใน Console
const testBooking = {
    date: '2024-12-15',
    time: '10:00',
    companyName: 'บริษัททดสอบ จำกัด',
    visitorName: 'คุณทดสอบ',
    phone: '081-234-5678',
    email: 'your-email@gmail.com', // ใส่อีเมลจริงของคุณ
    recommendedProduct: 'สินค้าทดสอบ',
    notes: 'นี่คือการทดสอบ'
};

sendBookingNotification(testBooking, 'created')
    .then(result => console.log('Result:', result));
```

4. ตรวจสอบอีเมล:
   - ✅ คุณควรได้รับอีเมลที่ `your-email@gmail.com`
   - ✅ `pur.admin@drugnetcenter.com` ควรได้รับอีเมล
   - ✅ `pur.sriprai@drugnetcenter.com` ควรได้รับอีเมล

#### 5.2 ทดสอบการจองจริง

1. ไปที่หน้าจอง
2. เลือกวันที่และเวลา
3. กรอกข้อมูล
4. กดยืนยันการจอง
5. ตรวจสอบว่าได้รับอีเมลหรือไม่

---

## 🎉 เสร็จสิ้น!

ตอนนี้ระบบของคุณใช้ Google Workspace SMTP แล้ว:

✅ **ไม่มีโควต้าจำกัด** (2,000 อีเมล/วัน)
✅ **ส่งจาก** `no-reply@drugnetcenter.com`
✅ **ทุกคนในทีมรับอีเมล** (pur.admin + pur.sriprai)
✅ **ไม่เข้า Spam**
✅ **ฟรี!**

---

## 📊 สรุปการเปลี่ยนแปลง

| ก่อน (EmailJS) | หลัง (Google Workspace) |
|----------------|------------------------|
| โควต้า 200/เดือน | 2,000/วัน |
| ส่งจาก EmailJS | ส่งจาก no-reply@drugnetcenter.com |
| Admin เท่านั้น | Admin + Sriprai |
| อาจเข้า Spam | ไม่เข้า Spam |
| Client-side | Server-side (ปลอดภัยกว่า) |

---

## 🔧 การแก้ปัญหา

### ปัญหา: Deploy Functions ไม่สำเร็จ

```powershell
# ตรวจสอบ Firebase Project
firebase projects:list

# เปลี่ยน Project
firebase use booking-475115

# ลอง Deploy อีกครั้ง
firebase deploy --only functions
```

### ปัญหา: ส่งอีเมลไม่ได้

1. ตรวจสอบ App Password ถูกต้องหรือไม่:
   ```powershell
   firebase functions:config:get
   ```

2. ดู Logs:
   ```powershell
   firebase functions:log
   ```

3. ตรวจสอบ Group Email ตั้งค่า "Who can post" เป็น "Anyone on the internet" หรือไม่

### ปัญหา: Group ไม่ได้รับอีเมล

1. ตรวจสอบสมาชิกใน Group
2. ตรวจสอบ Email delivery settings ใน Group
3. ตรวจสอบ Spam folder

---

## 📞 ต้องการความช่วยเหลือ?

หากมีปัญหาหรือข้อสงสัย:

1. ตรวจสอบ Firebase Functions Logs:
   ```powershell
   firebase functions:log --only sendBookingEmail
   ```

2. ตรวจสอบ Firestore `email_logs` collection

3. ติดต่อ Google Workspace Support: https://support.google.com/a

---

## 🚀 ฟีเจอร์เพิ่มเติม (Optional)

### เพิ่ม Email Reminder

ใน `functions/index.js` เพิ่ม:

```javascript
// ส่งอีเมลเตือนทุกวันเวลา 08:00
exports.sendDailyReminders = functions.pubsub
    .schedule('0 8 * * *')
    .timeZone('Asia/Bangkok')
    .onRun(async (context) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        const snapshot = await admin.firestore()
            .collection('bookings')
            .where('date', '==', tomorrowStr)
            .get();
        
        const promises = [];
        snapshot.forEach(doc => {
            const booking = doc.data();
            promises.push(
                transporter.sendMail({
                    from: '"DN Center" <no-reply@drugnetcenter.com>',
                    to: booking.email,
                    subject: '🔔 เตือนความจำ: นัดหมายพรุ่งนี้',
                    html: `<p>คุณมีนัดหมายพรุ่งนี้เวลา ${booking.time} น.</p>`
                })
            );
        });
        
        await Promise.all(promises);
        console.log(`Sent ${promises.length} reminders`);
    });
```

Deploy:
```powershell
firebase deploy --only functions
```

---

**เวลาที่ใช้ทั้งหมด:** ประมาณ 30-45 นาที
**ความยาก:** ⭐⭐⭐ (ปานกลาง)

ขอให้โชคดีครับ! 🎉
