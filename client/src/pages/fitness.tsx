import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MetaTags from '@/components/seo/meta-tags';

type TrainerCategory = 'todos' | 'fuerza' | 'cardio' | 'flexibilidad' | 'nutricion';

interface Trainer {
  id: number;
  name: string;
  specialty: TrainerCategory;
  experience: string;
  rating: number;
  description: string;
  image: string;
  available: boolean;
}

interface Program {
  id: number;
  title: string;
  category: TrainerCategory;
  duration: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  description: string;
  image: string;
  trainerId: number;
  price: number;
  featured?: boolean;
  bestSeller?: boolean;
}

export default function Fitness() {
  // Estado para seguimiento del usuario
  const [userProgress, setUserProgress] = useState({
    weight: 70,
    goalWeight: 65,
    daysActive: 42,
    workoutsCompleted: 18,
    achievements: 7
  });
  
  // Estado para categorías activas
  const [activeCategory, setActiveCategory] = useState<TrainerCategory>('todos');
  
  // Estado para formulario de contacto
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: 'perder-peso',
    message: ''
  });
  
  // Estado para notificaciones
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Referencias para el slider de programas destacados
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Función para mostrar notificaciones
  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  // Función para manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotificationMessage('¡Gracias! Te contactaremos pronto para comenzar tu entrenamiento.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      goal: 'perder-peso',
      message: ''
    });
  };
  
  // Función para actualizar el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Navegar por el slider
  const nextSlide = () => {
    if (sliderRef.current) {
      const totalSlides = featuredPrograms.length;
      setCurrentSlide(prev => (prev + 1) % totalSlides);
      
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: ((currentSlide + 1) % totalSlides) * slideWidth,
        behavior: 'smooth'
      });
    }
  };
  
  const prevSlide = () => {
    if (sliderRef.current) {
      const totalSlides = featuredPrograms.length;
      setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
      
      const slideWidth = sliderRef.current.offsetWidth;
      sliderRef.current.scrollTo({
        left: ((currentSlide - 1 + totalSlides) % totalSlides) * slideWidth,
        behavior: 'smooth'
      });
    }
  };
  
  // Scroll al inicio cuando cargue la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Datos de Entrenadores
  const trainers: Trainer[] = [
    {
      id: 1,
      name: "Alex Romero",
      specialty: "fuerza",
      experience: "8 años",
      rating: 4.9,
      description: "Especialista en entrenamiento de fuerza y desarrollo muscular, con certificación en CrossFit y levantamiento olímpico.",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      available: true
    },
    {
      id: 2,
      name: "Sofia Martín",
      specialty: "cardio",
      experience: "6 años",
      rating: 4.8,
      description: "Experta en entrenamientos cardiovasculares de alta intensidad y programas de quema de grasa.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      available: true
    },
    {
      id: 3,
      name: "Marcos Villa",
      specialty: "flexibilidad",
      experience: "10 años",
      rating: 4.7,
      description: "Especialista en yoga, pilates y ejercicios de movilidad para mejorar la flexibilidad y prevenir lesiones.",
      image: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      available: false
    },
    {
      id: 4,
      name: "Laura Reyes",
      specialty: "nutricion",
      experience: "7 años",
      rating: 4.9,
      description: "Nutricionista deportiva especializada en planes alimenticios para optimizar el rendimiento y la recuperación.",
      image: "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      available: true
    }
  ];
  
  // Datos de Programas
  const programs: Program[] = [
    {
      id: 1,
      title: "Total Body Transformation",
      category: "fuerza",
      duration: "12 semanas",
      difficulty: "Intermedio",
      description: "Programa completo para transformar tu cuerpo, aumentar masa muscular y reducir grasa corporal.",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      trainerId: 1,
      price: 149,
      bestSeller: true
    },
    {
      id: 2,
      title: "Cardio Burn",
      category: "cardio",
      duration: "8 semanas",
      difficulty: "Principiante",
      description: "Programa intensivo de cardio para maximizar la quema de calorías y mejorar la resistencia.",
      image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      trainerId: 2,
      price: 99
    },
    {
      id: 3,
      title: "Flexibility Master",
      category: "flexibilidad",
      duration: "6 semanas",
      difficulty: "Principiante",
      description: "Programa enfocado en mejorar la flexibilidad, movilidad articular y prevenir lesiones.",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      trainerId: 3,
      price: 79
    },
    {
      id: 4,
      title: "Nutrition Reset",
      category: "nutricion",
      duration: "4 semanas",
      difficulty: "Principiante",
      description: "Plan de nutrición personalizado para resetear tus hábitos alimenticios y optimizar tu salud.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      trainerId: 4,
      price: 129
    },
    {
      id: 5,
      title: "Hipertrofia Máxima",
      category: "fuerza",
      duration: "10 semanas",
      difficulty: "Avanzado",
      description: "Programa especializado en maximizar el crecimiento muscular con técnicas avanzadas de entrenamiento.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      trainerId: 1,
      price: 169,
      featured: true
    },
    {
      id: 6,
      title: "HIIT Revolution",
      category: "cardio",
      duration: "6 semanas",
      difficulty: "Intermedio",
      description: "Entrenamiento de intervalos de alta intensidad para quemar grasa y mejorar el acondicionamiento.",
      image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      trainerId: 2,
      price: 119,
      featured: true
    },
    {
      id: 7,
      title: "Yoga Flow",
      category: "flexibilidad",
      duration: "8 semanas",
      difficulty: "Intermedio",
      description: "Secuencias de yoga para mejorar fuerza, flexibilidad y bienestar mental.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      trainerId: 3,
      price: 89,
      featured: true
    },
    {
      id: 8,
      title: "Meal Prep Master",
      category: "nutricion",
      duration: "4 semanas",
      difficulty: "Principiante",
      description: "Aprende a preparar comidas saludables y deliciosas para toda la semana en poco tiempo.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      trainerId: 4,
      price: 79
    }
  ];
  
  // Programas filtrados por categoría
  const filteredPrograms = activeCategory === 'todos' 
    ? programs 
    : programs.filter(program => program.category === activeCategory);
  
  // Programas destacados para el slider
  const featuredPrograms = programs.filter(program => program.featured);
  
  // Obtener entrenador por ID
  const getTrainerById = (id: number) => {
    return trainers.find(trainer => trainer.id === id);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Metadatos SEO */}
      <MetaTags
        title="FitnessPro: Entrenamiento Personalizado y Nutrición"
        description="Transforma tu cuerpo con FitnessPro. Ofrecemos programas de entrenamiento personalizados, nutrición y entrenadores profesionales para ayudarte a alcanzar tus objetivos."
        keywords="fitness, entrenamiento, nutrición, ejercicio, salud, gimnasio, programas de entrenamiento, entrenadores personales"
        type="article"
      />
      
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
      <header className="sticky top-0 bg-white shadow-md z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              Fitness<span className="text-gray-800">Pro</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</a>
            <a href="#programas" className="text-gray-700 hover:text-blue-600 transition-colors">Programas</a>
            <a href="#entrenadores" className="text-gray-700 hover:text-blue-600 transition-colors">Entrenadores</a>
            <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</a>
          </nav>
          
          <div className="md:hidden">
            <button className="text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="hidden md:block">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section - Contenido principal para accesibilidad */}
      <section id="main-content" className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Transforma tu cuerpo.<br />Transforma tu vida.</h1>
              <p className="text-xl mb-8 opacity-90">
                Programas de entrenamiento personalizados para ayudarte a alcanzar tus objetivos, diseñados por expertos y adaptados a ti.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#programas" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors">
                  Ver Programas
                </a>
                <a href="#contacto" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-full font-medium transition-colors">
                  Hablar con un Entrenador
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative bg-white p-2 rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518644730709-0835105d9daa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Fitness training" 
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                  Resultados Garantizados
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Dashboard Section */}
      <section id="dashboard" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-gray-50 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-10 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Mi Dashboard Personal</h2>
                  <p className="opacity-90">Seguimiento de tu progreso y objetivos</p>
                </div>
                <div className="mt-4 md:mt-0 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="font-medium">Último entrenamiento: Ayer, 18:30</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Peso Actual</p>
                      <h3 className="text-3xl font-bold text-gray-800">{userProgress.weight} kg</h3>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Progreso hacia el objetivo</span>
                      <span className="text-sm font-medium text-blue-600">80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Objetivo: {userProgress.goalWeight} kg</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Días Activos</p>
                      <h3 className="text-3xl font-bold text-gray-800">{userProgress.daysActive}</h3>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Constancia semanal</span>
                      <span className="text-sm font-medium text-green-600">4/5</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      {[0, 1, 2, 3, 4, 6].map((day, index) => (
                        <div 
                          key={index} 
                          className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-medium ${
                            index < 4 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Entrenamientos</p>
                      <h3 className="text-3xl font-bold text-gray-800">{userProgress.workoutsCompleted}</h3>
                    </div>
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Completados esta semana</span>
                      <span className="text-sm font-medium text-indigo-600">3</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div className="bg-indigo-100 p-2 rounded text-center">
                        <span className="text-xs text-indigo-800">Fuerza</span>
                        <div className="text-sm font-medium text-indigo-600">2</div>
                      </div>
                      <div className="bg-indigo-100 p-2 rounded text-center">
                        <span className="text-xs text-indigo-800">Cardio</span>
                        <div className="text-sm font-medium text-indigo-600">1</div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <span className="text-xs text-gray-600">Flex</span>
                        <div className="text-sm font-medium text-gray-500">0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl shadow-sm flex items-center mb-8">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-800 font-medium">Próximo Entrenamiento</p>
                  <p className="text-sm text-blue-600">Hoy, 18:30 - Entrenamiento de Fuerza con Alex Romero</p>
                </div>
                <button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                  Ver Detalles
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Logros y Medallas</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                  {[
                    { name: "Primera Semana", icon: "🏅", unlocked: true },
                    { name: "10 Entrenamientos", icon: "🏆", unlocked: true },
                    { name: "5kg Perdidos", icon: "⚡", unlocked: true },
                    { name: "Primer Mes", icon: "🔥", unlocked: true },
                    { name: "Experto en Cardio", icon: "🏃", unlocked: true },
                    { name: "Maestro Nutritivo", icon: "🥗", unlocked: true },
                    { name: "Fuerza Suprema", icon: "💪", unlocked: true },
                    { name: "3 Meses Constantes", icon: "📅", unlocked: false },
                    { name: "25 Entrenamientos", icon: "🎯", unlocked: false },
                    { name: "10kg Meta", icon: "⭐", unlocked: false },
                    { name: "Flexibilidad Total", icon: "🧘", unlocked: false }
                  ].map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                        achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-yellow-100' : 'bg-gray-100'
                      }`}
                    >
                      <div className={`text-3xl mb-1 ${!achievement.unlocked && 'opacity-40 grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <span className={`text-xs text-center font-medium ${
                        achievement.unlocked ? 'text-yellow-800' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Programas Destacados Slider */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Programas Destacados</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Diseñados por expertos para maximizar tus resultados y transformar tu cuerpo en tiempo récord.
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div 
              ref={sliderRef}
              className="overflow-hidden"
            >
              <div className="flex">
                {featuredPrograms.map((program, index) => (
                  <div 
                    key={program.id}
                    className="w-full flex-shrink-0"
                  >
                    <div className="p-4">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/2">
                          <img 
                            src={program.image} 
                            alt={program.title} 
                            className="w-full h-64 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-gray-800">{program.title}</h3>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                              {program.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-6">{program.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="text-sm text-gray-500">Duración</span>
                              <p className="font-semibold text-gray-800">{program.duration}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="text-sm text-gray-500">Categoría</span>
                              <p className="font-semibold text-gray-800 capitalize">{program.category}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="text-sm text-gray-500">Entrenador</span>
                              <p className="font-semibold text-gray-800">{getTrainerById(program.trainerId)?.name}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="text-sm text-gray-500">Precio</span>
                              <p className="font-semibold text-gray-800">${program.price}</p>
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                              Más Información
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={prevSlide} 
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextSlide} 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="flex justify-center mt-6 space-x-2">
              {featuredPrograms.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    if (sliderRef.current) {
                      const slideWidth = sliderRef.current.offsetWidth;
                      sliderRef.current.scrollTo({
                        left: index * slideWidth,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Programas Section */}
      <section id="programas" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestros Programas</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Encuentra el programa perfecto para ti y tus objetivos, todos diseñados por profesionales del fitness.
            </p>
          </div>
          
          {/* Filtros */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100 p-1 rounded-full">
              {(['todos', 'fuerza', 'cardio', 'flexibilidad', 'nutricion'] as TrainerCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category === 'todos' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Grid de programas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPrograms.map((program) => (
              <motion.div 
                key={program.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover"
                  />
                  {program.bestSeller && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
                      BESTSELLER
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">${program.price}</span>
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {program.duration}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{program.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      program.difficulty === 'Principiante' ? 'bg-green-100 text-green-800' :
                      program.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {program.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
                  
                  <div className="flex items-center mb-4">
                    {getTrainerById(program.trainerId) && (
                      <>
                        <img 
                          src={getTrainerById(program.trainerId)?.image} 
                          alt={getTrainerById(program.trainerId)?.name} 
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                        <span className="text-sm text-gray-700">
                          {getTrainerById(program.trainerId)?.name}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors text-sm">
                    Ver Programa
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Entrenadores Section */}
      <section id="entrenadores" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestros Entrenadores</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Profesionales certificados con años de experiencia, listos para ayudarte a alcanzar tus metas fitness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {trainers.map((trainer) => (
              <motion.div 
                key={trainer.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="h-64 relative">
                  <img 
                    src={trainer.image} 
                    alt={trainer.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                    trainer.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {trainer.available ? 'Disponible' : 'No disponible'}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{trainer.name}</h3>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600 ml-1">{trainer.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize mb-1">
                      {trainer.specialty}
                    </span>
                    <span className="inline-block text-gray-600 text-xs ml-2">
                      {trainer.experience} de experiencia
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{trainer.description}</p>
                  
                  <button 
                    className={`w-full py-2 rounded transition-colors text-sm ${
                      trainer.available 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!trainer.available}
                  >
                    {trainer.available ? 'Agendar Sesión' : 'No Disponible'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonios y Contacto */}
      <section id="contacto" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Testimonios</h2>
              
              <div className="space-y-6">
                {[
                  {
                    name: "Carlos Mendoza",
                    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
                    text: "Increíble experiencia. Perdí 12kg en 3 meses con el programa Total Body Transformation. El entrenamiento personalizado y la atención constante marcaron la diferencia.",
                    program: "Total Body Transformation"
                  },
                  {
                    name: "Laura Sánchez",
                    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                    text: "Los entrenadores son excelentes profesionales. El programa HIIT Revolution superó mis expectativas. Mejoré mi resistencia cardiovascular y tonifiqué todo mi cuerpo.",
                    program: "HIIT Revolution"
                  },
                  {
                    name: "Miguel Torres",
                    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    text: "Después de años lidiando con dolor de espalda, el programa Flexibility Master me ayudó a recuperar movilidad y eliminar las molestias. Excelente seguimiento.",
                    program: "Flexibility Master"
                  }
                ].map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gray-50 p-6 rounded-xl shadow-sm"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{testimonial.name}</h4>
                        <p className="text-sm text-blue-600">{testimonial.program}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">"{testimonial.text}"</p>
                    <div className="mt-3 flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Contacto</h2>
              
              <div className="bg-blue-50 p-6 rounded-xl shadow-sm mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Consulta gratuita</h3>
                    <p className="text-sm text-gray-600">Habla con uno de nuestros expertos y obtén un plan personalizado.</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email-fitness">Email</label>
                    <input 
                      type="email" 
                      id="email-fitness"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu número de teléfono"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tu objetivo principal</label>
                  <select 
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="perder-peso">Perder peso</option>
                    <option value="ganar-musculo">Ganar músculo</option>
                    <option value="mejorar-resistencia">Mejorar resistencia</option>
                    <option value="aumentar-flexibilidad">Aumentar flexibilidad</option>
                    <option value="nutricion">Mejorar alimentación</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cuéntanos un poco más sobre tus objetivos fitness..."
                  ></textarea>
                </div>
                
                <motion.button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Solicitar Información
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Fitness<span className="text-blue-400">Pro</span></h3>
              <p className="text-gray-400 mb-4">
                Transformando vidas a través del fitness personalizado y programas de entrenamiento de calidad.
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#programas" className="text-gray-400 hover:text-white transition-colors">Programas</a></li>
                <li><a href="#entrenadores" className="text-gray-400 hover:text-white transition-colors">Entrenadores</a></li>
                <li><a href="#contacto" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Programas</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Entrenamiento de Fuerza</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cardio HIIT</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Yoga y Flexibilidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Nutrición y Dieta</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Fitness para Principiantes</a></li>
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
                  <span className="text-gray-400">
                    Av. Fitness 123, Ciudad Deportiva
                  </span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">
                    info@fitnesspro.com
                  </span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">
                    +1 234 567 890
                  </span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-400">
                    Lun-Vie: 6:00 - 22:00<br />
                    Sáb-Dom: 8:00 - 20:00
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 FitnessPro. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Términos y Condiciones</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}