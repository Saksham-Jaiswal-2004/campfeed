import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTicketEmail = async (data: {
  to: string;
  studentName: string;
  eventName: string;
  pdfBuffer: Uint8Array;
}) => {
  try {
    const { to, studentName, eventName, pdfBuffer } = data;

    const emailResponse = await resend.emails.send({
      from: process.env.EMAIL_FROM || "CampFeed <onboarding@resend.dev>",
      to,
      subject: `CampFeed | Your Ticket for ${eventName}`,
      html: generateEmailTemplate(studentName, eventName),
      attachments: [
        {
          filename: `${eventName}-ticket.pdf`,
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    return emailResponse;
  } catch (error) {
    console.error("Email Sending Error:", error);
    throw new Error("Failed to send ticket email");
  }
};

const generateEmailTemplate = (studentName: string, eventName: string) => {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    
    <h2 style="color: #4f46e5;">🎉 Your Event Ticket is Ready!</h2>

    <p>Hi <b>${studentName}</b>,</p>

    <p>
      You have successfully registered for:
    </p>

    <h3 style="color: #111;">${eventName}</h3>

    <p>
      Your official event ticket is attached to this email.
      Please download and bring it (digital or printed) to the event entry.
    </p>

    <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
      <p style="margin: 0;">
        ⚠️ Important Instructions:
      </p>
      <ul>
        <li>Do not share your ticket QR code</li>
        <li>Each ticket is unique and can be used only once</li>
        <li>Show QR at entry for verification</li>
      </ul>
    </div>

    <p style="margin-top: 20px;">
      See you at the event!<br/>
      <b>Team CampFeed</b>
    </p>

  </div>
  `;
};
