'use client';

import { useState } from 'react';
import { signUp, signInWithGoogle } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      router.push('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (err.code === 'auth/invalid-email') {
        setError('올바른 이메일 형식이 아닙니다.');
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithGoogle();
      router.push('/');
    } catch {
      setError('Google 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-logo text-3xl text-center mb-8">ChatNote</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4a9eff] transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (6자 이상)"
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4a9eff] transition-colors"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 확인"
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#4a9eff] transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleSignup(e)}
          />

          <button
            onClick={handleSignup}
            disabled={loading || !email || !password || !confirmPassword}
            className="w-full bg-[#4a9eff] text-white rounded-lg py-3 text-sm font-medium hover:bg-[#3a8eef] disabled:opacity-40 transition-colors"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-[#666] text-xs">또는</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-[#141414] border border-[#2a2a2a] text-white rounded-lg py-3 text-sm font-medium hover:border-[#444] transition-colors"
          >
            Google로 계속하기
          </button>
        </div>

        <p className="text-center text-[#666] text-xs mt-6">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-[#4a9eff] hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
