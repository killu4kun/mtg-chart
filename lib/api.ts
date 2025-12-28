// Client-side API service
const API_BASE = '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Erro na requisição');
  }

  return data.data as T;
}

// Players API
export const playersAPI = {
  getAll: () => fetchAPI<any[]>('/players'),
  getById: (id: string) => fetchAPI<any>(`/players/${id}`),
  create: (name: string, email?: string) =>
    fetchAPI<any>('/players', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/players/${id}`, {
      method: 'DELETE',
    }),
};

// Decks API
export const decksAPI = {
  getAll: (playerId?: string) => {
    const url = playerId ? `/decks?playerId=${playerId}` : '/decks';
    return fetchAPI<any[]>(url);
  },
  getById: (id: string) => fetchAPI<any>(`/decks/${id}`),
  create: (playerId: string, name: string, colors?: string[]) =>
    fetchAPI<any>('/decks', {
      method: 'POST',
      body: JSON.stringify({ playerId, name, colors }),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/decks/${id}`, {
      method: 'DELETE',
    }),
};

// Matches API
export const matchesAPI = {
  getAll: () => fetchAPI<any[]>('/matches'),
  getById: (id: string) => fetchAPI<any>(`/matches/${id}`),
  create: (participants: any[], date?: Date) =>
    fetchAPI<any>('/matches', {
      method: 'POST',
      body: JSON.stringify({ participants, date }),
    }),
  delete: (id: string) =>
    fetchAPI<void>(`/matches/${id}`, {
      method: 'DELETE',
    }),
};

// Stats API
export const statsAPI = {
  getAll: () => fetchAPI<any[]>('/stats'),
  getPlayerStats: (playerId: string) =>
    fetchAPI<any>(`/stats?playerId=${playerId}`),
  getDeckStats: (deckId: string) =>
    fetchAPI<any>(`/decks/stats/${deckId}`),
};

// Init API (for sample data)
export const initAPI = {
  initialize: () => fetchAPI<void>('/init', { method: 'POST' }),
};

