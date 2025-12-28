export interface Player {
  id: string;
  name: string;
  email?: string;
  createdAt: Date | string; // string quando vem da API
}

export interface Deck {
  id: string;
  playerId: string;
  name: string;
  colors?: string[]; // Cores do deck (blue, red, green, white, black, etc)
  createdAt: Date | string; // string quando vem da API
}

export interface MatchParticipant {
  playerId: string;
  deckId: string;
  isWinner: boolean;
}

export interface Match {
  id: string;
  participants: MatchParticipant[]; // Mínimo de 4 jogadores
  date: Date | string; // string quando vem da API
  createdAt: Date | string; // string quando vem da API
}

export interface PlayerStats {
  playerId: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number; // porcentagem
}

export interface DeckStats {
  deckId: string;
  playerId: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number; // porcentagem
}

