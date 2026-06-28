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
  const pdfDoc = await PDFDocument.create();

  const pageWidth = 420;
  const pageHeight = 720;

  const page = pdfDoc.addPage([pageWidth, pageHeight]);

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

  /*
   * ==========================
   * COLORS
   * ==========================
   */

  const background = rgb(0.95, 0.96, 0.98);

  const card = rgb(1, 1, 1);

  const primary = rgb(0.2, 0.27, 0.85);

  const dark = rgb(0.1, 0.1, 0.12);

  const gray = rgb(0.45, 0.47, 0.52);

  const lightGray = rgb(0.96, 0.97, 0.98);

  const border = rgb(0.9, 0.91, 0.93);

  const success = rgb(0.12, 0.65, 0.33);

  /*
   * ==========================
   * PAGE BACKGROUND
   * ==========================
   */

  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: background,
  });

  /*
   * ==========================
   * MAIN CARD
   * ==========================
   */

  page.drawRectangle({
    x: 20,
    y: 20,
    width: 380,
    height: 680,
    color: card,
    borderColor: border,
    borderWidth: 1,
  });

  /*
   * ==========================
   * HEADER
   * ==========================
   */

  page.drawRectangle({
    x: 20,
    y: 620,
    width: 380,
    height: 80,
    color: primary,
  });

  page.drawText("CAMPFEED", {
    x: 40,
    y: 665,
    size: 24,
    font: bold,
    color: rgb(1, 1, 1),
  });

  page.drawText("EVENT PASS", {
    x: 40,
    y: 642,
    size: 11,
    font,
    color: rgb(1, 1, 1),
  });

  /*
   * ==========================
   * CONFIRMED BADGE
   * ==========================
   */

  page.drawRectangle({
    x: 285,
    y: 648,
    width: 90,
    height: 26,
    color: success,
  });

  page.drawText("CONFIRMED", {
    x: 298,
    y: 656,
    size: 10,
    font: bold,
    color: rgb(1, 1, 1),
  });

  /*
   * ==========================
   * EVENT DETAILS
   * ==========================
   */

  const title =
    eventName.length > 32 ? `${eventName.substring(0, 32)}...` : eventName;

  page.drawText(title, {
    x: 40,
    y: 575,
    size: 22,
    font: bold,
    color: dark,
  });

  page.drawText(venue, {
    x: 40,
    y: 548,
    size: 12,
    font,
    color: gray,
  });

  page.drawText(`${date} | ${time}`, {
    x: 40,
    y: 528,
    size: 12,
    font,
    color: gray,
  });

  /*
   * ==========================
   * SEPARATOR
   * ==========================
   */

  page.drawLine({
    start: { x: 40, y: 505 },
    end: { x: 380, y: 505 },
    thickness: 1,
    color: border,
  });

  /*
   * ==========================
   * QR SECTION
   * ==========================
   */

  page.drawRectangle({
    x: 75,
    y: 245,
    width: 270,
    height: 240,
    color: lightGray,
    borderColor: border,
    borderWidth: 1,
  });

  const qrBytes = qrImageBase64.split(",")[1];

  const qrImage = await pdfDoc.embedPng(Buffer.from(qrBytes, "base64"));

  const qrSize = 200;

  page.drawImage(qrImage, {
    x: (pageWidth - qrSize) / 2,
    y: 280,
    width: qrSize,
    height: qrSize,
  });

  page.drawText("SCAN FOR ENTRY", {
    x: 165,
    y: 260,
    size: 10,
    font: bold,
    color: gray,
  });

  /*
   * ==========================
   * ATTENDEE SECTION
   * ==========================
   */

  page.drawRectangle({
    x: 40,
    y: 165,
    width: 340,
    height: 75,
    color: lightGray,
    borderColor: border,
    borderWidth: 1,
  });

  page.drawText("ATTENDEE", {
    x: 55,
    y: 215,
    size: 10,
    font: bold,
    color: gray,
  });

  page.drawText(studentName, {
    x: 55,
    y: 193,
    size: 13,
    font: bold,
    color: dark,
  });

  page.drawText(studentEmail, {
    x: 55,
    y: 173,
    size: 10,
    font,
    color: gray,
  });

  /*
   * ==========================
   * METADATA SECTION
   * ==========================
   */

  page.drawText("TICKET ID", {
    x: 40,
    y: 130,
    size: 9,
    font: bold,
    color: gray,
  });

  page.drawText(ticketId, {
    x: 130,
    y: 130,
    size: 10,
    font: bold,
    color: dark,
  });

  page.drawText("ENTRY TYPE", {
    x: 40,
    y: 108,
    size: 9,
    font: bold,
    color: gray,
  });

  page.drawText("General Admission", {
    x: 130,
    y: 108,
    size: 10,
    font,
    color: dark,
  });

  page.drawText("STATUS", {
    x: 40,
    y: 86,
    size: 9,
    font: bold,
    color: gray,
  });

  page.drawText("Confirmed", {
    x: 130,
    y: 86,
    size: 10,
    font: bold,
    color: success,
  });

  /*
   * ==========================
   * FOOTER SEPARATOR
   * ==========================
   */

  page.drawLine({
    start: { x: 40, y: 65 },
    end: { x: 380, y: 65 },
    thickness: 1,
    color: border,
  });

  /*
   * ==========================
   * FOOTER
   * ==========================
   */

  page.drawText("This ticket is unique and valid for one entry only.", {
    x: 110,
    y: 45,
    size: 9,
    font,
    color: gray,
  });

  page.drawText("Powered by CampFeed", {
    x: 150,
    y: 28,
    size: 9,
    font: bold,
    color: primary,
  });

  return await pdfDoc.save();
};
