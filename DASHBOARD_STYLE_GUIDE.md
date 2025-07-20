# 🎨 Guía de Estilo para Dashboard - TuWeb.ai

## 📋 Resumen Ejecutivo

Este documento detalla **exactamente** cómo replicar el estilo visual de la página principal de TuWeb.ai en el dashboard del cliente. Se mantiene toda la lógica existente del dashboard, solo se aplican cambios visuales para lograr consistencia de marca.

---

## 🎯 Objetivo

Transformar el dashboard actual en una interfaz que mantenga la **identidad visual premium** de TuWeb.ai, con el mismo nivel de profesionalismo, modernidad y experiencia de usuario que la página principal.

---

## 🎨 Sistema de Colores

### Colores Principales
```css
/* Gradiente principal - Azul a Púrpura */
background: linear-gradient(135deg, #00CCFF 0%, #9933FF 100%);

/* Colores base */
--primary-blue: #00CCFF;
--primary-purple: #9933FF;
--dark-bg: #0a0a0f;
--darker-bg: #121217;
--card-bg: #1a1a1f;
--border-color: #2a2a2f;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
--text-muted: #666666;
```

### Estados y Variaciones
```css
/* Hover states */
--hover-blue: #00b8e6;
--hover-purple: #8a2be2;
--hover-card: #23232b;

/* Shadows */
--shadow-blue: rgba(0, 204, 255, 0.2);
--shadow-purple: rgba(153, 51, 255, 0.3);
--shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
```

---

## 🔤 Tipografía

### Fuente Principal
```css
/* Rajdhani - Fuente principal */
font-family: 'Rajdhani', sans-serif;
font-weight: 600; /* Semi-bold para títulos */
font-weight: 400; /* Regular para texto */
```

### Jerarquía Tipográfica
```css
/* Títulos principales */
font-size: 2.5rem; /* 40px */
font-weight: 700;
line-height: 1.2;

/* Subtítulos */
font-size: 1.5rem; /* 24px */
font-weight: 600;
line-height: 1.3;

/* Texto de navegación */
font-size: 0.875rem; /* 14px */
font-weight: 500;

/* Texto de cuerpo */
font-size: 1rem; /* 16px */
font-weight: 400;
line-height: 1.6;

/* Texto pequeño */
font-size: 0.875rem; /* 14px */
font-weight: 400;
```

---

## 🏗️ Layout y Estructura

### Header/Navbar
```css
/* Header principal */
.header {
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
}

/* Logo */
.logo {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.logo-accent {
  color: #00CCFF;
}
```

### Sidebar (Navegación lateral)
```css
/* Sidebar principal */
.sidebar {
  background: linear-gradient(180deg, #0a0a0f 0%, #121217 100%);
  border-right: 1px solid #2a2a2f;
  width: 280px;
  min-height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 80px; /* Espacio para header */
}

/* Menú de navegación */
.nav-menu {
  padding: 1rem;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #a0a0a0;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(0, 204, 255, 0.1);
  color: #00CCFF;
  transform: translateX(4px);
}

.nav-link.active {
  background: linear-gradient(135deg, #00CCFF 0%, #9933FF 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 204, 255, 0.3);
}
```

### Contenido Principal
```css
/* Área de contenido */
.main-content {
  margin-left: 280px; /* Ancho del sidebar */
  padding: 100px 2rem 2rem; /* Top padding para header */
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #121217 100%);
}
```

---

## 🧩 Componentes Principales

### Cards/Contenedores
```css
/* Card base */
.card {
  background: rgba(26, 26, 31, 0.8);
  border: 1px solid #2a2a2f;
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border-color: rgba(0, 204, 255, 0.3);
}

/* Card con gradiente */
.card-gradient {
  background: linear-gradient(135deg, rgba(0, 204, 255, 0.1) 0%, rgba(153, 51, 255, 0.1) 100%);
  border: 1px solid rgba(0, 204, 255, 0.2);
}
```

### Botones
```css
/* Botón primario */
.btn-primary {
  background: linear-gradient(135deg, #00CCFF 0%, #9933FF 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 204, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 204, 255, 0.4);
}

/* Botón secundario */
.btn-secondary {
  background: transparent;
  color: #a0a0a0;
  border: 1px solid #2a2a2f;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: #00CCFF;
  color: #00CCFF;
  background: rgba(0, 204, 255, 0.1);
}
```

### Tablas
```css
/* Tabla base */
.table {
  width: 100%;
  background: rgba(26, 26, 31, 0.8);
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #2a2a2f;
}

.table-header {
  background: linear-gradient(135deg, rgba(0, 204, 255, 0.1) 0%, rgba(153, 51, 255, 0.1) 100%);
  padding: 1rem;
  border-bottom: 1px solid #2a2a2f;
}

.table-row {
  padding: 1rem;
  border-bottom: 1px solid rgba(42, 42, 47, 0.5);
  transition: background 0.3s ease;
}

.table-row:hover {
  background: rgba(0, 204, 255, 0.05);
}

.table-row:last-child {
  border-bottom: none;
}
```

### Formularios
```css
/* Input base */
.input {
  background: rgba(26, 26, 31, 0.8);
  border: 1px solid #2a2a2f;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #00CCFF;
  box-shadow: 0 0 0 3px rgba(0, 204, 255, 0.1);
}

.input::placeholder {
  color: #666666;
}

/* Select */
.select {
  background: rgba(26, 26, 31, 0.8);
  border: 1px solid #2a2a2f;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #ffffff;
  cursor: pointer;
}
```

### Badges/Etiquetas
```css
/* Badge de estado */
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-success {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
```

---

## 📊 Dashboard Sections

### Header del Dashboard
```html
<header class="dashboard-header">
  <div class="header-content">
    <div class="logo">
      TuWeb<span class="logo-accent">.ai</span>
    </div>
    <div class="header-actions">
      <div class="user-menu">
        <div class="user-avatar">
          <!-- Avatar del usuario -->
        </div>
        <div class="user-info">
          <span class="user-name">Nombre del Usuario</span>
          <span class="user-role">Cliente</span>
        </div>
      </div>
    </div>
  </div>
</header>
```

### Sidebar Navigation
```html
<nav class="sidebar">
  <div class="nav-menu">
    <div class="nav-item">
      <a href="/dashboard" class="nav-link active">
        <svg class="nav-icon">...</svg>
        Dashboard
      </a>
    </div>
    <div class="nav-item">
      <a href="/payments" class="nav-link">
        <svg class="nav-icon">...</svg>
        Pagos
      </a>
    </div>
    <div class="nav-item">
      <a href="/projects" class="nav-link">
        <svg class="nav-icon">...</svg>
        Proyectos
      </a>
    </div>
    <div class="nav-item">
      <a href="/profile" class="nav-link">
        <svg class="nav-icon">...</svg>
        Perfil
      </a>
    </div>
  </div>
</nav>
```

### Dashboard Cards
```html
<div class="dashboard-grid">
  <!-- Card de estadísticas -->
  <div class="card card-gradient">
    <div class="card-header">
      <h3 class="card-title">Pagos Totales</h3>
      <div class="card-icon">
        <svg>...</svg>
      </div>
    </div>
    <div class="card-content">
      <div class="stat-value">$15,420</div>
      <div class="stat-change positive">+12.5%</div>
    </div>
  </div>
  
  <!-- Card de proyectos -->
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Proyectos Activos</h3>
    </div>
    <div class="card-content">
      <div class="project-list">
        <!-- Lista de proyectos -->
      </div>
    </div>
  </div>
</div>
```

---

## 🎭 Estados y Animaciones

### Transiciones
```css
/* Transiciones base */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animaciones de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Hover animations */
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(0, 204, 255, 0.3);
}
```

### Loading States
```css
/* Skeleton loading */
.skeleton {
  background: linear-gradient(90deg, #2a2a2f 25%, #3a3a3f 50%, #2a2a2f 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
    padding: 80px 1rem 1rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
  
  .main-content {
    margin-left: 240px;
  }
}

@media (min-width: 1025px) {
  .sidebar {
    width: 280px;
  }
  
  .main-content {
    margin-left: 280px;
  }
}
```

---

## 🎨 Elementos Específicos

### Progress Bars
```css
.progress-bar {
  background: rgba(26, 26, 31, 0.8);
  border-radius: 1rem;
  height: 8px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(135deg, #00CCFF 0%, #9933FF 100%);
  height: 100%;
  border-radius: 1rem;
  transition: width 0.3s ease;
}
```

### Charts/Gráficos
```css
.chart-container {
  background: rgba(26, 26, 31, 0.8);
  border: 1px solid #2a2a2f;
  border-radius: 1rem;
  padding: 1.5rem;
}

.chart-title {
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 1rem;
}
```

### Modals/Dialogs
```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.modal-content {
  background: rgba(26, 26, 31, 0.95);
  border: 1px solid #2a2a2f;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  margin: 2rem auto;
  backdrop-filter: blur(10px);
}
```

---

## 🔧 Implementación Técnica

### CSS Variables (Custom Properties)
```css
:root {
  /* Colores */
  --primary-blue: #00CCFF;
  --primary-purple: #9933FF;
  --dark-bg: #0a0a0f;
  --darker-bg: #121217;
  --card-bg: #1a1a1f;
  --border-color: #2a2a2f;
  
  /* Tipografía */
  --font-primary: 'Rajdhani', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Bordes */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
  --border-radius-xl: 1rem;
}
```

### Clases Utilitarias
```css
/* Flexbox utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }

/* Spacing utilities */
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.m-4 { margin: 1rem; }
.mb-4 { margin-bottom: 1rem; }

/* Text utilities */
.text-white { color: #ffffff; }
.text-gray { color: #a0a0a0; }
.text-blue { color: #00CCFF; }
.font-bold { font-weight: 700; }
.text-sm { font-size: 0.875rem; }
```

---

## 📋 Checklist de Implementación

### ✅ Estructura Base
- [ ] Aplicar colores principales del sistema
- [ ] Configurar tipografía Rajdhani
- [ ] Implementar layout con sidebar fijo
- [ ] Crear header con logo y navegación

### ✅ Componentes Principales
- [ ] Cards con gradientes y efectos hover
- [ ] Botones primarios y secundarios
- [ ] Tablas con estilos consistentes
- [ ] Formularios con inputs estilizados
- [ ] Badges para estados

### ✅ Navegación
- [ ] Sidebar con menú de navegación
- [ ] Estados activos e hover
- [ ] Iconos SVG consistentes
- [ ] Responsive para móvil

### ✅ Dashboard Sections
- [ ] Cards de estadísticas
- [ ] Gráficos y charts
- [ ] Listas de proyectos/pagos
- [ ] Modales y dialogs

### ✅ Responsive
- [ ] Mobile-first approach
- [ ] Sidebar colapsable en móvil
- [ ] Grid adaptativo
- [ ] Touch-friendly interactions

### ✅ Animaciones
- [ ] Transiciones suaves
- [ ] Hover effects
- [ ] Loading states
- [ ] Micro-interacciones

---

## 🎯 Resultado Esperado

Al implementar esta guía, el dashboard debería:

1. **Mantener la identidad visual** de TuWeb.ai
2. **Proporcionar una experiencia premium** y profesional
3. **Ser completamente funcional** sin afectar la lógica existente
4. **Ser responsive** en todos los dispositivos
5. **Tener animaciones fluidas** y micro-interacciones
6. **Mantener consistencia** con la página principal

---

## 📞 Soporte

Para cualquier duda sobre la implementación:
- Revisar los archivos CSS de la página principal como referencia
- Mantener la estructura de componentes existente
- Aplicar cambios solo en estilos, no en funcionalidad
- Probar en diferentes dispositivos y navegadores

---

*Esta guía asegura que el dashboard mantenga la calidad visual y experiencia de usuario de TuWeb.ai mientras preserva toda la funcionalidad existente.* 