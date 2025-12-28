'use client';

import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { Card } from '@/components/ui/Card';
import { BackButton } from '@/components/BackButton';
import { statsAPI, decksAPI, playersAPI } from '@/lib/api';
import { PlayerStats, DeckStats, Player } from '@/lib/types';

export default function StatsPage() {
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [deckStats, setDeckStats] = useState<DeckStats[]>([]);
  const [decks, setDecks] = useState<any[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [statsData, decksData, playersData] = await Promise.all([
          statsAPI.getAll(),
          decksAPI.getAll(),
          playersAPI.getAll(),
        ]);
        setPlayerStats(statsData.sort((a, b) => b.winRate - a.winRate));
        setDecks(decksData);
        setPlayers(playersData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadDeckStats = async () => {
      if (selectedPlayerId) {
        try {
          const playerDecks = decks.filter(d => d.playerId === selectedPlayerId);
          const stats = await Promise.all(
            playerDecks.map(deck => statsAPI.getDeckStats(deck.id))
          );
          setDeckStats(stats.sort((a, b) => b.winRate - a.winRate));
        } catch (error) {
          console.error('Erro ao carregar estatísticas dos decks:', error);
        }
      } else {
        setDeckStats([]);
      }
    };
    loadDeckStats();
  }, [selectedPlayerId, decks]);

  const overallStats = playerStats.length > 0
    ? {
        totalPlayers: playerStats.length,
        totalMatches: playerStats.reduce((sum, s) => sum + s.totalMatches, 0),
        avgWinRate: playerStats.reduce((sum, s) => sum + s.winRate, 0) / playerStats.length,
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Carregando estatísticas...</div>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-mtg-blue to-mtg-purple bg-clip-text text-transparent">
            Estatísticas
          </h1>
          <p className="text-gray-600 text-lg">Acompanhe o desempenho dos jogadores e decks</p>
        </div>

        {overallStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <div className="text-4xl font-bold text-mtg-blue mb-2">
                  {overallStats.totalPlayers}
                </div>
                <div className="text-gray-600">Jogadores Ativos</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-4xl font-bold text-mtg-green mb-2">
                  {overallStats.totalMatches}
                </div>
                <div className="text-gray-600">Total de Partidas</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-4xl font-bold text-mtg-purple mb-2">
                  {overallStats.avgWinRate.toFixed(1)}%
                </div>
                <div className="text-gray-600">Taxa de Vitória Média</div>
              </div>
            </Card>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Estatísticas dos Jogadores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playerStats.length > 0 ? (
              playerStats.map(stat => {
                const player = players.find((p) => p.id === stat.playerId);
                return (
                  <div
                    key={stat.playerId}
                    onClick={() => setSelectedPlayerId(
                      selectedPlayerId === stat.playerId ? null : stat.playerId
                    )}
                    className="cursor-pointer"
                  >
                    <StatsCard stats={stat} player={player} />
                  </div>
                );
              })
            ) : (
              <Card>
                <p className="text-gray-500 text-center py-8">
                  Nenhuma estatística disponível ainda. Crie algumas partidas para começar.
                </p>
              </Card>
            )}
          </div>
        </div>

        {selectedPlayerId && deckStats.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Estatísticas dos Decks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deckStats.map(stat => {
                const deck = decks.find(d => d.id === stat.deckId);
                if (!deck) return null;
                return (
                  <Card key={stat.deckId} hover>
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{deck.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {stat.totalMatches} {stat.totalMatches === 1 ? 'partida' : 'partidas'}
                        </p>
                      </div>
                      <div className={`text-2xl font-bold flex-shrink-0 ${
                        stat.winRate >= 60 
                          ? 'text-green-600' 
                          : stat.winRate >= 40 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                      }`}>
                        {stat.winRate.toFixed(1)}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-xl font-bold text-green-600">{stat.wins}</div>
                        <div className="text-sm text-gray-600">Vitórias</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-xl font-bold text-red-600">{stat.losses}</div>
                        <div className="text-sm text-gray-600">Derrotas</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
