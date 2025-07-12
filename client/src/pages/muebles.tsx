import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

// Componentes
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';

// Tipos de ambientes
type EnvironmentCategory = 'todos' | 'living' | 'comedor' | 'dormitorio';

// Interfaz de producto
interface Product {
  id: number;
  name: string;
  price: number;
  category: EnvironmentCategory;
  image: string;
  description: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

// Interfaz para inspiración
interface Inspiration {
  id: number;
  title: string;
  image: string;
}

export default function Muebles() {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<EnvironmentCategory>('todos');
  const [showContact, setShowContact] = useState(false);
  const [currentInspiration, setCurrentInspiration] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Efecto para desplazar al inicio cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Doble verificación con timeout para asegurar que funcione
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);
  
  // Productos
  const products: Product[] = [
    {
      id: 1,
      name: "Sofá Minimalista Gris",
      price: 899.99,
      category: 'living',
      image: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Sofá de diseño minimalista con tela de alta resistencia y patas de madera noble.",
      isFeatured: true
    },
    {
      id: 2,
      name: "Mesa de Centro Nórdica",
      price: 349.99,
      category: 'living',
      image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Mesa de centro con diseño nórdico, elaborada en madera de roble y acabados naturales.",
      isNew: true
    },
    {
      id: 3,
      name: "Mesa de Comedor Extensible",
      price: 599.99,
      category: 'comedor',
      image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Mesa de comedor extensible para 6-8 personas, fabricada en madera de haya con acabado natural."
    },
    {
      id: 4,
      name: "Sillas Escandinavas (Set de 4)",
      price: 499.99,
      category: 'comedor',
      image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Conjunto de 4 sillas de estilo escandinavo, elaboradas en madera clara y asiento tapizado.",
      isNew: true,
      isFeatured: true
    },
    {
      id: 5,
      name: "Cama Platform Queen",
      price: 799.99,
      category: 'dormitorio',
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Cama estilo platform con cabecero minimalista y estructura de madera sólida."
    },
    {
      id: 6,
      name: "Mesita de Noche Flotante",
      price: 199.99,
      category: 'dormitorio',
      image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Mesita de noche con diseño flotante, perfecta para espacios reducidos.",
      isFeatured: true
    },
    {
      id: 7,
      name: "Estantería Modular",
      price: 349.99,
      category: 'living',
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Estantería modular personalizable, ideal para mostrar objetos decorativos."
    },
    {
      id: 8,
      name: "Aparador Escandinavo",
      price: 649.99,
      category: 'comedor',
      image: "https://images.unsplash.com/photo-1551516594-56cb78394645?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Aparador de estilo escandinavo con amplio espacio de almacenamiento y diseño elegante."
    }
  ];
  
  // Inspiraciones
  const inspirations: Inspiration[] = [
    {
      id: 1,
      title: "Salón Minimalista",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      title: "Comedor Nórdico",
      image: "https://images.unsplash.com/photo-1531877025030-f7ce2ecac40f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      title: "Dormitorio Zen",
      image: "https://images.unsplash.com/photo-1556438758-8d49568ce18e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      title: "Estudio Contemporáneo",
      image: "https://images.unsplash.com/photo-1486946255434-2466348c2166?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    }
  ];
  
  // Productos filtrados por categoría
  const filteredProducts = activeCategory === 'todos' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Productos destacados
  const featuredProducts = products.filter(product => product.isFeatured);
  
  // Navegar por el slider de inspiración
  const nextInspiration = () => {
    setCurrentInspiration(current => 
      current === inspirations.length - 1 ? 0 : current + 1
    );
  };
  
  const prevInspiration = () => {
    setCurrentInspiration(current => 
      current === 0 ? inspirations.length - 1 : current - 1
    );
  };
  
  // Auto-scroll para el slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextInspiration();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Función para ir a la siguiente diapositiva del slider
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: currentInspiration * sliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [currentInspiration]);

  return (
    <>
      <ScrollProgress />
      <WhatsAppButton />
      
      {/* Botón Volver a Proyectos */}
      <div className="fixed left-5 z-50" style={{ top: '80px' }}>
        <Link 
          to="/#showroom" 
          className="flex items-center gap-2 bg-white bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-full text-gray-800 border border-[#C8A97E] hover:border-gray-800 transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-serif">Volver a Proyectos</span>
        </Link>
      </div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-gray-800">
              Muebles<span className="text-[#C8A97E]">Minimalistas</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-[#C8A97E] transition-colors font-serif">Inicio</a>
            <a href="#catalogo" className="text-gray-600 hover:text-[#C8A97E] transition-colors font-serif">Catálogo</a>
            <a href="#inspiracion" className="text-gray-600 hover:text-[#C8A97E] transition-colors font-serif">Inspiración</a>
            <a href="#contacto" className="text-gray-600 hover:text-[#C8A97E] transition-colors font-serif">Contacto</a>
          </div>
          <div className="md:hidden">
            <button className="text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="h-screen flex items-center justify-center text-center bg-cover bg-center pt-16" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)' }}>
        <div className="container mx-auto px-4">
          <div className="bg-white bg-opacity-90 p-8 md:p-12 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
                Diseño Minimalista para Espacios Únicos
              </h1>
              <p className="text-lg text-gray-600 mb-8 font-serif">
                Muebles contemporáneos que transforman tu hogar en un espacio elegante y funcional.
              </p>
              <a 
                href="#catalogo"
                className="inline-block bg-[#C8A97E] text-white px-8 py-3 font-serif hover:bg-[#B89A6E] transition-colors duration-300"
              >
                Ver Catálogo
              </a>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Destacados */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-4 text-gray-800">
            Piezas Destacadas
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-serif">
            Selección de nuestros diseños más exclusivos, donde la elegancia se encuentra con la funcionalidad.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                className="bg-white rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif text-gray-800">{product.name}</h3>
                    {product.isNew && (
                      <span className="px-2 py-1 bg-[#C8A97E] text-white text-xs font-serif">
                        NUEVO
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 font-serif text-sm">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#C8A97E] font-serif">${product.price}</span>
                    <button 
                      onClick={() => setShowContact(true)}
                      className="text-[#C8A97E] border border-[#C8A97E] px-3 py-1 hover:bg-[#C8A97E] hover:text-white transition-colors font-serif text-sm"
                    >
                      Consultar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Inspiración */}
      <section id="inspiracion" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-4 text-gray-800">
            Inspiración
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-serif">
            Ambientes reales con nuestros muebles que te inspirarán a transformar tu espacio.
          </p>
          
          <div className="relative max-w-4xl mx-auto">
            <div 
              ref={sliderRef}
              className="overflow-x-hidden whitespace-nowrap"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex">
                {inspirations.map((inspiration, index) => (
                  <div 
                    key={inspiration.id}
                    className="w-full flex-shrink-0 inline-block"
                  >
                    <div className="px-4">
                      <div className="relative">
                        <img 
                          src={inspiration.image} 
                          alt={inspiration.title} 
                          className="w-full h-[500px] object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
                          <h3 className="text-xl font-serif">{inspiration.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={prevInspiration} 
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 hover:bg-opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextInspiration} 
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 hover:bg-opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="flex justify-center mt-4 space-x-2">
              {inspirations.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentInspiration(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentInspiration === index ? 'bg-[#C8A97E]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Catálogo */}
      <section id="catalogo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-4 text-gray-800">
            Nuestro Catálogo
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-serif">
            Cada pieza ha sido cuidadosamente diseñada para combinar funcionalidad, estética y sostenibilidad.
          </p>
          
          {/* Categorías */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex border border-gray-200 p-1">
              {(['todos', 'living', 'comedor', 'dormitorio'] as EnvironmentCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm font-serif ${
                    activeCategory === category
                      ? 'bg-[#C8A97E] text-white'
                      : 'text-gray-600 hover:text-[#C8A97E]'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Grid de productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                className="bg-white rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="h-60 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {product.isNew && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-[#C8A97E] text-white text-xs font-serif">
                      NUEVO
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-serif text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 font-serif line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#C8A97E] font-serif">${product.price}</span>
                    <button 
                      onClick={() => setShowContact(true)}
                      className="text-[#C8A97E] border border-[#C8A97E] px-3 py-1 hover:bg-[#C8A97E] hover:text-white transition-colors font-serif text-sm"
                    >
                      Consultar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contacto */}
      <section id="contacto" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-4 text-gray-800">
              Contacto
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-serif">
              Nuestro equipo está disponible para asesorarte en la elección ideal para tu espacio.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-serif text-gray-800 mb-4">Visítanos</h3>
                  <p className="text-gray-600 font-serif mb-2">Av. Principal 1234, Ciudad</p>
                  <p className="text-gray-600 font-serif mb-2">Lunes a Sábado: 10:00 - 20:00</p>
                  <p className="text-gray-600 font-serif">Domingo: Cerrado</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-serif text-gray-800 mb-4">Mapa</h3>
                  <div className="bg-gray-200 h-80">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500 font-serif">Mapa interactivo</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-serif text-gray-800 mb-4">Envíanos un mensaje</h3>
                <div className="text-gray-800">Para consultas, por favor usá el formulario de contacto principal de la plataforma.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-serif text-gray-800">
                Muebles<span className="text-[#C8A97E]">Minimalistas</span>
              </h2>
              <p className="text-gray-600 mt-2 font-serif">Diseño elegante para espacios únicos</p>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-8">
              <div className="mb-4 md:mb-0">
                <h3 className="text-gray-800 font-serif mb-2">Categorías</h3>
                <ul className="space-y-1">
                  <li><a href="#catalogo" className="text-gray-600 hover:text-[#C8A97E] transition-colors font-serif">Living</a></li>
                  <li><a href="#catalogo" className="text-gray-600 hover:text-[#C8A97E] transition-colors font-serif">Comedor</a></li>
                  <li><a href="#catalogo" className="text-gray-600 hover:text-[#C8A97E] transition-colors font-serif">Dormitorio</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-gray-800 font-serif mb-2">Enlaces</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-600 hover:text-[#C8A97E] transition-colors font-serif">Inicio</a></li>
                  <li><a href="#inspiracion" className="text-gray-600 hover:text-[#C8A97E] transition-colors font-serif">Inspiración</a></li>
                  <li><a href="#contacto" className="text-gray-600 hover:text-[#C8A97E] transition-colors font-serif">Contacto</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 font-serif">
            <p>© 2025 Muebles Minimalistas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      
      {/* Modal de contacto */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-sm max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-serif text-gray-800">Solicitar información</h3>
              <button onClick={() => setShowContact(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Nombre" 
                    className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-sm focus:border-[#C8A97E] focus:outline-none font-serif"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="admin@tuweb-ai.com" 
                    className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-sm focus:border-[#C8A97E] focus:outline-none font-serif"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="Teléfono" 
                    className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-sm focus:border-[#C8A97E] focus:outline-none font-serif"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Mensaje" 
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-sm focus:border-[#C8A97E] focus:outline-none font-serif"
                  ></textarea>
                </div>
                <motion.button 
                  type="button"
                  className="w-full bg-[#C8A97E] text-white py-2 font-serif hover:bg-[#B89A6E] transition-colors"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setShowContact(false)}
                >
                  Enviar Consulta
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}