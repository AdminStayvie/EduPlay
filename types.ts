export type Language = 'en' | 'id';

export enum AppRoute {
  HOME = 'home',
  SOUNDS = 'sounds',
  GAME = 'game',
  DRAW = 'draw',
  GALLERY = 'gallery',
  SONGS = 'songs',
  SETTINGS = 'settings',
}

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  playTimeLeft: number; // in seconds
  isTimeUp: boolean;
  resetTimer: () => void;
  navigate: (route: AppRoute) => void;
  currentRoute: AppRoute;
}

export interface SoundItem {
  id: string;
  label: { en: string; id: string };
  emoji: string;
  category: 'animal' | 'number' | 'abc';
  speechText: { en: string; id: string };
  audioUrl?: string; // Optional URL for real sound effects
}

export interface PhotoItem {
  id: string;
  url: string;
  label: { en: string; id: string };
  category: string;
  isCustom?: boolean;
}