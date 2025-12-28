import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/data';

export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: 'Banco de dados inicializado com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao inicializar banco de dados:', error);
    
    // Mensagens de erro mais amigáveis
    let errorMessage = error.message || 'Erro ao inicializar banco de dados';
    
    if (error.message?.includes('POSTGRES_URL')) {
      errorMessage = 'POSTGRES_URL não configurada. Configure a variável de ambiente na Vercel.';
    } else if (error.message?.includes('Connection') || error.message?.includes('connect')) {
      errorMessage = 'Erro de conexão com o banco de dados. Verifique a connection string.';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

