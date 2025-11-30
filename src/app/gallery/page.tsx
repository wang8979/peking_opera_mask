import Link from 'next/link';
import prisma from '@/lib/prisma';
import GalleryGrid from '@/components/dom/GalleryGrid';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  // 从 Exhibit 表查询官方数据
  const works = await prisma.exhibit.findMany({
    orderBy: { createdAt: 'asc' }, // 官方展品一般按设定好的顺序排
  });

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#e0e0e0] font-sans selection:bg-[#c23531] selection:text-white relative overflow-x-hidden">
      
      {/* 噪点纹理 */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* 顶部导航 */}
      <nav className="fixed top-0 w-full p-8 flex justify-between items-end z-50 bg-gradient-to-b from-[#0c0c0c] to-transparent">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-[0.2em] text-white">脸谱志</h1>
          <p className="text-[10px] text-[#bfae58] tracking-widest uppercase mt-1">Encyclopedia of Masks</p>
        </div>
        
        <div className="flex gap-6 text-xs tracking-widest font-mono">
          <Link href="/" className="hover:text-[#c23531] transition-colors">首页</Link>
          <span className="text-gray-700">/</span>
          {/* [优化] 增加去我的作品的入口 */}
          <Link href="/my-works" className="hover:text-[#c23531] transition-colors">我的作品</Link>
          <span className="text-gray-700">/</span>
          <Link href="/editor" className="hover:text-[#c23531] transition-colors">去创作</Link>
        </div>
      </nav>

      {/* 内容区域 */}
      <div className="relative z-10 pt-40 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        <GalleryGrid works={works} />
      </div>

      <footer className="fixed bottom-0 w-full py-6 text-center pointer-events-none bg-gradient-to-t from-[#0c0c0c] to-transparent">
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent mx-auto mb-4"></div>
        <p className="text-[10px] text-gray-700 tracking-[0.5em] uppercase">Traditional Art Museum</p>
      </footer>
    </main>
  );
}