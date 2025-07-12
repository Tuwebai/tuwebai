import { motion } from 'framer-motion';

interface AnimatedShapeProps {
  className?: string;
  type: 1 | 2;
  delay?: number;
}

export default function AnimatedShape({ className, type, delay = 0 }: AnimatedShapeProps) {
  const style = {
    animationDelay: `${delay}s`,
  };
  
  const isShape1 = type === 1;
  
  return (
    <motion.div
      className={`absolute opacity-20 z-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 1.5, delay: delay * 0.5 }}
      style={style}
    >
      <div 
        className={`
          ${isShape1 
            ? 'w-[300px] h-[300px] bg-gradient-to-br from-[#00CCFF] to-[#9933FF]' 
            : 'w-[250px] h-[250px] bg-gradient-to-br from-[#9933FF] to-[#00CCFF]'
          }
          animate-float animate-morph
          rounded-[32%_58%_69%_43%/48%_32%_59%_55%]
        `}
      />
    </motion.div>
  );
}
