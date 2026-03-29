import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Subject, Unit, SavedChat } from '@/types/note';

// ==================== 과목 (Subjects) ====================

export async function getSubjects(userId: string): Promise<Subject[]> {
  const q = query(
    collection(db, 'users', userId, 'subjects'),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Subject[];
}

export async function addSubject(userId: string, name: string, icon: string) {
  const subjects = await getSubjects(userId);
  return addDoc(collection(db, 'users', userId, 'subjects'), {
    name,
    icon,
    order: subjects.length,
    createdAt: serverTimestamp(),
  });
}

export async function deleteSubject(userId: string, subjectId: string) {
  await deleteDoc(doc(db, 'users', userId, 'subjects', subjectId));
}

// ==================== 소단원 (Units) ====================

export async function getUnits(userId: string, subjectId: string): Promise<Unit[]> {
  const q = query(
    collection(db, 'users', userId, 'subjects', subjectId, 'units'),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Unit[];
}

export async function addUnit(userId: string, subjectId: string, name: string) {
  const units = await getUnits(userId, subjectId);
  return addDoc(
    collection(db, 'users', userId, 'subjects', subjectId, 'units'),
    {
      name,
      order: units.length,
      chatCount: 0,
    }
  );
}

export async function deleteUnit(userId: string, subjectId: string, unitId: string) {
  await deleteDoc(doc(db, 'users', userId, 'subjects', subjectId, 'units', unitId));
}

// ==================== 저장된 채팅 (Chats) ====================

export async function getSavedChats(
  userId: string,
  subjectId: string,
  unitId: string
): Promise<SavedChat[]> {
  const q = query(
    collection(
      db,
      'users', userId,
      'subjects', subjectId,
      'units', unitId,
      'chats'
    ),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SavedChat[];
}

export async function sendChatToNote(
  userId: string,
  subjectId: string,
  unitId: string,
  question: string,
  answer: string,
  editData?: string
) {
  // 현재 저장된 채팅 수 확인 (order 계산용)
  const chats = await getSavedChats(userId, subjectId, unitId);

  // 채팅 저장
  const chatRef = await addDoc(
    collection(
      db,
      'users', userId,
      'subjects', subjectId,
      'units', unitId,
      'chats'
    ),
    {
      question,
      answer,
      editData: editData || null,
      order: chats.length,
      savedAt: serverTimestamp(),
    }
  );

  // 소단원의 chatCount 업데이트
  await updateDoc(
    doc(db, 'users', userId, 'subjects', subjectId, 'units', unitId),
    { chatCount: increment(1) }
  );

  return chatRef;
}

export async function updateChatEditData(
  userId: string,
  subjectId: string,
  unitId: string,
  chatId: string,
  editData: string
) {
  await updateDoc(
    doc(
      db,
      'users', userId,
      'subjects', subjectId,
      'units', unitId,
      'chats', chatId
    ),
    { editData }
  );
}

export async function deleteChat(
  userId: string,
  subjectId: string,
  unitId: string,
  chatId: string
) {
  await deleteDoc(
    doc(
      db,
      'users', userId,
      'subjects', subjectId,
      'units', unitId,
      'chats', chatId
    )
  );

  // chatCount 감소
  await updateDoc(
    doc(db, 'users', userId, 'subjects', subjectId, 'units', unitId),
    { chatCount: increment(-1) }
  );
}

// ==================== 채팅 횟수 관리 ====================

export async function checkAndUpdateChatCount(userId: string): Promise<{
  canChat: boolean;
  remaining: number;
  plan: 'free' | 'premium';
}> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const data = userDoc.data();
  const plan = data.plan as 'free' | 'premium';
  const limit = plan === 'premium' ? 100 : 20;

  // 날짜 리셋 확인
  const resetAt = data.chatCountResetAt as Timestamp;
  const now = new Date();
  const resetDate = resetAt?.toDate() || new Date(0);

  // 날짜가 바뀌었으면 카운트 리셋
  if (
    now.getFullYear() !== resetDate.getFullYear() ||
    now.getMonth() !== resetDate.getMonth() ||
    now.getDate() !== resetDate.getDate()
  ) {
    await updateDoc(userRef, {
      chatCount: 0,
      chatCountResetAt: serverTimestamp(),
    });
    return { canChat: true, remaining: limit, plan };
  }

  const currentCount = data.chatCount || 0;
  const remaining = limit - currentCount;

  return {
    canChat: remaining > 0,
    remaining: Math.max(0, remaining),
    plan,
  };
}

export async function incrementChatCount(userId: string) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    chatCount: increment(1),
  });
}
