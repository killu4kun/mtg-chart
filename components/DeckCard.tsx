import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Deck, Player } from '@/lib/types';
import { format } from 'date-fns';
import { Trash2, Calendar } from 'lucide-react';

interface DeckCardProps {
  deck: Deck;
  player?: Player;
  onDelete?: (id: string) => void;
}

const colorBadges: Record<string, { bg: string; text: string; label: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'U', border: 'border-blue-300' },
  red: { bg: 'bg-red-100', text: 'text-red-800', label: 'R', border: 'border-red-300' },
  green: { bg: 'bg-green-100', text: 'text-green-800', label: 'G', border: 'border-green-300' },
  white: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'W', border: 'border-gray-300' },
  black: { bg: 'bg-gray-800', text: 'text-white', label: 'B', border: 'border-gray-900' },
};

export function DeckCard({ deck, player, onDelete }: DeckCardProps) {
  return (
    <Card hover>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-mtg-purple to-mtg-blue rounded-lg flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {deck.name}
            </h3>
          </div>
          {player && (
            <p className="text-sm text-gray-600 mb-3">
              Jogador: <span className="font-semibold">{player.name}</span>
            </p>
          )}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {deck.colors && deck.colors.length > 0 ? (
              deck.colors.map(color => {
                const badge = colorBadges[color.toLowerCase()];
                if (!badge) return null;
                return (
                  <span
                    key={color}
                    className={`px-3 py-1 rounded-lg text-sm font-bold border-2 ${badge.bg} ${badge.text} ${badge.border} shadow-sm`}
                  >
                    {badge.label}
                  </span>
                );
              })
            ) : (
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">Sem cores</span>
            )}
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            Criado em {format(new Date(deck.createdAt), "dd/MM/yyyy")}
          </p>
        </div>
        {onDelete && (
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => onDelete(deck.id)}
            className="flex items-center gap-1 flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Excluir</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
