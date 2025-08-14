import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Componentes
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';

// Tipos de productos
type ProductCategory = 'todos' | 'mujer' | 'hombre' | 'accesorios' | 'outlet';

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
  colors?: string[];
}

// Interfaz de categoría
interface Category {
  id: string;
  name: string;
}

export default function EcommerceModa() {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');
  const [cartCount, setCartCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para simular carga
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

  // Categorías
  const categories: Category[] = [
    { id: 'todos', name: 'Todos los productos' },
    { id: 'mujer', name: 'Mujer' },
    { id: 'hombre', name: 'Hombre' },
    { id: 'accesorios', name: 'Accesorios' },
    { id: 'outlet', name: 'Outlet' }
  ];

  // Productos
  const products: Product[] = [
    {
      id: 1,
      name: "Blazer Estructurado Premium",
      price: 229.99,
      discountPrice: 189.99,
      category: 'mujer',
      image: "https://images.unsplash.com/photo-1600603405959-6d623e92445c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true,
      colors: ['#000000', '#F5F5DC', '#0000FF']
    },
    {
      id: 2,
      name: "Vestido Seda Natural",
      price: 349.99,
      category: 'mujer',
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      colors: ['#F5F5DC', '#800020', '#000000']
    },
    {
      id: 3,
      name: "Reloj Automático Exclusivo",
      price: 899.99,
      category: 'accesorios',
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      colors: ['#000000', '#C0C0C0', '#FFD700']
    },
    {
      id: 4,
      name: "Camisa Lino Premium",
      price: 149.99,
      category: 'hombre',
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      colors: ['#F5F5DC', '#FFFFFF', '#87CEEB']
    },
    {
      id: 5,
      name: "Zapatos Cuero Italiano",
      price: 279.99,
      discountPrice: 219.99,
      category: 'hombre',
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      colors: ['#000000', '#8B4513', '#A52A2A']
    },
    {
      id: 6,
      name: "Bolso Cuero Premium",
      price: 399.99,
      category: 'accesorios',
      image: "https://images.unsplash.com/photo-1594422307130-7f57a3683957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true,
      colors: ['#A52A2A', '#000000', '#F5F5DC']
    },
    {
      id: 7,
      name: "Abrigo Cachemira",
      price: 589.99,
      category: 'mujer',
      image: "https://images.unsplash.com/photo-1548624313-0396284dfed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      colors: ['#808080', '#000000', '#8B4513']
    },
    {
      id: 8,
      name: "Cinturón Cuero Trenzado",
      price: 119.99,
      discountPrice: 89.99,
      category: 'accesorios',
      image: "https://images.unsplash.com/photo-1553704571-c32d20af8016?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      colors: ['#8B4513', '#000000']
    },
    {
      id: 9,
      name: "Jeans Premium Stretch",
      price: 179.99,
      discountPrice: 139.99,
      category: 'outlet',
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      colors: ['#000080', '#000000', '#808080']
    },
    {
      id: 10,
      name: "Gafas Sol Acetato",
      price: 199.99,
      category: 'outlet',
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      colors: ['#000000', '#A52A2A', '#808080']
    }
  ];
  
  // Productos filtrados por categoría
  let filteredProducts = activeCategory === 'todos' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Búsqueda
  if (searchQuery.trim()) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#191919] border-r-[#f8f8f8] border-b-[#f8f8f8] border-l-[#f8f8f8] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#191919]">HAUTE COUTURE</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollProgress color="#191919" />
      <WhatsAppButton />
      
      {/* Notificación carrito */}
      {showNotification && (
        <motion.div 
          className="fixed top-5 right-5 bg-[#191919] text-white px-4 py-2 z-50 shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          Producto añadido al carrito
        </motion.div>
      )}
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Botón de menú móvil */}
              {isMobile && (
                <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              {/* Logo */}
              <h1 className="text-2xl font-bold text-[#191919]">
                HAUTE<span className="font-light">COUTURE</span>
              </h1>
              
              {/* Navegación desktop */}
              {!isMobile && (
                <nav className="hidden lg:flex items-center space-x-6">
                  <a href="#" className="text-[#191919] hover:text-[#777] transition-colors text-sm uppercase tracking-wider">Mujer</a>
                  <a href="#" className="text-[#191919] hover:text-[#777] transition-colors text-sm uppercase tracking-wider">Hombre</a>
                  <a href="#" className="text-[#191919] hover:text-[#777] transition-colors text-sm uppercase tracking-wider">Accesorios</a>
                  <a href="#" className="text-[#191919] hover:text-[#777] transition-colors text-sm uppercase tracking-wider">Colección</a>
                  <a href="#" className="text-[#191919] hover:text-[#777] transition-colors text-sm uppercase tracking-wider">Outlet</a>
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Búsqueda */}
              <div className="relative">
                {showSearch ? (
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="border border-gray-300 p-1 pl-8 text-sm rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                    autoFocus
                  />
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-[#191919] cursor-pointer" 
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#191919] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              
              {/* Carrito */}
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#191919] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#191919] text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
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
                <a href="#" className="text-[#191919] hover:text-[#777] transition-colors text-sm uppercase tracking-wider">Mujer</a>
                <a href="#" className="text-[#191919] hover:text-[#777] transition-colors text-sm uppercase tracking-wider">Hombre</a>
                <a href="#" className="text-[#191919] hover:text-[#777] transition-colors text-sm uppercase tracking-wider">Accesorios</a>
                <a href="#" className="text-[#191919] hover:text-[#777] transition-colors text-sm uppercase tracking-wider">Colección</a>
                <a href="#" className="text-[#191919] hover:text-[#777] transition-colors text-sm uppercase tracking-wider">Outlet</a>
              </nav>
            </motion.div>
          )}
        </div>
      </header>
      
      {/* Hero section */}
      <section className="h-screen flex items-center justify-center text-center bg-cover bg-center pt-16" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-light text-white mb-4 uppercase tracking-wide">
              Elegancia <span className="font-bold">Eterna</span>
            </h1>
            <p className="text-xl text-white mb-8 opacity-90">
              Descubre la nueva colección otoño-invierno con piezas de calidad superior y diseño atemporal.
            </p>
            <a 
              href="#productos"
              className="inline-block bg-white text-[#191919] px-8 py-3 uppercase tracking-wider text-sm font-medium hover:bg-[#191919] hover:text-white transition-colors duration-300"
            >
              Ver Colección
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Categorías destacadas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12 uppercase tracking-wider">
            <span className="font-bold border-b-2 border-[#191919] pb-2">Categorías</span> Destacadas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
              className="relative h-80 overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Moda Mujer" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white text-2xl font-light mb-2 uppercase tracking-wider">Mujer</h3>
                  <a href="#" className="text-white text-sm uppercase tracking-wider border-b border-white pb-1 hover:border-[#191919] transition-colors">Ver colección</a>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative h-80 overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Moda Hombre" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white text-2xl font-light mb-2 uppercase tracking-wider">Hombre</h3>
                  <a href="#" className="text-white text-sm uppercase tracking-wider border-b border-white pb-1 hover:border-[#191919] transition-colors">Ver colección</a>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative h-80 overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Accesorios" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white text-2xl font-light mb-2 uppercase tracking-wider">Accesorios</h3>
                  <a href="#" className="text-white text-sm uppercase tracking-wider border-b border-white pb-1 hover:border-[#191919] transition-colors">Ver colección</a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Banner promocional */}
      <section className="py-16 bg-[#f8f8f8]">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 shadow-sm">
            <div className="grid md:grid-cols-5 gap-6 items-center">
              <div className="md:col-span-3 text-center md:text-left">
                <h2 className="text-3xl font-light text-[#191919] mb-4 uppercase tracking-wider">Nuevo <span className="font-bold">Outlet</span></h2>
                <p className="text-gray-600 mb-6 md:pr-16">
                  Descubre piezas de colecciones anteriores con descuentos de hasta el 70%. Calidad premium, precios irresistibles.
                </p>
                <a href="#" className="inline-block bg-[#191919] text-white px-6 py-2 uppercase tracking-wider text-sm hover:bg-[#333] transition-colors">
                  Descubrir ofertas
                </a>
              </div>
              <div className="md:col-span-2">
                <img 
                  src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Outlet" 
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Productos */}
      <section id="productos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12 uppercase tracking-wider">
            <span className="font-bold border-b-2 border-[#191919] pb-2">Productos</span> Destacados
          </h2>
          
          {/* Categorías */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as ProductCategory)}
                  className={`px-4 py-2 min-w-max text-sm uppercase tracking-wider ${
                    activeCategory === category.id
                      ? 'bg-[#191919] text-white'
                      : 'bg-white text-[#191919] border border-[#191919] hover:bg-[#f8f8f8]'
                  } transition-colors`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                className="group relative"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-80 overflow-hidden bg-gray-100">
                  {(product.isNew || product.discountPrice) && (
                    <div className="absolute top-0 left-0 z-10">
                      {product.isNew && (
                        <div className="bg-[#191919] text-white px-3 py-1 text-xs uppercase tracking-wider">
                          Nuevo
                        </div>
                      )}
                      {product.discountPrice && (
                        <div className="bg-[#D10000] text-white px-3 py-1 text-xs uppercase tracking-wider mt-1">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% Off
                        </div>
                      )}
                    </div>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button 
                      onClick={addToCart}
                      className="bg-white text-[#191919] px-4 py-2 uppercase tracking-wider text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-[#191919] font-medium">{product.name}</h3>
                  <div className="flex items-center mt-1 mb-2">
                    {product.discountPrice ? (
                      <>
                        <span className="text-gray-400 line-through mr-2">${product.price.toFixed(2)}</span>
                        <span className="text-[#D10000] font-semibold">${product.discountPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-[#191919] font-semibold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  {product.colors && (
                    <div className="flex space-x-1 mt-2">
                      {product.colors.map((color, index) => (
                        <div 
                          key={index} 
                          className="w-4 h-4 rounded-full border border-gray-300" 
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Botón ver más */}
          <div className="text-center mt-16">
            <a 
              href="#" 
              className="inline-block border border-[#191919] text-[#191919] px-8 py-3 uppercase tracking-wider text-sm hover:bg-[#191919] hover:text-white transition-colors"
            >
              Ver todos los productos
            </a>
          </div>
        </div>
      </section>
      
      {/* Sección de características */}
      <section className="py-16 bg-[#f8f8f8]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-4 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-[#191919] font-medium mb-2 uppercase tracking-wider">Envío Gratis</h3>
              <p className="text-gray-600 text-sm">
                En compras superiores a $200
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-[#191919] font-medium mb-2 uppercase tracking-wider">Compra Segura</h3>
              <p className="text-gray-600 text-sm">
                Pago seguro y protegido
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-[#191919] font-medium mb-2 uppercase tracking-wider">Pago Flexible</h3>
              <p className="text-gray-600 text-sm">
                Múltiples opciones de pago
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-[#191919] font-medium mb-2 uppercase tracking-wider">Devolución Gratis</h3>
              <p className="text-gray-600 text-sm">
                30 días para devoluciones
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-light text-[#191919] mb-6 uppercase tracking-wider">
              <span className="font-bold">Newsletter</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Únete a nuestra lista y recibe 10% de descuento en tu primera compra, además de noticias exclusivas y lanzamientos anticipados.
            </p>
            <form className="flex flex-col sm:flex-row max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="flex-grow px-4 py-3 border border-gray-300 focus:border-[#191919] focus:outline-none mb-3 sm:mb-0"
                required
              />
              <button 
                type="submit" 
                className="bg-[#191919] text-white px-6 py-3 uppercase tracking-wider text-sm hover:bg-[#333] transition-colors sm:ml-2"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#191919] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-4 uppercase tracking-wider">Sobre Nosotros</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                HAUTECOUTURE es una marca de lujo comprometida con la calidad y la elegancia atemporal. Cada prenda está diseñada con los más altos estándares y materiales premium.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 uppercase tracking-wider">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Mujer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Hombre</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Accesorios</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Outlet</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Colecciones</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 uppercase tracking-wider">Ayuda</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Envíos y Devoluciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Condiciones de Compra</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Política de Privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4 uppercase tracking-wider">Contacto</h4>
              <address className="not-italic text-gray-400 text-sm leading-relaxed">
                Av. Corrientes 1234<br />
                Buenos Aires, Argentina<br /><br />
                <a href="tel:+543571416044" className="hover:text-white transition-colors">+54 9 3571 416044</a><br />
                <a href="mailto:tuwebai@gmail.com" className="hover:text-white transition-colors">tuwebai@gmail.com</a>
              </address>
              
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm2.218 18.616c-.354.069-.468-.149-.468-.336v-1.921c0-.653-.229-1.079-.481-1.296 1.56-.173 3.198-.765 3.198-3.454 0-.765-.273-1.389-.721-1.879.072-.177.312-.889-.069-1.853 0 0-.587-.188-1.923.717-.561-.154-1.159-.231-1.754-.234-.595.003-1.193.08-1.753.235-1.337-.905-1.925-.717-1.925-.717-.379.964-.14 1.676-.067 1.852-.448.49-.722 1.114-.722 1.879 0 2.682 1.634 3.282 3.189 3.459-.2.175-.381.483-.444.936-.4.179-1.413.488-2.037-.582 0 0-.37-.672-1.073-.722 0 0-.683-.009-.048.426 0 0 .46.215.777 1.024 0 0 .405 1.25 2.353.826v1.303c0 .185-.113.402-.462.337-2.782-.925-4.788-3.549-4.788-6.641 0-3.867 3.135-7 7-7s7 3.133 7 7c0 3.091-2.003 5.715-4.782 6.641z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} HAUTECOUTURE. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}