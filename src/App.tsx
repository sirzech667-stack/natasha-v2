import React, { useState, useEffect } from 'react';
import { Novel, AppSettings, LanguageCode, Chapter } from './types';
import { loadSettings, saveSettings, loadNovels, saveNovels, resetAllStorage } from './utils/storageUtils';
import { isRTL, translations } from './i18n/translations';
import { DesktopBlocker } from './components/DesktopBlocker';
import { HeaderBar } from './components/HeaderBar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { EditorView } from './components/EditorView';
import { StoryBibleView } from './components/StoryBibleView';
import { SettingsView } from './components/SettingsView';
import { BottomSheet } from './components/BottomSheet';
import { Check, BookOpen, Feather } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [novels, setNovels] = useState<Novel[]>(loadNovels);
  const [isSimulatedMobile, setIsSimulatedMobile] = useState<boolean>(false);

  // Quick Bottom Sheets
  const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState<boolean>(false);
  const [isNovelPickerOpen, setIsNovelPickerOpen] = useState<boolean>(false);

  // Save settings on changes
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Save novels on changes
  useEffect(() => {
    saveNovels(novels);
  }, [novels]);

  // Handle RTL direction for Arabic or LTR for others
  const currentLanguage = settings.language;
  const rtl = isRTL(currentLanguage);

  const activeNovel = novels.find((n) => n.id === settings.activeNovelId) || novels[0] || null;

  const updateSettingsHandler = (newPartial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  // Novel CRUD
  const handleSelectNovel = (novelId: string) => {
    const target = novels.find((n) => n.id === novelId);
    if (target) {
      const firstChapId = target.chapters[0]?.id || null;
      updateSettingsHandler({
        activeNovelId: novelId,
        activeChapterId: firstChapId,
      });
    }
  };

  const handleCreateNovel = (partialNovel: Partial<Novel>) => {
    const newId = 'novel-' + Date.now();
    const newNovel: Novel = {
      id: newId,
      title: partialNovel.title || 'Novel Baru',
      subtitle: partialNovel.subtitle || '',
      author: partialNovel.author || 'Lunarica',
      genre: partialNovel.genre || 'Fantasy',
      tags: ['New'],
      status: partialNovel.status || 'ongoing',
      coverUrl: partialNovel.coverUrl,
      coverPreset: partialNovel.coverPreset || 'from-amber-500 via-purple-600 to-indigo-900',
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synopsis: {
        shortSynopsis: '',
        longSynopsis: '',
        hook: '',
        conflict: '',
        climax: '',
        resolution: '',
      },
      volumes: [],
      chapters: [
        {
          id: 'chap-' + Date.now(),
          order: 1,
          title: 'Bab 1',
          content: '',
          wordCount: 0,
          updatedAt: Date.now(),
          status: 'draft',
          history: [],
        },
      ],
      characters: [],
      worldItems: [],
      ideas: [],
    };

    setNovels((prev) => [newNovel, ...prev]);
    handleSelectNovel(newId);
  };

  const handleUpdateNovel = (updatedNovel: Novel) => {
    setNovels((prev) => prev.map((n) => (n.id === updatedNovel.id ? updatedNovel : n)));
  };

  const handleDeleteNovel = (novelId: string) => {
    setNovels((prev) => {
      const remaining = prev.filter((n) => n.id !== novelId);
      if (remaining.length > 0) {
        handleSelectNovel(remaining[0].id);
      } else {
        updateSettingsHandler({ activeNovelId: null, activeChapterId: null });
      }
      return remaining;
    });
  };

  // Chapter CRUD
  const handleUpdateChapter = (chapterId: string, title: string, content: string) => {
    if (!activeNovel) return;

    const words = content.trim() ? content.trim().split(/\s+/).length : 0;

    const updatedChapters = activeNovel.chapters.map((chap) => {
      if (chap.id === chapterId) {
        // Snapshot to history if changed significantly
        const history = [...chap.history];
        if (Math.abs(chap.wordCount - words) > 20) {
          history.unshift({
            id: 'ver-' + Date.now(),
            timestamp: Date.now(),
            content: chap.content,
            wordCount: chap.wordCount,
          });
          if (history.length > 10) history.pop(); // Keep max 10 snapshots
        }

        return {
          ...chap,
          title,
          content,
          wordCount: words,
          updatedAt: Date.now(),
          history,
        };
      }
      return chap;
    });

    handleUpdateNovel({
      ...activeNovel,
      chapters: updatedChapters,
      updatedAt: Date.now(),
    });
  };

  const handleCreateChapter = (novelId: string, title: string) => {
    const novel = novels.find((n) => n.id === novelId);
    if (!novel) return;

    const newChapId = 'chap-' + Date.now();
    const newChap: Chapter = {
      id: newChapId,
      order: novel.chapters.length + 1,
      title,
      content: '',
      wordCount: 0,
      updatedAt: Date.now(),
      status: 'draft',
      history: [],
    };

    handleUpdateNovel({
      ...novel,
      chapters: [...novel.chapters, newChap],
      updatedAt: Date.now(),
    });

    updateSettingsHandler({ activeChapterId: newChapId });
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (!activeNovel) return;
    const remaining = activeNovel.chapters.filter((c) => c.id !== chapterId);
    handleUpdateNovel({ ...activeNovel, chapters: remaining });
    if (remaining.length > 0) {
      updateSettingsHandler({ activeChapterId: remaining[0].id });
    }
  };

  const handleWordCountDelta = (delta: number) => {
    setSettings((prev) => ({
      ...prev,
      todayWordsWritten: prev.todayWordsWritten + delta,
    }));
  };

  const handleRestoreJSON = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.novels && Array.isArray(parsed.novels)) {
        setNovels(parsed.novels);
        if (parsed.settings) {
          setSettings((prev) => ({ ...prev, ...parsed.settings }));
        }
        alert('Data successfully restored!');
      } else {
        alert('Invalid JSON structure.');
      }
    } catch (e) {
      alert('Failed to parse JSON file.');
    }
  };

  const handleResetData = () => {
    const res = resetAllStorage();
    setSettings(res.settings);
    setNovels(res.novels);
  };

  const t = translations[currentLanguage] || translations.id;

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 bg-[#F3F4F6] font-sans flex items-center justify-center overflow-hidden select-none"
    >
      {/* Desktop Blocker Component */}
      <DesktopBlocker
        language={currentLanguage}
        onSimulateMobile={() => setIsSimulatedMobile(true)}
        isSimulatedMobile={isSimulatedMobile}
      />

      {/* Main Mobile App Viewport Container */}
      <main
        className={`relative w-full max-w-md h-full bg-white flex flex-col overflow-hidden shadow-2xl ${
          isSimulatedMobile
            ? 'w-[375px] h-[720px] max-h-[92vh] rounded-[3rem] border-[8px] border-gray-900 shadow-2xl my-auto'
            : 'md:w-[375px] md:h-[720px] md:max-h-[92vh] md:rounded-[3rem] md:border-[8px] md:border-gray-900'
        }`}
      >
        {/* Mobile Header Bar */}
        <HeaderBar
          activeNovel={activeNovel}
          language={currentLanguage}
          onOpenLanguagePicker={() => setIsLanguagePickerOpen(true)}
          onOpenNovelPicker={() => setIsNovelPickerOpen(true)}
        />

        {/* Viewport Content Tabs */}
        <div className="flex-1 overflow-y-auto">
          {settings.activeTab === 'dashboard' && (
            <DashboardView
              novels={novels}
              activeNovelId={settings.activeNovelId}
              settings={settings}
              language={currentLanguage}
              onSelectNovel={handleSelectNovel}
              onCreateNovel={handleCreateNovel}
              onUpdateNovel={handleUpdateNovel}
              onDeleteNovel={handleDeleteNovel}
              onNavigateToEditor={() => updateSettingsHandler({ activeTab: 'editor' })}
            />
          )}

          {settings.activeTab === 'editor' && (
            <EditorView
              activeNovel={activeNovel}
              activeChapterId={settings.activeChapterId}
              settings={settings}
              language={currentLanguage}
              onUpdateChapter={handleUpdateChapter}
              onCreateChapter={handleCreateChapter}
              onSelectChapter={(chapId) => updateSettingsHandler({ activeChapterId: chapId })}
              onDeleteChapter={handleDeleteChapter}
              onWordCountDelta={handleWordCountDelta}
            />
          )}

          {settings.activeTab === 'storybible' && (
            <StoryBibleView
              activeNovel={activeNovel}
              language={currentLanguage}
              onUpdateNovel={handleUpdateNovel}
            />
          )}

          {settings.activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              activeNovel={activeNovel}
              novels={novels}
              onUpdateSettings={updateSettingsHandler}
              onRestoreJSON={handleRestoreJSON}
              onResetData={handleResetData}
            />
          )}
        </div>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <BottomNav
          activeTab={settings.activeTab}
          onChangeTab={(tab) => updateSettingsHandler({ activeTab: tab })}
          language={currentLanguage}
        />

        {/* Language Picker Bottom Sheet Drawer */}
        <BottomSheet
          isOpen={isLanguagePickerOpen}
          onClose={() => setIsLanguagePickerOpen(false)}
          title={t.language}
        >
          <div className="space-y-2">
            {[
              { code: 'id' as const, native: 'Bahasa Indonesia', flag: '🇮🇩' },
              { code: 'en' as const, native: 'English', flag: '🇺🇸' },
              { code: 'ja' as const, native: '日本語', flag: '🇯🇵' },
              { code: 'es' as const, native: 'Español', flag: '🇪🇸' },
              { code: 'ko' as const, native: '한국어', flag: '🇰🇷' },
              { code: 'zh' as const, native: '中文', flag: '🇨🇳' },
              { code: 'ar' as const, native: 'العربية (RTL)', flag: '🇸🇦' },
              { code: 'tl' as const, native: 'Tagalog', flag: '🇵🇭' },
            ].map((lang) => {
              const isSel = settings.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    updateSettingsHandler({ language: lang.code });
                    setIsLanguagePickerOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-colors cursor-pointer ${
                    isSel ? 'border-gray-900 bg-gray-50 font-bold text-gray-900' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-xs">{lang.native}</span>
                  </div>
                  {isSel && <Check className="w-4 h-4 text-gray-900 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </BottomSheet>

        {/* Novel Switcher Bottom Sheet Drawer */}
        <BottomSheet
          isOpen={isNovelPickerOpen}
          onClose={() => setIsNovelPickerOpen(false)}
          title={t.myNovels}
        >
          <div className="space-y-2">
            {novels.map((novel) => {
              const isSel = novel.id === activeNovel?.id;
              return (
                <div
                  key={novel.id}
                  onClick={() => {
                    handleSelectNovel(novel.id);
                    setIsNovelPickerOpen(false);
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    isSel ? 'border-gray-900 bg-gray-50 font-bold text-gray-900' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-gray-800 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-snug">{novel.title}</p>
                      <p className="text-[10px] text-gray-500 font-normal">
                        by {novel.author} • {novel.chapters.length} chapters
                      </p>
                    </div>
                  </div>
                  {isSel && <Check className="w-4 h-4 text-gray-900 stroke-[3]" />}
                </div>
              );
            })}
          </div>
        </BottomSheet>
      </main>
    </div>
  );
}

