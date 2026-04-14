// utils/emailTemplates.js
export const PasswordResetTemplate = (resetUrl) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
    .header { background: #1e293b; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px; line-height: 1.6; }
    .button { display: inline-block; padding: 14px 28px; background-color: #3b82f6; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 25px 0; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Student Event System</h1></div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
      <p>To set a new password, click the button below:</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset My Password</a>
      </div>
      <p>This link will expire in 1 hour for security reasons.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Student Event Management System</p>
    </div>
  </div>
</body>
</html>
`;
