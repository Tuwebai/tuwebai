import { Contact, Consultation, Newsletter, User, UserPreferences, DashboardStats } from '../types/admin';

// Datos de ejemplo para contactos
export const contacts: Contact[] = [
  {
    id: 1,
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    phone: '+34612345678',
    subject: 'Consulta sobre desarrollo web',
    message: 'Me gustaría obtener más información sobre sus servicios de desarrollo web para mi negocio de marketing digital.',
    createdAt: '2025-04-21T08:30:00',
    read: false
  },
  {
    id: 2,
    name: 'Laura Martínez',
    email: 'laura@example.com',
    phone: '+34623456789',
    subject: 'Solicitud de presupuesto',
    message: 'Hola, me interesa contratar vuestros servicios para desarrollar una tienda online. ¿Podríais enviarme un presupuesto detallado?',
    createdAt: '2025-04-20T15:45:00',
    read: true
  },
  {
    id: 3,
    name: 'Miguel Fernández',
    email: 'miguel@example.com',
    phone: '+34634567890',
    subject: 'Problema técnico con mi web',
    message: 'Estoy teniendo problemas con la velocidad de carga de mi sitio web. ¿Podríais echarle un vistazo para optimizarlo?',
    createdAt: '2025-04-20T10:15:00',
    read: false
  },
  {
    id: 4,
    name: 'Ana López',
    email: 'ana@example.com',
    phone: '+34645678901',
    subject: 'Colaboración en proyecto',
    message: 'Soy diseñadora UX y me gustaría explorar posibilidades de colaboración en proyectos futuros. ¿Podríamos concertar una llamada?',
    createdAt: '2025-04-19T14:20:00',
    read: true
  },
  {
    id: 5,
    name: 'Javier García',
    email: 'javier@example.com',
    phone: '+34656789012',
    subject: 'Solicitud de información',
    message: 'Me interesa saber más sobre vuestros servicios de posicionamiento SEO. ¿Qué estrategias utilizáis y cuáles son vuestras tarifas?',
    createdAt: '2025-04-18T11:10:00',
    read: false
  }
];

// Datos de ejemplo para consultas
export const consultations: Consultation[] = [
  {
    id: 1,
    name: 'Patricia González',
    email: 'patricia@example.com',
    phone: '+34667890123',
    business: 'Clínica Dental Sonrisa',
    budget: '3000-5000€',
    projectType: 'Sitio web corporativo',
    deadline: '2 meses',
    message: 'Necesitamos una web moderna para nuestra clínica dental que incluya sistema de citas online.',
    createdAt: '2025-04-21T09:45:00',
    processed: false,
    serviceDetails: ['Diseño Web', 'Desarrollo Web', 'SEO Básico'],
    sections: ['Quiénes somos', 'Servicios', 'Equipo', 'Reserva de citas', 'Contacto']
  },
  {
    id: 2,
    name: 'Roberto Sánchez',
    email: 'roberto@example.com',
    phone: '+34678901234',
    business: 'Moda RS',
    budget: '5000-10000€',
    projectType: 'Tienda online',
    deadline: '3 meses',
    message: 'Quiero crear una tienda online para mi marca de ropa con integración de pasarela de pagos y sistemas de envío.',
    createdAt: '2025-04-20T16:30:00',
    processed: true,
    serviceDetails: ['Diseño Web', 'Desarrollo E-commerce', 'Marketing Digital'],
    sections: ['Catálogo', 'Proceso de compra', 'Gestión de pedidos', 'Área de cliente']
  },
  {
    id: 3,
    name: 'Elena Torres',
    email: 'elena@example.com',
    phone: '+34689012345',
    business: 'Restaurante El Olivo',
    budget: '2000-3000€',
    projectType: 'Sitio web con reservas',
    deadline: '1 mes',
    message: 'Necesitamos un sitio web para nuestro restaurante que permita a los clientes ver el menú y hacer reservas online.',
    createdAt: '2025-04-19T12:15:00',
    processed: false,
    serviceDetails: ['Diseño Web', 'Desarrollo Web', 'Fotografía'],
    sections: ['Inicio', 'Menú', 'Reservas', 'Ubicación', 'Contacto']
  },
  {
    id: 4,
    name: 'Pablo Ruiz',
    email: 'pablo@example.com',
    phone: '+34690123456',
    business: 'Academia de Idiomas GlobalTalk',
    budget: '7000-12000€',
    projectType: 'Plataforma educativa',
    deadline: '4 meses',
    message: 'Buscamos desarrollar una plataforma web para impartir clases online, gestionar alumnos y contenidos educativos.',
    createdAt: '2025-04-18T10:30:00',
    processed: false,
    serviceDetails: ['Desarrollo Web', 'Desarrollo Backend', 'UX/UI'],
    sections: ['Dashboard', 'Aula virtual', 'Biblioteca de recursos', 'Evaluaciones', 'Perfil de alumno']
  }
];

// Datos de ejemplo para newsletter
export const newsletters: Newsletter[] = [
  {
    id: 1,
    email: 'maria@example.com',
    name: 'María Gómez',
    source: 'Homepage',
    active: true,
    createdAt: '2025-04-21T14:20:00'
  },
  {
    id: 2,
    email: 'pedro@example.com',
    name: 'Pedro López',
    source: 'Blog',
    active: true,
    createdAt: '2025-04-20T11:35:00'
  },
  {
    id: 3,
    email: 'sara@example.com',
    name: 'Sara Martín',
    source: 'Recursos',
    active: false,
    createdAt: '2025-04-18T09:50:00'
  },
  {
    id: 4,
    email: 'alejandro@example.com',
    source: 'Footer',
    active: true,
    createdAt: '2025-04-17T16:25:00'
  },
  {
    id: 5,
    email: 'lucia@example.com',
    name: 'Lucía Fernández',
    source: 'Popup',
    active: true,
    createdAt: '2025-04-16T13:40:00'
  }
];

// Datos de ejemplo para usuarios
export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@tuwebai.com',
    fullName: 'Administrador',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Administrador&background=0D8ABC&color=fff',
    createdAt: '2025-01-01T00:00:00',
    lastLogin: '2025-04-21T08:00:00',
    isVerified: true
  },
  {
    id: 2,
    username: 'juanperez',
    email: 'juan@example.com',
    fullName: 'Juan Pérez',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=0D8ABC&color=fff',
    createdAt: '2025-03-15T14:30:00',
    lastLogin: '2025-04-20T17:15:00',
    isVerified: true
  },
  {
    id: 3,
    username: 'carmeng',
    email: 'carmen@example.com',
    fullName: 'Carmen González',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Carmen+Gonzalez&background=0D8ABC&color=fff',
    createdAt: '2025-03-18T11:20:00',
    lastLogin: '2025-04-19T10:45:00',
    isVerified: true
  },
  {
    id: 4,
    username: 'davidr',
    email: 'david@example.com',
    fullName: 'David Rodríguez',
    role: 'user',
    createdAt: '2025-04-05T09:10:00',
    isVerified: false
  }
];

// Datos de ejemplo para preferencias de usuarios
export const userPreferences: UserPreferences[] = [
  {
    id: 1,
    userId: 1,
    darkMode: true,
    emailNotifications: true,
    language: 'es',
    newsletter: true
  },
  {
    id: 2,
    userId: 2,
    darkMode: false,
    emailNotifications: true,
    language: 'es',
    newsletter: false
  },
  {
    id: 3,
    userId: 3,
    darkMode: true,
    emailNotifications: false,
    language: 'es',
    newsletter: true
  }
];

// Datos de ejemplo para el dashboard
export const dashboardStats: DashboardStats = {
  totalUsers: 143,
  totalContacts: 87,
  totalConsultations: 64,
  totalNewsletterSubscribers: 256,
  activeNewsletterSubscribers: 231,
  resourceDownloads: 1243,
  recentContacts: contacts.slice(0, 3),
  recentConsultations: consultations.slice(0, 3),
  contactsPerDay: [
    { date: '2025-04-15', count: 5 },
    { date: '2025-04-16', count: 8 },
    { date: '2025-04-17', count: 6 },
    { date: '2025-04-18', count: 9 },
    { date: '2025-04-19', count: 7 },
    { date: '2025-04-20', count: 10 },
    { date: '2025-04-21', count: 8 }
  ],
  consultationsPerDay: [
    { date: '2025-04-15', count: 3 },
    { date: '2025-04-16', count: 4 },
    { date: '2025-04-17', count: 2 },
    { date: '2025-04-18', count: 5 },
    { date: '2025-04-19', count: 4 },
    { date: '2025-04-20', count: 3 },
    { date: '2025-04-21', count: 6 }
  ]
};