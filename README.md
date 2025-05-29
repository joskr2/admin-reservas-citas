# Sistema de Citas Horizonte 🏥

Sistema completo de gestión de citas médicas para psicólogos, desarrollado con Next.js 15, TypeScript, y Tailwind CSS. **Completamente funcional con datos de demostración (mock data) y listo para integración con backend**.

## 🌟 Características Principales

- ✅ **Sistema de autenticación completo** con 5 usuarios (psicólogos) + 1 super administrador
- ✅ **Calendario interactivo** con vistas de día, semana y mes
- ✅ **Gestión completa de citas** (crear, iniciar, terminar, cancelar)
- ✅ **Sistema de reserva de salas** con control de disponibilidad
- ✅ **Datos de demostración realistas** (4 citas hoy, ~4 por semana, 28+ por mes)
- ✅ **Responsive design** optimizado para móvil y escritorio
- ✅ **Tema claro/oscuro** con persistencia
- ✅ **Middleware de protección** de rutas
- ✅ **Validación de formularios** con Zod y React Hook Form
- ✅ **Toast notifications** para feedback del usuario

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd joskr2-admin-reservas-citas
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 👥 Usuarios de Demostración

### Super Administrador
- **Email:** `ana.gonzalez@psicologia.com`
- **Contraseña:** `123456`
- **Rol:** Admin (acceso completo)

### Psicólogos
- **Dr. Carlos Mendoza:** `carlos.mendoza@psicologia.com` / `123456`
- **Dra. Laura Jiménez:** `laura.jimenez@psicologia.com` / `123456`
- **Dr. Miguel Torres:** `miguel.torres@psicologia.com` / `123456`
- **Dra. Elena Vásquez:** `elena.vasquez@psicologia.com` / `123456`

> 💡 **Tip:** En la página de login, haz clic en "Demo" para acceso rápido a todos los usuarios.

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── admin/             # Rutas protegidas de administración
│   │   ├── citas/         # Gestión de citas y calendario
│   │   ├── profiles/      # Selección de perfiles
│   │   └── page.tsx       # Panel principal
│   ├── login/             # Página de autenticación
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── custom/           # Componentes específicos del proyecto
│   ├── layout/           # Componentes de layout
│   └── ui/               # Componentes base (shadcn/ui)
├── contexts/             # Context providers
│   └── AuthContext.tsx   # Manejo de autenticación
├── lib/                  # Utilidades y configuración
│   ├── api.ts            # Funciones de API (mock)
│   ├── mockData.ts       # Datos de demostración
│   └── utils.ts          # Utilidades generales
└── types/                # Definiciones de tipos TypeScript
```

## 📊 Datos de Demostración

El sistema incluye datos realistas generados automáticamente:

- **Hoy:** 4 citas con diferentes estados (pendiente, en progreso, terminada)
- **Esta semana:** ~4 citas distribuidas en días laborables
- **Este mes:** 28+ citas con horarios y pacientes variados
- **5 salas disponibles:** A-101, A-102, A-103, B-201, B-202
- **15 pacientes diferentes** con nombres y correos únicos

## 🔧 Funcionalidades Detalladas

### Sistema de Autenticación
- Login con email y contraseña
- Tokens JWT simulados
- Protección de rutas con middleware
- Redirección automática según rol

### Gestión de Citas
- **Crear:** Formulario completo con validación
- **Ver:** Calendario con múltiples vistas
- **Iniciar:** Cambio de estado a "en progreso"
- **Terminar:** Finalización de consulta
- **Cancelar:** Liberación de sala y horario

### Reserva de Salas
- Control automático de disponibilidad
- Prevención de dobles reservas
- Liberación automática al cancelar

### Calendario Interactivo
- **Vista Día:** Citas detalladas del día actual
- **Vista Semana:** Resumen semanal con navegación
- **Vista Mes:** Calendario mensual completo
- **Navegación:** Anterior/siguiente con fechas

## 🎨 Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos utilitarios
- **Framer Motion** - Animaciones fluidas
- **shadcn/ui** - Componentes base accesibles

### Formularios y Validación
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **date-fns** - Manipulación de fechas

### Estado y Contexto
- **React Context** - Manejo de estado global
- **Local Storage** - Persistencia local
- **Mock Data Manager** - Singleton para datos

## 🔄 Preparación para Backend

El proyecto está completamente preparado para integración con backend:

### Puntos de Integración
1. **Reemplazar `mockDataManager`** por llamadas HTTP reales
2. **Actualizar `AuthContext`** para usar endpoints de autenticación
3. **Modificar `middleware.ts`** para validación de tokens real
4. **Cambiar rutas de API** en `lib/api.ts`

### Variables de Entorno Sugeridas
```env
NEXT_PUBLIC_API_URL=http://localhost:8002
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Estructura de API Esperada
```
POST /auth/login
POST /auth/logout
GET  /auth/verify
GET  /citas/usuario/:id
POST /citas/
PATCH /citas/:id/iniciar
PATCH /citas/:id/terminar
PATCH /citas/:id/cancelar
GET  /habitaciones/
```

## 🧪 Testing

Para probar todas las funcionalidades:

1. **Login** con cualquier usuario demo
2. **Seleccionar perfil** de psicólogo
3. **Ver calendario** en diferentes vistas
4. **Crear nueva cita** con validación
5. **Gestionar citas existentes** (iniciar/terminar)
6. **Cambiar entre perfiles** diferentes
7. **Probar responsive design** en móvil

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar versión de producción
npm run start

# Linting
npm run lint
```

## 📱 Responsive Design

El sistema está completamente optimizado para:
- **📱 Móvil:** 320px+
- **📱 Tablet:** 768px+
- **💻 Desktop:** 1024px+
- **🖥️ Large Desktop:** 1440px+

## 🌙 Temas

- **Claro:** Colores suaves con excelente contraste
- **Oscuro:** Tema oscuro completo
- **Sistema:** Detección automática de preferencias

## 🛡️ Seguridad

- Validación de formularios en cliente y servidor
- Protección de rutas sensibles
- Sanitización de datos de entrada
- Control de sesiones simulado

## 📝 Próximos Pasos para Backend

1. **Configurar base de datos** (PostgreSQL/MySQL recomendado)
2. **Implementar API REST** con endpoints listados
3. **Configurar autenticación JWT** real
4. **Migrar datos mock** a base de datos
5. **Ajustar middleware** para validación real
6. **Configurar variables de entorno**
7. **Testing de integración**

## 🤝 Contribución

El proyecto está listo para desarrollo colaborativo:
- Código TypeScript tipado completamente
- Componentes modulares y reutilizables
- Estructura clara y documentada
- Mock data fácil de reemplazar

## 📄 Licencia

Este proyecto está bajo licencia MIT.

---
