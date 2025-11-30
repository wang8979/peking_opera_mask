// src/components/canvas/Scene.tsx
'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three'; // 补上可能的引用

interface SceneProps {
  children: React.ReactNode;
  isPainting: boolean;
}

export default function Scene({ children, isPainting }: SceneProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div 
      className="w-full h-full relative"
      style={{ touchAction: 'none', cursor: 'default' }} 
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
    >
      <button
        onClick={handleReset}
        className="absolute bottom-8 right-8 z-50 w-12 h-12 bg-white/90 text-gray-800 rounded-full shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 group border border-gray-200"
        title="重置视角 (Reset View)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-[#ff461f]">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </button>

      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 45 }}
        // 👇👇👇 核心修改：加上这一行！允许截图！👇👇👇
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.8} 
          castShadow 
        />
        <spotLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />
        {/* background={false} 确保背景透明，截图时自带抠图效果 */}
        <Environment preset="city" environmentIntensity={0.6} background={false} />

        {children}
        
        <OrbitControls 
          ref={controlsRef}
          makeDefault 
          enabled={!isPainting} 
          enablePan={true} 
          mouseButtons={{
            LEFT: 0, 
            MIDDLE: 1, 
            RIGHT: 2
          }}
        />
      </Canvas>
    </div>
  );
}