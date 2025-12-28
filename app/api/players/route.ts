import { NextRequest, NextResponse } from 'next/server';
import { getAllPlayers, createPlayer, deletePlayer, getPlayerById } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const players = await getAllPlayers();
    // Serializa datas para strings ISO
    const serializedPlayers = players.map(player => ({
      ...player,
      createdAt: player.createdAt instanceof Date ? player.createdAt.toISOString() : player.createdAt,
    }));
    return NextResponse.json({ success: true, data: serializedPlayers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar jogadores' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const player = await createPlayer(name, email);
    // Serializa datas para strings ISO
    const serializedPlayer = {
      ...player,
      createdAt: player.createdAt instanceof Date ? player.createdAt.toISOString() : player.createdAt,
    };
    return NextResponse.json({ success: true, data: serializedPlayer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao criar jogador' },
      { status: 500 }
    );
  }
}

