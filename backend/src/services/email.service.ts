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
    <div
      style="
        margin: 0;
        padding: 40px 20px;
        background-color: #f4f6f9;
        font-family: Arial, Helvetica, sans-serif;
        color: #1f2937;
      "
    >
      <div
        style="
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
        "
      >
        <!-- Header -->
        <div
          style="
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            padding: 40px 30px;
            text-align: center;
          "
        >
          <h1
            style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700"
          >
            CAMPFEED
          </h1>
          <p
            style="
              margin: 10px 0 0;
              color: rgba(255, 255, 255, 0.9);
              font-size: 14px;
              letter-spacing: 1px;
            "
          >
            EVENT REGISTRATION CONFIRMED
          </p>
        </div>
        <!-- Body -->
        <div style="padding: 40px 30px; text-align: center">
          <div style="font-size: 48px; margin-bottom: 20px">🎉</div>
          <h2 style="margin: 0 0 16px; color: #111827; font-size: 28px">
            Your Ticket is Ready!
          </h2>
          <p
            style="
              margin: 0 0 24px;
              font-size: 16px;
              text-align: left;
              color: #4b5563;
              line-height: 1.7;
            "
          >
            Hi <strong>${studentName}</strong>, <br /><br />
            Thank you for registering through CampFeed. Your spot has been
            successfully confirmed for the event below.
          </p>
          <!-- Event Card -->
          <div
            style="
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 24px;
              margin: 30px 0;
              text-align: left;
            "
          >
            <p
              style="
                margin: 0;
                color: #6b7280;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 1px;
                text-transform: uppercase;
              "
            >
              Event
            </p>
            <h3 style="margin: 8px 0 0; color: #111827; font-size: 24px">
              ${eventName}
            </h3>
          </div>
          <!-- Attachment Notice -->
          <div
            style="
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              border-radius: 12px;
              padding: 20px;
              margin: 30px 0;
            "
          >
            <p
              style="
                margin: 0;
                color: #1e40af;
                font-size: 15px;
                line-height: 1.7;
              "
            >
              🎟️ Your official event ticket PDF is attached to this email.
              Please download it and keep it accessible on the day of the event.
            </p>
          </div>
          <!-- Instructions -->
          <div
            style="
              text-align: left;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 24px;
              margin: 30px 0;
            "
          >
            <h4 style="margin: 0 0 16px; color: #111827; font-size: 16px">
              Important Instructions
            </h4>
            <ul
              style="
                margin: 0;
                padding-left: 20px;
                color: #4b5563;
                line-height: 2;
                font-size: 15px;
              "
            >
              <li>Do not share your ticket or QR code with others.</li>
              <li>Each ticket is valid for a single entry only.</li>
              <li>
                Present the QR code from your ticket at the event entrance.
              </li>
              <li>
                Please arrive a few minutes early to ensure a smooth check-in
                process.
              </li>
            </ul>
          </div>
          <p
            style="
              margin: 40px 0 0;
              color: #4b5563;
              line-height: 1.8;
              font-size: 15px;
            "
          >
            We're excited to have you join us and hope you have an amazing
            experience. <br /><br />
            See you at the event 🚀
          </p>
        </div>
        <!-- Footer -->
        <div
          style="
            border-top: 1px solid #e5e7eb;
            padding: 24px;
            text-align: center;
            background: #fafafa;
          "
        >
          <p style="margin: 0; color: #6b7280; font-size: 13px">
            This is an automated email from CampFeed.
          </p>
          <p
            style="
              margin: 10px 0 0;
              color: #111827;
              font-size: 14px;
              font-weight: 600;
            "
          >
            © ${new Date().getFullYear()} CampFeed. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
};
