'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Scene from '@/components/canvas/Scene';
import { Mask } from '@/components/canvas/Mask';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const OPERA_COLORS = { 
  cinnabar: '#ff461f', 
  ink: '#161823',      
  clamWhite: '#f0f0f4',
  rattanYellow: '#f2de76', 
  indigo: '#1661ab',   
  stoneGreen: '#1a6840', 
  blackPurple: '#4a1e2f', 
  mudGold: '#bfae58',  
  rouge: '#9d2933',    
  ochre: '#845a33',    
  crowCyan: '#424c50', 
  crabCyan: '#8fab86', 
  paleSilk: '#e0c891', 
  lotusPurple: '#a8849e', 
};

const getColorOptions = () => {
  return Object.entries(OPERA_COLORS).map(([name, color]) => ({
    name: name,
    value: color,
    category: getCategoryByColor(name)
  }));
};

const getCategoryByColor = (name: string) => {
  if (['cinnabar', 'ink', 'clamWhite', 'rattanYellow', 'indigo', 'stoneGreen', 'blackPurple', 'mudGold'].includes(name)) {
    return 'main';
  }
  return 'secondary';
};

// [修复] 把 MODELS 移到组件外面，变成静态常量
// 这样它就不会每次渲染都变了，ESLint 就开心了
const MODELS = [
  { name: '生角(标准)', path: '/source/models/mask.glb' },
  { name: '方块', path: '/source/models/square.glb' }, 
];

function EditorContent() {
  const [color, setColor] = useState(OPERA_COLORS.cinnabar);
  const [selectedCategory, setSelectedCategory] = useState('main');
  const [isPainting, setIsPainting] = useState(false);
  const [brushSize, setBrushSize] = useState(0.2);
  const [isEraser, setIsEraser] = useState(false);
  
  const [undoTrigger, setUndoTrigger] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const [exportTrigger, setExportTrigger] = useState(0);
  
  const [currentModel, setCurrentModel] = useState(MODELS[0].path);

  const [userId, setUserId] = useState('');

  const searchParams = useSearchParams();
  const referenceImage = searchParams.get('ref');
  const [isRefVisible, setIsRefVisible] = useState(true);
  
  const dragRef = useRef<HTMLDivElement>(null);
  const [refPosition, setRefPosition] = useState({ x: -999, y: 20 });
  const isDraggingRef = useRef(false); 
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    setRefPosition({ x: window.innerWidth - 280, y: 80 });
    
    let storedId = localStorage.getItem('opera_user_id');
    if (!storedId) {
      storedId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('opera_user_id', storedId);
    }
    setUserId(storedId);
  }, []);

  // [修复] 这里的依赖改成了空数组 []，因为 MODELS 现在是外部常量
  useEffect(() => {
    const savedModelPath = localStorage.getItem('opera_last_model_path');
    if (savedModelPath && MODELS.some(m => m.path === savedModelPath)) {
      setCurrentModel(savedModelPath);
    }
  }, []);

  const handleModelChange = (path: string) => {
    setCurrentModel(path);
    localStorage.setItem('opera_last_model_path', path);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      setRefPosition({
        x: e.clientX - dragOffsetRef.current.x,
        y: e.clientY - dragOffsetRef.current.y
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent) => {
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      isDraggingRef.current = true;
    }
  };

  const handleHistoryChange = useCallback((newCanUndo: boolean) => {
    setCanUndo(prev => (prev !== newCanUndo ? newCanUndo : prev));
  }, []);

  const handleUndo = () => { if (canUndo) setUndoTrigger(prev => prev + 1); };
  
  const handleReset = () => {
    if (confirm('确定要清空当前画作吗？操作不可恢复。')) {
      setResetTrigger(prev => prev + 1);
    }
  };

  const handleSaveClick = () => { setIsSaving(true); setSaveTrigger(prev => prev + 1); };
  const handleExportModel = () => { setExportTrigger(prev => prev + 1); };

  const handleSaveData = async (data: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = await fetch('/api/save-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '创作脸谱', imageUrl: data, userId: userId }),
      });
      if (response.ok) {
        if (confirm('保存成功！要去看看你的作品集吗？')) {
             window.location.href = '/my-works';
        }
      } 
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') setIsPainting(true);
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && canUndo) {
        setUndoTrigger(prev => prev + 1);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.key.toLowerCase() === 'r') setIsPainting(false); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [canUndo]);

  return (
    <div className="w-full h-screen flex bg-[#0c0c0c] text-[#e0e0e0] font-sans overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* 左侧 UI */}
      <div className="w-80 relative z-10 flex flex-col border-r border-white/10 bg-[#111]/80 backdrop-blur-md">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div><h1 className="text-xl font-serif font-bold text-white tracking-[0.2em]">工坊</h1><p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Workshop</p></div>
          <Link href="/" className="text-xs text-gray-500 hover:text-[#c23531] transition">← 返回</Link>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          <div className="mb-8">
            <p className="text-xs text-[#bfae58] uppercase tracking-widest font-bold mb-3">Base Model</p>
            <div className="grid grid-cols-2 gap-2">
              {MODELS.map((m) => (
                <button
                  key={m.name}
                  onClick={() => handleModelChange(m.path)}
                  className={`py-2 px-3 text-xs border rounded transition-all ${
                    currentModel === m.path
                      ? 'border-[#c23531] text-[#c23531] bg-[#c23531]/10'
                      : 'border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-end mb-4"><p className="text-xs text-[#bfae58] uppercase tracking-widest font-bold">Palette</p><div className="flex space-x-4 text-xs"><button onClick={() => setSelectedCategory('main')} className={`transition-colors pb-1 border-b ${selectedCategory === 'main' ? 'text-white border-[#c23531]' : 'text-gray-600 border-transparent hover:text-gray-400'}`}>主色</button><button onClick={() => setSelectedCategory('secondary')} className={`transition-colors pb-1 border-b ${selectedCategory === 'secondary' ? 'text-white border-[#c23531]' : 'text-gray-600 border-transparent hover:text-gray-400'}`}>辅助</button></div></div>
            <div className="grid grid-cols-4 gap-3">
              {getColorOptions().filter(option => option.category === selectedCategory).map((option) => (
                  <button key={option.value} className={`group relative w-12 h-12 rounded-full transition-all duration-300 ${color === option.value ? 'scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'hover:scale-105'}`} onClick={() => setColor(option.value)} title={option.name}>
                    <div className="w-full h-full rounded-full border border-white/10" style={{ backgroundColor: option.value }}></div>
                    {color === option.value && <div className="absolute -inset-1 rounded-full border border-[#bfae58]"></div>}
                  </button>
              ))}
            </div>
          </div>

          <div><div className="flex justify-between items-center mb-3"><p className="text-xs text-[#bfae58] uppercase tracking-widest font-bold">Brush Size</p><span className="text-xs text-gray-500 font-mono">{(brushSize * 100).toFixed(0)}</span></div><div className="relative h-8 flex items-center"><input type="range" min="0.1" max="0.5" step="0.01" value={brushSize} onChange={(e) => setBrushSize(parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#c23531] hover:accent-[#ff461f]"/></div></div>
          
          <div className="grid grid-cols-3 gap-2">
             <button onClick={() => setIsEraser(!isEraser)} className={`py-2 rounded border transition-all flex flex-col items-center justify-center gap-1 ${isEraser ? 'border-[#bfae58] text-[#bfae58] bg-[#bfae58]/10' : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}`} title="橡皮擦"><span className="text-lg">🧽</span></button>
            <button onClick={handleUndo} disabled={!canUndo} className={`py-2 rounded border transition-all flex flex-col items-center justify-center gap-1 ${canUndo ? 'border-white/30 text-white hover:bg-white/5' : 'border-white/5 text-gray-700 cursor-not-allowed'}`} title="撤回"><span className="text-lg">↩️</span></button>
            <button onClick={handleReset} className="py-2 rounded border border-white/10 text-red-400 hover:text-red-500 hover:border-red-500/30 transition-all flex flex-col items-center justify-center gap-1" title="重置/清空"><span className="text-lg">🗑️</span></button>
          </div>
        </div>

        {/* 底部保存区 */}
        <div className="bg-[#0c0c0c]">
           <div className="p-6 border-t border-white/10 space-y-3">
             <Link href="/gallery" className="flex items-center justify-center gap-2 text-xs text-[#bfae58] hover:text-white transition-colors border border-[#bfae58]/30 hover:border-[#bfae58] py-2 rounded dashed"><span>🔍</span> 去图库找灵感</Link>
             <button onClick={handleExportModel} className="w-full py-3 border border-[#bfae58]/50 text-[#bfae58] hover:bg-[#bfae58] hover:text-black transition-all text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2"><span>📦</span> 下载 3D 模型</button>
             <button onClick={handleSaveClick} disabled={isSaving} className={`w-full py-4 relative overflow-hidden group border ${isSaving ? 'border-gray-700 text-gray-500' : 'border-[#c23531] text-white'}`}>{!isSaving && <div className="absolute inset-0 bg-[#c23531] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>}<span className="relative z-10 flex items-center justify-center gap-2 font-serif tracking-[0.2em] font-bold">{isSaving ? 'SAVING...' : '保存作品 SAVE'}</span></button>
             <div className="mt-4 text-[10px] text-gray-600 text-center space-y-1 font-mono"><p>[R] Hold to Paint &nbsp;&nbsp; [Ctrl+Z] Undo</p></div>
           </div>
        </div>
      </div>

      {/* 右侧：3D 画布 */}
      <div className={`flex-1 relative ${isPainting ? 'cursor-crosshair' : 'cursor-grab'} bg-[radial-gradient(circle_at_center,_#2a2a2a_0%,_#050505_100%)]`}>
        <Scene isPainting={isPainting || isEraser}>
          <Mask 
            currentColor={color} isPainting={isPainting} brushSize={brushSize} isEraser={isEraser}
            undoTrigger={undoTrigger} onHistoryChange={handleHistoryChange}
            saveTrigger={saveTrigger} onSaveData={handleSaveData}
            exportModelTrigger={exportTrigger} modelPath={currentModel} resetTrigger={resetTrigger}
          />
        </Scene>

        {(isPainting || isEraser) && (
           <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-xs font-bold tracking-widest shadow-2xl backdrop-blur-md border border-white/10 transition-colors duration-300 flex items-center gap-2 ${isEraser ? 'bg-[#bfae58]/20 text-[#bfae58]' : 'bg-[#c23531]/20 text-[#c23531]'}`}>
             <span className={`w-2 h-2 rounded-full animate-pulse ${isEraser ? 'bg-[#bfae58]' : 'bg-[#c23531]'}`}></span>
             {isEraser ? 'ERASER MODE ACTIVE' : 'PAINTING MODE ACTIVE'}
           </div>
        )}

        {referenceImage && (
          <div ref={dragRef} style={{ left: refPosition.x, top: refPosition.y, visibility: refPosition.x < 0 ? 'hidden' : 'visible' }} className="fixed z-50 w-64 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col transition-shadow duration-200">
            <div onMouseDown={startDrag} className="bg-black/50 p-2 cursor-move flex items-center justify-between select-none border-b border-white/5 active:bg-[#c23531]/20 transition-colors"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#c23531]"></span><span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Reference</span></div><button onClick={(e) => { e.stopPropagation(); setIsRefVisible(!isRefVisible); }} className="text-gray-500 hover:text-white transition-colors px-2">{isRefVisible ? '−' : '＋'}</button></div>
            {isRefVisible && (
              <div className="relative w-full h-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={referenceImage} alt="Reference" onMouseDown={(e) => e.preventDefault()} className="w-full h-auto object-contain p-4 max-h-[400px]" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-[#0c0c0c] text-[#bfae58] font-mono">LOADING WORKSHOP...</div>}>
      <EditorContent />
    </Suspense>
  );
}