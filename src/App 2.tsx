import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TopNav, MobileSidebar } from '@/components/layout/Navigation';
import { useAppStore } from '@/store/appStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// Page imports
import { DashboardPage } from '@/pages/Dashboard';
import { InvestigationsPage } from '@/pages/Investigations';
import { InvestigationDetailPage } from '@/pages/InvestigationDetail';
import { AnalyticsPage } from '@/pages/Analytics';
import { MapPage } from '@/pages/Map';
import { RecommendationsPage } from '@/pages/Recommendations';
import { NotebookPage } from '@/pages/Notebook';
import { ExportPage } from '@/pages/Export';
import { SettingsPage } from '@/pages/Settings';
import { AustinDeepAnalysisPage } from '@/pages/AustinDeepAnalysis';
import { ResearchPage } from '@/pages/Research';

function AppShell() {
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopNav />
      <MobileSidebar />

      {/* Main content — offset for: 36px dark bar + 48px brand bar + 46px tab nav = 130px */}
      <main className="flex-1 pt-[130px] bg-[#f5f7f9]">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
          <Routes>
            <Route path="/"                   element={<DashboardPage />} />
            <Route path="/investigations"     element={<InvestigationsPage />} />
            <Route path="/investigations/:id" element={<InvestigationDetailPage />} />
            <Route path="/analytics"          element={<AnalyticsPage />} />
            <Route path="/map"                element={<MapPage />} />
            <Route path="/recommendations"   element={<RecommendationsPage />} />
            <Route path="/notebook"           element={<NotebookPage />} />
            <Route path="/austin"             element={<AustinDeepAnalysisPage />} />
            <Route path="/research"           element={<ResearchPage />} />
            <Route path="/export"             element={<ExportPage />} />
            <Route path="/settings"           element={<SettingsPage />} />
          </Routes>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-3 px-6 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          NTSB Aviation Research Explorer — Educational Use Only
        </span>
        <span className="text-xs text-gray-400 font-mono">
          Press <kbd className="border border-gray-300 bg-gray-100 px-1 text-[10px]">/</kbd> to search
        </span>
      </footer>
    </div>
  );
}

export default function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    // Keep dark/light class logic for Settings toggle, but default is light
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
