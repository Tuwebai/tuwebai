import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

// Componentes
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';

// Tipos de productos
type ProductCategory = 'todos' | 'remeras' | 'camperas' | 'accesorios';

// Interfaz de producto
interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  category: ProductCategory;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export default function RopaUrbana() {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');
  const [cartCount, setCartCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  
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
      name: "Remera Oversize Urban",
      price: 34.99,
      category: 'remeras',
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true
    },
    {
      id: 2,
      name: "Campera Night Rider",
      price: 89.99,
      discountPrice: 79.99,
      category: 'camperas',
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isNew: true
    },
    {
      id: 3,
      name: "Gorra Urban Camo",
      price: 24.99,
      category: 'accesorios',
      image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      name: "Remera Neon Vibes",
      price: 32.99,
      category: 'remeras',
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isNew: true
    },
    {
      id: 5,
      name: "Campera Denim Urban",
      price: 78.99,
      category: 'camperas',
      image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 6,
      name: "Pulsera Neon LED",
      price: 15.99,
      category: 'accesorios',
      image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true
    },
    {
      id: 7,
      name: "Remera Grafiti Style",
      price: 36.99,
      category: 'remeras',
      image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 8,
      name: "Gorro Beanie Street",
      price: 18.99,
      category: 'accesorios',
      image: "https://images.unsplash.com/photo-1511500118080-275313ec90a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    }
  ];
  
  // Productos filtrados por categoría
  const filteredProducts = activeCategory === 'todos' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Productos destacados para el slider
  const featuredProducts = products.filter(product => product.isFeatured);
  
  // Función para añadir al carrito
  const addToCart = () => {
    setCartCount(prev => prev + 1);
    setShowNotification(true);
    
    // Ocultar notificación después de 3 segundos
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <>
      <ScrollProgress />
      <WhatsAppButton />
      
      {/* Botón Volver a Proyectos */}
      <div className="fixed left-5 z-50" style={{ top: '80px' }}>
        <Link 
          to="/#showroom" 
          className="flex items-center gap-2 bg-black bg-opacity-80 hover:bg-opacity-100 px-4 py-2 rounded-full text-white border border-[#00CCFF] hover:border-[#2EE59D] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Volver a Proyectos</span>
        </Link>
      </div>
      
      {/* Notificación carrito */}
      {showNotification && (
        <motion.div 
          className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          Producto añadido al carrito
        </motion.div>
      )}
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black bg-opacity-90 z-40 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              <span className="text-[#00CCFF]">Urban</span>
              <span className="text-white">Style</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#productos" className="text-gray-300 hover:text-white transition-colors">Productos</a>
            <a href="#contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</a>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#00CCFF] text-black w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="h-screen flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1523398002811-999ca8dec234?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="text-[#00CCFF]">Street</span> Wear <br />
              <span className="text-[#2EE59D]">Modern</span> Culture
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto">
              Descubre nuestra colección de moda urbana para quienes quieren destacar con estilo y actitud.
            </p>
            <a 
              href="#productos"
              className="inline-block bg-[#00CCFF] text-black px-8 py-4 rounded-full font-bold hover:bg-[#2EE59D] transition-colors duration-300"
            >
              Ver Colección
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Productos destacados */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-white">Productos </span>
            <span className="text-[#00CCFF]">Destacados</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                className="bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="h-64 bg-gray-800 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    {product.isNew && (
                      <span className="px-2 py-1 bg-[#2EE59D] text-black text-xs font-bold rounded">
                        NUEVO
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    {product.discountPrice ? (
                      <div>
                        <span className="text-gray-400 line-through mr-2">${product.price}</span>
                        <span className="text-[#00CCFF] font-bold">${product.discountPrice}</span>
                      </div>
                    ) : (
                      <span className="text-[#00CCFF] font-bold">${product.price}</span>
                    )}
                    <button 
                      onClick={addToCart}
                      className="bg-[#00CCFF] text-black px-3 py-1 rounded hover:bg-[#2EE59D] transition-colors"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Promos */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-r from-[#00CCFF] to-[#2EE59D] p-1 rounded-lg"
            whileHover={{ scale: 1.01 }}
          >
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                ¡50% OFF en la segunda unidad!
              </h2>
              <p className="text-gray-300 mb-6">
                En todos los productos de la colección Urban. Oferta válida por tiempo limitado.
              </p>
              <motion.button 
                className="bg-[#00CCFF] text-black px-6 py-3 rounded-full font-bold hover:bg-[#2EE59D] transition-colors"
                whileHover={{ scale: 1.05 }}
                onClick={addToCart}
              >
                Comprar Ahora
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Productos */}
      <section id="productos" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-white">Nuestra </span>
            <span className="text-[#00CCFF]">Colección</span>
          </h2>
          
          {/* Categorías */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-black p-1 rounded-full">
              {(['todos', 'remeras', 'camperas', 'accesorios'] as ProductCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === category
                      ? 'bg-[#00CCFF] text-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Grid de productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                className="bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-[#00CCFF]/20 transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="h-60 bg-gray-800 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-[#2EE59D] text-black text-xs font-bold rounded">
                      NUEVO
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    {product.discountPrice ? (
                      <div>
                        <span className="text-gray-400 line-through text-sm mr-1">${product.price}</span>
                        <span className="text-[#00CCFF] font-bold">${product.discountPrice}</span>
                      </div>
                    ) : (
                      <span className="text-[#00CCFF] font-bold">${product.price}</span>
                    )}
                    <button 
                      onClick={addToCart}
                      className="bg-[#00CCFF] text-black px-3 py-1 rounded hover:bg-[#2EE59D] transition-colors text-sm"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contacto */}
      <section id="contacto" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="text-white">Contacta con </span>
              <span className="text-[#00CCFF]">nosotros</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-gray-900 p-6 rounded-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Redes Sociales</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-[#00CCFF] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.85 0 3.204-.012 3.584-.07 4.85-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.645-.07-4.849 0-3.204.012-3.584.07-4.85.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>@urbanstyle</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-[#00CCFF] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                      </svg>
                      <span>Urban Style</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-[#00CCFF] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      <span>@urbanstyle</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-300 hover:text-[#00CCFF] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      <span>Urban Style Channel</span>
                    </a>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-gray-900 p-6 rounded-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Envíanos un mensaje</h3>
                <form className="space-y-4">
                  <div className="text-white">Para consultas, por favor usá el formulario de contacto principal de la plataforma.</div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white">
                <span className="text-[#00CCFF]">Urban</span>
                <span className="text-white">Style</span>
              </h2>
              <p className="text-gray-400 mt-2">Moda urbana con actitud</p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h3 className="text-white font-bold mb-2">Navegación</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-400 hover:text-[#00CCFF] transition-colors">Home</a></li>
                  <li><a href="#productos" className="text-gray-400 hover:text-[#00CCFF] transition-colors">Productos</a></li>
                  <li><a href="#contacto" className="text-gray-400 hover:text-[#00CCFF] transition-colors">Contacto</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Legal</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-400 hover:text-[#00CCFF] transition-colors">Términos</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[#00CCFF] transition-colors">Privacidad</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© 2025 Urban Style. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}