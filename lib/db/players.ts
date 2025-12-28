import { sql } from './client';
import { Player } from '@/lib/types';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function getAllPlayers(): Promise<Player[]> {
  const result = await sql`
    SELECT id, name, email, created_at
    FROM players
    ORDER BY created_at DESC
  `;
  
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email || undefined,
    createdAt: new Date(row.created_at),
  }));
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  const result = await sql`
    SELECT id, name, email, created_at
    FROM players
    WHERE id = ${id}
  `;
  
  if (result.rows.length === 0) {
    return undefined;
  }
  
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email || undefined,
    createdAt: new Date(row.created_at),
  };
}

export async function createPlayer(name: string, email?: string): Promise<Player> {
  const id = generateId();
  const now = new Date();
  
  await sql`
    INSERT INTO players (id, name, email, created_at)
    VALUES (${id}, ${name}, ${email || null}, ${now.toISOString()})
  `;
  
  return {
    id,
    name,
    email,
    createdAt: now,
  };
}

export async function deletePlayer(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM players
    WHERE id = ${id}
  `;
  
  return (result.rowCount || 0) > 0;
}

