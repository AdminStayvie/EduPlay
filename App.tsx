import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Sounds } from './pages/Sounds';
import { Game } from './pages/Game';
import { Drawing } from './pages/Drawing';
import { Gallery } from './pages/Gallery';
import { Songs } from './pages/Songs';
import { Settings } from './pages/Settings';
import { AppRoute, Language } from './types';
import { AppContext } from './AppContext';

const DEFAULT_TIME = 20 * 60; // 20 minutes

const App: React.FC = () => {
  // --- State ---
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('eduplay_lang') as Language) || 'en';
  });

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);
  
  const [playTimeLeft, setPlayTimeLeft] = useState<number>(() => {
    const saved = localStorage.getItem('eduplay_time');
    return saved ? parseInt(saved) : DEFAULT_TIME;
  });

  // --- Effects ---
  
  // Persist Language
  useEffect(() => {
    localStorage.setItem('eduplay_lang', language);
  }, [language]);

  // Timer Logic
  useEffect(() => {
    if (playTimeLeft <= 0) return;

    // Only count down if not in settings
    if (currentRoute === AppRoute.SETTINGS) return;

    const timer = setInterval(() => {
      setPlayTimeLeft((prev) => {
        const newVal = prev - 1;
        localStorage.setItem('eduplay_time', newVal.toString());
        return newVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playTimeLeft, currentRoute]);

  // --- Actions ---
  const resetTimer = () => {
    setPlayTimeLeft(DEFAULT_TIME);
    localStorage.setItem('eduplay_time', DEFAULT_TIME.toString());
  };

  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
  };

  // --- Render Page Helper ---
  const renderPage = () => {
    switch (currentRoute) {
      case AppRoute.HOME: return <Home />;
      case AppRoute.SOUNDS: return <Sounds />;
      case AppRoute.GAME: return <Game />;
      case AppRoute.DRAW: return <Drawing />;
      case AppRoute.GALLERY: return <Gallery />;
      case AppRoute.SONGS: return <Songs />;
      case AppRoute.SETTINGS: return <Settings />;
      default: return <Home />;
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        playTimeLeft,
        isTimeUp: playTimeLeft <= 0,
        resetTimer,
        navigate,
        currentRoute,
      }}
    >
      <Layout>
        {renderPage()}
      </Layout>
    </AppContext.Provider>
  );
};

export default App;