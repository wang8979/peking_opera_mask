'use client';

import { useEffect, useRef } from 'react';

export default function IntroMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // === 配置项 ===
    // 你的音频文件路径 (放在 public 文件夹下)
    // 如果你本地放了文件，就改成 '/intro.mp3'
    // 这里暂时用一个在线的京剧打击乐作为演示
    const AUDIO_SRC = "/source/music/during.mp3"; 
    
    // 移除了淡入淡出相关的DURATION常量
    
    // 创建音频
    const audio = new Audio(AUDIO_SRC);
    audio.volume = 0.6; // 初始音量 (0~1)
    audioRef.current = audio;

  

    // === 尝试播放逻辑 ===
    const tryPlay = () => {
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("🎵 自动播放成功！");
          })
          .catch(() => {
            // 如果被浏览器拦截了 (Autoplay prevented)
            console.log("⚠️ 自动播放被拦截，等待用户交互...");
            
            // 添加一次性监听：用户只要点一下页面(任何地方)，马上补救播放
            const playOnClick = () => {
              audio.play();
              window.removeEventListener('click', playOnClick); // 播了就移除监听
            };
            
            window.addEventListener('click', playOnClick);
          });
      }
    };

    // 组件挂载后立即尝试播放
    tryPlay();

    // 离开页面时清理
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return null; // 这个组件是隐形的，只负责出声
}