export const registrationTemplate = (data) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Booking Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; color: #333;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; border: 1px solid #eeeeee;">
        <h2 style="color: #4CAF50; text-align: center;">Booking Confirmed!</h2>

        <p>Hello <strong>${data.name}</strong>,</p>

        <p>You have successfully booked your seat for the following event:</p>

        <div style="background: #f2f2f2; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Event:</strong> ${data.eventTitle}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${data.eventDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${data.eventTime}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${data.eventLocation}</p>
        </div>

        <p style="margin-top: 20px;">We are excited to see you there! Please make sure to arrive 10 minutes before the start time.</p>

        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #888888; text-align: center;">
            Regards,<br>
            <strong>Student Event Management System</strong>
        </p>
    </div>
</body>
</html>
`
}

