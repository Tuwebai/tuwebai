import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Componentes
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';

// Tipos de cursos
type CourseCategory = 'todos' | 'desarrollo' | 'negocios' | 'marketing' | 'diseno';

// Interfaz de curso
interface Course {
  id: number;
  title: string;
  instructor: string;
  price: number;
  discountPrice?: number;
  category: CourseCategory;
  image: string;
  lessons: number;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  rating: number;
  students: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export default function PlataformaEducativa() {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('todos');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // Efecto para simular carga
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

  // Categorías
  const categories = [
    { id: 'todos', name: 'Todos los cursos' },
    { id: 'desarrollo', name: 'Desarrollo' },
    { id: 'negocios', name: 'Negocios' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'diseno', name: 'Diseño' }
  ];

  // Cursos
  const courses: Course[] = [
    {
      id: 1,
      title: "Desarrollo Web Full Stack",
      instructor: "Juan Pérez",
      price: 129.99,
      discountPrice: 79.99,
      category: 'desarrollo',
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      lessons: 75,
      duration: "42 horas",
      level: "Intermedio",
      rating: 4.8,
      students: 2548,
      isFeatured: true
    },
    {
      id: 2,
      title: "Marketing Digital Avanzado",
      instructor: "Ana Gómez",
      price: 149.99,
      category: 'marketing',
      image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      lessons: 48,
      duration: "28 horas",
      level: "Avanzado",
      rating: 4.9,
      students: 1896,
      isNew: true
    },
    {
      id: 3,
      title: "Diseño UI/UX para Aplicaciones",
      instructor: "Carlos Martínez",
      price: 119.99,
      discountPrice: 89.99,
      category: 'diseno',
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      lessons: 60,
      duration: "35 horas",
      level: "Intermedio",
      rating: 4.7,
      students: 1352
    },
    {
      id: 4,
      title: "Programación en Python",
      instructor: "Roberto Suárez",
      price: 109.99,
      category: 'desarrollo',
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      lessons: 65,
      duration: "38 horas",
      level: "Principiante",
      rating: 4.6,
      students: 3821,
      isNew: true
    },
    {
      id: 5,
      title: "Emprendimiento y Negocios",
      instructor: "Laura Rodríguez",
      price: 139.99,
      discountPrice: 99.99,
      category: 'negocios',
      image: "https://images.unsplash.com/photo-1460794418188-1bb7dba2720d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      lessons: 42,
      duration: "24 horas",
      level: "Intermedio",
      rating: 4.9,
      students: 2187
    },
    {
      id: 6,
      title: "Fotografía Profesional",
      instructor: "Mariana López",
      price: 99.99,
      category: 'diseno',
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      lessons: 32,
      duration: "18 horas",
      level: "Principiante",
      rating: 4.7,
      students: 1852,
      isFeatured: true
    },
    {
      id: 7,
      title: "Desarrollo de Aplicaciones Móviles",
      instructor: "Alejandro Torres",
      price: 159.99,
      category: 'desarrollo',
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      lessons: 80,
      duration: "45 horas",
      level: "Avanzado",
      rating: 4.8,
      students: 1524
    },
    {
      id: 8,
      title: "Análisis Financiero",
      instructor: "Soledad Martínez",
      price: 179.99,
      discountPrice: 129.99,
      category: 'negocios',
      image: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      lessons: 55,
      duration: "32 horas",
      level: "Avanzado",
      rating: 4.9,
      students: 983
    }
  ];
  
  // Cursos filtrados por categoría
  let filteredCourses = activeCategory === 'todos' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  // Búsqueda
  if (searchQuery.trim()) {
    filteredCourses = filteredCourses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Cursos destacados para el slider
  const featuredCourses = courses.filter(course => course.isFeatured);
  
  // Función para añadir a lista de deseos
  const addToWishlist = () => {
    setWishlistCount(prev => prev + 1);
    setShowNotification(true);
    
    // Ocultar notificación después de 3 segundos
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Componente para mostrar estrellas
  const RatingStars = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {halfStar && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#2E3192] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-white border-r-[#2E3192] border-b-[#2E3192] border-l-[#2E3192] rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white">EDUPLANET</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollProgress color="#2E3192" />
      <WhatsAppButton />
      
      {/* Notificación */}
      {showNotification && (
        <motion.div 
          className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          Curso añadido a favoritos
        </motion.div>
      )}
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Botón de menú móvil */}
              {isMobile && (
                <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2E3192]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              {/* Logo */}
              <h1 className="text-2xl font-bold">
                <span className="text-[#2E3192]">EDU</span>
                <span className="text-[#FF6B6B]">PLANET</span>
              </h1>
              
              {/* Navegación desktop */}
              {!isMobile && (
                <nav className="hidden lg:flex items-center space-x-6">
                  <a href="#" className="text-gray-700 hover:text-[#2E3192] transition-colors">Inicio</a>
                  <a href="#cursos" className="text-gray-700 hover:text-[#2E3192] transition-colors">Cursos</a>
                  <a href="#" className="text-gray-700 hover:text-[#2E3192] transition-colors">Instructores</a>
                  <a href="#" className="text-gray-700 hover:text-[#2E3192] transition-colors">Comunidad</a>
                  <a href="#" className="text-gray-700 hover:text-[#2E3192] transition-colors">Precios</a>
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Búsqueda */}
              <div className="relative">
                {showSearch ? (
                  <input 
                    type="text" 
                    placeholder="Buscar cursos..." 
                    className="border border-gray-300 p-2 pl-8 text-sm rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                    autoFocus
                  />
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-600 cursor-pointer" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    onClick={() => setShowSearch(true)}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              
              {/* Lista de deseos */}
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF6B6B] text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">
                    {wishlistCount}
                  </span>
                )}
              </div>
              
              {/* Usuario */}
              <button className="bg-[#2E3192] text-white px-4 py-2 rounded-full text-sm hover:bg-[#232578] transition-colors">
                Iniciar sesión
              </button>
            </div>
          </div>
          
          {/* Menú móvil */}
          {isMobile && isMenuOpen && (
            <motion.div 
              className="lg:hidden mt-4 py-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <nav className="flex flex-col space-y-3">
                <a href="#" className="text-gray-700 hover:text-[#2E3192] transition-colors">Inicio</a>
                <a href="#cursos" className="text-gray-700 hover:text-[#2E3192] transition-colors">Cursos</a>
                <a href="#" className="text-gray-700 hover:text-[#2E3192] transition-colors">Instructores</a>
                <a href="#" className="text-gray-700 hover:text-[#2E3192] transition-colors">Comunidad</a>
                <a href="#" className="text-gray-700 hover:text-[#2E3192] transition-colors">Precios</a>
              </nav>
            </motion.div>
          )}
        </div>
      </header>
      
      {/* Hero section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#2E3192] to-[#1E2161]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Aprende sin límites, <span className="text-[#FF6B6B]">transforma</span> tu futuro
              </h1>
              <p className="text-lg text-gray-200 mb-8">
                Más de 1,000 cursos de alta calidad impartidos por los mejores profesionales de la industria. Aprende a tu ritmo y consigue tus objetivos.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#cursos"
                  className="bg-[#FF6B6B] text-white px-6 py-3 rounded-full font-medium hover:bg-[#FF5252] transition-colors"
                >
                  Explorar cursos
                </a>
                <a 
                  href="#"
                  className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-[#2E3192] transition-colors"
                >
                  Prueba gratuita
                </a>
              </div>
              <div className="mt-8 flex items-center text-white">
                <div className="flex -space-x-2 mr-4">
                  {[1, 2, 3, 4].map(i => (
                    <img 
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i+10}`} 
                      alt="Usuario" 
                      className="w-8 h-8 rounded-full border-2 border-[#2E3192]"
                    />
                  ))}
                </div>
                <div>
                  <span className="block font-bold">+45,000 estudiantes</span>
                  <div className="flex text-yellow-500 text-sm">
                    ★★★★★ <span className="text-gray-200 ml-1">(4.9)</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Estudiantes aprendiendo" 
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <div className="bg-[#FF6B6B] rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Cursos completados</p>
                      <p className="text-xl font-bold text-[#2E3192]">25,000+</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <div className="bg-[#2E3192] rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Certificados</p>
                      <p className="text-xl font-bold text-[#2E3192]">15,400+</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>
      
      {/* Marcas asociadas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Confían en nosotros</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {['Google', 'Microsoft', 'Amazon', 'IBM', 'Meta'].map(brand => (
              <div key={brand} className="grayscale hover:grayscale-0 transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-400 hover:text-[#2E3192]">{brand}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Características */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ¿Por qué elegir <span className="text-[#2E3192]">EDU</span><span className="text-[#FF6B6B]">PLANET</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma está diseñada para brindarte la mejor experiencia de aprendizaje, con características que te ayudarán a alcanzar tus metas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#2E3192]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2E3192]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aprendizaje flexible</h3>
              <p className="text-gray-600">
                Accede a tus cursos en cualquier momento y desde cualquier dispositivo. Aprende a tu propio ritmo.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#FF6B6B]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Instructores expertos</h3>
              <p className="text-gray-600">
                Aprende de profesionales con experiencia comprobada en las mejores empresas del sector.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#2E3192]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2E3192]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Certificaciones reconocidas</h3>
              <p className="text-gray-600">
                Obtén certificados verificables que potenciarán tu currículum y tu carrera profesional.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Cursos */}
      <section id="cursos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Nuestros Cursos Destacados
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora nuestra amplia selección de cursos diseñados para impulsar tu carrera y desarrollar nuevas habilidades.
            </p>
          </div>
          
          {/* Categorías */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as CourseCategory)}
                  className={`px-4 py-2 min-w-max rounded-full text-sm ${
                    activeCategory === category.id
                      ? 'bg-[#2E3192] text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  } transition-colors`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Grid de cursos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <motion.div 
                key={course.id}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={addToWishlist}
                    className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:text-[#FF6B6B] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  {(course.isNew || course.discountPrice) && (
                    <div className="absolute top-3 left-3">
                      {course.isNew && (
                        <div className="bg-[#FF6B6B] text-white px-2 py-0.5 text-xs rounded font-medium">
                          NUEVO
                        </div>
                      )}
                      {course.discountPrice && (
                        <div className="bg-green-500 text-white px-2 py-0.5 text-xs rounded font-medium mt-1">
                          {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% DTO
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded">
                        {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded ml-1">
                        {course.level}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <RatingStars rating={course.rating} />
                      <span className="text-sm text-gray-600 ml-1">({course.rating})</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2 h-14">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    Por <span className="font-medium text-[#2E3192]">{course.instructor}</span>
                  </p>
                  
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {course.lessons} lecciones
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {course.students.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      {course.discountPrice ? (
                        <div>
                          <span className="text-gray-400 line-through text-sm">${course.price.toFixed(2)}</span>
                          <span className="text-xl font-bold text-[#2E3192] ml-2">${course.discountPrice.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-[#2E3192]">${course.price.toFixed(2)}</span>
                      )}
                    </div>
                    <a 
                      href="#"
                      className="bg-[#2E3192] text-white px-3 py-1 rounded text-sm hover:bg-[#232578] transition-colors"
                    >
                      Ver Curso
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Botón ver más */}
          <div className="text-center mt-16">
            <a 
              href="#" 
              className="inline-block bg-white border border-[#2E3192] text-[#2E3192] px-6 py-3 rounded-full hover:bg-[#2E3192] hover:text-white transition-colors"
            >
              Ver todos los cursos
            </a>
          </div>
        </div>
      </section>
      
      {/* Testimonios */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Miles de estudiantes han transformado sus carreras con nuestros cursos. Conoce sus historias.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "María López",
                position: "Desarrolladora Frontend",
                company: "TechCorp",
                testimonial: "Los cursos de desarrollo web me permitieron cambiar de carrera y conseguir mi primer trabajo como desarrolladora. La calidad del contenido y el soporte de los instructores es excelente.",
                avatar: "https://i.pravatar.cc/100?img=5"
              },
              {
                name: "Carlos Rodríguez",
                position: "Gerente de Marketing Digital",
                company: "GlobalMedia",
                testimonial: "Gracias a los cursos de marketing digital pude actualizar mis conocimientos y aplicar nuevas estrategias en mi empresa, lo que resultó en un aumento del 40% en conversiones.",
                avatar: "https://i.pravatar.cc/100?img=8"
              },
              {
                name: "Laura Martínez",
                position: "Diseñadora UX/UI",
                company: "CreativeStudio",
                testimonial: "El curso de diseño UX/UI fue transformador para mi carrera. Pude crear un portfolio profesional y ahora trabajo en proyectos internacionales con clientes de primer nivel.",
                avatar: "https://i.pravatar.cc/100?img=9"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.position} en {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.testimonial}"</p>
                <div className="flex text-yellow-500 mt-4">
                  ★★★★★
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Banner de suscripción */}
      <section className="py-16 bg-gradient-to-r from-[#2E3192] to-[#1E2161]">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-3">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Obtén acceso ilimitado
                </h2>
                <p className="text-gray-600 mb-6">
                  Suscríbete a nuestro plan Premium y obtén acceso a todos nuestros cursos, certificaciones y recursos exclusivos por un precio increíble.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="#"
                    className="bg-[#2E3192] text-white px-6 py-3 rounded-full font-medium hover:bg-[#232578] transition-colors"
                  >
                    Probar gratis por 7 días
                  </a>
                  <a 
                    href="#"
                    className="bg-white border border-[#2E3192] text-[#2E3192] px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
                  >
                    Ver planes
                  </a>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="bg-[#F8FAFC] p-6 rounded-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-[#2E3192] mb-4">Plan Premium</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-3xl font-bold text-gray-800">$29</span>
                    <span className="text-gray-600 ml-1">/mes</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {[
                      "Acceso ilimitado a +1000 cursos",
                      "Certificaciones incluidas",
                      "Descarga de recursos",
                      "Soporte prioritario",
                      "Acceso a comunidad exclusiva"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h1 className="text-2xl font-bold mb-6">
                <span className="text-[#2E3192]">EDU</span>
                <span className="text-[#FF6B6B]">PLANET</span>
              </h1>
              <p className="text-gray-400 mb-6">
                Plataforma de educación online con cursos de alta calidad para impulsar tu carrera profesional.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cursos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Instructores</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Certificaciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Planes corporativos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Afiliados</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutoriales</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guías</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Eventos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Nosotros</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Quiénes somos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos y condiciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de privacidad</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} EDUPLANET. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}