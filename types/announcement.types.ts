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
  createdBy?: {
    id?: string,
    name?: string;
    email?: string;
    role?: string;
    profileImage?: string;
  };
}
