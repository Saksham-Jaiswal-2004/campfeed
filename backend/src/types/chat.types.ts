export interface ChatMessage {
  issueId: string;

  senderId: string;

  senderName: string;

  senderRole: string;

  content: string;

  createdAt?: number;
}