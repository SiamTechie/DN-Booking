# คู่มือตั้งค่า EmailJS สำหรับระบบจองนัดหมาย DN Center

## ภาพรวม
ระบบจองนัดหมาย DN Center ได้ถูกเพิ่มฟีเจอร์การแจ้งเตือนทางอีเมลแล้ว โดยใช้บริการ EmailJS ซึ่งเป็นบริการส่งอีเมลที่ทำงานกับ JavaScript ฝั่ง client-side

## ฟีเจอร์ที่เพิ่มเข้ามา

1. **การแจ้งเตือนการจองใหม่** - ส่งอีเมลไปยังลูกค้าและผู้ดูแลระบบเมื่อมีการจองใหม่
2. **การแจ้งเตือนการแก้ไขการจอง** - ส่งอีเมลแจ้งเตือนเมื่อมีการแก้ไขข้อมูลการจอง
3. **การแจ้งเตือนการยกเลิกการจอง** - ส่งอีเมลแจ้งเตือนเมื่อมีการยกเลิกการจอง
4. **ฟีเจอร์ลืมรหัสผ่าน** - ส่งคำขอรีเซ็ตรหัสผ่านไปยังผู้ดูแลระบบ

## ขั้นตอนการตั้งค่า EmailJS

### 1. สร้างบัญชี EmailJS

1. ไปที่ https://www.emailjs.com/
2. คลิก "Sign Up" เพื่อสร้างบัญชีใหม่ (ฟรี)
3. ยืนยันอีเมลของคุณ

### 2. เชื่อมต่อบริการอีเมล (Email Service)

1. ในแดชบอร์ด EmailJS ไปที่เมนู "Email Services"
2. คลิก "Add New Service"
3. เลือกผู้ให้บริการอีเมลของคุณ เช่น:
   - Gmail
   - Outlook
   - Yahoo Mail
   - หรือ SMTP แบบกำหนดเอง
4. ทำตามขั้นตอนเพื่อเชื่อมต่อบัญชีอีเมลของคุณ
5. บันทึก **Service ID** ที่ได้ (เช่น `service_abc123`)

**หมายเหตุสำหรับ Gmail:**
- คุณอาจต้องเปิดใช้งาน "Allow less secure apps" หรือสร้าง "App Password"
- ไปที่ Google Account Settings > Security > App passwords

### 3. สร้าง Email Template

#### Template สำหรับการจอง (Booking Notification)

1. ไปที่เมนู "Email Templates"
2. คลิก "Create New Template"
3. ตั้งชื่อ Template: "DN Booking Notification"
4. กรอกข้อมูล Template ดังนี้:

**Subject:**
```
[DN Center] {{action}} - {{visitor_name}}
```

**Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #5c3a9e 0%, #7851a9 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-row { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #5c3a9e; }
        .info-label { font-weight: bold; color: #5c3a9e; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>DN CENTER</h1>
            <p>ระบบนัดหมายทีมจัดซื้อ</p>
        </div>
        <div class="content">
            <h2>{{action}}</h2>
            <p>เรียน คุณ{{visitor_name}},</p>

            <div class="info-row">
                <span class="info-label">วันที่:</span> {{booking_date}}
            </div>
            <div class="info-row">
                <span class="info-label">เวลา:</span> {{booking_time}} น.
            </div>
            <div class="info-row">
                <span class="info-label">บริษัท:</span> {{company_name}}
            </div>
            <div class="info-row">
                <span class="info-label">ผู้เข้าพบ:</span> {{visitor_name}}
            </div>
            <div class="info-row">
                <span class="info-label">เบอร์โทร:</span> {{phone}}
            </div>
            <div class="info-row">
                <span class="info-label">อีเมล:</span> {{email}}
            </div>
            <div class="info-row">
                <span class="info-label">สินค้าแนะนำ:</span> {{product}}
            </div>
            <div class="info-row">
                <span class="info-label">หมายเหตุ:</span> {{notes}}
            </div>

            <p style="margin-top: 20px;">หากมีข้อสงสัยหรือต้องการเปลี่ยนแปลงการนัดหมาย กรุณาติดต่อเรา</p>

            <div class="footer">
                <p><strong>DN Center</strong></p>
                <p>อีเมล: {{admin_email}}</p>
            </div>
        </div>
    </div>
</body>
</html>
```

5. บันทึก template และจดบันทึก **Template ID** (เช่น `template_xyz789`)

#### Template สำหรับรีเซ็ตรหัสผ่าน (Password Reset)

1. สร้าง Template ใหม่ชื่อ "DN Password Reset"
2. กรอกข้อมูล Template:

**Subject:**
```
[DN Center] คำขอรีเซ็ตรหัสผ่าน
```

**Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #5c3a9e 0%, #7851a9 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>DN CENTER</h1>
            <p>คำขอรีเซ็ตรหัสผ่าน</p>
        </div>
        <div class="content">
            <h2>มีผู้ใช้ร้องขอรีเซ็ตรหัสผ่าน</h2>

            <div class="alert">
                <p><strong>อีเมลผู้ใช้:</strong> {{user_email}}</p>
            </div>

            <p>{{reset_message}}</p>

            <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
                หากคุณไม่ได้ร้องขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยอีเมลนี้
            </p>
        </div>
    </div>
</body>
</html>
```

3. บันทึก template และจดบันทึก **Template ID**

### 4. รับ Public Key

1. ไปที่เมนู "Account" > "General"
2. คัดลอก **Public Key** ของคุณ (เช่น `abc123XYZ`)

### 5. อัพเดทไฟล์ index.html และ admin.html

#### ในไฟล์ index.html:

ค้นหาและแก้ไขบรรทัดต่อไปนี้ (ประมาณบรรทัด 1054):

```javascript
// เดิม
emailjs.init('YOUR_PUBLIC_KEY');

// แก้เป็น
emailjs.init('abc123XYZ'); // ใส่ Public Key ที่คุณได้จาก EmailJS
```

ค้นหาและแก้ไขบรรทัดต่อไปนี้ (ประมาณบรรทัด 1061-1062):

```javascript
// เดิม
const SERVICE_ID = 'YOUR_SERVICE_ID';
const BOOKING_TEMPLATE_ID = 'YOUR_BOOKING_TEMPLATE_ID';

// แก้เป็น
const SERVICE_ID = 'service_abc123'; // Service ID ของคุณ
const BOOKING_TEMPLATE_ID = 'template_xyz789'; // Template ID สำหรับการจอง
```

ค้นหาและแก้ไขบรรทัดต่อไปนี้ (ประมาณบรรทัด 1125-1126):

```javascript
// เดิม
const SERVICE_ID = 'YOUR_SERVICE_ID';
const RESET_TEMPLATE_ID = 'YOUR_RESET_TEMPLATE_ID';

// แก้เป็น
const SERVICE_ID = 'service_abc123'; // Service ID เดียวกัน
const RESET_TEMPLATE_ID = 'template_reset123'; // Template ID สำหรับรีเซ็ตรหัสผ่าน
```

#### ในไฟล์ admin.html:

ค้นหาและแก้ไขบรรทัดต่อไปนี้ (ประมาณบรรทัด 306):

```javascript
// เดิม
emailjs.init('YOUR_PUBLIC_KEY');

// แก้เป็น
emailjs.init('abc123XYZ'); // ใส่ Public Key เดียวกับใน index.html
```

ค้นหาและแก้ไขบรรทัดต่อไปนี้ (ประมาณบรรทัด 313-314):

```javascript
// เดิม
const SERVICE_ID = 'YOUR_SERVICE_ID';
const BOOKING_TEMPLATE_ID = 'YOUR_BOOKING_TEMPLATE_ID';

// แก้เป็น
const SERVICE_ID = 'service_abc123'; // Service ID เดียวกัน
const BOOKING_TEMPLATE_ID = 'template_xyz789'; // Template ID เดียวกัน
```

### 6. อัพเดทอีเมลผู้ดูแลระบบ

ในทั้งสองไฟล์ ให้แก้ไข `ADMIN_EMAIL` เป็นอีเมลจริงของผู้ดูแลระบบ:

```javascript
// เดิม
const ADMIN_EMAIL = 'sawitree@dncenter.com';

// แก้เป็นอีเมลจริง
const ADMIN_EMAIL = 'your-actual-email@example.com';
```

## ทดสอบระบบ

### ทดสอบการแจ้งเตือนการจอง:

1. เปิดหน้าจองนัดหมาย (index.html)
2. เลือกวันที่และเวลา
3. กรอกข้อมูลการจอง (ใส่อีเมลจริงที่คุณสามารถเข้าถึงได้)
4. กดยืนยันการจอง
5. ตรวจสอบกล่องจดหมายของคุณ (และอีเมลผู้ดูแลระบบ) - อาจใช้เวลา 1-2 นาที

### ทดสอบการลืมรหัสผ่าน:

1. เปิดหน้าจองนัดหมาย (index.html)
2. คลิกที่ลิงก์ "ลืมรหัสผ่าน?" ในหน้า Login Modal
3. ใส่อีเมลที่ต้องการให้ติดต่อกลับ
4. ตรวจสอบอีเมลผู้ดูแลระบบ

### ทดสอบการแก้ไขและยกเลิก:

1. เข้าสู่หน้า admin.html
2. ทดสอบแก้ไขการจอง - จะส่งอีเมลแจ้งการอัพเดท
3. ทดสอบลบการจอง - จะส่งอีเมลแจ้งการยกเลิก

## การแก้ปัญหา

### อีเมลไม่ถูกส่ง

1. ตรวจสอบ Console ในเบราว์เซอร์ (กด F12) เพื่อดูข้อความ error
2. ตรวจสอบว่า Public Key, Service ID, และ Template ID ถูกต้อง
3. ตรวจสอบว่าบัญชีอีเมลเชื่อมต่อกับ EmailJS ถูกต้อง
4. ตรวจสอบโควต้าของ EmailJS (บัญชีฟรีมีขั้นต่ำ 200 อีเมล/เดือน)

### อีเมลเข้า Spam

1. เพิ่มอีเมลที่ส่งจาก EmailJS เข้า whitelist
2. ตรวจสอบ spam folder
3. พิจารณาใช้ custom domain email service สำหรับความน่าเชื่อถือมากขึ้น

### Template ไม่แสดงผลถูกต้อง

1. ตรวจสอบว่า variable names ใน template ตรงกับที่ส่งไปจาก code
2. ทดสอบ template ใน EmailJS dashboard ก่อน

## ข้อมูลเพิ่มเติม

- เอกสาร EmailJS: https://www.emailjs.com/docs/
- คำถามที่พบบ่อย: https://www.emailjs.com/docs/faq/
- โควต้าและราคา: https://www.emailjs.com/pricing/

## สรุป

หลังจากทำตามขั้นตอนทั้งหมดแล้ว ระบบจองนัดหมาย DN Center จะสามารถ:

✅ ส่งอีเมลยืนยันการจองให้ลูกค้าอัตโนมัติ
✅ แจ้งเตือนผู้ดูแลระบบเมื่อมีการจองใหม่
✅ ส่งอีเมลแจ้งการแก้ไขการจอง
✅ ส่งอีเมลแจ้งการยกเลิกการจอง
✅ รองรับการรีเซ็ตรหัสผ่านผ่านอีเมล

หากมีปัญหาในการตั้งค่า กรุณาตรวจสอบ Console ในเบราว์เซอร์และดูข้อความ error ที่แสดง
