import { createContext } from 'react';
import { AppContextType, AppRoute } from './types';

export const AppContext = createContext<AppContextType>({
  language: 'en',
  setLanguage: () => {},
  playTimeLeft: 1200,
  isTimeUp: false,
  resetTimer: () => {},
  navigate: () => {},
  currentRoute: AppRoute.HOME,
});
