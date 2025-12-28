import { NextRequest, NextResponse } from 'next/server';
import { getAllPlayerStats, getPlayerStats } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (playerId) {
      const stats = await getPlayerStats(playerId);
      return NextResponse.json({ success: true, data: stats });
    } else {
      const stats = await getAllPlayerStats();
      return NextResponse.json({ success: true, data: stats });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}

