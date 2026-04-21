import { Link } from 'react-router-dom';

import { MAIN_NAVIGATION, prefetchNavigationPath } from './navigation';

interface DesktopNavbarLinksProps {
  activePage: string;
  onSectionSelect: (sectionId: string) => void;
}

export function DesktopNavbarLinks({
  activePage,
  onSectionSelect,
}: DesktopNavbarLinksProps) {
  return (
    <>
      {MAIN_NAVIGATION.map((item) => (
        <div key={item.name} className="group relative shrink-0">
          <Link
            to={item.href}
            onMouseEnter={() => prefetchNavigationPath(item.href)}
            onFocus={() => prefetchNavigationPath(item.href)}
            onTouchStart={() => prefetchNavigationPath(item.href)}
            className={`whitespace-nowrap text-sm font-medium transition-colors ${
              activePage === item.name ? 'text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            {item.name}
          </Link>
          <span
            className={`absolute -bottom-1 left-0 h-px bg-[var(--signal)] transition-all duration-300 ${
              activePage === item.name ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />

          {item.sections?.length ? (
            <div className="invisible absolute left-0 z-50 mt-3 w-56 rounded-2xl border border-white/10 bg-[var(--bg-overlay)]/95 opacity-0 shadow-[var(--shadow-elevated)] backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="py-1">
                {item.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => onSectionSelect(section.id)}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
}
