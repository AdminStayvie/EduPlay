import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../AppContext';
import { MusicIcon } from '../components/Icons';

const SONGS = [
    { 
        id: '1', 
        title: { en: 'Twinkle Twinkle', id: 'Bintang Kecil' }, 
        color: 'bg-indigo-400',
        // Wikimedia Commons (The Green Orbs)
        url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/82/Twinkle_Twinkle_Little_Star_%28The_Green_Orbs%29.ogg/Twinkle_Twinkle_Little_Star_%28The_Green_Orbs%29.ogg.mp3'
    },
    { 
        id: '2', 
        title: { en: 'Oh Susanna', id: 'Oh Susanna' }, 
        color: 'bg-pink-400',
        // Wikimedia Commons (Instrumental)
        url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/30/Oh_Susanna_%28instrumental%29.ogg/Oh_Susanna_%28instrumental%29.ogg.mp3'
    },
    { 
        id: '3', 
        title: { en: 'Jingle Bells', id: 'Lonceng Berbunyi' }, 
        color: 'bg-green-400',
        // Wikimedia Commons (Kevin MacLeod)
        url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/80/Jingle_Bells_%28Kevin_MacLeod%29_%28ISRC_USUAN1100187%29.oga/Jingle_Bells_%28Kevin_MacLeod%29_%28ISRC_USUAN1100187%29.oga.mp3'
    },
    {
        id: '4',
        title: { en: 'Daily Beetle', id: 'Kumbang Kecil' },
        color: 'bg-orange-400',
        // Wikimedia Commons (Kevin MacLeod)
        url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/46/Daily_Beetle_%28Kevin_MacLeod%29_%28ISRC_USUAN1500025%29.oga/Daily_Beetle_%28Kevin_MacLeod%29_%28ISRC_USUAN1500025%29.oga.mp3'
    }
];

export const Songs: React.FC = () => {
    const { language } = useContext(AppContext);
    const [currentSongId, setCurrentSongId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    
    // Ref to hold the Audio object
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleSongClick = (song: typeof SONGS[0]) => {
        // If clicking the currently active song
        if (currentSongId === song.id) {
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play().catch(e => console.error(e));
                setIsPlaying(true);
            }
            return;
        }

        // New song clicked
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        const audio = new Audio(song.url);
        audioRef.current = audio;
        setCurrentSongId(song.id);
        setProgress(0);
        setIsPlaying(true);

        audio.play().catch(error => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
            alert(language === 'en' ? "Could not play audio. Check connection." : "Gagal memutar audio. Periksa koneksi.");
        });

        audio.ontimeupdate = () => {
            if (audio.duration) {
                const p = (audio.currentTime / audio.duration) * 100;
                setProgress(p);
            }
        };

        audio.onended = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        audio.onerror = () => {
            setIsPlaying(false);
            setProgress(0);
            console.error("Audio error");
        };
    };

    return (
        <div className="h-full pt-20 px-4 bg-soft overflow-y-auto pb-8">
            <h2 className="text-3xl font-black text-center text-primary mb-8 drop-shadow-sm">
                {language === 'en' ? 'Music Time' : 'Waktunya Musik'}
            </h2>

            <div className="space-y-4 max-w-md mx-auto">
                {SONGS.map(song => {
                    const isActive = currentSongId === song.id;
                    return (
                        <div 
                            key={song.id} 
                            className={`
                                relative overflow-hidden rounded-2xl shadow-lg p-6 
                                flex items-center justify-between cursor-pointer transition-all duration-300
                                ${song.color} text-white
                                ${isActive ? 'scale-105 ring-4 ring-white/50 z-10' : 'hover:scale-102 opacity-90 hover:opacity-100'}
                            `}
                            onClick={() => handleSongClick(song)}
                        >
                            {/* Progress Bar Background */}
                            {isActive && (
                                <div 
                                    className="absolute left-0 top-0 bottom-0 bg-black/20 transition-all duration-200 ease-linear pointer-events-none"
                                    style={{ width: `${progress}%` }}
                                />
                            )}

                            <div className="flex items-center gap-4 z-10">
                                <div className={`bg-white/20 p-3 rounded-full transition-transform ${isActive && isPlaying ? 'animate-spin' : ''}`}>
                                    <MusicIcon className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl leading-tight">{song.title[language]}</span>
                                    {isActive && isPlaying && (
                                        <span className="text-xs text-white/80 animate-pulse">
                                            {language === 'en' ? 'Playing...' : 'Memutar...'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="z-10 text-3xl drop-shadow-md">
                                {isActive && isPlaying ? '⏸' : '▶'}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <p className="text-center text-gray-400 mt-8 text-sm italic">
                {language === 'en' ? 'Songs provided by Wikimedia Commons' : 'Lagu disediakan oleh Wikimedia Commons'}
            </p>
        </div>
    );
};