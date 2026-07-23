/**
 * Types for Natasha - Mobile Web Novel Studio by Lunarica
 */

export type LanguageCode = 'id' | 'en' | 'ja' | 'es' | 'ko' | 'zh' | 'ar' | 'tl';

export type NovelStatus = 'draft' | 'ongoing' | 'completed';

export interface ChapterVersion {
  id: string;
  timestamp: number;
  content: string;
  wordCount: number;
  note?: string;
}

export interface Chapter {
  id: string;
  volumeId?: string; // Arc / Volume ID
  order: number;
  title: string;
  content: string;
  wordCount: number;
  updatedAt: number;
  status: 'draft' | 'review' | 'final';
  history: ChapterVersion[];
}

export interface Volume {
  id: string;
  title: string;
  order: number;
  description?: string;
}

export interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  age?: string;
  gender?: string;
  personality: string;
  backstory: string;
  goals: string;
  avatarUrl?: string;
}

export interface WorldItem {
  id: string;
  name: string;
  category: 'location' | 'faction' | 'magic_tech' | 'item' | 'lore';
  description: string;
  details: string;
  imageUrl?: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  content: string;
  category: 'plot_twist' | 'character' | 'world' | 'scene' | 'dialogue';
  pinned: boolean;
  createdAt: number;
}

export interface SynopsisData {
  shortSynopsis: string;
  longSynopsis: string;
  hook: string;
  conflict: string;
  climax: string;
  resolution: string;
}

export interface Novel {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  genre: string;
  tags: string[];
  status: NovelStatus;
  coverUrl?: string;
  coverPreset?: string; // e.g. gradient class
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  
  // Story Bible Data
  synopsis: SynopsisData;
  volumes: Volume[];
  chapters: Chapter[];
  characters: Character[];
  worldItems: WorldItem[];
  ideas: IdeaItem[];
}

export interface AppSettings {
  language: LanguageCode;
  dailyGoalWords: number;
  todayWordsWritten: number;
  lastGoalResetDate: string; // YYYY-MM-DD
  activeNovelId: string | null;
  activeChapterId: string | null;
  activeTab: 'dashboard' | 'editor' | 'storybible' | 'settings';
  themeMode: 'light' | 'sepia' | 'dark'; // Editor theme
  fontSize: number; // in px, e.g. 16
  lineHeight: number; // e.g. 1.6
  editorFont: 'sans' | 'serif' | 'mono';
}

export interface TranslationDict {
  appName: string;
  byLunarica: string;
  subtitle: string;
  desktopBlockerTitle: string;
  desktopBlockerMessage: string;
  desktopSimulateBtn: string;
  navDashboard: string;
  navEditor: string;
  navStoryBible: string;
  navSettings: string;
  
  // Dashboard
  myNovels: string;
  searchPlaceholder: string;
  filterAll: string;
  filterOngoing: string;
  filterCompleted: string;
  filterDraft: string;
  createNewNovel: string;
  noNovelsFound: string;
  totalWords: string;
  totalChapters: string;
  dailyGoal: string;
  wordsWrittenToday: string;
  genreLabel: string;
  statusLabel: string;
  lastUpdated: string;

  // Novel Form & Cover
  novelTitle: string;
  novelAuthor: string;
  novelGenre: string;
  coverImage: string;
  uploadCover: string;
  directUrl: string;
  presetGradients: string;
  saveNovel: string;

  // Editor
  selectChapter: string;
  newChapter: string;
  words: string;
  chars: string;
  readTime: string;
  saved: string;
  saving: string;
  zenMode: string;
  exitZenMode: string;
  history: string;
  restoreVersion: string;
  confirmRestore: string;
  formatBold: string;
  formatItalic: string;
  formatH1: string;
  formatH2: string;
  formatQuote: string;
  chapterTitlePlaceholder: string;
  editorPlaceholder: string;

  // Story Bible
  tabSynopsis: string;
  tabCharacters: string;
  tabWorld: string;
  tabIdeas: string;
  tabVolumes: string;
  shortSynopsis: string;
  longSynopsis: string;
  hook: string;
  conflict: string;
  climax: string;
  resolution: string;
  addCharacter: string;
  charRoleProtagonist: string;
  charRoleAntagonist: string;
  charRoleSupporting: string;
  charRoleMinor: string;
  addWorldItem: string;
  addIdea: string;
  addVolume: string;
  category: string;

  // Settings & Export
  language: string;
  exportDocument: string;
  exportPDF: string;
  exportEPUB: string;
  exportTXT: string;
  backupRestore: string;
  exportJSONBackup: string;
  importJSONRestore: string;
  dailyGoalSetting: string;
  editorAppearance: string;
  resetAllData: string;
  resetConfirm: string;

  // General
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  close: string;
  success: string;
  actions: string;
}
