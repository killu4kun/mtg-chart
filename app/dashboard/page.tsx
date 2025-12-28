'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { playersAPI, matchesAPI, statsAPI } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Player } from '@/lib/types';
import { Users, Gamepad2, BarChart3, Trophy, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [playersData, matchesData, statsData] = await Promise.all([
          playersAPI.getAll(),
          matchesAPI.getAll(),
          statsAPI.getAll(),
        ]);
        setPlayers(playersData);
        setMatches(matchesData);
        setStats(statsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const topPlayers = [...stats].sort((a, b) => b.winRate - a.winRate).slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Carregando dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-mtg-blue to-mtg-purple bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Visão geral do torneio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-mtg-blue/20 to-blue-500/20 rounded-full -mr-12 -mt-12 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-mtg-blue to-blue-600 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-mtg-blue mb-2">{players.length}</div>
              <div className="text-gray-600 mb-4">Jogadores</div>
              <Link href="/players">
                <Button variant="secondary" size="sm">Ver Todos</Button>
              </Link>
            </div>
          </Card>

          <Card hover className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-mtg-green/20 to-green-500/20 rounded-full -mr-12 -mt-12 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-mtg-green to-green-600 rounded-xl">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-mtg-green mb-2">{matches.length}</div>
              <div className="text-gray-600 mb-4">Partidas</div>
              <Link href="/matches">
                <Button variant="secondary" size="sm">Ver Todas</Button>
              </Link>
            </div>
          </Card>

          <Card hover className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-mtg-purple/20 to-purple-500/20 rounded-full -mr-12 -mt-12 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-mtg-purple to-purple-600 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-4xl font-bold text-mtg-purple mb-2">{stats.length}</div>
              <div className="text-gray-600 mb-4">Jogadores Ativos</div>
              <Link href="/stats">
                <Button variant="secondary" size="sm">Ver Estatísticas</Button>
              </Link>
            </div>
          </Card>
        </div>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Top 5 Jogadores</h2>
            </div>
            <div className="space-y-3">
              {topPlayers.length > 0 ? (
                topPlayers.map((stat, index) => {
                  const player = players.find(p => p.id === stat.playerId);
                  const rankColors = [
                    'from-yellow-400 to-yellow-600',
                    'from-gray-300 to-gray-400',
                    'from-orange-400 to-orange-600',
                    'from-blue-300 to-blue-400',
                    'from-purple-300 to-purple-400',
                  ];
                  return (
                    <div 
                      key={stat.playerId} 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-mtg-blue/50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${rankColors[index]} flex items-center justify-center text-white font-bold shadow-md flex-shrink-0`}>
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 text-lg truncate">{player?.name || 'Desconhecido'}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{stat.wins}W - {stat.losses}L</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className={`text-2xl font-bold ${
                          stat.winRate >= 60 ? 'text-green-600' : 
                          stat.winRate >= 40 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {stat.winRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Taxa de vitória</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma estatística disponível ainda</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

