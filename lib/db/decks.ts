import { sql } from '@vercel/postgres';
import { Deck } from '@/lib/types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function getAllDecks(): Promise<Deck[]> {
  const result = await sql`
    SELECT id, player_id, name, colors, created_at
    FROM decks
    ORDER BY created_at DESC
  `;
  
  return result.rows.map(row => ({
    id: row.id,
    playerId: row.player_id,
    name: row.name,
    colors: row.colors || undefined,
    createdAt: new Date(row.created_at),
  }));
}

export async function getDecksByPlayerId(playerId: string): Promise<Deck[]> {
  const result = await sql`
    SELECT id, player_id, name, colors, created_at
    FROM decks
    WHERE player_id = ${playerId}
    ORDER BY created_at DESC
  `;
  
  return result.rows.map(row => ({
    id: row.id,
    playerId: row.player_id,
    name: row.name,
    colors: row.colors || undefined,
    createdAt: new Date(row.created_at),
  }));
}

export async function getDeckById(id: string): Promise<Deck | undefined> {
  const result = await sql`
    SELECT id, player_id, name, colors, created_at
    FROM decks
    WHERE id = ${id}
  `;
  
  if (result.rows.length === 0) {
    return undefined;
  }
  
  const row = result.rows[0];
  return {
    id: row.id,
    playerId: row.player_id,
    name: row.name,
    colors: row.colors || undefined,
    createdAt: new Date(row.created_at),
  };
}

export async function createDeck(
  playerId: string,
  name: string,
  colors?: string[]
): Promise<Deck> {
  const id = generateId();
  const now = new Date();
  
  await sql`
    INSERT INTO decks (id, player_id, name, colors, created_at)
    VALUES (${id}, ${playerId}, ${name}, ${colors ? sql.array(colors) : null}, ${now.toISOString()})
  `;
  
  return {
    id,
    playerId,
    name,
    colors,
    createdAt: now,
  };
}

export async function deleteDeck(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM decks
    WHERE id = ${id}
  `;
  
  return (result.rowCount || 0) > 0;
}

