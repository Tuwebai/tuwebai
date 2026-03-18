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
        <div key={item.name} className="border-b border-gray-800 pb-4">
          <Link
            to={item.href}
            onMouseEnter={() => prefetchNavigationPath(item.href)}
            onFocus={() => prefetchNavigationPath(item.href)}
            onTouchStart={() => prefetchNavigationPath(item.href)}
            className={`text-lg font-medium block py-2 ${
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
            <div className="pl-4 mt-2 space-y-2">
              {item.sections.map((section) => (
                <button
                  key={section.id}
                  className="block text-left py-2 text-sm text-gray-400 hover:text-white w-full"
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
