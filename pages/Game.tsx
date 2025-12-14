import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../AppContext';
import { speak } from '../services/tts';
import { RefreshIcon } from '../components/Icons';

// Simple types for game items
interface GameItem {
  id: string;
  type: 'circle' | 'square' | 'triangle' | 'star';
  color: string;
  x: number;
  y: number;
  isMatched: boolean;
}

export const Game: React.FC = () => {
  const { language } = useContext(AppContext);
  const [items, setItems] = useState<GameItem[]>([]);
  const [targets, setTargets] = useState<GameItem[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Level
  const initLevel = () => {
    const types: GameItem['type'][] = ['circle', 'square', 'triangle', 'star'];
    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400'];
    
    // Create Targets (Shadows) - evenly spaced
    const newTargets: GameItem[] = types.map((t, i) => ({
      id: `target-${t}`,
      type: t,
      color: 'bg-gray-200',
      x: 20 + (i * 22), // Percentages
      y: 30,
      isMatched: false
    }));

    // Create Draggables - random positions at bottom
    const newItems: GameItem[] = types.map((t, i) => ({
      id: `item-${t}`,
      type: t,
      color: colors[i],
      x: 10 + Math.random() * 60,
      y: 60 + Math.random() * 20,
      isMatched: false
    }));

    setTargets(newTargets);
    setItems(newItems);
    setScore(0);
    setDraggedId(null);
  };

  useEffect(() => {
    initLevel();
  }, []);

  // Handlers
  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    const item = items.find(i => i.id === id);
    if (!item || item.isMatched) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggedId(id);
    setDragOffset({ x: 0, y: 0 }); 
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    setItems(prev => prev.map(item => {
      if (item.id === draggedId) {
        return { ...item, x: xPercent - 5, y: yPercent - 5 }; // -5 to center roughly (assuming 10% width)
      }
      return item;
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggedId) return;
    
    const item = items.find(i => i.id === draggedId);
    const target = targets.find(t => t.type === item?.type);
    
    if (item && target) {
      // Check distance (simple proximity check in percentage)
      const dist = Math.hypot(item.x - target.x, item.y - target.y);
      
      if (dist < 10) {
        // Matched!
        speak(language === 'en' ? 'Good job!' : 'Hebat!', language);
        setItems(prev => prev.map(i => i.id === draggedId ? { ...i, x: target.x, y: target.y, isMatched: true } : i));
        setScore(s => s + 1);
        if (score + 1 === 4) {
             setTimeout(() => speak(language === 'en' ? 'You won!' : 'Kamu menang!', language), 500);
        }
      }
    }
    
    setDraggedId(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Render Helper
  const getShapeClass = (type: string) => {
    switch(type) {
      case 'circle': return 'rounded-full';
      case 'square': return 'rounded-xl'; // Soft square
      case 'triangle': return 'clip-triangle'; // Needs CSS
      case 'star': return 'clip-star';
      default: return '';
    }
  };

  return (
    <div className="h-full w-full bg-blue-50 relative overflow-hidden touch-none" ref={containerRef} onPointerMove={handlePointerMove}>
      {/* Title */}
      <div className="absolute top-4 w-full text-center pt-16 pointer-events-none">
        <h2 className="text-2xl font-black text-primary">
            {language === 'en' ? 'Match the Shapes' : 'Cocokkan Bentuk'}
        </h2>
      </div>

      {/* Targets (Shadows) */}
      {targets.map(t => (
        <div
          key={t.id}
          className={`absolute w-[15vw] h-[15vw] max-w-[100px] max-h-[100px] ${t.color} ${getShapeClass(t.type)} border-4 border-dashed border-gray-400 opacity-50 transition-all`}
          style={{ left: `${t.x}%`, top: `${t.y}%` }}
        >
             {/* Simple visual fallback for triangle/star if CSS clip-path fails */}
             {t.type === 'triangle' && <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">▲</div>}
             {t.type === 'star' && <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">★</div>}
        </div>
      ))}

      {/* Draggables */}
      {items.map(item => (
        <div
          key={item.id}
          onPointerDown={(e) => handlePointerDown(e, item.id)}
          onPointerUp={handlePointerUp}
          className={`
            absolute w-[15vw] h-[15vw] max-w-[100px] max-h-[100px] 
            ${item.color} ${getShapeClass(item.type)} 
            shadow-xl flex items-center justify-center
            transition-transform ${draggedId === item.id ? 'scale-125 z-50' : 'z-10'}
            ${item.isMatched ? 'animate-bounce' : ''}
          `}
          style={{ 
            left: `${item.x}%`, 
            top: `${item.y}%`, 
            touchAction: 'none',
            cursor: 'grab'
          }}
        >
             {item.type === 'triangle' && <div className="text-white text-4xl">▲</div>}
             {item.type === 'star' && <div className="text-white text-4xl">★</div>}
        </div>
      ))}

      {score === 4 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-50 backdrop-blur-sm">
          <button 
            onClick={initLevel}
            className="bg-white p-6 rounded-full shadow-2xl animate-bounce-slow hover:scale-110 transition-transform"
          >
            <RefreshIcon className="w-16 h-16 text-primary" />
          </button>
        </div>
      )}
    </div>
  );
};