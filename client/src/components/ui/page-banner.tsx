import { motion } from 'framer-motion';
import AnimatedShape from './animated-shape';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  showShapes?: boolean;
  className?: string;
}

export default function PageBanner({ title, subtitle, showShapes = true, className = '' }: PageBannerProps) {
  return (
    <section className={`relative bg-gradient-1 pt-24 pb-16 ${className}`}>
      {showShapes && (
        <>
          <AnimatedShape type={1} className="top-[10%] right-[-150px]" delay={1} />
          <AnimatedShape type={2} className="bottom-[10%] left-[-100px]" delay={2} />
        </>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-rajdhani font-bold text-4xl md:text-6xl mb-6">
              <span className="gradient-text">{title}</span>
            </h1>
            
            {subtitle && (
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}