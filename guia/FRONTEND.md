# 🎨 Frontend - MAI (Mercado Agro Inteligente)

## 📋 Arquitectura General

El frontend está construido con **React 18** + **TypeScript** + **Vite** y sigue una arquitectura de componentes modulares.

### 🛠️ Stack Tecnológico
- **React 18** con Hooks
- **TypeScript** para tipado estático
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **React Hot Toast** para notificaciones

## 🏗️ Estructura de Directorios

```
frontend/src/
├── components/              # Componentes reutilizables
│   ├── PublishPostModal.tsx # Modal para crear publicaciones
│   ├── PostCard.tsx         # Tarjeta de publicación
│   ├── filters.tsx          # Filtros de búsqueda
│   ├── Navbar.tsx           # Barra de navegación
│   └── ...
├── pages/                   # Páginas principales
│   ├── Home.tsx            # Página de inicio
│   ├── wall.tsx            # Muro de publicaciones
│   ├── shopping.tsx        # Página de compras
│   ├── sales.tsx           # Página de ventas
│   ├── Profile.tsx         # Perfil de usuario
│   └── ...
├── data/                    # Lógica de datos
│   ├── api/                # Configuración de API
│   ├── services/           # Servicios de datos
│   ├── context/            # Context API
│   └── types/              # Tipos TypeScript
└── layouts/                # Layouts de página
```

## 🧩 Componentes Principales

### PublishPostModal
**Propósito**: Crear nuevas publicaciones
**Características**:
- Selección de tipo (Oferta/Demanda)
- Formulario completo con validación
- Subida de imágenes
- Integración con API

### PostCard
**Propósito**: Mostrar publicaciones en listas
**Características**:
- Información básica del producto
- Precio y cantidad
- Botón de favoritos
- Navegación a detalles

### filters
**Propósito**: Filtrar publicaciones
**Características**:
- Filtros por tipo, producto, ubicación
- Rango de precios
- Búsqueda por texto
- Debounce para optimización

### Navbar
**Propósito**: Navegación principal
**Características**:
- Menú responsive
- Estado de autenticación
- Navegación entre páginas
- Perfil de usuario

## 📄 Páginas Principales

### Home (Inicio)
- **Ruta**: `/`
- **Función**: Página de bienvenida
- **Características**: Hero section, información de la app

### Wall (Muro)
- **Ruta**: `/wall`
- **Función**: Lista todas las publicaciones
- **Características**: 
  - Lista paginada de publicaciones
  - Filtros integrados
  - Búsqueda en tiempo real

### Shopping (Compras)
- **Ruta**: `/shopping`
- **Función**: Publicaciones de tipo "Demanda"
- **Características**: Solo muestra publicaciones de compra

### Sales (Ventas)
- **Ruta**: `/sales`
- **Función**: Publicaciones de tipo "Oferta"
- **Características**: Solo muestra publicaciones de venta

### Profile (Perfil)
- **Ruta**: `/profile`
- **Función**: Perfil del usuario autenticado
- **Características**:
  - Información personal
  - Historial de compras
  - Publicaciones del usuario
  - Favoritos

## 🔄 Gestión de Estado

### Context API
- **AuthContext**: Estado de autenticación
- **PurchaseContext**: Estado de compras

### Hooks Personalizados
- **useAuth**: Manejo de autenticación
- **usePurchases**: Manejo de compras

## 🌐 Integración con API

### Configuración Axios
```typescript
// Configuración base
baseURL: '' // Proxy de Vite maneja /api
timeout: 30000
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### Interceptores
- **Request**: Agrega token de autenticación
- **Response**: Maneja errores globales (401, 403, 404, 500)

### Servicios
- **AuthService**: Login, registro, perfil
- **PostService**: CRUD de publicaciones
- **ProductService**: Gestión de productos
- **SupportDataService**: Datos de soporte

## 🎨 Estilos y UI

### Tailwind CSS
- **Configuración**: `tailwind.config.js`
- **Tema**: Colores verdes para agricultura
- **Responsive**: Mobile-first design
- **Dark mode**: Soporte completo

### Componentes de UI
- **Botones**: Variantes y estados
- **Modales**: Reutilizables y accesibles
- **Formularios**: Validación y feedback
- **Cards**: Diseño consistente

## 🚀 Características Implementadas

✅ **Autenticación completa**
✅ **Navegación entre páginas**
✅ **CRUD de publicaciones**
✅ **Sistema de filtros**
✅ **Búsqueda en tiempo real**
✅ **Gestión de imágenes**
✅ **Favoritos de usuarios**
✅ **Perfil de usuario**
✅ **Historial de compras**
✅ **Responsive design**
✅ **Dark mode**
✅ **Notificaciones toast**

## 🔧 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Características Mobile
- Navegación hamburguesa
- Cards adaptativas
- Formularios optimizados
- Touch-friendly

## 🎯 Optimizaciones

### Performance
- **Lazy loading** de componentes
- **Debounce** en búsquedas
- **Memoización** con useCallback
- **Virtualización** en listas largas

### UX/UI
- **Loading states** en todas las acciones
- **Error boundaries** para manejo de errores
- **Feedback visual** inmediato
- **Accesibilidad** básica

## 🔍 Debugging

### Herramientas
- **React DevTools**
- **Console logs** estratégicos
- **Network tab** para API calls
- **Vite HMR** para hot reload

### Logs Útiles
```typescript
// En componentes
console.log('Component state:', state);

// En servicios
console.log('API Response:', response);
```

## 🚨 Solución de Problemas

### Error de conexión API
- Verificar que el backend esté corriendo
- Revisar configuración de proxy en `vite.config.ts`

### Problemas de autenticación
- Verificar token en localStorage
- Revisar interceptores de Axios

### Errores de TypeScript
- Verificar tipos en `data/types/`
- Revisar interfaces de componentes

El frontend está completamente funcional y optimizado para producción. 🎉
