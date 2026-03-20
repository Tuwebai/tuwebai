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
              activePage === item.name ? 'text-[#00CCFF]' : 'text-gray-300 hover:text-white'
            }`}
          >
            {item.name}
          </Link>

          {item.sections?.length ? (
            <div className="absolute left-0 z-50 mt-2 w-56 rounded-md bg-[#0a0a0f] opacity-0 invisible shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="py-1">
                {item.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => onSectionSelect(section.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#121217] hover:text-white"
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
