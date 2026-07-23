import { Novel, AppSettings } from '../types';
import { INITIAL_NOVELS, INITIAL_SETTINGS } from '../data/initialData';

const SETTINGS_KEY = 'natasha_app_settings_v1';
const NOVELS_KEY = 'natasha_app_novels_v1';

export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Check if daily word goal reset is needed
      const todayStr = new Date().toISOString().split('T')[0];
      if (parsed.lastGoalResetDate !== todayStr) {
        parsed.todayWordsWritten = 0;
        parsed.lastGoalResetDate = todayStr;
      }
      return { ...INITIAL_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return INITIAL_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadNovels(): Novel[] {
  try {
    const data = localStorage.getItem(NOVELS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load novels:', e);
  }
  return INITIAL_NOVELS;
}

export function saveNovels(novels: Novel[]): void {
  try {
    localStorage.setItem(NOVELS_KEY, JSON.stringify(novels));
  } catch (e) {
    console.error('Failed to save novels:', e);
  }
}

export function resetAllStorage(): { settings: AppSettings; novels: Novel[] } {
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(NOVELS_KEY);
  saveSettings(INITIAL_SETTINGS);
  saveNovels(INITIAL_NOVELS);
  return { settings: INITIAL_SETTINGS, novels: INITIAL_NOVELS };
}
