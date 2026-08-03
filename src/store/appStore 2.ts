import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchFilters, AppSettings, Investigation } from '@/types';

// ============================================================
// Global application state
// ============================================================

interface AppState {
  // Search & Filter
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Selected investigation (detail view)
  selectedInvestigation: Investigation | null;
  setSelectedInvestigation: (inv: Investigation | null) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  advancedFiltersOpen: boolean;
  setAdvancedFiltersOpen: (open: boolean) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Theme
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  dateRange: undefined,
  airport: undefined,
  states: [],
  aircraftManufacturers: [],
  aircraftModels: [],
  operators: [],
  eventTypes: [],
  subTypes: [],
  severity: [],
  runwayIncursionCategories: [],
  weatherConditions: [],
  flightCategories: [],
  nighttime: undefined,
  humanFactors: [],
  infrastructureCategories: [],
  status: [],
  hasRecommendations: undefined,
};

const defaultSettings: AppSettings = {
  theme: 'light',
  defaultMapView: 'standard',
  resultsPerPage: 25,
  defaultSort: 'date_desc',
  autoSync: true,
  showWeather: true,
  compactView: false,
  defaultCitationFormat: 'APA',
  keyboardShortcuts: true,
  animationsEnabled: true,
  geminiApiKey: '',
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      resetFilters: () => set({ filters: defaultFilters }),

      selectedInvestigation: null,
      setSelectedInvestigation: (inv) => set({ selectedInvestigation: inv }),

      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      advancedFiltersOpen: false,
      setAdvancedFiltersOpen: (open) => set({ advancedFiltersOpen: open }),
      activeModal: null,
      setActiveModal: (modal) => set({ activeModal: modal }),

      settings: defaultSettings,
      updateSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),

      theme: 'light',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.classList.toggle('light', theme === 'light');
      },
    }),
    {
      name: 'ntsb-app-state',
      partialize: (state) => ({
        settings: state.settings,
        theme: state.theme,
      }),
    }
  )
);
