import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("Gmail SMTP ready");
  }
});

export const sendTicketEmail = async (data: {
  to: string;
  studentName: string;
  eventName: string;
  pdfBuffer: Uint8Array;
}) => {
  try {
    const { to, studentName, eventName, pdfBuffer } = data;

    await transporter.sendMail({
      from: `"CampFeed" <${process.env.EMAIL_USER}>`,
      to,
      subject: `CampFeed | Your Ticket for ${eventName}`,
      html: generateEmailTemplate(studentName, eventName),
      attachments: [
        {
          filename: `${eventName}-ticket.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: "application/pdf",
        },
      ],
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Email Sending Error:", error);
    throw new Error("Failed to send ticket email");
  }
};

const generateEmailTemplate = (studentName: string, eventName: string) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color:#2563eb;">
        🎉 Your Event Ticket is Ready!
      </h2>

      <p>Hi <strong>${studentName}</strong>,</p>

      <p>
        You have successfully registered for:
      </p>

      <h3>${eventName}</h3>

      <p>
        Your event ticket PDF is attached to this email.
      </p>

      <div style="
        background:#f3f4f6;
        padding:15px;
        border-radius:8px;
        margin:20px 0;
      ">
        <strong>Important Instructions:</strong>
        <ul>
          <li>Do not share your QR code.</li>
          <li>Each ticket is valid for one entry only.</li>
          <li>Show this QR at the event entrance.</li>
        </ul>
      </div>

      <p>
        See you at the event 🚀
      </p>

      <p>
        <strong>CampFeed Team</strong>
      </p>
    </div>
  `;
};
