'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Player, Deck } from '@/lib/types';
import { format } from 'date-fns';
import { User, Calendar, Trash2, Gamepad2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { DeckCard } from './DeckCard';

interface PlayerCardProps {
  player: Player;
  decks?: Deck[];
  onDelete?: (id: string) => void;
  onAddDeck?: (playerId: string) => void;
  onDeleteDeck?: (deckId: string, playerId: string) => void;
  renderDeckForm?: (playerId: string) => React.ReactNode;
}

export function PlayerCard({ 
  player, 
  decks = [], 
  onDelete,
  onAddDeck,
  onDeleteDeck,
  renderDeckForm
}: PlayerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
            
            {/* Botão para expandir/colapsar decks */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-mtg-blue hover:text-mtg-purple transition-colors group"
            >
              <span>
                {isExpanded ? 'Ocultar' : 'Ver'} decks
                {decks.length > 0 && ` (${decks.length})`}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
            </button>
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

      {/* Dropdown/Accordion dos Decks */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-mtg-blue" />
              Decks ({decks.length})
            </h4>
            {onAddDeck && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onAddDeck(player.id)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Deck
              </Button>
            )}
          </div>

          {/* Formulário de novo deck (se fornecido) */}
          {renderDeckForm && renderDeckForm(player.id)}

          {/* Lista de decks */}
          {decks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {decks.map(deck => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  player={player}
                  onDelete={onDeleteDeck ? (id) => onDeleteDeck(id, player.id) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nenhum deck cadastrado</p>
              <p className="text-sm text-gray-400 mt-1">
                {onAddDeck && 'Clique em "Adicionar Deck" para começar'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
