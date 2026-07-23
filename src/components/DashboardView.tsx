import React, { useState } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  Pin,
  Flame,
  LayoutGrid,
  List,
  ChevronRight,
  Edit2,
  Trash2,
  Check,
  BarChart2,
  Sparkles,
} from 'lucide-react';
import { Novel, AppSettings, LanguageCode, NovelStatus } from '../types';
import { translations } from '../i18n/translations';
import { BottomSheet } from './BottomSheet';
import { CoverUploaderModal } from './CoverUploaderModal';

interface DashboardViewProps {
  novels: Novel[];
  activeNovelId: string | null;
  settings: AppSettings;
  language: LanguageCode;
  onSelectNovel: (novelId: string) => void;
  onCreateNovel: (novel: Partial<Novel>) => void;
  onUpdateNovel: (novel: Novel) => void;
  onDeleteNovel: (novelId: string) => void;
  onNavigateToEditor: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  novels,
  activeNovelId,
  settings,
  language,
  onSelectNovel,
  onCreateNovel,
  onUpdateNovel,
  onDeleteNovel,
  onNavigateToEditor,
}) => {
  const t = translations[language] || translations.id;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | NovelStatus>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Novel Creation/Editing Modal state
  const [isNovelModalOpen, setIsNovelModalOpen] = useState(false);
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('Lunarica');
  const [formGenre, setFormGenre] = useState('Fantasy');
  const [formStatus, setFormStatus] = useState<NovelStatus>('ongoing');
  const [formCoverUrl, setFormCoverUrl] = useState<string | undefined>();
  const [formCoverPreset, setFormCoverPreset] = useState<string>('from-amber-500 via-purple-600 to-indigo-900');

  // Cover Uploader state
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  // Calculate stats
  const totalWords = novels.reduce(
    (acc, n) => acc + n.chapters.reduce((sum, c) => sum + c.wordCount, 0),
    0
  );
  const totalChapters = novels.reduce((acc, n) => acc + n.chapters.length, 0);
  const goalPercent = Math.min(
    100,
    Math.round((settings.todayWordsWritten / settings.dailyGoalWords) * 100)
  );

  // Filter novels
  const filteredNovels = novels.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || n.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort: Pinned first
  const sortedNovels = [...filteredNovels].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const handleOpenCreateModal = () => {
    setEditingNovel(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormAuthor('Lunarica');
    setFormGenre('Fantasy Romance');
    setFormStatus('ongoing');
    setFormCoverUrl(undefined);
    setFormCoverPreset('from-amber-500 via-purple-600 to-indigo-900');
    setIsNovelModalOpen(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, novel: Novel) => {
    e.stopPropagation();
    setEditingNovel(novel);
    setFormTitle(novel.title);
    setFormSubtitle(novel.subtitle || '');
    setFormAuthor(novel.author);
    setFormGenre(novel.genre);
    setFormStatus(novel.status);
    setFormCoverUrl(novel.coverUrl);
    setFormCoverPreset(novel.coverPreset || 'from-amber-500 via-purple-600 to-indigo-900');
    setIsNovelModalOpen(true);
  };

  const handleSaveNovelForm = () => {
    if (!formTitle.trim()) return;

    if (editingNovel) {
      onUpdateNovel({
        ...editingNovel,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        author: formAuthor.trim() || 'Lunarica',
        genre: formGenre.trim() || 'General',
        status: formStatus,
        coverUrl: formCoverUrl,
        coverPreset: formCoverPreset,
        updatedAt: Date.now(),
      });
    } else {
      onCreateNovel({
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        author: formAuthor.trim() || 'Lunarica',
        genre: formGenre.trim() || 'General',
        status: formStatus,
        coverUrl: formCoverUrl,
        coverPreset: formCoverPreset,
      });
    }

    setIsNovelModalOpen(false);
  };

  const handleTogglePin = (e: React.MouseEvent, novel: Novel) => {
    e.stopPropagation();
    onUpdateNovel({ ...novel, pinned: !novel.pinned });
  };

  return (
    <div className="p-5 space-y-6 pb-24 animate-fade-in bg-gray-50">
      {/* 1. Statistics Cards Scroll Row */}
      <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="min-w-[120px] bg-white p-4 rounded-2xl shadow-xs border border-gray-100 shrink-0">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.todayWords}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{settings.todayWordsWritten.toLocaleString()}</p>
        </div>

        <div className="min-w-[120px] bg-white p-4 rounded-2xl shadow-xs border border-gray-100 shrink-0">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.totalChapters}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalChapters}</p>
        </div>

        <div className="min-w-[125px] bg-white p-4 rounded-2xl shadow-xs border border-gray-100 shrink-0">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.dailyGoal}</p>
          <p className="text-xl font-bold text-orange-500 mt-1">{goalPercent}%</p>
        </div>

        <div className="min-w-[130px] bg-white p-4 rounded-2xl shadow-xs border border-gray-100 shrink-0">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.totalWords}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{totalWords.toLocaleString()}</p>
        </div>
      </div>

      {/* 2. Controls & Search Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>{t.myNovels}</span>
            <span className="text-[10px] font-bold text-gray-600 bg-gray-200/80 px-2 py-0.5 rounded-full">
              {novels.length}
            </span>
          </h3>

          <div className="flex items-center gap-2">
            {/* Grid / List View Toggle */}
            <div className="flex bg-gray-200/60 p-0.5 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-400'
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-400'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Create New Novel Button */}
            <button
              onClick={handleOpenCreateModal}
              className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t.createNewNovel}</span>
            </button>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {(['all', 'ongoing', 'completed', 'draft'] as const).map((st) => {
              const labelMap = {
                all: t.filterAll,
                ongoing: t.filterOngoing,
                completed: t.filterCompleted,
                draft: t.filterDraft,
              };
              const isSel = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-semibold transition-all cursor-pointer ${
                    isSel
                      ? 'bg-gray-900 text-white shadow-2xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {labelMap[st]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Novels Grid / List Display */}
      {sortedNovels.length === 0 ? (
        <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-2xl p-6 shadow-2xs">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-medium">{t.noNovelsFound}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4">
          {sortedNovels.map((novel) => {
            const isActive = novel.id === activeNovelId;
            const chapCount = novel.chapters.length;
            const wordCount = novel.chapters.reduce((acc, c) => acc + c.wordCount, 0);

            return (
              <div
                key={novel.id}
                onClick={() => {
                  onSelectNovel(novel.id);
                  onNavigateToEditor();
                }}
                className={`group relative rounded-2xl overflow-hidden bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col ${
                  isActive ? 'border-gray-900 ring-2 ring-gray-900/10' : 'border-gray-200/80'
                }`}
              >
                {/* Cover Banner */}
                <div className="aspect-[3/4] relative overflow-hidden bg-gray-200 mb-0">
                  {novel.coverUrl ? (
                    <img
                      src={novel.coverUrl}
                      alt={novel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        novel.coverPreset || 'from-amber-500 via-purple-600 to-indigo-900'
                      } p-3 flex flex-col justify-between`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/90 bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full w-max">
                        {novel.genre}
                      </span>
                      <p className="text-white font-bold text-xs line-clamp-2 leading-tight drop-shadow-sm">
                        {novel.title}
                      </p>
                    </div>
                  )}

                  {/* Gradient Overlay for Genre Tag */}
                  {novel.coverUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-2.5">
                      <span className="text-[9px] text-white/90 font-semibold tracking-wide">
                        {novel.genre}
                      </span>
                    </div>
                  )}

                  {/* Pin Button */}
                  <button
                    onClick={(e) => handleTogglePin(e, novel)}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                      novel.pinned
                        ? 'bg-amber-400 text-gray-900'
                        : 'bg-black/30 text-white/80 hover:bg-black/50 hover:text-white'
                    }`}
                  >
                    <Pin className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>

                {/* Card Info */}
                <div className="p-3 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 line-clamp-1 leading-snug">
                      {novel.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {novel.status === 'completed' ? 'Completed' : 'Drafting'} • {wordCount > 1000 ? `${Math.round(wordCount/1000)}k` : wordCount} words
                    </p>
                  </div>
                </div>

                {/* Quick Edit Overlay Trigger */}
                <button
                  onClick={(e) => handleOpenEditModal(e, novel)}
                  className="absolute bottom-2 right-2 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {/* New Novel Card Placeholder */}
          <div
            onClick={handleOpenCreateModal}
            className="group relative cursor-pointer"
          >
            <div className="aspect-[3/4] bg-white rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center transition-colors hover:border-gray-400">
              <div className="text-center p-4">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400 group-hover:text-gray-900 group-hover:bg-gray-100 transition-colors">
                  <Plus className="w-5 h-5 stroke-[2]" />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.createNewNovel}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-2.5">
          {sortedNovels.map((novel) => {
            const isActive = novel.id === activeNovelId;
            const chapCount = novel.chapters.length;
            const wordCount = novel.chapters.reduce((acc, c) => acc + c.wordCount, 0);

            return (
              <div
                key={novel.id}
                onClick={() => {
                  onSelectNovel(novel.id);
                  onNavigateToEditor();
                }}
                className={`p-3.5 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs hover:shadow-sm flex items-center gap-3.5 ${
                  isActive ? 'border-gray-900 ring-2 ring-gray-900/10' : 'border-gray-200/80'
                }`}
              >
                {/* Mini Cover */}
                <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-200 relative">
                  {novel.coverUrl ? (
                    <img src={novel.coverUrl} alt={novel.title} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        novel.coverPreset || 'from-amber-500 via-purple-600 to-indigo-900'
                      } flex items-center justify-center p-1 text-white text-[9px] font-bold text-center line-clamp-2`}
                    >
                      {novel.title}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-xs text-gray-900 truncate">{novel.title}</h4>
                    {novel.pinned && <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mb-1">
                    {novel.genre} • by {novel.author}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {chapCount} chapters • {wordCount.toLocaleString()} words
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleOpenEditModal(e, novel)}
                    className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Story Bible Overview Panel */}
      {novels.find((n) => n.id === activeNovelId) && (
        <section className="bg-white p-4 rounded-2xl shadow-2xs border border-gray-100 space-y-3">
          <h3 className="font-bold text-gray-800 text-xs tracking-tight">{t.tabStoryBible} Overview</h3>
          <div className="space-y-2">
            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-900">{t.tabCharacters}</p>
                <p className="text-[10px] text-gray-400">
                  {novels.find((n) => n.id === activeNovelId)?.characters.length || 0} Entries
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mr-3 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-900">{t.tabWorld}</p>
                <p className="text-[10px] text-gray-400">
                  {novels.find((n) => n.id === activeNovelId)?.worldItems.length || 0} World Items
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Bottom Sheet Modal: Create / Edit Novel */}
      <BottomSheet
        isOpen={isNovelModalOpen}
        onClose={() => setIsNovelModalOpen(false)}
        title={editingNovel ? t.edit : t.createNewNovel}
      >
        <div className="space-y-4">
          {/* Cover Selector Preview */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200">
            <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-200 shadow-2xs relative">
              {formCoverUrl ? (
                <img src={formCoverUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${formCoverPreset} flex items-center justify-center p-1 text-white text-[10px] font-bold text-center line-clamp-2`}
                >
                  {formTitle || t.novelTitle}
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900 mb-1">{t.coverImage}</p>
              <button
                type="button"
                onClick={() => setIsCoverModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-gray-700" />
                <span>Customize Cover</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">{t.novelTitle} *</label>
              <input
                type="text"
                placeholder="e.g. Lunar Descent"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-900/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">{t.novelAuthor}</label>
              <input
                type="text"
                placeholder="Lunarica"
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-900/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t.genreLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. Fantasy"
                  value={formGenre}
                  onChange={(e) => setFormGenre(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-900/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">{t.statusLabel}</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as NovelStatus)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-900/20 outline-none bg-white"
                >
                  <option value="ongoing">{t.filterOngoing}</option>
                  <option value="completed">{t.filterCompleted}</option>
                  <option value="draft">{t.filterDraft}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            {editingNovel && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this novel?')) {
                    onDeleteNovel(editingNovel.id);
                    setIsNovelModalOpen(false);
                  }
                }}
                className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsNovelModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>

              <button
                type="button"
                onClick={handleSaveNovelForm}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-xs hover:bg-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{t.save}</span>
              </button>
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* Cover Uploader Bottom Sheet */}
      <CoverUploaderModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        language={language}
        currentCoverUrl={formCoverUrl}
        currentPreset={formCoverPreset}
        onSelectCover={(url, preset) => {
          setFormCoverUrl(url);
          if (preset) setFormCoverPreset(preset);
        }}
      />
    </div>
  );

};
