/**
 * ฟังก์ชันส่งอีเมลแจ้งเตือนเวอร์ชันปรับปรุง
 * สำหรับโปรเจค DN Booking System
 * 
 * Features:
 * - ส่งอีเมลพร้อมกัน (Parallel) ด้วย Promise.allSettled()
 * - Error Handling ที่ดีขึ้น
 * - Return status ของการส่งอีเมลแต่ละฉบับ
 * - ตรวจสอบว่า EmailJS โหลดแล้วหรือยัง
 */

async function sendBookingNotification(bookingData, action = 'created') {
    // ตรวจสอบว่า EmailJS โหลดแล้ว
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS is not loaded');
        return { 
            success: false, 
            error: 'EmailJS library not available' 
        };
    }

    // Configuration
    const SERVICE_ID = 'service_gmail_booking';
    const BOOKING_TEMPLATE_ID = 'template_4rmry0m';
    const ADMIN_EMAIL = 'pur.admin@drugnetcenter.com';

    // Action text mapping
    const actionText = {
        'created': 'สร้างการจองใหม่',
        'updated': 'แก้ไขการจอง',
        'cancelled': 'ยกเลิกการจอง'
    };

    // Format date for email display
    function formatEmailDate(dateStr) {
        try {
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('th-TH', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return dateStr;
        }
    }

    // Prepare email template parameters
    const templateParams = {
        action: actionText[action] || 'สร้างการจองใหม่',
        booking_date: formatEmailDate(bookingData.date),
        booking_time: bookingData.time,
        company_name: bookingData.companyName,
        visitor_name: bookingData.visitorName,
        phone: bookingData.phone,
        email: bookingData.email,
        product: bookingData.recommendedProduct || '-',
        notes: bookingData.notes || '-',
        customer_email: bookingData.email,
        admin_email: ADMIN_EMAIL
    };

    try {
        // Send emails in parallel using Promise.allSettled
        const results = await Promise.allSettled([
            // Email to customer
            emailjs.send(SERVICE_ID, BOOKING_TEMPLATE_ID, {
                ...templateParams,
                to_email: bookingData.email,
                to_name: bookingData.visitorName
            }),
            // Email to admin
            emailjs.send(SERVICE_ID, BOOKING_TEMPLATE_ID, {
                ...templateParams,
                to_email: ADMIN_EMAIL,
                to_name: 'ผู้ดูแลระบบ DN Center'
            })
        ]);

        // Check results
        const customerEmailSuccess = results[0].status === 'fulfilled';
        const adminEmailSuccess = results[1].status === 'fulfilled';

        // Log results
        if (customerEmailSuccess) {
            console.log('✅ Email sent to customer successfully');
        } else {
            console.error('❌ Failed to send email to customer:', results[0].reason);
        }

        if (adminEmailSuccess) {
            console.log('✅ Email sent to admin successfully');
        } else {
            console.error('❌ Failed to send email to admin:', results[1].reason);
        }

        // Return detailed status
        return {
            success: customerEmailSuccess || adminEmailSuccess,
            customerEmail: customerEmailSuccess,
            adminEmail: adminEmailSuccess,
            errors: {
                customer: customerEmailSuccess ? null : results[0].reason,
                admin: adminEmailSuccess ? null : results[1].reason
            }
        };

    } catch (error) {
        console.error('❌ Email notification error:', error);
        return {
            success: false,
            customerEmail: false,
            adminEmail: false,
            error: error.message
        };
    }
}

/**
 * ฟังก์ชันแสดง Notification
 * 
 * @param {string} message - ข้อความที่จะแสดง
 * @param {string} type - ประเภท: 'success', 'warning', 'error'
 * @param {number} duration - ระยะเวลาแสดง (milliseconds)
 */
function showNotification(message, type = 'success', duration = 5000) {
    // สร้าง notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icon mapping
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * ตัวอย่างการใช้งานในฟอร์มจอง (index.html)
 */
document.getElementById('appointment-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('book-btn');
    
    // แสดง Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // รวบรวมข้อมูลจากฟอร์ม
        const bookingData = {
            date: formatDateKey(state.selectedDate),
            time: state.selectedTimeSlot,
            companyName: document.getElementById('company-name').value,
            visitorName: document.getElementById('visitor-name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            recommendedProduct: document.getElementById('recommended-product').value,
            notes: document.getElementById('notes').value,
            createdAt: new Date()
        };
        
        // บันทึกลง Firebase
        const docRef = await db.collection('bookings').add(bookingData);
        console.log('✅ Booking saved with ID:', docRef.id);
        
        // ส่งอีเมลแจ้งเตือน
        const emailResult = await sendBookingNotification(bookingData, 'created');
        
        // แสดงผลตามสถานะการส่งอีเมล
        if (emailResult.success) {
            if (emailResult.customerEmail && emailResult.adminEmail) {
                showNotification('✅ จองสำเร็จและส่งอีเมลยืนยันแล้ว', 'success');
            } else if (emailResult.customerEmail) {
                showNotification('✅ จองสำเร็จ (ส่งอีเมลถึงคุณแล้ว แต่ไม่สามารถแจ้งผู้ดูแลได้)', 'warning');
            } else if (emailResult.adminEmail) {
                showNotification('✅ จองสำเร็จ (แจ้งผู้ดูแลแล้ว แต่ไม่สามารถส่งอีเมลยืนยันถึงคุณได้)', 'warning');
            } else {
                showNotification('✅ จองสำเร็จ แต่ไม่สามารถส่งอีเมลยืนยันได้ กรุณาติดต่อผู้ดูแลระบบ', 'warning');
            }
        } else {
            showNotification('✅ จองสำเร็จ แต่ไม่สามารถส่งอีเมลยืนยันได้', 'warning');
        }
        
        // แสดงหน้ายืนยัน
        document.getElementById('booking-content').style.display = 'none';
        document.getElementById('confirmation').style.display = 'block';
        
        // อัพเดทข้อมูลในหน้ายืนยัน
        document.getElementById('confirm-company').textContent = bookingData.companyName;
        document.getElementById('confirm-visitor').textContent = bookingData.visitorName;
        document.getElementById('confirm-date').textContent = formatEmailDate(bookingData.date);
        document.getElementById('confirm-time').textContent = bookingData.time;
        document.getElementById('confirm-phone').textContent = bookingData.phone;
        document.getElementById('confirm-email').textContent = bookingData.email;
        
    } catch (error) {
        console.error('❌ Booking error:', error);
        showNotification('❌ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
        // ปิด Loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

/**
 * ตัวอย่างการใช้งานในหน้า Admin (admin.html)
 * สำหรับการแก้ไขการจอง
 */
async function updateBooking(bookingId, updatedData) {
    try {
        // อัพเดทข้อมูลใน Firebase
        await db.collection('bookings').doc(bookingId).update(updatedData);
        console.log('✅ Booking updated successfully');
        
        // ส่งอีเมลแจ้งเตือนการแก้ไข
        const emailResult = await sendBookingNotification(updatedData, 'updated');
        
        // แสดงผลตามสถานะ
        if (emailResult.success) {
            showNotification('✅ แก้ไขการจองและส่งอีเมลแจ้งเตือนเรียบร้อย', 'success');
        } else {
            showNotification('✅ แก้ไขการจองสำเร็จ แต่ไม่สามารถส่งอีเมลแจ้งเตือนได้', 'warning');
        }
        
        // ปิด Modal และโหลดข้อมูลใหม่
        closeEditModal();
        loadBookings();
        
    } catch (error) {
        console.error('❌ Update error:', error);
        showNotification('❌ ไม่สามารถแก้ไขการจองได้', 'error');
    }
}

/**
 * ตัวอย่างการใช้งานในหน้า Admin (admin.html)
 * สำหรับการยกเลิกการจอง
 */
async function deleteBooking(bookingId, bookingData) {
    // ยืนยันก่อนลบ
    if (!confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกการจองนี้?')) {
        return;
    }
    
    try {
        // ลบจาก Firebase
        await db.collection('bookings').doc(bookingId).delete();
        console.log('✅ Booking deleted successfully');
        
        // ส่งอีเมลแจ้งเตือนการยกเลิก
        const emailResult = await sendBookingNotification(bookingData, 'cancelled');
        
        // แสดงผลตามสถานะ
        if (emailResult.success) {
            showNotification('✅ ยกเลิกการจองและส่งอีเมลแจ้งเตือนเรียบร้อย', 'success');
        } else {
            showNotification('✅ ยกเลิกการจองสำเร็จ แต่ไม่สามารถส่งอีเมลแจ้งเตือนได้', 'warning');
        }
        
        // โหลดข้อมูลใหม่
        loadBookings();
        
    } catch (error) {
        console.error('❌ Delete error:', error);
        showNotification('❌ ไม่สามารถยกเลิกการจองได้', 'error');
    }
}

/**
 * Helper function: Format date to YYYY-MM-DD
 */
function formatDateKey(date) {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * ฟังก์ชันทดสอบการส่งอีเมล
 * เปิด Console (F12) แล้ววาง code นี้เพื่อทดสอบ
 */
function testEmailNotification() {
    const testBooking = {
        date: '2024-12-15',
        time: '10:00',
        companyName: 'บริษัททดสอบ จำกัด',
        visitorName: 'คุณทดสอบ',
        phone: '081-234-5678',
        email: 'your-test-email@gmail.com', // ⚠️ เปลี่ยนเป็นอีเมลจริงของคุณ
        recommendedProduct: 'สินค้าทดสอบ',
        notes: 'นี่คือการทดสอบระบบอีเมล'
    };
    
    console.log('📧 Testing email notification...');
    sendBookingNotification(testBooking, 'created')
        .then(result => {
            console.log('📊 Test Result:', result);
            if (result.success) {
                console.log('✅ Test passed!');
            } else {
                console.log('❌ Test failed!');
            }
        });
}
