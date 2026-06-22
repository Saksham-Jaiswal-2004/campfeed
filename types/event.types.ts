export interface Event {
  id: string;
  name: string;
  description: string;
  organiser: string;
  venue: string;
  contactInfo: string;
  targetAudience: string;
  tags: string[];
  capacity: number;
  registered: number;
  eventPosterURL: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  createdByUser?: {
    id?: string,
    name?: string;
    avatar?: string;
    email?: string;
  };
}
