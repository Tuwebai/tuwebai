import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

// Componentes
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';

// Tipos de productos
type ProductCategory = 'todos' | 'caramelos' | 'chocolates' | 'gomitas' | 'artesanales';

// Interfaz de producto
interface Product {
  id: number;
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  isPromo?: boolean;
  isNew?: boolean;
  discount?: number;
  description?: string;
}

// Interfaz para promociones
interface Promo {
  id: number;
  title: string;
  description: string;
  image: string;
  discount: number;
  endDate: string;
}

export default function Dulce() {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Efecto para desplazar al inicio cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Doble verificación con timeout para asegurar que funcione
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);
  
  // Colores de la marca
  const colors = {
    primary: '#FF66C4', // Rosa brillante
    secondary: '#33CCFF', // Celeste vivo
    accent: '#FFCC00', // Amarillo brillante
    background: '#FFF6F6', // Rosa claro
    text: '#FF1493', // Rosa fuerte
  };
  
  // Productos
  const products: Product[] = [
    {
      id: 1,
      name: "Caramelos Surtidos",
      price: 5.99,
      category: 'caramelos',
      image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isPromo: true,
      discount: 15,
      description: "Deliciosa mezcla de caramelos duros con sabores frutales."
    },
    {
      id: 2,
      name: "Bombones Artesanales",
      price: 12.99,
      category: 'chocolates',
      image: "https://images.unsplash.com/photo-1549007994-cb8bed85524c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      description: "Bombones rellenos de cremas exquisitas, elaborados a mano."
    },
    {
      id: 3,
      name: "Gomitas Arcoíris",
      price: 4.50,
      category: 'gomitas',
      image: "https://images.unsplash.com/photo-1534119428213-bd2626145164?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isPromo: true,
      discount: 10,
      description: "Gomitas de colores vibrantes y sabores frutales."
    },
    {
      id: 4,
      name: "Chocolates Especiales",
      price: 9.99,
      category: 'chocolates',
      image: "https://images.unsplash.com/photo-1548740042-aa63804809b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Tabletas de chocolate premium con un 70% de cacao."
    },
    {
      id: 5,
      name: "Paletas Artesanales",
      price: 3.50,
      category: 'artesanales',
      image: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      description: "Paletas hechas a mano con sabores únicos y colores divertidos."
    },
    {
      id: 6,
      name: "Ositos de Goma",
      price: 3.99,
      category: 'gomitas',
      image: "https://images.unsplash.com/photo-1582058091405-bf8daba6c752?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Deliciosos ositos de goma con sabores frutales intensos."
    },
    {
      id: 7,
      name: "Alfajores Dulces",
      price: 7.50,
      category: 'artesanales',
      image: "https://images.unsplash.com/photo-1515467837939-8861f35dc524?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isPromo: true,
      discount: 20,
      description: "Alfajores caseros rellenos de dulce de leche y bañados en chocolate."
    },
    {
      id: 8,
      name: "Caramelos de Menta",
      price: 2.99,
      category: 'caramelos',
      image: "https://images.unsplash.com/photo-1624454002302-c8d1fa5db95b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Refrescantes caramelos de menta, ideales para después de las comidas."
    }
  ];
  
  // Promociones del mes
  const promos: Promo[] = [
    {
      id: 1,
      title: "¡2x1 en Gomitas!",
      description: "Lleva 2 paquetes de gomitas y paga solo 1. ¡No te pierdas esta dulce oportunidad!",
      image: "https://images.unsplash.com/photo-1582058091487-40e399d316c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      discount: 50,
      endDate: "30 de abril"
    },
    {
      id: 2,
      title: "Combo Familiar",
      description: "Lleva un mix de chocolates, gomitas y caramelos con un 30% de descuento.",
      image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      discount: 30,
      endDate: "15 de mayo"
    },
    {
      id: 3,
      title: "Happy Hour Dulce",
      description: "Todos los jueves de 16 a 18h, 25% de descuento en toda la tienda.",
      image: "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      discount: 25,
      endDate: "Todos los jueves"
    }
  ];
  
  // Productos filtrados por categoría
  const filteredProducts = activeCategory === 'todos' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  // Función para añadir al carrito
  const addToCart = (productId: number) => {
    setCartItems([...cartItems, productId]);
    setNotificationMessage('¡Producto añadido al carrito!');
    setShowNotification(true);
    
    // Ocultar notificación después de 3 segundos
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  
  // Animación de flotar para elementos decorativos
  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  };

  return (
    <>
      <ScrollProgress />
      <WhatsAppButton />
      
      {/* Botón Volver a Proyectos */}
      <div className="fixed left-5 z-50" style={{ top: '80px' }}>
        <Link 
          to="/#showroom" 
          className="flex items-center gap-2 bg-white bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-full shadow-lg text-pink-600 border border-pink-400 hover:border-pink-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-['Bubblegum_Sans',_cursive]">Volver a Proyectos</span>
        </Link>
      </div>
      
      {/* Notificación */}
      {showNotification && (
        <motion.div 
          className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg z-50 font-['Bubblegum_Sans',_cursive]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          {notificationMessage}
        </motion.div>
      )}
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40" style={{ backgroundColor: colors.primary }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-['Bubblegum_Sans',_cursive]">
              Dulce<span style={{ color: colors.secondary }}>Tentación</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-yellow-300 transition-colors font-['Bubblegum_Sans',_cursive]">Inicio</a>
            <a href="#productos" className="text-white hover:text-yellow-300 transition-colors font-['Bubblegum_Sans',_cursive]">Productos</a>
            <a href="#promos" className="text-white hover:text-yellow-300 transition-colors font-['Bubblegum_Sans',_cursive]">Promociones</a>
            <a href="#contacto" className="text-white hover:text-yellow-300 transition-colors font-['Bubblegum_Sans',_cursive]">Contacto</a>
          </div>
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-pink-600 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="min-h-screen pt-20 flex items-center" style={{ background: `linear-gradient(to bottom, ${colors.background}, #FFF)` }}>
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute w-16 h-16 rounded-full opacity-20"
            style={{ top: '10%', left: '5%', backgroundColor: colors.primary }}
            animate={floatAnimation}
          />
          <motion.div 
            className="absolute w-8 h-8 rounded-full opacity-30"
            style={{ top: '20%', right: '10%', backgroundColor: colors.secondary }}
            animate={{
              ...floatAnimation,
              transition: { ...floatAnimation.transition, delay: 0.5 }
            }}
          />
          <motion.div 
            className="absolute w-12 h-12 rounded-full opacity-25"
            style={{ top: '50%', left: '15%', backgroundColor: colors.accent }}
            animate={{
              ...floatAnimation,
              transition: { ...floatAnimation.transition, delay: 1 }
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 font-['Bubblegum_Sans',_cursive]" style={{ color: colors.text }}>
                Un Mundo de Dulzura y Color
              </h1>
              <p className="text-xl mb-8 text-pink-500 font-['Comic_Neue',_cursive]">
                Descubre nuestras golosinas artesanales, elaboradas con ingredientes de calidad y mucho amor.
              </p>
              <a 
                href="#productos"
                className="inline-block px-8 py-4 rounded-full font-bold text-white shadow-lg transform hover:scale-105 transition duration-300 font-['Bubblegum_Sans',_cursive]"
                style={{ backgroundColor: colors.primary }}
              >
                Ver Dulces
              </a>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1581798459219-318e68f60799?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Variedad de dulces coloridos" 
                  className="rounded-3xl shadow-xl"
                />
                <motion.div 
                  className="absolute -top-5 -right-5 bg-yellow-400 text-pink-600 px-4 py-2 rounded-full shadow-lg font-bold transform rotate-12 font-['Bubblegum_Sans',_cursive]"
                  animate={{
                    rotate: [12, -5, 12],
                    transition: { duration: 3, repeat: Infinity }
                  }}
                >
                  ¡Irresistibles!
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Promos del mes */}
      <section id="promos" className="py-20" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 font-['Bubblegum_Sans',_cursive]" style={{ color: colors.text }}>
              ¡Promos del Mes!
            </h2>
            <p className="text-lg text-pink-500 max-w-2xl mx-auto font-['Comic_Neue',_cursive]">
              No te pierdas estas dulces ofertas que tenemos para ti.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promos.map((promo, index) => (
              <motion.div 
                key={promo.id}
                className="rounded-xl overflow-hidden shadow-lg"
                style={{ backgroundColor: '#FFF' }}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={promo.image} 
                    alt={promo.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-pink-500 bg-opacity-40">
                    <div className="bg-yellow-400 text-pink-600 px-4 py-2 rounded-full font-bold text-xl transform -rotate-12 font-['Bubblegum_Sans',_cursive]">
                      -{promo.discount}%
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 font-['Bubblegum_Sans',_cursive]" style={{ color: colors.text }}>
                    {promo.title}
                  </h3>
                  <p className="text-pink-500 mb-4 font-['Comic_Neue',_cursive]">
                    {promo.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-['Comic_Neue',_cursive]">
                      Válido hasta: {promo.endDate}
                    </span>
                    <motion.button 
                      className="px-3 py-1 rounded-full text-white text-sm font-['Bubblegum_Sans',_cursive]"
                      style={{ backgroundColor: colors.primary }}
                      whileHover={{ scale: 1.05 }}
                    >
                      ¡Lo quiero!
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Productos */}
      <section id="productos" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 font-['Bubblegum_Sans',_cursive]" style={{ color: colors.text }}>
              Nuestros Dulces
            </h2>
            <p className="text-lg text-pink-500 max-w-2xl mx-auto font-['Comic_Neue',_cursive]">
              Cada uno de nuestros productos está elaborado con ingredientes de calidad y el toque especial de nuestros maestros confiteros.
            </p>
          </motion.div>
          
          {/* Categorías */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-4">
            <div className="inline-flex p-1 rounded-full shadow-md" style={{ backgroundColor: '#FFF' }}>
              {(['todos', 'caramelos', 'chocolates', 'gomitas', 'artesanales'] as ProductCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-['Bubblegum_Sans',_cursive] transition-colors ${
                    activeCategory === category
                      ? 'text-white'
                      : 'text-pink-500 hover:text-pink-600'
                  }`}
                  style={{ 
                    backgroundColor: activeCategory === category ? colors.primary : 'transparent'
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                className="rounded-xl overflow-hidden shadow-lg"
                style={{ backgroundColor: '#FFF' }}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  {product.isNew && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-pink-600 px-2 py-1 rounded-full text-xs font-bold">
                      ¡NUEVO!
                    </div>
                  )}
                  {product.isPromo && (
                    <div className="absolute bottom-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{product.discount}%
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 font-['Bubblegum_Sans',_cursive]" style={{ color: colors.text }}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-pink-500 mb-3 font-['Comic_Neue',_cursive] line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    {product.isPromo ? (
                      <div>
                        <span className="text-gray-400 line-through text-sm mr-1">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="font-bold" style={{ color: colors.primary }}>
                          ${(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold" style={{ color: colors.primary }}>
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                    <motion.button 
                      onClick={() => addToCart(product.id)}
                      className="px-3 py-1 rounded-full text-white text-sm font-['Bubblegum_Sans',_cursive]"
                      style={{ backgroundColor: colors.secondary }}
                      whileHover={{ scale: 1.05 }}
                    >
                      Añadir
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="rounded-3xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Banner promocional" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-70"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-['Bubblegum_Sans',_cursive]">
                  ¡Suscríbete a nuestro Newsletter!
                </h2>
                <p className="text-white text-lg mb-6 max-w-xl font-['Comic_Neue',_cursive]">
                  Recibe promociones exclusivas, nuevos productos y sorpresas dulces directamente en tu correo.
                </p>
                <div className="flex flex-col sm:flex-row w-full max-w-lg gap-2">
                  <input 
                    type="email" 
                    placeholder="Tu email" 
                    className="flex-grow px-4 py-2 rounded-full focus:outline-none"
                  />
                  <motion.button 
                    className="px-6 py-2 rounded-full bg-yellow-400 text-pink-600 font-bold font-['Bubblegum_Sans',_cursive]"
                    whileHover={{ scale: 1.05 }}
                  >
                    ¡Quiero Dulzura!
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Contacto */}
      <section id="contacto" className="py-20" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-2 font-['Bubblegum_Sans',_cursive]" style={{ color: colors.text }}>
                ¡Contáctanos!
              </h2>
              <p className="text-lg text-pink-500 font-['Comic_Neue',_cursive]">
                Si tienes dudas, sugerencias o quieres hacer un pedido especial, ¡estamos aquí para ayudarte!
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-bold mb-4 font-['Bubblegum_Sans',_cursive]" style={{ color: colors.text }}>
                  Síguenos en Redes Sociales
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="flex items-center text-pink-500 hover:text-pink-600 transition-colors font-['Comic_Neue',_cursive]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.85 0 3.204-.012 3.584-.07 4.85-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.645-.07-4.849 0-3.204.012-3.584.07-4.85.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>@dulcetentacion</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-pink-500 hover:text-pink-600 transition-colors font-['Comic_Neue',_cursive]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                      </svg>
                      <span>Dulce Tentación</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-pink-500 hover:text-pink-600 transition-colors font-['Comic_Neue',_cursive]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      <span>@dulcetentacion</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-pink-500 hover:text-pink-600 transition-colors font-['Comic_Neue',_cursive]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      <span>Dulce Tentación TV</span>
                    </a>
                  </li>
                </ul>
                
                <h3 className="text-xl font-bold mt-8 mb-4 font-['Bubblegum_Sans',_cursive]" style={{ color: colors.text }}>
                  Visítanos
                </h3>
                <p className="text-pink-500 font-['Comic_Neue',_cursive]">
                  Calle Dulzura 123, Ciudad<br />
                  Lunes a Sábado: 10:00 - 20:00<br />
                  Domingo: 11:00 - 18:00
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold mb-4 font-['Bubblegum_Sans',_cursive]" style={{ color: colors.text }}>
                  Envíanos un mensaje
                </h3>
                <form className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Nombre" 
                      className="w-full px-4 py-2 rounded-full border border-pink-200 focus:border-pink-400 focus:outline-none font-['Comic_Neue',_cursive]"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="w-full px-4 py-2 rounded-full border border-pink-200 focus:border-pink-400 focus:outline-none font-['Comic_Neue',_cursive]"
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="Mensaje" 
                      rows={4}
                      className="w-full px-4 py-2 rounded-xl border border-pink-200 focus:border-pink-400 focus:outline-none font-['Comic_Neue',_cursive]"
                    ></textarea>
                  </div>
                  <motion.button 
                    type="button"
                    className="w-full py-2 rounded-full text-white font-bold font-['Bubblegum_Sans',_cursive]"
                    style={{ backgroundColor: colors.primary }}
                    whileHover={{ scale: 1.02 }}
                  >
                    Enviar Mensaje
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10" style={{ backgroundColor: colors.primary }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white font-['Bubblegum_Sans',_cursive]">
                Dulce<span style={{ color: colors.secondary }}>Tentación</span>
              </h2>
              <p className="text-white mt-2 font-['Comic_Neue',_cursive]">Endulzando tu vida desde 2010</p>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-12">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <h3 className="text-white font-bold mb-2 font-['Bubblegum_Sans',_cursive]">Enlaces</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="text-white hover:text-yellow-300 transition-colors font-['Comic_Neue',_cursive]">Inicio</a></li>
                  <li><a href="#productos" className="text-white hover:text-yellow-300 transition-colors font-['Comic_Neue',_cursive]">Productos</a></li>
                  <li><a href="#promos" className="text-white hover:text-yellow-300 transition-colors font-['Comic_Neue',_cursive]">Promociones</a></li>
                  <li><a href="#contacto" className="text-white hover:text-yellow-300 transition-colors font-['Comic_Neue',_cursive]">Contacto</a></li>
                </ul>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-white font-bold mb-2 font-['Bubblegum_Sans',_cursive]">Legal</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="text-white hover:text-yellow-300 transition-colors font-['Comic_Neue',_cursive]">Términos</a></li>
                  <li><a href="#" className="text-white hover:text-yellow-300 transition-colors font-['Comic_Neue',_cursive]">Privacidad</a></li>
                  <li><a href="#" className="text-white hover:text-yellow-300 transition-colors font-['Comic_Neue',_cursive]">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-pink-400 pt-6 text-center text-white font-['Comic_Neue',_cursive]">
            <p>© 2025 Dulce Tentación. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}