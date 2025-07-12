import { Technology } from '../types/technologies';

export const technologies: Technology[] = [
  // Frontend
  {
    id: 1,
    name: 'React',
    description: 'Biblioteca JavaScript para construir interfaces de usuario',
    category: 'Frontend',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
    website: 'https://reactjs.org/',
    popularity: 95,
    expertise: 90,
    featured: true
  },
  {
    id: 2,
    name: 'Vue.js',
    description: 'Framework progresivo para construir interfaces de usuario',
    category: 'Frontend',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png',
    website: 'https://vuejs.org/',
    popularity: 85,
    expertise: 85,
    featured: true
  },
  {
    id: 3,
    name: 'Angular',
    description: 'Plataforma para construir aplicaciones web móviles y de escritorio',
    category: 'Frontend',
    logo: 'https://angular.io/assets/images/logos/angular/angular.svg',
    website: 'https://angular.io/',
    popularity: 80,
    expertise: 80,
    featured: false
  },
  {
    id: 4,
    name: 'Svelte',
    description: 'Framework que compila a JavaScript puro en tiempo de construcción',
    category: 'Frontend',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png',
    website: 'https://svelte.dev/',
    popularity: 70,
    expertise: 75,
    featured: false
  },
  {
    id: 5,
    name: 'Next.js',
    description: 'Framework React que permite renderizado del lado del servidor',
    category: 'Frontend',
    logo: 'https://seeklogo.com/images/N/next-js-logo-8FCFF51DD2-seeklogo.com.png',
    website: 'https://nextjs.org/',
    popularity: 90,
    expertise: 90,
    featured: true
  },
  {
    id: 6,
    name: 'Tailwind CSS',
    description: 'Framework CSS utilitario para construir diseños personalizados',
    category: 'Frontend',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1200px-Tailwind_CSS_Logo.svg.png',
    website: 'https://tailwindcss.com/',
    popularity: 92,
    expertise: 95,
    featured: true
  },
  {
    id: 7,
    name: 'TypeScript',
    description: 'Superconjunto tipado de JavaScript que se compila a JavaScript plano',
    category: 'Frontend',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png',
    website: 'https://www.typescriptlang.org/',
    popularity: 94,
    expertise: 90,
    featured: true
  },
  
  // Backend
  {
    id: 8,
    name: 'Node.js',
    description: 'Entorno de ejecución de JavaScript del lado del servidor',
    category: 'Backend',
    logo: 'https://nodejs.org/static/images/logo.svg',
    website: 'https://nodejs.org/',
    popularity: 95,
    expertise: 95,
    featured: true
  },
  {
    id: 9,
    name: 'Express',
    description: 'Framework de aplicaciones web para Node.js',
    category: 'Backend',
    logo: 'https://expressjs.com/images/express-facebook-share.png',
    website: 'https://expressjs.com/',
    popularity: 92,
    expertise: 95,
    featured: true
  },
  {
    id: 10,
    name: 'Django',
    description: 'Framework web de alto nivel para Python',
    category: 'Backend',
    logo: 'https://static.djangoproject.com/img/logos/django-logo-negative.svg',
    website: 'https://www.djangoproject.com/',
    popularity: 86,
    expertise: 80,
    featured: false
  },
  {
    id: 11,
    name: 'Laravel',
    description: 'Framework PHP para desarrollo web',
    category: 'Backend',
    logo: 'https://laravel.com/img/logomark.min.svg',
    website: 'https://laravel.com/',
    popularity: 85,
    expertise: 80,
    featured: false
  },
  {
    id: 12,
    name: 'Spring Boot',
    description: 'Framework para aplicaciones Java basado en Spring',
    category: 'Backend',
    logo: 'https://spring.io/images/projects/spring-boot-5b042f763a1c520647a2e41880619e28.svg',
    website: 'https://spring.io/projects/spring-boot',
    popularity: 88,
    expertise: 75,
    featured: false
  },
  {
    id: 13,
    name: 'FastAPI',
    description: 'Framework web moderno y rápido para Python',
    category: 'Backend',
    logo: 'https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png',
    website: 'https://fastapi.tiangolo.com/',
    popularity: 82,
    expertise: 85,
    featured: true
  },
  {
    id: 14,
    name: 'NestJS',
    description: 'Framework para construir aplicaciones del lado del servidor eficientes y escalables en Node.js',
    category: 'Backend',
    logo: 'https://nestjs.com/img/logo-small.svg',
    website: 'https://nestjs.com/',
    popularity: 84,
    expertise: 88,
    featured: true
  },
  
  // Bases de Datos
  {
    id: 15,
    name: 'PostgreSQL',
    description: 'Sistema de gestión de bases de datos relacional orientado a objetos',
    category: 'Base de Datos',
    logo: 'https://wiki.postgresql.org/images/a/a4/PostgreSQL_logo.3colors.svg',
    website: 'https://www.postgresql.org/',
    popularity: 91,
    expertise: 90,
    featured: true
  },
  {
    id: 16,
    name: 'MongoDB',
    description: 'Base de datos NoSQL orientada a documentos',
    category: 'Base de Datos',
    logo: 'https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png',
    website: 'https://www.mongodb.com/',
    popularity: 90,
    expertise: 90,
    featured: true
  },
  {
    id: 17,
    name: 'MySQL',
    description: 'Sistema de gestión de bases de datos relacional',
    category: 'Base de Datos',
    logo: 'https://www.mysql.com/common/logos/logo-mysql-170x115.png',
    website: 'https://www.mysql.com/',
    popularity: 92,
    expertise: 85,
    featured: false
  },
  {
    id: 18,
    name: 'Redis',
    description: 'Almacén de estructura de datos en memoria utilizado como base de datos, caché y bróker de mensajes',
    category: 'Base de Datos',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Redis_Logo.svg/1200px-Redis_Logo.svg.png',
    website: 'https://redis.io/',
    popularity: 89,
    expertise: 82,
    featured: true
  },
  {
    id: 19,
    name: 'Firebase',
    description: 'Plataforma para el desarrollo de aplicaciones web y móviles',
    category: 'Base de Datos',
    logo: 'https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png?hl=es-419',
    website: 'https://firebase.google.com/',
    popularity: 88,
    expertise: 90,
    featured: true
  },
  
  // CMS
  {
    id: 20,
    name: 'WordPress',
    description: 'Sistema de gestión de contenidos para la creación de sitios web',
    category: 'CMS',
    logo: 'https://s.w.org/style/images/about/WordPress-logotype-standard.png',
    website: 'https://wordpress.org/',
    popularity: 95,
    expertise: 95,
    featured: true
  },
  {
    id: 21,
    name: 'Strapi',
    description: 'CMS headless de código abierto hecho con Node.js',
    category: 'CMS',
    logo: 'https://strapi.io/assets/strapi-logo-dark.svg',
    website: 'https://strapi.io/',
    popularity: 85,
    expertise: 90,
    featured: true
  },
  {
    id: 22,
    name: 'Shopify',
    description: 'Plataforma de comercio para iniciar, hacer crecer y gestionar un negocio',
    category: 'CMS',
    logo: 'https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-shopping-bag-full-color-66166c2fb399f8cded33e26cb1db0ec7a6436a276db4f0635bf5b9dada8d83c8.svg',
    website: 'https://www.shopify.com/',
    popularity: 90,
    expertise: 85,
    featured: true
  },
  {
    id: 23,
    name: 'Contentful',
    description: 'Plataforma de gestión de contenido basada en API',
    category: 'CMS',
    logo: 'https://seeklogo.com/images/C/contentful-logo-C395C545BF-seeklogo.com.png',
    website: 'https://www.contentful.com/',
    popularity: 82,
    expertise: 80,
    featured: false
  },
  
  // DevOps
  {
    id: 24,
    name: 'Docker',
    description: 'Plataforma de containerización para aplicaciones',
    category: 'DevOps',
    logo: 'https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png',
    website: 'https://www.docker.com/',
    popularity: 92,
    expertise: 85,
    featured: true
  },
  {
    id: 25,
    name: 'Kubernetes',
    description: 'Sistema de orquestación de contenedores de código abierto',
    category: 'DevOps',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png',
    website: 'https://kubernetes.io/',
    popularity: 90,
    expertise: 80,
    featured: true
  },
  {
    id: 26,
    name: 'GitHub Actions',
    description: 'Automatización de flujos de trabajo de desarrollo de software',
    category: 'DevOps',
    logo: 'https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg',
    website: 'https://github.com/features/actions',
    popularity: 88,
    expertise: 85,
    featured: true
  },
  {
    id: 27,
    name: 'AWS',
    description: 'Plataforma de servicios en la nube',
    category: 'DevOps',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png',
    website: 'https://aws.amazon.com/',
    popularity: 95,
    expertise: 85,
    featured: true
  },
  {
    id: 28,
    name: 'Vercel',
    description: 'Plataforma para sitios estáticos y funciones serverless',
    category: 'DevOps',
    logo: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
    website: 'https://vercel.com/',
    popularity: 88,
    expertise: 90,
    featured: true
  }
];