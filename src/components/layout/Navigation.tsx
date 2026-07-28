import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  HomeIcon,
  DocumentMagnifyingGlassIcon,
  ChartBarIcon,
  MapIcon,
  LightBulbIcon,
  BookOpenIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  ShieldExclamationIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/store/appStore';

const navItems = [
  { to: '/',               label: 'Dashboard',       icon: HomeIcon,                    end: true },
  { to: '/investigations', label: 'Investigations',  icon: DocumentMagnifyingGlassIcon },
  { to: '/analytics',      label: 'Analytics',       icon: ChartBarIcon },
  { to: '/map',            label: 'Map',             icon: MapIcon },
  { to: '/recommendations',label: 'Recommendations', icon: LightBulbIcon },
  { to: '/notebook',       label: 'Notebook',        icon: BookOpenIcon },
  { to: '/austin',         label: 'Austin Deep Dive',icon: ShieldExclamationIcon },
  { to: '/export',         label: 'Export',          icon: ArrowDownTrayIcon },
  { to: '/settings',       label: 'Settings',        icon: Cog6ToothIcon },
];

export function TopNav() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const location = useLocation();

  const currentPage = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* ── Dark navy utility bar ─────────────────────────────── */}
      <div style={{ backgroundColor: '#003b75' }}>
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="white" opacity={0.9}>
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            <span
              className="text-white text-xs font-bold uppercase"
              style={{ letterSpacing: '1.5px', opacity: 0.95 }}
            >
              NTSB Aviation Research Explorer
            </span>
          </div>
          <span
            className="hidden sm:block text-white text-[11px] uppercase"
            style={{ letterSpacing: '1px', opacity: 0.65 }}
          >
            Aviation Safety Research Platform
          </span>
        </div>
      </div>

      {/* ── White brand bar ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between h-12">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 mr-2 text-[#003b75] hover:bg-[#f5f7f9] transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>

          {/* Left: page context */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs uppercase font-semibold" style={{ color: '#003b75', letterSpacing: '1px' }}>
                {currentPage?.label ?? 'Dashboard'}
              </span>
            </div>
            <div className="md:hidden">
              <span className="text-sm font-semibold" style={{ color: '#003b75' }}>
                {currentPage?.label}
              </span>
            </div>
          </div>

          {/* Right: meta info */}
          <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: '#888888' }}>
            <span>Educational Use Only</span>
            <span>·</span>
            <span>10 Investigations</span>
          </div>
        </div>
      </div>

      {/* ── Tab navigation bar ─────────────────────────────────── */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-6">
          <nav className="flex flex-wrap">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold transition-all border-b-[3px]',
                    isActive
                      ? 'border-[#0063a6] text-[#003b75]'
                      : 'border-transparent text-[#003b75] hover:bg-[#f5f7f9]'
                  )
                }
                style={({ isActive }) => isActive ? { backgroundColor: '#e1f0fa' } : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed left-0 top-[93px] bottom-0 z-30 w-64 bg-white border-r border-gray-200 lg:hidden overflow-y-auto transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors border-l-4',
                  isActive
                    ? 'border-[#0063a6] text-[#003b75]'
                    : 'border-transparent text-[#003b75] hover:bg-[#f5f7f9]'
                )
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#e1f0fa' } : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
