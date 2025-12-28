import { NextRequest, NextResponse } from 'next/server';
import { getAllDecks, createDeck, getDecksByPlayerId } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    let decks;
    if (playerId) {
      decks = await getDecksByPlayerId(playerId);
    } else {
      decks = await getAllDecks();
    }

    // Serializa datas para strings ISO
    const serializedDecks = decks.map(deck => ({
      ...deck,
      createdAt: deck.createdAt instanceof Date ? deck.createdAt.toISOString() : deck.createdAt,
    }));

    return NextResponse.json({ success: true, data: serializedDecks });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar decks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, name, colors } = body;

    if (!playerId || !name) {
      return NextResponse.json(
        { success: false, error: 'playerId e name são obrigatórios' },
        { status: 400 }
      );
    }

    const deck = await createDeck(playerId, name, colors);
    // Serializa datas para strings ISO
    const serializedDeck = {
      ...deck,
      createdAt: deck.createdAt instanceof Date ? deck.createdAt.toISOString() : deck.createdAt,
    };
    return NextResponse.json({ success: true, data: serializedDeck }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao criar deck' },
      { status: 500 }
    );
  }
}

