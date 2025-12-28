import { Card } from './ui/Card';
import { PlayerStats, Player } from '@/lib/types';
import { TrendingUp, TrendingDown, Gamepad2 } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  stats: PlayerStats;
  player?: Player;
}

export function StatsCard({ stats, player }: StatsCardProps) {

  const winRateColor = stats.winRate >= 60 
    ? 'text-green-600' 
    : stats.winRate >= 40 
    ? 'text-yellow-600' 
    : 'text-red-600';

  const winRateBg = stats.winRate >= 60 
    ? 'bg-green-50 border-green-200' 
    : stats.winRate >= 40 
    ? 'bg-yellow-50 border-yellow-200' 
    : 'bg-red-50 border-red-200';

  return (
    <Card hover className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mtg-blue/10 to-mtg-purple/10 rounded-full -mr-16 -mt-16 blur-2xl" />
      
      <div className="relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
              {player?.name || 'Jogador Desconhecido'}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 flex-shrink-0" />
              <span>{stats.totalMatches} {stats.totalMatches === 1 ? 'partida' : 'partidas'}</span>
            </p>
          </div>
          <div className={clsx(
            'px-4 py-2 rounded-xl border-2 font-bold text-2xl ml-4 flex-shrink-0',
            winRateBg,
            winRateColor
          )}>
            {stats.winRate.toFixed(1)}%
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="text-3xl font-bold text-green-600">{stats.wins}</div>
            </div>
            <div className="text-sm font-medium text-green-700">Vitórias</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="text-3xl font-bold text-red-600">{stats.losses}</div>
            </div>
            <div className="text-sm font-medium text-red-700">Derrotas</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
