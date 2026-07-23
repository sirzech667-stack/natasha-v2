import React from 'react';
import { BookOpen, Edit3, Sparkles, Settings } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface BottomNavProps {
  activeTab: 'dashboard' | 'editor' | 'storybible' | 'settings';
  onChangeTab: (tab: 'dashboard' | 'editor' | 'storybible' | 'settings') => void;
  language: LanguageCode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  language,
}) => {
  const t = translations[language] || translations.id;

  const navItems = [
    { id: 'dashboard' as const, label: t.navDashboard, icon: BookOpen },
    { id: 'editor' as const, label: t.navEditor, icon: Edit3 },
    { id: 'storybible' as const, label: t.navStoryBible, icon: Sparkles },
    { id: 'settings' as const, label: t.navSettings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 flex items-center justify-between z-40">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors cursor-pointer min-w-[56px] ${
              isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.25px]' : 'stroke-[1.75px]'}`} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};


