'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getSubjects,
  addSubject,
  deleteSubject,
  getUnits,
  addUnit,
  deleteUnit,
  getSavedChats,
  sendChatToNote,
  deleteChat,
} from '@/lib/firebase/firestore';
import type { Subject, Unit, SavedChat } from '@/types/note';

interface Folder {
  id: string;
  name: string;
  icon: string;
  chatCount: number;
  subfolders: { id: string; name: string; chatCount: number }[];
}

export function useNotes() {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChats, setSelectedChats] = useState<SavedChat[]>([]);
  const [selectedPath, setSelectedPath] = useState<{
    folderId: string;
    subfolderId: string;
    folderName: string;
    subfolderName: string;
  } | null>(null);

  // 폴더 목록 로드
  const loadFolders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const subjects = await getSubjects(user.uid);
      const foldersWithSubs: Folder[] = await Promise.all(
        subjects.map(async (subject) => {
          const units = await getUnits(user.uid, subject.id);
          const totalChats = units.reduce((sum, u) => sum + (u.chatCount || 0), 0);
          return {
            id: subject.id,
            name: subject.name,
            icon: subject.icon,
            chatCount: totalChats,
            subfolders: units.map((u) => ({
              id: u.id,
              name: u.name,
              chatCount: u.chatCount || 0,
            })),
          };
        })
      );
      setFolders(foldersWithSubs);
    } catch (err) {
      console.error('Failed to load folders:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  // 폴더 추가
  const handleAddFolder = useCallback(
    async (name: string, icon: string): Promise<string> => {
      if (!user) return '';
      const ref = await addSubject(user.uid, name, icon);
      await loadFolders();
      return ref.id;
    },
    [user, loadFolders]
  );

  // 폴더 삭제
  const handleDeleteFolder = useCallback(
    async (folderId: string) => {
      if (!user) return;
      await deleteSubject(user.uid, folderId);
      await loadFolders();
    },
    [user, loadFolders]
  );

  // 소단원 추가
  const handleAddSubfolder = useCallback(
    async (folderId: string, name: string): Promise<string> => {
      if (!user) return '';
      const ref = await addUnit(user.uid, folderId, name);
      await loadFolders();
      return ref.id;
    },
    [user, loadFolders]
  );

  // 소단원 삭제
  const handleDeleteSubfolder = useCallback(
    async (folderId: string, subfolderId: string) => {
      if (!user) return;
      await deleteUnit(user.uid, folderId, subfolderId);
      await loadFolders();
    },
    [user, loadFolders]
  );

  // 소단원 선택 → 저장된 채팅 로드
  const handleSelectSubfolder = useCallback(
    async (folderId: string, subfolderId: string) => {
      if (!user) return;
      const folder = folders.find((f) => f.id === folderId);
      const subfolder = folder?.subfolders.find((s) => s.id === subfolderId);
      setSelectedPath({
        folderId,
        subfolderId,
        folderName: folder?.name || '',
        subfolderName: subfolder?.name || '',
      });
      const chats = await getSavedChats(user.uid, folderId, subfolderId);
      setSelectedChats(chats);
    },
    [user, folders]
  );

  // 채팅을 노트에 저장
  const handleSendToNote = useCallback(
    async (
      folderId: string,
      subfolderId: string,
      question: string,
      answer: string,
      editData?: string
    ) => {
      if (!user) return;
      await sendChatToNote(user.uid, folderId, subfolderId, question, answer, editData);
      await loadFolders();
    },
    [user, loadFolders]
  );

  // 저장된 채팅 삭제
  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      if (!user || !selectedPath) return;
      await deleteChat(
        user.uid,
        selectedPath.folderId,
        selectedPath.subfolderId,
        chatId
      );
      setSelectedChats((prev) => prev.filter((c) => c.id !== chatId));
      await loadFolders();
    },
    [user, selectedPath, loadFolders]
  );

  // 뒤로가기
  const goBack = useCallback(() => {
    setSelectedPath(null);
    setSelectedChats([]);
  }, []);

  return {
    folders,
    loading,
    selectedChats,
    selectedPath,
    handleAddFolder,
    handleDeleteFolder,
    handleAddSubfolder,
    handleDeleteSubfolder,
    handleSelectSubfolder,
    handleSendToNote,
    handleDeleteChat,
    goBack,
    loadFolders,
  };
}
