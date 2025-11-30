'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation'; // [新增]

interface Work {
  id: string;
  title: string | null;
  imageUrl: string;
  category: string;
  description: string | null;
  createdAt: Date;
}

export default function GalleryGrid({ works }: { works: Work[] }) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  
  const titleRef = useRef<HTMLDivElement>(null);

  const CATEGORIES = ['全部', '京剧', '豫剧', '昆曲', '川剧'];

  const filteredWorks = activeCategory === '全部' 
    ? works 
    : works.filter(w => w.category === activeCategory);

  const router = useRouter(); // [新增]
  // [新增] 处理“以此为模板”点击
  const handleUseTemplate = (imageUrl: string) => {
    // 跳转到 editor，并通过 URL 参数传递图片地址
    // 使用 encodeURIComponent 确保 URL 安全
    router.push(`/editor?ref=${encodeURIComponent(imageUrl)}`);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    
    setTimeout(() => {
      if (titleRef.current) {
        const elementRect = titleRef.current.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.scrollY;
        // 定位到屏幕上 15% 处
        const offsetPosition = absoluteElementTop - (window.innerHeight * 0.15);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center">
      
      {/* 1. 顶部悬挂导航 */}
      <div className="w-full max-w-7xl px-6 pt-10 pb-4 relative z-20">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-[-1px]"></div>
        
        <div className="flex flex-wrap justify-center items-start gap-4 md:gap-8">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex flex-col items-center group">
              <div className={`w-[1px] transition-all duration-500 bg-white/20 group-hover:bg-[#c23531]/50 
                ${activeCategory === cat ? 'h-12 bg-[#c23531]' : 'h-6 md:h-8'}`}
              ></div>
              
              <button
                onClick={() => handleCategoryClick(cat)}
                className={`relative w-14 md:w-20 transition-all duration-500 border backdrop-blur-sm flex items-center justify-center overflow-hidden
                  ${activeCategory === cat 
                    ? 'h-48 md:h-64 bg-[#c23531] border-[#c23531] shadow-[0_10px_40px_rgba(194,53,49,0.4)] translate-y-2' 
                    : 'h-32 md:h-40 bg-[#151515]/80 border-white/10 hover:border-white/30 hover:bg-[#1a1a1a] hover:h-36'}`}
              >
                {activeCategory === cat && (
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                )}

                <span className={`writing-vertical font-serif text-xl md:text-3xl font-black tracking-[0.4em] transition-colors duration-300 z-10
                  ${activeCategory === cat ? 'text-black' : 'text-gray-500 group-hover:text-gray-300'}`}
                >
                  {cat}
                </span>
                
                {activeCategory === cat && (
                  <div className="absolute bottom-4 w-6 h-6 border border-black/30 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-black/20 rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 标题展示区 */}
      <div 
        ref={titleRef} 
        className="w-full flex flex-col justify-center items-center py-16 relative z-10 overflow-hidden"
      >
        <AnimatePresence mode='wait'>
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="text-center space-y-4"
          >
            <p className="text-[#bfae58] text-xs tracking-[0.8em] uppercase opacity-80">
              Selection
            </p>
            
            <h2 className="text-6xl md:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-widest drop-shadow-2xl">
              {activeCategory === '全部' ? '万象' : `${activeCategory}`}
            </h2>
            
            <div className="flex items-center justify-center gap-4">
               <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c23531]"></div>
               <span className="text-gray-500 text-xs font-mono tracking-widest">
                 {activeCategory === '全部' ? 'ALL COLLECTIONS' : 'OPERA MASK'}
               </span>
               <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c23531]"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. 内容展示区 */}
      <div className="w-full max-w-[1600px] px-6 md:px-12 pb-24">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredWorks.map((work, index) => (
              <motion.div 
                key={work.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedWork(work)} 
                className="group relative cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#111] border border-white/5 transition-all duration-500 group-hover:border-[#bfae58]/50 group-hover:translate-y-[-5px]">
                  
                  {/* [修改] 1. 添加忽略注释，保留原有的 alt */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={work.imageUrl} 
                    alt={work.title || 'Work'} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[0.8] group-hover:grayscale-0"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                     <div className="w-0 group-hover:w-full h-[1px] bg-[#c23531] transition-all duration-500 mb-4"></div>
                     <h3 className="text-xl font-serif font-bold text-gray-200 group-hover:text-white transition-colors">{work.title || '无名'}</h3>
                     <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span className="text-[10px] text-[#bfae58] tracking-widest">{work.category}</span>
                        <span className="text-[10px] text-gray-500">NO.{(index + 1).toString().padStart(2, '0')}</span>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredWorks.length === 0 && (
          <div className="py-10 text-center opacity-30">
            <p className="text-xs tracking-widest font-serif border-b border-white/10 inline-block pb-2">暂无藏品</p>
          </div>
        )}
      </div>

      {/* === 4. 详情弹窗 (UI 升级版) === */}
    <AnimatePresence>
      {selectedWork && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* 背景遮罩 (加深颜色，增加模糊) */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedWork(null)}
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-pointer"
          />
          
          {/* 卡片主体 (加大尺寸，优化边框) */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 50 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative w-full max-w-7xl h-[90vh] bg-[#080808] border border-white/10 shadow-[0_0_100px_rgba(194,53,49,0.2)] flex flex-col md:flex-row overflow-hidden rounded-xl"
          >
            
           {/* === 左侧：沉浸式展示区 (暴力放大版) === */}
            <div className="md:w-3/5 bg-gradient-to-br from-[#050505] to-[#111] relative flex items-center justify-center p-0 overflow-hidden group">
              
              {/* 背景装饰：红光 (加大范围) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#c23531]/5 rounded-full blur-[150px] group-hover:bg-[#c23531]/10 transition-all duration-1000"></div>
              
              {/* 背景纹理 (降低不透明度，不要抢戏) */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
              
              {/* 图片本体 (核心修改) */}
              {/* 1. p-0: 去掉容器内边距 */}
              {/* 2. w-[80%]: 让图片宽度占满容器的 80% (之前可能被限制住了) */}
              {/* 3. drop-shadow: 增加更强的立体感 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedWork.imageUrl} 
                alt={selectedWork.title || 'Detail'} 
                className="relative z-10 w-[70%] md:w-[80%] object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.9)] transform group-hover:scale-110 transition-transform duration-700 ease-out" 
              />
              
              {/* 巨大的背景字 (稍微调淡一点) */}
              <div className="absolute -bottom-20 -right-20 text-[15rem] font-serif font-black text-white/[0.02] select-none leading-none pointer-events-none writing-vertical">
                {selectedWork.category}
              </div>
            </div>

            {/* === 右侧：信息详情区 (排版优化) === */}
            <div className="md:w-2/5 p-12 md:p-16 overflow-y-auto bg-[#0c0c0c] border-l border-white/5 relative custom-scrollbar">
              
              {/* 顶部标签 */}
              <div className="mb-10 flex items-center justify-between">
                <span className="inline-block px-4 py-1.5 border border-[#c23531] text-[#c23531] text-xs tracking-[0.2em] font-bold">
                  {selectedWork.category} · 经典谱式
                </span>
                <span className="text-[10px] text-gray-600 font-mono tracking-widest">
                  NO.{selectedWork.id.slice(-3).toUpperCase()}
                </span>
              </div>

              {/* 标题 */}
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight tracking-wide">
                {selectedWork.title || '无名'}
              </h1>

              {/* 金色分割线 */}
              <div className="w-24 h-[3px] bg-gradient-to-r from-[#bfae58] to-transparent mb-10"></div>

              {/* 内容文本 (增加行高和字间距) */}
              <div className="text-gray-300 leading-loose font-light text-justify text-base space-y-6">
                {/* 使用 dangerouslySetInnerHTML 或者简单的处理来支持换行，如果你之前用了 whitespace-pre-line 也可以 */}
                <div className="whitespace-pre-line">
                  {selectedWork.description || "暂无详细考据。"}
                </div>
              </div>

              {/* 底部操作栏 */}
              <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Archived Date</span>
                  <span className="text-xs text-gray-400 font-mono">{new Date(selectedWork.createdAt).toLocaleDateString()}</span>
                </div>
                
               {/* [新增] 创作按钮 (主按钮风格) */}
              <button 
                onClick={() => handleUseTemplate(selectedWork.imageUrl)}
                className="flex items-center gap-3 px-6 py-3 bg-[#c23531] text-white hover:bg-[#ff4d4f] transition-colors border border-transparent shadow-lg shadow-red-900/20 group"
              >
                <span className="text-xl">🎨</span>
                <span className="text-xs tracking-widest font-bold">USE AS TEMPLATE</span>
              </button>

              {/* 原来的关闭按钮 (次按钮风格) */}
              <button 
                onClick={() => setSelectedWork(null)}
                className="group flex items-center gap-3 text-xs text-gray-500 hover:text-white transition-colors"
              >
                <div className="w-8 h-[1px] bg-gray-700 group-hover:bg-white transition-colors"></div>
                CLOSE
              </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </div>
  );
}