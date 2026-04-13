import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useIntersectionObserver } from '@/core/hooks/use-intersection-observer';
import ShowroomCategoryFilter from '@/features/marketing-home/components/showroom-category-filter';
import ShowroomProjectCard from '@/features/marketing-home/components/showroom-project-card';
import ShowroomSectionCta from '@/features/marketing-home/components/showroom-section-cta';
import ShowroomSectionHeader from '@/features/marketing-home/components/showroom-section-header';
import type { ShowroomProject } from '@/features/marketing-home/components/showroom-types';
import {
  DEFAULT_SHOWROOM_CATEGORY,
  SHOWROOM_CATEGORY_NAMES,
  SHOWROOM_PROJECTS,
} from '@/features/marketing-home/content/showroom-content';

const ShowroomProjectModal = lazy(
  () => import('@/features/marketing-home/components/showroom-project-modal'),
);

interface ShowroomSectionProps {
  setRef: (ref: HTMLElement | null) => void;
}

export default function ShowroomSection({ setRef }: ShowroomSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: titleRef, hasIntersected: titleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: subtitleRef, hasIntersected: subtitleVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: projectsRef, hasIntersected: projectsVisible } = useIntersectionObserver<HTMLDivElement>();
  const [activeCategory, setActiveCategory] = useState<string>(DEFAULT_SHOWROOM_CATEGORY);
  const [selectedProject, setSelectedProject] = useState<ShowroomProject | null>(null);
  const [hasShownTitle, setHasShownTitle] = useState(false);
  const [hasShownSubtitle, setHasShownSubtitle] = useState(false);
  const [hasShownProjects, setHasShownProjects] = useState(false);

  useEffect(() => {
    if (titleVisible) setHasShownTitle(true);
    if (subtitleVisible) setHasShownSubtitle(true);
    if (projectsVisible) setHasShownProjects(true);
  }, [projectsVisible, subtitleVisible, titleVisible]);
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedProject]);

  if (sectionRef.current && !sectionRef.current.hasAttribute('data-ref-set')) {
    setRef(sectionRef.current);
    sectionRef.current.setAttribute('data-ref-set', 'true');
  }

  const filteredProjects = useMemo(
    () =>
      activeCategory === DEFAULT_SHOWROOM_CATEGORY
        ? SHOWROOM_PROJECTS
        : SHOWROOM_PROJECTS.filter((project) => project.category === activeCategory),
    [activeCategory],
  );
  const selectedProjectIndex = selectedProject ? filteredProjects.findIndex((project) => project.id === selectedProject.id) : -1;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedProject) {
        return;
      }

      if (event.key === 'Escape') {
        setSelectedProject(null);
        return;
      }

      if (event.key === 'ArrowLeft' && selectedProjectIndex > 0) {
        setSelectedProject(filteredProjects[selectedProjectIndex - 1]);
        return;
      }

      if (
        event.key === 'ArrowRight' &&
        selectedProjectIndex >= 0 &&
        selectedProjectIndex < filteredProjects.length - 1
      ) {
        setSelectedProject(filteredProjects[selectedProjectIndex + 1]);
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredProjects, selectedProject, selectedProjectIndex]);

  const categories = useMemo(() => [DEFAULT_SHOWROOM_CATEGORY, ...Array.from(new Set(SHOWROOM_PROJECTS.map((project) => project.category)))], []);

  const handleProjectClick = (project: ShowroomProject) => {
    setSelectedProject(project);
  };

  const handlePrevProject = () => {
    if (selectedProjectIndex > 0) {
      setSelectedProject(filteredProjects[selectedProjectIndex - 1]);
    }
  };

  const handleNextProject = () => {
    if (selectedProjectIndex >= 0 && selectedProjectIndex < filteredProjects.length - 1) {
      setSelectedProject(filteredProjects[selectedProjectIndex + 1]);
    }
  };

  const handleVisitWebsite = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="showroom" ref={sectionRef} className="landing-anchor-section relative flex items-center justify-center bg-transparent py-20">
      <div className="container z-10 mx-auto px-4">
        <ShowroomSectionHeader
          hasShownSubtitle={hasShownSubtitle}
          hasShownTitle={hasShownTitle}
          subtitleRef={subtitleRef}
          titleRef={titleRef}
        />

        <ShowroomCategoryFilter
          activeCategory={activeCategory}
          categories={categories}
          categoryNames={SHOWROOM_CATEGORY_NAMES}
          onSelect={setActiveCategory}
        />

        <div ref={projectsRef} className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <ShowroomProjectCard
              key={project.id}
              categoryLabel={SHOWROOM_CATEGORY_NAMES[project.category] || project.category}
              hasShownProjects={hasShownProjects}
              index={index}
              onOpen={handleProjectClick}
              onVisit={handleVisitWebsite}
              project={project}
            />
          ))}
        </div>

        {selectedProject && (
          <Suspense fallback={null}>
            <ShowroomProjectModal
              project={selectedProject}
              categoryLabel={SHOWROOM_CATEGORY_NAMES[selectedProject.category] || selectedProject.category}
              currentIndex={selectedProjectIndex}
              totalProjects={filteredProjects.length}
              hasPrev={selectedProjectIndex > 0}
              hasNext={selectedProjectIndex >= 0 && selectedProjectIndex < filteredProjects.length - 1}
              prevLabel={selectedProjectIndex > 0 ? filteredProjects[selectedProjectIndex - 1].title : undefined}
              nextLabel={selectedProjectIndex >= 0 && selectedProjectIndex < filteredProjects.length - 1 ? filteredProjects[selectedProjectIndex + 1].title : undefined}
              onPrev={handlePrevProject}
              onNext={handleNextProject}
              onClose={() => setSelectedProject(null)}
            />
          </Suspense>
        )}

        <ShowroomSectionCta />
      </div>
    </section>
  );
}
