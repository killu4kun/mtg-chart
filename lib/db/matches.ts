import { sql } from '@vercel/postgres';
import { Match, MatchParticipant } from '@/lib/types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function getAllMatches(): Promise<Match[]> {
  // Buscar todas as partidas
  const matchesResult = await sql`
    SELECT id, date, created_at
    FROM matches
    ORDER BY date DESC
  `;
  
  // Para cada partida, buscar os participantes
  const matches: Match[] = [];
  
  for (const matchRow of matchesResult.rows) {
    const participantsResult = await sql`
      SELECT player_id, deck_id, is_winner
      FROM match_participants
      WHERE match_id = ${matchRow.id}
    `;
    
    const participants: MatchParticipant[] = participantsResult.rows.map(row => ({
      playerId: row.player_id,
      deckId: row.deck_id,
      isWinner: row.is_winner,
    }));
    
    matches.push({
      id: matchRow.id,
      date: new Date(matchRow.date),
      createdAt: new Date(matchRow.created_at),
      participants,
    });
  }
  
  return matches;
}

export async function getMatchById(id: string): Promise<Match | undefined> {
  // Buscar a partida
  const matchResult = await sql`
    SELECT id, date, created_at
    FROM matches
    WHERE id = ${id}
  `;
  
  if (matchResult.rows.length === 0) {
    return undefined;
  }
  
  const matchRow = matchResult.rows[0];
  
  // Buscar participantes
  const participantsResult = await sql`
    SELECT player_id, deck_id, is_winner
    FROM match_participants
    WHERE match_id = ${id}
  `;
  
  const participants: MatchParticipant[] = participantsResult.rows.map(row => ({
    playerId: row.player_id,
    deckId: row.deck_id,
    isWinner: row.is_winner,
  }));
  
  return {
    id: matchRow.id,
    date: new Date(matchRow.date),
    createdAt: new Date(matchRow.created_at),
    participants,
  };
}

export async function createMatch(
  participants: MatchParticipant[],
  date?: Date
): Promise<Match> {
  if (participants.length < 4) {
    throw new Error('Uma partida precisa de no mínimo 4 jogadores');
  }

  const winners = participants.filter(p => p.isWinner);
  if (winners.length !== 1) {
    throw new Error('Deve haver exatamente um vencedor na partida');
  }

  const id = generateId();
  const matchDate = date || new Date();
  const now = new Date();

  // Inserir partida
  await sql`
    INSERT INTO matches (id, date, created_at)
    VALUES (${id}, ${matchDate.toISOString()}, ${now.toISOString()})
  `;

  // Inserir participantes
  for (const participant of participants) {
    await sql`
      INSERT INTO match_participants (match_id, player_id, deck_id, is_winner)
      VALUES (${id}, ${participant.playerId}, ${participant.deckId}, ${participant.isWinner})
    `;
  }

  return {
    id,
    date: matchDate,
    createdAt: now,
    participants,
  };
}

export async function deleteMatch(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM matches
    WHERE id = ${id}
  `;
  
  return (result.rowCount || 0) > 0;
}

