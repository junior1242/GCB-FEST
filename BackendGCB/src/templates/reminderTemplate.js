export const getReminderTemplate = (data) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hello, ${data.name}!</h2>
        <p>This is a friendly reminder that the event you registered for is happening <strong>today</strong>.</p>
        
        <div style="background: #f4f4f4; padding: 15px; border-left: 5px solid #007bff;">
            <p><strong>Event:</strong> ${data.eventTitle}</p>
            <p><strong>Date:</strong> ${data.eventDate}</p>
            <p><strong>Time:</strong> ${data.eventTime}</p>
            <p><strong>Location:</strong> ${data.eventLocation}</p>
        </div>

        <p>We look forward to seeing you there!</p>
        <p>Best Regards,<br><strong>Student Event Team</strong></p>
    </div>
    `;
};
