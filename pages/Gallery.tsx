import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import { speak } from '../services/tts';
import { PhotoItem } from '../types';
import { RefreshIcon } from '../components/Icons';

const DEFAULT_PHOTOS: PhotoItem[] = [
    { 
        id: '1', 
        category: 'wild', 
        label: { en: 'Elephant', id: 'Gajah' }, 
        url: 'https://images.unsplash.com/photo-1557050543-4d5f4e641ae5?w=600&q=80' 
    },
    { 
        id: '2', 
        category: 'wild', 
        label: { en: 'Tiger', id: 'Harimau' }, 
        url: 'https://images.unsplash.com/photo-1508853712204-445777271196?w=600&q=80' 
    },
    { 
        id: '3', 
        category: 'pet', 
        label: { en: 'Rabbit', id: 'Kelinci' }, 
        url: 'https://images.unsplash.com/photo-1591382386627-def150d99786?w=600&q=80' 
    },
    { 
        id: '4', 
        category: 'pet', 
        label: { en: 'Cat', id: 'Kucing' }, 
        url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80' 
    },
    { 
        id: '5', 
        category: 'transport', 
        label: { en: 'Airplane', id: 'Pesawat' }, 
        url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80' 
    },
    { 
        id: '6', 
        category: 'transport', 
        label: { en: 'Boat', id: 'Perahu' }, 
        url: 'https://images.unsplash.com/photo-1544257697-36e655c65d63?w=600&q=80' 
    },
];

const GALLERY_CATS = [
  { id: 'all', label: { en: 'All', id: 'Semua' }, emoji: '🌟' },
  { id: 'animal', label: { en: 'Animals', id: 'Hewan' }, emoji: '🐾' },
  { id: 'transport', label: { en: 'Vehicles', id: 'Kendaraan' }, emoji: '🚗' },
  { id: 'custom', label: { en: 'My Photos', id: 'Foto Saya' }, emoji: '🎨' },
];

export const Gallery: React.FC = () => {
    const { language } = useContext(AppContext);
    const [photos, setPhotos] = useState<PhotoItem[]>(DEFAULT_PHOTOS);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

    const filteredPhotos = photos.filter(p => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'animal') return ['wild', 'pet', 'animal'].includes(p.category);
        return p.category === selectedCategory;
    });
    
    return (
        <div className="h-full flex flex-col pt-20 pb-4 bg-soft">
            {/* Header & Controls */}
            <div className="px-4 mb-4">
                <div className="flex justify-between items-center max-w-5xl mx-auto mb-4 px-2">
                    <h2 className="text-3xl font-black text-accent drop-shadow-sm">
                        {language === 'en' ? 'Photo Gallery' : 'Galeri Foto'}
                    </h2>
                    {photos.length > DEFAULT_PHOTOS.length && (
                        <button 
                            onClick={clearCustomPhotos}
                            className="text-red-500 text-sm font-bold flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                        >
                            <RefreshIcon className="w-4 h-4" />
                            {language === 'en' ? 'Reset' : 'Reset'}
                        </button>
                    )}
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center">
                    {GALLERY_CATS.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full font-bold whitespace-nowrap border-2 transition-all
                                ${selectedCategory === cat.id 
                                    ? 'bg-accent border-accent text-white shadow-md scale-105' 
                                    : 'bg-white border-accent/20 text-gray-500 hover:bg-blue-50'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {filteredPhotos.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => speak(item.label[language], language)}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 active:scale-95 cursor-pointer relative group border-b-4 border-gray-100"
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
                                    <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full shadow-sm">
                                        New
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredPhotos.length === 0 && (
                    <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
                        <span className="text-4xl mb-2">📷</span>
                        <p>{language === 'en' ? 'No photos in this category' : 'Tidak ada foto di kategori ini'}</p>
                    </div>
                )}

                <div className="h-20"></div> {/* Bottom spacer */}
            </div>
        </div>
    );
};