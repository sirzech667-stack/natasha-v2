import React, { useState } from 'react';
import {
  FileText,
  Users,
  Globe,
  Lightbulb,
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  Pin,
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Novel, Character, WorldItem, IdeaItem, Volume, LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { BottomSheet } from './BottomSheet';

interface StoryBibleViewProps {
  activeNovel: Novel | null;
  language: LanguageCode;
  onUpdateNovel: (updatedNovel: Novel) => void;
}

export const StoryBibleView: React.FC<StoryBibleViewProps> = ({
  activeNovel,
  language,
  onUpdateNovel,
}) => {
  const t = translations[language] || translations.id;
  const [activeTab, setActiveTab] = useState<'synopsis' | 'characters' | 'world' | 'ideas' | 'volumes'>('synopsis');

  // Modals state
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState<Character | null>(null);

  const [isWorldModalOpen, setIsWorldModalOpen] = useState(false);
  const [editingWorld, setEditingWorld] = useState<WorldItem | null>(null);

  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<IdeaItem | null>(null);

  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);
  const [editingVolume, setEditingVolume] = useState<Volume | null>(null);

  // Form states
  // Character Form
  const [charName, setCharName] = useState('');
  const [charRole, setCharRole] = useState<Character['role']>('protagonist');
  const [charAge, setCharAge] = useState('');
  const [charPersonality, setCharPersonality] = useState('');
  const [charBackstory, setCharBackstory] = useState('');
  const [charGoals, setCharGoals] = useState('');
  const [charAvatarUrl, setCharAvatarUrl] = useState('');

  // World Form
  const [worldName, setWorldName] = useState('');
  const [worldCategory, setWorldCategory] = useState<WorldItem['category']>('location');
  const [worldDesc, setWorldDesc] = useState('');
  const [worldDetails, setWorldDetails] = useState('');

  // Idea Form
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaContent, setIdeaContent] = useState('');
  const [ideaCategory, setIdeaCategory] = useState<IdeaItem['category']>('plot_twist');

  // Volume Form
  const [volTitle, setVolTitle] = useState('');
  const [volDesc, setVolDesc] = useState('');

  // Expanded Volume Accordion State
  const [expandedVolumeIds, setExpandedVolumeIds] = useState<Record<string, boolean>>({});

  if (!activeNovel) {
    return (
      <div className="p-8 text-center text-slate-400 py-20">
        <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-xs font-semibold">{t.noNovelsFound}</p>
      </div>
    );
  }

  // Handle Synopsis Save
  const handleUpdateSynopsisField = (field: keyof typeof activeNovel.synopsis, value: string) => {
    const updated = {
      ...activeNovel,
      synopsis: {
        ...activeNovel.synopsis,
        [field]: value,
      },
    };
    onUpdateNovel(updated);
  };

  // Character Handlers
  const handleOpenCharModal = (char?: Character) => {
    if (char) {
      setEditingChar(char);
      setCharName(char.name);
      setCharRole(char.role);
      setCharAge(char.age || '');
      setCharPersonality(char.personality);
      setCharBackstory(char.backstory);
      setCharGoals(char.goals);
      setCharAvatarUrl(char.avatarUrl || '');
    } else {
      setEditingChar(null);
      setCharName('');
      setCharRole('protagonist');
      setCharAge('');
      setCharPersonality('');
      setCharBackstory('');
      setCharGoals('');
      setCharAvatarUrl('');
    }
    setIsCharModalOpen(true);
  };

  const handleSaveChar = () => {
    if (!charName.trim()) return;

    let updatedChars = [...activeNovel.characters];
    if (editingChar) {
      updatedChars = updatedChars.map((c) =>
        c.id === editingChar.id
          ? {
              ...c,
              name: charName.trim(),
              role: charRole,
              age: charAge,
              personality: charPersonality,
              backstory: charBackstory,
              goals: charGoals,
              avatarUrl: charAvatarUrl,
            }
          : c
      );
    } else {
      const newChar: Character = {
        id: 'char-' + Date.now(),
        name: charName.trim(),
        role: charRole,
        age: charAge,
        personality: charPersonality,
        backstory: charBackstory,
        goals: charGoals,
        avatarUrl: charAvatarUrl,
      };
      updatedChars.push(newChar);
    }

    onUpdateNovel({ ...activeNovel, characters: updatedChars });
    setIsCharModalOpen(false);
  };

  const handleDeleteChar = (id: string) => {
    if (confirm('Delete character?')) {
      const updatedChars = activeNovel.characters.filter((c) => c.id !== id);
      onUpdateNovel({ ...activeNovel, characters: updatedChars });
    }
  };

  // World Handlers
  const handleOpenWorldModal = (item?: WorldItem) => {
    if (item) {
      setEditingWorld(item);
      setWorldName(item.name);
      setWorldCategory(item.category);
      setWorldDesc(item.description);
      setWorldDetails(item.details);
    } else {
      setEditingWorld(null);
      setWorldName('');
      setWorldCategory('location');
      setWorldDesc('');
      setWorldDetails('');
    }
    setIsWorldModalOpen(true);
  };

  const handleSaveWorld = () => {
    if (!worldName.trim()) return;

    let updatedWorld = [...activeNovel.worldItems];
    if (editingWorld) {
      updatedWorld = updatedWorld.map((w) =>
        w.id === editingWorld.id
          ? { ...w, name: worldName.trim(), category: worldCategory, description: worldDesc, details: worldDetails }
          : w
      );
    } else {
      updatedWorld.push({
        id: 'world-' + Date.now(),
        name: worldName.trim(),
        category: worldCategory,
        description: worldDesc,
        details: worldDetails,
      });
    }

    onUpdateNovel({ ...activeNovel, worldItems: updatedWorld });
    setIsWorldModalOpen(false);
  };

  const handleDeleteWorld = (id: string) => {
    if (confirm('Delete item?')) {
      const updatedWorld = activeNovel.worldItems.filter((w) => w.id !== id);
      onUpdateNovel({ ...activeNovel, worldItems: updatedWorld });
    }
  };

  // Idea Handlers
  const handleOpenIdeaModal = (idea?: IdeaItem) => {
    if (idea) {
      setEditingIdea(idea);
      setIdeaTitle(idea.title);
      setIdeaContent(idea.content);
      setIdeaCategory(idea.category);
    } else {
      setEditingIdea(null);
      setIdeaTitle('');
      setIdeaContent('');
      setIdeaCategory('plot_twist');
    }
    setIsIdeaModalOpen(true);
  };

  const handleSaveIdea = () => {
    if (!ideaTitle.trim()) return;

    let updatedIdeas = [...activeNovel.ideas];
    if (editingIdea) {
      updatedIdeas = updatedIdeas.map((i) =>
        i.id === editingIdea.id
          ? { ...i, title: ideaTitle.trim(), content: ideaContent, category: ideaCategory }
          : i
      );
    } else {
      updatedIdeas.push({
        id: 'idea-' + Date.now(),
        title: ideaTitle.trim(),
        content: ideaContent,
        category: ideaCategory,
        pinned: false,
        createdAt: Date.now(),
      });
    }

    onUpdateNovel({ ...activeNovel, ideas: updatedIdeas });
    setIsIdeaModalOpen(false);
  };

  const handleTogglePinIdea = (idea: IdeaItem) => {
    const updatedIdeas = activeNovel.ideas.map((i) =>
      i.id === idea.id ? { ...i, pinned: !i.pinned } : i
    );
    onUpdateNovel({ ...activeNovel, ideas: updatedIdeas });
  };

  const handleDeleteIdea = (id: string) => {
    if (confirm('Delete idea memo?')) {
      const updatedIdeas = activeNovel.ideas.filter((i) => i.id !== id);
      onUpdateNovel({ ...activeNovel, ideas: updatedIdeas });
    }
  };

  // Volume / Arc Handlers
  const handleSaveVolume = () => {
    if (!volTitle.trim()) return;

    let updatedVols = [...activeNovel.volumes];
    if (editingVolume) {
      updatedVols = updatedVols.map((v) =>
        v.id === editingVolume.id ? { ...v, title: volTitle.trim(), description: volDesc } : v
      );
    } else {
      updatedVols.push({
        id: 'vol-' + Date.now(),
        title: volTitle.trim(),
        order: updatedVols.length + 1,
        description: volDesc,
      });
    }

    onUpdateNovel({ ...activeNovel, volumes: updatedVols });
    setIsVolumeModalOpen(false);
  };

  return (
    <div className="p-4 space-y-4 pb-24 bg-gray-50 animate-fade-in">
      {/* Tab Navigation Pill Header */}
      <div className="flex gap-1 bg-gray-200/60 p-1 rounded-2xl text-xs font-semibold overflow-x-auto scrollbar-none">
        {[
          { id: 'synopsis', label: t.tabSynopsis, icon: FileText },
          { id: 'characters', label: t.tabCharacters, icon: Users },
          { id: 'world', label: t.tabWorld, icon: Globe },
          { id: 'ideas', label: t.tabIdeas, icon: Lightbulb },
          { id: 'volumes', label: t.tabVolumes, icon: FolderTree },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isSel ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-gray-700" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Synopsis Tab */}
      {activeTab === 'synopsis' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
            <div>
              <label className="block text-gray-800 font-bold mb-1">{t.shortSynopsis}</label>
              <textarea
                value={activeNovel.synopsis.shortSynopsis}
                onChange={(e) => handleUpdateSynopsisField('shortSynopsis', e.target.value)}
                rows={2}
                placeholder="Elevator pitch in 1-2 punchy sentences..."
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/20 outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-bold mb-1">{t.longSynopsis}</label>
              <textarea
                value={activeNovel.synopsis.longSynopsis}
                onChange={(e) => handleUpdateSynopsisField('longSynopsis', e.target.value)}
                rows={4}
                placeholder="Full plot overview..."
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/20 outline-none text-gray-800"
              />
            </div>
          </div>

          {/* 3-Act Beats Card */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3 shadow-2xs">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gray-700" />
              <span>3-Act Structure Beats</span>
            </h4>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-gray-600 font-bold mb-1 text-[11px]">{t.hook}</label>
                <input
                  type="text"
                  value={activeNovel.synopsis.hook}
                  onChange={(e) => handleUpdateSynopsisField('hook', e.target.value)}
                  placeholder="Inciting incident & hook..."
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-gray-900/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1 text-[11px]">{t.conflict}</label>
                <input
                  type="text"
                  value={activeNovel.synopsis.conflict}
                  onChange={(e) => handleUpdateSynopsisField('conflict', e.target.value)}
                  placeholder="Rising action & main obstacle..."
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-gray-900/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1 text-[11px]">{t.climax}</label>
                <input
                  type="text"
                  value={activeNovel.synopsis.climax}
                  onChange={(e) => handleUpdateSynopsisField('climax', e.target.value)}
                  placeholder="Peak confrontation..."
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-gray-900/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1 text-[11px]">{t.resolution}</label>
                <input
                  type="text"
                  value={activeNovel.synopsis.resolution}
                  onChange={(e) => handleUpdateSynopsisField('resolution', e.target.value)}
                  placeholder="Falling action & finale..."
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-gray-900/20 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Characters Tab */}
      {activeTab === 'characters' && (
        <div className="space-y-3">
          <button
            onClick={() => handleOpenCharModal()}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-semibold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.addCharacter}</span>
          </button>

          <div className="space-y-2.5">
            {activeNovel.characters.map((char) => (
              <div
                key={char.id}
                className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex items-start gap-3 relative"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
                  {char.avatarUrl ? (
                    <img src={char.avatarUrl} alt={char.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pr-12 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-bold text-gray-900 truncate">{char.name}</h5>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 shrink-0 border border-gray-200">
                      {char.role}
                    </span>
                  </div>
                  {char.personality && (
                    <p className="text-gray-600 font-medium line-clamp-2 mb-1">{char.personality}</p>
                  )}
                  {char.goals && (
                    <p className="text-[10px] text-gray-400 italic truncate">Goal: {char.goals}</p>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => handleOpenCharModal(char)}
                    className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteChar(char.id)}
                    className="p-1 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. World & Lore Tab */}
      {activeTab === 'world' && (
        <div className="space-y-3">
          <button
            onClick={() => handleOpenWorldModal()}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-semibold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.addWorldItem}</span>
          </button>

          <div className="space-y-2.5">
            {activeNovel.worldItems.map((item) => (
              <div key={item.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs space-y-1.5 relative">
                <div className="flex items-center justify-between pr-12">
                  <h5 className="font-bold text-xs text-gray-900">{item.name}</h5>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium">{item.description}</p>
                {item.details && (
                  <p className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100">
                    {item.details}
                  </p>
                )}

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => handleOpenWorldModal(item)}
                    className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteWorld(item.id)}
                    className="p-1 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Idea Bank Tab */}
      {activeTab === 'ideas' && (
        <div className="space-y-3">
          <button
            onClick={() => handleOpenIdeaModal()}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-semibold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.addIdea}</span>
          </button>

          <div className="space-y-2.5">
            {activeNovel.ideas.map((idea) => (
              <div
                key={idea.id}
                className={`p-3.5 rounded-2xl border shadow-2xs space-y-2 relative transition-all ${
                  idea.pinned ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between pr-16">
                  <h5 className="font-bold text-xs text-gray-900">{idea.title}</h5>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {idea.category}
                  </span>
                </div>

                <p className="text-xs text-gray-700 font-medium whitespace-pre-wrap">{idea.content}</p>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePinIdea(idea)}
                    className={`p-1 rounded-lg transition-colors ${
                      idea.pinned ? 'text-amber-500 bg-amber-100' : 'text-gray-300 hover:text-gray-600'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <button onClick={() => handleDeleteIdea(idea.id)} className="p-1 text-gray-300 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Volumes / Arcs Folder Accordion Tab */}
      {activeTab === 'volumes' && (
        <div className="space-y-3 text-xs">
          <button
            onClick={() => {
              setEditingVolume(null);
              setVolTitle('');
              setVolDesc('');
              setIsVolumeModalOpen(true);
            }}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-semibold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.addVolume}</span>
          </button>

          <div className="space-y-2.5">
            {activeNovel.volumes.map((vol) => {
              const isExpanded = !!expandedVolumeIds[vol.id];
              const volChapters = activeNovel.chapters.filter((c) => c.volumeId === vol.id);

              return (
                <div key={vol.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
                  <div
                    onClick={() =>
                      setExpandedVolumeIds((prev) => ({ ...prev, [vol.id]: !prev[vol.id] }))
                    }
                    className="p-3 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-900" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                      <h5 className="font-bold text-gray-900">{vol.title}</h5>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold bg-white px-2 py-0.5 rounded-full border border-gray-200">
                      {volChapters.length} chapters
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="p-3 space-y-2 border-t border-gray-100 bg-white">
                      {vol.description && <p className="text-gray-500 text-[11px] mb-2">{vol.description}</p>}
                      {volChapters.length === 0 ? (
                        <p className="text-gray-400 text-[11px] italic">No chapters assigned to this volume yet.</p>
                      ) : (
                        volChapters.map((chap) => (
                          <div key={chap.id} className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-gray-800">
                            <span className="font-semibold text-[11px]">{chap.title}</span>
                            <span className="text-[10px] text-gray-400">{chap.wordCount} words</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Character Modal */}
      <BottomSheet isOpen={isCharModalOpen} onClose={() => setIsCharModalOpen(false)} title={t.addCharacter}>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-600 font-bold mb-1">Name *</label>
            <input
              type="text"
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Role</label>
            <select
              value={charRole}
              onChange={(e) => setCharRole(e.target.value as any)}
              className="w-full p-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-gray-900/20 outline-none"
            >
              <option value="protagonist">{t.charRoleProtagonist}</option>
              <option value="antagonist">{t.charRoleAntagonist}</option>
              <option value="supporting">{t.charRoleSupporting}</option>
              <option value="minor">{t.charRoleMinor}</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Personality</label>
            <input
              type="text"
              value={charPersonality}
              onChange={(e) => setCharPersonality(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Goals</label>
            <input
              type="text"
              value={charGoals}
              onChange={(e) => setCharGoals(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Avatar Image URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={charAvatarUrl}
              onChange={(e) => setCharAvatarUrl(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900/20 outline-none"
            />
          </div>

          <button
            onClick={handleSaveChar}
            className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl text-xs hover:bg-black transition-colors mt-2"
          >
            {t.save}
          </button>
        </div>
      </BottomSheet>

      {/* World Modal */}
      <BottomSheet isOpen={isWorldModalOpen} onClose={() => setIsWorldModalOpen(false)} title={t.addWorldItem}>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-600 font-bold mb-1">Name *</label>
            <input
              type="text"
              value={worldName}
              onChange={(e) => setWorldName(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Category</label>
            <select
              value={worldCategory}
              onChange={(e) => setWorldCategory(e.target.value as any)}
              className="w-full p-2.5 border border-gray-200 rounded-xl bg-white outline-none"
            >
              <option value="location">Location</option>
              <option value="faction">Faction</option>
              <option value="magic_tech">Magic / Tech</option>
              <option value="item">Item</option>
              <option value="lore">Lore / History</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Description</label>
            <textarea
              value={worldDesc}
              onChange={(e) => setWorldDesc(e.target.value)}
              rows={3}
              className="w-full p-2.5 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <button
            onClick={handleSaveWorld}
            className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl text-xs hover:bg-black transition-colors mt-2"
          >
            {t.save}
          </button>
        </div>
      </BottomSheet>

      {/* Idea Modal */}
      <BottomSheet isOpen={isIdeaModalOpen} onClose={() => setIsIdeaModalOpen(false)} title={t.addIdea}>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-600 font-bold mb-1">Idea Title *</label>
            <input
              type="text"
              value={ideaTitle}
              onChange={(e) => setIdeaTitle(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Category</label>
            <select
              value={ideaCategory}
              onChange={(e) => setIdeaCategory(e.target.value as any)}
              className="w-full p-2.5 border border-gray-200 rounded-xl bg-white outline-none"
            >
              <option value="plot_twist">Plot Twist</option>
              <option value="character">Character Idea</option>
              <option value="world">World Lore</option>
              <option value="scene">Scene Note</option>
              <option value="dialogue">Dialogue</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Memo Content</label>
            <textarea
              value={ideaContent}
              onChange={(e) => setIdeaContent(e.target.value)}
              rows={4}
              className="w-full p-2.5 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <button
            onClick={handleSaveIdea}
            className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl text-xs hover:bg-black transition-colors mt-2"
          >
            {t.save}
          </button>
        </div>
      </BottomSheet>

      {/* Volume Modal */}
      <BottomSheet isOpen={isVolumeModalOpen} onClose={() => setIsVolumeModalOpen(false)} title={t.addVolume}>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-600 font-bold mb-1">Volume Title *</label>
            <input
              type="text"
              placeholder="e.g. Volume 1: Oakhaven Arc"
              value={volTitle}
              onChange={(e) => setVolTitle(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-1">Description</label>
            <textarea
              value={volDesc}
              onChange={(e) => setVolDesc(e.target.value)}
              rows={3}
              className="w-full p-2.5 border border-gray-200 rounded-xl outline-none"
            />
          </div>

          <button
            onClick={handleSaveVolume}
            className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl text-xs hover:bg-black transition-colors mt-2"
          >
            {t.save}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};
