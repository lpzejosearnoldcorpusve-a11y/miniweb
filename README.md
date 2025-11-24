# Mi Proyecto - Sistema de Transporte Urbano

Un sistema web moderno para la gestión y visualización de rutas de transporte urbano en La Paz, Bolivia. Incluye gestión de teleféricos, minibuses y rutas de transporte público.

## 🚀 Tecnologías Utilizadas

- **Framework:** Next.js 15.1.6
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL con Drizzle ORM
- **Autenticación:** NextAuth.js
- **UI:** Tailwind CSS + Shadcn/ui
- **Mapas:** Leaflet con React-Leaflet
- **Despliegue:** Vercel

## 📁 Estructura del Proyecto

```
mi-proyecto/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticación
│   │   │   ├── login/            # POST /api/auth/login
│   │   │   ├── register/         # POST /api/auth/register
│   │   │   ├── route.ts          # GET /api/auth
│   │   │   └── verify/           # POST /api/auth/verify
│   │   ├── minibuses/            # GET /api/minibuses
│   │   ├── telefericos/          # GET /api/telefericos
│   │   └── users/                # Gestión de usuarios
│   │       ├── route.ts          # GET/POST /api/users
│   │       └── [id]/             # GET/PUT/DELETE /api/users/[id]
│   ├── dashboard/                # Panel de administración
│   │   ├── layout.tsx            # Layout con sidebar
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── rutas/                # Gestión de rutas
│   │   │   └── page.tsx          # Teleféricos y minibuses
│   │   └── usuarios/             # Gestión de usuarios
│   │       └── page.tsx          # Lista y CRUD de usuarios
│   ├── login/                    # Página de login
│   ├── register/                 # Página de registro
│   └── globals.css               # Estilos globales
├── components/                   # Componentes React
│   ├── auth/                     # Componentes de autenticación
│   ├── dashboard/                # Componentes del dashboard
│   ├── maps/                     # Componentes de mapas
│   │   ├── map-client.tsx        # Cliente de mapas con Leaflet
│   │   └── map-wrapper.tsx       # Wrapper dinámico
│   ├── routes/                   # Componentes de rutas
│   │   ├── minibus-form.tsx      # Formulario de minibuses
│   │   ├── minibus-view.tsx      # Vista de minibuses
│   │   ├── teleferico-form.tsx   # Formulario de teleféricos
│   │   └── teleferico-view.tsx   # Vista de teleféricos
│   ├── ui/                       # Componentes UI reutilizables
│   └── users/                    # Componentes de usuarios
├── db/                           # Base de datos
│   ├── index.ts                  # Conexión Drizzle
│   ├── migrate.ts                # Migraciones
│   └── schema.ts                 # Esquema de tablas
├── drizzle/                      # Migraciones de base de datos
├── hooks/                        # Custom hooks
│   ├── use-auth.ts               # Hooks de autenticación
│   ├── use-transport.ts          # Hooks de transporte
│   └── use-users.ts              # Hooks de usuarios
├── lib/                          # Utilidades
│   ├── actions/                  # Server actions
│   │   ├── auth.ts               # Acciones de auth
│   │   ├── transport.ts          # Acciones de transporte
│   │   └── users.ts              # Acciones de usuarios
│   ├── utils.ts                  # Utilidades generales
│   └── validations/              # Validaciones
├── public/                       # Archivos estáticos
├── types/                        # Definiciones TypeScript
└── docs/                         # Documentación
```

## 🗄️ Esquema de Base de Datos

### Tablas Principales

- **users** - Usuarios del sistema
- **tokens** - Tokens de autenticación
- **telefericos** - Líneas de teleférico
- **estaciones** - Estaciones de teleférico
- **transportes** - Rutas de transporte (minibuses)
- **rutas** - Detalles de rutas con coordenadas

### Relaciones

- Un teleférico tiene muchas estaciones
- Un transporte tiene una ruta
- Un usuario puede tener tokens

## 🔌 API Endpoints

### Autenticación
- `GET /api/auth` - Verificación de estado
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/verify` - Verificación de token

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users/[id]` - Obtener usuario
- `PUT /api/users/[id]` - Actualizar usuario
- `DELETE /api/users/[id]` - Eliminar usuario

### Transporte
- `GET /api/minibuses` - Listar minibuses
- `GET /api/telefericos` - Listar teleféricos

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- PostgreSQL
- npm/yarn/pnpm

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd mi-proyecto
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear archivo `.env` con:
   ```env
   DATABASE_URL=postgresql://usuario:password@localhost:5432/dbname
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=tu-secret-aqui
   ```

4. **Configurar base de datos**

   ```bash
   # Generar migraciones
   npx drizzle-kit generate

   # Ejecutar migraciones
   npx drizzle-kit migrate
   ```

5. **Ejecutar servidor de desarrollo**
   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000)

## 📱 Características

### 🗺️ Mapas Interactivos
- Visualización de rutas de teleférico y minibuses
- Creación de rutas con snapping a carreteras (OSRM)
- Mapas responsivos con Leaflet

### 👤 Gestión de Usuarios
- CRUD completo de usuarios
- Autenticación segura con bcrypt
- Roles de usuario

### 🚐 Sistema de Transporte
- Gestión de líneas de teleférico
- Creación de rutas de minibuses
- Almacenamiento de coordenadas GPS

### 🎨 Interfaz Moderna
- Diseño con Tailwind CSS
- Componentes Shadcn/ui
- Tema responsive
- Animaciones y transiciones

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar linter
```

## 🚀 Despliegue en Vercel

1. **Conectar repositorio a Vercel**
2. **Configurar variables de entorno en Vercel**
3. **Configurar base de datos PostgreSQL** (Neon, Supabase, etc.)
4. **Desplegar**

### Variables de Entorno para Producción

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=tu-secret-produccion
```

## 📚 Documentación Adicional

- [API Documentation](./docs/auth-api.md)
- [Database Schema](./db/schema.ts)
- [Componentes UI](./components/ui/)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.
o AL RODRI MI PANA 
