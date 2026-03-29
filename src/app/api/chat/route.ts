import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '메시지를 입력해주세요.' },
        { status: 400 }
      );
    }

    const answer = await generateResponse(message);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'AI 응답 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
