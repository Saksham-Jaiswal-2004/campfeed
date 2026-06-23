export interface Ticket {
  id?: string;
  ticketId: string;
  eventId: string;
  userId: string;
  token: string;
  used: boolean;
  createdAt: string;
  event?: {
    id: string;
    name: string;
    venue: string;
    startDate: string;
  };
  attendee?: {
    id: string;
    name: string;
    email: string;
  };
  qrURL: string;
  pdfURL: string;
}