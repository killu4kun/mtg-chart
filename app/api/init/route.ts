import { NextResponse } from 'next/server';
import { initializeSampleData, initializeDatabase } from '@/lib/data';

export async function POST() {
  try {
    await initializeDatabase();
    await initializeSampleData();
    return NextResponse.json({ success: true, message: 'Dados inicializados' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao inicializar dados' },
      { status: 500 }
    );
  }
}

