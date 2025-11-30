import Link from 'next/link';
import IntroMusic from '@/components/dom/IntroMusic';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#e0e0e0] font-sans selection:bg-[#c23531] selection:text-white relative overflow-x-hidden">
      
      {/* === 全局纹理覆盖 (制造胶片/宣纸的质感) === */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <IntroMusic /> 

      {/* === 导航栏 (极简隐形) === */}
      <nav className="fixed top-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-[0.2em] text-[#c23531]">脸谱</span>
          <span className="text-xs text-gray-500 tracking-widest uppercase mt-1">Peking Opera</span>
        </div>
        <Link 
          href="/editor" 
          className="group relative px-6 py-2 overflow-hidden rounded-none border border-[#333] hover:border-[#c23531] transition-colors duration-500"
        >
          <span className="relative z-10 text-xs tracking-widest text-gray-300 group-hover:text-white transition">进入工坊</span>
          <div className="absolute inset-0 bg-[#c23531] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
        </Link>
      </nav>

      {/* === Hero 区域：东方神秘感 === */}
      <section className="relative h-screen flex items-center justify-center z-10">
        
        {/* 背景光影：模拟舞台上的聚光灯 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[40vh] bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#c23531] rounded-full blur-[180px] opacity-[0.15] animate-pulse"></div>

        <div className="container mx-auto px-6 relative flex flex-col md:flex-row items-center justify-between h-full">
          
          {/* 左侧：竖排文字 (中式灵魂) */}
          <div className="hidden md:flex h-3/4 flex-row-reverse gap-8 items-start pt-20">
            <div className="writing-vertical text-xs tracking-[0.5em] text-gray-500 border-l border-gray-800 pl-4 h-full flex justify-between">
              <span>TRADITIONAL CULTURE</span>
              <span>DIGITAL RECONSTRUCTION</span>
            </div>
            <h1 className="writing-vertical text-6xl font-serif font-black tracking-widest text-white/90 leading-loose shadow-text">
              粉墨<span className="text-[#c23531]">登场</span>
            </h1>
            <p className="writing-vertical text-lg text-gray-400 font-serif tracking-widest opacity-80 mt-12">
              咫尺方寸 · 演绎万象
            </p>
          </div>

          {/* 移动端标题 (横排) */}
          <div className="md:hidden text-center mt-20">
             <h1 className="text-5xl font-serif font-bold text-white mb-4">粉墨<span className="text-[#c23531]">登场</span></h1>
             <p className="text-gray-400 tracking-widest">咫尺方寸 · 演绎万象</p>
          </div>

          {/* 右侧/中间：巨大的装饰性“圆”，象征镜子或舞台 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] md:w-[400px] md:h-[500px] border border-white/10 rounded-full md:rounded-[200px] flex items-center justify-center backdrop-blur-[2px]">
            <div className="text-center space-y-8 z-20">
              <div className="w-24 h-[1px] bg-[#c23531] mx-auto mb-8"></div>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed font-light tracking-wide max-w-xs mx-auto">
                以数字之形，重塑国粹之魂。<br/>
                在光影流转间，<br/>
                绘制属于你的东方美学。
              </p>
              
              <Link href="/editor" className="inline-block mt-8">
                <button className="relative px-8 py-3 bg-transparent border border-[#bfae58] text-[#bfae58] hover:bg-[#bfae58] hover:text-black transition-all duration-500 tracking-widest text-sm uppercase">
                  Start Creating
                </button>
              </Link>
            </div>
          </div>

          {/* 右下角：印章风格装饰 */}
          <div className="absolute bottom-10 right-10 hidden md:block opacity-50">
             <div className="w-16 h-16 border-2 border-[#c23531] rounded-sm flex items-center justify-center">
                <span className="text-[#c23531] font-serif font-bold writing-vertical text-sm">京剧<br/>脸谱</span>
             </div>
          </div>
        </div>
      </section>

      {/* === 第二屏：五色五行 (卡片式布局) === */}
      <section id="colors" className="py-32 px-6 bg-[#0c0c0c] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-gray-800 pb-8">
            <h2 className="text-3xl md:text-5xl font-serif font-bold">
              五色 <span className="text-gray-600 text-2xl md:text-4xl italic ml-4">The Colors</span>
            </h2>
            <p className="text-gray-500 text-sm tracking-widest mt-4 md:mt-0">红忠紫孝 · 黑正粉年</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <ColorCard color="#c23531" title="朱砂" sub="忠义" en="Red" desc="赤胆忠心，如关羽。" />
            <ColorCard color="#1a1a1a" title="玄黑" sub="正直" en="Black" desc="铁面无私，如包拯。" border />
            <ColorCard color="#f0f0f4" title="蛤粉" sub="奸诈" en="White" desc="生性多疑，如曹操。" textDark />
            <ColorCard color="#1661ab" title="靛蓝" sub="刚猛" en="Blue" desc="草莽英雄，如窦尔敦。" />
            <ColorCard color="#bfae58" title="泥金" sub="神幻" en="Gold" desc="威严庄重，如孙悟空。" />
          </div>
        </div>
      </section>

      {/* === 第三屏：理念 (留白与意境) === */}
      <section className="py-40 bg-[#111] relative overflow-hidden">
        {/* 背景大字装饰 */}
        <div className="absolute -left-20 top-20 text-[20rem] font-black text-[#1a1a1a] select-none font-serif opacity-50">
          戏
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1 space-y-12">
            <h3 className="text-4xl font-serif leading-normal">
              非遗不仅属于博物馆，<br/>
              更属于每一个<br/>
              <span className="text-[#c23531] border-b border-[#c23531] pb-2">数字时代的创造者</span>。
            </h3>
            <p className="text-gray-500 leading-loose">
              我们试图用 WebGL 技术还原油彩的质感，用代码重构脸谱的骨相。
              在这里，没有门槛，只有对美的直觉。每一次涂抹，都是与百年前戏班后台的一次隔空对话。
            </p>
            <Link href="/gallery" className="inline-flex items-center text-sm tracking-widest text-[#bfae58] hover:text-white transition">
              前往展馆 VIEW GALLERY <span className="ml-2">→</span>
            </Link>
          </div>
          
          <div className="flex-1 w-full aspect-square relative border border-gray-800 p-8 flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#c23531]/10 to-transparent"></div>
             {/* 这里可以放一个小的旋转模型或者示意图 */}
             <div className="text-center">
                <div className="text-6xl mb-4 opacity-80">🎭</div>
                <div className="text-xs tracking-[0.5em] text-gray-600">IMMERSIVE EXPERIENCE</div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-gray-900">
        <p className="text-gray-600 text-xs tracking-widest">© 2025 BEIJING OPERA MASK WORKSHOP</p>
      </footer>
    </main>
  );
}

// === 组件：颜色卡片 ===
interface ColorCardProps {
  color: string;
  title: string;
  sub: string;
  en: string;
  desc: string;
  border?: boolean;
  textDark?: boolean;
}

function ColorCard({ color, title, sub, en, desc, border = false, textDark = false }: ColorCardProps) {
  return (
    <div className={`group relative h-[400px] border ${border ? 'border-gray-700' : 'border-transparent'} p-6 flex flex-col justify-between transition-all duration-500 hover:bg-white/5`}>
      {/* 颜色块 */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700" style={{ backgroundColor: color }}></div>
      
      <div className="z-10">
        <div className="w-8 h-8 rounded-full mb-4" style={{ backgroundColor: color, border: textDark ? '1px solid #ddd' : 'none' }}></div>
        <h3 className="text-2xl font-serif font-bold mb-1">{title}</h3>
        <p className="text-xs text-gray-500 tracking-widest uppercase">{en}</p>
      </div>

      <div className="z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
         <p className="text-sm font-bold text-[#bfae58] mb-2">{sub}</p>
         <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
      </div>
      
      {/* 竖线装饰 */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-1/2 bg-gray-800 group-last:hidden"></div>
    </div>
  );
}