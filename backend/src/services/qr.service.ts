import QRCode from "qrcode";

export const generateQRCode = async (token: string): Promise<string> => {
  try {
    const qrData = JSON.stringify({
      token,
      type: "CAMPFEED_EVENT_TICKET",
    });

    const qrImage = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
      margin: 2,
      scale: 6,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return qrImage;
  } catch (error) {
    console.error("QR Generation Error:", error);
    throw new Error("Failed to generate QR code");
  }
};

export const generateQRString = (token: string): string => {
  return JSON.stringify({
    token,
    type: "CAMPFEED_EVENT_TICKET",
  });
};