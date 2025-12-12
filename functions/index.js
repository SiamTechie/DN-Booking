/**
 * Firebase Functions สำหรับส่งอีเมลแจ้งเตือน
 * DN Booking System
 * Version: 1st Gen (ใช้งานง่ายกว่า ไม่ต้อง Cloud Build)
 */

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

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
        console.log('📧 Received request');
        console.log('Action:', data?.action);
        console.log('Has bookingData:', !!data?.bookingData);

        const bookingData = data?.bookingData;
        const action = data?.action || 'created'; // Default to 'created' if undefined

        // Validation
        if (!bookingData) {
            console.error('❌ bookingData is undefined');
            throw new functions.https.HttpsError('invalid-argument', 'bookingData is required');
        }

        if (!bookingData.email || !bookingData.visitorName) {
            console.error('❌ Missing required fields:', bookingData);
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }

        console.log('✅ Validation passed. Creating transporter...');

        // สร้าง transporter (ใช้รหัสผ่านโดยตรงเพื่อทดสอบ)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'pur.admin@drugnetcenter.com',
                pass: 'bfdm nzqf ohkg smkw'
            }
        });

        const actionText = {
            'created': 'ยืนยันการจองนัดหมาย',
            'updated': 'แจ้งเตือนการแก้ไขการจอง',
            'cancelled': 'แจ้งเตือนการยกเลิกการจอง'
        };

        const subject = `[DN Center] ${actionText[action]} - ${bookingData.visitorName}`;
        const html = createEmailHTML(bookingData, action);

        console.log('📤 Sending email to customer:', bookingData.email);

        // ส่งอีเมลถึงลูกค้า
        let customerEmail;
        try {
            customerEmail = await transporter.sendMail({
                from: '"DN Center Booking" <no-reply@drugnetcenter.com>',
                to: bookingData.email,
                subject: subject,
                html: html
            });
            console.log('✅ Customer email sent:', customerEmail.messageId);
        } catch (emailError) {
            console.error('❌ Failed to send customer email:', emailError);
            throw emailError;
        }

        console.log('📤 Sending email to admin group...');

        // ส่งอีเมลถึง Group (Admin + Sriprai)
        const adminEmail = await transporter.sendMail({
            from: '"DN Center Booking" <no-reply@drugnetcenter.com>',
            to: 'no-reply@drugnetcenter.com',
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
            to: data?.bookingData?.email || 'unknown',
            action: data?.action || 'created',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'failed',
            error: error.message
        });

        throw new functions.https.HttpsError('internal', error.message);
    }
});
