import { NextRequest, NextResponse } from 'next/server';
import { getDeckById, deleteDeck } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deck = await getDeckById(params.id);
    if (!deck) {
      return NextResponse.json(
        { success: false, error: 'Deck não encontrado' },
        { status: 404 }
      );
    }
    // Serializa datas para strings ISO
    const serializedDeck = {
      ...deck,
      createdAt: deck.createdAt instanceof Date ? deck.createdAt.toISOString() : deck.createdAt,
    };
    return NextResponse.json({ success: true, data: serializedDeck });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar deck' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteDeck(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Deck não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir deck' },
      { status: 500 }
    );
  }
}

