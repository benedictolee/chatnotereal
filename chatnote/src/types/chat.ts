export interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  editData?: string | null; // Fabric.js JSON
  isEditing: boolean;
  isSent: boolean; // Note에 전송되었는지
}

export interface ChatSession {
  messages: ChatMessage[];
  isLoading: boolean;
}
