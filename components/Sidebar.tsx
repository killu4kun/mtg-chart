'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  Users, 
  Gamepad2, 
  PlusCircle, 
  BarChart3,
  Sparkles 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Jogadores', href: '/players', icon: Users },
  { name: 'Partidas', href: '/matches', icon: Gamepad2 },
  { name: 'Nova Partida', href: '/matches/new', icon: PlusCircle },
  { name: 'Estatísticas', href: '/stats', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen p-6 border-r border-gray-700 shadow-xl sticky top-0">
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-br from-mtg-blue to-mtg-purple rounded-lg group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">MTG Manager</h2>
            <p className="text-gray-400 text-xs">Tournament System</p>
          </div>
        </Link>
      </div>
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-gradient-to-r from-mtg-blue to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:translate-x-1'
              )}
            >
              <Icon className={clsx(
                'w-5 h-5 transition-transform',
                isActive ? 'scale-110' : 'group-hover:scale-110'
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-8 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          <p>Magic: The Gathering</p>
          <p className="mt-1">Tournament Manager</p>
        </div>
      </div>
    </aside>
  );
}
