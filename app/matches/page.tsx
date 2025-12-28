'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/BackButton';
import { matchesAPI, playersAPI, decksAPI } from '@/lib/api';
import { Match } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { Trophy, Calendar, X, Gamepad2 } from 'lucide-react';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [playersMap, setPlayersMap] = useState<Map<string, any>>(new Map());
  const [decksMap, setDecksMap] = useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [matchesData, playersData, decksData] = await Promise.all([
          matchesAPI.getAll(),
          playersAPI.getAll(),
          decksAPI.getAll(),
        ]);
        setMatches(matchesData);
        
        const players = new Map();
        playersData.forEach(player => {
          players.set(player.id, player);
        });
        setPlayersMap(players);
        
        const decks = new Map();
        decksData.forEach(deck => {
          decks.set(deck.id, deck);
        });
        setDecksMap(decks);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDeleteMatch = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta partida?')) {
      try {
        await matchesAPI.delete(id);
        const updatedMatches = await matchesAPI.getAll();
        setMatches(updatedMatches);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erro ao excluir partida');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Carregando partidas...</div>
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
              Partidas
            </h1>
            <p className="text-gray-600 text-lg">Histórico de todas as partidas</p>
          </div>
          <Link href="/matches/new">
            <Button className="flex items-center gap-2">
              Nova Partida
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {matches.length > 0 ? (
            matches.map(match => {
              const winner = match.participants.find(p => p.isWinner);
              const winnerPlayer = winner ? playersMap.get(winner.playerId) : null;
              const winnerDeck = winner ? decksMap.get(winner.deckId) : null;

              return (
                <Card hover key={match.id} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mtg-blue/10 to-mtg-purple/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <div className="p-2 bg-gradient-to-br from-mtg-blue to-blue-600 rounded-lg flex-shrink-0">
                          <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Partida #{match.id.slice(0, 8)}
                        </h3>
                        <span className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          {format(new Date(typeof match.date === 'string' ? match.date : match.date), "dd/MM/yyyy 'às' HH:mm")}
                        </span>
                      </div>

                      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex-shrink-0">
                            <Trophy className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-green-800 text-lg truncate">
                              Vencedor: {winnerPlayer?.name || 'Desconhecido'}
                            </div>
                            <div className="text-sm text-green-700 font-medium truncate">
                              Deck: {winnerDeck?.name || 'Desconhecido'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {match.participants.map(participant => {
                          const player = playersMap.get(participant.playerId);
                          const deck = decksMap.get(participant.deckId);
                          const isWinner = participant.isWinner;

                          return (
                            <div
                              key={participant.playerId}
                              className={`p-3 rounded-lg border ${
                                isWinner
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium text-gray-900 truncate">
                                    {player?.name || 'Desconhecido'}
                                  </div>
                                  <div className="text-sm text-gray-600 truncate">
                                    {deck?.name || 'Deck desconhecido'}
                                  </div>
                                </div>
                                {isWinner && (
                                  <Trophy className="w-5 h-5 text-green-600 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteMatch(match.id)}
                      className="flex items-center gap-2 flex-shrink-0 self-start"
                    >
                      <X className="w-4 h-4" />
                      Excluir
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  Nenhuma partida registrada ainda
                </p>
                <Link href="/matches/new">
                  <Button>Criar Primeira Partida</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
