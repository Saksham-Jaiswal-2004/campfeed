export interface ChatMessage {
  id: string;
  issueId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  createdAt: number;
}