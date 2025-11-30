// src/app/api/save-work/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 确保引入路径正确

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, imageUrl, userId } = body;
    
    // === [关键修改] ===
    // 随机分配一个分类，模拟用户选择
    // (未来你可以让用户在保存时自己选)
    const categories = ['京剧', '豫剧', '昆曲', '川剧'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // 随机生成一段描述
    const descriptions = [
      '红脸代表忠义，黑脸代表正直。笔触苍劲有力，展现了人物的威严。',
      '蓝脸代表刚猛，绿脸代表暴躁。色彩运用大胆，对比强烈。',
      '白脸代表奸诈，金脸代表神仙。线条流畅，神态生动。',
      '这是一张充满想象力的现代脸谱创作，融合了传统与创新。'
    ];
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];

    const work = await prisma.work.create({
      data: {
        title: title || '无名脸谱',
        imageUrl: imageUrl,
        category: randomCategory,
        description: randomDesc,
        userId: userId,
      },
    });

    return NextResponse.json({ success: true, id: work.id });
  } catch (error) {
    console.error('保存失败:', error);
    return NextResponse.json({ error: '保存失败' }, { status: 500 });
  }
}