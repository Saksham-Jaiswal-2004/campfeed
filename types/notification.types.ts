export type NotificationType =
  | "ISSUE_CREATED"
  | "ISSUE_UPDATED"
  | "COMMENT"
  | "NEW_ANNOUNCEMENT"
  | "NEW_EVENT"
  | "CLUB_UPDATE"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  senderId?: string;
  senderName?: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  entityId: string;
  createdAt: number;
}
