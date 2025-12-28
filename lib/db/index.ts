import { getPool } from './client';

// Função para inicializar o schema do banco de dados
export async function initDatabase() {
  try {
    const pool = getPool();
    
    // Criar tabelas uma por uma (melhor para controle de erros)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS decks (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL,
        name TEXT NOT NULL,
        colors TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS match_participants (
        match_id TEXT NOT NULL,
        player_id TEXT NOT NULL,
        deck_id TEXT NOT NULL,
        is_winner BOOLEAN NOT NULL DEFAULT FALSE,
        PRIMARY KEY (match_id, player_id),
        FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
      );
    `);

    // Criar índices
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_decks_player_id ON decks(player_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_match_participants_match_id ON match_participants(match_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_match_participants_player_id ON match_participants(player_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_match_participants_deck_id ON match_participants(deck_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
    `);
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

