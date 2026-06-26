export interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  targetAudience: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  expiryDate: string;
  createdByUser?: {
    id?: string,
    name?: string;
    email?: string;
    role?: string;
    profileImage?: string;
  };
}
