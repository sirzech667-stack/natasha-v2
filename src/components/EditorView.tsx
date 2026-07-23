import React, { useState, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  List,
  History,
  Maximize2,
  Minimize2,
  Plus,
  ChevronDown,
  Check,
  RotateCcw,
  BookOpen,
  Trash2,
  Clock,
  Sparkles,
  Minus,
} from 'lucide-react';
import { Novel, Chapter, AppSettings, LanguageCode, ChapterVersion } from '../types';
import { translations } from '../i18n/translations';
import { BottomSheet } from './BottomSheet';

interface EditorViewProps {
  activeNovel: Novel | null;
  activeChapterId: string | null;
  settings: AppSettings;
  language: LanguageCode;
  onUpdateChapter: (chapterId: string, title: string, content: string) => void;
  onCreateChapter: (novelId: string, title: string) => void;
  onSelectChapter: (chapterId: string) => void;
  onDeleteChapter: (chapterId: string) => void;
  onWordCountDelta: (delta: number) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  activeNovel,
  activeChapterId,
  settings,
  language,
  onUpdateChapter,
  onCreateChapter,
  onSelectChapter,
  onDeleteChapter,
  onWordCountDelta,
}) => {
  const t = translations[language] || translations.id;

  const currentChapter =
    activeNovel?.chapters.find((c) => c.id === activeChapterId) ||
    activeNovel?.chapters[0] ||
    null;

  const [chapterTitle, setChapterTitle] = useState(currentChapter?.title || '');
  const [content, setContent] = useState(currentChapter?.content || '');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isZenMode, setIsZenMode] = useState(false);

  // Bottom Sheet Drawers
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevWordCountRef = useRef<number>(currentChapter?.wordCount || 0);

  // Sync state when active chapter changes
  useEffect(() => {
    if (currentChapter) {
      setChapterTitle(currentChapter.title);
      setContent(currentChapter.content);
      prevWordCountRef.current = currentChapter.wordCount;
    }
  }, [currentChapter?.id]);

  // Real-time Auto-Save with debounced timer
  useEffect(() => {
    if (!currentChapter) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      onUpdateChapter(currentChapter.id, chapterTitle, content);

      // Track daily word count delta
      const words = countWords(content);
      const delta = words - prevWordCountRef.current;
      if (delta > 0) {
        onWordCountDelta(delta);
        prevWordCountRef.current = words;
      }

      setSaveStatus('saved');
    }, 800);

    return () => clearTimeout(timer);
  }, [chapterTitle, content]);

  function countWords(text: string): number {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  const currentWordCount = countWords(content);
  const charCount = content.length;
  const readTimeMinutes = Math.max(1, Math.ceil(currentWordCount / 200));

  // Quick formatting helpers for textarea selection
  const applyFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const handleCreateNewChapterSubmit = () => {
    if (!activeNovel || !newChapterTitle.trim()) return;
    onCreateChapter(activeNovel.id, newChapterTitle.trim());
    setNewChapterTitle('');
    setIsChapterDrawerOpen(false);
  };

  const handleRestoreSnapshot = (version: ChapterVersion) => {
    if (confirm(t.confirmRestore)) {
      setContent(version.content);
      setIsHistoryDrawerOpen(false);
    }
  };

  if (!activeNovel) {
    return (
      <div className="p-8 text-center text-slate-400 py-20">
        <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-xs font-semibold">{t.noNovelsFound}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${isZenMode ? 'fixed inset-0 z-50 p-4 bg-white' : 'p-4 pb-24'}`}>
      {/* 1. Editor Top Metrics & Chapter Selector Header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-3 mb-3 space-y-2 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          {/* Chapter Selector Dropdown Trigger */}
          <button
            onClick={() => setIsChapterDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200/80 rounded-xl text-gray-900 font-bold text-xs shadow-2xs hover:bg-gray-100 transition-colors truncate max-w-[200px] cursor-pointer"
          >
            <span className="truncate">{chapterTitle || t.selectChapter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* History Version Button */}
            <button
              onClick={() => setIsHistoryDrawerOpen(true)}
              className="p-1.5 rounded-xl bg-gray-50 border border-gray-200/80 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              title={t.history}
            >
              <History className="w-4 h-4" />
            </button>

            {/* Zen Mode Toggle */}
            <button
              onClick={() => setIsZenMode(!isZenMode)}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isZenMode
                  ? 'bg-gray-900 border-gray-900 text-white'
                  : 'bg-gray-50 border-gray-200/80 text-gray-600 hover:text-gray-900'
              }`}
              title={t.zenMode}
            >
              {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Word Metrics & Save Status Bar */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 pt-1 border-t border-gray-100 px-1">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-gray-900 font-bold">{currentWordCount}</strong> {t.words}
            </span>
            <span>
              <strong className="text-gray-900 font-bold">{charCount}</strong> {t.chars}
            </span>
            <span className="flex items-center gap-1 text-gray-400 font-normal">
              <Clock className="w-3 h-3" />
              {readTimeMinutes} {t.readTime}
            </span>
          </div>

          <span
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
              saveStatus === 'saved'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
            }`}
          >
            {saveStatus === 'saved' ? t.saved : t.saving}
          </span>
        </div>
      </div>

      {/* 2. Touch Formatting Toolbar */}
      <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 p-1 rounded-2xl mb-3 overflow-x-auto scrollbar-none shrink-0">
        <button
          onClick={() => applyFormatting('**', '**')}
          className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-bold border border-gray-200/60 shadow-2xs cursor-pointer text-xs flex items-center justify-center min-w-[36px]"
          title={t.formatBold}
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => applyFormatting('*', '*')}
          className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 italic border border-gray-200/60 shadow-2xs cursor-pointer text-xs flex items-center justify-center min-w-[36px]"
          title={t.formatItalic}
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          onClick={() => applyFormatting('# ')}
          className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-bold border border-gray-200/60 shadow-2xs cursor-pointer text-xs flex items-center justify-center min-w-[36px]"
          title={t.formatH1}
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          onClick={() => applyFormatting('## ')}
          className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-bold border border-gray-200/60 shadow-2xs cursor-pointer text-xs flex items-center justify-center min-w-[36px]"
          title={t.formatH2}
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => applyFormatting('> ')}
          className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/60 shadow-2xs cursor-pointer text-xs flex items-center justify-center min-w-[36px]"
          title={t.formatQuote}
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          onClick={() => applyFormatting('- ')}
          className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/60 shadow-2xs cursor-pointer text-xs flex items-center justify-center min-w-[36px]"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          onClick={() => applyFormatting('\n---\n')}
          className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/60 shadow-2xs cursor-pointer text-xs flex items-center justify-center min-w-[36px]"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Interactive Main Textarea Area */}
      <div className="flex-1 flex flex-col space-y-2 min-h-0 bg-white p-2 rounded-2xl border border-gray-100 shadow-2xs">
        <input
          type="text"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
          placeholder={t.chapterTitlePlaceholder}
          className="w-full text-base font-bold text-gray-900 placeholder-gray-300 border-b border-gray-100 px-2 py-1 focus:outline-none"
        />

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t.editorPlaceholder}
          style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineHeight }}
          className="w-full flex-1 resize-none border-none outline-none text-gray-800 placeholder-gray-300 font-sans leading-relaxed scrollbar-thin p-2"
        />
      </div>

      {/* Chapter Manager Drawer */}
      <BottomSheet
        isOpen={isChapterDrawerOpen}
        onClose={() => setIsChapterDrawerOpen(false)}
        title={t.selectChapter}
      >
        <div className="space-y-4">
          {/* Add New Chapter Field */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Chapter Title e.g. Bab 3..."
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-gray-900/20 outline-none"
            />
            <button
              onClick={handleCreateNewChapterSubmit}
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.newChapter}</span>
            </button>
          </div>

          {/* Chapter List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activeNovel.chapters.map((chap, idx) => {
              const isSel = chap.id === currentChapter?.id;
              return (
                <div
                  key={chap.id}
                  onClick={() => {
                    onSelectChapter(chap.id);
                    setIsChapterDrawerOpen(false);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSel
                      ? 'border-gray-900 bg-gray-50 font-bold text-gray-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-mono">#{idx + 1}</span>
                    <span className="text-xs truncate">{chap.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {chap.wordCount} {t.words}
                    </span>
                    {isSel && <Check className="w-4 h-4 text-gray-900 stroke-[3]" />}
                    {activeNovel.chapters.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete chapter?')) onDeleteChapter(chap.id);
                        }}
                        className="p-1 hover:bg-rose-100 text-gray-300 hover:text-rose-600 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BottomSheet>

      {/* Version History Drawer */}
      <BottomSheet
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        title={t.history}
      >
        <div className="space-y-3">
          {(!currentChapter?.history || currentChapter.history.length === 0) ? (
            <div className="text-center py-6 text-gray-400 text-xs">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <span>No snapshots recorded yet. Snapshots save automatically as you write!</span>
            </div>
          ) : (
            currentChapter.history.map((ver) => (
              <div
                key={ver.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-gray-500 font-medium text-[11px]">
                  <span>{new Date(ver.timestamp).toLocaleString()}</span>
                  <span>{ver.wordCount} words</span>
                </div>
                <p className="text-gray-700 text-xs line-clamp-3 bg-white p-2 rounded-xl border border-gray-200/60 italic font-mono">
                  {ver.content}
                </p>
                <button
                  onClick={() => handleRestoreSnapshot(ver)}
                  className="w-full py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.restoreVersion}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </BottomSheet>
    </div>
  );
};
