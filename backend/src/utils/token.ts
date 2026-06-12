import jwt from "jsonwebtoken";

export type TicketTokenPayload = {
  ticketId: string;
  eventId: string;
  userId: string;
  type: "EVENT_TICKET";
};

const getSecret = (): string => {
  const secret = process.env.TICKET_SECRET;

  if (!secret) {
    throw new Error("TICKET_SECRET is not defined in environment variables");
  }

  return secret;
};

export const generateTicketToken = (
  payload: Omit<TicketTokenPayload, "type">,
  expiresIn: string = "365d",
) => {
  const token = jwt.sign(
    {
      ...payload,
      type: "EVENT_TICKET",
    },
    getSecret(),
    {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
      issuer: "campfeed",
    },
  );

  return token;
};

export const verifyTicketToken = (token: string): TicketTokenPayload => {
  const secret = process.env.TICKET_SECRET;

  if (!secret) {
    throw new Error("TICKET_SECRET is not defined in environment variables");
  }

  try {
    const decoded = jwt.verify(token, secret) as TicketTokenPayload;

    if (decoded.type !== "EVENT_TICKET") {
      throw new Error("Invalid ticket type");
    }

    return decoded;
  } catch (error: any) {
    throw new Error(
      error?.name === "TokenExpiredError" ? "Ticket expired" : "Invalid ticket",
    );
  }
};
