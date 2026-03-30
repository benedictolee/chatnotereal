'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ChatInput from '@/components/layout/ChatInput';
import SubjectList from '@/components/note/SubjectList';
import SavedChatCard from '@/components/note/SavedChatCard';
import SendChatModal from '@/components/note/SendChatModal';
import BookmarkPanel from '@/components/chat/BookmarkPanel';
import { useChatStore } from '@/store/chatStore';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { generateId } from '@/lib/utils/helpers';
import {
  Sparkles,
  Edit3,
  SendHorizontal,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
} from 'lucide-react';
import type { ChatMessage } from '@/types/chat';

export default function Home() {
  const { user } = useAuth();
  const {
    viewMode,
    messages,
    addMessage,
    updateMessage,
    isLoading,
    setLoading,
    openSendChatModal,
    closeSendChatModal,
    sendChatModalOpen,
    sendChatMessageId,
  } = useChatStore();

  const {
    folders,
    loading: notesLoading,
    selectedChats,
    selectedPath,
    handleAddFolder,
    handleDeleteFolder,
    handleAddSubfolder,
    handleDeleteSubfolder,
    handleSelectSubfolder,
    handleSendToNote,
    handleDeleteChat,
    goBack,
  } = useNotes();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (question: string) => {
    const msgId = generateId();
    const newMessage: ChatMessage = {
      id: msgId,
      question,
      answer: '',
      editData: null,
      isEditing: false,
      isSent: false,
    };
    addMessage(newMessage);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      if (data.error) {
        updateMessage(msgId, { answer: `⚠️ ${data.error}` });
      } else {
        updateMessage(msgId, { answer: data.answer });
      }
    } catch {
      updateMessage(msgId, { answer: '⚠️ 네트워크 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bookmarkedMessages = messages.filter((m) => bookmarkedIds.has(m.id));

  const handleSendChat = async (folderId: string, subfolderId: string) => {
    const msg = messages.find((m) => m.id === sendChatMessageId);
    if (!msg) return;
    await handleSendToNote(folderId, subfolderId, msg.question, msg.answer, msg.editData || undefined);
    updateMessage(msg.id, { isSent: true });
  };

  // ========== Chat 뷰 ==========
  if (viewMode === 'chat') {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <BookmarkPanel bookmarkedMessages={bookmarkedMessages} onRemoveBookmark={toggleBookmark} />

        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-10 h-10 rounded-full bg-[#4a9eff]/10 flex items-center justify-center mb-4">
                  <Sparkles size={20} className="text-[#4a9eff]" />
                </div>
                <h2 className="font-logo text-2xl mb-2">ChatNote</h2>
                <p className="text-[#666] text-sm">질문하고, 편집하고, 노트에 저장하세요.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className="animate-fadeIn">
                <div className="flex justify-end mb-3">
                  <div className="bg-[#1e1e1e] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.question}</p>
                  </div>
                </div>

                <div className="flex justify-start mb-2">
                  <div className="flex gap-2 max-w-[90%]">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4a9eff]/20 flex items-center justify-center mt-1">
                      <Sparkles size={12} className="text-[#4a9eff]" />
                    </div>
                    <div className="markdown-content text-sm leading-relaxed">
                      {msg.answer ? (
                        <p className="whitespace-pre-wrap">{msg.answer}</p>
                      ) : (
                        <div className="flex gap-1 py-2">
                          <span className="w-2 h-2 bg-[#4a9eff] rounded-full animate-pulse-subtle" />
                          <span className="w-2 h-2 bg-[#4a9eff] rounded-full animate-pulse-subtle [animation-delay:0.3s]" />
                          <span className="w-2 h-2 bg-[#4a9eff] rounded-full animate-pulse-subtle [animation-delay:0.6s]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {msg.answer && (
                  <div className="flex gap-3 ml-8 mt-1">
                    <button className="flex items-center gap-1 text-xs text-[#666] hover:text-[#4a9eff] transition-colors">
                      <Edit3 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (!user) { alert('로그인이 필요합니다.'); return; }
                        openSendChatModal(msg.id);
                      }}
                      className={`flex items-center gap-1 text-xs transition-colors ${msg.isSent ? 'text-[#34d399]' : 'text-[#666] hover:text-[#34d399]'}`}
                    >
                      <SendHorizontal size={12} />
                      {msg.isSent ? 'Sent!' : 'Send chat'}
                    </button>
                    <button
                      onClick={() => toggleBookmark(msg.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${bookmarkedIds.has(msg.id) ? 'text-[#fbbf24]' : 'text-[#666] hover:text-[#fbbf24]'}`}
                    >
                      {bookmarkedIds.has(msg.id) ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <ChatInput onSend={handleSend} isLoading={isLoading} plan="free" />
        <SendChatModal
          isOpen={sendChatModalOpen}
          onClose={closeSendChatModal}
          folders={folders}
          onSend={handleSendChat}
          onCreateFolder={handleAddFolder}
          onCreateSubfolder={handleAddSubfolder}
        />
      </div>
    );
  }

  // ========== Note 뷰 ==========
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {!user ? (
            <p className="text-[#666] text-sm text-center mt-20">로그인하면 노트를 사용할 수 있습니다.</p>
          ) : selectedPath ? (
            <div>
              <button onClick={goBack} className="flex items-center gap-1 text-xs text-[#666] hover:text-white mb-4">
                <ArrowLeft size={14} /> 뒤로
              </button>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-lg font-medium">{selectedPath.folderName}</h2>
                <span className="text-[#666]">›</span>
                <h3 className="text-lg text-[#4a9eff]">{selectedPath.subfolderName}</h3>
              </div>
              {selectedChats.length === 0 ? (
                <p className="text-[#666] text-sm text-center mt-10">저장된 채팅이 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {selectedChats.map((chat) => (
                    <SavedChatCard
                      key={chat.id}
                      id={chat.id}
                      question={chat.question}
                      answer={chat.answer}
                      onEdit={() => {}}
                      onDelete={handleDeleteChat}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-medium mb-4">내 노트</h2>
              {notesLoading ? (
                <p className="text-[#666] text-sm text-center mt-10">로딩 중...</p>
              ) : (
                <SubjectList
                  folders={folders}
                  onAddFolder={handleAddFolder}
                  onDeleteFolder={handleDeleteFolder}
                  onSelectFolder={() => {}}
                  onAddSubfolder={handleAddSubfolder}
                  onDeleteSubfolder={handleDeleteSubfolder}
                  onSelectSubfolder={handleSelectSubfolder}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
