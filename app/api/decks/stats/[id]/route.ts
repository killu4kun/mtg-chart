import { NextRequest, NextResponse } from 'next/server';
import { getDeckStats } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stats = await getDeckStats(id);
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao buscar estatísticas do deck' },
      { status: 500 }
    );
  }
}

