'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import IntentTerminal from '@/components/IntentTerminal';
import IntentList from '@/components/IntentList';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import QuickTutorial from '@/components/QuickTutorial';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import IntentTemplates from '@/components/IntentTemplates';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [intentCommand, setIntentCommand] = useState('');

  const handleIntentCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleTemplateSelect = (command: string) => {
    setIntentCommand(command);
    document.getElementById('intent-terminal')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <QuickTutorial />
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Header />
          <HeroSection />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Intent Terminal - First thing users see */}
              <div id="intent-terminal">
                <IntentTerminal 
                  onIntentCreated={handleIntentCreated}
                  initialCommand={intentCommand}
                />
              </div>
              
              {/* Analytics Dashboard */}
              <AnalyticsDashboard />
              
              {/* Intent Templates */}
              <IntentTemplates onSelectTemplate={handleTemplateSelect} />
              
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
    </>
  );
}
