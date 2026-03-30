'use client';

import { useState } from 'react';
import { X, FolderOpen, Plus, ChevronRight, Check } from 'lucide-react';

interface Folder {
  id: string;
  name: string;
  icon: string;
  subfolders: { id: string; name: string }[];
}

interface SendChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  onSend: (folderId: string, subfolderId: string) => void;
  onCreateFolder: (name: string, icon: string) => Promise<string>;
  onCreateSubfolder: (folderId: string, name: string) => Promise<string>;
}

export default function SendChatModal({
  isOpen,
  onClose,
  folders,
  onSend,
  onCreateFolder,
  onCreateSubfolder,
}: SendChatModalProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedSubfolder, setSelectedSubfolder] = useState<string | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [creatingSubfolder, setCreatingSubfolder] = useState(false);
  const [newName, setNewName] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const currentFolder = folders.find((f) => f.id === selectedFolder);

  const handleCreateFolder = async () => {
    if (!newName.trim()) return;
    const id = await onCreateFolder(newName.trim(), '📖');
    setSelectedFolder(id);
    setNewName('');
    setCreatingFolder(false);
  };

  const handleCreateSubfolder = async () => {
    if (!newName.trim() || !selectedFolder) return;
    const id = await onCreateSubfolder(selectedFolder, newName.trim());
    setSelectedSubfolder(id);
    setNewName('');
    setCreatingSubfolder(false);
  };

  const handleSend = async () => {
    if (!selectedFolder || !selectedSubfolder) return;
    setSending(true);
    await onSend(selectedFolder, selectedSubfolder);
    setSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="relative bg-[#141414] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[70vh] overflow-hidden animate-fadeIn">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <h3 className="text-sm font-medium">저장할 위치 선택</h3>
          <button onClick={onClose} className="text-[#666] hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* 내용 */}
        <div className="px-5 py-3 overflow-y-auto max-h-[50vh]">
          {/* 폴더 선택 단계 */}
          {!selectedFolder && (
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-[#1e1e1e] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{folder.icon}</span>
                    <span className="text-sm">{folder.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-[#666]" />
                </button>
              ))}

              {/* 새 폴더 만들기 */}
              {creatingFolder ? (
                <div className="flex gap-2 px-3 py-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    placeholder="새 폴더 이름"
                    className="flex-1 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#4a9eff]"
                    autoFocus
                  />
                  <button onClick={handleCreateFolder} className="text-xs text-[#4a9eff]">
                    생성
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCreatingFolder(true)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[#666] hover:text-[#4a9eff] transition-colors"
                >
                  <Plus size={14} />
                  새 폴더 만들기
                </button>
              )}
            </div>
          )}

          {/* 소단원 선택 단계 */}
          {selectedFolder && !selectedSubfolder && currentFolder && (
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder(null)}
                className="flex items-center gap-1 text-xs text-[#666] hover:text-white mb-2"
              >
                ← 뒤로
              </button>

              <div className="text-xs text-[#666] px-3 py-1">
                {currentFolder.icon} {currentFolder.name}
              </div>

              {currentFolder.subfolders.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubfolder(sub.id)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-[#1e1e1e] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen size={14} className="text-[#4a9eff]" />
                    <span className="text-sm">{sub.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-[#666]" />
                </button>
              ))}

              {/* 새 소단원 만들기 */}
              {creatingSubfolder ? (
                <div className="flex gap-2 px-3 py-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateSubfolder()}
                    placeholder="새 소단원 이름"
                    className="flex-1 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#4a9eff]"
                    autoFocus
                  />
                  <button onClick={handleCreateSubfolder} className="text-xs text-[#4a9eff]">
                    생성
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCreatingSubfolder(true)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[#666] hover:text-[#4a9eff] transition-colors"
                >
                  <Plus size={14} />
                  새 소단원 만들기
                </button>
              )}
            </div>
          )}

          {/* 확인 단계 */}
          {selectedFolder && selectedSubfolder && currentFolder && (
            <div className="text-center py-4 space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm">
                <span>{currentFolder.icon}</span>
                <span>{currentFolder.name}</span>
                <ChevronRight size={12} className="text-[#666]" />
                <span className="text-[#4a9eff]">
                  {currentFolder.subfolders.find((s) => s.id === selectedSubfolder)?.name}
                </span>
              </div>
              <p className="text-xs text-[#666]">여기에 저장할까요?</p>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        {selectedFolder && selectedSubfolder && (
          <div className="px-5 py-4 border-t border-[#2a2a2a] flex gap-2">
            <button
              onClick={() => {
                setSelectedSubfolder(null);
              }}
              className="flex-1 py-2.5 text-sm text-[#666] hover:text-white rounded-lg border border-[#2a2a2a] transition-colors"
            >
              다시 선택
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 py-2.5 text-sm bg-[#4a9eff] text-white rounded-lg hover:bg-[#3a8eef] disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
            >
              <Check size={14} />
              {sending ? '저장 중...' : '저장'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
