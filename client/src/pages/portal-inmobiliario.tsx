import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Componentes
import WhatsAppButton from '@/components/ui/whatsapp-button';
import ScrollProgress from '@/components/ui/scroll-progress';

export default function PortalInmobiliario() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('comprar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [propertyType, setPropertyType] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [savedProperties, setSavedProperties] = useState<number[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);

  // Efecto para simular carga
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // Propiedades de ejemplo
  const properties = [
    {
      id: 1,
      title: "Apartamento de lujo en Palermo",
      price: 350000,
      location: "Palermo, Buenos Aires",
      address: "Av. Libertador 3456, CABA",
      type: "apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      description: "Hermoso apartamento de lujo totalmente renovado con acabados de alta calidad. Cuenta con amplio living-comedor, cocina integrada, tres dormitorios con closet y dos baños completos. Edificio con seguridad 24hs, SUM y piscina.",
      features: ["Balcón", "Cochera", "Piscina", "Gimnasio", "Seguridad 24hs"],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      ],
      agent: {
        name: "María Rodríguez",
        phone: "+541165789034",
        photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      isNew: true,
      isFeatured: true
    },
    {
      id: 2,
      title: "Casa con jardín en San Isidro",
      price: 580000,
      location: "San Isidro, Buenos Aires",
      address: "Calle Rivadavia 456, San Isidro",
      type: "house",
      bedrooms: 4,
      bathrooms: 3,
      area: 240,
      description: "Amplia casa en dos plantas con jardín y piscina. Cuenta con living, comedor, cocina equipada, cuatro dormitorios (suite principal con vestidor), tres baños completos y dependencia de servicio. Garage para dos autos.",
      features: ["Jardín", "Piscina", "Parrilla", "Garage doble", "Dependencia"],
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      ],
      agent: {
        name: "Javier López",
        phone: "+541154321567",
        photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      isNew: false,
      isFeatured: true
    },
    {
      id: 3,
      title: "Oficina en microcentro",
      price: 220000,
      location: "Microcentro, Buenos Aires",
      address: "Calle Reconquista 876, CABA",
      type: "office",
      bedrooms: 0,
      bathrooms: 2,
      area: 85,
      description: "Oficina con excelente ubicación a metros de Plaza de Mayo. Ambiente principal más dos despachos privados. Recepción, sala de reuniones y office. Edificio con seguridad 24hs y 4 ascensores.",
      features: ["Seguridad 24hs", "Ascensor", "Sala de reuniones", "Cableado para red", "Aire acondicionado central"],
      images: [
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      ],
      agent: {
        name: "Carlos Méndez",
        phone: "+541167890987",
        photo: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      isNew: true,
      isFeatured: false
    },
    {
      id: 4,
      title: "Dúplex moderno en Belgrano",
      price: 420000,
      location: "Belgrano, Buenos Aires",
      address: "Calle Cuba 2345, CABA",
      type: "apartment",
      bedrooms: 2,
      bathrooms: 3,
      area: 140,
      description: "Moderno dúplex con diseño contemporáneo y excelentes terminaciones. Planta baja: living-comedor con cocina integrada y toilette. Planta alta: dos dormitorios en suite con vestidor. Terraza privada con jacuzzi.",
      features: ["Dúplex", "Terraza", "Jacuzzi", "Vestidor", "Aire acondicionado"],
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      ],
      agent: {
        name: "Lucía Fernández",
        phone: "+541156473829",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      isNew: false,
      isFeatured: true
    },
    {
      id: 5,
      title: "Terreno en Pilar",
      price: 180000,
      location: "Pilar, Buenos Aires",
      address: "Ruta 8 Km 50, Pilar",
      type: "land",
      bedrooms: 0,
      bathrooms: 0,
      area: 800,
      description: "Excelente terreno en barrio cerrado con seguridad 24hs. Ubicado sobre laguna con muelle propio. Todos los servicios subterráneos y calles asfaltadas. Ideal para construir la casa de sus sueños.",
      features: ["Vista al lago", "Barrio cerrado", "Seguridad 24hs", "Club house", "Servicios subterráneos"],
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1543877087-ebf71fde2be1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      ],
      agent: {
        name: "Pablo Martínez",
        phone: "+541159876543",
        photo: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      isNew: true,
      isFeatured: false
    },
    {
      id: 6,
      title: "Local comercial en Recoleta",
      price: 280000,
      location: "Recoleta, Buenos Aires",
      address: "Av. Santa Fe 1560, CABA",
      type: "commercial",
      bedrooms: 0,
      bathrooms: 1,
      area: 110,
      description: "Local comercial a la calle con excelente ubicación y alto tránsito peatonal. Cuenta con vidriera, salón principal, depósito y baño. Ideal para retail, showroom o gastronomía.",
      features: ["Ubicación premium", "Vidriera a la calle", "Depósito", "Alarma", "Alta exposición"],
      images: [
        "https://images.unsplash.com/photo-1582037928769-fde045ee0f7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      ],
      agent: {
        name: "Valeria Torres",
        phone: "+541154789632",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      },
      isNew: false,
      isFeatured: false
    }
  ];

  // Obtener propiedades filtradas
  const getFilteredProperties = () => {
    let filtered = properties;
    
    // Filtrar por tipo de propiedad
    if (propertyType !== 'all') {
      filtered = filtered.filter(property => property.type === propertyType);
    }
    
    // Filtrar por ubicación
    if (searchLocation) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(searchLocation.toLowerCase()) || 
        property.address.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    // Filtrar por precio
    filtered = filtered.filter(property => 
      property.price >= priceRange[0] && property.price <= priceRange[1]
    );
    
    // Filtrar por dormitorios
    if (bedrooms > 0) {
      filtered = filtered.filter(property => property.bedrooms >= bedrooms);
    }
    
    // Filtrar por baños
    if (bathrooms > 0) {
      filtered = filtered.filter(property => property.bathrooms >= bathrooms);
    }
    
    return filtered;
  };
  
  const filteredProperties = getFilteredProperties();
  
  // Función para formatear precio
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Función para guardar propiedad
  const toggleSaveProperty = (propertyId: number) => {
    if (savedProperties.includes(propertyId)) {
      setSavedProperties(savedProperties.filter(id => id !== propertyId));
    } else {
      setSavedProperties([...savedProperties, propertyId]);
    }
  };
  
  // Función para resetear filtros
  const resetFilters = () => {
    setSearchLocation('');
    setPriceRange([0, 1000000]);
    setPropertyType('all');
    setBedrooms(0);
    setBathrooms(0);
  };
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Formulario enviado! Un agente se pondrá en contacto con usted pronto.');
    setShowContactForm(false);
  };
  
  // Loader
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#2E5DB0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-white border-r-[#2E5DB0] border-b-[#2E5DB0] border-l-[#2E5DB0] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">INMOVISOR</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollProgress color="#2E5DB0" />
      <WhatsAppButton />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Botón de menú móvil */}
              {isMobile && (
                <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2E5DB0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              {/* Logo */}
              <h1 className="text-2xl font-bold">
                <span className="text-[#2E5DB0]">INMO</span>
                <span className="text-[#FF6B6B]">VISOR</span>
              </h1>
              
              {/* Navegación desktop */}
              {!isMobile && (
                <nav className="hidden lg:flex items-center space-x-6">
                  <button 
                    className={`text-gray-700 hover:text-[#2E5DB0] transition-colors ${activeTab === 'comprar' ? 'font-semibold text-[#2E5DB0]' : ''}`}
                    onClick={() => setActiveTab('comprar')}
                  >
                    Comprar
                  </button>
                  <button 
                    className={`text-gray-700 hover:text-[#2E5DB0] transition-colors ${activeTab === 'alquilar' ? 'font-semibold text-[#2E5DB0]' : ''}`}
                    onClick={() => setActiveTab('alquilar')}
                  >
                    Alquilar
                  </button>
                  <a href="#" className="text-gray-700 hover:text-[#2E5DB0] transition-colors">Proyectos</a>
                  <a href="#" className="text-gray-700 hover:text-[#2E5DB0] transition-colors">Agencias</a>
                  <a href="#" className="text-gray-700 hover:text-[#2E5DB0] transition-colors">Blog</a>
                </nav>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {!isMobile && (
                <div className="flex items-center">
                  <button className="flex items-center text-gray-700 hover:text-[#2E5DB0] transition-colors mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Guardados</span>
                    {savedProperties.length > 0 && (
                      <span className="ml-1 bg-[#FF6B6B] text-white text-xs px-1.5 py-0.5 rounded-full">
                        {savedProperties.length}
                      </span>
                    )}
                  </button>
                </div>
              )}
              
              {/* Usuario */}
              <button className="bg-[#2E5DB0] text-white px-4 py-2 rounded-full text-sm hover:bg-[#1E4A96] transition-colors">
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
                <button 
                  className={`text-left text-gray-700 hover:text-[#2E5DB0] transition-colors ${activeTab === 'comprar' ? 'font-semibold text-[#2E5DB0]' : ''}`}
                  onClick={() => setActiveTab('comprar')}
                >
                  Comprar
                </button>
                <button 
                  className={`text-left text-gray-700 hover:text-[#2E5DB0] transition-colors ${activeTab === 'alquilar' ? 'font-semibold text-[#2E5DB0]' : ''}`}
                  onClick={() => setActiveTab('alquilar')}
                >
                  Alquilar
                </button>
                <a href="#" className="text-gray-700 hover:text-[#2E5DB0] transition-colors">Proyectos</a>
                <a href="#" className="text-gray-700 hover:text-[#2E5DB0] transition-colors">Agencias</a>
                <a href="#" className="text-gray-700 hover:text-[#2E5DB0] transition-colors">Blog</a>
                <button className="flex items-center text-gray-700 hover:text-[#2E5DB0] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Guardados</span>
                  {savedProperties.length > 0 && (
                    <span className="ml-1 bg-[#FF6B6B] text-white text-xs px-1.5 py-0.5 rounded-full">
                      {savedProperties.length}
                    </span>
                  )}
                </button>
              </nav>
            </motion.div>
          )}
        </div>
      </header>
      
      {/* Hero section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#2E5DB0] to-[#1E4A96]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Encuentra tu propiedad ideal con un solo click
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Miles de propiedades disponibles para comprar, alquilar o invertir. La forma más simple de encontrar tu hogar perfecto.
              </p>
              
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl">
                <div className="flex mb-4">
                  <button
                    className={`flex-1 py-2 text-center rounded-l-lg ${
                      activeTab === 'comprar'
                        ? 'bg-[#2E5DB0] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                    onClick={() => setActiveTab('comprar')}
                  >
                    Comprar
                  </button>
                  <button
                    className={`flex-1 py-2 text-center rounded-r-lg ${
                      activeTab === 'alquilar'
                        ? 'bg-[#2E5DB0] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                    onClick={() => setActiveTab('alquilar')}
                  >
                    Alquilar
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="mb-3 md:mb-0 md:flex-1">
                    <input
                      type="text"
                      placeholder="¿Dónde buscas? Ciudad, barrio o dirección"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                  </div>
                  <button
                    className="bg-[#FF6B6B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#FF5252] transition-colors"
                    onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                  >
                    Buscar
                  </button>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <button
                    className="text-[#2E5DB0] text-sm font-medium flex items-center"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Filtros avanzados
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    {filteredProperties.length} propiedades encontradas
                  </div>
                </div>
                
                {showFilters && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Tipo de propiedad
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                      >
                        <option value="all">Todos los tipos</option>
                        <option value="apartment">Apartamentos</option>
                        <option value="house">Casas</option>
                        <option value="office">Oficinas</option>
                        <option value="land">Terrenos</option>
                        <option value="commercial">Locales comerciales</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Dormitorios
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(parseInt(e.target.value))}
                      >
                        <option value="0">Cualquiera</option>
                        <option value="1">1+ dormitorios</option>
                        <option value="2">2+ dormitorios</option>
                        <option value="3">3+ dormitorios</option>
                        <option value="4">4+ dormitorios</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Baños
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(parseInt(e.target.value))}
                      >
                        <option value="0">Cualquiera</option>
                        <option value="1">1+ baños</option>
                        <option value="2">2+ baños</option>
                        <option value="3">3+ baños</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Rango de precio
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Mínimo"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        />
                        <span>-</span>
                        <input
                          type="number"
                          placeholder="Máximo"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000])}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        onClick={resetFilters}
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Estadísticas */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: "15,000+", label: "Propiedades" },
              { value: "500+", label: "Agentes" },
              { value: "120+", label: "Barrios" },
              { value: "98%", label: "Clientes satisfechos" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-3xl font-bold text-[#2E5DB0] mb-1">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Listado de propiedades */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            {activeTab === 'comprar' ? 'Propiedades en venta' : 'Propiedades en alquiler'}
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Explora nuestra selección de propiedades destacadas con toda la información que necesitas para tomar la mejor decisión.
          </p>
          
          {filteredProperties.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron propiedades</h3>
              <p className="text-gray-600 mb-4">
                No hay propiedades que coincidan con tus criterios de búsqueda. Intenta con otros filtros.
              </p>
              <button
                className="bg-[#2E5DB0] text-white px-4 py-2 rounded-lg hover:bg-[#1E4A96] transition-colors"
                onClick={resetFilters}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <motion.div 
                  key={property.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="relative h-56">
                    <img 
                      src={property.images[0]} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute top-3 right-3 z-10">
                      <button 
                        className={`p-2 rounded-full ${
                          savedProperties.includes(property.id) 
                            ? 'bg-[#FF6B6B] text-white' 
                            : 'bg-white/80 text-gray-600 hover:bg-white'
                        } transition-colors`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveProperty(property.id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={savedProperties.includes(property.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    {(property.isNew || property.isFeatured) && (
                      <div className="absolute top-3 left-3">
                        {property.isNew && (
                          <div className="bg-[#FF6B6B] text-white px-2 py-1 text-xs rounded font-medium">
                            NUEVO
                          </div>
                        )}
                        {property.isFeatured && (
                          <div className="bg-[#2E5DB0] text-white px-2 py-1 text-xs rounded font-medium mt-1">
                            DESTACADO
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-3 px-4">
                      <div className="text-white font-bold text-xl">${formatPrice(property.price)}</div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">{property.title}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{property.address}</p>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          {property.bedrooms} dorm.
                        </div>
                      )}
                      
                      {property.bathrooms > 0 && (
                        <div className="flex items-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                          {property.bathrooms} baños
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5.3v-4m0 0h-4m4 0l-5-5" />
                        </svg>
                        {property.area} m²
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img 
                          src={property.agent.photo} 
                          alt={property.agent.name} 
                          className="w-8 h-8 rounded-full mr-2 object-cover"
                        />
                        <span className="text-sm text-gray-700">{property.agent.name}</span>
                      </div>
                      
                      <button 
                        className="text-[#2E5DB0] hover:text-[#1E4A96] text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowContactForm(true);
                        }}
                      >
                        Contactar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {filteredProperties.length > 0 && (
            <div className="mt-10 text-center">
              <button className="px-6 py-3 border border-[#2E5DB0] text-[#2E5DB0] rounded-full font-medium hover:bg-[#2E5DB0] hover:text-white transition-colors">
                Cargar más propiedades
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Características */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ¿Por qué elegir INMOVISOR?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Somos el portal inmobiliario más completo, con herramientas innovadoras que facilitan tu búsqueda y aseguran la mejor experiencia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#2E5DB0]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2E5DB0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Busca por ubicación</h3>
              <p className="text-gray-600">
                Encuentra propiedades exactamente donde las necesitas con nuestro sistema de búsqueda geolocalizada y mapas interactivos.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#2E5DB0]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2E5DB0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tours virtuales 360°</h3>
              <p className="text-gray-600">
                Visita las propiedades sin salir de casa con nuestros tours virtuales 360° y recorridos interactivos detallados.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#2E5DB0]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2E5DB0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Asesores verificados</h3>
              <p className="text-gray-600">
                Trabaja solo con los mejores agentes inmobiliarios, verificados y evaluados por nuestro equipo para garantizar tu seguridad.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Llamado a la acción */}
      <section className="py-16 bg-[#2E5DB0] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">¿Quieres vender o alquilar tu propiedad?</h2>
            <p className="text-xl mb-8 text-white/90">
              Publica tu propiedad en nuestro portal y llega a miles de potenciales compradores o inquilinos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-[#2E5DB0] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Publicar propiedad
              </button>
              <button className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors">
                Contactar a un agente
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                <span className="text-[#2E5DB0]">INMO</span>
                <span className="text-[#FF6B6B]">VISOR</span>
              </h2>
              <p className="text-gray-400 mb-6">
                El portal inmobiliario más completo de Argentina, con miles de propiedades para comprar, alquilar o invertir.
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
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Explorar</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Comprar propiedades</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Alquilar propiedades</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Propiedades nuevas</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Propiedades destacadas</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Buscar por mapa</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Para propietarios</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Publicar propiedad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Portal para agentes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tasaciones online</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog inmobiliario</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto comercial</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">Av. Córdoba 1234, CABA, Argentina</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">+54 9 3571 416044</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">admin@tuweb-ai.com</span>
                </li>
              </ul>
              
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-4">Suscríbete</h3>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Tu email" 
                    className="bg-gray-800 text-white px-4 py-2 rounded-l-lg flex-grow focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                  />
                  <button className="bg-[#2E5DB0] text-white px-4 py-2 rounded-r-lg hover:bg-[#1E4A96] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} INMOVISOR. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Modal de detalle de propiedad */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md z-10"
              onClick={() => setSelectedProperty(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative h-72 bg-gray-300">
              <img 
                src={selectedProperty.images[0]} 
                alt={selectedProperty.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {selectedProperty.images.slice(0, 3).map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className={`w-14 h-10 border-2 ${index === 0 ? 'border-[#2E5DB0]' : 'border-white/70'} overflow-hidden rounded-md cursor-pointer`}
                  >
                    <img src={image} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {selectedProperty.images.length > 3 && (
                  <div className="w-14 h-10 bg-black/60 flex items-center justify-center text-white rounded-md cursor-pointer">
                    +{selectedProperty.images.length - 3}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProperty.title}</h2>
                <div className="text-2xl font-bold text-[#2E5DB0]">${formatPrice(selectedProperty.price)}</div>
              </div>
              
              <p className="text-gray-600 mb-4">{selectedProperty.address}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {selectedProperty.bedrooms > 0 && (
                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                    <div className="text-gray-700 font-bold text-lg">{selectedProperty.bedrooms}</div>
                    <div className="text-gray-600 text-sm">Dormitorios</div>
                  </div>
                )}
                
                {selectedProperty.bathrooms > 0 && (
                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                    <div className="text-gray-700 font-bold text-lg">{selectedProperty.bathrooms}</div>
                    <div className="text-gray-600 text-sm">Baños</div>
                  </div>
                )}
                
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <div className="text-gray-700 font-bold text-lg">{selectedProperty.area}</div>
                  <div className="text-gray-600 text-sm">m² totales</div>
                </div>
                
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <div className="text-gray-700 font-bold text-lg uppercase">{selectedProperty.type}</div>
                  <div className="text-gray-600 text-sm">Tipo</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Descripción</h3>
                <p className="text-gray-700">{selectedProperty.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Características</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedProperty.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2E5DB0] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={selectedProperty.agent.photo} 
                      alt={selectedProperty.agent.name} 
                      className="w-12 h-12 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">{selectedProperty.agent.name}</h4>
                      <p className="text-gray-600 text-sm">Agente inmobiliario</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <a 
                      href={`tel:${selectedProperty.agent.phone}`}
                      className="bg-[#2E5DB0] text-white px-4 py-2 rounded-lg hover:bg-[#1E4A96] transition-colors"
                    >
                      Llamar
                    </a>
                    <button 
                      className="border border-[#2E5DB0] text-[#2E5DB0] px-4 py-2 rounded-lg hover:bg-[#2E5DB0] hover:text-white transition-colors"
                      onClick={() => setShowContactForm(true)}
                    >
                      Contactar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de contacto */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-lg max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Contactar agente</h2>
                  <p className="text-gray-600">Complete el formulario y nos pondremos en contacto</p>
                </div>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleContactSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                      Nombre completo
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email-portal-inmobiliario" className="block text-gray-700 font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email-portal-inmobiliario"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                      placeholder="admin@tuweb-ai.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                      Teléfono
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
                      Mensaje
                    </label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5DB0]"
                      defaultValue={selectedProperty ? `Estoy interesado en la propiedad "${selectedProperty.title}" y me gustaría recibir más información.` : ""}
                      required
                    ></textarea>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-[#2E5DB0] text-white px-6 py-3 rounded-lg hover:bg-[#1E4A96] transition-colors"
                >
                  Enviar consulta
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}