'use client';

import { useState, useEffect, useMemo } from 'react';
import { PlayerCard } from '@/components/PlayerCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { BackButton } from '@/components/BackButton';
import { playersAPI, decksAPI } from '@/lib/api';
import { Player, Deck } from '@/lib/types';
import { DeckCard } from '@/components/DeckCard';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function PlayersPage() {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPlayerForDeck, setSelectedPlayerForDeck] = useState<string | null>(null);
  const [deckName, setDeckName] = useState('');
  const [deckColors, setDeckColors] = useState<string[]>([]);
  const [decks, setDecks] = useState<Record<string, Deck[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const fetchedPlayers = await playersAPI.getAll();
      setAllPlayers(fetchedPlayers);
      
      const decksMap: Record<string, Deck[]> = {};
      for (const player of fetchedPlayers) {
        decksMap[player.id] = await decksAPI.getAll(player.id);
      }
      setDecks(decksMap);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar jogadores por nome
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return allPlayers;
    const query = searchQuery.toLowerCase().trim();
    return allPlayers.filter(player => 
      player.name.toLowerCase().includes(query) ||
      (player.email && player.email.toLowerCase().includes(query))
    );
  }, [allPlayers, searchQuery]);

  // Paginação
  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const paginatedPlayers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPlayers.slice(startIndex, endIndex);
  }, [filteredPlayers, currentPage, itemsPerPage]);

  // Resetar página quando a busca mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

        {/* Barra de Busca e Controles */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Campo de Busca */}
            <div className="flex-1 w-full sm:max-w-md relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome ou email..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mtg-blue focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-gray-600">
                  {filteredPlayers.length} {filteredPlayers.length === 1 ? 'jogador encontrado' : 'jogadores encontrados'}
                </p>
              )}
            </div>

            {/* Controles de Paginação - Itens por página */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 whitespace-nowrap">
                  Itens por página:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mtg-blue focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {paginatedPlayers.length > 0 ? (
            paginatedPlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                decks={decks[player.id] || []}
                onDelete={handleDeletePlayer}
                onAddDeck={(playerId) => setSelectedPlayerForDeck(
                  selectedPlayerForDeck === playerId ? null : playerId
                )}
                onDeleteDeck={handleDeleteDeck}
                renderDeckForm={(playerId) => 
                  selectedPlayerForDeck === playerId ? (
                    <Card className="mb-4 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-mtg-blue/20">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="p-1 bg-mtg-blue rounded text-white text-xs">+</span>
                        Novo Deck
                      </h4>
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
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105 ${
                                  deckColors.includes(color.key)
                                    ? 'ring-2 ring-offset-2 ring-gray-400 shadow-lg'
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
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleCreateDeck(playerId)}
                            disabled={!deckName.trim()}
                            className="flex-1"
                          >
                            Criar Deck
                          </Button>
                          <Button 
                            variant="secondary"
                            onClick={() => {
                              setSelectedPlayerForDeck(null);
                              setDeckName('');
                              setDeckColors([]);
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : null
                }
              />
            ))
          ) : (
            <Card>
              <p className="text-gray-500 text-center py-12">
                {searchQuery 
                  ? `Nenhum jogador encontrado para "${searchQuery}"` 
                  : 'Nenhum jogador cadastrado ainda. Clique em "Novo Jogador" para começar.'}
              </p>
            </Card>
          )}

          {/* Controles de Paginação */}
          {totalPages > 1 && (
            <Card className="mt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} até {Math.min(currentPage * itemsPerPage, filteredPlayers.length)} de {filteredPlayers.length} jogadores
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      // Mostrar apenas algumas páginas ao redor da atual
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-mtg-blue to-blue-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
