import React, { useRef, useState, useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';
import { BrushIcon, RefreshIcon } from '../components/Icons';

const COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#FFC0CB'];

export const Drawing: React.FC = () => {
  const { language } = useContext(AppContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);

  const getPos = (e: MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDraw = (e: any) => {
    const { x, y } = getPos(e.nativeEvent);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      setIsDrawing(true);
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e.nativeEvent);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
         // Save content
         const tempCanvas = document.createElement('canvas');
         const tempCtx = tempCanvas.getContext('2d');
         tempCanvas.width = canvasRef.current.width;
         tempCanvas.height = canvasRef.current.height;
         tempCtx?.drawImage(canvasRef.current, 0, 0);

         // Resize
         canvasRef.current.width = window.innerWidth;
         canvasRef.current.height = window.innerHeight - 100; // Account for toolbar

         // Restore content
         const ctx = canvasRef.current.getContext('2d');
         ctx?.drawImage(tempCanvas, 0, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden">
      {/* Canvas Area */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
        className="touch-none flex-1 cursor-crosshair"
      />

      {/* Toolbar */}
      <div className="h-24 bg-gray-100 flex items-center justify-between px-4 shadow-inner z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-12 h-12 rounded-full border-4 transition-transform ${color === c ? 'scale-110 border-gray-400' : 'border-white'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <div className="flex gap-4 border-l pl-4 border-gray-300">
          <button 
             onClick={clearCanvas}
             className="flex flex-col items-center justify-center text-red-500 hover:scale-105"
          >
             <RefreshIcon className="w-8 h-8" />
             <span className="text-xs font-bold">{language === 'en' ? 'Clear' : 'Hapus'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};