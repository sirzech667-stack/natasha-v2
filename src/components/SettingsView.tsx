import React, { useRef } from 'react';
import {
  Languages,
  FileDown,
  BookOpen,
  Download,
  Upload,
  RotateCcw,
  Sliders,
  Type,
  Check,
  Feather,
} from 'lucide-react';
import { AppSettings, LanguageCode, Novel } from '../types';
import { translations } from '../i18n/translations';
import { exportNovelToPDF, exportNovelToEPUB, exportNovelToTXT, exportJSONBackup } from '../utils/exportUtils';

interface SettingsViewProps {
  settings: AppSettings;
  activeNovel: Novel | null;
  novels: Novel[];
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onRestoreJSON: (jsonString: string) => void;
  onResetData: () => void;
}

const LANGUAGES_LIST: { code: LanguageCode; name: string; nativeName: string; flag: string }[] = [
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية (RTL)', flag: '🇸🇦' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  activeNovel,
  novels,
  onUpdateSettings,
  onRestoreJSON,
  onResetData,
}) => {
  const t = translations[settings.language] || translations.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onRestoreJSON(result);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 space-y-5 pb-24 bg-gray-50 animate-fade-in text-xs">
      {/* Brand Header Banner */}
      <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
          <Feather className="w-5 h-5 text-gray-200" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{t.appName}</h2>
          <p className="text-[10px] text-gray-400 font-medium">
            {t.byLunarica} • {t.subtitle}
          </p>
        </div>
      </div>

      {/* 1. i18n Language Picker */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <Languages className="w-4 h-4 text-gray-700" />
          <h3 className="font-bold text-gray-900 text-sm">{t.language}</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES_LIST.map((lang) => {
            const isSel = settings.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onUpdateSettings({ language: lang.code })}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  isSel
                    ? 'border-gray-900 bg-gray-50 font-bold text-gray-900'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{lang.flag}</span>
                  <div className="truncate">
                    <p className="text-xs truncate leading-tight">{lang.nativeName}</p>
                    <p className="text-[9px] text-gray-400 font-normal truncate">{lang.name}</p>
                  </div>
                </div>
                {isSel && <Check className="w-4 h-4 text-gray-900 stroke-[3] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Daily Goal Settings */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <Sliders className="w-4 h-4 text-gray-700" />
          <h3 className="font-bold text-gray-900 text-sm">{t.dailyGoalSetting}</h3>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            {[500, 1000, 1500, 2000, 3000].map((goal) => (
              <button
                key={goal}
                onClick={() => onUpdateSettings({ dailyGoalWords: goal })}
                className={`flex-1 py-1.5 rounded-xl border font-bold text-[11px] transition-colors ${
                  settings.dailyGoalWords === goal
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Document Export Engine (PDF, EPUB, TXT) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <FileDown className="w-4 h-4 text-gray-700" />
          <h3 className="font-bold text-gray-900 text-sm">{t.exportDocument}</h3>
        </div>

        {activeNovel ? (
          <div className="space-y-2">
            <p className="text-[11px] text-gray-500 font-medium">
              Exporting: <strong className="text-gray-900">{activeNovel.title}</strong> ({activeNovel.chapters.length} chapters)
            </p>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => exportNovelToPDF(activeNovel)}
                className="w-full py-2.5 px-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-400" />
                  <span>{t.exportPDF}</span>
                </div>
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => exportNovelToEPUB(activeNovel)}
                className="w-full py-2.5 px-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>{t.exportEPUB}</span>
                </div>
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => exportNovelToTXT(activeNovel)}
                className="w-full py-2.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold rounded-xl flex items-center justify-between transition-colors cursor-pointer border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-gray-500" />
                  <span>{t.exportTXT}</span>
                </div>
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-xs italic">{t.noNovelsFound}</p>
        )}
      </div>

      {/* 4. Full Data Backup & Restore */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <Upload className="w-4 h-4 text-gray-700" />
          <h3 className="font-bold text-gray-900 text-sm">{t.backupRestore}</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => exportJSONBackup(novels, settings)}
            className="py-2.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-700" />
            <span className="truncate">{t.exportJSONBackup}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-gray-700" />
            <span className="truncate">{t.importJSONRestore}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* 5. Reset All Local Data */}
      <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-rose-100 pb-2 text-rose-600">
          <RotateCcw className="w-4 h-4" />
          <h3 className="font-bold text-sm">{t.resetAllData}</h3>
        </div>

        <p className="text-gray-500 text-[11px]">{t.resetConfirm}</p>

        <button
          onClick={() => {
            if (confirm(t.resetConfirm)) {
              onResetData();
            }
          }}
          className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer text-xs"
        >
          {t.resetAllData}
        </button>
      </div>
    </div>
  );
};
