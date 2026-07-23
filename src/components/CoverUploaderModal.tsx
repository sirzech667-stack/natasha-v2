import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface CoverUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  currentCoverUrl?: string;
  currentPreset?: string;
  onSelectCover: (coverUrl?: string, presetGradient?: string) => void;
}

const PRESET_GRADIENTS = [
  'from-amber-500 via-purple-600 to-indigo-900',
  'from-cyan-600 via-blue-700 to-slate-900',
  'from-rose-500 via-pink-600 to-purple-900',
  'from-emerald-500 via-teal-700 to-slate-900',
  'from-violet-600 via-purple-800 to-slate-950',
  'from-amber-600 via-orange-700 to-stone-900',
  'from-blue-600 via-indigo-800 to-slate-950',
  'from-neutral-800 via-stone-900 to-black',
];

export const CoverUploaderModal: React.FC<CoverUploaderModalProps> = ({
  isOpen,
  onClose,
  language,
  currentCoverUrl,
  currentPreset,
  onSelectCover,
}) => {
  const t = translations[language] || translations.id;
  const [tab, setTab] = useState<'preset' | 'url' | 'upload'>('preset');
  const [urlInput, setUrlInput] = useState<string>(currentCoverUrl || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSelectCover(reader.result as string, undefined);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onSelectCover(urlInput.trim(), undefined);
      onClose();
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={t.coverImage}>
      <div className="space-y-4">
        {/* Modal Tab Controls */}
        <div className="grid grid-cols-3 gap-1 bg-gray-200/60 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setTab('preset')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              tab === 'preset' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setTab('url')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              tab === 'url' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500'
            }`}
          >
            URL
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              tab === 'upload' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-500'
            }`}
          >
            Upload
          </button>
        </div>

        {/* Tab 1: Presets */}
        {tab === 'preset' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">{t.presetGradients}:</p>
            <div className="grid grid-cols-4 gap-2.5">
              {PRESET_GRADIENTS.map((gradient, idx) => {
                const isSelected = !currentCoverUrl && currentPreset === gradient;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectCover(undefined, gradient);
                      onClose();
                    }}
                    className={`h-24 rounded-2xl bg-gradient-to-br ${gradient} p-2 flex flex-col justify-end text-white relative shadow-2xs hover:scale-105 transition-transform cursor-pointer border ${
                      isSelected ? 'ring-2 ring-gray-900 ring-offset-2' : 'border-white/10'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-white text-gray-900 rounded-full p-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <span className="text-[10px] font-bold opacity-80">Preset {idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Direct URL */}
        {tab === 'url' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">{t.directUrl}:</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-gray-900/20 outline-none text-gray-900"
                />
              </div>
              <button
                onClick={handleApplyUrl}
                className="px-4 py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-xs hover:bg-black transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {urlInput && (
              <div className="mt-2 rounded-2xl overflow-hidden border border-gray-200 h-32 relative bg-gray-50 flex items-center justify-center">
                <img
                  src={urlInput}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Local File Upload */}
        {tab === 'upload' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">{t.uploadCover}:</p>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="p-3 bg-gray-100 rounded-2xl text-gray-700 mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-gray-700">Choose image from device gallery</span>
              <span className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
