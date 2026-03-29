'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Mic, Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  plan: 'free' | 'premium';
}

export default function ChatInput({ onSend, isLoading, plan }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 텍스트에어리어 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="chat-input-area flex items-end gap-2 px-4 py-3 max-w-3xl mx-auto">
        {/* + 버튼 */}
        <button className="flex-shrink-0 p-1 text-[#666] hover:text-white transition-colors">
          <Plus size={20} />
        </button>

        {/* 입력 필드 */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          rows={1}
          className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder:text-[#666] max-h-40"
          disabled={isLoading}
        />

        {/* 모델 표시 */}
        <span className="flex-shrink-0 text-[10px] text-[#666] self-center px-2 py-0.5 bg-[#1e1e1e] rounded-full">
          {plan === 'free' ? '무료모델' : 'Premium'}
        </span>

        {/* 마이크 버튼 */}
        <button className="flex-shrink-0 p-1 text-[#666] hover:text-white transition-colors">
          <Mic size={18} />
        </button>

        {/* 전송 버튼 */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 p-1.5 bg-[#4a9eff] text-white rounded-full disabled:opacity-30 hover:bg-[#3a8eef] transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
