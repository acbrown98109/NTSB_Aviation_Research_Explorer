import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';

// ============================================================
// Global keyboard shortcut handler
// ============================================================

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { settings, setAdvancedFiltersOpen, advancedFiltersOpen, setTheme, theme } = useAppStore();

  useEffect(() => {
    if (!settings.keyboardShortcuts) return;

    const shortcuts: Shortcut[] = [
      {
        key: '/',
        description: 'Focus search',
        action: () => {
          const el = document.querySelector<HTMLInputElement>('[data-search-input]');
          el?.focus();
        },
      },
      {
        key: 'g',
        description: 'Go to Dashboard',
        action: () => navigate('/'),
      },
      {
        key: 'i',
        description: 'Go to Investigations',
        action: () => navigate('/investigations'),
      },
      {
        key: 'a',
        description: 'Go to Analytics',
        action: () => navigate('/analytics'),
      },
      {
        key: 'm',
        description: 'Go to Map',
        action: () => navigate('/map'),
      },
      {
        key: 'n',
        description: 'Go to Notebook',
        action: () => navigate('/notebook'),
      },
      {
        key: 'f',
        description: 'Toggle advanced filters',
        action: () => setAdvancedFiltersOpen(!advancedFiltersOpen),
      },
      {
        key: 't',
        description: 'Toggle theme',
        action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      },
      {
        key: 'Escape',
        description: 'Clear / close',
        action: () => {
          const el = document.querySelector<HTMLInputElement>('[data-search-input]');
          if (el && document.activeElement === el) {
            el.blur();
          }
        },
      },
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        if (e.key === 'Escape') {
          shortcuts.find((s) => s.key === 'Escape')?.action();
        }
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : true;
        if (e.key === shortcut.key && ctrlMatch && shiftMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, settings.keyboardShortcuts, advancedFiltersOpen, setAdvancedFiltersOpen, theme, setTheme]);
}
