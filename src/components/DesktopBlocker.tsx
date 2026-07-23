import React, { useEffect, useState } from 'react';
import { Smartphone, Monitor, ChevronRight, Feather } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface DesktopBlockerProps {
  language: LanguageCode;
  onSimulateMobile: () => void;
  isSimulatedMobile: boolean;
}

export const DesktopBlocker: React.FC<DesktopBlockerProps> = ({
  language,
  onSimulateMobile,
  isSimulatedMobile,
}) => {
  const [isDesktopScreen, setIsDesktopScreen] = useState<boolean>(false);
  const t = translations[language] || translations.id;

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktopScreen(window.innerWidth > 768);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  if (!isDesktopScreen || isSimulatedMobile) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F3F4F6] text-gray-900 p-6 select-none animate-fade-in">
      <div className="max-w-md w-full bg-white border border-gray-200/80 rounded-[2.5rem] p-8 shadow-xl text-center flex flex-col items-center relative overflow-hidden">
        {/* Brand Icon Header */}
        <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl shadow-xs flex items-center justify-center mb-5">
          <Feather className="w-8 h-8 text-gray-800" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
          {t.appName}
        </h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">
          {t.byLunarica} • {t.subtitle}
        </p>

        {/* Restriction Alert Box */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-5 mb-6 text-gray-600 text-xs leading-relaxed text-left w-full">
          <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold text-sm">
            <Monitor className="w-4 h-4 text-gray-700" />
            <span>{t.desktopBlockerTitle}</span>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">
            {t.desktopBlockerMessage}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onSimulateMobile}
          className="w-full py-3.5 px-6 rounded-2xl bg-gray-900 hover:bg-black text-white font-semibold shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
        >
          <Smartphone className="w-4 h-4" />
          <span>{t.desktopSimulateBtn}</span>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>
      </div>
    </div>
  );
};

