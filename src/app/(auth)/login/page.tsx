'use client';

import { useState } from 'react';
import { signIn, signInWithGoogle } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      setError(
        err.code === 'auth/invalid-credential'
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : '로그인 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      setError('Google 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <h1 className="font-logo text-3xl text-center mb-8">ChatNote</h1>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* 로그인 폼 */}
        <div className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4a9eff] transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4a9eff] transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-[#4a9eff] text-white rounded-lg py-3 text-sm font-medium hover:bg-[#3a8eef] disabled:opacity-40 transition-colors"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          {/* 구분선 */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-[#666] text-xs">또는</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          {/* Google 로그인 */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-[#141414] border border-[#2a2a2a] text-white rounded-lg py-3 text-sm font-medium hover:border-[#444] transition-colors"
          >
            Google로 계속하기
          </button>
        </div>

        {/* 회원가입 링크 */}
        <p className="text-center text-[#666] text-xs mt-6">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-[#4a9eff] hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
