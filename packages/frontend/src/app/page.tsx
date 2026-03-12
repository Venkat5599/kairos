'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StatsCards from '@/components/StatsCards';
import IntentTerminal from '@/components/IntentTerminal';
import IntentList from '@/components/IntentList';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { useContractStats } from '@/hooks/useContractStats';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { stats, loading, error } = useContractStats();

  const handleIntentCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />
        <HeroSection />
        
        {error && (
          <div className="glass-panel p-4 border-l-4 border-red-500">
            <p className="text-red-400 font-mono text-sm">⚠️ {error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Content */}
          <div className="lg:col-span-8 space-y-6">
            <StatsCards stats={stats} loading={loading} />
            <IntentTerminal onIntentCreated={handleIntentCreated} />
            <IntentList key={refreshKey} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
