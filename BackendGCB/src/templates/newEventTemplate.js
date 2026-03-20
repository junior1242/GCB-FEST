export const getNewEventTemplate = (data) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
        <h1>New Event Published!</h1>
      </div>
      <div style="padding: 20px; line-height: 1.6; color: #333;">
        <p>Hello Student,</p>
        <p>A exciting new event has just been posted on the <strong>Student Event Management Portal</strong>. Don't miss out!</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 5px solid #007bff; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #007bff;">${data.title}</h2>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Location:</strong> ${data.location}</p>
        </div>

        <p>Log in to your dashboard to view more details and reserve your seat before they're gone!</p>
      
        <p>Best Regards,<br><strong>Admin Team</strong></p>
      </div>
    </div>
  `;
};
