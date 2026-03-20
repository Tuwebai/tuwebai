import { Link } from 'react-router-dom';

import { MAIN_NAVIGATION, prefetchNavigationPath } from './navigation';

interface MobileNavbarLinksProps {
  activePage: string;
  onCloseMenu: () => void;
  onSectionSelect: (sectionId: string) => void;
}

export function MobileNavbarLinks({
  activePage,
  onCloseMenu,
  onSectionSelect,
}: MobileNavbarLinksProps) {
  return (
    <>
      {MAIN_NAVIGATION.map((item) => (
        <div key={item.name} className="border-b border-gray-800 pb-3">
          <Link
            to={item.href}
            onMouseEnter={() => prefetchNavigationPath(item.href)}
            onFocus={() => prefetchNavigationPath(item.href)}
            onTouchStart={() => prefetchNavigationPath(item.href)}
            className={`block py-3 text-lg font-medium ${
              activePage === item.name ? 'text-[#00CCFF]' : 'text-gray-200'
            }`}
            onClick={() => {
              if (!item.sections) {
                onCloseMenu();
              }
            }}
          >
            {item.name}
          </Link>

          {item.sections ? (
            <div className="mt-2 space-y-1 pl-3 sm:pl-4">
              {item.sections.map((section) => (
                <button
                  key={section.id}
                  className="block w-full rounded-lg px-2 py-2 text-left text-sm text-gray-400 hover:bg-white/[0.03] hover:text-white"
                  onClick={() => onSectionSelect(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
}
