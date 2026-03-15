<div align="center">
  
  <h1>TUWEBAI</h1>
  
  <p>
    <strong>Arquitectura Core & Entorno de Desarrollo</strong><br>
    <em>Monorepo de grado Enterprise para el stack activo de Tuwebai</em>
  </p>

  <p>
    <a href="#arquitectura-del-stack">Arquitectura</a> •
    <a href="#estructura-de-directorios">Estructura</a> •
    <a href="#comenzando">Comenzando</a> •
    <a href="#comandos-disponibles">Comandos</a>
  </p>

</div>

---

## Arquitectura del Stack

**Tuwebai** se apoya en una arquitectura moderna, desacoplada y diseñada para un alto rendimiento con tipado estricto.

| Capa              | Tecnología                   | Dominio          |
| :---------------- | :--------------------------- | :--------------- |
| **Frontend**      | React 18, Vite, Tailwind CSS | `/client`        |
| **Backend**       | Node.js, Express, ESBuild    | `/server`        |
| **Lenguaje**      | TypeScript (Modo Estricto)   | Full-stack       |
| **Base de Datos** | Drizzle ORM, Firebase        | `/server/src/db` |

_Notas sobre sistemas legacy: La API legacy en PHP y las Cloud Functions aisladas de Firebase para integración de contacto se mantienen en directorios separados por compatibilidad y no forman parte de la compilación central activa._

<br>

## Estructura de Directorios

```text
 tuwebai/
 ├─ client/                  # Aplicación Frontend
 │  ├─ public/               # Assets estáticos
 │  └─ src/
 │     ├─ app/               # Enrutamiento, layouts, providers globales
 │     ├─ features/          # Módulos por dominio (Auth, Users, etc.)
 │     ├─ shared/            # Componentes UI reutilizables y primitivas
 │     └─ lib/               # Librerías o clientes de API
 │
 ├─ server/                  # Aplicación Backend
 │  ├─ src/
 │  │  ├─ app/               # Inicialización de Express y enrutador global
 │  │  ├─ config/            # Configuraciones de entorno
 │  │  ├─ modules/           # Módulos de backend por dominio
 │  │  └─ schemas/           # Validaciones Zod (Schemas)
 │  └─ index.ts              # Entry point del servidor
 │
 ├─ legacy/                  # Stack aislado de la versión anterior en PHP
 └─ scripts/                 # Scripts utilitarios para operaciones y validación
```

<br>

## Comenzando

### 1. Requisitos

- Node.js `v20` o superior
- npm `v10` o superior

### 2. Instalación

Asegúrate de instalar todas las dependencias requeridas en la raíz del workspace.

```bash
npm install
```

### 3. Variables de Entorno

Crea un archivo `.env` en el directorio raíz. Este archivo único centraliza la configuración tanto para el frontend (consumido por Vite) como para el backend (cargado por Express).

```env
# Servidor
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173

# Base de Datos & Auth
# Agregar aquí configuración de Drizzle y de Firebase correspondiente.
```

<br>

## Comandos Disponibles

El workspace utiliza `concurrently` y compiladores rápidos (`tsx` / `esbuild`) para optimizar el desarrollo y el build.

| Comando                  | Acción      | Descripción                                                                                      |
| :----------------------- | :---------- | :----------------------------------------------------------------------------------------------- |
| `npm run dev:enterprise` | Desarrollo  | Inicia de forma paralela el frontend, el backend y el monitor de logs (log sink).                |
| `npm run dev:all`        | Desarrollo  | Inicia el frontend y backend en modo observador (watch mode).                                    |
| `npm run build:all`      | Compilación | Compila tanto el frontend (Vite) como el backend (ESBuild) a `dist` y `dist-server`.             |
| `npm run check`          | Validación  | Ejecuta `tsc --noEmit` de forma estricta. Obligatorio confirmar éxito antes de cualquier commit. |
| `npm run lint`           | Validación  | Ejecuta ESLint contra ambos stacks para prevenir anti-patrones.                                  |
| `npm run smoke`          | Pruebas     | Ejecuta la suite rápida E2E de health-check contra la API.                                       |

---

<div align="center">
  <small>Agencia de Desarrollo Web - <strong>Tuwebai</strong></small>
</div>
