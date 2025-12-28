import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-mtg-blue">
              🎮 MTG Tournament Manager
            </h1>
          </Link>
          <nav className="flex gap-4">
            <Link 
              href="/players" 
              className="text-gray-700 hover:text-mtg-blue font-medium transition-colors"
            >
              Jogadores
            </Link>
            <Link 
              href="/matches" 
              className="text-gray-700 hover:text-mtg-blue font-medium transition-colors"
            >
              Partidas
            </Link>
            <Link 
              href="/stats" 
              className="text-gray-700 hover:text-mtg-blue font-medium transition-colors"
            >
              Estatísticas
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

