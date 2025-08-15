import { useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface CompanyLogoSliderProps {
  className?: string;
}

export default function CompanyLogoSlider({ className = '' }: CompanyLogoSliderProps) {
  const sliderRef = useRef(null);
  const { ref, hasIntersected } = useIntersectionObserver();

  // Lista de logos de empresas con sus nombres
  const companyLogos = [
    {
      name: 'LH Decants',
      logo: '/lhdecant-logo.jpg'
    }
  ];

  // Configuración del slider
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: Math.min(5, companyLogos.length),
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(4, companyLogos.length),
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(3, companyLogos.length),
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: Math.min(2, companyLogos.length),
        }
      }
    ]
  };

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
        <Slider {...settings} className="company-logo-slider">
          {companyLogos.map((company, index: number) => (
            <div key={index} className="px-4">
              <div className="flex flex-col items-center justify-center h-20">
                <div className="w-16 h-16 bg-gray-800 bg-opacity-50 rounded-lg flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-[#00CCFF] overflow-hidden">
                  <img 
                    src={company.logo} 
                    alt={`Logo de ${company.name}`}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">{company.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </motion.div>
  );
}