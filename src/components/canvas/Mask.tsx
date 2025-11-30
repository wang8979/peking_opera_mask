'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react'; // 引入 useCallback
import * as THREE from 'three';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'; // 删除了未使用的 Decal
import { GLTFExporter } from 'three-stdlib';

interface MaskProps {
  currentColor: string;
  isPainting: boolean;
  brushSize: number;
  isEraser: boolean;
  undoTrigger: number;
  onHistoryChange: (canUndo: boolean) => void;
  saveTrigger: number;
  onSaveData: (data: string) => void;
  exportModelTrigger: number;
  modelPath: string;
  resetTrigger: number;
}

type GLTFResult = {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

export function Mask({ 
  currentColor, 
  isPainting, 
  brushSize, 
  isEraser, 
  undoTrigger, 
  onHistoryChange,
  saveTrigger,
  onSaveData,
  exportModelTrigger,
  modelPath,
  resetTrigger
}: MaskProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [canvasTexture, setCanvasTexture] = useState<THREE.CanvasTexture | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  
  const historyRef = useRef<ImageData[]>([]);
  const MAX_HISTORY = 30;

  const { gl, scene, camera, controls } = useThree();

  const { nodes } = useGLTF(modelPath) as unknown as GLTFResult;

  const faceGeometry = useMemo(() => {
    const meshNode = Object.values(nodes).find((node) => node.isMesh);
    if (!meshNode) return new THREE.SphereGeometry(1.2, 64, 64);
    return meshNode.geometry;
  }, [nodes]);

  // [修复] 使用 useCallback 包裹 getDraftKey，保证依赖稳定
  const getDraftKey = useCallback(() => `mask_draft_${modelPath}`, [modelPath]);

  // 初始化 & 切换模型逻辑
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const size = 1024;
    
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      canvasRef.current = canvas;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (ctx) {
      contextRef.current = ctx;

      // 1. 清空画布
      ctx.fillStyle = '#FFF5E6';
      ctx.fillRect(0, 0, size, size);

      // 2. 读取草稿
      const currentKey = getDraftKey();
      const savedDraft = localStorage.getItem(currentKey);
      
      if (savedDraft) {
        const img = new Image();
        img.src = savedDraft;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          if (textureRef.current) textureRef.current.needsUpdate = true;
          const snapshot = ctx.getImageData(0, 0, size, size);
          historyRef.current = [snapshot];
          // 通知父组件更新撤回状态
          onHistoryChange(false); 
        };
      } else {
        const initialState = ctx.getImageData(0, 0, size, size);
        historyRef.current = [initialState];
        onHistoryChange(false);
      }
      
      if (!textureRef.current) {
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
        textureRef.current = texture;
        queueMicrotask(() => setCanvasTexture(texture));
      } else {
        textureRef.current.needsUpdate = true;
      }
    }
    
    return () => {
      if (textureRef.current) {
        // textureRef.current.dispose(); 
      }
    };
  }, [modelPath, getDraftKey, onHistoryChange]); // [修复] 补全依赖

  // 重置逻辑
  useEffect(() => {
    if (resetTrigger > 0 && contextRef.current && canvasRef.current && textureRef.current) {
      const ctx = contextRef.current;
      const size = canvasRef.current.width;

      ctx.fillStyle = '#FFF5E6';
      ctx.fillRect(0, 0, size, size);
      
      textureRef.current.needsUpdate = true;

      const initialState = ctx.getImageData(0, 0, size, size);
      historyRef.current = [initialState];
      onHistoryChange(false);

      localStorage.removeItem(getDraftKey());
    }
  }, [resetTrigger, onHistoryChange, getDraftKey]); // [修复] 补全依赖

  // 绘画逻辑
  const paintAtUv = (uv: THREE.Vector2) => {
    if (!contextRef.current || !textureRef.current) return;
    const ctx = contextRef.current;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const x = uv.x * width;
    const y = uv.y * height; 
    ctx.beginPath();
    const radius = brushSize * 60;
    ctx.ellipse(x, y, radius, radius * 1.1, 0, 0, Math.PI * 2);
    if (isEraser) {
      ctx.fillStyle = '#FFF5E6';
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = currentColor;
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = radius * 0.5;
      ctx.shadowColor = currentColor;
    }
    ctx.fill();
    textureRef.current.needsUpdate = true;
  };

  // 交互事件
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isPainting && !isEraser) return;
    if (e.button === 0) {
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      if (contextRef.current && canvasRef.current) {
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        const snapshot = contextRef.current.getImageData(0, 0, w, h);
        historyRef.current.push(snapshot);
        if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
      }
      if (e.uv) paintAtUv(e.uv);
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if ((isPainting || isEraser) && e.buttons === 1) {
      e.stopPropagation();
      if (e.uv) paintAtUv(e.uv);
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if ((isPainting || isEraser) && e.button === 0) {
      e.stopPropagation();
      (e.target as Element).releasePointerCapture(e.pointerId);
      onHistoryChange(historyRef.current.length > 1);

      if (canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        localStorage.setItem(getDraftKey(), dataUrl);
      }
    }
  };

  // 撤回
  useEffect(() => {
    if (undoTrigger > 0) {
      if (historyRef.current.length > 1 && contextRef.current && textureRef.current) {
        historyRef.current.pop();
        const previousState = historyRef.current[historyRef.current.length - 1];
        if (previousState) {
          contextRef.current.putImageData(previousState, 0, 0);
          textureRef.current.needsUpdate = true;
          
          if (canvasRef.current) {
             localStorage.setItem(getDraftKey(), canvasRef.current.toDataURL());
          }
        }
        onHistoryChange(historyRef.current.length > 1);
      }
    }
  }, [undoTrigger, onHistoryChange, getDraftKey]); // [修复] 补全依赖

  // 保存 (截图模式)
  useEffect(() => {
    if (saveTrigger > 0) {
      const originalPosition = camera.position.clone();
      const originalRotation = camera.rotation.clone();
      camera.position.set(0, 0, 7); 
      camera.lookAt(0, 0, 0);
      gl.render(scene, camera);
      const screenshotData = gl.domElement.toDataURL('image/png');
      camera.position.copy(originalPosition);
      camera.rotation.copy(originalRotation);
      // @ts-expect-error: OrbitControls type definition update
      if (controls) controls.update(); 
      onSaveData(screenshotData);
    }
  }, [saveTrigger, onSaveData, gl, scene, camera, controls]);

  // 导出 GLB
  useEffect(() => {
    if (exportModelTrigger > 0 && meshRef.current) {
      const exporter = new GLTFExporter();
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial && meshRef.current.material.map) {
        meshRef.current.material.map.flipY = false;
      }
      exporter.parse(
        meshRef.current,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `mask-${Date.now()}.glb`;
            link.click();
            URL.revokeObjectURL(link.href);
          }
        },
        (error) => { console.error('导出失败:', error); alert('导出失败'); },
        { binary: true, maxTextureSize: 1024 }
      );
    }
  }, [exportModelTrigger]);

  return ( 
    <group dispose={null}> 
      <mesh 
        ref={meshRef} 
        geometry={faceGeometry} 
        scale={1.1  } 
        rotation={[0, Math.PI / 2, 0]} 
        position={[0, 0, 0]}
        castShadow 
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      > 
        {canvasTexture && ( 
          <meshStandardMaterial 
            map={canvasTexture} 
            roughness={0.8} 
            metalness={0.0} 
            transparent={false} 
            side={THREE.DoubleSide}
          /> 
        )} 
      </mesh> 
    </group> 
  ); 
}

useGLTF.preload('/source/models/mask.glb');
// 预加载第二个模型
// useGLTF.preload('/source/models/mask_female.glb'); 