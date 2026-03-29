# ChatNote — 프로젝트 구조 설계서

## 기술 스택
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend/DB**: Firebase (Auth, Firestore, Storage) — Blaze 요금제
- **AI**: Google AI Studio (Gemini API)
- **배포**: Vercel + GitHub
- **필기/편집**: Fabric.js (Canvas 기반 자유 필기) + 텍스트 하이라이트

---

## 폴더 구조

```
chatnote/
├── .env.local                    # API 키 (Gemini, Firebase)
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── public/
│   └── fonts/                    # 커스텀 폰트
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # 루트 레이아웃 (다크테마, 폰트)
│   │   ├── page.tsx              # 메인 → Chat 화면
│   │   ├── globals.css           # 글로벌 스타일
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # 로그인 페이지
│   │   │   └── signup/
│   │   │       └── page.tsx      # 회원가입 페이지
│   │   │
│   │   └── note/
│   │       ├── page.tsx          # Note 메인 (과목/단원 목록)
│   │       └── [subjectId]/
│   │           ├── page.tsx      # 과목 상세 (소단원 목록)
│   │           └── [unitId]/
│   │               └── page.tsx  # 소단원 상세 (저장된 Q&A 세트들)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # 상단바 (ChatNote 로고 + 로그인 + Go Note/Go Chat 토글)
│   │   │   └── ChatInput.tsx     # 하단 채팅 입력바 (+ 버튼, 무료모델, 마이크, 전송)
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatContainer.tsx # 채팅 메시지 목록
│   │   │   ├── ChatMessage.tsx   # 개별 메시지 (질문-답변 세트)
│   │   │   ├── ChatBubble.tsx    # 말풍선 UI
│   │   │   └── EditButton.tsx    # Edit 버튼 (편집모드 진입)
│   │   │
│   │   ├── note/
│   │   │   ├── SubjectList.tsx   # 과목 목록 (반도체 소자 원리, 공업수학 등)
│   │   │   ├── UnitList.tsx      # 소단원 목록 (Part A, B, C...)
│   │   │   ├── SavedChatCard.tsx # 저장된 Q&A 세트 카드
│   │   │   └── SendChatModal.tsx # SendChat 시 소단원 선택 모달
│   │   │
│   │   ├── editor/
│   │   │   ├── EditorCanvas.tsx  # Fabric.js 기반 편집 캔버스
│   │   │   ├── EditorToolbar.tsx # 편집 사이드바 (되돌리기, 글상자, 필기, 밑줄, 지우개, 묶기, 갤러리)
│   │   │   ├── tools/
│   │   │   │   ├── UndoRedo.tsx
│   │   │   │   ├── TextBox.tsx
│   │   │   │   ├── Pen.tsx
│   │   │   │   ├── Highlighter.tsx
│   │   │   │   ├── Eraser.tsx
│   │   │   │   ├── GroupTool.tsx
│   │   │   │   └── GalleryAdd.tsx
│   │   │   └── SaveButton.tsx    # Save 버튼 (편집 임시저장)
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── Badge.tsx         # 저장된 chat 수 표시
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts         # Firebase 초기화
│   │   │   ├── auth.ts           # Auth 관련 함수
│   │   │   └── firestore.ts      # Firestore CRUD
│   │   │
│   │   ├── gemini/
│   │   │   └── client.ts         # Gemini API 클라이언트
│   │   │
│   │   └── utils/
│   │       ├── constants.ts      # 상수값
│   │       └── helpers.ts        # 유틸 함수
│   │
│   ├── hooks/
│   │   ├── useAuth.ts            # 인증 상태 관리
│   │   ├── useChat.ts            # 채팅 로직
│   │   ├── useNotes.ts           # 노트 CRUD
│   │   └── useEditor.ts          # 편집기 상태
│   │
│   ├── store/
│   │   └── chatStore.ts          # Zustand 상태관리 (채팅, 편집 상태)
│   │
│   └── types/
│       ├── chat.ts               # Chat 관련 타입
│       ├── note.ts               # Note 관련 타입
│       └── user.ts               # User 관련 타입
│
└── README.md
```

---

## Firestore 데이터 구조

```
users/
  └── {userId}/
      ├── email: string
      ├── plan: "free" | "premium"
      ├── chatCount: number          # 오늘 사용한 채팅 수
      ├── chatCountResetAt: timestamp
      └── createdAt: timestamp

subjects/
  └── {userId}/
      └── subjects/
          └── {subjectId}/
              ├── name: string       # "반도체 소자 원리"
              ├── icon: string       # 📖
              ├── order: number
              ├── createdAt: timestamp
              │
              └── units/
                  └── {unitId}/
                      ├── name: string    # "Part A. 상미분방정식"
                      ├── order: number
                      ├── chatCount: number  # 저장된 chat 수
                      │
                      └── chats/
                          └── {chatId}/
                              ├── question: string
                              ├── answer: string        # 마크다운/LaTeX
                              ├── editData: string      # Fabric.js JSON (편집 데이터)
                              ├── order: number
                              └── savedAt: timestamp
```

---

## 무료 vs 구독 제한

| 항목 | 무료 | 구독 (Premium) |
|------|------|----------------|
| 일일 채팅 | 20회 | 100회 (5배) |
| 노트 과목 수 | 3개 | 무제한 |
| 소단원 수 | 과목당 10개 | 무제한 |
| 저장 Q&A | 소단원당 20개 | 무제한 |
| 편집 기능 | 전체 사용 가능 | 전체 사용 가능 |

---

## API Routes (Next.js Route Handlers)

```
src/app/api/
  ├── chat/
  │   └── route.ts          # POST: Gemini API 호출 (서버사이드)
  ├── auth/
  │   └── route.ts          # 인증 관련
  └── subscription/
      └── route.ts          # 구독 상태 확인/변경
```

---

## 핵심 사용자 흐름

### 1. Chat → Edit → Save → SendChat
1. 사용자가 질문 입력 → Gemini API 응답
2. 질문-답변 세트 하단 "Edit" 버튼 클릭
3. 편집 화면 전환 (사이드바 + Canvas)
4. 편집 완료 → "Save" (임시저장, 아직 Note에 미전송)
5. Chat 화면 복귀 → "SendChat" 버튼 클릭
6. 소단원 선택 모달 → 저장할 위치 지정
7. Firestore에 Q&A + 편집 데이터 저장

### 2. Note 열람
1. "Go Note" 클릭 → 과목 목록
2. 과목 선택 → 소단원 목록 (각 소단원 옆에 저장된 chat 수 배지)
3. 소단원 선택 → 저장된 Q&A 세트 목록
4. 개별 Q&A 선택 → 편집된 상태로 열람/재편집

---

## 환경변수 (.env.local)

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Gemini
GEMINI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 설치할 패키지

```bash
# 코어
npx create-next-app@latest chatnote --typescript --tailwind --eslint --app --src-dir

# Firebase
npm install firebase firebase-admin

# AI
npm install @google/generative-ai

# 편집기
npm install fabric         # Canvas 기반 필기/드로잉

# 상태관리
npm install zustand

# UI/UX
npm install framer-motion  # 애니메이션
npm install lucide-react   # 아이콘
npm install react-markdown # 마크다운 렌더링
npm install katex react-katex  # LaTeX 수식 렌더링

# 유틸
npm install clsx tailwind-merge
```

---

## 디자인 시스템

### 컬러 팔레트
```css
:root {
  --bg-primary: #0a0a0a;       /* 메인 배경 */
  --bg-secondary: #141414;     /* 카드/섹션 배경 */
  --bg-tertiary: #1e1e1e;      /* 입력필드/호버 */
  --text-primary: #ffffff;     /* 메인 텍스트 */
  --text-secondary: #a0a0a0;   /* 보조 텍스트 */
  --accent-blue: #4a9eff;      /* 강조 (AI 답변, 링크) */
  --accent-green: #34d399;     /* 성공/저장 */
  --accent-cyan: #22d3ee;      /* 하이라이트/밑줄 */
  --border: #2a2a2a;           /* 테두리 */
}
```

### 폰트
- **로고 "ChatNote"**: Playfair Display (필기체 느낌)
- **"Go Note" 버튼**: Playfair Display Italic
- **"Go Chat" 버튼**: 일반체 (시스템 산세리프)
- **본문**: Pretendard (한글) + Geist Sans (영문)
- **코드/수식**: JetBrains Mono
