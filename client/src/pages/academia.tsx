import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MetaTags from '@/components/seo/meta-tags';

type CourseCategory = 'todos' | 'desarrollo' | 'negocios' | 'marketing' | 'diseno';
type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado';
type CourseDuration = 'corto' | 'medio' | 'largo';
type PriceRange = 'todos' | 'bajo' | 'medio' | 'alto';

interface Instructor {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  rating: number;
  courses: number;
  students: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  image: string;
  duration: string;
  durationCategory: CourseDuration;
  lectures: number;
  price: number;
  discountPrice?: number;
  instructorId: number;
  rating: number;
  students: number;
  featured?: boolean;
  bestSeller?: boolean;
  new?: boolean;
  previewVideo?: string;
  userRating?: number;
  previewLessons?: {
    title: string;
    duration: string;
    videoUrl: string;
    free: boolean;
  }[];
}

interface LiveClass {
  id: number;
  title: string;
  instructorId: number;
  date: string;
  time: string;
  duration: string;
  attendees: number;
  category: CourseCategory;
  image: string;
  available: boolean;
  enrollmentLimit: number;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  message: string;
  image: string;
  rating: number;
  course: string;
}

interface ForumPost {
  id: number;
  userId: number;
  userName: string;
  userImage: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  replies: number;
  tags: string[];
}

// Datos del foro
const forumPosts: ForumPost[] = [
  {
    id: 1,
    userId: 1,
    userName: "Carlos Martínez",
    userImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    title: "¿Cómo optimizar el rendimiento de una aplicación React?",
    content: "Estoy construyendo una aplicación con React y estoy notando algunos problemas de rendimiento. He intentado utilizar React.memo y useCallback, pero aún así tengo problemas con listas largas. ¿Alguien tiene experiencia con react-window o alguna otra biblioteca para virtualización?",
    date: "12 Abril, 2025",
    likes: 24,
    replies: 18,
    tags: ["react", "javascript", "performance"]
  },
  {
    id: 2,
    userId: 2,
    userName: "María Rodríguez",
    userImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    title: "Consejos para mejorar mi portfolio de UX/UI",
    content: "Acabo de terminar el curso de Diseño UX/UI y estoy trabajando en mi portfolio. ¿Qué tipo de proyectos recomendarían incluir para destacar en el mercado laboral actual? ¿Prefieren ver muchos proyectos pequeños o pocos pero muy detallados?",
    date: "10 Abril, 2025",
    likes: 31,
    replies: 22,
    tags: ["UX/UI", "portfolio", "diseño"]
  },
  {
    id: 3,
    userId: 3,
    userName: "Pablo Sánchez",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    title: "Recursos para aprender inteligencia artificial",
    content: "Estoy interesado en aprender sobre inteligencia artificial y machine learning. ¿Alguien podría recomendar recursos adicionales al curso? Busco algo práctico y enfocado a desarrolladores con conocimientos intermedios de Python.",
    date: "8 Abril, 2025",
    likes: 18,
    replies: 15,
    tags: ["IA", "machine learning", "python"]
  },
  {
    id: 4,
    userId: 4,
    userName: "Laura Gómez",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    title: "Experiencias con metodologías ágiles en equipos remotos",
    content: "Quería compartir mi experiencia implementando Scrum en un equipo completamente remoto y ver si alguien tiene consejos adicionales. Hemos tenido dificultades principalmente con la comunicación asincrónica y la estimación de tareas.",
    date: "5 Abril, 2025",
    likes: 42,
    replies: 28,
    tags: ["agile", "scrum", "trabajo remoto"]
  }
];

const planes = [
  { nombre: 'Plan Básico', precio: 10000 },
  { nombre: 'Plan Pro', precio: 20000 },
  { nombre: 'Plan Premium', precio: 30000 },
];

const handleCheckout = async (plan: string) => {
  const res = await fetch('http://localhost:3000/crear-preferencia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });
  const data = await res.json();
  if (data.init_point) {
    window.location.href = data.init_point;
  } else {
    alert('Error al iniciar el pago');
  }
};

export default function Academia() {
  // Estados
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('todos');
  const [activeLevel, setActiveLevel] = useState<'todos' | CourseLevel>('todos');
  const [activeDuration, setActiveDuration] = useState<'todos' | CourseDuration>('todos');
  const [activePriceRange, setActivePriceRange] = useState<PriceRange>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [selectedLiveClass, setSelectedLiveClass] = useState<LiveClass | null>(null);
  const [showCommunityTab, setShowCommunityTab] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<{title: string, videoUrl: string} | null>(null);
  const [userRatings, setUserRatings] = useState<{[key: number]: number}>({});
  
  // Referencias
  const featuredCoursesRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  
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
  
  // Función para añadir al carrito
  const addToCart = (courseId: number) => {
    if (!cartItems.includes(courseId)) {
      setCartItems([...cartItems, courseId]);
      showNotificationMessage('Curso añadido al carrito');
    } else {
      showNotificationMessage('Este curso ya está en tu carrito');
    }
  };
  
  // Función para manejar el envío del formulario de login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotificationMessage(isRegistering ? 'Cuenta creada con éxito' : 'Sesión iniciada correctamente');
    setShowLoginModal(false);
    setLoginForm({ email: '', password: '' });
  };
  
  // Función para actualizar el formulario de login
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Función para navegar por el slider
  const scrollFeatured = (direction: 'left' | 'right') => {
    if (featuredCoursesRef.current) {
      const scrollAmount = 320; // Ancho aproximado de una tarjeta de curso + margen
      const currentScroll = featuredCoursesRef.current.scrollLeft;
      
      featuredCoursesRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Instructores
  const instructors: Instructor[] = [
    {
      id: 1,
      name: "Dr. Alejandro Méndez",
      role: "Experto en Desarrollo Web",
      bio: "Doctor en Ciencias de la Computación con más de 15 años de experiencia en desarrollo web y arquitectura de software. Ha trabajado en empresas como Google y Amazon.",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      courses: 7,
      students: 12500
    },
    {
      id: 2,
      name: "Sofía Rodríguez",
      role: "Especialista en Marketing Digital",
      bio: "Consultora de Marketing Digital con experiencia trabajando para marcas globales. Experta en SEO, SEM y analítica web con enfoque en resultados medibles.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      courses: 5,
      students: 9300
    },
    {
      id: 3,
      name: "Carlos Vega",
      role: "Diseñador UX/UI Senior",
      bio: "Diseñador con más de 10 años de experiencia en interfaces de usuario y experiencia de usuario. Ha dirigido equipos de diseño en startups y empresas establecidas.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      courses: 4,
      students: 7850
    },
    {
      id: 4,
      name: "Dra. Lucía Fernández",
      role: "Experta en Gestión Empresarial",
      bio: "Doctora en Administración de Empresas con experiencia como consultora de negocios y profesora universitaria. Especializada en estrategia y transformación digital.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      courses: 6,
      students: 10200
    }
  ];
  
  // Cursos
  const courses: Course[] = [
    {
      id: 1,
      title: "Desarrollo Web Full Stack",
      description: "Aprende a crear aplicaciones web completas utilizando las tecnologías más demandadas: React, Node.js, Express y MongoDB.",
      category: "desarrollo",
      level: "Intermedio",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "12 semanas",
      durationCategory: "largo",
      lectures: 78,
      price: 199.99,
      discountPrice: 149.99,
      instructorId: 1,
      rating: 4.8,
      students: 4350,
      featured: true,
      bestSeller: true,
      previewVideo: "https://www.youtube.com/embed/KMf3w5u_XM4",
      previewLessons: [
        {
          title: "Introducción al desarrollo web moderno",
          duration: "15:25",
          videoUrl: "https://www.youtube.com/embed/KMf3w5u_XM4",
          free: true
        },
        {
          title: "Fundamentos de HTML y CSS",
          duration: "23:10",
          videoUrl: "https://www.youtube.com/embed/5bMdjkfvONE",
          free: true
        },
        {
          title: "Primeros pasos con JavaScript",
          duration: "19:45",
          videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c",
          free: false
        }
      ]
    },
    {
      id: 2,
      title: "Marketing Digital Avanzado",
      description: "Domina las estrategias de marketing digital más efectivas, desde SEO y SEM hasta email marketing y redes sociales.",
      category: "marketing",
      level: "Avanzado",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "8 semanas",
      durationCategory: "medio",
      lectures: 56,
      price: 179.99,
      instructorId: 2,
      rating: 4.7,
      students: 3280,
      featured: true,
      previewVideo: "https://www.youtube.com/embed/n7Kbx1a0aF8",
      previewLessons: [
        {
          title: "Introducción al marketing digital",
          duration: "12:30",
          videoUrl: "https://www.youtube.com/embed/n7Kbx1a0aF8",
          free: true
        },
        {
          title: "SEO: Conceptos fundamentales",
          duration: "18:45",
          videoUrl: "https://www.youtube.com/embed/hF515-0Tduk",
          free: false
        }
      ]
    },
    {
      id: 3,
      title: "Diseño UX/UI desde Cero",
      description: "Aprende a crear interfaces de usuario atractivas y funcionales con un enfoque centrado en la experiencia del usuario.",
      category: "diseno",
      level: "Principiante",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "10 semanas",
      durationCategory: "medio",
      lectures: 64,
      price: 189.99,
      discountPrice: 159.99,
      instructorId: 3,
      rating: 4.6,
      students: 2950,
      new: true,
      previewVideo: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
      previewLessons: [
        {
          title: "Fundamentos del diseño UI/UX",
          duration: "16:20",
          videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
          free: true
        }
      ]
    },
    {
      id: 4,
      title: "Gestión de Proyectos Ágiles",
      description: "Aprende a gestionar proyectos utilizando metodologías ágiles como Scrum, Kanban y Design Thinking.",
      category: "negocios",
      level: "Intermedio",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "6 semanas",
      durationCategory: "corto",
      lectures: 42,
      price: 159.99,
      instructorId: 4,
      rating: 4.9,
      students: 5120,
      bestSeller: true,
      previewVideo: "https://www.youtube.com/embed/9l7D7qj9nVU"
    },
    {
      id: 5,
      title: "JavaScript Moderno 2025",
      description: "Domina JavaScript desde los fundamentos hasta las características más avanzadas y los frameworks modernos.",
      category: "desarrollo",
      level: "Intermedio",
      image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "9 semanas",
      durationCategory: "medio",
      lectures: 62,
      price: 169.99,
      instructorId: 1,
      rating: 4.8,
      students: 3780,
      new: true,
      previewVideo: "https://www.youtube.com/embed/hdI2bqOjy3c",
      previewLessons: [
        {
          title: "Introducción a JavaScript moderno",
          duration: "20:15",
          videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c",
          free: true
        }
      ]
    },
    {
      id: 6,
      title: "Analítica Web y Conversión",
      description: "Aprende a analizar el comportamiento de los usuarios en tu sitio web y a optimizar la tasa de conversión.",
      category: "marketing",
      level: "Avanzado",
      image: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "7 semanas",
      durationCategory: "medio",
      lectures: 48,
      price: 169.99,
      discountPrice: 139.99,
      instructorId: 2,
      rating: 4.6,
      students: 2590
    },
    {
      id: 7,
      title: "Diseño de Interfaces Móviles",
      description: "Especialízate en el diseño de interfaces para aplicaciones móviles en iOS y Android siguiendo los principios de Material Design y Human Interface.",
      category: "diseno",
      level: "Intermedio",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "8 semanas",
      durationCategory: "medio",
      lectures: 52,
      price: 179.99,
      instructorId: 3,
      rating: 4.7,
      students: 3150
    },
    {
      id: 8,
      title: "Innovación y Transformación Digital",
      description: "Aprende a implementar estrategias de transformación digital en tu empresa o negocio para mantenerte competitivo.",
      category: "negocios",
      level: "Avanzado",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "10 semanas",
      durationCategory: "medio",
      lectures: 68,
      price: 199.99,
      instructorId: 4,
      rating: 4.9,
      students: 2870,
      featured: true
    },
    {
      id: 9,
      title: "Desarrollo de Aplicaciones React Native",
      description: "Crea aplicaciones móviles multiplataforma con React Native y despliégalas en iOS y Android.",
      category: "desarrollo",
      level: "Avanzado",
      image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "11 semanas",
      durationCategory: "largo",
      lectures: 72,
      price: 189.99,
      instructorId: 1,
      rating: 4.8,
      students: 1950
    },
    {
      id: 10,
      title: "SEO Avanzado y Posicionamiento",
      description: "Domina las técnicas de SEO más efectivas para posicionar tu sitio web en los primeros resultados de búsqueda.",
      category: "marketing",
      level: "Avanzado",
      image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "9 semanas",
      durationCategory: "medio",
      lectures: 58,
      price: 179.99,
      discountPrice: 149.99,
      instructorId: 2,
      rating: 4.7,
      students: 2340,
      bestSeller: true
    },
    {
      id: 11,
      title: "Motion Graphics y Animación 2D",
      description: "Aprende a crear animaciones impactantes para web, redes sociales y plataformas digitales.",
      category: "diseno",
      level: "Intermedio",
      image: "https://images.unsplash.com/photo-1561883088-039e53143d73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "10 semanas",
      durationCategory: "medio",
      lectures: 64,
      price: 189.99,
      instructorId: 3,
      rating: 4.6,
      students: 1870
    },
    {
      id: 12,
      title: "Liderazgo y Gestión de Equipos",
      description: "Desarrolla habilidades de liderazgo efectivo para dirigir equipos de alto rendimiento en entornos exigentes.",
      category: "negocios",
      level: "Intermedio",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      duration: "8 semanas",
      durationCategory: "medio",
      lectures: 46,
      price: 169.99,
      instructorId: 4,
      rating: 4.8,
      students: 2950
    }
  ];
  
  // Clases en vivo
  const liveClasses: LiveClass[] = [
    {
      id: 1,
      title: "Fundamentos de React: Componentes y Estado",
      instructorId: 1,
      date: "23 Abril, 2025",
      time: "18:00",
      duration: "90 min",
      attendees: 247,
      category: "desarrollo",
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      available: true,
      enrollmentLimit: 300
    },
    {
      id: 2,
      title: "Estrategias de Growth Hacking para Startups",
      instructorId: 2,
      date: "25 Abril, 2025",
      time: "19:30",
      duration: "120 min",
      attendees: 189,
      category: "marketing",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      available: true,
      enrollmentLimit: 200
    },
    {
      id: 3,
      title: "Tendencias de Diseño UX/UI para 2025",
      instructorId: 3,
      date: "28 Abril, 2025",
      time: "17:00",
      duration: "90 min",
      attendees: 215,
      category: "diseno",
      image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      available: true,
      enrollmentLimit: 250
    },
    {
      id: 4,
      title: "Inteligencia Artificial para Desarrolladores",
      instructorId: 1,
      date: "3 Mayo, 2025",
      time: "18:30",
      duration: "120 min",
      attendees: 298,
      category: "desarrollo",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      available: false,
      enrollmentLimit: 300
    },
    {
      id: 5,
      title: "Optimización de Conversión en E-commerce",
      instructorId: 2,
      date: "6 Mayo, 2025",
      time: "17:00",
      duration: "90 min",
      attendees: 156,
      category: "marketing",
      image: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      available: true,
      enrollmentLimit: 200
    },
    {
      id: 6,
      title: "Diseño de Sistemas de Identidad Visual",
      instructorId: 3,
      date: "10 Mayo, 2025",
      time: "19:00",
      duration: "90 min",
      attendees: 178,
      category: "diseno",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      available: true,
      enrollmentLimit: 220
    }
  ];
  
  // Testimonios
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Pablo Fernández",
      role: "Desarrollador Frontend",
      message: "El curso de Desarrollo Web Full Stack transformó mi carrera. En menos de 6 meses logré conseguir mi primer trabajo como desarrollador en una startup.",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 5,
      course: "Desarrollo Web Full Stack"
    },
    {
      id: 2,
      name: "Laura Gómez",
      role: "Digital Marketing Manager",
      message: "La calidad del contenido y la metodología de enseñanza son excelentes. Gracias al curso de Marketing Digital pude implementar estrategias que aumentaron nuestras conversiones en un 45%.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 5,
      course: "Marketing Digital Avanzado"
    },
    {
      id: 3,
      name: "Miguel Sánchez",
      role: "Project Manager",
      message: "El enfoque práctico del curso de Gestión de Proyectos Ágiles me permitió aplicar inmediatamente los conocimientos en mi trabajo. Ahora nuestros proyectos se entregan a tiempo y dentro del presupuesto.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4,
      course: "Gestión de Proyectos Ágiles"
    }
  ];
  
  // Filtrar cursos según múltiples criterios
  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'todos' || course.category === activeCategory;
    const matchesLevel = activeLevel === 'todos' || course.level === activeLevel;
    const matchesDuration = activeDuration === 'todos' || course.durationCategory === activeDuration;
    const matchesPrice = activePriceRange === 'todos' || 
                        (activePriceRange === 'bajo' && (course.discountPrice || course.price) < 150) ||
                        (activePriceRange === 'medio' && (course.discountPrice || course.price) >= 150 && (course.discountPrice || course.price) < 180) ||
                        (activePriceRange === 'alto' && (course.discountPrice || course.price) >= 180);
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesDuration && matchesPrice && matchesSearch;
  });
  
  // Cursos destacados
  const featuredCourses = courses.filter(course => course.featured);
  
  // Obtener información del instructor por ID
  const getInstructor = (id: number) => {
    return instructors.find(instructor => instructor.id === id);
  };
  
  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  // Función para renderizar estrellas de valoración (solo lectura)
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <svg 
        key={index} 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-4 w-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };
  
  // Función para renderizar estrellas interactivas (para calificar)
  const renderInteractiveStars = (courseId: number) => {
    const currentRating = userRatings[courseId] || 0;
    
    return Array(5).fill(0).map((_, index) => (
      <svg 
        key={index} 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-6 w-6 ${index < currentRating ? 'text-yellow-400' : 'text-gray-300'} cursor-pointer transition-colors duration-200 hover:text-yellow-400`}
        viewBox="0 0 20 20" 
        fill="currentColor"
        onClick={() => handleRating(courseId, index + 1)}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };
  
  // Función para manejar la calificación de un curso
  const handleRating = (courseId: number, rating: number) => {
    setUserRatings(prev => ({
      ...prev,
      [courseId]: rating
    }));
    showNotificationMessage(`Has calificado este curso con ${rating} ${rating === 1 ? 'estrella' : 'estrellas'}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Metadatos SEO */}
      <MetaTags
        title="Academia Online: Cursos de Desarrollo, Negocios y Más"
        description="Aprende habilidades digitales y profesionales con nuestros cursos online, impartidos por expertos. Desarrollo web, marketing, diseño y negocios."
        keywords="cursos online, academia virtual, desarrollo web, marketing digital, diseño, negocios, aprendizaje, educación online"
        type="website"
      />
      
      {/* Botón Volver a Proyectos */}
      <div className="fixed left-5 z-50" style={{ top: '80px' }}>
        <Link 
          to="/#showroom" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full text-white transition-colors shadow-md"
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
              <span className="text-indigo-600">Academia</span>
              <span className="text-gray-800">Online</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cursos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-10"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#cursos" className="text-gray-600 hover:text-indigo-600 transition-colors">Cursos</a>
            <a href="#instructores" className="text-gray-600 hover:text-indigo-600 transition-colors">Instructores</a>
            <a href="#liveClasses" className="text-gray-600 hover:text-indigo-600 transition-colors">Clases en Vivo</a>
            <div className="relative">
              <button 
                className="text-gray-600 hover:text-indigo-600 transition-colors"
                onClick={() => cartItems.length > 0 ? showNotificationMessage('Procesando compra...') : null}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              Iniciar Sesión
            </button>
          </nav>
          
          <div className="md:hidden flex items-center">
            <button className="mr-4 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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
      
      {/* Hero Section - Contenido principal para accesibilidad */}
      <section id="main-content" className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Aprende las habilidades del futuro</h1>
              <p className="text-xl mb-8 opacity-90">
                Cursos online impartidos por expertos de la industria. Desarrolla habilidades relevantes para el mercado laboral actual.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#cursos" 
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors shadow-lg"
                >
                  Explorar Cursos
                </a>
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-600 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Crear Cuenta
                </button>
              </div>
              <div className="mt-8 flex items-center space-x-1">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&q=80" alt="Usuario" className="w-8 h-8 rounded-full border-2 border-indigo-700" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&q=80" alt="Usuario" className="w-8 h-8 rounded-full border-2 border-indigo-700" />
                  <img src="https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&q=80" alt="Usuario" className="w-8 h-8 rounded-full border-2 border-indigo-700" />
                </div>
                <span className="text-sm opacity-90">Más de 50,000 estudiantes ya confían en nosotros</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white p-2 rounded-xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Estudiantes aprendiendo" 
                  className="rounded-lg w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Estadísticas */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Cursos", value: "120+", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ) },
              { label: "Instructores", value: "25+", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) },
              { label: "Estudiantes", value: "50,000+", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ) },
              { label: "Satisfacción", value: "98%", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              ) }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Cursos Destacados */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Cursos destacados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestra selección de cursos más populares y mejor valorados.
            </p>
          </div>
          
          <div className="relative">
            <div 
              ref={featuredCoursesRef}
              className="flex overflow-x-auto space-x-6 pb-8 scrollbar-hide"
            >
              {featuredCourses.map((course) => (
                <div key={course.id} className="flex-shrink-0 w-80">
                  <motion.div 
                    className="bg-white rounded-xl shadow-md overflow-hidden h-full"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      {course.bestSeller && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-md">
                          BESTSELLER
                        </div>
                      )}
                      {course.new && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                          NUEVO
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center mb-2">
                        <img 
                          src={getInstructor(course.instructorId)?.image} 
                          alt={getInstructor(course.instructorId)?.name} 
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          {getInstructor(course.instructorId)?.name}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {renderStars(course.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{course.rating} ({course.students})</span>
                      </div>
                      <div className="flex items-center mb-4">
                        <span className="text-sm mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.duration}
                        </span>
                        <span className="text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                          {course.lectures} clases
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          {course.discountPrice ? (
                            <div>
                              <span className="font-bold text-gray-800 text-lg">{formatPrice(course.discountPrice)}</span>
                              <span className="text-gray-500 line-through ml-2 text-sm">{formatPrice(course.price)}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-gray-800 text-lg">{formatPrice(course.price)}</span>
                          )}
                        </div>
                        <button 
                          onClick={() => addToCart(course.id)}
                          className="text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white px-3 py-1 rounded-full transition-colors text-sm"
                        >
                          Añadir
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => scrollFeatured('left')}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => scrollFeatured('right')}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      {/* Categorías */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Explora por Categoría</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encuentra cursos específicos según tus intereses y objetivos profesionales.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                category: "desarrollo", 
                name: "Desarrollo", 
                description: "Programación, desarrollo web y aplicaciones", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                courses: courses.filter(c => c.category === "desarrollo").length,
                bgGradient: "from-blue-500 to-indigo-600"
              },
              { 
                category: "negocios", 
                name: "Negocios", 
                description: "Gestión, estrategia y liderazgo empresarial", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                courses: courses.filter(c => c.category === "negocios").length,
                bgGradient: "from-green-500 to-emerald-600"
              },
              { 
                category: "marketing", 
                name: "Marketing", 
                description: "Marketing digital, branding y estrategias de venta", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                ),
                courses: courses.filter(c => c.category === "marketing").length,
                bgGradient: "from-orange-500 to-red-600"
              },
              { 
                category: "diseno", 
                name: "Diseño", 
                description: "Diseño gráfico, UI/UX y creación digital", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                ),
                courses: courses.filter(c => c.category === "diseno").length,
                bgGradient: "from-purple-500 to-pink-600"
              }
            ].map((category) => (
              <motion.div 
                key={category.category}
                className={`bg-gradient-to-r ${category.bgGradient} rounded-xl p-6 text-white shadow-md`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveCategory(category.category === "todos" ? "todos" : category.category as CourseCategory)}
              >
                <div className="p-3 bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-white/80 mb-2">{category.description}</p>
                <div className="text-sm font-medium">{category.courses} cursos</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Cursos */}
      <section id="cursos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestros Cursos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora nuestra biblioteca completa de cursos diseñados para impulsar tu carrera.
            </p>
          </div>
          
          <div className="mb-8 flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Filtros avanzados</h3>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Categoría</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveCategory('todos')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeCategory === 'todos' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Todos
                </button>
                <button 
                  onClick={() => setActiveCategory('desarrollo')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeCategory === 'desarrollo' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Desarrollo
                </button>
                <button 
                  onClick={() => setActiveCategory('negocios')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeCategory === 'negocios' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Negocios
                </button>
                <button 
                  onClick={() => setActiveCategory('marketing')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeCategory === 'marketing' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Marketing
                </button>
                <button 
                  onClick={() => setActiveCategory('diseno')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeCategory === 'diseno' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Diseño
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Nivel</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveLevel('todos')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeLevel === 'todos' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Todos los niveles
                </button>
                <button 
                  onClick={() => setActiveLevel('Principiante')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeLevel === 'Principiante' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Principiante
                </button>
                <button 
                  onClick={() => setActiveLevel('Intermedio')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeLevel === 'Intermedio' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Intermedio
                </button>
                <button 
                  onClick={() => setActiveLevel('Avanzado')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeLevel === 'Avanzado' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Avanzado
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Duración</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveDuration('todos')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeDuration === 'todos' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Cualquier duración
                </button>
                <button 
                  onClick={() => setActiveDuration('corto')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeDuration === 'corto' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Corto (0-6 semanas)
                </button>
                <button 
                  onClick={() => setActiveDuration('medio')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeDuration === 'medio' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Medio (7-10 semanas)
                </button>
                <button 
                  onClick={() => setActiveDuration('largo')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeDuration === 'largo' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Largo (11+ semanas)
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Precio</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActivePriceRange('todos')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activePriceRange === 'todos' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Cualquier precio
                </button>
                <button 
                  onClick={() => setActivePriceRange('bajo')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activePriceRange === 'bajo' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Económico (&lt; €150)
                </button>
                <button 
                  onClick={() => setActivePriceRange('medio')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activePriceRange === 'medio' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Intermedio (€150 - €180)
                </button>
                <button 
                  onClick={() => setActivePriceRange('alto')}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activePriceRange === 'alto' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Premium (&gt; €180)
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
              <span className="text-sm text-gray-500">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
              </span>
              <button 
                onClick={() => {
                  setActiveCategory('todos');
                  setActiveLevel('todos');
                  setActiveDuration('todos');
                  setActivePriceRange('todos');
                  setSearchTerm('');
                }}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <motion.div 
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden h-full"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {course.bestSeller && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-md">
                      BESTSELLER
                    </div>
                  )}
                  {course.new && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      NUEVO
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                    {course.level}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <img 
                      src={getInstructor(course.instructorId)?.image} 
                      alt={getInstructor(course.instructorId)?.name} 
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span className="text-sm text-gray-600">
                      {getInstructor(course.instructorId)?.name}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(course.rating)}
                    </div>
                    <span className="text-sm text-gray-600">{course.rating} ({course.students})</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="text-sm mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration}
                    </span>
                    <span className="text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                      {course.lectures} clases
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      {course.discountPrice ? (
                        <div>
                          <span className="font-bold text-gray-800 text-lg">{formatPrice(course.discountPrice)}</span>
                          <span className="text-gray-500 line-through ml-2 text-sm">{formatPrice(course.price)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-800 text-lg">{formatPrice(course.price)}</span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(course.id);
                      }}
                      className="text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white px-3 py-1 rounded-full transition-colors text-sm"
                    >
                      Añadir
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (course.previewLessons && course.previewLessons.length > 0) {
                          setPreviewLesson({
                            title: course.previewLessons[0].title,
                            videoUrl: course.previewLessons[0].videoUrl
                          });
                          setShowPreviewModal(true);
                        } else if (course.previewVideo) {
                          setPreviewLesson({
                            title: course.title,
                            videoUrl: course.previewVideo
                          });
                          setShowPreviewModal(true);
                        } else {
                          showNotificationMessage('No hay vista previa disponible para este curso');
                        }
                      }}
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      Vista previa
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourse(course);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron cursos</h3>
              <p className="text-gray-500">Prueba con otros filtros o términos de búsqueda</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Instructores */}
      <section id="instructores" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Conoce a Nuestros Instructores</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aprende de profesionales expertos con amplia experiencia en la industria.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor) => (
              <motion.div 
                key={instructor.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={instructor.image} 
                    alt={instructor.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{instructor.name}</h3>
                  <p className="text-indigo-600 text-sm mb-2">{instructor.role}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                      {renderStars(instructor.rating)}
                    </div>
                    <span className="text-sm text-gray-600">{instructor.rating}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>{instructor.courses} cursos</span>
                    <span>{instructor.students.toLocaleString()} estudiantes</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{instructor.bio}</p>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors text-sm">
                    Ver Perfil
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Clases en Vivo */}
      <section id="liveClasses" className="py-16 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Clases en Vivo</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Sesiones interactivas con instructores en tiempo real. Interactúa, pregunta y aprende directamente de los expertos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveClasses.map((liveClass) => {
              const instructor = getInstructor(liveClass.instructorId);
              
              return (
                <motion.div 
                  key={liveClass.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={liveClass.image} 
                      alt={liveClass.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <span className="h-2 w-2 bg-white rounded-full mr-1 animate-pulse"></span>
                        EN VIVO
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2">{liveClass.title}</h3>
                    <div className="flex items-center mb-4">
                      {instructor && (
                        <>
                          <img 
                            src={instructor.image} 
                            alt={instructor.name} 
                            className="w-8 h-8 rounded-full object-cover mr-2"
                          />
                          <span className="text-sm">{instructor.name}</span>
                        </>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white/10 rounded p-2 text-center">
                        <div className="text-sm font-medium mb-1">Fecha</div>
                        <div className="text-xs">{liveClass.date}</div>
                      </div>
                      <div className="bg-white/10 rounded p-2 text-center">
                        <div className="text-sm font-medium mb-1">Hora</div>
                        <div className="text-xs">{liveClass.time} ({liveClass.duration})</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {liveClass.attendees} asistentes
                      </span>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        liveClass.attendees < liveClass.enrollmentLimit * 0.7
                          ? 'bg-green-100 text-green-800'
                          : liveClass.attendees < liveClass.enrollmentLimit * 0.9
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {liveClass.attendees >= liveClass.enrollmentLimit
                          ? 'Completo'
                          : `${liveClass.enrollmentLimit - liveClass.attendees} plazas disponibles`
                        }
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      {liveClass.available ? (
                        <span className="text-xs text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Inscripciones abiertas
                        </span>
                      ) : (
                        <span className="text-xs text-red-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Inscripciones cerradas
                        </span>
                      )}
                      <button 
                        onClick={() => {
                          if (liveClass.available && liveClass.attendees < liveClass.enrollmentLimit) {
                            setSelectedLiveClass(liveClass);
                            showNotificationMessage('Reservando tu plaza...');
                          } else if (!liveClass.available) {
                            showNotificationMessage('Las inscripciones para esta clase están cerradas');
                          } else {
                            showNotificationMessage('Esta clase está completa');
                          }
                        }}
                        className={`px-4 py-2 rounded transition-colors text-sm ${
                          liveClass.available && liveClass.attendees < liveClass.enrollmentLimit
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                            : 'bg-gray-400 text-white cursor-not-allowed'
                        }`}
                        disabled={!liveClass.available || liveClass.attendees >= liveClass.enrollmentLimit}
                      >
                        {liveClass.available && liveClass.attendees < liveClass.enrollmentLimit
                          ? 'Reservar'
                          : liveClass.available ? 'Completo' : 'No disponible'
                        }
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-white text-indigo-700 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors">
              Ver Todas las Clases en Vivo
            </button>
          </div>
        </div>
      </section>
      
      {/* Comunidad y Foro */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Comunidad de Estudiantes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conecta con otros estudiantes, comparte dudas y conocimientos, y crece en comunidad.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Discusiones Recientes</h3>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                      Nueva Publicación
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {forumPosts.map((post) => (
                      <div key={post.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-start gap-4">
                          <img 
                            src={post.userImage} 
                            alt={post.userName} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 mb-1">{post.title}</h4>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex}
                                  className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <span>Por {post.userName}</span>
                                <span>•</span>
                                <span>{post.date}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                  {post.likes}
                                </span>
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  {post.replies}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Ver todas las discusiones
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="p-5 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-2">Temas Populares</h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                      #javascript
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                      #react
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                      #python
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                      #UX/UI
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                      #diseño
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                      #marketing
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors">
                      #agile
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="p-5 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-4">Miembros Destacados</h3>
                  <div className="space-y-4">
                    {forumPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex items-center gap-3">
                        <img 
                          src={post.userImage} 
                          alt={post.userName} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">{post.userName}</h4>
                          <p className="text-xs text-gray-500">{post.replies + post.likes} contribuciones</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Normas de la Comunidad</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sé respetuoso con todos los miembros
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Comparte conocimiento y ayuda a otros
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Evita el spam y contenido inapropiado
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Da crédito cuando compartas recursos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lo que dicen nuestros estudiantes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experiencias de quienes ya han transformado su carrera con nuestros cursos.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div ref={testimonialsRef}>
              <div className="relative bg-white rounded-xl shadow-lg p-8">
                <div className="absolute top-8 left-8 text-indigo-200 opacity-20">
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
                      <p className="text-indigo-600">{testimonials[currentTestimonialIndex].role}</p>
                      <div className="flex mt-2">
                        {renderStars(testimonials[currentTestimonialIndex].rating)}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{testimonials[currentTestimonialIndex].course}</p>
                    </div>
                    
                    <div className="md:w-2/3 md:pl-8 md:border-l border-gray-200">
                      <blockquote className="text-xl text-gray-700 italic">
                        "{testimonials[currentTestimonialIndex].message}"
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
                            currentTestimonialIndex === index ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Comienza tu viaje de aprendizaje hoy</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Únete a más de 50,000 estudiantes que ya están desarrollando las habilidades que necesitan para destacar en su carrera.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => showNotificationMessage('Explorando cursos disponibles...')}
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-full font-medium transition-colors shadow-lg"
            >
              Explorar Cursos
            </button>
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-full font-medium transition-colors"
            >
              Crear Cuenta Gratis
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-indigo-400">Academia</span>
                <span className="text-white">Online</span>
              </h3>
              <p className="text-gray-400 mb-6">
                Plataforma de educación online dedicada a proporcionar cursos de calidad impartidos por profesionales expertos en cada área.
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
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Explorar</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Todos los cursos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Clases en vivo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Instructores</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Eventos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Categorías</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Desarrollo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Negocios</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Marketing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Diseño</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ver todas</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Ayuda</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Preguntas frecuentes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos de servicio</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400 text-sm">
            <p>© 2025 AcademiaOnline. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      
      {/* Modal de vista previa de lección */}
      {showPreviewModal && previewLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {previewLesson.title}
              </h3>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                className="w-full h-80 rounded-lg"
                src={previewLesson.videoUrl}
                title={previewLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Cerrar
              </button>
              
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setShowPreviewModal(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Inscribirse al curso
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de curso detallado con sistema de calificación */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-5xl my-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedCourse.title}
              </h3>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  {selectedCourse.previewVideo ? (
                    <iframe
                      className="w-full h-64 md:h-80 rounded-lg"
                      src={selectedCourse.previewVideo}
                      title={selectedCourse.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <img 
                      src={selectedCourse.image} 
                      alt={selectedCourse.title} 
                      className="w-full h-64 md:h-80 rounded-lg object-cover"
                    />
                  )}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Descripción</h4>
                  <p className="text-gray-600">{selectedCourse.description}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Contenido del curso</h4>
                  <div className="space-y-3">
                    {selectedCourse.previewLessons ? (
                      selectedCourse.previewLessons.map((lesson, index) => (
                        <div 
                          key={index} 
                          className="border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800">{lesson.title}</h5>
                              <p className="text-sm text-gray-500">{lesson.duration}</p>
                            </div>
                          </div>
                          
                          {lesson.free ? (
                            <button
                              onClick={() => {
                                setPreviewLesson({
                                  title: lesson.title,
                                  videoUrl: lesson.videoUrl
                                });
                                setShowPreviewModal(true);
                                setSelectedCourse(null);
                              }}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                            >
                              Vista previa
                            </button>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Bloqueado
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No hay lecciones disponibles para vista previa.</p>
                    )}
                    
                    <div className="border border-gray-200 rounded-lg p-3 text-center text-gray-500">
                      +{selectedCourse.lectures - (selectedCourse.previewLessons?.length || 0)} lecciones más
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Calificación del curso</h4>
                  
                  <div className="flex items-center mb-2">
                    <div className="mr-2 text-2xl font-bold text-gray-800">
                      {selectedCourse.rating.toFixed(1)}
                    </div>
                    <div className="flex items-center">
                      {renderStars(selectedCourse.rating)}
                      <span className="ml-2 text-sm text-gray-500">({selectedCourse.students} estudiantes)</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">¿Qué te pareció este curso?</h5>
                    <div className="flex">
                      {renderInteractiveStars(selectedCourse.id)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-xl p-5 shadow-sm sticky top-20">
                  <div className="mb-3">
                    {selectedCourse.discountPrice ? (
                      <div>
                        <span className="font-bold text-gray-800 text-2xl">{formatPrice(selectedCourse.discountPrice)}</span>
                        <span className="text-gray-500 line-through ml-2">{formatPrice(selectedCourse.price)}</span>
                        <span className="text-green-600 ml-2">
                          {Math.round((1 - selectedCourse.discountPrice / selectedCourse.price) * 100)}% dto.
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-gray-800 text-2xl">{formatPrice(selectedCourse.price)}</span>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <button 
                      onClick={() => {
                        addToCart(selectedCourse.id);
                        setSelectedCourse(null);
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors"
                    >
                      Añadir al carrito
                    </button>
                    <button 
                      onClick={() => {
                        showNotificationMessage('Procediendo a la compra...');
                        setTimeout(() => setSelectedCourse(null), 1000);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
                    >
                      Comprar ahora
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800">Este curso incluye:</h5>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {selectedCourse.lectures} videoclases
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        Recursos descargables
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Acceso de por vida
                      </li>
                      <li className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Certificado de finalización
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white rounded-xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isRegistering ? 'Crear una cuenta' : 'Iniciar Sesión'}
                </h2>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Nombre completo</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email-academia">Email</label>
                  <input 
                    type="email" 
                    id="email-academia"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Contraseña</label>
                  <input 
                    type="password" 
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="********"
                    required
                  />
                </div>
                
                {!isRegistering && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Recordarme
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-indigo-600 hover:text-indigo-800">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                  </div>
                )}
                
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors"
                >
                  {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
                
                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        O continúa con
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                          <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                          <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                          <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                        </g>
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                      Twitter
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
                  <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-indigo-600 font-medium hover:text-indigo-800"
                  >
                    {isRegistering ? 'Inicia sesión' : 'Regístrate'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal detalle de curso */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            className="bg-white rounded-xl max-w-4xl w-full my-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-0">
              <div className="relative h-64">
                <img 
                  src={selectedCourse.image} 
                  alt={selectedCourse.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedCourse.title}</h2>
                  <div className="flex items-center text-white">
                    <div className="flex mr-2">
                      {renderStars(selectedCourse.rating)}
                    </div>
                    <span className="text-sm">{selectedCourse.rating} ({selectedCourse.students} estudiantes)</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Lo que aprenderás</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {['Dominar los conceptos fundamentales', 'Construir proyectos reales', 'Resolver problemas complejos', 'Implementar mejores prácticas'].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Descripción</h3>
                    <p className="text-gray-700 mb-6">{selectedCourse.description}</p>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Instructor</h3>
                    {getInstructor(selectedCourse.instructorId) && (
                      <div className="flex items-start mb-6">
                        <img 
                          src={getInstructor(selectedCourse.instructorId)?.image} 
                          alt={getInstructor(selectedCourse.instructorId)?.name} 
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{getInstructor(selectedCourse.instructorId)?.name}</h4>
                          <p className="text-indigo-600 text-sm mb-2">{getInstructor(selectedCourse.instructorId)?.role}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="mr-4">{getInstructor(selectedCourse.instructorId)?.courses} cursos</span>
                            <span>{getInstructor(selectedCourse.instructorId)?.students.toLocaleString()} estudiantes</span>
                          </div>
                          <p className="text-gray-600 text-sm">{getInstructor(selectedCourse.instructorId)?.bio}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                      <div className="mb-4">
                        {selectedCourse.discountPrice ? (
                          <div>
                            <span className="font-bold text-gray-800 text-2xl">{formatPrice(selectedCourse.discountPrice)}</span>
                            <span className="text-gray-500 line-through ml-2">{formatPrice(selectedCourse.price)}</span>
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded ml-2">
                              {Math.round((1 - selectedCourse.discountPrice / selectedCourse.price) * 100)}% dto.
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-gray-800 text-2xl">{formatPrice(selectedCourse.price)}</span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => {
                          addToCart(selectedCourse.id);
                          setSelectedCourse(null);
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors mb-3"
                      >
                        Añadir al carrito
                      </button>
                      
                      <button className="w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 rounded-lg font-medium transition-colors">
                        Comprar ahora
                      </button>
                      
                      <p className="text-center text-sm text-gray-500 mt-4">
                        30 días de garantía de devolución
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-4">Este curso incluye:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          {selectedCourse.lectures} clases en video
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Acceso de por vida
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          Recursos descargables
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Certificado de finalización
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Soporte al estudiante
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}