import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

// 회원가입
export async function signUp(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Firestore에 사용자 문서 생성
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    plan: 'free',
    chatCount: 0,
    chatCountResetAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  return user;
}

// 로그인
export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// Google 로그인
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;

  // 첫 로그인이면 사용자 문서 생성
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      plan: 'free',
      chatCount: 0,
      chatCountResetAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  }

  return user;
}

// 로그아웃
export async function signOut() {
  await firebaseSignOut(auth);
}

// 인증 상태 리스너
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
