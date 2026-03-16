export const cancellationTemplate = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial; background:#fee; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px; border-left:5px solid #f44336;">
        <h2 style="color:#d32f2f;">Event Cancelled</h2>
        <p>Hello {{name}},</p>
        <p>We are sorry to inform you that the following event has been cancelled or deleted:</p>
        <div style="background:#ffe6e6; padding:12px;">
            <p><strong>{{eventTitle}}</strong></p>
            <p>Date: {{eventDate}}</p>
        </div>
        <p>We apologize for any inconvenience caused.</p>
    </div>
</body>
</html>
`;