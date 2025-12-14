import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import { speak } from '../services/tts';
import { SoundItem } from '../types';

// Menggunakan link audio publik yang stabil (Google Animal Sounds & Actions Library)
const SOUND_ITEMS: SoundItem[] = [
  { 
    id: '1', 
    emoji: '🐶', 
    category: 'animal', 
    label: { en: 'Dog', id: 'Anjing' }, 
    speechText: { en: 'Dog', id: 'Anjing' },
    audioUrl: 'https://www.google.com/logos/fnbx/animal_sounds/dog.mp3' 
  },
  { 
    id: '2', 
    emoji: '🐱', 
    category: 'animal', 
    label: { en: 'Cat', id: 'Kucing' }, 
    speechText: { en: 'Cat', id: 'Kucing' },
    audioUrl: 'https://www.google.com/logos/fnbx/animal_sounds/cat.mp3'
  },
  { 
    id: '3', 
    emoji: '🦁', 
    category: 'animal', 
    label: { en: 'Lion', id: 'Singa' }, 
    speechText: { en: 'Lion', id: 'Singa' },
    audioUrl: 'https://www.google.com/logos/fnbx/animal_sounds/lion.mp3'
  },
  { 
    id: '4', 
    emoji: '🚗', 
    category: 'number', 
    label: { en: 'Car', id: 'Mobil' }, 
    speechText: { en: 'Car', id: 'Mobil' },
    audioUrl: 'https://actions.google.com/sounds/v1/transportation/car_horn.ogg'
  },
  { 
    id: '5', 
    emoji: '🚂', 
    category: 'number', 
    label: { en: 'Train', id: 'Kereta' }, 
    speechText: { en: 'Train', id: 'Kereta' },
    audioUrl: 'https://actions.google.com/sounds/v1/transportation/steam_train_whistle.ogg'
  },
  { 
    id: '6', 
    emoji: '🍎', 
    category: 'abc', 
    label: { en: 'Apple', id: 'Apel' }, 
    speechText: { en: 'A is for Apple', id: 'A untuk Apel' }
    // No audioUrl for alphabet, just TTS
  },
  { 
    id: '7', 
    emoji: '🍌', 
    category: 'abc', 
    label: { en: 'Banana', id: 'Pisang' }, 
    speechText: { en: 'B is for Banana', id: 'P untuk Pisang' }
  },
  { 
    id: '8', 
    emoji: '🐮', 
    category: 'animal', 
    label: { en: 'Cow', id: 'Sapi' }, 
    speechText: { en: 'Cow', id: 'Sapi' },
    audioUrl: 'https://www.google.com/logos/fnbx/animal_sounds/cow.mp3'
  },
];

export const Sounds: React.FC = () => {
  const { language } = useContext(AppContext);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handlePlay = (item: SoundItem) => {
    setActiveId(item.id);

    const playTts = () => speak(item.speechText[language], language);

    // 1. Play Real Sound (if available)
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.volume = 1.0;
      
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Audio successfully started
                // 2. Play TTS (Name) after a short delay so the sound is heard first
                setTimeout(() => {
                    playTts();
                }, 1500); 
            })
            .catch((e) => {
                // Fallback: If audio fails (404, format not supported, etc), play TTS immediately
                console.warn("Audio file playback failed, falling back to TTS", e);
                playTts();
            });
      }
    } else {
      // If no real sound configured, just speak immediately
      playTts();
    }

    // Reset visual state
    setTimeout(() => setActiveId(null), 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-4 pt-20 pb-8">
      <h2 className="text-3xl font-black text-center text-primary mb-6 drop-shadow-sm">
        {language === 'en' ? 'Tap & Listen' : 'Sentuh & Dengar'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {SOUND_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePlay(item)}
            className={`
              aspect-square rounded-3xl flex flex-col items-center justify-center shadow-lg transition-all transform
              bg-white border-b-8 border-r-4
              ${activeId === item.id ? 'scale-95 border-b-0 border-r-0 translate-y-2 bg-yellow-50' : 'hover:-translate-y-1 border-primary/20'}
            `}
          >
            <span className="text-6xl mb-2 filter drop-shadow-sm">{item.emoji}</span>
            <span className="text-xl font-bold text-gray-600">
              {item.label[language]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
