import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // You can use 'gmail' or 'SendGrid' etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your Gmail App Password
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `"Student Portal" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // We use 'html' instead of 'text' for the link to work
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};
