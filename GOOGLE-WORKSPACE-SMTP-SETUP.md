# คู่มือการตั้งค่า Google Workspace SMTP สำหรับระบบจองนัดหมาย DN Center

## 📋 ภาพรวม

เปลี่ยนจากการใช้ EmailJS (มีโควต้าจำกัด) มาใช้ Google Workspace SMTP แทน

### ✅ ข้อดี
- ✅ **ไม่มีโควต้าจำกัด** (หรือสูงมาก: 2,000 อีเมล/วัน ต่อ user)
- ✅ **ความน่าเชื่อถือสูง** - ไม่เข้า Spam
- ✅ **ฟรี** - ใช้ Workspace ที่มีอยู่แล้ว
- ✅ **ควบคุมได้เต็มที่** - ใช้อีเมลโดเมนของตัวเอง
- ✅ **รองรับ HTML Email** - ส่งอีเมลสวยงามได้

### ⚠️ ข้อจำกัด
- ❌ **ต้องมี Backend** - ไม่สามารถส่งจาก Client-side (Browser) ได้โดยตรง
- ❌ **ต้องเก็บ Password ปลอดภัย** - ใช้ App Password หรือ OAuth2

---

## 🎯 แผนการดำเนินงาน

### Phase 1: ตั้งค่า Google Workspace (5-10 นาที)
1. สร้าง Email Alias หรือ Group Email
2. สร้าง App Password สำหรับ SMTP
3. ทดสอบการส่งอีเมล

### Phase 2: สร้าง Backend API (30-60 นาที)
1. เลือก Backend Platform (Firebase Functions / Node.js / PHP)
2. ติดตั้ง SMTP Library
3. สร้าง API Endpoint สำหรับส่งอีเมล
4. ทดสอบ API

### Phase 3: แก้ไข Frontend (15-30 นาที)
1. เปลี่ยนจากเรียก EmailJS เป็นเรียก Backend API
2. ทดสอบการทำงาน
3. Deploy

---

## 📧 Part 1: ตั้งค่า Google Workspace

### ขั้นตอนที่ 1: สร้าง Email สำหรับส่งการแจ้งเตือน

#### **ตัวเลือก A: สร้าง Email Alias (ง่ายที่สุด)**

**ข้อดี:**
- ตั้งค่าง่าย
- ไม่ต้องจัดการ Mailbox เพิ่ม

**ข้อเสีย:**
- อีเมลที่ส่งกลับจะไปที่บัญชีหลัก

**วิธีทำ:**

1. เข้า **Google Admin Console**: https://admin.google.com
2. ไปที่ **Users** > เลือก `pur.admin@drugnetcenter.com`
3. คลิก **User information**
4. ในส่วน **Email aliases** คลิก **Add alternate email**
5. ใส่: `no-reply@drugnetcenter.com`
6. คลิก **SAVE**

✅ **เสร็จแล้ว!** ตอนนี้คุณสามารถส่งอีเมลจาก `no-reply@drugnetcenter.com` ได้แล้ว

---

#### **ตัวเลือก B: สร้าง Google Group (แนะนำ)**

**ข้อดี:**
- ทุกคนในทีมรับอีเมลตอบกลับได้
- จัดการสมาชิกได้ง่าย
- สามารถตั้งค่า Auto-reply ได้

**ข้อเสีย:**
- ต้องตั้งค่าเพิ่มเติมเล็กน้อย

**วิธีทำ:**

1. เข้า **Google Admin Console**: https://admin.google.com
2. ไปที่ **Groups** > **Create group**
3. กรอกข้อมูล:
   - **Group name:** DN Booking Notifications
   - **Group email:** `no-reply@drugnetcenter.com`
   - **Group description:** อีเมลสำหรับส่งการแจ้งเตือนการจอง
4. คลิก **NEXT**
5. เลือก **Access type:**
   - **Who can join:** Only invited users
   - **Who can view conversations:** Group members
   - **Who can post:** Anyone on the internet (สำคัญ! เพื่อให้ส่งจาก SMTP ได้)
6. คลิก **CREATE GROUP**
7. เพิ่มสมาชิก:
   - `pur.admin@drugnetcenter.com`
   - `pur.sriprai@drugnetcenter.com`
8. คลิก **ADD MEMBERS**

✅ **เสร็จแล้ว!** ตอนนี้อีเมลที่ส่งไปหา `no-reply@drugnetcenter.com` จะไปถึงทุกคนในกลุ่ม

---

### ขั้นตอนที่ 2: สร้าง App Password สำหรับ SMTP

**⚠️ สำคัญ:** ห้ามใช้รหัสผ่านจริงของบัญชี Google! ต้องใช้ App Password

**วิธีสร้าง App Password:**

1. เข้า **Google Account**: https://myaccount.google.com
2. ไปที่ **Security** (ความปลอดภัย)
3. เปิดใช้งาน **2-Step Verification** (ถ้ายังไม่ได้เปิด)
4. กลับไปที่ **Security** > เลื่อนลงหา **App passwords**
5. คลิก **App passwords**
6. เลือก:
   - **Select app:** Mail
   - **Select device:** Other (Custom name)
   - ใส่ชื่อ: `DN Booking System`
7. คลิก **GENERATE**
8. **คัดลอก App Password** (16 ตัวอักษร เช่น `abcd efgh ijkl mnop`)

⚠️ **เก็บรหัสนี้ไว้ในที่ปลอดภัย!** จะไม่แสดงอีกครั้ง

---

### ขั้นตอนที่ 3: ทดสอบการส่งอีเมล

**ใช้ Gmail SMTP Test Tool:**

1. เข้า https://www.gmass.co/smtp-test
2. กรอกข้อมูล:
   - **SMTP Server:** `smtp.gmail.com`
   - **Port:** `587` (TLS) หรือ `465` (SSL)
   - **Username:** `pur.admin@drugnetcenter.com`
   - **Password:** App Password ที่ได้จากขั้นตอนที่ 2
   - **From:** `no-reply@drugnetcenter.com`
   - **To:** อีเมลของคุณ
3. คลิก **Send Test Email**

✅ **ถ้าส่งสำเร็จ** = ตั้งค่าถูกต้อง!
❌ **ถ้าส่งไม่สำเร็จ** = ตรวจสอบ App Password อีกครั้ง

---

## 🔧 Part 2: สร้าง Backend API

### ตัวเลือก 1: Firebase Cloud Functions (แนะนำ - เพราะใช้ Firebase อยู่แล้ว)

#### 2.1 ติดตั้ง Firebase CLI

```bash
# ติดตั้ง Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# เข้าโฟลเดอร์โปรเจค
cd d:\DN-Booking\Book

# Initialize Functions
firebase init functions
```

เลือก:
- **Language:** JavaScript
- **ESLint:** Yes
- **Install dependencies:** Yes

#### 2.2 ติดตั้ง Nodemailer

```bash
cd functions
npm install nodemailer
```

#### 2.3 สร้างไฟล์ `functions/index.js`

```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

admin.initializeApp();

// ตั้งค่า SMTP Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'pur.admin@drugnetcenter.com',
        pass: functions.config().gmail.password // เก็บใน Firebase Config
    }
});

// API Endpoint สำหรับส่งอีเมล
exports.sendBookingEmail = functions.https.onCall(async (data, context) => {
    try {
        const { to, subject, html, action } = data;
        
        // ส่งอีเมลถึงลูกค้า
        const customerEmail = await transporter.sendMail({
            from: '"DN Center Booking" <no-reply@drugnetcenter.com>',
            to: to,
            subject: subject,
            html: html
        });
        
        // ส่งอีเมลถึง Admin
        const adminEmail = await transporter.sendMail({
            from: '"DN Center Booking" <no-reply@drugnetcenter.com>',
            to: 'pur.admin@drugnetcenter.com',
            subject: `[Admin] ${subject}`,
            html: html
        });
        
        // บันทึก Log
        await admin.firestore().collection('email_logs').add({
            to: to,
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
        console.error('Email sending error:', error);
        
        // บันทึก Error Log
        await admin.firestore().collection('email_logs').add({
            to: data.to,
            subject: data.subject,
            action: data.action,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'failed',
            error: error.message
        });
        
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// ฟังก์ชันสำหรับส่ง Email Reminder (ทำงานทุกวันเวลา 08:00)
exports.sendDailyReminders = functions.pubsub
    .schedule('0 8 * * *')
    .timeZone('Asia/Bangkok')
    .onRun(async (context) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        // ดึงการจองที่จะเกิดขึ้นพรุ่งนี้
        const snapshot = await admin.firestore()
            .collection('bookings')
            .where('date', '==', tomorrowStr)
            .get();
        
        const promises = [];
        
        snapshot.forEach(doc => {
            const booking = doc.data();
            
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #5c3a9e;">🔔 เตือนความจำ: นัดหมายพรุ่งนี้</h2>
                        <p>เรียน คุณ${booking.visitorName},</p>
                        <p>นี่คือการเตือนความจำว่าคุณมีนัดหมายกับทีมจัดซื้อ DN Center <strong>พรุ่งนี้</strong></p>
                        <div style="background: #f4efff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>📅 วันที่:</strong> ${formatDate(booking.date)}</p>
                            <p><strong>🕐 เวลา:</strong> ${booking.time} น.</p>
                            <p><strong>🏢 บริษัท:</strong> ${booking.companyName}</p>
                        </div>
                        <p>หากต้องการเปลี่ยนแปลงหรือยกเลิกการนัดหมาย กรุณาติดต่อเรา</p>
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="color: #666; font-size: 0.9em;">
                            <strong>DN Center</strong><br>
                            📧 Email: pur.admin@drugnetcenter.com
                        </p>
                    </div>
                </body>
                </html>
            `;
            
            promises.push(
                transporter.sendMail({
                    from: '"DN Center Booking" <no-reply@drugnetcenter.com>',
                    to: booking.email,
                    subject: '🔔 เตือนความจำ: นัดหมายพรุ่งนี้กับ DN Center',
                    html: html
                })
            );
        });
        
        const results = await Promise.allSettled(promises);
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        
        console.log(`Sent ${successCount}/${promises.length} reminder emails`);
        return null;
    });

// Helper function
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
```

#### 2.4 ตั้งค่า App Password ใน Firebase Config

```bash
# ตั้งค่า Gmail App Password
firebase functions:config:set gmail.password="abcd efgh ijkl mnop"

# ตรวจสอบ
firebase functions:config:get
```

#### 2.5 Deploy Functions

```bash
firebase deploy --only functions
```

---

### ตัวเลือก 2: Node.js + Express (สำหรับ Self-hosted)

#### 2.1 สร้างโปรเจค

```bash
mkdir dn-booking-api
cd dn-booking-api
npm init -y
npm install express nodemailer cors dotenv
```

#### 2.2 สร้างไฟล์ `.env`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=pur.admin@drugnetcenter.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=no-reply@drugnetcenter.com
ADMIN_EMAIL=pur.admin@drugnetcenter.com
PORT=3000
```

#### 2.3 สร้างไฟล์ `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ตั้งค่า SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// API Endpoint
app.post('/api/send-booking-email', async (req, res) => {
    try {
        const { to, subject, html, action } = req.body;
        
        // ส่งอีเมลถึงลูกค้า
        const customerEmail = await transporter.sendMail({
            from: `"DN Center Booking" <${process.env.SMTP_FROM}>`,
            to: to,
            subject: subject,
            html: html
        });
        
        // ส่งอีเมลถึง Admin
        const adminEmail = await transporter.sendMail({
            from: `"DN Center Booking" <${process.env.SMTP_FROM}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `[Admin] ${subject}`,
            html: html
        });
        
        res.json({
            success: true,
            customerEmail: true,
            adminEmail: true,
            messageId: customerEmail.messageId
        });
        
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

#### 2.4 รัน Server

```bash
node server.js
```

---

### ตัวเลือก 3: PHP (สำหรับ Shared Hosting)

#### 3.1 สร้างไฟล์ `send-email.php`

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $mail = new PHPMailer(true);
    
    try {
        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'pur.admin@drugnetcenter.com';
        $mail->Password = 'abcd efgh ijkl mnop'; // App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';
        
        // Email to Customer
        $mail->setFrom('no-reply@drugnetcenter.com', 'DN Center Booking');
        $mail->addAddress($data['to']);
        $mail->Subject = $data['subject'];
        $mail->isHTML(true);
        $mail->Body = $data['html'];
        $mail->send();
        
        // Email to Admin
        $mail->clearAddresses();
        $mail->addAddress('pur.admin@drugnetcenter.com');
        $mail->Subject = '[Admin] ' . $data['subject'];
        $mail->send();
        
        echo json_encode([
            'success' => true,
            'customerEmail' => true,
            'adminEmail' => true
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $mail->ErrorInfo
        ]);
    }
}
?>
```

---

## 🎨 Part 3: แก้ไข Frontend

### 3.1 สร้างไฟล์ `email-service.js`

```javascript
/**
 * Email Service สำหรับ DN Booking System
 * ใช้ Backend API แทน EmailJS
 */

class EmailService {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
    }
    
    /**
     * สร้าง HTML Email Template
     */
    createEmailHTML(bookingData, action = 'created') {
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
        
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Sarabun', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #5c3a9e 0%, #7851a9 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .status-created {
            background: #d4edda;
            color: #155724;
        }
        .status-updated {
            background: #fff3cd;
            color: #856404;
        }
        .status-cancelled {
            background: #f8d7da;
            color: #721c24;
        }
        .info-card {
            background: #f8f9fa;
            border-left: 4px solid #5c3a9e;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .info-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #5c3a9e;
            min-width: 140px;
        }
        .info-value {
            color: #333;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .footer a {
            color: #5c3a9e;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>DN CENTER</h1>
            <p>ระบบนัดหมายทีมจัดซื้อ</p>
        </div>
        
        <div class="content">
            <span class="status-badge status-${actionClass[action]}">
                ${actionText[action]}
            </span>
            
            <p>เรียน คุณ${bookingData.visitorName},</p>
            
            <p>${greetingMessage[action]}</p>
            
            <div class="info-card">
                <div class="info-row">
                    <span class="info-label">📅 วันที่:</span>
                    <span class="info-value">${this.formatDate(bookingData.date)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🕐 เวลา:</span>
                    <span class="info-value">${bookingData.time} น.</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🏢 บริษัท:</span>
                    <span class="info-value">${bookingData.companyName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">👤 ผู้เข้าพบ:</span>
                    <span class="info-value">${bookingData.visitorName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📞 เบอร์โทร:</span>
                    <span class="info-value">${bookingData.phone}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📧 อีเมล:</span>
                    <span class="info-value">${bookingData.email}</span>
                </div>
                ${bookingData.recommendedProduct ? `
                <div class="info-row">
                    <span class="info-label">📦 สินค้าแนะนำ:</span>
                    <span class="info-value">${bookingData.recommendedProduct}</span>
                </div>
                ` : ''}
                ${bookingData.notes ? `
                <div class="info-row">
                    <span class="info-label">📝 หมายเหตุ:</span>
                    <span class="info-value">${bookingData.notes}</span>
                </div>
                ` : ''}
            </div>
            
            <p>หากต้องการเปลี่ยนแปลงหรือยกเลิกการนัดหมาย กรุณาติดต่อเรา</p>
        </div>
        
        <div class="footer">
            <p><strong>DN Center</strong></p>
            <p>📧 Email: pur.admin@drugnetcenter.com</p>
            <p>📞 โทร: 02-XXX-XXXX</p>
        </div>
    </div>
</body>
</html>
        `;
    }
    
    /**
     * Format date เป็นภาษาไทย
     */
    formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('th-TH', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    /**
     * ส่งอีเมลแจ้งเตือน
     */
    async sendBookingNotification(bookingData, action = 'created') {
        try {
            const actionText = {
                'created': 'ยืนยันการจองนัดหมาย',
                'updated': 'แจ้งเตือนการแก้ไขการจอง',
                'cancelled': 'แจ้งเตือนการยกเลิกการจอง'
            };
            
            const html = this.createEmailHTML(bookingData, action);
            const subject = `[DN Center] ${actionText[action]} - ${bookingData.visitorName}`;
            
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: bookingData.email,
                    subject: subject,
                    html: html,
                    action: action
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            console.log('✅ Email sent successfully:', result);
            
            return {
                success: true,
                customerEmail: result.customerEmail,
                adminEmail: result.adminEmail
            };
            
        } catch (error) {
            console.error('❌ Email sending error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use
const emailService = new EmailService('YOUR_API_ENDPOINT_HERE');
```

### 3.2 แก้ไขไฟล์ `index.html`

ค้นหาและแทนที่:

```javascript
// ❌ ลบส่วนนี้
// Initialize EmailJS
(function() {
    emailjs.init('5Og5BTJsHVGqulp5c');
})();

// ❌ ลบฟังก์ชันเดิม
function sendBookingNotification(bookingData, action = 'created') {
    // ... EmailJS code ...
}
```

แทนที่ด้วย:

```javascript
// ✅ เพิ่มส่วนนี้
// กำหนด API Endpoint
const API_ENDPOINT = 'https://YOUR-PROJECT.cloudfunctions.net/sendBookingEmail';
// หรือ const API_ENDPOINT = 'http://localhost:3000/api/send-booking-email';

// Import Email Service
const emailService = new EmailService(API_ENDPOINT);

// ใช้ฟังก์ชันใหม่
async function sendBookingNotification(bookingData, action = 'created') {
    return await emailService.sendBookingNotification(bookingData, action);
}
```

---

## 📊 การเปรียบเทียบ

| ฟีเจอร์ | EmailJS | Google Workspace SMTP |
|---------|---------|----------------------|
| **โควต้า** | 200/เดือน (Free) | 2,000/วัน ต่อ user |
| **ค่าใช้จ่าย** | $0-35/เดือน | $0 (ใช้ที่มีอยู่) |
| **ความน่าเชื่อถือ** | ปานกลาง | สูงมาก |
| **Spam Score** | อาจเข้า Spam | ไม่เข้า Spam |
| **Setup** | ง่าย (Client-side) | ปานกลาง (ต้องมี Backend) |
| **ความปลอดภัย** | ปานกลาง | สูง |
| **Customization** | จำกัด | เต็มที่ |

---

## ✅ Checklist การ Migrate

### Phase 1: Setup (1 วัน)
- [ ] สร้าง Email Alias หรือ Group: `no-reply@drugnetcenter.com`
- [ ] สร้าง App Password
- [ ] ทดสอบส่งอีเมลด้วย SMTP Test Tool
- [ ] เลือก Backend Platform (Firebase Functions แนะนำ)

### Phase 2: Development (1-2 วัน)
- [ ] ติดตั้ง Backend และ Dependencies
- [ ] สร้าง API Endpoint สำหรับส่งอีเมล
- [ ] สร้าง Email Template HTML
- [ ] ทดสอบ API ด้วย Postman หรือ curl
- [ ] Deploy Backend

### Phase 3: Integration (0.5 วัน)
- [ ] สร้างไฟล์ `email-service.js`
- [ ] แก้ไข `index.html` ให้เรียกใช้ API แทน EmailJS
- [ ] แก้ไข `admin.html` ให้เรียกใช้ API แทน EmailJS
- [ ] ทดสอบการทำงานทั้งระบบ

### Phase 4: Testing (0.5 วัน)
- [ ] ทดสอบการจองใหม่
- [ ] ทดสอบการแก้ไขการจอง
- [ ] ทดสอบการยกเลิกการจอง
- [ ] ตรวจสอบอีเมลไม่เข้า Spam
- [ ] ทดสอบบนมือถือ

### Phase 5: Deployment (0.5 วัน)
- [ ] Deploy Frontend
- [ ] Deploy Backend
- [ ] ตั้งค่า Environment Variables
- [ ] Monitor Logs
- [ ] ลบ EmailJS SDK (ถ้าไม่ใช้แล้ว)

---

## 🔒 ความปลอดภัย

### ✅ Best Practices

1. **ห้ามเก็บ Password ใน Code**
   ```javascript
   // ❌ อย่าทำ
   const password = 'abcd efgh ijkl mnop';
   
   // ✅ ควรทำ
   const password = process.env.SMTP_PASS;
   ```

2. **ใช้ App Password แทนรหัสผ่านจริง**
   - สร้างใหม่ได้ตลอด
   - ลบได้โดยไม่กระทบบัญชีหลัก

3. **จำกัด CORS**
   ```javascript
   // ❌ อย่าทำ
   app.use(cors()); // Allow all origins
   
   // ✅ ควรทำ
   app.use(cors({
       origin: 'https://your-booking-site.com'
   }));
   ```

4. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 10 // limit each IP to 10 requests per windowMs
   });
   
   app.use('/api/send-booking-email', limiter);
   ```

---

## 🆘 การแก้ปัญหา

### ปัญหา: ส่งอีเมลไม่ได้

**ตรวจสอบ:**
1. App Password ถูกต้องหรือไม่
2. 2-Step Verification เปิดอยู่หรือไม่
3. SMTP Host และ Port ถูกต้องหรือไม่
4. Firewall บล็อก Port 587 หรือไม่

### ปัญหา: อีเมลเข้า Spam

**แก้ไข:**
1. ตั้งค่า SPF Record
2. ตั้งค่า DKIM
3. ตั้งค่า DMARC
4. ใช้ Domain Email แทน Gmail

### ปัญหา: ส่งช้า

**แก้ไข:**
1. ใช้ Email Queue
2. ส่งแบบ Async
3. เพิ่ม Connection Pool

---

## 📞 ติดต่อและสนับสนุน

- **Google Workspace Support:** https://support.google.com/a
- **Nodemailer Documentation:** https://nodemailer.com
- **Firebase Functions:** https://firebase.google.com/docs/functions

---

## 🎉 สรุป

การเปลี่ยนจาก EmailJS มาใช้ Google Workspace SMTP จะให้ประโยชน์:

✅ **ไม่จำกัดโควต้า** (2,000 อีเมล/วัน ต่อ user)
✅ **ไม่มีค่าใช้จ่ายเพิ่ม**
✅ **ความน่าเชื่อถือสูง**
✅ **ควบคุมได้เต็มที่**

**ระยะเวลาการ Migrate:** ประมาณ 2-3 วัน
**ความยาก:** ปานกลาง (ต้องมีความรู้ Backend เล็กน้อย)

หากต้องการความช่วยเหลือเพิ่มเติม สามารถติดต่อได้ครับ! 🚀
