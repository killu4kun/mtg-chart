import { Pool, QueryResult } from 'pg';

// Cria uma pool de conexões que funciona com qualquer PostgreSQL (Neon, Supabase, etc)
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL;

    if (!connectionString) {
      throw new Error('POSTGRES_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      // Configurações recomendadas para serverless
      max: 1, // Limita conexões para ambiente serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: connectionString.includes('supabase') || connectionString.includes('neon') 
        ? { rejectUnauthorized: false } 
        : undefined,
    });
  }

  return pool;
}

// Função helper para executar queries (compatível com template strings do @vercel/postgres)
export async function sql(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<QueryResult<any>> {
  const pool = getPool();
  let queryText = strings[0];
  const params: any[] = [];
  
  for (let i = 0; i < values.length; i++) {
    params.push(values[i]);
    queryText += `$${params.length}` + strings[i + 1];
  }
  
  return pool.query(queryText, params);
}
