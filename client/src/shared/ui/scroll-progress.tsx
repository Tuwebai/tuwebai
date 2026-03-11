import { useEffect, useState } from 'react';

interface ScrollProgressProps {
  color?: string;
  height?: number;
}

export default function ScrollProgress({
  color = '#00CCFF',
  height = 3
}: ScrollProgressProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const currentProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
        const nextVisible = window.scrollY > 100;

        setIsVisible((prev) => (prev === nextVisible ? prev : nextVisible));
        setScrollProgress((prev) => (Math.abs(prev - currentProgress) < 0.001 ? prev : currentProgress));
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${scrollProgress * 100}%`,
          backgroundColor: color,
          transition: 'width 0.1s ease-out'
        }}
      />
    </div>
  );
}
