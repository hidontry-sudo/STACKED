'use client';

import React from 'react';
import { Home, BookOpen, Map, Wallet, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppTab } from '@/types';

export const MobileNav: React.FC = () => {
  const { currentTab, setCurrentTab, user } = useStore();

  const navItems = [
    { id: 'dashboard' as AppTab, icon: Home, label: 'Home' },
    { id: 'lessons' as AppTab, icon: BookOpen, label: 'Lessons' },
    { id: 'simulations' as AppTab, icon: Wallet, label: 'Wallet' },
    ...(user.role === 'admin'
      ? [{ id: 'instructor' as AppTab, icon: Map, label: 'Portal' }]
      : []),
    { id: 'profile' as AppTab, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 left-4 right-4 z-40">
      <div className="bg-[#141416]/95 backdrop-blur-lg border border-white/10 rounded-full px-3 py-2 flex items-center justify-around shadow-2xl shadow-black/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className="relative p-2.5 transition-all flex flex-col items-center group"
              aria-label={item.label}
            >
              {isActive ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-black shadow-gold-glow">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-zinc-200">
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
