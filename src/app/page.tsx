'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ChatInput from '@/components/layout/ChatInput';
import { useChatStore } from '@/store/chatStore';
import { useAuth } from '@/hooks/useAuth';
import { generateId } from '@/lib/utils/helpers';
import { Sparkles, Edit3, SendHorizontal } from 'lucide-react';
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
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (question: string) => {
    const msgId = generateId();

    // 질문 추가 (답변은 비어있는 상태)
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

  // ========== Chat 뷰 ==========
  if (viewMode === 'chat') {
    return (
      <div className="flex flex-col h-screen">
        <Header />

        {/* 메시지 영역 */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-10 h-10 rounded-full bg-[#4a9eff]/10 flex items-center justify-center mb-4">
                  <Sparkles size={20} className="text-[#4a9eff]" />
                </div>
                <h2 className="font-logo text-2xl mb-2">ChatNote</h2>
                <p className="text-[#666] text-sm">
                  질문하고, 편집하고, 노트에 저장하세요.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className="animate-fadeIn">
                {/* 질문 */}
                <div className="flex justify-end mb-3">
                  <div className="bg-[#1e1e1e] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.question}
                    </p>
                  </div>
                </div>

                {/* 답변 */}
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

                {/* Edit / Send Chat 버튼 */}
                {msg.answer && (
                  <div className="flex gap-3 ml-8 mt-1">
                    <button
                      className="flex items-center gap-1 text-xs text-[#666] hover:text-[#4a9eff] transition-colors"
                    >
                      <Edit3 size={12} />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-1 text-xs text-[#666] hover:text-[#34d399] transition-colors"
                    >
                      <SendHorizontal size={12} />
                      Send chat
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* 입력 영역 */}
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          plan="free"
        />
      </div>
    );
  }

  // ========== Note 뷰 (기본 구조) ==========
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#666] text-sm text-center mt-20">
            {user
              ? 'Note 화면은 다음 단계에서 구현합니다.'
              : '로그인하면 노트를 사용할 수 있습니다.'}
          </p>
        </div>
      </main>
    </div>
  );
}
