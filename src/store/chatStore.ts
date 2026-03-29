import { create } from 'zustand';
import type { ChatMessage } from '@/types/chat';

type ViewMode = 'chat' | 'note';

interface ChatStore {
  // 뷰 모드
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // 채팅 메시지
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;

  // 로딩
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // 편집 중인 메시지
  editingMessageId: string | null;
  setEditingMessageId: (id: string | null) => void;

  // SendChat 모달
  sendChatModalOpen: boolean;
  sendChatMessageId: string | null;
  openSendChatModal: (messageId: string) => void;
  closeSendChatModal: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // 뷰 모드
  viewMode: 'chat',
  setViewMode: (mode) => set({ viewMode: mode }),

  // 채팅 메시지
  messages: [],
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
  clearMessages: () => set({ messages: [] }),

  // 로딩
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // 편집
  editingMessageId: null,
  setEditingMessageId: (id) => set({ editingMessageId: id }),

  // SendChat 모달
  sendChatModalOpen: false,
  sendChatMessageId: null,
  openSendChatModal: (messageId) =>
    set({ sendChatModalOpen: true, sendChatMessageId: messageId }),
  closeSendChatModal: () =>
    set({ sendChatModalOpen: false, sendChatMessageId: null }),
}));
