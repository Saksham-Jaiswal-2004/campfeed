export interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  targetAudience: string;
  tags: string[];
  createdAt: string;
  expiryDate: string;
  createdByUser?: {
    id?: string,
    name?: string;
    email?: string;
    profileImage?: string;
  };
}
