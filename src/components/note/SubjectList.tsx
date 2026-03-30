'use client';

import { useState } from 'react';
import { Plus, FolderOpen, ChevronRight, Trash2 } from 'lucide-react';

interface Folder {
  id: string;
  name: string;
  icon: string;
  chatCount: number;
  subfolders: Subfolder[];
}

interface Subfolder {
  id: string;
  name: string;
  chatCount: number;
}

interface SubjectListProps {
  folders: Folder[];
  onAddFolder: (name: string, icon: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onSelectFolder: (folderId: string) => void;
  onAddSubfolder: (folderId: string, name: string) => void;
  onDeleteSubfolder: (folderId: string, subfolderId: string) => void;
  onSelectSubfolder: (folderId: string, subfolderId: string) => void;
}

const ICONS = ['📖', '📐', '🔬', '💻', '📊', '🧮', '⚡', '🧪', '📝', '🎯'];

export default function SubjectList({
  folders,
  onAddFolder,
  onDeleteFolder,
  onSelectFolder,
  onAddSubfolder,
  onDeleteSubfolder,
  onSelectSubfolder,
}: SubjectListProps) {
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📖');
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [addingSubfolderTo, setAddingSubfolderTo] = useState<string | null>(null);
  const [newSubfolderName, setNewSubfolderName] = useState('');

const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;
    await onAddFolder(newFolderName.trim(), selectedIcon);
    setNewFolderName('');
    setShowAddFolder(false);
  };

const handleAddSubfolder = async (folderId: string) => {
    if (!newSubfolderName.trim()) return;
    await onAddSubfolder(folderId, newSubfolderName.trim());
    setNewSubfolderName('');
    setAddingSubfolderTo(null);
  };

  const toggleExpand = (folderId: string) => {
    setExpandedFolder(expandedFolder === folderId ? null : folderId);
  };

  return (
    <div className="space-y-2">
      {/* 폴더 목록 */}
      {folders.map((folder) => (
        <div key={folder.id}>
          {/* 폴더 헤더 */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-[#141414] rounded-xl hover:bg-[#1e1e1e] transition-colors cursor-pointer group"
            onClick={() => toggleExpand(folder.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{folder.icon}</span>
              <span className="text-sm font-medium">{folder.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {folder.chatCount > 0 && (
                <span className="text-[10px] text-[#666] bg-[#2a2a2a] px-2 py-0.5 rounded-full">
                  {folder.chatCount}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder(folder.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-[#666] hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
              <ChevronRight
                size={16}
                className={`text-[#666] transition-transform ${
                  expandedFolder === folder.id ? 'rotate-90' : ''
                }`}
              />
            </div>
          </div>

          {/* 소단원 목록 */}
          {expandedFolder === folder.id && (
            <div className="ml-6 mt-1 space-y-1 animate-fadeIn">
              {folder.subfolders.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f0f] rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                  onClick={() => onSelectSubfolder(folder.id, sub.id)}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen size={14} className="text-[#4a9eff]" />
                    <span className="text-sm text-[#ccc]">{sub.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.chatCount > 0 && (
                      <span className="text-[10px] text-[#666] bg-[#2a2a2a] px-1.5 py-0.5 rounded-full">
                        {sub.chatCount}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSubfolder(folder.id, sub.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[#666] hover:text-red-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                    <ChevronRight size={14} className="text-[#666]" />
                  </div>
                </div>
              ))}

              {/* 소단원 추가 */}
              {addingSubfolderTo === folder.id ? (
                <div className="flex gap-2 px-4 py-2">
                  <input
                    type="text"
                    value={newSubfolderName}
                    onChange={(e) => setNewSubfolderName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubfolder(folder.id)}
                    placeholder="소단원 이름"
                    className="flex-1 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#4a9eff]"
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddSubfolder(folder.id)}
                    className="text-xs text-[#4a9eff] hover:text-white"
                  >
                    추가
                  </button>
                  <button
                    onClick={() => setAddingSubfolderTo(null)}
                    className="text-xs text-[#666] hover:text-white"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingSubfolderTo(folder.id)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-[#666] hover:text-[#4a9eff] transition-colors w-full"
                >
                  <Plus size={12} />
                  소단원 추가
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* 폴더 추가 */}
      {showAddFolder ? (
        <div className="bg-[#141414] rounded-xl px-4 py-3 space-y-3 animate-fadeIn">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
            placeholder="과목/폴더 이름"
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#4a9eff]"
            autoFocus
          />
          <div className="flex gap-1.5 flex-wrap">
            {ICONS.map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                  selectedIcon === icon
                    ? 'bg-[#4a9eff]/20 border border-[#4a9eff]'
                    : 'bg-[#1e1e1e] hover:bg-[#2a2a2a]'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddFolder}
              className="text-xs bg-[#4a9eff] text-white px-4 py-1.5 rounded-lg hover:bg-[#3a8eef]"
            >
              추가
            </button>
            <button
              onClick={() => setShowAddFolder(false)}
              className="text-xs text-[#666] hover:text-white px-4 py-1.5"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddFolder(true)}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#666] hover:text-[#4a9eff] hover:bg-[#141414] rounded-xl transition-colors"
        >
          <Plus size={16} />
          폴더 추가
        </button>
      )}
    </div>
  );
}
