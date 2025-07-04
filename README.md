# Craftica Frontend

Una aplicación web completa desarrollada en Next.js con TypeScript que consume la API REST de Craftica para conectar artesanos y pequeñas empresas con sus clientes.

## 🚀 Características

- **Autenticación completa**: Login y registro con JWT
- **Gestión de tiendas**: Crear, editar y visualizar tiendas
- **Catálogo de productos**: Agregar, editar y explorar productos
- **Publicaciones**: Crear contenido con galería de imágenes
- **Sistema de comentarios y reacciones**: Interacción social
- **Diseño responsivo**: Optimizado para móvil, tablet y escritorio
- **Manejo de estados**: Context API para autenticación y SWR para data fetching
- **Validaciones**: Formularios con react-hook-form y zod

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 13.5 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Gestión de estado**: Context API + SWR
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React
- **Testing**: Jest + React Testing Library
- **Data Fetching**: SWR con fetch API nativo

## 📁 Estructura del Proyecto

```
├── app/                    # Páginas y rutas (App Router)
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── tiendas/           # Gestión de tiendas
│   ├── productos/         # Catálogo de productos
│   ├── publicaciones/     # Sistema de publicaciones
│   ├── profile/           # Perfil de usuario
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── auth/             # Componentes de autenticación
│   ├── forms/            # Formularios
│   ├── layout/           # Layout y navegación
│   └── ui/               # Componentes UI base
├── context/              # Context providers
├── hooks/                # Custom hooks
├── services/             # API services
├── types/                # Definiciones TypeScript
└── __tests__/            # Tests unitarios
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js 16.0 o superior
- npm o yarn
- API de Craftica ejecutándose en http://localhost:3000

### Instalación

1. **Clonar el repositorio**:
```bash
git clone [url-del-repositorio]
cd craftica-frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Ejecutar en desarrollo**:
```bash
npm run dev
```

5. **Abrir en el navegador**:
```
http://localhost:3000
```

## 🔐 Autenticación

La aplicación implementa autenticación basada en JWT:

- **Almacenamiento**: JWT se guarda en localStorage
- **Persistencia**: Sesión persiste tras recargar la página
- **Protección de rutas**: HOC `ProtectedRoute` para rutas privadas
- **Redirección automática**: Redirige a login si no está autenticado

### Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. API valida y retorna JWT + datos del usuario
3. JWT se almacena en localStorage
4. Usuario se redirige al dashboard `/`
5. Todas las peticiones posteriores incluyen el JWT en headers

## 📱 Páginas Principales

### 🏠 Dashboard (`/`)
- Resumen de tiendas, productos y publicaciones
- Acciones rápidas para crear contenido
- Estadísticas personalizadas

### 🏪 Tiendas (`/tiendas`)
- Listado con paginación y filtros
- Búsqueda por ciudad/país
- Creación y edición de tiendas
- Vista detallada con publicaciones

### 📦 Productos (`/productos`)
- Catálogo con filtros por categoría
- Búsqueda de productos
- Gestión completa de productos
- Vista detallada con recomendaciones

### 📝 Publicaciones (`/publicaciones`)
- Feed de publicaciones
- Galería de imágenes
- Sistema de comentarios
- Reacciones (like/dislike)

### 👤 Perfil (`/profile`)
- Información personal
- Edición de datos
- Historial de actividad

## 🎨 Diseño y UX

### Principios de Diseño

- **Responsive First**: Diseño móvil primero
- **Accesibilidad**: Contraste adecuado y navegación por teclado
- **Consistencia**: Sistema de colores y espaciado uniforme
- **Feedback Visual**: Loading states, toasts y validaciones
- **Microinteracciones**: Hover states y transiciones suaves

### Sistema de Colores

```css
/* Colores principales */
--primary: #3B82F6      /* Azul principal */
--secondary: #14B8A6    /* Teal secundario */
--accent: #F97316       /* Naranja de acento */
--success: #10B981      /* Verde éxito */
--warning: #F59E0B      /* Amarillo advertencia */
--error: #EF4444        /* Rojo error */
```

### Breakpoints

```css
/* Responsive breakpoints */
sm: 640px    /* Teléfonos grandes */
md: 768px    /* Tablets */
lg: 1024px   /* Laptops */
xl: 1280px   /* Escritorios */
2xl: 1536px  /* Pantallas grandes */
```

## 🔄 Data Fetching

La aplicación utiliza SWR para manejo eficiente de datos:

### Ventajas de SWR

- **Caché automático**: Reduce peticiones redundantes
- **Revalidación**: Actualiza datos en background
- **Retry automático**: Reintenta peticiones fallidas
- **Offline support**: Funciona sin conexión
- **Real-time**: Sincronización entre pestañas

### Hooks Personalizados

```typescript
// Ejemplo de uso
const { tiendas, loading, error, mutate } = useTiendas({
  page: 1,
  limit: 10,
  ciudad: 'Madrid'
});
```

## 🧪 Testing

### Configuración de Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage
```

### Estrategia de Testing

1. **Unit Tests**: Hooks y utilidades
2. **Integration Tests**: Componentes con context
3. **E2E Tests**: Flujos completos (opcional)

### Ejemplos de Tests

```typescript
// Test de hook personalizado
it('should load tiendas correctly', async () => {
  const { result, waitFor } = renderHook(() => useTiendas());
  
  await waitFor(() => {
    expect(result.current.tiendas).toHaveLength(3);
  });
});
```

## 🔒 Seguridad

### Buenas Prácticas Implementadas

- **Validación client-side**: Zod schemas para formularios
- **Sanitización**: Prevención XSS en contenido dinámico
- **Autorización**: Verificación de permisos por recurso
- **Headers seguros**: Configuración de Next.js
- **Validación de URLs**: Verificación de imágenes y enlaces

### Manejo de Errores

```typescript
// Manejo centralizado de errores
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }
  return response.json();
};
```

## 📊 Performance

### Optimizaciones Implementadas

- **Code Splitting**: Lazy loading de componentes
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Análisis de tamaño de bundle
- **Caching**: SWR para caché de datos
- **Prefetching**: Next.js Link prefetch

### Métricas Web Vitales

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🚀 Deployment

### Build para Producción

```bash
# Generar build estático
npm run build

# Iniciar servidor de producción
npm start
```

### Variables de Entorno

```env
# Producción
NEXT_PUBLIC_API_URL=https://api.craftica.com
NEXT_PUBLIC_APP_URL=https://craftica.com
```

## 🤝 Contribución

### Workflow de Desarrollo

1. **Fork** del repositorio
2. **Crear rama** feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Add: nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request**

### Convenciones de Código

- **ESLint + Prettier**: Formateo automático
- **Conventional Commits**: Mensajes de commit estandarizados
- **TypeScript strict**: Tipado estricto
- **Component naming**: PascalCase para componentes

### Convenciones de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato de código
refactor: refactorización
test: agregar tests
chore: tareas de mantenimiento
```

## 📚 Documentación API

### Endpoints Principales

```typescript
// Autenticación
POST /usuarios/login
POST /usuarios
PUT /usuarios/:id

// Tiendas
GET /tiendas
GET /tiendas/:id
POST /tiendas
PUT /tiendas/:id
DELETE /tiendas/:id

// Productos
GET /productos
GET /productos/:id
POST /productos
PUT /productos/:id
DELETE /productos/:id

// Publicaciones
GET /publicaciones
GET /publicaciones/:id
POST /publicaciones
PUT /publicaciones/:id
DELETE /publicaciones/:id
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de CORS**: Verificar configuración de API
2. **Token expirado**: Implementar refresh token
3. **Imágenes no cargan**: Verificar URLs y permisos
4. **Formularios no validan**: Verificar schemas de Zod

### Logs y Debugging

```bash
# Ver logs de desarrollo
npm run dev

# Analizar bundle
npm run analyze

# Verificar tipos
npm run type-check
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:

- **Email**: soporte@craftica.com
- **Issues**: GitHub Issues
- **Documentación**: Wiki del proyecto

---

**Craftica Frontend** - Conectando artesanos con el mundo digital 🎨✨