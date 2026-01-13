import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // app password
  },
});

export const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Revlive" <${process.env.MAIL_USER}>`,
    to,
    subject: "Reset password - OTP",
    html: `
      <h2>Reset Password</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>OTP expires in 5 minutes</p>
    `,
  });
};

// Gửi email thông báo cho staff khi có transaction mới
export const sendTransactionNotificationEmail = async (staffEmails, transactionData) => {
  const { username, email, plan, amount, originalAmount, transferContent, createdAt } = transactionData;
  const planName = plan === "creator" ? "Creator VIP 1" : "Brand VIP 2";
  const formattedAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
  const formattedOriginalAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(originalAmount);
  const formattedDate = new Date(createdAt).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">🔔 Thông báo: Có yêu cầu thanh toán mới</h2>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Thông tin người dùng:</h3>
        <p><strong>Tên tài khoản:</strong> ${username || email}</p>
        <p><strong>Email:</strong> ${email}</p>
        
        <h3>Thông tin gói dịch vụ:</h3>
        <p><strong>Gói đã chọn:</strong> ${planName}</p>
        <p><strong>Giá gốc:</strong> <span style="text-decoration: line-through; color: #6b7280;">${formattedOriginalAmount}</span></p>
        <p><strong>Số tiền cần thanh toán:</strong> <span style="color: #2563eb; font-weight: bold; font-size: 18px;">${formattedAmount}</span></p>
        
        <h3>Nội dung chuyển khoản:</h3>
        <p style="background-color: #fff; padding: 10px; border-left: 4px solid #2563eb; font-family: monospace;">
          ${transferContent}
        </p>
        
        <p><strong>Thời gian yêu cầu:</strong> ${formattedDate}</p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Vui lòng kiểm tra tài khoản ngân hàng và vào Admin Panel để duyệt đơn hàng.
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px;">
          Email này được gửi tự động từ hệ thống REVLIVE.
        </p>
      </div>
    </div>
  `;

  // Gửi email cho tất cả staff
  const emailPromises = staffEmails.map((staffEmail) =>
    transporter.sendMail({
      from: `"Revlive" <${process.env.MAIL_USER}>`,
      to: staffEmail,
      subject: `🔔 Yêu cầu thanh toán mới - ${planName} - ${username || email}`,
      html: emailContent,
    })
  );

  await Promise.all(emailPromises);
};

// Gửi email thông báo nâng cấp tài khoản thành công cho user
export const sendUpgradeSuccessEmail = async (userEmail, upgradeData) => {
  const {
    username,
    plan,
    amount,
    newMemberType,
    expiredAt,
    approvedAt,
  } = upgradeData;

  const planName = plan === "creator" ? "Creator VIP 1" : "Brand VIP 2";
  const formattedAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
  const formattedExpiredAt = new Date(expiredAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
  const formattedApprovedAt = new Date(approvedAt).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 2rem;">🎉 Chúc mừng!</h1>
        <p style="color: #ffffff; margin: 10px 0 0; font-size: 1.1rem;">Tài khoản của bạn đã được nâng cấp thành công</p>
      </div>
      
      <div style="padding: 30px 20px; background: #f9fafb;">
        <div style="background: #ffffff; padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 1.5rem;">Thông tin nâng cấp</h2>
          
          <div style="margin-bottom: 20px;">
            <p style="margin: 8px 0; color: #4b5563;"><strong style="color: #1f2937;">Tên tài khoản:</strong> ${username || userEmail}</p>
            <p style="margin: 8px 0; color: #4b5563;"><strong style="color: #1f2937;">Gói dịch vụ:</strong> <span style="color: #667eea; font-weight: bold;">${planName}</span></p>
            <p style="margin: 8px 0; color: #4b5563;"><strong style="color: #1f2937;">Số tiền đã thanh toán:</strong> <span style="color: #10b981; font-weight: bold; font-size: 1.1rem;">${formattedAmount}</span></p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">✨ Quyền lợi của bạn:</h3>
            <ul style="color: #4b5563; line-height: 1.8; margin: 0; padding-left: 20px;">
              ${plan === "creator" 
                ? `
                  <li>Tạo và quản lý CV chuyên nghiệp</li>
                  <li>Ứng tuyển vào các công việc phù hợp</li>
                  <li>Xem thông tin chi tiết Brand</li>
                  <li>Nhận thông báo việc làm mới</li>
                `
                : `
                  <li>Đăng tin tuyển dụng không giới hạn</li>
                  <li>Xem và quản lý CV ứng viên</li>
                  <li>Tìm kiếm Creator phù hợp</li>
                  <li>Quản lý thông tin Brand</li>
                `
              }
            </ul>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px;">
            <p style="margin: 0; color: #92400e;">
              <strong>📅 Ngày hết hạn:</strong> ${formattedExpiredAt}
            </p>
            <p style="margin: 8px 0 0; color: #92400e; font-size: 0.9rem;">
              💡 <strong>Lưu ý:</strong> Bạn có thể gia hạn trước khi hết hạn để được cộng dồn thời gian sử dụng.
            </p>
          </div>
        </div>
        
        <div style="background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">
            <strong>Thời gian duyệt:</strong> ${formattedApprovedAt}
          </p>
        </div>
      </div>
      
      <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="color: #9ca3af; margin: 0; font-size: 0.9rem;">
          Cảm ơn bạn đã sử dụng dịch vụ của REVLIVE!
        </p>
        <p style="color: #6b7280; margin: 10px 0 0; font-size: 0.85rem;">
          Email này được gửi tự động từ hệ thống REVLIVE.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"REVLIVE" <${process.env.MAIL_USER}>`,
    to: userEmail,
    subject: `🎉 Nâng cấp tài khoản thành công - ${planName}`,
    html: emailContent,
  });
};
