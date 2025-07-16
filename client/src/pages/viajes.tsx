import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type DestinationCategory = 'todos' | 'europa' | 'asia' | 'america' | 'africa' | 'oceania';

interface Destination {
  id: number;
  name: string;
  location: string;
  category: DestinationCategory;
  description: string;
  price: number;
  duration: string;
  image: string;
  gallery: string[];
  highlights: string[];
  featured?: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  image: string;
  rating: number;
}

interface Itinerary {
  id: number;
  destinationId: number;
  days: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    accommodation: string;
    meals: string[];
  }[];
}

export default function Viajes() {
  // Estados
  const [activeCategory, setActiveCategory] = useState<DestinationCategory>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteDestinations, setFavoriteDestinations] = useState<number[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: 2,
    date: '',
    message: ''
  });
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  
  // Referencias
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Efecto para scroll al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-rotación de testimonios
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Función para mostrar notificaciones
  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  // Función para añadir/quitar destinos favoritos
  const toggleFavorite = (destinationId: number) => {
    if (favoriteDestinations.includes(destinationId)) {
      setFavoriteDestinations(favoriteDestinations.filter(id => id !== destinationId));
      showNotificationMessage('Destino eliminado de favoritos');
    } else {
      setFavoriteDestinations([...favoriteDestinations, destinationId]);
      showNotificationMessage('Destino añadido a favoritos');
    }
  };
  
  // Función para manejar el envío del formulario de reserva
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotificationMessage('¡Solicitud de reserva enviada con éxito!');
    setShowBookingModal(false);
    setBookingForm({
      name: '',
      email: '',
      phone: '',
      travelers: 2,
      date: '',
      message: ''
    });
  };
  
  // Función para actualizar el formulario de reserva
  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Función para navegar por la galería
  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryRef.current && selectedDestination) {
      const scrollAmount = 300; // Ancho aproximado de una imagen + margen
      const currentScroll = galleryRef.current.scrollLeft;
      
      galleryRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Obtener itinerario por ID de destino
  const getItinerary = (destinationId: number) => {
    return itineraries.find(itinerary => itinerary.destinationId === destinationId);
  };
  
  // Destinos
  const destinations: Destination[] = [
    {
      id: 1,
      name: "Esencia de Japón",
      location: "Tokio, Kioto, Osaka",
      category: "asia",
      description: "Un viaje por las ciudades más emblemáticas de Japón, descubriendo la perfecta fusión entre tradición milenaria y ultramodernidad. Visitarás templos antiguos, jardines zen, y experimentarás la vibrante vida urbana japonesa.",
      price: 3200,
      duration: "12 días",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Visita al majestuoso Monte Fuji",
        "Recorrido por templos y santuarios históricos de Kioto",
        "Experiencia de alojamiento en ryokan tradicional",
        "Degustación de gastronomía japonesa auténtica"
      ],
      featured: true
    },
    {
      id: 2,
      name: "Toscana Secreta",
      location: "Florencia, Siena, San Gimignano",
      category: "europa",
      description: "Un recorrido íntimo por los paisajes y pueblos medievales de la Toscana italiana. Descubrirás pequeñas aldeas alejadas del turismo masivo, degustarás vinos en bodegas familiares y te sumergirás en la auténtica vida rural italiana.",
      price: 2800,
      duration: "10 días",
      image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515859005217-8a1f08870f59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Visita a viñedos familiares con cata de vinos exclusiva",
        "Clase de cocina toscana tradicional",
        "Alojamiento en villa rural restaurada",
        "Recorrido por pueblos medievales poco conocidos"
      ],
      featured: true
    },
    {
      id: 3,
      name: "Perú Ancestral",
      location: "Lima, Cusco, Machu Picchu",
      category: "america",
      description: "Una inmersión profunda en la cultura y la espiritualidad de los antiguos incas. Más allá de las visitas habituales, este viaje te conecta con comunidades locales y te permite experimentar rituales y tradiciones ancestrales.",
      price: 2500,
      duration: "14 días",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1531315590614-40f69aafd1b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1460500063983-994d4c27756c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544989164-21a66691e28a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1533050487297-09b450131914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Visita a Machu Picchu al amanecer",
        "Participación en ceremonia tradicional andina",
        "Convivencia con comunidades quechuas",
        "Gastronomía peruana de la mano de chefs locales"
      ],
      featured: false
    },
    {
      id: 4,
      name: "Paisajes de Islandia",
      location: "Reykjavik, Círculo Dorado, Vík",
      category: "europa",
      description: "Un viaje a través de algunos de los paisajes más impresionantes del planeta: cascadas, géiseres, glaciares y aguas termales. Una experiencia para conectar con la naturaleza en su estado más puro y salvaje.",
      price: 3500,
      duration: "9 días",
      image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1516496636080-14fb876e029d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501879779179-4576bae71d8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1476610182048-b716b8518aae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Aurora boreal (en temporada)",
        "Baño en la laguna azul y otras aguas termales",
        "Excursión a glaciares y cuevas de hielo",
        "Avistamiento de ballenas y fauna local"
      ],
      featured: true
    },
    {
      id: 5,
      name: "Marruecos Profundo",
      location: "Marrakech, Fez, Desierto del Sahara",
      category: "africa",
      description: "Un recorrido que va más allá de las rutas turísticas habituales para descubrir el verdadero Marruecos. Desde las bulliciosas medinas hasta el silencio del desierto, este viaje es una explosión de colores, aromas y sensaciones.",
      price: 1900,
      duration: "11 días",
      image: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1519020377022-d5166f672df5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508793156481-76b9b48d88eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1531261664997-45dc0614e818?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1532540859745-7b3954003ae8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Noche en jaima tradicional bajo las estrellas del Sahara",
        "Recorrido por talleres artesanales milenarios",
        "Gastronomía marroquí auténtica",
        "Experiencia de hammam tradicional"
      ],
      featured: false
    },
    {
      id: 6,
      name: "Vietnam Auténtico",
      location: "Hanoi, Bahía de Halong, Hoi An",
      category: "asia",
      description: "Un viaje para descubrir la verdadera esencia de Vietnam, más allá de los circuitos habituales. Explorarás la rica cultura e historia del país, disfrutarás de su exquisita gastronomía y te sumergirás en paisajes de ensueño.",
      price: 2200,
      duration: "15 días",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1557750255-c76072a7fcd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520372561567-9196ea59f46f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Crucero por la Bahía de Halong en junco tradicional",
        "Clase de cocina vietnamita en Hoi An",
        "Exploración de pueblos étnicos en Sapa",
        "Navegación por el Delta del Mekong"
      ],
      featured: false
    },
    {
      id: 7,
      name: "Costa Rica Natural",
      location: "San José, Arenal, Manuel Antonio",
      category: "america",
      description: "Una experiencia inmersiva en uno de los países con mayor biodiversidad del mundo. Explorarás parques nacionales, volcanes activos, playas paradisíacas y te conectarás con la filosofía 'pura vida' de los costarricenses.",
      price: 2300,
      duration: "10 días",
      image: "https://images.unsplash.com/photo-1518719023249-c0b9830fc8bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541355342824-8908e50ac589?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518182170546-07661fd94144?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550951302-aae1155207fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Avistamiento de fauna exótica en parques nacionales",
        "Baño en aguas termales naturales junto al volcán Arenal",
        "Canopy y puentes colgantes en el bosque nuboso",
        "Relajación en playas de ensueño"
      ],
      featured: false
    },
    {
      id: 8,
      name: "Gemas de Australia",
      location: "Sydney, Gran Barrera de Coral, Uluru",
      category: "oceania",
      description: "Un recorrido por los contrastes espectaculares de Australia: desde sus vibrantes ciudades costeras hasta el místico interior del Outback. Una aventura que combina naturaleza, cultura aborigen y estilo de vida urbano.",
      price: 4500,
      duration: "16 días",
      image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1552642986-ccb41e7059e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516832378525-cad698300b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518301725395-d82e90882908?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Snorkel o buceo en la Gran Barrera de Coral",
        "Atardecer en Uluru (Ayers Rock)",
        "Experiencia cultural con indígenas australianos",
        "Tour arquitectónico en Sydney"
      ],
      featured: false
    },
    {
      id: 9,
      name: "Sudáfrica Salvaje",
      location: "Ciudad del Cabo, Parque Kruger, Ruta Jardín",
      category: "africa",
      description: "Una experiencia que combina la emoción de los safaris con la belleza de los paisajes sudafricanos. Avistarás los 'Big Five' en su hábitat natural, visitarás viñedos de renombre mundial y descubrirás la fascinante historia del país.",
      price: 3100,
      duration: "13 días",
      image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501697417966-31fc448b58a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Safari fotográfico en el Parque Nacional Kruger",
        "Visita al Cabo de Buena Esperanza",
        "Recorrido por viñedos y bodegas",
        "Inmersión cultural en townships"
      ],
      featured: true
    },
    {
      id: 10,
      name: "Nueva Zelanda: Isla Norte",
      location: "Auckland, Rotorua, Wellington",
      category: "oceania",
      description: "Un viaje por la diversidad geológica y cultural de la Isla Norte de Nueva Zelanda. Descubrirás paisajes volcánicos, aguas termales, cultura maorí y modernos centros urbanos en un entorno natural privilegiado.",
      price: 3700,
      duration: "12 días",
      image: "https://images.unsplash.com/photo-1565349519629-69509d4c250b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1505825352921-5b91ba674c26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1532274909824-701379de7a08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1570538588374-23fb9e39195b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Visita a pueblos geotérmicos en Rotorua",
        "Experiencia cultural maorí con hangi tradicional",
        "Caminata por parques nacionales",
        "Tour cinematográfico por locaciones de El Señor de los Anillos"
      ],
      featured: false
    },
    {
      id: 11,
      name: "Antigua Grecia",
      location: "Atenas, Santorini, Creta",
      category: "europa",
      description: "Un viaje que combina la majestuosidad de la antigua civilización griega con la belleza de sus islas. Explorarás ruinas milenarias, caminarás por calles empedradas de pueblos blancos y disfrutarás de la exquisita gastronomía mediterránea.",
      price: 2600,
      duration: "11 días",
      image: "https://images.unsplash.com/photo-1534445967758-1a76bc1ab4e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1538681112038-e14d17fdf9ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524746927250-ded2bd62fbcc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Visita guiada a la Acrópolis",
        "Atardecer en Oia, Santorini",
        "Exploración del Palacio de Knossos en Creta",
        "Clase de cocina griega tradicional"
      ],
      featured: false
    },
    {
      id: 12,
      name: "India Milenaria",
      location: "Delhi, Agra, Jaipur",
      category: "asia",
      description: "Un viaje por el Triángulo Dorado de la India que te sumergirá en una cultura milenaria llena de contrastes. Visitarás monumentos icónicos, experimentarás la espiritualidad hindú y te deleitarás con la explosión de colores y sabores del subcontinente.",
      price: 2100,
      duration: "10 días",
      image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1598313183973-4effcded8d5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1543862475-eb136770ae9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Amanecer en el Taj Mahal",
        "Recorrido en rickshaw por Old Delhi",
        "Visita al Fuerte Amber con ascenso en elefante",
        "Ceremonia Aarti a orillas del río Ganges"
      ],
      featured: false
    }
  ];
  
  // Testimonios
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Laura y Carlos",
      location: "Madrid, España",
      text: "Nuestro viaje a Japón fue simplemente mágico. El equilibrio entre lugares emblemáticos y rincones ocultos fue perfecto. Nos encantó la experiencia del ryokan y las explicaciones culturales del guía fueron fascinantes. Ya estamos planeando nuestro próximo viaje con Viajes de Autor.",
      image: "https://images.unsplash.com/photo-1469571486292-b5bbd2da0b9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 5
    },
    {
      id: 2,
      name: "Miguel Fernández",
      location: "Buenos Aires, Argentina",
      text: "La ruta por la Toscana superó todas mis expectativas. Los alojamientos boutique seleccionados, las visitas a productores locales y las degustaciones privadas hicieron que me sintiera un viajero privilegiado, no un turista. Una experiencia auténtica y llena de momentos inolvidables.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 5
    },
    {
      id: 3,
      name: "Ana y Roberto",
      location: "México DF, México",
      text: "El viaje a Marruecos fue una explosión de sensaciones. Desde el bullicio de las medinas hasta la tranquilidad del desierto, cada día fue una aventura. Dormir bajo las estrellas en el Sahara fue una experiencia que nunca olvidaremos. El guía local hizo que nos sintiéramos seguros en todo momento.",
      image: "https://images.unsplash.com/photo-1522869635100-187f6605241d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4
    }
  ];
  
  // Itinerarios
  const itineraries: Itinerary[] = [
    {
      id: 1,
      destinationId: 1, // Japón
      days: [
        {
          day: 1,
          title: "Llegada a Tokio",
          description: "Llegada al aeropuerto internacional de Narita. Traslado al hotel y tiempo libre para aclimatarse al cambio horario.",
          activities: ["Recepción en el aeropuerto", "Traslado al hotel en Tokio", "Cena de bienvenida"],
          accommodation: "Hotel Century Southern Tower",
          meals: ["Cena"]
        },
        {
          day: 2,
          title: "Tokio Tradicional y Moderno",
          description: "Día completo explorando los contrastes de Tokio, desde antiguos templos hasta rascacielos ultramodernos.",
          activities: ["Visita al Templo Senso-ji en Asakusa", "Crucero por el río Sumida", "Barrio de Shibuya y cruce famoso", "Torre Skytree (mirador)"],
          accommodation: "Hotel Century Southern Tower",
          meals: ["Desayuno", "Almuerzo"]
        },
        {
          day: 3,
          title: "Excursión al Monte Fuji",
          description: "Viaje de día completo al majestuoso Monte Fuji y sus alrededores.",
          activities: ["Visita a la 5ª estación del Monte Fuji", "Paseo en barco por el lago Ashi", "Teleférico del Monte Komagatake", "Pueblo tradicional de Oshino Hakkai"],
          accommodation: "Hotel Century Southern Tower",
          meals: ["Desayuno", "Almuerzo"]
        },
        {
          day: 4,
          title: "Tokio - Nikko - Tokio",
          description: "Excursión a Nikko, patrimonio de la UNESCO, para conocer sus santuarios y entorno natural.",
          activities: ["Santuario Toshogu", "Cascada de Kegon", "Lago Chuzenji", "Paseo por el puente Shinkyo"],
          accommodation: "Hotel Century Southern Tower",
          meals: ["Desayuno", "Almuerzo"]
        },
        {
          day: 5,
          title: "Tokio - Kioto",
          description: "Viaje en tren bala a Kioto, la antigua capital imperial de Japón.",
          activities: ["Traslado a la estación de Tokio", "Viaje en Shinkansen", "Llegada a Kioto y tiempo libre", "Paseo nocturno por Gion (barrio de geishas)"],
          accommodation: "Hotel Granvia Kyoto",
          meals: ["Desayuno", "Cena"]
        }
      ]
    },
    {
      id: 2,
      destinationId: 2, // Toscana
      days: [
        {
          day: 1,
          title: "Llegada a Florencia",
          description: "Bienvenida en el aeropuerto de Florencia y traslado a hotel boutique en el centro histórico.",
          activities: ["Recepción en el aeropuerto", "Traslado al hotel en Florencia", "Paseo orientativo por el centro", "Cena de bienvenida en trattoria local"],
          accommodation: "Hotel Brunelleschi",
          meals: ["Cena"]
        },
        {
          day: 2,
          title: "Florencia Esencial",
          description: "Jornada dedicada a descubrir las joyas artísticas de la cuna del Renacimiento.",
          activities: ["Visita a la Galería de los Uffizi", "Catedral de Santa Maria del Fiore", "Ponte Vecchio", "Degustación de vinos toscanos al atardecer"],
          accommodation: "Hotel Brunelleschi",
          meals: ["Desayuno", "Merienda-cena"]
        },
        {
          day: 3,
          title: "De Florencia a Chianti",
          description: "Salida hacia la región vinícola de Chianti para disfrutar del paisaje rural toscano.",
          activities: ["Visita a bodega familiar con viñedos", "Clase de cocina toscana tradicional", "Almuerzo con productos elaborados", "Alojamiento en villa rodeada de viñedos"],
          accommodation: "Villa Il Poggiale",
          meals: ["Desayuno", "Almuerzo", "Cena"]
        },
        {
          day: 4,
          title: "Pueblos medievales de Chianti",
          description: "Recorrido por pequeñas aldeas medievales fuera de las rutas turísticas.",
          activities: ["Visita a Castellina in Chianti", "Aldea amurallada de Monteriggioni", "Tiempo libre en Radda in Chianti", "Cata de aceites de oliva artesanales"],
          accommodation: "Villa Il Poggiale",
          meals: ["Desayuno", "Almuerzo ligero"]
        },
        {
          day: 5,
          title: "Siena y San Gimignano",
          description: "Día dedicado a dos de las ciudades medievales más emblemáticas de la Toscana.",
          activities: ["Visita de Siena con su Piazza del Campo", "Tiempo libre para almorzar en trattorias locales", "Tarde en San Gimignano, 'la ciudad de las torres'", "Degustación del mejor gelato del mundo"],
          accommodation: "Hotel Leon Bianco (San Gimignano)",
          meals: ["Desayuno", "Cena"]
        }
      ]
    }
  ];
  
  // Filtrar destinos según categoría
  const filteredDestinations = destinations.filter(destination => {
    const matchesCategory = activeCategory === 'todos' || destination.category === activeCategory;
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          destination.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          destination.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Destinos destacados
  const featuredDestinations = destinations.filter(destination => destination.featured);
  
  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Botón Volver a Proyectos */}
      <div className="fixed left-5 z-50" style={{ top: '80px' }}>
        <Link 
          to="/#showroom" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Volver a Proyectos</span>
        </Link>
      </div>
      
      {/* Notificación */}
      {showNotification && (
        <motion.div 
          className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          {notificationMessage}
        </motion.div>
      )}
      
      {/* Header */}
      <header className="sticky top-0 bg-white z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-blue-600">Viajes</span>
              <span className="text-gray-800">de Autor</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar destinos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#destinos" className="text-gray-600 hover:text-blue-600 transition-colors">Destinos</a>
            <a href="#sobre-nosotros" className="text-gray-600 hover:text-blue-600 transition-colors">Sobre Nosotros</a>
            <a href="#experiencias" className="text-gray-600 hover:text-blue-600 transition-colors">Experiencias</a>
            <div className="relative">
              <button className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favoriteDestinations.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {favoriteDestinations.length}
                  </span>
                )}
              </button>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors">
              Iniciar Sesión
            </button>
          </nav>
          
          <div className="md:hidden flex items-center">
            <button className="mr-4 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Viajes de Autor" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <motion.div 
            className="text-white max-w-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Viajes que cuentan historias</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Experiencias diseñadas por expertos locales para viajeros que buscan descubrir la esencia auténtica de cada destino.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#destinos" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg"
              >
                Descubrir Destinos
              </a>
              <button 
                onClick={() => setShowBookingModal(true)}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-full font-medium transition-colors"
              >
                Planificar Mi Viaje
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Categorías de destinos */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Explora por Continente</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selecciona un continente para descubrir nuestras experiencias seleccionadas
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { category: "europa", name: "Europa", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
              { category: "asia", name: "Asia", image: "https://images.unsplash.com/photo-1535139262971-c51845709a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
              { category: "america", name: "América", image: "https://images.unsplash.com/photo-1558642581-233100e7fb48?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
              { category: "africa", name: "África", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
              { category: "oceania", name: "Oceanía", image: "https://images.unsplash.com/photo-1570092635622-6c1e955c634d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
              { category: "todos", name: "Todos", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" }
            ].map((continent) => (
              <motion.div 
                key={continent.category}
                className={`${activeCategory === continent.category ? 'ring-2 ring-blue-500' : ''} cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow`}
                onClick={() => setActiveCategory(continent.category as DestinationCategory)}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-40">
                  <img src={continent.image} alt={continent.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <h3 className="text-white font-medium">{continent.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Destinos Destacados */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Viajes Destacados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestras experiencias más extraordinarias, diseñadas para viajeros curiosos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <motion.div 
                key={destination.id}
                className="bg-white rounded-xl shadow-md overflow-hidden h-full"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(destination.id);
                    }}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill={favoriteDestinations.includes(destination.id) ? "currentColor" : "none"} 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      strokeWidth={favoriteDestinations.includes(destination.id) ? "0" : "2"}
                      color={favoriteDestinations.includes(destination.id) ? "#ef4444" : ""}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                      {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{destination.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{destination.location}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-800 text-lg">{formatPrice(destination.price)}</span>
                      <span className="text-gray-500 text-sm ml-1">/{destination.duration}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedDestination(destination)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors text-sm"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="#destinos"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Ver todos los destinos
            </a>
          </div>
        </div>
      </section>
      
      {/* Por qué elegirnos */}
      <section id="sobre-nosotros" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Experiencia de viaje" 
                  className="rounded-lg shadow-md w-full object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg max-w-xs hidden md:block">
                  <p className="font-medium">Más de 15 años creando experiencias únicas para viajeros exigentes</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Por qué elegirnos</h2>
              <p className="text-gray-600 mb-8">
                En Viajes de Autor no organizamos simples viajes, creamos experiencias transformadoras que conectan a los viajeros con la esencia auténtica de cada destino. Nos diferenciamos por:
              </p>
              <div className="space-y-6">
                {[
                  {
                    title: "Experiencias auténticas",
                    description: "Diseñamos cada viaje para alejarte de las rutas turísticas masificadas y acercarte a la verdadera cultura local.",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    )
                  },
                  {
                    title: "Expertos locales",
                    description: "Trabajamos con guías nativos que conocen cada rincón y tradición de sus países, proporcionando una perspectiva única.",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )
                  },
                  {
                    title: "Grupos reducidos",
                    description: "Viajamos en grupos pequeños para garantizar una atención personalizada y una experiencia íntima con el destino.",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )
                  },
                  {
                    title: "Viajes responsables",
                    description: "Promovemos un turismo sostenible que respeta el medio ambiente y beneficia a las comunidades locales.",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-blue-600">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lo que dicen nuestros viajeros</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-xl shadow-lg p-8">
              <div className="absolute top-8 left-8 text-blue-200 opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.945-.33.358-.656.734-.909 1.162C3.249 8.318 3.049 8.754 2.893 9.189 2.747 9.64 2.611 10.093 2.5 10.5c-.195.732-.203 1.437-.03 2.03.114.389.251.705.451.956.239.305.43.521.764.716.159.092.354.182.601.245L6.5 10.125v-.125z"/>
                  <path d="M17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.945-.33.358-.656.734-.909 1.162-.293.408-.493.844-.65 1.278-.226.701-.354 1.393-.354 2.001 0 .732.131 1.394.354 2.001.059.161.128.311.206.458.07.13.148.252.238.367.16.207.34.378.55.536.21.158.43.294.67.401.149.067.302.118.462.156.389.099.856.099 1.245 0 .161-.038.314-.089.462-.156.24-.107.46-.243.67-.401.209-.158.39-.33.551-.536.09-.114.168-.236.237-.366.079-.148.147-.298.207-.459.222-.608.354-1.27.354-2.002C21.5 11.875 19.5 10 17.5 10z"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
                    <img 
                      src={testimonials[currentTestimonialIndex].image} 
                      alt={testimonials[currentTestimonialIndex].name} 
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-800">{testimonials[currentTestimonialIndex].name}</h3>
                    <p className="text-blue-600">{testimonials[currentTestimonialIndex].location}</p>
                    <div className="flex mt-2">
                      {Array(5).fill(0).map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 ${i < testimonials[currentTestimonialIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 md:pl-8 md:border-l border-gray-200">
                    <blockquote className="text-xl text-gray-700 italic">
                      "{testimonials[currentTestimonialIndex].text}"
                    </blockquote>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button 
                        key={index}
                        onClick={() => setCurrentTestimonialIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          currentTestimonialIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Experiencias Destacadas */}
      <section id="experiencias" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Experiencias Memorables</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Momentos únicos que definirán tu viaje y quedarán grabados en tu memoria
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Gastronomía Local",
                description: "Degusta platos tradicionales, visita mercados locales y aprende a cocinar recetas ancestrales de la mano de chefs locales.",
                image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Encuentros Culturales",
                description: "Convive con comunidades locales, participa en sus tradiciones y conoce de primera mano su forma de vida y su visión del mundo.",
                image: "https://images.unsplash.com/photo-1565799616263-8b0a10be221a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Naturaleza y Aventura",
                description: "Explora parajes naturales increíbles con actividades adaptadas a diferentes niveles, siempre respetando el entorno.",
                image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }
            ].map((experience, index) => (
              <motion.div 
                key={index}
                className="relative h-96 rounded-xl overflow-hidden group"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={experience.image} 
                  alt={experience.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{experience.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{experience.description}</p>
                  <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    Descubrir más
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Todos los Destinos */}
      <section id="destinos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestros Destinos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora nuestra selección completa de viajes diseñados para conectarte con la esencia de cada destino
            </p>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveCategory('todos')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'todos' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                Todos
              </button>
              <button 
                onClick={() => setActiveCategory('europa')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'europa' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                Europa
              </button>
              <button 
                onClick={() => setActiveCategory('asia')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'asia' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                Asia
              </button>
              <button 
                onClick={() => setActiveCategory('america')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'america' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                América
              </button>
              <button 
                onClick={() => setActiveCategory('africa')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'africa' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                África
              </button>
              <button 
                onClick={() => setActiveCategory('oceania')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'oceania' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                Oceanía
              </button>
            </div>
            
            <div className="hidden md:block relative w-64">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar destinos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <motion.div 
                key={destination.id}
                className="bg-white rounded-xl shadow-md overflow-hidden h-full"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(destination.id);
                    }}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill={favoriteDestinations.includes(destination.id) ? "currentColor" : "none"} 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      strokeWidth={favoriteDestinations.includes(destination.id) ? "0" : "2"}
                      color={favoriteDestinations.includes(destination.id) ? "#ef4444" : ""}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  {destination.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-md">
                      DESTACADO
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                      {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {destination.duration}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{destination.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{destination.location}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-800 text-lg">{formatPrice(destination.price)}</span>
                      <span className="text-gray-500 text-sm">/{destination.duration}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedDestination(destination)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors text-sm"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredDestinations.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron destinos</h3>
              <p className="text-gray-500">Prueba con otros filtros o términos de búsqueda</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Mantente Inspirado</h2>
            <p className="text-lg opacity-90 mb-8">
              Suscríbete a nuestra newsletter para recibir inspiración de viajes, ofertas exclusivas y consejos de nuestros expertos
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none text-gray-700"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-3 rounded-lg transition-colors font-medium">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-blue-400">Viajes</span>
                <span className="text-white">de Autor</span>
              </h3>
              <p className="text-gray-400 mb-6">
                Experiencias de viaje diseñadas para conectarte con la esencia auténtica de cada destino, lejos de las rutas turísticas convencionales.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Destinos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Europa</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Asia</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">América</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">África</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Oceanía</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Información</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Experiencias</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog de viajes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Preguntas frecuentes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">Calle Gran Vía 28, Madrid, España</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">+54 9 3571 416044</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">info@viajesdeautor.com</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-400">Lun-Vie: 9:00 - 20:00<br />Sáb: 10:00 - 14:00</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Viajes de Autor. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      
      {/* Modal detalle de destino */}
      {selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            className="bg-white rounded-xl max-w-4xl w-full my-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-0">
              <div className="relative h-80">
                <img 
                  src={selectedDestination.image} 
                  alt={selectedDestination.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <button 
                  onClick={() => setSelectedDestination(null)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded-full mb-2 inline-block">
                        {selectedDestination.category.charAt(0).toUpperCase() + selectedDestination.category.slice(1)}
                      </span>
                      <h2 className="text-3xl font-bold text-white">{selectedDestination.name}</h2>
                      <p className="text-gray-300">{selectedDestination.location}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center">
                      <div className="text-sm text-gray-500">Desde</div>
                      <div className="text-xl font-bold text-gray-800">{formatPrice(selectedDestination.price)}</div>
                      <div className="text-xs text-gray-500">{selectedDestination.duration}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Sobre este viaje</h3>
                  <p className="text-gray-600">
                    {selectedDestination.description}
                  </p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Experiencias destacadas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDestination.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Galería</h3>
                  <div className="relative">
                    <div 
                      ref={galleryRef}
                      className="flex overflow-x-auto space-x-4 py-2 scrollbar-hide"
                    >
                      {selectedDestination.gallery.map((image, index) => (
                        <img 
                          key={index}
                          src={image} 
                          alt={`${selectedDestination.name} - Imagen ${index + 1}`} 
                          className="h-40 w-60 object-cover rounded-lg shadow-md flex-shrink-0"
                        />
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => scrollGallery('left')}
                      className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => scrollGallery('right')}
                      className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {getItinerary(selectedDestination.id) && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Itinerario</h3>
                    <div className="space-y-4">
                      {getItinerary(selectedDestination.id)?.days.slice(0, 3).map((day, index) => (
                        <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
                          <div className="flex items-center mb-2">
                            <div className="bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center mr-2">
                              {day.day}
                            </div>
                            <h4 className="font-semibold text-gray-800">{day.title}</h4>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{day.description}</p>
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Alojamiento:</span> {day.accommodation} | 
                            <span className="font-medium"> Comidas:</span> {day.meals.join(', ')}
                          </div>
                        </div>
                      ))}
                      {getItinerary(selectedDestination.id)?.days && getItinerary(selectedDestination.id)!.days.length > 3 && (
                        <div className="text-center">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Ver itinerario completo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setShowBookingModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Solicitar reserva
                  </button>
                  <button 
                    onClick={() => {
                      toggleFavorite(selectedDestination.id);
                      setSelectedDestination(null);
                    }}
                    className="flex items-center justify-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-2" 
                      fill={favoriteDestinations.includes(selectedDestination.id) ? "currentColor" : "none"} 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      strokeWidth={favoriteDestinations.includes(selectedDestination.id) ? "0" : "2"}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {favoriteDestinations.includes(selectedDestination.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de reserva */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            className="bg-white rounded-xl max-w-2xl w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Solicitud de reserva
                </h2>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedDestination && (
                <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={selectedDestination.image} 
                    alt={selectedDestination.name} 
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedDestination.name}</h3>
                    <p className="text-sm text-gray-600">{selectedDestination.location} • {selectedDestination.duration}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-sm text-gray-500">Desde</div>
                    <div className="font-bold text-gray-800">{formatPrice(selectedDestination.price)}</div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Nombre completo *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={bookingForm.name}
                      onChange={handleBookingInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={bookingForm.email}
                      onChange={handleBookingInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleBookingInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+34 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Número de viajeros *</label>
                    <select 
                      name="travelers"
                      value={bookingForm.travelers}
                      onChange={handleBookingInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'viajero' : 'viajeros'}</option>
                      ))}
                      <option value="11+">Más de 10 viajeros</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Fecha aproximada de viaje</label>
                  <input 
                    type="date" 
                    name="date"
                    value={bookingForm.date}
                    onChange={handleBookingInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Mensaje o información adicional</label>
                  <textarea 
                    name="message"
                    value={bookingForm.message}
                    onChange={handleBookingInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Cuéntanos más sobre tus preferencias, dudas o requerimientos especiales..."
                  />
                </div>
                
                <div className="text-sm text-gray-500 italic">
                  * Campos obligatorios
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Solicitar información sin compromiso
                </button>
                
                <p className="text-center text-xs text-gray-500">
                  Al enviar este formulario, aceptas nuestra política de privacidad y el tratamiento de tus datos para gestionar tu solicitud.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}