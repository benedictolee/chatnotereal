'use client';

import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/firebase/auth';
import { useChatStore } from '@/store/chatStore';
import { LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { user, loading } = useAuth();
  const { viewMode, setViewMode } = useChatStore();

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a2a]">
      {/* 왼쪽: 로고 + 로그인 */}
      <div className="flex items-center gap-4">
        <h1 className="font-logo text-xl font-bold tracking-wide">
          ChatNote
        </h1>

        {/* 로그인 상태 */}
        {!loading && (
          <>
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-xs text-[#a0a0a0] hover:text-white transition-colors"
              >
                <User size={14} />
                <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
                <LogOut size={12} />
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs text-[#a0a0a0] hover:text-white transition-colors"
              >
                <LogIn size={14} />
                <span>로그인</span>
              </Link>
            )}
          </>
        )}
      </div>

      {/* 오른쪽: Go Note / Go Chat 토글 */}
      <button
        onClick={() => setViewMode(viewMode === 'chat' ? 'note' : 'chat')}
        className="transition-colors hover:opacity-80"
      >
        {viewMode === 'chat' ? (
          <span className="font-logo-italic text-base text-[#a0a0a0] hover:text-white">
            Go Note
          </span>
        ) : (
          <span className="text-base text-[#a0a0a0] hover:text-white">
            Go Chat
          </span>
        )}
      </button>
    </header>
  );
}
