import { useEffect, useState } from 'react';
import { scrollToHomeSection } from '@/features/marketing-home/utils/scroll-to-home-section';

interface Section {
  id: string;
  label: string;
}

interface NavDotsProps {
  sections: Section[];
}

export default function NavDots({ sections }: NavDotsProps) {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (const section of sections) {
          const element = document.getElementById(section.id);
          if (!element) continue;

          const { offsetTop, offsetHeight } = element;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection((prev) => (prev === section.id ? prev : section.id));
            break;
          }
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <nav className="fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 p-2 lg:flex xl:right-6">
      {sections.map((section) => (
        <div key={section.id} className="relative flex items-center group">
          <a
            href={`#${section.id}`}
            className="block"
            aria-label={`Navigate to ${section.label} section`}
            onClick={(event) => {
              event.preventDefault();

              const sectionElement = document.getElementById(section.id);
              if (sectionElement) {
                scrollToHomeSection(sectionElement);

                window.history.pushState(null, '', `#${section.id}`);
              }
            }}
          >
            <span
              className={`h-2 w-2 rounded-full transition-all duration-300 hover:bg-[#9933FF] cursor-pointer ${
                activeSection === section.id
                  ? 'bg-[#00CCFF] shadow-[0_0_8px_rgba(0,204,255,0.8)] scale-[1.3]'
                  : 'bg-gray-500'
              }`}
              aria-hidden="true"
            />
          </a>
          <span className="opacity-0 group-hover:opacity-100 absolute right-full mr-2 text-white text-xs whitespace-nowrap transition-opacity duration-300 pointer-events-none">
            {section.label}
          </span>
        </div>
      ))}
    </nav>
  );
}
