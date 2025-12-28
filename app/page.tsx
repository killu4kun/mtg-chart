'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Gamepad2, Users, BarChart3, Sparkles, ArrowRight, Trophy, CheckCircle2, Zap, Shield, TrendingUp } from 'lucide-react';
import { playersAPI, matchesAPI, statsAPI } from '@/lib/api';

export default function Home() {
  const [stats, setStats] = useState({ players: 0, matches: 0, activePlayers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [players, matches, playerStats] = await Promise.all([
          playersAPI.getAll(),
          matchesAPI.getAll(),
          statsAPI.getAll(),
        ]);
        setStats({
          players: players.length,
          matches: matches.length,
          activePlayers: playerStats.length,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mtg-blue/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-mtg-purple/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mtg-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-mtg-blue/10 rounded-full blur-2xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-gradient-to-br from-mtg-blue to-mtg-purple rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MTG Manager</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/players" className="text-gray-300 hover:text-white transition-colors font-medium hover:scale-105 inline-block">
                Jogadores
              </Link>
              <Link href="/matches" className="text-gray-300 hover:text-white transition-colors font-medium hover:scale-105 inline-block">
                Partidas
              </Link>
              <Link href="/stats" className="text-gray-300 hover:text-white transition-colors font-medium hover:scale-105 inline-block">
                Estatísticas
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-20">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-mtg-blue via-mtg-purple to-mtg-blue rounded-3xl mb-8 shadow-2xl shadow-mtg-blue/50 relative">
              <Sparkles className="w-14 h-14 md:w-16 md:h-16 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-mtg-blue via-mtg-purple to-mtg-blue rounded-3xl animate-ping opacity-20" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-mtg-blue via-mtg-purple to-mtg-blue bg-clip-text text-transparent animate-gradient">
                MTG Tournament
              </span>
              <br />
              <span className="text-white">Manager</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed px-4">
              Sistema completo e profissional para gerenciar jogadores, decks e partidas de{' '}
              <span className="text-white font-semibold bg-gradient-to-r from-mtg-blue to-mtg-purple bg-clip-text text-transparent">
                Magic: The Gathering
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4">
              <Link href="/players" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group px-8 py-4 text-lg shadow-xl">
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/matches" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-lg">
                  Ver Partidas
                </Button>
              </Link>
            </div>

            {/* Real Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-mtg-blue/50 transition-all hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stats.players}</div>
                <div className="text-gray-400 flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Jogadores</span>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-mtg-purple/50 transition-all hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stats.matches}</div>
                <div className="text-gray-400 flex items-center justify-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  <span>Partidas</span>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-mtg-green/50 transition-all hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stats.activePlayers}</div>
                <div className="text-gray-400 flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Ativos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Tudo que você precisa para gerenciar seu torneio de Magic de forma profissional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-mtg-blue/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-mtg-blue/30 duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-mtg-blue/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-mtg-blue to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Gerenciar Jogadores</h3>
                <p className="text-gray-300 leading-relaxed mb-6 min-h-[72px]">
                  Cadastre jogadores, organize seus decks e mantenha todas as informações centralizadas em um só lugar.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-mtg-blue" />
                    <span>Cadastro completo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-mtg-blue" />
                    <span>Múltiplos decks</span>
                  </div>
                </div>
                <Link href="/players" className="inline-flex items-center text-mtg-blue hover:text-blue-400 font-semibold group/link">
                  Ver mais
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-mtg-purple/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-mtg-purple/30 duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-mtg-purple/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-mtg-purple to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Criar Partidas</h3>
                <p className="text-gray-300 leading-relaxed mb-6 min-h-[72px]">
                  Forme mesas com mínimo de 4 jogadores, registre resultados e acompanhe todo o histórico de partidas.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-mtg-purple" />
                    <span>Mínimo 4 jogadores</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-mtg-purple" />
                    <span>Histórico completo</span>
                  </div>
                </div>
                <Link href="/matches/new" className="inline-flex items-center text-mtg-purple hover:text-purple-400 font-semibold group/link">
                  Criar partida
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-mtg-green/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-mtg-green/30 duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-mtg-green/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-mtg-green to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Estatísticas</h3>
                <p className="text-gray-300 leading-relaxed mb-6 min-h-[72px]">
                  Acompanhe o desempenho de jogadores e decks com estatísticas detalhadas e visualizações.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-mtg-green" />
                    <span>Taxa de vitória</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-mtg-green" />
                    <span>Gráficos detalhados</span>
                  </div>
                </div>
                <Link href="/stats" className="inline-flex items-center text-mtg-green hover:text-green-400 font-semibold group/link">
                  Ver estatísticas
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 border-t border-white/10 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Por que escolher nosso sistema?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <Zap className="w-10 h-10 text-mtg-blue mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Rápido</h3>
              <p className="text-gray-400">Interface intuitiva e respostas instantâneas</p>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <Shield className="w-10 h-10 text-mtg-purple mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Confiável</h3>
              <p className="text-gray-400">Dados seguros e sistema estável</p>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Profissional</h3>
              <p className="text-gray-400">Torneios organizados e estatísticas precisas</p>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <Sparkles className="w-10 h-10 text-mtg-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Completo</h3>
              <p className="text-gray-400">Todas as ferramentas em um só lugar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 border-t border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Comece a gerenciar seu torneio de Magic agora mesmo. É rápido, fácil e gratuito!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/players" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-10 py-4 text-lg shadow-xl">
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/matches" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-10 py-4 text-lg bg-white/10 hover:bg-white/20 text-white border-white/20">
                Ver Partidas Existentes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
