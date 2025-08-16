import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedShape from '../components/ui/animated-shape';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAllTestimonials, Testimonial as TestimonialType } from '@/services/testimonials';


// Tipo para miembros del equipo
interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  image: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  personalSite?: string;
  longBio?: string;
  achievements?: string[];
}

// Tipo para proyectos destacados
interface FeaturedProject {
  id: number;
  title: string;
  description: string;
  image: string;
  memberId: number;
}

// Tipo para testimonios
interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  text: string;
  image: string;
  rating: number;
}

// Datos del equipo
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Juanchi López",
    role: "CEO & Full-Stack",
    bio: "Desarrollador Full-Stack apasionado por crear soluciones digitales innovadoras. Con experiencia en tecnologías modernas y un enfoque centrado en resultados, lidero proyectos que transforman ideas en realidades digitales exitosas.",
    skills: ["Desarrollo Full-Stack", "React", "Node.js", "TypeScript", "Firebase", "MongoDB", "AWS"],
    image: "https://tuwebai.netlify.app/image_perfil.jpg",
    linkedin: "https://www.linkedin.com/in/juan-esteban-l%C3%B3pez-pachao-040b89345?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    twitter: "https://www.instagram.com/juanchi_lopezd3?igsh=cjM2emZzd2xucXI3",
    longBio: "Juanchi es un desarrollador Full-Stack con una pasión innata por la tecnología y la innovación. Especializado en crear aplicaciones web modernas y escalables, combina habilidades técnicas sólidas con una visión estratégica para desarrollar soluciones que no solo cumplen con los requisitos técnicos, sino que también generan valor real para los usuarios y las empresas. Su experiencia abarca desde el desarrollo frontend con React y TypeScript hasta la implementación de arquitecturas backend robustas con Node.js y bases de datos modernas.",
    achievements: [
      "Desarrollo de sitios web premium como LH Decants",
      "Especialista en tecnologías modernas como React, Node.js y Firebase",
      "Líder en implementación de soluciones digitales escalables"
    ]
  }
];

// Proyectos destacados reales
const featuredProjects: FeaturedProject[] = [
  {
    id: 1,
    title: "LH Decants - E-commerce Premium",
    description: "Sitio web corporativo premium para empresa de perfumes y fragancias exclusivas. Aumento del 150% en ventas online",
    image: "/lhdecant-card.png",
    memberId: 1 // Juanchi López
  }
];

// Testimonios (se cargarán desde la base de datos)
const testimonials: Testimonial[] = [];

export default function Equipo() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cargar testimonios desde la base de datos
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        const allTestimonials = await getAllTestimonials();
        
        // Convertir testimonios de Firestore al formato local
        const formattedTestimonials: Testimonial[] = allTestimonials.map((t, index) => ({
          id: index + 1,
          name: t.name,
          company: t.company,
          role: "Cliente",
          text: t.testimonial,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0D8ABC&color=fff`,
          rating: 5
        }));
        
        setTestimonials(formattedTestimonials);
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    loadTestimonials();
  }, []);

  // Testimonial autoplay (solo si hay testimonios)
  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Encontrar proyectos destacados por miembro
  const getMemberProjects = (memberId: number) => {
    return featuredProjects.filter(project => project.memberId === memberId);
  };

  return (
    <main className="bg-[#0a0a0f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-1 pt-24 pb-16">
        <AnimatedShape type={1} className="top-[10%] right-[-150px]" delay={1} />
        <AnimatedShape type={2} className="bottom-[10%] left-[-100px]" delay={2} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al inicio
              </Link>
              
              <h1 className="font-rajdhani font-bold text-4xl md:text-6xl mb-6">
                <span className="gradient-text">Nuestro Equipo</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Conoce a los profesionales detrás de TuWeb.ai. Un equipo multidisciplinar 
                apasionado por crear soluciones digitales que generan resultados.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="bg-[#121217] rounded-xl overflow-hidden border border-gray-800 h-full flex flex-col cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => setSelectedMember(member)}
              >
                <div className="h-64 bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center relative">
                  {member.image ? (
                    <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-[#121217]">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-40 rounded-full bg-[#1a1a23] border-4 border-[#121217] flex items-center justify-center">
                      <span className="text-4xl font-bold gradient-text">{member.name.charAt(0)}{member.name.split(' ')[1].charAt(0)}</span>
                    </div>
                  )}
                  
                  {/* Indicador de "Ver más" */}
                  <div className="absolute bottom-4 right-4 bg-[#00CCFF] rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="font-rajdhani font-bold text-2xl mb-1 text-white">{member.name}</h3>
                  <p className="text-[#00CCFF] font-medium mb-4">{member.role}</p>
                  
                  <p className="text-gray-300 mb-4 flex-grow">{member.bio}</p>
                  
                  <div className="mt-auto">
                    {/* Social icons */}
                    {(member.linkedin || member.twitter || member.github || member.personalSite) && (
                      <div className="flex space-x-2 mb-4">
                        {member.linkedin && (
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#0077B5] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        
                        {member.twitter && (
                          <a 
                            href={member.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#E4405F] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        )}
                        
                        {member.github && (
                          <a 
                            href={member.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                            </svg>
                          </a>
                        )}
                        
                        {member.personalSite && (
                          <a 
                            href={member.personalSite} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#9933FF] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                    
                    <h4 className="font-medium text-white mb-2">Especialidades:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-1 bg-[#1a1a23] rounded text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Modal para detalles del miembro */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="bg-[#121217] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Header con gradiente */}
                <div className="h-40 md:h-60 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] relative">
                  <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
                    onClick={() => setSelectedMember(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Foto y datos básicos */}
                <div className="px-6 md:px-12 pb-6 relative">
                  <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-20">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#121217] overflow-hidden flex-shrink-0 bg-[#1a1a23] flex items-center justify-center">
                      {selectedMember.image ? (
                        <img 
                          src={selectedMember.image} 
                          alt={selectedMember.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold gradient-text">
                          {selectedMember.name.charAt(0)}{selectedMember.name.split(' ')[1].charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    <div className="md:pb-2">
                      <h2 className="font-rajdhani font-bold text-3xl text-white">{selectedMember.name}</h2>
                      <p className="text-[#00CCFF] font-medium text-xl">{selectedMember.role}</p>
                      
                      {/* Social links */}
                      <div className="flex mt-3 space-x-3">
                        {selectedMember.linkedin && (
                          <a 
                            href={selectedMember.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#0077B5] transition-colors"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        
                        {selectedMember.twitter && (
                          <a 
                            href={selectedMember.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#E4405F] transition-colors"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        )}
                        
                        {selectedMember.github && (
                          <a 
                            href={selectedMember.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                            </svg>
                          </a>
                        )}
                        
                        {selectedMember.personalSite && (
                          <a 
                            href={selectedMember.personalSite} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#9933FF] transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Contenido detallado */}
                  <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="font-rajdhani font-bold text-xl mb-4 text-white border-b border-gray-800 pb-2">
                        Biografía
                      </h3>
                      <div className="text-gray-300 space-y-4">
                        <p>{selectedMember.longBio || selectedMember.bio}</p>
                      </div>
                      
                      {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-rajdhani font-bold text-xl mb-4 text-white border-b border-gray-800 pb-2">
                            Logros destacados
                          </h3>
                          <ul className="space-y-2">
                            {selectedMember.achievements.map((achievement, index) => (
                              <li key={index} className="flex items-start text-gray-300">
                                <svg className="w-5 h-5 text-[#00CCFF] mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-rajdhani font-bold text-xl mb-4 text-white border-b border-gray-800 pb-2">
                        Especialidades
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.skills.map((skill, i) => (
                          <span 
                            key={i} 
                            className="text-sm px-3 py-1 bg-[#1a1a23] rounded-full text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      {/* Proyectos destacados del miembro */}
                      {getMemberProjects(selectedMember.id).length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-rajdhani font-bold text-xl mb-4 text-white border-b border-gray-800 pb-2">
                            Proyectos destacados
                          </h3>
                          <div className="space-y-4">
                            {getMemberProjects(selectedMember.id).map((project) => (
                              <div 
                                key={project.id}
                                className="rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a23]"
                              >
                                <div className="h-40 overflow-hidden">
                                  <img 
                                    src={project.image} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="p-4">
                                  <h4 className="font-medium text-white mb-1">{project.title}</h4>
                                  <p className="text-sm text-gray-400">{project.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-[#0c0c14]" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl mb-4 gradient-text">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              La mejor forma de conocernos es a través de los resultados que hemos logrado para quienes 
              han confiado en nosotros.
            </p>
          </div>
          
                    <div className="max-w-4xl mx-auto" ref={testimonialRef}>
            {loadingTestimonials ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00CCFF]"></div>
                <p className="text-gray-400 mt-4">Cargando testimonios...</p>
              </div>
            ) : testimonials.length > 0 ? (
              <div className="relative overflow-hidden rounded-xl bg-[#121217] border border-gray-800 p-6 md:p-10">
                <AnimatePresence mode="wait">
                  {testimonials.map((testimonial, index) => 
                    testimonialIndex === index && (
                      <motion.div
                        key={testimonial.id}
                        className="flex flex-col md:flex-row gap-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#1a1a23]">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex mt-3">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-5 h-5 ${i < testimonial.rating ? 'text-[#00CCFF]' : 'text-gray-600'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="mb-4 md:mb-6 relative">
                            {/* Comillas */}
                            <div className="absolute -top-4 -left-2 text-[#00CCFF]/20 text-7xl font-serif">
                              "
                            </div>
                            
                            <p className="text-gray-300 italic relative z-10">
                              {testimonial.text}
                            </p>
                            
                            <div className="absolute -bottom-4 -right-2 text-[#00CCFF]/20 text-7xl font-serif">
                              "
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <h4 className="font-rajdhani font-bold text-xl text-white">
                              {testimonial.name}
                            </h4>
                            <p className="text-[#00CCFF]">{testimonial.role}</p>
                            <p className="text-gray-400 text-sm">{testimonial.company}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
                
                {/* Indicadores */}
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === testimonialIndex ? 'bg-[#00CCFF] w-8' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                      onClick={() => setTestimonialIndex(i)}
                    />
                  ))}
                </div>
                
                {/* Botones de navegación */}
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between items-center">
                  <button
                    className="w-10 h-10 rounded-full bg-gray-800/50 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                    onClick={() => setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    className="w-10 h-10 rounded-full bg-gray-800/50 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                    onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-[#121217] rounded-xl p-8 border border-gray-800">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00CCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-rajdhani font-bold text-white mb-2">
                    ¡Sé el primero en compartir tu experiencia!
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Aún no tenemos testimonios publicados. ¿Has trabajado con nosotros? 
                    Comparte tu experiencia y ayuda a otros a conocer nuestro trabajo.
                  </p>
                  <Link 
                    to="/#testimonials"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Agregar testimonio
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl mb-4 gradient-text">
              Nuestros Valores
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Estos son los principios que guían nuestro trabajo diario y la forma en que 
              interactuamos con nuestros clientes y entre nosotros.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-[#121217] rounded-xl p-6 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-rajdhani font-bold text-xl mb-3 text-white">Innovación Constante</h3>
              <p className="text-gray-300">
                Nos mantenemos a la vanguardia de las tecnologías emergentes y tendencias digitales 
                para ofrecer soluciones innovadoras que destaquen en el mercado.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-[#121217] rounded-xl p-6 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-rajdhani font-bold text-xl mb-3 text-white">Transparencia Total</h3>
              <p className="text-gray-300">
                Creemos en la comunicación clara y honesta. Mantenemos a nuestros clientes informados 
                en cada etapa del proceso y somos transparentes sobre costos, plazos y resultados.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-[#121217] rounded-xl p-6 border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-rajdhani font-bold text-xl mb-3 text-white">Orientación a Resultados</h3>
              <p className="text-gray-300">
                Nos enfocamos en crear soluciones que generen resultados medibles. Cada decisión 
                que tomamos está orientada a maximizar el retorno de inversión para nuestros clientes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Culture Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-rajdhani font-bold text-3xl md:text-4xl mb-6 gradient-text">
                Nuestra Cultura
              </h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="ml-4">
                    <h3 className="font-rajdhani font-bold text-xl mb-2 text-white">Colaboración</h3>
                    <p className="text-gray-300">
                      Creemos en el poder del trabajo en equipo. Reunimos diferentes perspectivas 
                      y habilidades para crear soluciones integrales que aborden todos los aspectos 
                      de los desafíos digitales.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="ml-4">
                    <h3 className="font-rajdhani font-bold text-xl mb-2 text-white">Aprendizaje Continuo</h3>
                    <p className="text-gray-300">
                      El mundo digital evoluciona constantemente, y nosotros con él. Invertimos 
                      continuamente en el desarrollo profesional de nuestro equipo para mantenernos 
                      a la vanguardia.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="ml-4">
                    <h3 className="font-rajdhani font-bold text-xl mb-2 text-white">Equilibrio y Bienestar</h3>
                    <p className="text-gray-300">
                      Promovemos un ambiente de trabajo saludable que respeta el equilibrio entre 
                      vida personal y profesional. Creemos que equipos felices crean mejores productos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-96 bg-[#121217] rounded-xl overflow-hidden border border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00CCFF]/20 to-[#9933FF]/20 flex items-center justify-center">
                <div className="text-center p-6">
                  <span className="text-white font-medium">Imagen del equipo trabajando</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-[#121217] rounded-xl p-8 border border-gray-800">
            <div className="text-center mb-8">
              <h2 className="font-rajdhani font-bold text-3xl mb-4 gradient-text">
                ¿Quieres formar parte de nuestro equipo?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Estamos siempre buscando talentos que compartan nuestra pasión por la excelencia digital.
                Revisa nuestras vacantes actuales o envíanos tu CV.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-lg text-white font-medium text-center shadow-lg shadow-[#00CCFF]/20 hover:shadow-[#9933FF]/30"
              >
                Ver vacantes
              </a>
              <a
                href="mailto:careers@tuweb.ai"
                className="px-6 py-3 bg-[#1a1a23] border border-gray-700 rounded-lg text-white font-medium text-center hover:bg-[#1f1f29] transition-colors"
              >
                Enviar CV
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}