'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { BackButton } from '@/components/BackButton';
import { playersAPI, decksAPI, matchesAPI } from '@/lib/api';
import { Player, Deck, MatchParticipant } from '@/lib/types';

export default function NewMatchPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [playerDecks, setPlayerDecks] = useState<Record<string, Deck[]>>({});
  const [selectedDecks, setSelectedDecks] = useState<Record<string, string>>({});
  const [winnerPlayerId, setWinnerPlayerId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const allPlayers = await playersAPI.getAll();
        setPlayers(allPlayers);
        
        const decksMap: Record<string, Deck[]> = {};
        for (const player of allPlayers) {
          decksMap[player.id] = await decksAPI.getAll(player.id);
        }
        setPlayerDecks(decksMap);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddPlayer = () => {
    const availablePlayers = players.filter(p => !selectedPlayers.includes(p.id));
    if (availablePlayers.length === 0) {
      setError('Todos os jogadores já foram adicionados à mesa');
      return;
    }
    setSelectedPlayers([...selectedPlayers, availablePlayers[0].id]);
    setError('');
  };

  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    const newSelectedDecks = { ...selectedDecks };
    delete newSelectedDecks[playerId];
    setSelectedDecks(newSelectedDecks);
    if (winnerPlayerId === playerId) {
      setWinnerPlayerId('');
    }
  };

  const handlePlayerSelect = (index: number, playerId: string) => {
    const newSelectedPlayers = [...selectedPlayers];
    newSelectedPlayers[index] = playerId;
    setSelectedPlayers(newSelectedPlayers);
    
    const newSelectedDecks = { ...selectedDecks };
    delete newSelectedDecks[newSelectedPlayers[index]];
    setSelectedDecks(newSelectedDecks);
  };

  const handleDeckSelect = (playerId: string, deckId: string) => {
    setSelectedDecks({ ...selectedDecks, [playerId]: deckId });
  };

  const handleCreateMatch = async () => {
    setError('');

    if (selectedPlayers.length < 4) {
      setError('Uma partida precisa de no mínimo 4 jogadores');
      return;
    }

    if (!winnerPlayerId || !selectedPlayers.includes(winnerPlayerId)) {
      setError('Selecione o vencedor da partida');
      return;
    }

    for (const playerId of selectedPlayers) {
      if (!selectedDecks[playerId]) {
        setError(`Todos os jogadores precisam ter um deck selecionado`);
        return;
      }
    }

    const participants: MatchParticipant[] = selectedPlayers.map(playerId => ({
      playerId,
      deckId: selectedDecks[playerId]!,
      isWinner: playerId === winnerPlayerId,
    }));

    try {
      await matchesAPI.create(participants);
      router.push('/matches');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar partida');
    }
  };

  const getAvailablePlayers = (currentIndex: number) => {
    return players.filter(p => 
      !selectedPlayers.includes(p.id) || selectedPlayers[currentIndex] === p.id
    );
  };

  const getSelectedPlayer = (playerId: string) => {
    return players.find(p => p.id === playerId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Carregando dados...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton href="/matches" />
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-mtg-blue to-mtg-purple bg-clip-text text-transparent">
            Nova Partida
          </h1>
          <p className="text-gray-600 text-lg">Forme uma mesa com no mínimo 4 jogadores</p>
        </div>

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Jogadores na Mesa ({selectedPlayers.length}/4+)
            </h2>
            <Button 
              onClick={handleAddPlayer}
              disabled={selectedPlayers.length >= players.length}
            >
              Adicionar Jogador
            </Button>
          </div>

          <div className="space-y-4">
            {selectedPlayers.map((playerId, index) => {
              const player = getSelectedPlayer(playerId);
              const decks = playerDecks[playerId] || [];
              
              return (
                <Card key={`${playerId}-${index}`} className="bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <Select
                          label={`Jogador ${index + 1}`}
                          value={playerId}
                          onChange={(e) => handlePlayerSelect(index, e.target.value)}
                        >
                          <option value="">Selecione um jogador</option>
                          {getAvailablePlayers(index).map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemovePlayer(playerId)}
                        className="self-start sm:self-center"
                      >
                        Remover
                      </Button>
                    </div>

                    {player && decks.length > 0 && (
                      <Select
                        label="Deck"
                        value={selectedDecks[playerId] || ''}
                        onChange={(e) => handleDeckSelect(playerId, e.target.value)}
                      >
                        <option value="">Selecione um deck</option>
                        {decks.map(deck => (
                          <option key={deck.id} value={deck.id}>
                            {deck.name}
                          </option>
                        ))}
                      </Select>
                    )}

                    {player && decks.length === 0 && (
                      <p className="text-sm text-gray-500">
                        Este jogador não possui decks cadastrados
                      </p>
                    )}

                    {selectedDecks[playerId] && (
                      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-200">
                        <input
                          type="radio"
                          id={`winner-${playerId}`}
                          name="winner"
                          checked={winnerPlayerId === playerId}
                          onChange={() => setWinnerPlayerId(playerId)}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`winner-${playerId}`} className="font-medium text-green-600 cursor-pointer">
                          🏆 Vencedor da Partida
                        </label>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}

            {selectedPlayers.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                Clique em "Adicionar Jogador" para começar a formar a mesa
              </p>
            )}
          </div>
        </Card>

        {selectedPlayers.length >= 4 && (
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Resumo da Partida
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedPlayers.length} jogadores •{' '}
                  {winnerPlayerId ? 'Vencedor selecionado' : 'Selecione o vencedor'}
                </p>
              </div>
              <Button 
                onClick={handleCreateMatch}
                disabled={!winnerPlayerId || selectedPlayers.some(id => !selectedDecks[id])}
                className="w-full sm:w-auto"
              >
                Criar Partida
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
