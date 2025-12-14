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

// Using stable Wikimedia Commons MP3s (transcoded from OGG/WAV)
const SOUND_ITEMS: SoundItem[] = [
  // --- Animals ---
  { 
    id: '1', 
    emoji: '🐶', 
    category: 'animal', 
    label: { en: 'Dog', id: 'Anjing' }, 
    speechText: { en: 'Dog', id: 'Anjing' },
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/58/Dog_bark.ogg/Dog_bark.ogg.mp3'
  },
  { 
    id: '2', 
    emoji: '🐱', 
    category: 'animal', 
    label: { en: 'Cat', id: 'Kucing' }, 
    speechText: { en: 'Cat', id: 'Kucing' },
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/b/b3/Cat_meow.ogg/Cat_meow.ogg.mp3'
  },
  { 
    id: '3', 
    emoji: '🦁', 
    category: 'animal', 
    label: { en: 'Lion', id: 'Singa' }, 
    speechText: { en: 'Lion', id: 'Singa' },
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/36/Lion_roar.ogg/Lion_roar.ogg.mp3'
  },
  { 
    id: '8', 
    emoji: '🐮', 
    category: 'animal', 
    label: { en: 'Cow', id: 'Sapi' }, 
    speechText: { en: 'Cow', id: 'Sapi' },
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/67/Cow_mooing.ogg/Cow_mooing.ogg.mp3'
  },
  { 
    id: '9', 
    emoji: '🦆', 
    category: 'animal', 
    label: { en: 'Duck', id: 'Bebek' }, 
    speechText: { en: 'Duck', id: 'Bebek' },
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7f/Duck_quack.ogg/Duck_quack.ogg.mp3'
  },
  { 
    id: '10', 
    emoji: '🐑', 
    category: 'animal', 
    label: { en: 'Sheep', id: 'Domba' }, 
    speechText: { en: 'Sheep', id: 'Domba' },
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/07/Sheep_bleating.ogg/Sheep_bleating.ogg.mp3'
  },
  { 
    id: '11', 
    emoji: '🐴', 
    category: 'animal', 
    label: { en: 'Horse', id: 'Kuda' }, 
    speechText: { en: 'Horse', id: 'Kuda' },
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/4b/Horse_neigh.ogg/Horse_neigh.ogg.mp3'
  },

  // --- Transport ---
  { 
    id: '4', 
    emoji: '🚗', 
    category: 'transport', 
    label: { en: 'Car', id: 'Mobil' }, 
    speechText: { en: 'Car', id: 'Mobil' },
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/53/Car_horn.ogg/Car_horn.ogg.mp3'
  },
  { 
    id: '5', 
    emoji: '🚂', 
    category: 'transport', 
    label: { en: 'Train', id: 'Kereta' }, 
    speechText: { en: 'Train', id: 'Kereta' },
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7a/Steam_train_whistle_02.ogg/Steam_train_whistle_02.ogg.mp3'
  },

  // --- ABC / Learning ---
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
            currentAudio.currentTime = 0;
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
      
      // Safety handler if the file fails to load entirely (404, bad format)
      audio.onerror = () => {
          console.warn(`Audio load failed for ${item.label.en}, fallback to TTS.`);
          playTts();
      };

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Auto-stop audio after 2 seconds to ensure it's not too long
                const maxDuration = 2000; 
                
                setTimeout(() => {
                    try {
                        if (!audio.paused) {
                            audio.pause();
                            audio.currentTime = 0;
                        }
                    } catch(e) {
                        // ignore
                    }
                }, maxDuration);

                // Play name pronunciation shortly after sound starts
                setTimeout(() => {
                    playTts();
                }, 1000); 
            })
            .catch((e) => {
                console.warn("Audio playback failed, fallback to TTS", e);
                playTts();
            });
      }
    } else {
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