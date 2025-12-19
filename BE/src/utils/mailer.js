import nodemailer from "nodemailer";

export const sendOTPEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, // app password
    },
  });

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
