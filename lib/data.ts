import { Player, Deck, Match, MatchParticipant, PlayerStats, DeckStats } from './types';
import * as dbPlayers from './db/players';
import * as dbDecks from './db/decks';
import * as dbMatches from './db/matches';
import * as dbStats from './db/stats';
import { initDatabase } from './db';

// Re-exportar funções do banco de dados
export const getAllPlayers = dbPlayers.getAllPlayers;
export const getPlayerById = dbPlayers.getPlayerById;
export const createPlayer = dbPlayers.createPlayer;
export const deletePlayer = dbPlayers.deletePlayer;

export const getAllDecks = dbDecks.getAllDecks;
export const getDecksByPlayerId = dbDecks.getDecksByPlayerId;
export const getDeckById = dbDecks.getDeckById;
export const createDeck = dbDecks.createDeck;
export const deleteDeck = dbDecks.deleteDeck;

export const getAllMatches = dbMatches.getAllMatches;
export const getMatchById = dbMatches.getMatchById;
export const createMatch = dbMatches.createMatch;
export const deleteMatch = dbMatches.deleteMatch;

export const getPlayerStats = dbStats.getPlayerStats;
export const getAllPlayerStats = dbStats.getAllPlayerStats;
export const getDeckStats = dbStats.getDeckStats;

// Função para inicializar banco de dados (chamar uma vez)
let dbInitialized = false;
export async function initializeDatabase() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// Função para inicializar dados de exemplo (opcional)
export async function initializeSampleData() {
  await initializeDatabase();
  
  // Verificar se já existem jogadores
  const existingPlayers = await getAllPlayers();
  if (existingPlayers.length > 0) {
    return; // Já tem dados, não inicializar novamente
  }

  const player1 = await createPlayer('João Silva', 'joao@example.com');
  const player2 = await createPlayer('Maria Santos', 'maria@example.com');
  const player3 = await createPlayer('Pedro Costa', 'pedro@example.com');
  const player4 = await createPlayer('Ana Oliveira', 'ana@example.com');
  const player5 = await createPlayer('Carlos Souza', 'carlos@example.com');
  const player6 = await createPlayer('Julia Lima', 'julia@example.com');

  await createDeck(player1.id, 'Azul Control', ['blue']);
  await createDeck(player1.id, 'Izzet Spells', ['blue', 'red']);
  await createDeck(player2.id, 'Azorius Control', ['white', 'blue']);
  await createDeck(player2.id, 'Selesnya Tokens', ['white', 'green']);
  await createDeck(player3.id, 'Rakdos Aggro', ['black', 'red']);
  await createDeck(player3.id, 'Dimir Control', ['blue', 'black']);
  await createDeck(player4.id, 'Gruul Aggro', ['red', 'green']);
  await createDeck(player5.id, 'Orzhov Midrange', ['white', 'black']);
  await createDeck(player6.id, 'Simic Ramp', ['blue', 'green']);
}
