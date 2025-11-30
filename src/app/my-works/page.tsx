'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Work {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export default function MyWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 加载数据 (修复 set-state-in-effect)
  useEffect(() => {
    // 定义在 effect 内部，确保依赖正确
    const fetchData = async () => {
      try {
        // 从浏览器缓存拿 ID
        const userId = localStorage.getItem('opera_user_id');
        
        // 如果没 ID，说明没存过，直接结束加载
        if (!userId) {
          setLoading(false);
          return;
        }

        // 去后台查数据
        const res = await fetch(`/api/my-works?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setWorks(data);
        }
      } catch (error) {
        console.error('加载失败:', error);
      } finally {
        setLoading(false);
      }
    };

    // 执行
    fetchData();
  }, []);

  // 2. 删除功能
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!confirm('确定要销毁这张脸谱吗？此操作不可恢复。')) return;
    
    // 乐观更新
    setWorks(prev => prev.filter(w => w.id !== id));

    try {
      await fetch(`/api/my-works?id=${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请刷新重试');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e0e0e0] font-sans relative overflow-x-hidden">
      
      {/* 噪点背景 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* 顶部导航 */}
      <nav className="fixed top-0 w-full p-8 flex justify-between items-end z-50 bg-gradient-to-b from-[#0c0c0c] to-transparent">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-[0.2em] text-white">私人藏品</h1>
          <p className="text-[10px] text-[#bfae58] tracking-widest uppercase mt-1">My Private Collection</p>
        </div>
        <Link href="/editor" className="text-xs text-[#bfae58] border border-[#bfae58] px-6 py-2 hover:bg-[#bfae58] hover:text-black transition">
          ← 返回创作
        </Link>
      </nav>

      {/* 内容区域 */}
      <div className="relative z-10 pt-40 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-mono">LOADING DATA...</div>
        ) : works.length === 0 ? (
          <div className="h-[50vh] flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] backdrop-blur-sm">
            <p className="text-6xl mb-4 opacity-30">📭</p>
            <p className="text-xs tracking-widest text-gray-500">你还没有保存过任何作品</p>
            <Link href="/editor" className="mt-6 text-[#c23531] border-b border-[#c23531] pb-1 text-xs hover:text-white transition">去画一张</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <AnimatePresence>
              {works.map((work) => (
                <motion.div 
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="group relative aspect-[3/4] bg-[#151515] border border-white/10 overflow-hidden hover:border-[#bfae58]/50 transition-colors"
                >
                  {/* [修复] 添加 alt 和 eslint-disable */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={work.imageUrl} 
                    alt={work.title || 'Work'} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500" 
                  />
                  
                  {/* 悬停显示的遮罩和按钮 */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-4 text-center">
                     <div>
                       <p className="text-xs text-white font-bold font-serif mb-1">{work.title || '无题'}</p>
                       <p className="text-[10px] text-gray-500">{work.category || '京剧'}</p>
                     </div>
                     
                     <div className="flex gap-2">
                       <button 
                         onClick={(e) => handleDelete(work.id, e)}
                         className="px-4 py-2 border border-red-600/50 text-red-500 text-[10px] hover:bg-red-600 hover:text-white transition tracking-widest"
                       >
                         销毁 DELETE
                       </button>
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}