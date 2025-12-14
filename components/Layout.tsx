import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { HomeIcon } from './Icons';
import { AppRoute } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isTimeUp, currentRoute, navigate } = useContext(AppContext);

  if (isTimeUp && currentRoute !== AppRoute.SETTINGS) {
    return (
      <div className="fixed inset-0 z-50 bg-primary/95 flex flex-col items-center justify-center text-white p-8">
        <div className="text-6xl mb-8 animate-bounce">🌙</div>
        <h1 className="text-4xl font-black mb-4 font-sans text-center">
          Time's Up!
        </h1>
        <p className="text-xl text-center mb-8">
          Great playing! See you tomorrow!
        </p>
        <button
          onClick={() => navigate(AppRoute.SETTINGS)}
          className="bg-white/20 px-6 py-3 rounded-full text-sm font-bold backdrop-blur-sm"
        >
          Parents Only
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

      <main className="flex-1 w-full h-full relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};