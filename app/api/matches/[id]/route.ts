import { NextRequest, NextResponse } from 'next/server';
import { getMatchById, deleteMatch } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await getMatchById(id);
    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Partida não encontrada' },
        { status: 404 }
      );
    }
    // Serializa datas para strings ISO
    const serializedMatch = {
      ...match,
      date: match.date instanceof Date ? match.date.toISOString() : match.date,
      createdAt: match.createdAt instanceof Date ? match.createdAt.toISOString() : match.createdAt,
    };
    return NextResponse.json({ success: true, data: serializedMatch });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar partida' },
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
    const deleted = await deleteMatch(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Partida não encontrada' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir partida' },
      { status: 500 }
    );
  }
}

