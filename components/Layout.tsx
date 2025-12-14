import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { HomeIcon } from './Icons';
import { AppRoute } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isTimeUp, currentRoute, navigate, language, setLanguage } = useContext(AppContext);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  if (isTimeUp && currentRoute !== AppRoute.SETTINGS) {
    return (
      <div className="fixed inset-0 z-50 bg-primary/95 flex flex-col items-center justify-center text-white p-8">
        <div className="text-6xl mb-8 animate-bounce">🌙</div>
        <h1 className="text-4xl font-black mb-4 font-sans text-center">
          {language === 'en' ? "Time's Up!" : "Waktunya Tidur!"}
        </h1>
        <p className="text-xl text-center mb-8">
          {language === 'en' ? "Great playing! See you tomorrow!" : "Hebat! Sampai jumpa besok ya!"}
        </p>
        <button
          onClick={() => navigate(AppRoute.SETTINGS)}
          className="bg-white/20 px-6 py-3 rounded-full text-sm font-bold backdrop-blur-sm"
        >
          {language === 'en' ? "Parents Only" : "Khusus Orang Tua"}
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-soft">
      {/* Top Bar for Subpages */}
      {currentRoute !== AppRoute.HOME && (
        <div className="absolute top-4 left-4 z-40">
            <button 
                onClick={() => navigate(AppRoute.HOME)}
                className="bg-white p-3 rounded-full shadow-lg border-2 border-primary text-primary hover:scale-105 transition-transform"
            >
                <HomeIcon className="w-8 h-8" />
            </button>
        </div>
      )}

      {/* Global Language Switcher */}
      <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={toggleLanguage}
            className="bg-white/90 backdrop-blur-md border-2 border-primary/30 shadow-lg px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="text-2xl" role="img" aria-label="flag">
                {language === 'en' ? '🇺🇸' : '🇮🇩'}
            </span>
            <span className="font-black text-primary text-sm">
                {language === 'en' ? 'EN' : 'ID'}
            </span>
          </button>
      </div>

      <main className="flex-1 w-full h-full relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};