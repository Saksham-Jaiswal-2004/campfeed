export interface Event {
  id: string;
  name: string;
  description: string;
  organiser: string;
  venue: string;
  contactInfo: string;
  targetAudience: string;
  tags: string[];

  createdBy: string;

  capacity: number;
  registered: number;

  eventPosterURL: string | null;

  startDate: string;
  endDate: string;
  createdAt: string;

  createdByUser?: {
    name?: string;
    avatar?: string;
    email?: string;
  };
}
