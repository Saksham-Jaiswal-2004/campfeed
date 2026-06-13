import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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
  try {
    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([600, 800]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

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

    const qrImageBytes = qrImageBase64.split(",")[1];
    const qrImage = await pdfDoc.embedPng(Buffer.from(qrImageBytes, "base64"));

    const qrDims = qrImage.scale(1.2);

    page.drawRectangle({
      x: 0,
      y: 0,
      width: 600,
      height: 800,
      color: rgb(0.98, 0.98, 0.98),
    });

    page.drawText("CAMPFEED EVENT TICKET", {
      x: 150,
      y: 740,
      size: 18,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText(eventName, {
      x: 50,
      y: 680,
      size: 22,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.8),
    });

    page.drawText(`Venue: ${venue}`, {
      x: 50,
      y: 640,
      size: 12,
      font,
    });

    page.drawText(`Date: ${date}`, {
      x: 50,
      y: 620,
      size: 12,
      font,
    });

    page.drawText(`Time: ${time}`, {
      x: 50,
      y: 600,
      size: 12,
      font,
    });

    page.drawText(`Name: ${studentName}`, {
      x: 50,
      y: 560,
      size: 12,
      font,
    });

    page.drawText(`Email: ${studentEmail}`, {
      x: 50,
      y: 540,
      size: 12,
      font,
    });

    page.drawText(`Ticket ID: ${ticketId}`, {
      x: 50,
      y: 500,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawImage(qrImage, {
      x: 400,
      y: 520,
      width: qrDims.width,
      height: qrDims.height,
    });

    page.drawText("Scan this QR at the entry gate", {
      x: 380,
      y: 500,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();

    console.log("QR Generated!")

    return pdfBytes;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error("Failed to generate ticket PDF");
  }
};
