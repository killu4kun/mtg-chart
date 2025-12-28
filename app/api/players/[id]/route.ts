import { NextRequest, NextResponse } from 'next/server';
import { getPlayerById, deletePlayer } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const player = await getPlayerById(id);
    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Jogador não encontrado' },
        { status: 404 }
      );
    }
    // Serializa datas para strings ISO
    const serializedPlayer = {
      ...player,
      createdAt: player.createdAt instanceof Date ? player.createdAt.toISOString() : player.createdAt,
    };
    return NextResponse.json({ success: true, data: serializedPlayer });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar jogador' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deletePlayer(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Jogador não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir jogador' },
      { status: 500 }
    );
  }
}

