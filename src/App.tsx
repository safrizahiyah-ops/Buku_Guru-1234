import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { Buku1View } from './components/buku1/Buku1View';
import { Buku2View } from './components/buku2/Buku2View';
import { Buku3View } from './components/buku3/Buku3View';
import { Buku4View } from './components/buku4/Buku4View';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // AI Prompt preset state if passed from other views
  const [aiPresetPrompt, setAiPresetPrompt] = useState<string>('');
  const [aiPresetType, setAiPresetType] = useState<any>('tp');

  const handleNavigate = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    setActiveSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAIWithPrompt = (prompt: string, type: any) => {
    setAiPresetPrompt(prompt);
    setAiPresetType(type);
    setActiveTab('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          onNavigate={handleNavigate}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Workspace Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView onNavigate={handleNavigate} />
          )}

          {activeTab === 'buku1' && (
            <Buku1View
              initialSubTab={activeSubTab || 'cp'}
              onOpenAIWithPrompt={handleOpenAIWithPrompt}
            />
          )}

          {activeTab === 'buku2' && (
            <Buku2View
              initialSubTab={activeSubTab || 'kaldik'}
            />
          )}

          {activeTab === 'buku3' && (
            <Buku3View
              initialSubTab={activeSubTab || 'nilai'}
            />
          )}

          {activeTab === 'buku4' && (
            <Buku4View
              initialSubTab={activeSubTab || 'refleksi'}
              onOpenAIWithPrompt={handleOpenAIWithPrompt}
            />
          )}

          {activeTab === 'ai' && (
            <AIAssistantView
              onNavigate={handleNavigate}
              presetPrompt={aiPresetPrompt}
              presetType={aiPresetType}
            />
          )}

          {activeTab === 'settings' && (
            <ProfileSettingsView
              initialSubTab={activeSubTab || 'profile'}
            />
          )}
        </main>
      </div>
    </div>
  );
}
