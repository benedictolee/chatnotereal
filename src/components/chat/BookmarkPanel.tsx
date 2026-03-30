'use client';

import { useState, useRef, useCallback } from 'react';
import { Sparkles, X, GripHorizontal } from 'lucide-react';
import type { ChatMessage } from '@/types/chat';

interface BookmarkPanelProps {
  bookmarkedMessages: ChatMessage[];
  onRemoveBookmark: (id: string) => void;
}

export default function BookmarkPanel({
  bookmarkedMessages,
  onRemoveBookmark,
}: BookmarkPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [panelHeight, setPanelHeight] = useState(40); // vh 단위
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(40);

  // 드래그로 높이 조절
  const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    startHeight.current = panelHeight;
  }, [panelHeight]);

  const handleDragMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startY.current;
    const deltaVh = (deltaY / window.innerHeight) * 100;
    const newHeight = Math.max(20, Math.min(70, startHeight.current - deltaVh));
    setPanelHeight(newHeight);
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  if (bookmarkedMessages.length === 0) return null;

  return (
    <>
      {/* 포스트잇 태그들 (접힌 상태) */}
      {!isExpanded && (
        <div className="fixed top-12 right-4 z-40 flex flex-col gap-1">
          {bookmarkedMessages.map((msg, i) => (
            <button
              key={msg.id}
              onClick={() => setIsExpanded(true)}
              className="bg-[#fbbf24]/90 text-black text-[10px] px-2 py-1 rounded-b-md shadow-lg hover:bg-[#fbbf24] transition-colors max-w-[120px] truncate"
              style={{ transform: `translateX(${i * 4}px)` }}
            >
              {msg.question.slice(0, 15)}...
            </button>
          ))}
        </div>
      )}

      {/* 스플릿 뷰 (펼친 상태) */}
      {isExpanded && (
        <div
          className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-[#2a2a2a] shadow-2xl"
          style={{ height: `${panelHeight}vh` }}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2a2a] bg-[#141414]">
            <div className="flex items-center gap-2">
              <span className="text-[#fbbf24] text-xs">📌</span>
              <span className="text-xs text-[#aaa]">
                북마크 ({bookmarkedMessages.length})
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[#666] hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* 북마크된 메시지들 */}
          <div className="overflow-y-auto px-4 py-3 space-y-4" style={{ height: `calc(${panelHeight}vh - 80px)` }}>
            {bookmarkedMessages.map((msg) => (
              <div key={msg.id} className="bg-[#141414] rounded-xl p-3 space-y-2">
                {/* 질문 */}
                <div className="flex justify-end">
                  <div className="bg-[#1e1e1e] rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">
                      {msg.question}
                    </p>
                  </div>
                </div>

                {/* 답변 */}
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4a9eff]/20 flex items-center justify-center mt-0.5">
                    <Sparkles size={10} className="text-[#4a9eff]" />
                  </div>
                  <p className="text-xs leading-relaxed text-[#aaa] whitespace-pre-wrap">
                    {msg.answer}
                  </p>
                </div>

                {/* 북마크 해제 */}
                <div className="flex justify-end">
                  <button
                    onClick={() => onRemoveBookmark(msg.id)}
                    className="text-[10px] text-[#666] hover:text-[#fbbf24] transition-colors"
                  >
                    북마크 해제
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 드래그 핸들 */}
          <div
            ref={dragRef}
            className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center cursor-row-resize bg-[#0a0a0a] border-t border-[#2a2a2a]"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <GripHorizontal size={16} className="text-[#444]" />
          </div>
        </div>
      )}
    </>
  );
}
