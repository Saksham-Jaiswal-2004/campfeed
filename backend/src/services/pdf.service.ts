// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// export const generateTicketPDF = async (data: {
//   eventName: string;
//   venue: string;
//   date: string;
//   time: string;
//   studentName: string;
//   studentEmail: string;
//   ticketId: string;
//   qrImageBase64: string;
// }) => {
//   try {
//     const pdfDoc = await PDFDocument.create();

//     const page = pdfDoc.addPage([600, 800]);

//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     const {
//       eventName,
//       venue,
//       date,
//       time,
//       studentName,
//       studentEmail,
//       ticketId,
//       qrImageBase64,
//     } = data;

//     const qrImageBytes = qrImageBase64.split(",")[1];
//     const qrImage = await pdfDoc.embedPng(Buffer.from(qrImageBytes, "base64"));

//     const qrDims = qrImage.scale(1.2);

//     page.drawRectangle({
//       x: 0,
//       y: 0,
//       width: 600,
//       height: 800,
//       color: rgb(0.98, 0.98, 0.98),
//     });

//     page.drawText("CAMPFEED EVENT TICKET", {
//       x: 150,
//       y: 740,
//       size: 18,
//       font: boldFont,
//       color: rgb(0.1, 0.1, 0.1),
//     });

//     page.drawText(eventName, {
//       x: 50,
//       y: 680,
//       size: 22,
//       font: boldFont,
//       color: rgb(0.2, 0.2, 0.8),
//     });

//     page.drawText(`Venue: ${venue}`, {
//       x: 50,
//       y: 640,
//       size: 12,
//       font,
//     });

//     page.drawText(`Date: ${date}`, {
//       x: 50,
//       y: 620,
//       size: 12,
//       font,
//     });

//     page.drawText(`Time: ${time}`, {
//       x: 50,
//       y: 600,
//       size: 12,
//       font,
//     });

//     page.drawText(`Name: ${studentName}`, {
//       x: 50,
//       y: 560,
//       size: 12,
//       font,
//     });

//     page.drawText(`Email: ${studentEmail}`, {
//       x: 50,
//       y: 540,
//       size: 12,
//       font,
//     });

//     page.drawText(`Ticket ID: ${ticketId}`, {
//       x: 50,
//       y: 500,
//       size: 10,
//       font,
//       color: rgb(0.4, 0.4, 0.4),
//     });

//     const qrSize = 150;
//     page.drawImage(qrImage, {
//       x: 400,
//       y: 520,
//       width: qrSize,
//       height: qrSize,
//     });

//     page.drawText("Scan this QR at the entry gate", {
//       x: 380,
//       y: 500,
//       size: 10,
//       font,
//       color: rgb(0.5, 0.5, 0.5),
//     });

//     const pdfBytes = await pdfDoc.save();

//     console.log("QR Generated!")

//     return pdfBytes;
//   } catch (error) {
//     console.error("PDF Generation Error:", error);
//     throw new Error("Failed to generate ticket PDF");
//   }
// };


import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * CampFeed Eventbrite-style ticket (PORTRAIT)
 */
export const generateTicketPDF = async (data: {
  eventName: string;
  venue: string;
  date: string;
  time: string;

  studentName: string;
  studentEmail: string;

  ticketId: string;
  qrImageBase64: string;
}) => {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([420, 720]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const {
    eventName,
    venue,
    date,
    time,
    studentName,
    studentEmail,
    ticketId,
    qrImageBase64,
  } = data;

  // =========================
  // COLORS (Eventbrite style)
  // =========================
  const primary = rgb(0.2, 0.2, 0.8);
  const dark = rgb(0.1, 0.1, 0.1);
  const lightGray = rgb(0.95, 0.95, 0.95);
  const gray = rgb(0.5, 0.5, 0.5);

  // =========================
  // BACKGROUND
  // =========================
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 420,
    height: 720,
    color: rgb(1, 1, 1),
  });

  // =========================
  // CAMPFEED HEADER BAR
  // =========================
  page.drawRectangle({
    x: 0,
    y: 680,
    width: 420,
    height: 40,
    color: primary,
  });

  page.drawText("CAMPFEED", {
    x: 20,
    y: 695,
    size: 16,
    font: bold,
    color: rgb(1, 1, 1),
  });

  page.drawText("EVENT TICKET", {
    x: 280,
    y: 695,
    size: 10,
    font,
    color: rgb(1, 1, 1),
  });
  
  let yCursor = 670;

  // =========================
  // EVENT INFO SECTION
  // =========================
  page.drawText(eventName, {
    x: 20,
    y: yCursor,
    size: 18,
    font: bold,
    color: dark,
  });

  page.drawText(`${venue}`, {
    x: 20,
    y: yCursor - 20,
    size: 11,
    font,
    color: gray,
  });

  page.drawText(`${date} • ${time}`, {
    x: 20,
    y: yCursor - 40,
    size: 11,
    font,
    color: gray,
  });

  // =========================
  // PERFORATED LINE EFFECT
  // =========================
  const perforationY = yCursor - 70;

  for (let i = 0; i < 30; i++) {
    page.drawCircle({
      x: 20 + i * 13,
      y: perforationY,
      size: 1,
      color: rgb(0.85, 0.85, 0.85),
    });
  }

  // =========================
  // ATTENDEE DETAILS
  // =========================
  page.drawText("ATTENDEE", {
    x: 20,
    y: perforationY - 30,
    size: 10,
    font: bold,
    color: gray,
  });

  page.drawText(studentName, {
    x: 20,
    y: perforationY - 50,
    size: 13,
    font: bold,
    color: dark,
  });

  page.drawText(studentEmail, {
    x: 20,
    y: perforationY - 70,
    size: 10,
    font,
    color: gray,
  });

  // =========================
  // TICKET ID
  // =========================
  page.drawText(`Ticket ID: ${ticketId}`, {
    x: 20,
    y: perforationY - 95,
    size: 9,
    font,
    color: gray,
  });

  // =========================
  // QR CODE SECTION (RIGHT SIDE)
  // =========================
  const qrBytes = qrImageBase64.split(",")[1];
  const qrImage = await pdfDoc.embedPng(
    Buffer.from(qrBytes, "base64")
  );

  const qrSize = 150;

  page.drawImage(qrImage, {
    x: 240,
    y: perforationY - 160,
    width: qrSize,
    height: qrSize,
  });

  page.drawText("SCAN FOR ENTRY", {
    x: 260,
    y: perforationY - 180,
    size: 8,
    font: bold,
    color: gray,
  });

  // =========================
  // PERFORATED SIDE STRIP (Eventbrite feel)
  // =========================
  for (let i = 0; i < 25; i++) {
    page.drawCircle({
      x: 230,
      y: 120 + i * 10,
      size: 1,
      color: rgb(0.9, 0.9, 0.9),
    });
  }

  // =========================
  // FOOTER
  // =========================
  page.drawText("Present this ticket at entry • Single use only", {
    x: 20,
    y: 40,
    size: 9,
    font,
    color: gray,
  });

  page.drawText("Powered by CampFeed", {
    x: 20,
    y: 25,
    size: 9,
    font,
    color: gray,
  });

  return await pdfDoc.save();
};