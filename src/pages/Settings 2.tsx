import { useAppStore } from '@/store/appStore';
import { Card, SectionHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import type { AppSettings } from '@/types';

export function SettingsPage() {
  const { settings, updateSettings, theme, setTheme, resetFilters } = useAppStore();

  const ToggleSetting = ({
    label,
    description,
    settingKey,
  }: {
    label: string;
    description?: string;
    settingKey: keyof AppSettings;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium text-[#333333]">{label}</div>
        {description && <div className="text-xs text-[#888888] mt-0.5">{description}</div>}
      </div>
      <button
        onClick={() =>
          updateSettings({ [settingKey]: !settings[settingKey] } as Partial<AppSettings>)
        }
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          settings[settingKey] ? 'bg-[#0063a6]' : 'bg-[#cccccc]'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            settings[settingKey] ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#003b75' }}>Settings</h1>
        <p className="text-sm text-[#666666]">Configure the NTSB Aviation Research Explorer</p>
      </div>

      {/* Appearance */}
      <Card padding="md">
        <SectionHeader title="Appearance" className="mb-3" />
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-[#333333] block mb-2">Theme</label>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 text-sm font-medium border transition-all capitalize ${
                    theme === t
                      ? 'bg-[#e1f0fa] text-[#003b75] border-[#0063a6]'
                      : 'border-[#e0e0e0] text-[#666666] hover:text-[#333333]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#e0e0e0]">
            <ToggleSetting
              label="Compact view"
              description="Reduce card sizes for denser information display"
              settingKey="compactView"
            />
            <ToggleSetting
              label="Animations"
              description="Enable page transitions and motion effects"
              settingKey="animationsEnabled"
            />
          </div>
        </div>
      </Card>

      {/* Search & Data */}
      <Card padding="md">
        <SectionHeader title="Search & Data" className="mb-3" />
        <div className="divide-y divide-[#e0e0e0]">
          <div className="py-2">
            <label className="text-sm font-medium text-[#333333] block mb-1">
              Results per page
            </label>
            <select
              value={settings.resultsPerPage}
              onChange={(e) =>
                updateSettings({ resultsPerPage: Number(e.target.value) })
              }
              className="bg-white border border-[#cccccc] px-3 py-1.5 text-sm text-[#333333] focus:outline-none focus:border-[#0063a6]"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} results
                </option>
              ))}
            </select>
          </div>

          <div className="py-2">
            <label className="text-sm font-medium text-[#333333] block mb-1">
              Default sort
            </label>
            <select
              value={settings.defaultSort}
              onChange={(e) =>
                updateSettings({ defaultSort: e.target.value as AppSettings['defaultSort'] })
              }
              className="bg-white border border-[#cccccc] px-3 py-1.5 text-sm text-[#333333] focus:outline-none focus:border-[#0063a6]"
            >
              <option value="date_desc">Date (newest first)</option>
              <option value="date_asc">Date (oldest first)</option>
              <option value="severity">Severity</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>

          <ToggleSetting
            label="Show live weather"
            description="Display current METAR data alongside historical weather"
            settingKey="showWeather"
          />
          <ToggleSetting
            label="Auto-sync database"
            description="Automatically refresh local investigation cache"
            settingKey="autoSync"
          />
        </div>
      </Card>

      {/* AI Analysis */}
      <Card padding="md">
        <SectionHeader title="AI Analysis" className="mb-3" />
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-[#333333] block mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              value={settings.geminiApiKey}
              onChange={(e) => updateSettings({ geminiApiKey: e.target.value })}
              placeholder="Paste your Gemini API key…"
              className="w-full border border-[#cccccc] px-3 py-2 text-sm text-[#333333] focus:outline-none focus:border-[#0063a6]"
            />
            <p className="text-xs text-[#888888] mt-1">
              Required for the AI Research Analyzer. Get a free key at{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0063a6] hover:underline"
              >
                aistudio.google.com
              </a>
              . Stored locally in your browser only — never sent anywhere except Google.
            </p>
          </div>
          {settings.geminiApiKey && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2">
              ✓ API key saved — AI Research Analyzer is enabled.
            </div>
          )}
        </div>
      </Card>

      {/* Citations */}
      <Card padding="md">
        <SectionHeader title="Citations" className="mb-3" />
        <div>
          <label className="text-sm font-medium text-[#333333] block mb-2">
            Default citation format
          </label>
          <div className="flex gap-2">
            {(['APA', 'MLA', 'Chicago', 'IEEE'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => updateSettings({ defaultCitationFormat: fmt })}
                className={`px-3 py-1.5 text-sm font-medium border transition-all ${
                  settings.defaultCitationFormat === fmt
                    ? 'bg-[#e1f0fa] text-[#003b75] border-[#0063a6]'
                    : 'border-[#e0e0e0] text-[#666666] hover:text-[#333333]'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Keyboard shortcuts */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Keyboard Shortcuts" />
          <button
            onClick={() => updateSettings({ keyboardShortcuts: !settings.keyboardShortcuts })}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              settings.keyboardShortcuts ? 'bg-[#0063a6]' : 'bg-[#cccccc]'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                settings.keyboardShortcuts ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: '/', action: 'Focus search' },
            { key: 'g', action: 'Dashboard' },
            { key: 'i', action: 'Investigations' },
            { key: 'a', action: 'Analytics' },
            { key: 'm', action: 'Map' },
            { key: 'n', action: 'Notebook' },
            { key: 'f', action: 'Toggle filters' },
            { key: 't', action: 'Toggle theme' },
          ].map(({ key, action }) => (
            <div key={key} className="flex items-center gap-2">
              <kbd className="bg-[#f5f7f9] border border-[#e0e0e0] px-1.5 py-0.5 text-xs font-mono text-[#333333]">
                {key}
              </kbd>
              <span className="text-xs text-[#666666]">{action}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Data management */}
      <Card padding="md">
        <SectionHeader title="Data Management" className="mb-3" />
        <div className="space-y-3">
          <Button variant="danger" size="sm" onClick={resetFilters}>
            Reset All Filters
          </Button>
          <p className="text-xs text-[#888888]">
            This application stores data locally in your browser. No account required.
            All investigation data is sourced from publicly available NTSB reports.
          </p>
        </div>
      </Card>

      {/* About */}
      <Card padding="md">
        <SectionHeader title="About" className="mb-3" />
        <div className="space-y-2 text-sm text-[#666666]">
          <p><span className="text-[#333333] font-medium">NTSB Aviation Research Explorer</span> v1.0.0</p>
          <p>Built for undergraduate and graduate aviation safety research.</p>
          <p>
            Investigation data is sourced from the{' '}
            <a href="https://www.ntsb.gov/investigations" target="_blank" rel="noopener noreferrer" className="text-[#0063a6] hover:underline">
              National Transportation Safety Board
            </a>{' '}
            public database.
          </p>
          <p className="text-[#aaaaaa] text-xs">
            For educational and research use only. Not for operational aviation decision-making.
          </p>
        </div>
      </Card>
    </div>
  );
}
