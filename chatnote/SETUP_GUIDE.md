# ChatNote 세팅 가이드

## 1단계: 프로젝트 생성 (터미널에서 실행)

```bash
npx create-next-app@latest chatnote --typescript --tailwind --eslint --app --src-dir --use-npm
cd chatnote
```

프롬프트 나오면:
- Would you like to use TypeScript? → **Yes**
- Would you like to use ESLint? → **Yes**
- Would you like to use Tailwind CSS? → **Yes**
- Would you like your code inside a `src/` directory? → **Yes**
- Would you like to use App Router? → **Yes**
- Would you like to use Turbopack? → **Yes**
- Would you like to customize the import alias? → **No** (기본 @/)

---

## 2단계: 패키지 설치

```bash
npm install firebase @google/generative-ai zustand framer-motion lucide-react react-markdown katex react-katex fabric clsx tailwind-merge
npm install -D @types/katex
```

---

## 3단계: .env.local 생성

프로젝트 루트에 `.env.local` 파일 생성 후 아래 내용 입력:

```env
# ===== Firebase =====
# Firebase Console → 프로젝트 설정 → 일반 → 웹 앱 SDK 설정에서 복사
NEXT_PUBLIC_FIREBASE_API_KEY=여기에_입력
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=여기에_입력.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=여기에_입력
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=여기에_입력.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=여기에_입력
NEXT_PUBLIC_FIREBASE_APP_ID=여기에_입력

# ===== Gemini API =====
# Google AI Studio → API Keys에서 복사
GEMINI_API_KEY=여기에_입력

# ===== App =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4단계: Firebase Console 설정

### Authentication 활성화
1. Firebase Console → Authentication → 시작하기
2. 로그인 방법 → **이메일/비밀번호** 활성화
3. (선택) Google 로그인도 활성화

### Firestore 활성화
1. Firebase Console → Firestore Database → 데이터베이스 만들기
2. **프로덕션 모드** 선택
3. 위치: asia-northeast3 (서울)

### Firestore 보안 규칙 (초기)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 본인 데이터만 접근 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /subjects/{subjectId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        match /units/{unitId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
          
          match /chats/{chatId} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
    }
  }
}
```

---

## 5단계: .gitignore 확인

`.gitignore`에 아래가 포함되어 있는지 확인:
```
.env.local
.env*.local
```

---

## 6단계: 폴더 구조 생성

```bash
# src 하위 폴더 한번에 생성
mkdir -p src/app/\(auth\)/login
mkdir -p src/app/\(auth\)/signup
mkdir -p src/app/note/\[subjectId\]/\[unitId\]
mkdir -p src/app/api/chat
mkdir -p src/components/layout
mkdir -p src/components/chat
mkdir -p src/components/note
mkdir -p src/components/editor/tools
mkdir -p src/components/ui
mkdir -p src/lib/firebase
mkdir -p src/lib/gemini
mkdir -p src/lib/utils
mkdir -p src/hooks
mkdir -p src/store
mkdir -p src/types
```

이 다음은 각 파일의 코드를 넣으면 됩니다.
→ 다음 메시지에서 핵심 파일들 코드를 제공합니다.
