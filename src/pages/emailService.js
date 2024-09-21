// emailService.js
import emailjs from 'emailjs-com';

export async function sendEmail(toEmail, toName, fromName, message) {
  const serviceID = 'service_rs71h8n';
  const templateID = 'template_mvq7bdh';
  const userID = 'HnRtI-nQOt92ux3oK'; // This is your public key

  const templateParams = {
    to_email: toEmail,
    to_name: toName,
    from_name: fromName,
    message: message,
  };

  try {
    await emailjs.send(serviceID, templateID, templateParams, userID);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}