/**
 * Email Service สำหรับ DN Booking System
 * ใช้ Firebase Functions แทน EmailJS
 */

// ฟังก์ชันส่งอีเมลแจ้งเตือน
async function sendBookingNotification(bookingData, action = 'created') {
    try {
        console.log('📧 Sending email notification...', { action, to: bookingData.email });

        // ตรวจสอบว่า Firebase ถูก initialize แล้วหรือยัง
        if (typeof firebase === 'undefined' || !firebase.apps || firebase.apps.length === 0) {
            console.error('❌ Firebase is not initialized yet');
            return {
                success: false,
                error: 'Firebase is not initialized'
            };
        }

        // เรียก Firebase Function
        const sendBookingEmailFunction = firebase.functions().httpsCallable('sendBookingEmail');

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

console.log('✅ Email service loaded');
