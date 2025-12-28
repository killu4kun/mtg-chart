import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/data';

export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: 'Banco de dados inicializado' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao inicializar banco de dados' },
      { status: 500 }
    );
  }
}

