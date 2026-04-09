export const updateEventTemplate = (data) => {
    return `
<!DOCTYPE html>
<html>
<body style="font-family:Arial; background:#f0f7ff; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px; border-left:5px solid #2196F3;">
        <h2 style="color:#1976d2;">Event Details Updated</h2>
        <p>Hello ${data.name},</p>
        <p>We are writing to inform you that the details for an event you are registered for have been updated by the administrator:</p>
        <div style="background:#e3f2fd; padding:12px; border-radius:5px;">
            <p><strong>Event:</strong> ${data.eventTitle}</p>
            <p><strong>Event Date:</strong> ${data.eventDate}</p>
        </div>
        <p>Please log in to the Student Portal to review the full details and any changes to the venue or time.</p>
        <p>Best regards,<br/>Student Portal</p>
    </div>
</body>
</html>
`;
};
