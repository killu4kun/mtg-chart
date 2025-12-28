import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Player, Deck } from '@/lib/types';
import { format } from 'date-fns';
import { User, Calendar, Trash2, Gamepad2 } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  decks?: Deck[];
  onDelete?: (id: string) => void;
}

export function PlayerCard({ player, decks = [], onDelete }: PlayerCardProps) {

  return (
    <Card hover>
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-3 bg-gradient-to-br from-mtg-blue to-mtg-purple rounded-xl flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
              {player.name}
            </h3>
            {player.email && (
              <p className="text-sm text-gray-600 mb-3 break-all">
                {player.email}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 flex-shrink-0" />
                {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                Desde {format(new Date(player.createdAt), "dd/MM/yyyy")}
              </span>
            </div>
          </div>
        </div>
        {onDelete && (
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => onDelete(player.id)}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Excluir</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
