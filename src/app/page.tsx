'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { MintCompanion } from '@/components/common/MintCompanion';
import { Toast } from '@/components/common/Toast';
import { LandingPage } from '@/components/landing/LandingPage';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { FinancialSimulator } from '@/components/simulation/FinancialSimulator';
import { LessonsView } from '@/components/learning/LessonsView';
import { InstructorPortal } from '@/components/instructor/InstructorPortal';
import { ProfileView } from '@/components/profile/ProfileView';

export default function Home() {
  const { currentTab, isAuthenticated } = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center text-amber-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black text-2xl animate-pulse">
            S
          </div>
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
            Loading STACKED...
          </span>
        </div>
      </div>
    );
  }

  // If user is not authenticated or explicitly selected landing page
  if (!isAuthenticated || currentTab === 'landing') {
    return (
      <>
        <LandingPage />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex flex-col">
      {/* Sticky Global Top Header */}
      <Header />

      {/* Main Body Layout */}
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic View Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && <StudentDashboard />}
          {currentTab === 'simulations' && <FinancialSimulator />}
          {currentTab === 'lessons' && <LessonsView />}
          {currentTab === 'instructor' && <InstructorPortal />}
          {currentTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <MobileNav />

      {/* MINT Mascot AI Companion Drawer */}
      <MintCompanion />

      {/* Gamification Toast Notification */}
      <Toast />
    </div>
  );
}
