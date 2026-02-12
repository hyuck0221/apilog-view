import { NavLink } from 'react-router-dom'
import { List, Settings, ChevronRight, ChevronLeft, CheckSquare, Square } from 'lucide-react'
import { useSourceStore } from '../../stores/sourceStore'
import { useT } from '../../i18n/useT'
import clsx from 'clsx'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const t = useT()
  const sources = useSourceStore(s => s.sources)
  const selectedSourceIds = useSourceStore(s => s.selectedSourceIds)
  const { toggleSelectedSource, selectAllSources, deselectAllSources } = useSourceStore()

  const allSelected = sources.filter(s => s.enabled).every(s => selectedSourceIds.includes(s.id))
  const enabledSources = sources.filter(s => s.enabled)

  const NAV_ITEMS = [
    { to: '/logs', label: t('sidebar.logs'), icon: List },
    { to: '/settings', label: t('sidebar.settings'), icon: Settings },
  ]

  return (
    <aside
      className={clsx(
        'flex flex-col h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900',
        'transition-all duration-200 flex-shrink-0',
        open ? 'w-56' : 'w-14'
      )}
    >
      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-2 mt-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors overflow-hidden',
              isActive
                ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {open && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-800 my-2" />

      {/* Sources section */}
      {open && (
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">
              {t('sidebar.sources')}
            </span>
            {enabledSources.length > 0 && (
              <button
                onClick={allSelected ? deselectAllSources : selectAllSources}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
              >
                {allSelected ? t('sidebar.deselectAll') : t('sidebar.selectAll')}
              </button>
            )}
          </div>

          {enabledSources.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-600 px-2 py-1">
              {t('sidebar.noSources')}{' '}
              <NavLink to="/settings" className="text-brand-600 dark:text-brand-400 hover:underline">
                {t('sidebar.addOne')}
              </NavLink>
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {enabledSources.map(source => {
                const isSelected = selectedSourceIds.includes(source.id)
                return (
                  <button
                    key={source.id}
                    onClick={() => toggleSelectedSource(source.id)}
                    className={clsx(
                      'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm w-full text-left',
                      'transition-colors',
                      isSelected
                        ? 'bg-gray-100 dark:bg-gray-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    )}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="flex-1 truncate text-gray-700 dark:text-gray-300">
                      {source.name}
                    </span>
                    {isSelected
                      ? <CheckSquare className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                      : <Square className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    }
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Collapse toggle */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-2">
        <button
          onClick={onToggle}
          className="btn-ghost w-full justify-center p-2"
          aria-label="Toggle sidebar"
        >
          {open
            ? <ChevronLeft className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />
          }
        </button>
      </div>
    </aside>
  )
}
