export type IssueStatus = "pending" | "in_progress" | "resolved" | "rejected";

export interface Issue {
  id: string;
  title: string;
  description: string;
  attachment_urls?: string[];
  thumbnail_url?: string;
  category_id: string;
  status: IssueStatus;
  upvotes: number;
  upvotedBy: string[];
  priority: string;
  is_anonymous: boolean;
  shareOnFeed: boolean;
  resolved_at: string;
  createdByUser?: {
    id?: string,
    name?: string;
    avatar?: string;
    email?: string;
  };
}