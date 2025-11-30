// src/app/api/my-works/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 获取我的作品列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json([]);

  const works = await prisma.work.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(works);
}

// 删除作品
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    await prisma.work.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}