import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Componentes
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';

// Tipos
type RestauranteCategory = 'todos' | 'italiano' | 'japones' | 'mexicano' | 'mediterraneo';
type ReservationTime = '12:00' | '13:00' | '14:00' | '19:00' | '20:00' | '21:00' | '22:00';

// Interfaces
interface Restaurante {
  id: number;
  name: string;
  category: RestauranteCategory;
  address: string;
  rating: number;
  ratingCount: number;
  price: string;
  image: string;
  cuisine: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
}

export default function AppRestaurantes() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<RestauranteCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurante | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Reserva
  const [reservationDate, setReservationDate] = useState<string>('');
  const [reservationTime, setReservationTime] = useState<ReservationTime>('20:00');
  const [reservationGuests, setReservationGuests] = useState<number>(2);
  
  // Simular carga
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Restaurantes
  const restaurantes: Restaurante[] = [
    {
      id: 1,
      name: "La Trattoria",
      category: 'italiano',
      address: "Av. Italia 457, Palermo",
      rating: 4.8,
      ratingCount: 458,
      price: "$$",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      cuisine: "Italiana",
      isFeatured: true
    },
    {
      id: 2,
      name: "Sakura Sushi",
      category: 'japones',
      address: "Calle Arribeños 2187, Belgrano",
      rating: 4.7,
      ratingCount: 312,
      price: "$$$",
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      cuisine: "Japonesa",
      isNew: true
    },
    {
      id: 3,
      name: "El Patrón",
      category: 'mexicano',
      address: "Av. Corrientes 1234, Centro",
      rating: 4.5,
      ratingCount: 287,
      price: "$$",
      image: "https://images.unsplash.com/photo-1536096119648-4d06b281a17f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      cuisine: "Mexicana"
    },
    {
      id: 4,
      name: "Mare Nostrum",
      category: 'mediterraneo',
      address: "Costa 234, Puerto Madero",
      rating: 4.9,
      ratingCount: 189,
      price: "$$$",
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      cuisine: "Mediterránea",
      isFeatured: true
    },
    {
      id: 5,
      name: "Roma Antica",
      category: 'italiano',
      address: "Diagonal Norte 567, Microcentro",
      rating: 4.6,
      ratingCount: 231,
      price: "$$",
      image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      cuisine: "Italiana"
    },
    {
      id: 6,
      name: "Tokyo Bowl",
      category: 'japones',
      address: "Libertador 4567, Núñez",
      rating: 4.7,
      ratingCount: 346,
      price: "$$",
      image: "https://images.unsplash.com/photo-1528752511608-fb166146187a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      cuisine: "Japonesa"
    },
    {
      id: 7,
      name: "Acropolis",
      category: 'mediterraneo',
      address: "Callao 876, Recoleta",
      rating: 4.4,
      ratingCount: 178,
      price: "$$",
      image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      cuisine: "Griega/Mediterránea",
      isNew: true
    },
    {
      id: 8,
      name: "Taquería el Mexicano",
      category: 'mexicano',
      address: "Malabia 765, Villa Crespo",
      rating: 4.3,
      ratingCount: 203,
      price: "$",
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a3479c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      cuisine: "Mexicana"
    }
  ];
  
  // Restaurantes filtrados por categoría
  let filteredRestaurantes = activeCategory === 'todos'
    ? restaurantes
    : restaurantes.filter(r => r.category === activeCategory);
    
  // Búsqueda
  if (searchQuery.trim()) {
    filteredRestaurantes = filteredRestaurantes.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Menú items para el restaurante seleccionado
  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Risotto al Funghi Porcini",
      description: "Arroz arborio, hongos porcini, queso parmesano, manteca y vino blanco.",
      price: 18.99,
      category: "Primeros",
      image: "https://images.unsplash.com/photo-1525510252577-9a2b27371d23?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      popular: true
    },
    {
      id: 2,
      name: "Lasagna Bolognese",
      description: "Pasta fresca en capas, ragú de carne, bechamel y queso mozzarella gratinado.",
      price: 19.99,
      category: "Primeros",
      image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      popular: true
    },
    {
      id: 3,
      name: "Ossobuco con Polenta",
      description: "Osobuco de ternera braseado con vino tinto, verduras y hierbas, servido con polenta cremosa.",
      price: 26.99,
      category: "Principales",
      image: "https://images.unsplash.com/photo-1544025162-e815ffe1ff0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      name: "Tiramisu",
      description: "Postre tradicional italiano con capas de bizcochos de café, queso mascarpone y cacao.",
      price: 9.99,
      category: "Postres",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      popular: true
    },
    {
      id: 5,
      name: "Panna Cotta con Frutos Rojos",
      description: "Cremoso postre italiano con esencia de vainilla y salsa de frutos rojos.",
      price: 8.99,
      category: "Postres",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 6,
      name: "Carpaccio de Salmón",
      description: "Finas láminas de salmón fresco con rúcula, alcaparras y aceite de oliva extra virgen.",
      price: 15.99,
      category: "Entradas",
      image: "https://images.unsplash.com/photo-1625944525335-867de610cce8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    }
  ];
  
  // Categorías
  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'italiano', name: 'Italiano' },
    { id: 'japones', name: 'Japonés' },
    { id: 'mexicano', name: 'Mexicano' },
    { id: 'mediterraneo', name: 'Mediterráneo' }
  ];
  
  // Formatear fecha para el selector de fecha
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  
  // Manejar reserva
  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReservationModal(false);
    setShowSuccessModal(true);
    
    // Cerrar modal de éxito después de 3 segundos
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };
  
  // Mostrar las estrellas según la puntuación
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    if (halfStar) {
      stars.push(
        <svg key="half" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Añadir estrellas vacías para llegar a 5
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#E23E3E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-white border-r-[#E23E3E] border-b-[#E23E3E] border-l-[#E23E3E] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">TÁBULA</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollProgress color="#E23E3E" />
      <WhatsAppButton />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Botón de menú móvil */}
              {isMobile && (
                <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#E23E3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              {/* Logo */}
              <h1 className="text-2xl font-bold text-[#E23E3E]">
                TÁBULA
              </h1>
              
              {/* Navegación desktop */}
              {!isMobile && (
                <nav className="hidden lg:flex items-center space-x-6">
                  <a href="#inicio" className="text-gray-700 hover:text-[#E23E3E] transition-colors">Inicio</a>
                  <a href="#restaurantes" className="text-gray-700 hover:text-[#E23E3E] transition-colors">Restaurantes</a>
                  <a href="#" className="text-gray-700 hover:text-[#E23E3E] transition-colors">Promociones</a>
                  <a href="#" className="text-gray-700 hover:text-[#E23E3E] transition-colors">Cómo funciona</a>
                  <a href="#" className="text-gray-700 hover:text-[#E23E3E] transition-colors">Contacto</a>
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Búsqueda */}
              <div className="relative">
                {showSearch ? (
                  <input 
                    type="text" 
                    placeholder="Buscar restaurantes..." 
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
              
              {/* Usuario */}
              <button className="bg-[#E23E3E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#C31C1C] transition-colors">
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
                <a href="#inicio" className="text-gray-700 hover:text-[#E23E3E] transition-colors">Inicio</a>
                <a href="#restaurantes" className="text-gray-700 hover:text-[#E23E3E] transition-colors">Restaurantes</a>
                <a href="#" className="text-gray-700 hover:text-[#E23E3E] transition-colors">Promociones</a>
                <a href="#" className="text-gray-700 hover:text-[#E23E3E] transition-colors">Cómo funciona</a>
                <a href="#" className="text-gray-700 hover:text-[#E23E3E] transition-colors">Contacto</a>
              </nav>
            </motion.div>
          )}
        </div>
      </header>
      
      {/* Hero section */}
      <section id="inicio" className="pt-24 pb-16 bg-gradient-to-br from-[#E23E3E] to-[#AA2222]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                La mejor experiencia gastronómica a un click de distancia
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Reserva en los mejores restaurantes de la ciudad, consulta menús, realiza pedidos online y recibe ofertas exclusivas.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#restaurantes"
                  className="bg-white text-[#E23E3E] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  Explorar restaurantes
                </a>
                <a 
                  href="#"
                  className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
                >
                  Cómo funciona
                </a>
              </div>
              <div className="mt-8 flex items-center text-white">
                <div className="flex -space-x-2 mr-4">
                  {[1, 2, 3, 4].map(i => (
                    <img 
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i+20}`} 
                      alt="Usuario" 
                      className="w-8 h-8 rounded-full border-2 border-[#E23E3E]"
                    />
                  ))}
                </div>
                <div>
                  <span className="block font-bold">+150,000 usuarios</span>
                  <div className="flex text-yellow-300 text-sm">
                    ★★★★★ <span className="text-white/80 ml-1">(4.8)</span>
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
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Restaurante" 
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <div className="bg-green-500 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Reservas exitosas</p>
                      <p className="text-xl font-bold text-[#E23E3E]">25,000+</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>
      
      {/* Características */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                ¿Por qué elegir Tábula?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Simplificamos todo el proceso para que puedas disfrutar de la mejor gastronomía sin complicaciones.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#E23E3E]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E23E3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reservas en tiempo real</h3>
              <p className="text-gray-600">
                Reserva tu mesa al instante y recibe confirmación inmediata. Sin llamadas, sin esperas.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#E23E3E]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E23E3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Menús digitales</h3>
              <p className="text-gray-600">
                Explora los menús completos, fotos de platos, precios y opiniones de otros usuarios.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#E23E3E]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E23E3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ofertas exclusivas</h3>
              <p className="text-gray-600">
                Accede a promociones y descuentos disponibles solo para usuarios de nuestra plataforma.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Restaurantes */}
      <section id="restaurantes" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Descubre los mejores restaurantes
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explora nuestra selección de restaurantes destacados y encuentra tu próxima experiencia gastronómica.
              </p>
            </motion.div>
          </div>
          
          {/* Categorías */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as RestauranteCategory)}
                  className={`px-4 py-2 min-w-max rounded-full text-sm ${
                    activeCategory === category.id
                      ? 'bg-[#E23E3E] text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  } transition-colors`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Grid de restaurantes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRestaurantes.map((restaurante) => (
              <motion.div 
                key={restaurante.id}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedRestaurant(restaurante)}
              >
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={restaurante.image} 
                    alt={restaurante.name} 
                    className="w-full h-full object-cover"
                  />
                  {(restaurante.isNew || restaurante.isFeatured) && (
                    <div className="absolute top-3 left-3">
                      {restaurante.isNew && (
                        <div className="bg-[#E23E3E] text-white px-2 py-0.5 text-xs rounded font-medium">
                          NUEVO
                        </div>
                      )}
                      {restaurante.isFeatured && (
                        <div className="bg-[#FFC107] text-gray-900 px-2 py-0.5 text-xs rounded font-medium mt-1">
                          DESTACADO
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{restaurante.name}</h3>
                    <span className="text-gray-600">{restaurante.price}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {restaurante.cuisine} • {restaurante.address}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    {renderStars(restaurante.rating)}
                    <span className="text-sm text-gray-600 ml-1">({restaurante.rating})</span>
                    <span className="text-xs text-gray-500 ml-2">{restaurante.ratingCount} reseñas</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      className="text-[#E23E3E] hover:text-[#C31C1C] text-sm font-medium transition-colors"
                    >
                      Ver menú
                    </button>
                    <button 
                      className="bg-[#E23E3E] text-white px-3 py-1 rounded text-sm hover:bg-[#C31C1C] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRestaurant(restaurante);
                        setShowReservationModal(true);
                      }}
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Ver más */}
          <div className="text-center mt-12">
            <a 
              href="#"
              className="inline-block border border-[#E23E3E] text-[#E23E3E] px-6 py-3 rounded-full hover:bg-[#E23E3E] hover:text-white transition-colors"
            >
              Ver todos los restaurantes
            </a>
          </div>
        </div>
      </section>
      
      {/* Números */}
      <section className="py-16 bg-[#E23E3E]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Restaurantes" },
              { value: "150K+", label: "Usuarios" },
              { value: "50K+", label: "Reservas mensuales" },
              { value: "20+", label: "Ciudades" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* App móvil */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Descarga nuestra aplicación móvil
              </h2>
              <p className="text-gray-600 mb-6">
                Con nuestra app podrás hacer reservas, explorar menús, recibir notificaciones y acceder a promociones exclusivas desde cualquier lugar.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Reservas más rápidas y sencillas",
                  "Notificaciones y recordatorios",
                  "Ofertas exclusivas para usuarios de la app",
                  "Pago integrado sin complicaciones"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E23E3E] mr-2 mt-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex space-x-4">
                <a href="#" className="inline-block">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" className="h-12" />
                </a>
                <a href="#" className="inline-block">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" className="h-12" />
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img 
                src="https://img.freepik.com/free-vector/realistic-mobile-smartphone-design-user-interface-template_92086-106.jpg" 
                alt="App móvil" 
                className="max-w-xs w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonios */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Lo que dicen nuestros usuarios
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Descubre las experiencias de quienes ya han disfrutado de nuestro servicio.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Laura Fernández",
                comment: "La aplicación es muy intuitiva y me ha permitido descubrir restaurantes increíbles que no conocía. Las reservas son rápidas y el sistema de notificaciones es muy útil.",
                rating: 5,
                avatar: "https://i.pravatar.cc/100?img=5"
              },
              {
                name: "Carlos Méndez",
                comment: "Excelente servicio. He conseguido reservas en restaurantes que normalmente están completos y las ofertas exclusivas valen mucho la pena. Mi app favorita para salir a comer.",
                rating: 5,
                avatar: "https://i.pravatar.cc/100?img=12"
              },
              {
                name: "Martina López",
                comment: "Me encanta poder ver los menús completos antes de elegir un restaurante. Además, las fotos y reseñas de otros usuarios son muy útiles para tomar una decisión informada.",
                rating: 4,
                avatar: "https://i.pravatar.cc/100?img=9"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow"
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
                    <div className="flex text-yellow-500">
                      {Array(testimonial.rating).fill(null).map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-[#E23E3E]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Comienza a reservar ahora
            </h2>
            <p className="text-white/90 max-w-3xl mx-auto mb-8">
              Únete a Tábula hoy mismo y disfruta de la mejor experiencia gastronómica con todos los beneficios de nuestra plataforma.
            </p>
            <a 
              href="#"
              className="inline-block bg-white text-[#E23E3E] px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Registrarse gratis
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">TÁBULA</h2>
              <p className="text-gray-400 mb-6">
                La plataforma líder para reservas en restaurantes, exploración de menús y experiencias gastronómicas.
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
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Servicio</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cómo reservar</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Restaurantes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Promociones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Afiliaciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Para restaurantes</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Nosotros</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre Tábula</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Equipo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Empleo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Prensa</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos y condiciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Tábula. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Modal de detalle restaurante */}
      {selectedRestaurant && !showReservationModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md z-10"
              onClick={() => setSelectedRestaurant(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="h-64 bg-gray-300 relative">
              <img 
                src={selectedRestaurant.image} 
                alt={selectedRestaurant.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white">{selectedRestaurant.name}</h2>
                <p className="text-white/90">{selectedRestaurant.cuisine} • {selectedRestaurant.address}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {renderStars(selectedRestaurant.rating)}
                  <span className="text-sm text-gray-600 ml-1">({selectedRestaurant.rating})</span>
                  <span className="text-xs text-gray-500 ml-2">{selectedRestaurant.ratingCount} reseñas</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600">{selectedRestaurant.price}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">{selectedRestaurant.cuisine}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Menú destacado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {menuItems.slice(0, 4).map(item => (
                    <div key={item.id} className="flex">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h4 className="font-bold text-gray-800">{item.name}</h4>
                          {item.popular && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded ml-2">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                        <p className="text-[#E23E3E] font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="text-[#E23E3E] font-medium hover:text-[#C31C1C]">
                    Ver menú completo
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Horarios</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map(day => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-600">{day}</span>
                      <span className="text-gray-800 font-medium">
                        {day === "Domingo" ? "12:00 - 16:00" : "12:00 - 23:00"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4 justify-center">
                <button 
                  className="bg-[#E23E3E] text-white px-6 py-3 rounded-full hover:bg-[#C31C1C] transition-colors"
                  onClick={() => setShowReservationModal(true)}
                >
                  Reservar mesa
                </button>
                <button className="border border-[#E23E3E] text-[#E23E3E] px-6 py-3 rounded-full hover:bg-[#E23E3E]/5 transition-colors">
                  Ver ubicación
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
                  Compartir
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de reserva */}
      {showReservationModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            className="bg-white rounded-lg max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Reservar mesa</h2>
                  <p className="text-gray-600">{selectedRestaurant.name}</p>
                </div>
                <button 
                  onClick={() => setShowReservationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleReservation}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="date" className="block text-gray-700 font-medium mb-1">
                      Fecha
                    </label>
                    <input 
                      type="date" 
                      id="date" 
                      min={formattedToday}
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-gray-700 font-medium mb-1">
                      Hora
                    </label>
                    <select 
                      id="time" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
                      value={reservationTime}
                      onChange={(e) => setReservationTime(e.target.value as ReservationTime)}
                      required
                    >
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="19:00">19:00</option>
                      <option value="20:00">20:00</option>
                      <option value="21:00">21:00</option>
                      <option value="22:00">22:00</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="guests" className="block text-gray-700 font-medium mb-1">
                      Número de personas
                    </label>
                    <div className="flex items-center">
                      <button 
                        type="button"
                        className="bg-gray-200 text-gray-700 w-10 h-10 rounded-l-md flex items-center justify-center hover:bg-gray-300"
                        onClick={() => reservationGuests > 1 && setReservationGuests(reservationGuests - 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <input 
                        type="number" 
                        id="guests" 
                        min="1" 
                        max="20"
                        value={reservationGuests}
                        onChange={(e) => setReservationGuests(parseInt(e.target.value))}
                        className="w-14 py-2 border-t border-b border-gray-300 text-center focus:outline-none"
                        required
                      />
                      <button 
                        type="button"
                        className="bg-gray-200 text-gray-700 w-10 h-10 rounded-r-md flex items-center justify-center hover:bg-gray-300"
                        onClick={() => reservationGuests < 20 && setReservationGuests(reservationGuests + 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-gray-700 font-medium mb-1">
                      Notas (opcional)
                    </label>
                    <textarea 
                      id="notes" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E23E3E]"
                      rows={3}
                      placeholder="Indique cualquier requerimiento especial"
                    ></textarea>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-[#E23E3E] text-white px-6 py-3 rounded-full hover:bg-[#C31C1C] transition-colors"
                >
                  Confirmar reserva
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-lg p-8 max-w-md w-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva confirmada!</h2>
            <p className="text-gray-600 mb-6">
              Tu reserva en {selectedRestaurant?.name} ha sido confirmada. Te hemos enviado los detalles a tu email.
            </p>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedRestaurant(null);
              }}
              className="bg-[#E23E3E] text-white px-6 py-3 rounded-full hover:bg-[#C31C1C] transition-colors"
            >
              Entendido
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}