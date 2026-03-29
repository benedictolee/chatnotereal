import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChatNote',
  description: 'AI 채팅과 노트를 하나로',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-[#0a0a0a] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
