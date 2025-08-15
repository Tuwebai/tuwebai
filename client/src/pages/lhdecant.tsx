import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

// Componentes
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';

// Tipos de productos
type ProductCategory = 'todos' | 'fragancias' | 'decants' | 'accesorios';

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
  description?: string;
}

export default function LHDecant() {
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
      name: "Decant Tom Ford - Tobacco Vanille",
      price: 24.99,
      category: 'decants',
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true,
      description: "Fragancia oriental con notas de tabaco y vainilla"
    },
    {
      id: 2,
      name: "Decant Creed - Aventus",
      price: 29.99,
      discountPrice: 26.99,
      category: 'decants',
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      description: "Fragancia masculina con notas de piña y bergamota"
    },
    {
      id: 3,
      name: "Decant Jo Malone - Wood Sage & Sea Salt",
      price: 19.99,
      category: 'decants',
      image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Fragancia fresca con notas marinas y saladas"
    },
    {
      id: 4,
      name: "Decant Byredo - Gypsy Water",
      price: 22.99,
      category: 'decants',
      image: "https://images.unsplash.com/photo-1592945403244-b3faa74b2c98?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      description: "Fragancia bohemia con notas de pino y vainilla"
    },
    {
      id: 5,
      name: "Decant Maison Margiela - Jazz Club",
      price: 21.99,
      category: 'decants',
      image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Fragancia masculina con notas de ron y tabaco"
    },
    {
      id: 6,
      name: "Set de Viales Premium",
      price: 15.99,
      category: 'accesorios',
      image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true,
      description: "Set de 5 viales de cristal para decants"
    }
  ];

  // Filtrar productos por categoría
  const filteredProducts = activeCategory === 'todos' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Función para agregar al carrito
  const addToCart = (product: Product) => {
    setCartCount(prev => prev + 1);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ScrollProgress />
      
      {/* Header */}
      <header className="relative bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-white hover:text-blue-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">LH Decants</h1>
                <p className="text-gray-400 text-sm">Elegancia en su forma más pura</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="text-white hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
              
              <div className="relative">
                <button className="text-white hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              LH Decants
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explorá el arte del perfume sin comprar a ciegas: nuestros decants 100% originales te acercan a las fragancias más exclusivas del mundo, gota a gota.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button 
                onClick={() => window.open('https://lhdecant.com/', '_blank')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Visitar sitio web
              </button>
              <button className="border border-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200">
                Ver catálogo completo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {(['todos', 'decants', 'accesorios'] as ProductCategory[]).map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category === 'todos' ? 'Todos' : 
                 category === 'decants' ? 'Decants' : 
                 category === 'accesorios' ? 'Accesorios' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {product.isNew && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Nuevo
                    </div>
                  )}
                  {product.isFeatured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Destacado
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-white">${product.price}</span>
                      {product.discountPrice && (
                        <span className="text-sm text-gray-400 line-through">${product.discountPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">¿Por qué elegir LH Decants?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Descubre las ventajas de nuestros decants 100% originales
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">100% Originales</h3>
              <p className="text-gray-400">Todos nuestros decants provienen directamente de frascos auténticos</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Calidad Preservada</h3>
              <p className="text-gray-400">Mantenemos la intensidad y carácter original de cada fragancia</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Variedad Exclusiva</h3>
              <p className="text-gray-400">Accede a las fragancias más exclusivas del mundo sin compromiso</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para explorar?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Descubre nuestra colección completa de decants y encuentra tu próxima fragancia favorita
          </p>
          <button 
            onClick={() => window.open('https://lhdecant.com/', '_blank')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            Visitar LH Decants
          </button>
        </div>
      </section>

      {/* Notificación */}
      {showNotification && (
        <motion.div
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          Producto agregado al carrito
        </motion.div>
      )}

      <WhatsAppButton />
    </div>
  );
}
