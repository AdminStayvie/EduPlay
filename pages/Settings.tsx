import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { AppRoute, PhotoItem } from '../types';
import { LockIcon, SettingsIcon, RefreshIcon, PhotoIcon } from '../components/Icons';
import { GoogleGenAI } from "@google/genai";

export const Settings: React.FC = () => {
    const { language, setLanguage, playTimeLeft, resetTimer, navigate } = useContext(AppContext);
    
    // Auth State
    const [isLocked, setIsLocked] = useState(true);
    const [mathAnswer, setMathAnswer] = useState('');
    const [challenge, setChallenge] = useState({ a: 0, b: 0 });
    const [error, setError] = useState(false);

    // Generator State
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [genError, setGenError] = useState('');
    const [imgLabel, setImgLabel] = useState('');

    useEffect(() => {
        setChallenge({
            a: Math.floor(Math.random() * 5) + 1,
            b: Math.floor(Math.random() * 5) + 1
        });
    }, []);

    const checkMath = () => {
        if (parseInt(mathAnswer) === challenge.a + challenge.b) {
            setIsLocked(false);
            setError(false);
        } else {
            setError(true);
            setMathAnswer('');
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setGenError('');
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Menggunakan Gemini 2.5 Flash Image (Standard/Free tier friendly)
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image', 
                contents: {
                    parts: [{ text: prompt }]
                },
                config: {
                    imageConfig: {
                        aspectRatio: "1:1"
                        // imageSize tidak didukung di model flash
                    }
                }
            });

            let foundImage = false;
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64String = part.inlineData.data;
                        setGeneratedImage(`data:image/png;base64,${base64String}`);
                        foundImage = true;
                        break;
                    }
                }
            }

            if (!foundImage) {
                setGenError('No image generated. Please try a different prompt.');
            }

        } catch (e: any) {
            console.error(e);
            setGenError('Generation failed. Please check your connection.');
        } finally {
            setIsGenerating(false);
        }
    };

    const saveToGallery = () => {
        if (!generatedImage || !imgLabel) return;

        const newItem: PhotoItem = {
            id: 'custom-' + Date.now(),
            category: 'custom',
            label: { en: imgLabel, id: imgLabel }, // Use same label for both for now
            url: generatedImage,
            isCustom: true
        };

        const existing = localStorage.getItem('eduplay_custom_photos');
        let items: PhotoItem[] = existing ? JSON.parse(existing) : [];
        
        // Limit storage to prevent quota issues (Base64 is heavy)
        if (items.length >= 5) {
            items.shift(); // Remove oldest
        }
        
        items.push(newItem);
        localStorage.setItem('eduplay_custom_photos', JSON.stringify(items));
        
        alert('Image saved to Gallery!');
        setGeneratedImage(null);
        setPrompt('');
        setImgLabel('');
    };

    if (isLocked) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-primary/10">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center">
                    <LockIcon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Parental Gate</h2>
                    <p className="mb-6 text-gray-500">Ask your parents for help!</p>
                    
                    <div className="text-3xl font-black mb-6">
                        {challenge.a} + {challenge.b} = ?
                    </div>

                    <div className="flex gap-2 justify-center mb-4">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <button
                                key={num}
                                className={`
                                    hidden md:block w-10 h-10 rounded-full font-bold
                                    ${num === parseInt(mathAnswer) ? 'bg-primary text-white' : 'bg-gray-100'}
                                `}
                                onClick={() => setMathAnswer(num.toString())}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    {/* Simple input for mobile fallbacks if grid is too small */}
                    <input 
                        type="number" 
                        value={mathAnswer}
                        onChange={(e) => setMathAnswer(e.target.value)}
                        className="border-2 border-gray-300 rounded-lg p-2 w-full text-center text-xl mb-4"
                        placeholder="Answer"
                    />

                    <button 
                        onClick={checkMath}
                        className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors"
                    >
                        Unlock
                    </button>
                    {error && <p className="text-red-500 mt-2 font-bold">Try again!</p>}
                    
                    <button 
                        onClick={() => navigate(AppRoute.HOME)}
                        className="mt-4 text-gray-400 underline"
                    >
                        Back to Kids Mode
                    </button>
                </div>
            </div>
        );
    }

    // Unlocked Settings
    return (
        <div className="h-full pt-20 px-6 max-w-2xl mx-auto overflow-y-auto pb-12">
            <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
                <SettingsIcon className="w-8 h-8" />
                Settings
            </h2>

            {/* Language */}
            <section className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Language / Bahasa</h3>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setLanguage('en')}
                        className={`flex-1 py-3 rounded-xl font-bold border-2 ${language === 'en' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-400'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setLanguage('id')}
                        className={`flex-1 py-3 rounded-xl font-bold border-2 ${language === 'id' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-400'}`}
                    >
                        Indonesia
                    </button>
                </div>
            </section>

            {/* Timer */}
            <section className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Daily Time Limit</h3>
                <div className="text-4xl font-black text-center mb-4 text-accent">
                    {Math.floor(playTimeLeft / 60)}m {playTimeLeft % 60}s
                </div>
                <p className="text-center text-gray-500 text-sm mb-4">Remaining for today</p>
                <button 
                    onClick={resetTimer}
                    className="w-full bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                    <RefreshIcon className="w-5 h-5" />
                    Reset Timer (20 mins)
                </button>
            </section>

            {/* Gemini Image Generator */}
            <section className="bg-white p-6 rounded-2xl shadow-sm mb-6 border-2 border-indigo-100">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                        <PhotoIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Card Generator</h3>
                        <p className="text-xs text-gray-500">Powered by Gemini Flash Image</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Image Prompt</label>
                        <input 
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A cute baby dinosaur eating ice cream"
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                    </div>
                    
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        className={`
                            w-full py-3 rounded-xl font-bold text-white transition-all
                            ${isGenerating || !prompt ? 'bg-gray-300' : 'bg-indigo-500 hover:bg-indigo-600'}
                        `}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Image'}
                    </button>

                    {genError && (
                        <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{genError}</p>
                    )}

                    {generatedImage && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <img src={generatedImage} alt="Generated" className="w-full rounded-lg shadow-sm mb-4" />
                            
                            <label className="block text-sm font-bold text-gray-600 mb-1">Name (for sound)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={imgLabel}
                                    onChange={(e) => setImgLabel(e.target.value)}
                                    placeholder="e.g., Dinosaur"
                                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl"
                                />
                                <button 
                                    onClick={saveToGallery}
                                    disabled={!imgLabel}
                                    className="bg-green-500 text-white px-6 rounded-xl font-bold disabled:opacity-50"
                                >
                                    Save
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-center">Saved images appear in the Gallery (Max 5).</p>
                        </div>
                    )}
                </div>
            </section>

            <button 
                onClick={() => navigate(AppRoute.HOME)}
                className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl mt-8"
            >
                Lock & Exit to App
            </button>
        </div>
    );
};