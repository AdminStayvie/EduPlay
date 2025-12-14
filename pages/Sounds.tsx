import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { speak } from '../services/tts';
import { SoundItem } from '../types';

// Define Categories Configuration
const CATEGORIES = [
  { id: 'all', label: { en: 'All', id: 'Semua' }, emoji: '🌟' },
  { id: 'animal', label: { en: 'Animals', id: 'Hewan' }, emoji: '🐾' },
  { id: 'transport', label: { en: 'Vehicles', id: 'Kendaraan' }, emoji: '🚗' },
  { id: 'abc', label: { en: 'Learning', id: 'Belajar' }, emoji: '📚' },
];

// Using official Google Actions Sound Library (High Quality, Low Latency, Hosted by Google)
const SOUND_ITEMS: SoundItem[] = [
  // --- Animals ---
  { 
    id: '1', 
    emoji: '🐶', 
    category: 'animal', 
    label: { en: 'Dog', id: 'Anjing' }, 
    speechText: { en: 'Dog', id: 'Anjing' },
    audioUrl: 'https://actions.google.com/sounds/v1/animals/barking.ogg'
  },
  { 
    id: '2', 
    emoji: '🐱', 
    category: 'animal', 
    label: { en: 'Cat', id: 'Kucing' }, 
    speechText: { en: 'Cat', id: 'Kucing' },
    audioUrl: 'https://actions.google.com/sounds/v1/animals/kitten_meow.ogg'
  },
  { 
    id: '3', 
    emoji: '🦁', 
    category: 'animal', 
    label: { en: 'Lion', id: 'Singa' }, 
    speechText: { en: 'Lion', id: 'Singa' },
    audioUrl: 'https://actions.google.com/sounds/v1/animals/lion_roar.ogg'
  },
  { 
    id: '8', 
    emoji: '🐮', 
    category: 'animal', 
    label: { en: 'Cow', id: 'Sapi' }, 
    speechText: { en: 'Cow', id: 'Sapi' },
    audioUrl: 'https://actions.google.com/sounds/v1/animals/cattle_mooing.ogg'
  },
  { 
    id: '9', 
    emoji: '🦆', 
    category: 'animal', 
    label: { en: 'Duck', id: 'Bebek' }, 
    speechText: { en: 'Duck', id: 'Bebek' },
    audioUrl: 'https://actions.google.com/sounds/v1/animals/duck_quack.ogg'
  },
  { 
    id: '10', 
    emoji: '🐑', 
    category: 'animal', 
    label: { en: 'Sheep', id: 'Domba' }, 
    speechText: { en: 'Sheep', id: 'Domba' },
    audioUrl: 'https://actions.google.com/sounds/v1/animals/sheep_baa.ogg'
  },
  { 
    id: '11', 
    emoji: '🐴', 
    category: 'animal', 
    label: { en: 'Horse', id: 'Kuda' }, 
    speechText: { en: 'Horse', id: 'Kuda' },
    audioUrl: 'https://actions.google.com/sounds/v1/animals/horse_whinny.ogg'
  },

  // --- Transport ---
  { 
    id: '4', 
    emoji: '🚗', 
    category: 'transport', 
    label: { en: 'Car', id: 'Mobil' }, 
    speechText: { en: 'Car', id: 'Mobil' },
    audioUrl: 'https://actions.google.com/sounds/v1/transportation/car_horn.ogg'
  },
  { 
    id: '5', 
    emoji: '🚂', 
    category: 'transport', 
    label: { en: 'Train', id: 'Kereta' }, 
    speechText: { en: 'Train', id: 'Kereta' },
    audioUrl: 'https://actions.google.com/sounds/v1/transportation/steam_train_whistle.ogg'
  },

  // --- ABC / Learning (TTS only) ---
  { 
    id: '6', 
    emoji: '🍎', 
    category: 'abc', 
    label: { en: 'Apple', id: 'Apel' }, 
    speechText: { en: 'A is for Apple', id: 'A untuk Apel' }
  },
  { 
    id: '7', 
    emoji: '🍌', 
    category: 'abc', 
    label: { en: 'Banana', id: 'Pisang' }, 
    speechText: { en: 'B is for Banana', id: 'P untuk Pisang' }
  },
];

export const Sounds: React.FC = () => {
  const { language } = useContext(AppContext);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Cleanup audio when unmounting
  useEffect(() => {
    return () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.src = ""; 
        }
    };
  }, [currentAudio]);

  const handlePlay = (item: SoundItem) => {
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    setActiveId(item.id);
    const playTts = () => speak(item.speechText[language], language);

    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      setCurrentAudio(audio);
      audio.volume = 1.0;
      
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Audio started successfully
                
                // Safety: Stop after 3 seconds
                setTimeout(() => {
                    try {
                        if (!audio.paused) {
                            audio.pause();
                            audio.currentTime = 0;
                        }
                    } catch(e) { /* ignore */ }
                }, 3000);

                // Play name pronunciation shortly after sound starts (1.2s delay)
                setTimeout(() => {
                    playTts();
                }, 1200); 
            })
            .catch((e) => {
                console.warn("Audio play failed (format might not be supported on this device), falling back to TTS", e);
                // Fallback to TTS immediately if file fails (e.g. OGG issues on old Safari)
                playTts();
            });
      }
    } else {
      // No audio URL provided, just TTS
      playTts();
    }

    setTimeout(() => setActiveId(null), 2000);
  };

  const filteredItems = selectedCategory === 'all' 
    ? SOUND_ITEMS 
    : SOUND_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="h-full flex flex-col pt-20 pb-4 bg-soft">
      {/* Header & Categories */}
      <div className="px-4 mb-4">
        <h2 className="text-3xl font-black text-center text-primary mb-4 drop-shadow-sm">
          {language === 'en' ? 'Tap & Listen' : 'Sentuh & Dengar'}
        </h2>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center">
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full font-bold whitespace-nowrap border-2 transition-all
                        ${selectedCategory === cat.id 
                            ? 'bg-primary border-primary text-white shadow-md scale-105' 
                            : 'bg-white border-primary/20 text-gray-500 hover:bg-orange-50'}
                    `}
                >
                    <span>{cat.emoji}</span>
                    <span>{cat.label[language]}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {filteredItems.map((item) => (
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
        
        {filteredItems.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
                <p>No items found in this category.</p>
            </div>
        )}
      </div>
    </div>
  );
};