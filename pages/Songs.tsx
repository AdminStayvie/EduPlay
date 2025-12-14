import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { MusicIcon } from '../components/Icons';

// Note: Using public domain or copyright free placeholder refs. 
// In a real app, these would be local MP3 files.
// For this demo, we simulate playback with a visualizer since we can't reliably load external MP3s without CORS issues in all environments.
const SONGS = [
    { id: '1', title: { en: 'Twinkle Twinkle', id: 'Bintang Kecil' }, color: 'bg-indigo-400' },
    { id: '2', title: { en: 'Happy Birthday', id: 'Selamat Ulang Tahun' }, color: 'bg-pink-400' },
    { id: '3', title: { en: 'Old MacDonald', id: 'Paman MacDonald' }, color: 'bg-green-400' },
];

export const Songs: React.FC = () => {
    const { language } = useContext(AppContext);
    const [isPlaying, setIsPlaying] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    // Simulation effect
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        setIsPlaying(null);
                        return 0;
                    }
                    return p + 1;
                });
            }, 100);
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="h-full pt-20 px-4">
            <h2 className="text-3xl font-black text-center text-primary mb-8">
                {language === 'en' ? 'Music Time' : 'Waktunya Musik'}
            </h2>

            <div className="space-y-4 max-w-md mx-auto">
                {SONGS.map(song => (
                    <div 
                        key={song.id} 
                        className={`
                            relative overflow-hidden rounded-2xl shadow-md p-6 
                            flex items-center justify-between cursor-pointer transition-transform
                            ${song.color} text-white
                            ${isPlaying === song.id ? 'scale-105 ring-4 ring-white/50' : 'hover:scale-102'}
                        `}
                        onClick={() => setIsPlaying(isPlaying === song.id ? null : song.id)}
                    >
                        {/* Progress Bar Background */}
                        {isPlaying === song.id && (
                            <div 
                                className="absolute left-0 top-0 bottom-0 bg-black/10 transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        )}

                        <div className="flex items-center gap-4 z-10">
                            <div className="bg-white/20 p-3 rounded-full">
                                <MusicIcon className={`w-6 h-6 ${isPlaying === song.id ? 'animate-spin' : ''}`} />
                            </div>
                            <span className="font-bold text-xl">{song.title[language]}</span>
                        </div>

                        <div className="z-10 text-2xl">
                            {isPlaying === song.id ? '⏸' : '▶'}
                        </div>
                    </div>
                ))}
            </div>
            
            <p className="text-center text-gray-400 mt-8 text-sm italic">
                {language === 'en' ? '(Simulated Audio for Demo)' : '(Audio Simulasi untuk Demo)'}
            </p>
        </div>
    );
};