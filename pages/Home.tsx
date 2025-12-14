import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { AppRoute } from '../types';
import { SoundIcon, GameIcon, BrushIcon, MusicIcon, PhotoIcon, SettingsIcon } from '../components/Icons';

const MenuCard: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    color: string; 
    onClick: () => void 
}> = ({ title, icon, color, onClick }) => (
    <button 
        onClick={onClick}
        className={`
            ${color} w-full aspect-square rounded-3xl shadow-lg 
            flex flex-col items-center justify-center text-white
            transition-transform active:scale-95 hover:scale-105
        `}
    >
        <div className="bg-white/20 p-4 rounded-full mb-3 backdrop-blur-sm">
            {icon}
        </div>
        <span className="font-bold text-lg md:text-2xl tracking-wide">{title}</span>
    </button>
);

export const Home: React.FC = () => {
    const { language, navigate } = useContext(AppContext);

    return (
        <div className="h-full overflow-y-auto p-6 flex flex-col items-center justify-center bg-soft">
            <h1 className="text-5xl font-black text-primary mb-2 tracking-tight drop-shadow-sm animate-bounce-slow">
                EduPlay
            </h1>
            <p className="text-gray-400 font-bold mb-8">
                {language === 'en' ? 'Learn & Play' : 'Belajar & Bermain'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-3xl">
                <MenuCard 
                    title={language === 'en' ? 'Sounds' : 'Suara'}
                    icon={<SoundIcon className="w-8 h-8 md:w-12 md:h-12" />}
                    color="bg-orange-400"
                    onClick={() => navigate(AppRoute.SOUNDS)}
                />
                <MenuCard 
                    title={language === 'en' ? 'Games' : 'Main'}
                    icon={<GameIcon className="w-8 h-8 md:w-12 md:h-12" />}
                    color="bg-green-400"
                    onClick={() => navigate(AppRoute.GAME)}
                />
                <MenuCard 
                    title={language === 'en' ? 'Draw' : 'Gambar'}
                    icon={<BrushIcon className="w-8 h-8 md:w-12 md:h-12" />}
                    color="bg-blue-400"
                    onClick={() => navigate(AppRoute.DRAW)}
                />
                <MenuCard 
                    title={language === 'en' ? 'Songs' : 'Lagu'}
                    icon={<MusicIcon className="w-8 h-8 md:w-12 md:h-12" />}
                    color="bg-pink-400"
                    onClick={() => navigate(AppRoute.SONGS)}
                />
                <MenuCard 
                    title={language === 'en' ? 'Photos' : 'Foto'}
                    icon={<PhotoIcon className="w-8 h-8 md:w-12 md:h-12" />}
                    color="bg-purple-400"
                    onClick={() => navigate(AppRoute.GALLERY)}
                />
                <MenuCard 
                    title={language === 'en' ? 'Parents' : 'Ortu'}
                    icon={<SettingsIcon className="w-8 h-8 md:w-12 md:h-12" />}
                    color="bg-gray-400"
                    onClick={() => navigate(AppRoute.SETTINGS)}
                />
            </div>
        </div>
    );
};