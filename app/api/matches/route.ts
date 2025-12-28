import { NextRequest, NextResponse } from 'next/server';
import { getAllMatches, createMatch } from '@/lib/data';
import { MatchParticipant } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const matches = await getAllMatches();
    // Serializa datas para strings ISO
    const serializedMatches = matches.map(match => ({
      ...match,
      date: match.date instanceof Date ? match.date.toISOString() : match.date,
      createdAt: match.createdAt instanceof Date ? match.createdAt.toISOString() : match.createdAt,
    }));
    return NextResponse.json({ success: true, data: serializedMatches });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar partidas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participants, date } = body;

    if (!participants || !Array.isArray(participants) || participants.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Uma partida precisa de no mínimo 4 jogadores' },
        { status: 400 }
      );
    }

    const winners = participants.filter((p: MatchParticipant) => p.isWinner);
    if (winners.length !== 1) {
      return NextResponse.json(
        { success: false, error: 'Deve haver exatamente um vencedor na partida' },
        { status: 400 }
      );
    }

    const matchDate = date ? new Date(date) : undefined;
    const match = await createMatch(participants, matchDate);
    
    // Serializa datas para strings ISO
    const serializedMatch = {
      ...match,
      date: match.date instanceof Date ? match.date.toISOString() : match.date,
      createdAt: match.createdAt instanceof Date ? match.createdAt.toISOString() : match.createdAt,
    };
    
    return NextResponse.json({ success: true, data: serializedMatch }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao criar partida' },
      { status: 500 }
    );
  }
}

