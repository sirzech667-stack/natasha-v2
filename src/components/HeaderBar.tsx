import React from 'react';
import { Languages, BookOpen } from 'lucide-react';
import { Novel, LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface HeaderBarProps {
  activeNovel: Novel | null;
  language: LanguageCode;
  onOpenLanguagePicker: () => void;
  onOpenNovelPicker: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeNovel,
  language,
  onOpenLanguagePicker,
  onOpenNovelPicker,
}) => {
  const t = translations[language] || translations.id;

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-2xs">
      {/* Brand Identity */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none mb-0.5">
          {t.appName}
        </h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
          BY LUNARICA
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Active Novel Quick Switcher Badge */}
        {activeNovel && (
          <button
            onClick={onOpenNovelPicker}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200/80 text-gray-700 hover:bg-gray-100 transition-colors text-xs font-semibold cursor-pointer max-w-[140px] truncate"
            title={activeNovel.title}
          >
            <BookOpen className="w-3.5 h-3.5 text-gray-600 shrink-0" />
            <span className="truncate">{activeNovel.title}</span>
          </button>
        )}

        {/* Language Picker Quick Icon */}
        <button
          onClick={onOpenLanguagePicker}
          className="p-2 hover:bg-gray-50 rounded-full border border-gray-100 text-gray-600 transition-colors cursor-pointer"
          aria-label={t.language}
        >
          <Languages className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

