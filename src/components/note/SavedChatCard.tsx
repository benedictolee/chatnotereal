'use client';

import { Sparkles, Edit3, Trash2 } from 'lucide-react';

interface SavedChatCardProps {
  id: string;
  question: string;
  answer: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SavedChatCard({
  id,
  question,
  answer,
  onEdit,
  onDelete,
}: SavedChatCardProps) {
  return (
    <div className="bg-[#141414] rounded-xl p-4 space-y-3 group animate-fadeIn">
      {/* 질문 */}
      <div className="flex justify-end">
        <div className="bg-[#1e1e1e] rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
          <p className="text-xs leading-relaxed whitespace-pre-wrap text-[#ccc]">
            {question}
          </p>
        </div>
      </div>

      {/* 답변 */}
      <div className="flex gap-2">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4a9eff]/20 flex items-center justify-center mt-0.5">
          <Sparkles size={10} className="text-[#4a9eff]" />
        </div>
        <p className="text-xs leading-relaxed text-[#aaa] whitespace-pre-wrap line-clamp-4">
          {answer}
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(id)}
          className="flex items-center gap-1 text-[10px] text-[#666] hover:text-[#4a9eff] transition-colors"
        >
          <Edit3 size={10} />
          편집
        </button>
        <button
          onClick={() => onDelete(id)}
          className="flex items-center gap-1 text-[10px] text-[#666] hover:text-red-400 transition-colors"
        >
          <Trash2 size={10} />
          삭제
        </button>
      </div>
    </div>
  );
}
