'use client';

import { useState, useEffect } from 'react';
import { PlayerCard } from '@/components/PlayerCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { BackButton } from '@/components/BackButton';
import { playersAPI, decksAPI } from '@/lib/api';
import { Player, Deck } from '@/lib/types';
import { DeckCard } from '@/components/DeckCard';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPlayerForDeck, setSelectedPlayerForDeck] = useState<string | null>(null);
  const [deckName, setDeckName] = useState('');
  const [deckColors, setDeckColors] = useState<string[]>([]);
  const [decks, setDecks] = useState<Record<string, Deck[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const allPlayers = await playersAPI.getAll();
      setPlayers(allPlayers);
      
      const decksMap: Record<string, Deck[]> = {};
      for (const player of allPlayers) {
        decksMap[player.id] = await decksAPI.getAll(player.id);
      }
      setDecks(decksMap);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePlayer = async () => {
    if (!name.trim()) return;
    
    try {
      await playersAPI.create(name.trim(), email.trim() || undefined);
      await loadData();
      setName('');
      setEmail('');
      setShowForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao criar jogador');
    }
  };

  const handleDeletePlayer = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este jogador? Todos os decks e partidas associadas serão removidos.')) {
      try {
        await playersAPI.delete(id);
        await loadData();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erro ao excluir jogador');
      }
    }
  };

  const handleCreateDeck = async (playerId: string) => {
    if (!deckName.trim()) return;
    try {
      await decksAPI.create(playerId, deckName.trim(), deckColors.length > 0 ? deckColors : undefined);
      await loadData();
      setDeckName('');
      setDeckColors([]);
      setSelectedPlayerForDeck(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao criar deck');
    }
  };

  const handleDeleteDeck = async (deckId: string, playerId: string) => {
    if (confirm('Tem certeza que deseja excluir este deck?')) {
      try {
        await decksAPI.delete(deckId);
        const decksMap = { ...decks };
        decksMap[playerId] = await decksAPI.getAll(playerId);
        setDecks(decksMap);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erro ao excluir deck');
      }
    }
  };

  const toggleDeckColor = (color: string) => {
    setDeckColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Carregando jogadores...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton href="/dashboard" />
        </div>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-mtg-blue to-mtg-purple bg-clip-text text-transparent">
              Jogadores
            </h1>
            <p className="text-gray-600 text-lg">Gerencie os jogadores do torneio</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : 'Novo Jogador'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Adicionar Novo Jogador</h2>
            <div className="space-y-4">
              <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do jogador"
                required
              />
              <Input
                label="Email (opcional)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
              <Button onClick={handleCreatePlayer} disabled={!name.trim()}>
                Criar Jogador
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-8">
          {players.length > 0 ? (
            players.map(player => (
              <div key={player.id}>
                <PlayerCard
                  player={player}
                  decks={decks[player.id] || []}
                  onDelete={handleDeletePlayer}
                />
                
                <div className="mt-6 pl-4 border-l-4 border-mtg-blue/30">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Decks ({decks[player.id]?.length || 0})
                    </h3>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => setSelectedPlayerForDeck(
                        selectedPlayerForDeck === player.id ? null : player.id
                      )}
                    >
                      {selectedPlayerForDeck === player.id ? 'Cancelar' : 'Adicionar Deck'}
                    </Button>
                  </div>

                  {selectedPlayerForDeck === player.id && (
                    <Card className="mb-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-4">Novo Deck</h4>
                      <div className="space-y-4">
                        <Input
                          label="Nome do Deck"
                          value={deckName}
                          onChange={(e) => setDeckName(e.target.value)}
                          placeholder="Ex: Azorius Control"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cores (opcional)
                          </label>
                          <div className="flex gap-2 flex-wrap">
                            {[
                              { key: 'white', label: 'W', bg: '#f8f7f1', text: '#000' },
                              { key: 'blue', label: 'U', bg: '#0e68ab', text: '#fff' },
                              { key: 'black', label: 'B', bg: '#000000', text: '#fff' },
                              { key: 'red', label: 'R', bg: '#d32029', text: '#fff' },
                              { key: 'green', label: 'G', bg: '#00733e', text: '#fff' },
                            ].map(color => (
                              <button
                                key={color.key}
                                type="button"
                                onClick={() => toggleDeckColor(color.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                  deckColors.includes(color.key)
                                    ? 'ring-2 ring-offset-2 ring-gray-400'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                style={deckColors.includes(color.key) ? {
                                  backgroundColor: color.bg,
                                  color: color.text
                                } : {}}
                              >
                                {color.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleCreateDeck(player.id)}
                          disabled={!deckName.trim()}
                        >
                          Criar Deck
                        </Button>
                      </div>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {decks[player.id] && decks[player.id].length > 0 ? (
                      decks[player.id].map(deck => (
                        <DeckCard
                          key={deck.id}
                          deck={deck}
                          player={player}
                          onDelete={(id) => handleDeleteDeck(id, player.id)}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 py-4">Nenhum deck cadastrado</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Card>
              <p className="text-gray-500 text-center py-12">
                Nenhum jogador cadastrado ainda. Clique em "Novo Jogador" para começar.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
