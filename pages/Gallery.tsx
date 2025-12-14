import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import { speak } from '../services/tts';
import { PhotoItem } from '../types';
import { RefreshIcon } from '../components/Icons';

const DEFAULT_PHOTOS: PhotoItem[] = [
    { id: '1', category: 'wild', label: { en: 'Elephant', id: 'Gajah' }, url: 'https://picsum.photos/seed/elephant/400/300' },
    { id: '2', category: 'wild', label: { en: 'Tiger', id: 'Harimau' }, url: 'https://picsum.photos/seed/tiger/400/300' },
    { id: '3', category: 'pet', label: { en: 'Rabbit', id: 'Kelinci' }, url: 'https://picsum.photos/seed/rabbit/400/300' },
    { id: '4', category: 'pet', label: { en: 'Cat', id: 'Kucing' }, url: 'https://picsum.photos/seed/cat/400/300' },
    { id: '5', category: 'transport', label: { en: 'Airplane', id: 'Pesawat' }, url: 'https://picsum.photos/seed/plane/400/300' },
    { id: '6', category: 'transport', label: { en: 'Boat', id: 'Perahu' }, url: 'https://picsum.photos/seed/boat/400/300' },
];

export const Gallery: React.FC = () => {
    const { language } = useContext(AppContext);
    const [photos, setPhotos] = useState<PhotoItem[]>(DEFAULT_PHOTOS);

    useEffect(() => {
        const loadCustomPhotos = () => {
            const saved = localStorage.getItem('eduplay_custom_photos');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setPhotos([...DEFAULT_PHOTOS, ...parsed]);
                } catch (e) {
                    console.error("Failed to load custom photos", e);
                }
            }
        };
        loadCustomPhotos();
    }, []);

    const clearCustomPhotos = () => {
        if (confirm(language === 'en' ? 'Delete all custom photos?' : 'Hapus semua foto kustom?')) {
            localStorage.removeItem('eduplay_custom_photos');
            setPhotos(DEFAULT_PHOTOS);
        }
    };
    
    return (
        <div className="h-full overflow-y-auto pt-20 pb-8 px-4">
            <div className="flex justify-between items-center max-w-5xl mx-auto mb-6 px-2">
                <h2 className="text-3xl font-black text-accent">
                    {language === 'en' ? 'Photo Gallery' : 'Galeri Foto'}
                </h2>
                {photos.length > DEFAULT_PHOTOS.length && (
                    <button 
                        onClick={clearCustomPhotos}
                        className="text-red-500 text-sm font-bold flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm"
                    >
                        <RefreshIcon className="w-4 h-4" />
                        {language === 'en' ? 'Reset' : 'Reset'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {photos.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => speak(item.label[language], language)}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 active:scale-95 cursor-pointer relative group"
                    >
                        <img 
                            src={item.url} 
                            alt={item.label.en}
                            className="w-full h-48 object-cover bg-gray-200"
                            loading="lazy"
                        />
                        <div className="p-4 text-center">
                            <h3 className="text-2xl font-bold text-gray-700">{item.label[language]}</h3>
                            {item.isCustom && (
                                <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                                    New
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="h-20"></div> {/* Bottom spacer */}
        </div>
    );
};
