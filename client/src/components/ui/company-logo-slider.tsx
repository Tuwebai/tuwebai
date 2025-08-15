import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface CompanyLogoSliderProps {
  className?: string;
}

export default function CompanyLogoSlider({ className = '' }: CompanyLogoSliderProps) {
  const { ref, hasIntersected } = useIntersectionObserver();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`w-full py-8 ${className}`}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center">
          <div className="flex flex-col items-center justify-center h-20">
            <div className="w-16 h-16 bg-gray-800 bg-opacity-50 rounded-lg flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-[#00CCFF] overflow-hidden">
              <img 
                src="/lhdecant-logo.jpg" 
                alt="Logo de LH Decants"
                className="w-full h-full object-contain p-2"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">LH Decants</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}