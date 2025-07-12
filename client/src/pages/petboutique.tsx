import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Tipos y interfaces
type ProductCategory = 'todos' | 'alimentos' | 'accesorios' | 'juguetes' | 'higiene';
type PetType = 'todos' | 'perros' | 'gatos' | 'aves' | 'peces' | 'pequeños';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: ProductCategory;
  petType: PetType;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  tags: string[];
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

interface ServiceType {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: string;
}

interface Review {
  id: number;
  userId: number;
  userName: string;
  userImage: string;
  productId: number;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

interface PetProfile {
  id: number;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  weight: number;
  allergies: string[];
  specialNeeds: string[];
  photo: string;
  birthday?: string;
}

interface ComparisonItem {
  productId: number;
  product: Product | null;
}

interface AdoptionPet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  description: string;
  image: string;
  gallery: string[];
  vaccinated: boolean;
  neutered: boolean;
  goodWith: string[];
  needs: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
}

export default function PetBoutique() {
  // Estados
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');
  const [activePetType, setActivePetType] = useState<PetType>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  
  // Estados para nuevas funcionalidades
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showNeedsCalculator, setShowNeedsCalculator] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showAdoptionSection, setShowAdoptionSection] = useState(false);
  const [myPets, setMyPets] = useState<PetProfile[]>([]);
  const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null);
  const [calculatorPetType, setCalculatorPetType] = useState<PetType>('perros');
  const [calculatorPetAge, setCalculatorPetAge] = useState<number>(1);
  const [calculatorPetWeight, setCalculatorPetWeight] = useState<number>(5);
  const [calculatorPetActivityLevel, setCalculatorPetActivityLevel] = useState<'bajo' | 'medio' | 'alto'>('medio');
  const [calculatorResults, setCalculatorResults] = useState<null | {
    foodDaily: number;
    foodMonthly: number;
    waterDaily: number;
    exerciseDaily: number;
    groomingFrequency: string;
    vetChecksYearly: number;
    recommendedProducts: number[];
  }>(null);
  const [adoptionPets, setAdoptionPets] = useState<AdoptionPet[]>([]);
  const [selectedAdoptionPet, setSelectedAdoptionPet] = useState<AdoptionPet | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(150);
  const [productReviews, setProductReviews] = useState<Review[]>([]);

  // Efecto para scroll al cargar e inicializar datos
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Inicializar datos de mascotas para perfil
    setMyPets([
      {
        id: 1,
        name: "Max",
        type: "perros",
        breed: "Labrador",
        age: 3,
        weight: 25,
        allergies: ["Pollo"],
        specialNeeds: [],
        photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        birthday: "15-04-2022"
      },
      {
        id: 2,
        name: "Luna",
        type: "gatos",
        breed: "Siamés",
        age: 2,
        weight: 4,
        allergies: [],
        specialNeeds: ["Dieta especial para control urinario"],
        photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        birthday: "03-08-2023"
      }
    ]);
    
    // Inicializar datos de reseñas
    setProductReviews([
      {
        id: 1,
        userId: 101,
        userName: "María García",
        userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        productId: 1,
        rating: 5,
        text: "Excelente calidad de pienso. Mi perro lo adora y su pelaje luce mucho más brillante desde que empezamos a usarlo. Totalmente recomendable.",
        date: "10 Abril, 2025",
        verified: true,
        helpful: 24
      },
      {
        id: 2,
        userId: 102,
        userName: "Carlos Rodríguez",
        userImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        productId: 1,
        rating: 4,
        text: "Buena relación calidad-precio. Mi perro lo digiere muy bien y tiene menos problemas estomacales. Lo único que mejoraría es el empaquetado.",
        date: "5 Abril, 2025",
        verified: true,
        helpful: 15,
        images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"]
      },
      {
        id: 3,
        userId: 103,
        userName: "Ana Martínez",
        userImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        productId: 9,
        rating: 5,
        text: "La cama ortopédica ha sido un cambio radical para mi perro mayor. Ahora duerme mucho mejor y se levanta con menos problemas en las articulaciones.",
        date: "12 Abril, 2025",
        verified: true,
        helpful: 32
      }
    ]);
    
    // Inicializar datos de adopción
    setAdoptionPets([
      {
        id: 1,
        name: "Rocky",
        type: "perro",
        breed: "Mestizo",
        age: "2 años",
        gender: "male",
        size: "medium",
        description: "Rocky es un perro muy cariñoso y juguetón que busca una familia que le dé mucho amor. Es sociable con otros perros y niños. Está completamente vacunado y desparasitado.",
        image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        vaccinated: true,
        neutered: true,
        goodWith: ["perros", "niños", "personas mayores"],
        needs: ["espacio para jugar", "paseos diarios"],
        contactName: "Fundación Huella Animal",
        contactPhone: "+34 612 345 678",
        contactEmail: "adopciones@huellaanimal.org",
        location: "Madrid"
      },
      {
        id: 2,
        name: "Mía",
        type: "gato",
        breed: "Europeo común",
        age: "1 año",
        gender: "female",
        size: "small",
        description: "Mía es una gatita muy dulce y tranquila. Le encanta jugar con juguetes de plumas y dormir al sol. Busca un hogar tranquilo donde pueda sentirse segura.",
        image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        vaccinated: true,
        neutered: true,
        goodWith: ["gatos", "adultos", "ambientes tranquilos"],
        needs: ["rascador", "juguetes interactivos"],
        contactName: "Refugio Felino",
        contactPhone: "+34 623 456 789",
        contactEmail: "contacto@refugiofelino.org",
        location: "Barcelona"
      },
      {
        id: 3,
        name: "Thor",
        type: "perro",
        breed: "Pastor Alemán",
        age: "3 años",
        gender: "male",
        size: "large",
        description: "Thor es un perro muy inteligente y protector. Ha sido entrenado básicamente y aprende comandos rápidamente. Necesita una familia activa que le proporcione ejercicio diario.",
        image: "https://images.unsplash.com/photo-1553882809-a4f57e59501d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1553882809-a4f57e59501d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1589941013454-ec7d8f92b5a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        vaccinated: true,
        neutered: true,
        goodWith: ["personas activas", "casas con jardín"],
        needs: ["mucho ejercicio", "estimulación mental"],
        contactName: "Protectora Canina",
        contactPhone: "+34 634 567 890",
        contactEmail: "adopciones@protectoracanina.org",
        location: "Valencia"
      }
    ]);
  }, []);

  // Función para mostrar notificaciones
  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Función para añadir al carrito
  const addToCart = (productId: number) => {
    if (!cartItems.includes(productId)) {
      setCartItems([...cartItems, productId]);
      showNotificationMessage('Producto añadido al carrito');
    } else {
      showNotificationMessage('Este producto ya está en tu carrito');
    }
  };

  // Servicios
  const services: ServiceType[] = [
    {
      id: 1,
      name: "Peluquería Canina",
      description: "Servicio profesional de estética para tu mascota, incluye baño, corte y peinado según la raza.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
      price: "Desde 25€"
    },
    {
      id: 2,
      name: "Veterinaria",
      description: "Consultas veterinarias, vacunaciones, desparasitaciones y revisiones generales para garantizar la salud de tu mascota.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 5.5L18 7l1.5 1.5a11 11 0 01-5.754 9.574m-3.736 0a11.05 11.05 0 01-5.76-5.8m5.76 5.8l3.736-.104M12 18.75A2.25 2.25 0 0114.25 21h1.5a2.25 2.25 0 002.25-2.25v-.938c0-1.036.84-1.875 1.875-1.875a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75A1.875 1.875 0 0118 9.062V8.25A2.25 2.25 0 0015.75 6h-1.5A2.25 2.25 0 0012 8.25v10.5z" />
        </svg>
      ),
      price: "Desde 40€"
    },
    {
      id: 3,
      name: "Guardería",
      description: "Cuidamos de tu mascota cuando no puedas, ofreciendo un ambiente seguro, cómodo y lleno de actividades.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      price: "20€/día"
    },
    {
      id: 4,
      name: "Adiestramiento",
      description: "Servicio profesional de entrenamiento canino para mejorar el comportamiento y la obediencia de tu perro.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
      ),
      price: "Desde 35€/sesión"
    }
  ];

  // Productos
  const products: Product[] = [
    {
      id: 1,
      name: "Pienso Premium Razas Medianas",
      description: "Alimento completo y equilibrado para perros adultos de razas medianas. Fórmula con ingredientes naturales y sin colorantes artificiales.",
      price: 39.99,
      discountPrice: 34.99,
      category: "alimentos",
      petType: "perros",
      image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 124,
      isNew: false,
      isBestSeller: true,
      inStock: true,
      tags: ["natural", "sin cereales", "proteína alta"]
    },
    {
      id: 2,
      name: "Collar Ajustable Reflectante",
      description: "Collar duradero con material reflectante para mayor seguridad en paseos nocturnos. Ajustable para diferentes tamaños de cuello.",
      price: 15.99,
      category: "accesorios",
      petType: "perros",
      image: "https://images.unsplash.com/photo-1583337426008-2fef51aa872e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviewCount: 89,
      isNew: true,
      isBestSeller: false,
      inStock: true,
      tags: ["seguridad", "resistente", "ajustable"]
    },
    {
      id: 3,
      name: "Juguete Interactivo Dispensador",
      description: "Juguete dispensador de premios que estimula la inteligencia de tu mascota. Ideal para mantenerlos entretenidos y activos.",
      price: 18.50,
      category: "juguetes",
      petType: "perros",
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewCount: 76,
      isNew: false,
      isBestSeller: false,
      inStock: true,
      tags: ["interactivo", "estimulación mental", "dispensador"]
    },
    {
      id: 4,
      name: "Arena Aglomerante Premium",
      description: "Arena para gatos de alta calidad con poder aglomerante superior. Control de olores y fácil limpieza garantizada.",
      price: 12.99,
      category: "higiene",
      petType: "gatos",
      image: "https://images.unsplash.com/photo-1516750039246-57cb1628a475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewCount: 213,
      isNew: false,
      isBestSeller: true,
      inStock: true,
      tags: ["control de olor", "aglomerante", "fácil limpieza"]
    },
    {
      id: 5,
      name: "Rascador Torre con Juguetes",
      description: "Torre rascador para gatos con plataformas, escondites y juguetes integrados. Perfecto para trepar, jugar y descansar.",
      price: 59.99,
      discountPrice: 49.99,
      category: "accesorios",
      petType: "gatos",
      image: "https://images.unsplash.com/photo-1540948602843-1b4da2a7165f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewCount: 58,
      isNew: true,
      isBestSeller: false,
      inStock: true,
      tags: ["multinivel", "juguetes integrados", "descanso"]
    },
    {
      id: 6,
      name: "Pack de Juguetes para Gatos",
      description: "Set de 5 juguetes variados para gatos incluyendo ratones, plumas y pelotas. Estimulan el instinto de caza y proporcionan ejercicio.",
      price: 14.99,
      category: "juguetes",
      petType: "gatos",
      image: "https://images.unsplash.com/photo-1526336179256-1347bdb255ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      reviewCount: 42,
      isNew: false,
      isBestSeller: false,
      inStock: true,
      tags: ["set variado", "catnip", "plumas"]
    },
    {
      id: 7,
      name: "Jaula Premium para Aves",
      description: "Espaciosa jaula para aves con múltiples perchas, comederos y juguetes. Diseño elegante que se adapta a cualquier decoración.",
      price: 79.99,
      category: "accesorios",
      petType: "aves",
      image: "https://images.unsplash.com/photo-1591198936750-16d8e15edc9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 32,
      isNew: false,
      isBestSeller: false,
      inStock: true,
      tags: ["espaciosa", "múltiples perchas", "fácil limpieza"]
    },
    {
      id: 8,
      name: "Alimento Completo para Peces",
      description: "Alimento balanceado en escamas para todo tipo de peces tropicales. Enriquecido con vitaminas para colores vibrantes y salud óptima.",
      price: 8.99,
      category: "alimentos",
      petType: "peces",
      image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviewCount: 87,
      isNew: false,
      isBestSeller: true,
      inStock: true,
      tags: ["vitaminas", "colores vibrantes", "peces tropicales"]
    },
    {
      id: 9,
      name: "Cama Ortopédica para Perros Mayores",
      description: "Cama ortopédica con espuma viscoelástica que alivia la presión en articulaciones y mejora el descanso de perros mayores o con problemas articulares.",
      price: 69.99,
      discountPrice: 59.99,
      category: "accesorios",
      petType: "perros",
      image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewCount: 156,
      isNew: false,
      isBestSeller: true,
      inStock: true,
      tags: ["ortopédica", "viscoelástica", "articulaciones"]
    },
    {
      id: 10,
      name: "Transportín Plegable de Viaje",
      description: "Transportín plegable ligero y resistente. Ideal para viajes y visitas al veterinario. Ventilación óptima y cierre seguro.",
      price: 45.99,
      category: "accesorios",
      petType: "perros",
      image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewCount: 68,
      isNew: true,
      isBestSeller: false,
      inStock: false,
      tags: ["plegable", "ligero", "viaje"]
    },
    {
      id: 11,
      name: "Champú Hipoalergénico",
      description: "Champú suave formulado específicamente para mascotas con piel sensible. Sin jabón, parabenos ni colorantes artificiales.",
      price: 13.99,
      category: "higiene",
      petType: "perros",
      image: "https://images.unsplash.com/photo-1603189343302-e603f7add05f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewCount: 94,
      isNew: false,
      isBestSeller: false,
      inStock: true,
      tags: ["hipoalergénico", "piel sensible", "natural"]
    },
    {
      id: 12,
      name: "Hábitat Completo para Hámster",
      description: "Jaula espaciosa para hámster con múltiples niveles, túneles, rueda de ejercicio y accesorios. Todo lo que tu pequeña mascota necesita.",
      price: 49.99,
      category: "accesorios",
      petType: "pequeños",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewCount: 47,
      isNew: false,
      isBestSeller: false,
      inStock: true,
      tags: ["multinivel", "túneles", "ejercicio"]
    }
  ];

  // Posts del blog
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 consejos para mantener a tu perro saludable",
      excerpt: "Descubre consejos prácticos para cuidar la salud de tu perro, desde la alimentación hasta el ejercicio diario.",
      date: "14 Abril, 2025",
      author: "Dr. Carlos Martínez",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Salud"
    },
    {
      id: 2,
      title: "Guía para elegir el alimento adecuado para tu gato",
      excerpt: "Aprende a identificar cuál es el mejor alimento según la edad, raza y condición de salud de tu felino.",
      date: "10 Abril, 2025",
      author: "Laura Sánchez",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Nutrición"
    },
    {
      id: 3,
      title: "Cómo adiestrar a tu cachorro en 5 pasos",
      excerpt: "Una guía simple pero efectiva para comenzar el adiestramiento básico de tu nuevo cachorro.",
      date: "5 Abril, 2025",
      author: "Miguel Rodríguez",
      image: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Adiestramiento"
    }
  ];

  // Filtrar productos según categoría y tipo de mascota
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
    const matchesPetType = activePetType === 'todos' || product.petType === activePetType;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesPetType && matchesSearch;
  });

  // Productos destacados
  const featuredProducts = products.filter(product => product.isBestSeller);

  // Productos nuevos
  const newProducts = products.filter(product => product.isNew);

  // Función para renderizar estrellas de valoración
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

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  // Función para el comparador de productos
  const addToComparison = (productId: number) => {
    // Verificar si ya tenemos 3 productos en comparación
    if (comparisonItems.length >= 3 && !comparisonItems.some(item => item.productId === productId)) {
      showNotificationMessage('Solo puedes comparar hasta 3 productos. Elimina uno para añadir otro.');
      return;
    }
    
    // Verificar si el producto ya está en la comparación
    if (comparisonItems.some(item => item.productId === productId)) {
      setComparisonItems(comparisonItems.filter(item => item.productId !== productId));
      showNotificationMessage('Producto eliminado de la comparación');
    } else {
      const product = products.find(p => p.id === productId) || null;
      setComparisonItems([...comparisonItems, { productId, product }]);
      showNotificationMessage('Producto añadido a la comparación');
    }
  };
  
  // Función para eliminar un producto de la comparación
  const removeFromComparison = (productId: number) => {
    setComparisonItems(comparisonItems.filter(item => item.productId !== productId));
  };
  
  // Función para calcular necesidades de mascota
  const calculateNeeds = () => {
    const results = {
      foodDaily: 0,
      foodMonthly: 0,
      waterDaily: 0,
      exerciseDaily: 0,
      groomingFrequency: '',
      vetChecksYearly: 2,
      recommendedProducts: [] as number[]
    };
    
    // Calcular necesidades en base al tipo de mascota, edad y peso
    if (calculatorPetType === 'perros') {
      // Alimento diario en gramos (aproximado)
      results.foodDaily = Math.round(calculatorPetWeight * 20 * (calculatorPetAge < 1 ? 1.5 : calculatorPetAge > 7 ? 0.8 : 1));
      
      // Agua diaria en ml
      results.waterDaily = Math.round(calculatorPetWeight * 60);
      
      // Ejercicio diario en minutos
      switch(calculatorPetActivityLevel) {
        case 'bajo':
          results.exerciseDaily = 30;
          break;
        case 'medio':
          results.exerciseDaily = 60;
          break;
        case 'alto':
          results.exerciseDaily = 90;
          break;
      }
      
      // Frecuencia de aseo
      results.groomingFrequency = calculatorPetActivityLevel === 'alto' ? 'Semanal' : 'Quincenal';
      
      // Productos recomendados (IDs)
      if (calculatorPetAge < 1) {
        results.recommendedProducts = [1, 3, 9]; // Alimento premium, juguete, cama
      } else if (calculatorPetAge > 7) {
        results.recommendedProducts = [1, 9, 11]; // Alimento premium, cama ortopédica, champú
      } else {
        results.recommendedProducts = [1, 2, 3]; // Alimento, collar, juguete
      }
    } else if (calculatorPetType === 'gatos') {
      // Alimento diario en gramos
      results.foodDaily = Math.round(calculatorPetWeight * 15 * (calculatorPetAge < 1 ? 1.3 : calculatorPetAge > 7 ? 0.9 : 1));
      
      // Agua diaria en ml
      results.waterDaily = Math.round(calculatorPetWeight * 50);
      
      // Ejercicio diario (juego) en minutos
      results.exerciseDaily = 20;
      
      // Frecuencia de aseo
      results.groomingFrequency = 'Semanal';
      
      // Productos recomendados
      results.recommendedProducts = [4, 5, 6]; // Arena, rascador, juguetes
    }
    
    // Calcular alimento mensual
    results.foodMonthly = results.foodDaily * 30 / 1000; // Convertir a kg
    
    setCalculatorResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Botón Volver a Proyectos */}
      <div className="fixed left-5 z-50" style={{ top: '80px' }}>
        <Link 
          to="/#showroom" 
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full text-white transition-colors shadow-md"
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
              <span className="text-pink-600">Pet</span>
              <span className="text-gray-800">Boutique</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent pl-10"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#productos" className="text-gray-600 hover:text-pink-600 transition-colors">Productos</a>
            <a href="#servicios" className="text-gray-600 hover:text-pink-600 transition-colors">Servicios</a>
            <a href="#blog" className="text-gray-600 hover:text-pink-600 transition-colors">Blog</a>
            <div className="relative">
              <button className="text-gray-600 hover:text-pink-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full transition-colors">
              Mi Cuenta
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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Todo lo que tu mascota necesita</h1>
              <p className="text-xl mb-8 opacity-90">
                En Pet Boutique encontrarás productos premium, servicios profesionales y el mejor asesoramiento para el cuidado de tus mascotas.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#productos" 
                  className="bg-white text-pink-600 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors shadow-lg"
                >
                  Explorar Productos
                </a>
                <a 
                  href="#servicios" 
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-pink-600 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Servicios
                </a>
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
                  src="https://images.unsplash.com/photo-1583511655826-05700442b31b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Perro feliz" 
                  className="rounded-lg w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Categorías de Mascotas */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Encuentra lo mejor para tu mascota</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selecciona el tipo de mascota para ver productos específicos
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { type: "perros", name: "Perros", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
              { type: "gatos", name: "Gatos", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
              { type: "aves", name: "Aves", image: "https://images.unsplash.com/photo-1522858547137-f1dcec554f17?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
              { type: "peces", name: "Peces", image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
              { type: "pequeños", name: "Pequeños", image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
              { type: "todos", name: "Ver Todos", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" }
            ].map((petType) => (
              <motion.div 
                key={petType.type}
                className={`${activePetType === petType.type ? 'ring-2 ring-pink-500' : ''} cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow`}
                onClick={() => setActivePetType(petType.type as PetType)}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-40">
                  <img src={petType.image} alt={petType.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <h3 className="text-white font-medium">{petType.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Productos Destacados */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Productos Destacados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestra selección de los productos más populares y mejor valorados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <motion.div 
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden h-full"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {product.discountPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                    </div>
                  )}
                  {product.isBestSeller && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-md">
                      BESTSELLER
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {product.petType.charAt(0).toUpperCase() + product.petType.slice(1)}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount})</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      {product.discountPrice ? (
                        <div>
                          <span className="font-bold text-gray-800 text-lg">{formatPrice(product.discountPrice)}</span>
                          <span className="text-gray-500 line-through ml-2 text-sm">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-800 text-lg">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => addToCart(product.id)}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-full transition-colors text-sm"
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Añadir' : 'Agotado'}
                      </button>
                      <button
                        onClick={() => addToComparison(product.id)}
                        className={`p-1 rounded-full transition-colors ${
                          comparisonItems.some(item => item.productId === product.id)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title="Añadir a comparación"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="#productos"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Ver todos los productos
            </a>
          </div>
        </div>
      </section>
      
      {/* Promoción Banner */}
      <section className="py-12 bg-pink-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center bg-white rounded-xl overflow-hidden shadow-md">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Perro con descuento" 
                className="w-full h-64 md:h-auto object-cover"
              />
            </div>
            <div className="p-6 md:p-10 md:w-1/2">
              <div className="mb-6">
                <span className="bg-pink-600 text-white text-sm font-bold px-3 py-1 rounded-full">OFERTA ESPECIAL</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">20% de descuento en tu primera compra</h2>
              <p className="text-gray-600 mb-6">
                Suscríbete a nuestro boletín y recibe un 20% de descuento en tu primera compra. Además, recibirás información sobre nuevos productos y promociones exclusivas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Servicios */}
      <section id="servicios" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestros Servicios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una variedad de servicios profesionales para el cuidado y bienestar de tu mascota
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <motion.div 
                key={service.id}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-3 bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-pink-600">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{service.price}</span>
                  <button className="text-pink-600 border border-pink-600 hover:bg-pink-600 hover:text-white px-3 py-1 rounded-full transition-colors text-sm">
                    Reservar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Productos */}
      <section id="productos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestros Productos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora nuestra selección completa de productos para mascotas
            </p>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveCategory('todos')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'todos' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                Todos
              </button>
              <button 
                onClick={() => setActiveCategory('alimentos')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'alimentos' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                Alimentos
              </button>
              <button 
                onClick={() => setActiveCategory('accesorios')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'accesorios' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                Accesorios
              </button>
              <button 
                onClick={() => setActiveCategory('juguetes')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'juguetes' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                Juguetes
              </button>
              <button 
                onClick={() => setActiveCategory('higiene')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === 'higiene' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                Higiene
              </button>
            </div>
            
            <div className="hidden md:block relative w-64">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent pl-10"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden h-full"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {product.discountPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                    </div>
                  )}
                  {product.isBestSeller && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded-md">
                      BESTSELLER
                    </div>
                  )}
                  {product.isNew && !product.isBestSeller && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      NUEVO
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {product.petType.charAt(0).toUpperCase() + product.petType.slice(1)}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount})</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      {product.discountPrice ? (
                        <div>
                          <span className="font-bold text-gray-800 text-lg">{formatPrice(product.discountPrice)}</span>
                          <span className="text-gray-500 line-through ml-2 text-sm">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-800 text-lg">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => addToCart(product.id)}
                        className={`${
                          product.inStock 
                            ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        } px-3 py-1 rounded-full transition-colors text-sm`}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Añadir' : 'Agotado'}
                      </button>
                      <button
                        onClick={() => addToComparison(product.id)}
                        className={`p-1 rounded-full transition-colors ${
                          comparisonItems.some(item => item.productId === product.id)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title="Añadir a comparación"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowReviewsModal(true)}
                        className="p-1 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full transition-colors"
                        title="Ver reseñas"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-5xl mb-4">🐾</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Prueba con otros filtros o términos de búsqueda</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Testimonial */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Lo que dicen nuestros clientes</h2>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img className="h-full w-full md:w-48 object-cover" src="https://images.unsplash.com/photo-1551730459-92db2a308d6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Cliente con su mascota" />
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  {renderStars(5)}
                </div>
                <blockquote className="italic text-gray-600 mb-4">
                  "Pet Boutique ha cambiado por completo la experiencia de compra para mi mascota. La calidad de sus productos es excepcional y el servicio de peluquería es el mejor que he encontrado. Mi perro Luna siempre sale feliz y hermosa. ¡100% recomendado!"
                </blockquote>
                <div className="font-bold text-gray-800">María Rodríguez</div>
                <div className="text-gray-500 text-sm">Dueña de Luna, Golden Retriever</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog */}
      <section id="blog" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestro Blog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Consejos, guías y novedades para el cuidado de tus mascotas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <motion.div 
                key={post.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Por {post.author}</span>
                    </div>
                    <a href="#" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                      Leer más
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button className="inline-block bg-white border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-6 py-3 rounded-full font-medium transition-colors">
              Ver todos los artículos
            </button>
          </div>
        </div>
      </section>
      
      {/* Herramientas para mascotas - Sección nueva */}
      <section className="py-16 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Herramientas para el cuidado de tu mascota</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Utiliza nuestras herramientas gratuitas para brindar el mejor cuidado a tu mascota
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calculadora de Necesidades */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-pink-100 rounded-full text-pink-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Calculadora de Necesidades</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Calcula la cantidad diaria de alimento, agua y ejercicio que necesita tu mascota según su peso, edad y nivel de actividad.
                </p>
                <button 
                  onClick={() => setShowNeedsCalculator(true)}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium"
                >
                  Calcular necesidades
                </button>
              </div>
            </div>
            
            {/* Comparador de Productos */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full text-purple-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Comparador de Productos</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Compara hasta 3 productos para tomar la mejor decisión de compra según las características, precio y valoraciones.
                </p>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setShowComparisonModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium"
                    disabled={comparisonItems.length === 0}
                  >
                    {comparisonItems.length === 0 ? 'Sin productos seleccionados' : 'Comparar productos'}
                  </button>
                  
                  <div className="flex items-center">
                    <span className="text-gray-600 text-sm mr-2">{comparisonItems.length}/3</span>
                    {comparisonItems.length > 0 && (
                      <span className="flex h-6 w-6 items-center justify-center bg-purple-100 text-purple-600 rounded-full text-xs font-bold">
                        {comparisonItems.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Programa de Adopción */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Programa de Adopción</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Conoce a las mascotas que están buscando un hogar permanente. Trabajamos con refugios y protectoras locales.
                </p>
                <button 
                  onClick={() => setShowAdoptionSection(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium"
                >
                  Ver mascotas en adopción
                </button>
              </div>
            </div>
            
            {/* Programa de Fidelidad */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Programa de Fidelidad</h3>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    Acumula puntos con cada compra y canjéalos por descuentos, productos o servicios.
                  </p>
                  <div className="bg-yellow-50 px-3 py-2 rounded-lg">
                    <span className="text-yellow-700 font-bold">{loyaltyPoints} pts</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${Math.min(100, (loyaltyPoints/500)*100)}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>0 pts</span>
                  <span>250 pts</span>
                  <span>500 pts</span>
                </div>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium">
                  Ver recompensas disponibles
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mantente informado</h2>
            <p className="text-gray-600 mb-8">
              Suscríbete a nuestro boletín para recibir consejos, novedades y promociones exclusivas
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modales */}
      
      {/* Modal de Calculadora de Necesidades */}
      {showNeedsCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Calculadora de Necesidades</h2>
                <button 
                  onClick={() => setShowNeedsCalculator(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {!calculatorResults ? (
                <div>
                  <p className="text-gray-600 mb-6">
                    Introduce los datos de tu mascota para calcular sus necesidades diarias de alimentación, hidratación y ejercicio.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de mascota</label>
                      <div className="flex gap-4 flex-wrap">
                        {['perros', 'gatos'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setCalculatorPetType(type as PetType)}
                            className={`px-4 py-2 rounded-full text-sm ${
                              calculatorPetType === type
                                ? 'bg-pink-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } transition-colors`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Edad (años)
                        </label>
                        <input
                          type="number"
                          min={0.1}
                          max={20}
                          step={0.1}
                          value={calculatorPetAge}
                          onChange={(e) => setCalculatorPetAge(parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          min={0.1}
                          max={100}
                          step={0.1}
                          value={calculatorPetWeight}
                          onChange={(e) => setCalculatorPetWeight(parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de actividad</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'bajo', label: 'Bajo', desc: 'Paseos cortos, mayor tiempo de descanso' },
                          { id: 'medio', label: 'Medio', desc: 'Actividad moderada, juego habitual' },
                          { id: 'alto', label: 'Alto', desc: 'Muy activo, ejercicio intenso frecuente' }
                        ].map((level) => (
                          <div
                            key={level.id}
                            onClick={() => setCalculatorPetActivityLevel(level.id as 'bajo' | 'medio' | 'alto')}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              calculatorPetActivityLevel === level.id
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-pink-200'
                            }`}
                          >
                            <h4 className="font-medium mb-1">{level.label}</h4>
                            <p className="text-xs text-gray-500">{level.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={calculateNeeds}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                      >
                        Calcular
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-pink-50 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-lg text-pink-800 mb-2">Resultados para tu {calculatorPetType === 'perros' ? 'perro' : 'gato'}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-pink-700">
                      <span className="bg-white rounded-full px-3 py-1">{calculatorPetAge} años</span>
                      <span className="bg-white rounded-full px-3 py-1">{calculatorPetWeight} kg</span>
                      <span className="bg-white rounded-full px-3 py-1">Actividad {calculatorPetActivityLevel}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 className="font-semibold">Alimentación</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex justify-between">
                          <span>Alimento diario:</span>
                          <span className="font-semibold">{calculatorResults.foodDaily} g</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Alimento mensual:</span>
                          <span className="font-semibold">{calculatorResults.foodMonthly.toFixed(1)} kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Agua diaria:</span>
                          <span className="font-semibold">{calculatorResults.waterDaily} ml</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <h4 className="font-semibold">Actividad y Cuidados</h4>
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex justify-between">
                          <span>Ejercicio diario:</span>
                          <span className="font-semibold">{calculatorResults.exerciseDaily} min</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Aseo/Cepillado:</span>
                          <span className="font-semibold">{calculatorResults.groomingFrequency}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Revisiones veterinarias:</span>
                          <span className="font-semibold">{calculatorResults.vetChecksYearly}/año</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Productos recomendados</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {calculatorResults.recommendedProducts.map(id => {
                        const product = products.find(p => p.id === id);
                        if (!product) return null;
                        return (
                          <div key={id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="h-32 overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <h5 className="font-medium text-sm mb-1 line-clamp-1">{product.name}</h5>
                              <div className="flex justify-between items-center">
                                <span className="text-pink-600 font-semibold">
                                  {formatPrice(product.discountPrice || product.price)}
                                </span>
                                <button
                                  onClick={() => {
                                    addToCart(product.id);
                                    setShowNeedsCalculator(false);
                                  }}
                                  className="text-xs bg-pink-600 hover:bg-pink-700 text-white px-2 py-1 rounded"
                                >
                                  Añadir
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCalculatorResults(null)}
                      className="text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Recalcular
                    </button>
                    <button
                      onClick={() => setShowNeedsCalculator(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de Comparador de Productos */}
      {showComparisonModal && comparisonItems.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Comparador de Productos</h2>
                <button 
                  onClick={() => setShowComparisonModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="py-3 text-left text-gray-700 font-semibold w-1/5">Características</th>
                      {comparisonItems.map((item) => (
                        <th key={item.productId} className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <div className="relative w-20 h-20 mx-auto mb-2">
                              <img 
                                src={item.product?.image} 
                                alt={item.product?.name} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button 
                                onClick={() => removeFromComparison(item.productId)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <h3 className="font-medium text-sm text-gray-800 line-clamp-2 h-10">
                              {item.product?.name}
                            </h3>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 text-left text-gray-700 font-medium">Precio</td>
                      {comparisonItems.map((item) => (
                        <td key={`price-${item.productId}`} className="px-4 py-3 text-center">
                          {item.product?.discountPrice ? (
                            <div>
                              <span className="font-bold text-pink-600">{formatPrice(item.product.discountPrice)}</span>
                              <span className="text-gray-500 line-through ml-1 text-xs">{formatPrice(item.product.price)}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-gray-800">{formatPrice(item.product?.price || 0)}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 text-left text-gray-700 font-medium">Valoración</td>
                      {comparisonItems.map((item) => (
                        <td key={`rating-${item.productId}`} className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            {renderStars(item.product?.rating || 0)}
                          </div>
                          <span className="text-sm text-gray-600 mt-1">
                            {item.product?.rating} ({item.product?.reviewCount})
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 text-left text-gray-700 font-medium">Categoría</td>
                      {comparisonItems.map((item) => (
                        <td key={`category-${item.productId}`} className="px-4 py-3 text-center capitalize">
                          {item.product?.category}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 text-left text-gray-700 font-medium">Para</td>
                      {comparisonItems.map((item) => (
                        <td key={`petType-${item.productId}`} className="px-4 py-3 text-center capitalize">
                          {item.product?.petType}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 text-left text-gray-700 font-medium">Características</td>
                      {comparisonItems.map((item) => (
                        <td key={`tags-${item.productId}`} className="px-4 py-3 text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {item.product?.tags.map((tag, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 text-left text-gray-700 font-medium">Disponibilidad</td>
                      {comparisonItems.map((item) => (
                        <td key={`stock-${item.productId}`} className="px-4 py-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            item.product?.inStock 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.product?.inStock ? 'En stock' : 'Agotado'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 text-left text-gray-700 font-medium">Acción</td>
                      {comparisonItems.map((item) => (
                        <td key={`action-${item.productId}`} className="px-4 py-3 text-center">
                          <button
                            onClick={() => {
                              if (item.product && item.product.inStock) {
                                addToCart(item.productId);
                              }
                            }}
                            disabled={!item.product?.inStock}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.product?.inStock 
                                ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {item.product?.inStock ? 'Añadir al carrito' : 'Agotado'}
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowComparisonModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de Reseñas */}
      {showReviewsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Reseñas Verificadas</h2>
                <button 
                  onClick={() => setShowReviewsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-wrap gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Valoración general</h3>
                  <div className="ml-auto flex items-center">
                    <div className="flex mr-2">
                      {renderStars(4.7)}
                    </div>
                    <span className="text-sm font-medium text-gray-600">4.7 de 5</span>
                  </div>
                </div>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = productReviews.filter(r => Math.floor(r.rating) === rating).length;
                    const percentage = productReviews.length > 0 ? (count / productReviews.length * 100) : 0;
                    
                    return (
                      <div key={rating} className="flex items-center">
                        <div className="w-1/12 text-sm text-gray-600 font-medium">{rating} <span className="hidden sm:inline">stars</span></div>
                        <div className="w-9/12 px-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                        <div className="w-2/12 text-sm text-gray-500 text-right">{count} <span className="hidden sm:inline">reviews</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-6">
                {productReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start">
                      <img 
                        src={review.userImage} 
                        alt={review.userName} 
                        className="w-10 h-10 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                          {review.verified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                              Compra verificada
                            </span>
                          )}
                          <div className="ml-auto text-sm text-gray-500">{review.date}</div>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm font-medium text-gray-600">{review.rating}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{review.text}</p>
                        
                        {review.images && review.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {review.images.map((img, index) => (
                              <div key={index} className="w-16 h-16 rounded-md overflow-hidden">
                                <img 
                                  src={img} 
                                  alt={`Imagen de reseña ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <button className="text-gray-500 hover:text-gray-700 text-xs flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            Útil ({review.helpful})
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 text-xs ml-4">
                            Responder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">¿Ya has usado este producto?</h3>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
                  Escribir una reseña
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de Programa de Adopción */}
      {showAdoptionSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Programa de Adopción</h2>
                <button 
                  onClick={() => {
                    setShowAdoptionSection(false);
                    setSelectedAdoptionPet(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {!selectedAdoptionPet ? (
                <div>
                  <p className="text-gray-600 mb-6">
                    Estas son las mascotas disponibles para adopción. Conoce sus historias y ayúdales a encontrar un hogar.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {adoptionPets.map((pet) => (
                      <motion.div 
                        key={pet.id}
                        whileHover={{ y: -5 }}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
                        onClick={() => setSelectedAdoptionPet(pet)}
                      >
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={pet.image} 
                            alt={pet.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              pet.gender === 'male' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-pink-100 text-pink-800'
                            }`}>
                              {pet.gender === 'male' ? 'Macho' : 'Hembra'}
                            </span>
                          </div>
                          <div className="flex gap-2 mb-2">
                            <span className="text-gray-600 text-sm">{pet.breed}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600 text-sm">{pet.age}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                              {pet.size === 'small' ? 'Pequeño' : pet.size === 'medium' ? 'Mediano' : 'Grande'}
                            </span>
                            {pet.vaccinated && (
                              <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Vacunado
                              </span>
                            )}
                            {pet.neutered && (
                              <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Esterilizado
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">{pet.description}</p>
                          <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium">
                            Ver detalles
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-3">
                      <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <img 
                          src={selectedAdoptionPet.image} 
                          alt={selectedAdoptionPet.name} 
                          className="w-full h-80 object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedAdoptionPet.gallery.map((img, index) => (
                          <div key={index} className="h-20 rounded-lg overflow-hidden">
                            <img 
                              src={img} 
                              alt={`${selectedAdoptionPet.name} ${index + 1}`} 
                              className="w-full h-full object-cover cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-xl font-bold text-gray-800">{selectedAdoptionPet.name}</h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            selectedAdoptionPet.gender === 'male' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-pink-100 text-pink-800'
                          }`}>
                            {selectedAdoptionPet.gender === 'male' ? 'Macho' : 'Hembra'}
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="w-1/3 text-gray-600 text-sm">Tipo:</div>
                            <div className="w-2/3 font-medium capitalize">{selectedAdoptionPet.type}</div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1/3 text-gray-600 text-sm">Raza:</div>
                            <div className="w-2/3 font-medium">{selectedAdoptionPet.breed}</div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1/3 text-gray-600 text-sm">Edad:</div>
                            <div className="w-2/3 font-medium">{selectedAdoptionPet.age}</div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1/3 text-gray-600 text-sm">Tamaño:</div>
                            <div className="w-2/3 font-medium">
                              {selectedAdoptionPet.size === 'small' ? 'Pequeño' : 
                               selectedAdoptionPet.size === 'medium' ? 'Mediano' : 'Grande'}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-1/3 text-gray-600 text-sm">Ubicación:</div>
                            <div className="w-2/3 font-medium">{selectedAdoptionPet.location}</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium mb-2">Estado de salud</h4>
                          <div className="flex gap-2 mb-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              selectedAdoptionPet.vaccinated 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedAdoptionPet.vaccinated ? 'Vacunado' : 'Sin vacunas'}
                            </span>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              selectedAdoptionPet.neutered 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedAdoptionPet.neutered ? 'Esterilizado' : 'Sin esterilizar'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="font-medium mb-2">Contacto</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600">Nombre:</span> {selectedAdoptionPet.contactName}</p>
                            <p><span className="text-gray-600">Teléfono:</span> {selectedAdoptionPet.contactPhone}</p>
                            <p><span className="text-gray-600">Email:</span> {selectedAdoptionPet.contactEmail}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                            Solicitar información de adopción
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">Descripción</h4>
                      <p className="text-gray-600">{selectedAdoptionPet.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">Se lleva bien con</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedAdoptionPet.goodWith.map((item, index) => (
                            <span key={index} className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">Necesidades</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedAdoptionPet.needs.map((item, index) => (
                            <span key={index} className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setSelectedAdoptionPet(null)}
                      className="text-green-600 hover:text-green-700 font-medium flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Volver al listado
                    </button>
                    <button
                      onClick={() => setShowAdoptionSection(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-pink-400">Pet</span>
                <span className="text-white">Boutique</span>
              </h3>
              <p className="text-gray-400 mb-6">
                Tu tienda especializada en productos y servicios para mascotas. Calidad, variedad y asesoramiento experto.
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
              <h4 className="text-lg font-semibold mb-4">Categorías</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Alimentos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Accesorios</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Juguetes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Higiene</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Servicios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Ayuda</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mi cuenta</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Envíos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Devoluciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
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
                  <span className="text-gray-400">Calle Principal 123, Madrid, España</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">+34 912 345 678</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">info@petboutique.com</span>
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
            <p>© 2025 Pet Boutique. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}