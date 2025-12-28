import { sql } from '@vercel/postgres';
import { PlayerStats, DeckStats } from '@/lib/types';

export async function getPlayerStats(playerId: string): Promise<PlayerStats> {
  const result = await sql`
    SELECT 
      COUNT(*) as total_matches,
      SUM(CASE WHEN mp.is_winner THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN NOT mp.is_winner THEN 1 ELSE 0 END) as losses
    FROM match_participants mp
    WHERE mp.player_id = ${playerId}
  `;
  
  const row = result.rows[0];
  const totalMatches = parseInt(row.total_matches) || 0;
  const wins = parseInt(row.wins) || 0;
  const losses = parseInt(row.losses) || 0;
  const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

  return {
    playerId,
    totalMatches,
    wins,
    losses,
    winRate: Math.round(winRate * 100) / 100,
  };
}

export async function getAllPlayerStats(): Promise<PlayerStats[]> {
  const result = await sql`
    SELECT 
      mp.player_id,
      COUNT(*) as total_matches,
      SUM(CASE WHEN mp.is_winner THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN NOT mp.is_winner THEN 1 ELSE 0 END) as losses
    FROM match_participants mp
    GROUP BY mp.player_id
  `;
  
  return result.rows.map(row => {
    const totalMatches = parseInt(row.total_matches) || 0;
    const wins = parseInt(row.wins) || 0;
    const losses = parseInt(row.losses) || 0;
    const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

    return {
      playerId: row.player_id,
      totalMatches,
      wins,
      losses,
      winRate: Math.round(winRate * 100) / 100,
    };
  });
}

export async function getDeckStats(deckId: string): Promise<DeckStats> {
  // Primeiro, buscar o player_id do deck
  const deckResult = await sql`
    SELECT player_id
    FROM decks
    WHERE id = ${deckId}
  `;
  
  if (deckResult.rows.length === 0) {
    throw new Error('Deck não encontrado');
  }
  
  const playerId = deckResult.rows[0].player_id;

  // Buscar estatísticas do deck
  const statsResult = await sql`
    SELECT 
      COUNT(*) as total_matches,
      SUM(CASE WHEN mp.is_winner THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN NOT mp.is_winner THEN 1 ELSE 0 END) as losses
    FROM match_participants mp
    WHERE mp.deck_id = ${deckId}
  `;
  
  const row = statsResult.rows[0];
  const totalMatches = parseInt(row.total_matches) || 0;
  const wins = parseInt(row.wins) || 0;
  const losses = parseInt(row.losses) || 0;
  const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

  return {
    deckId,
    playerId,
    totalMatches,
    wins,
    losses,
    winRate: Math.round(winRate * 100) / 100,
  };
}

