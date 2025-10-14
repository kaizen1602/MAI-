# Arquitectura y Estructura del Frontend

Este documento explica la arquitectura, estructura de carpetas, componentes principales y flujos de datos del frontend para que el desarrollador del backend pueda entender cómo se consume la API y cómo se estructura la aplicación.

## 1. Tecnologías Utilizadas

- **React** (v18+) - Biblioteca principal para la interfaz de usuario
- **TypeScript** - Tipado estático para mayor robustez
- **React Router** - Navegación entre páginas
- **Tailwind CSS** - Framework de estilos CSS
- **Vite** - Herramienta de construcción y desarrollo
- **React Icons** - Biblioteca de iconos
- **Axios** - Cliente HTTP para llamadas a la API

## 2. Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas principales de la aplicación
│   ├── layouts/        # Estructuras de página reutilizables
│   ├── data/           # Datos mock y archivos JSON
│   ├── types/          # Definiciones de tipos TypeScript
│   ├── css/            # Archivos CSS personalizados
│   ├── App.tsx         # Componente principal de la aplicación
│   └── main.tsx        # Punto de entrada de la aplicación
├── public/             # Archivos estáticos
├── index.html          # Página HTML principal
├── package.json        # Dependencias y scripts
└── vite.config.ts      # Configuración de Vite
```

## 3. Componentes Principales

### 3.1. Páginas Principales

1. **Home** (`/`) - Página de inicio con opciones de login/registro
2. **Login** (`/login`) - Formulario de inicio de sesión
3. **Register** (`/register`) - Formulario de registro
4. **Wall** (`/wall`) - Muro principal con todas las publicaciones
5. **Sales** (`/sales`) - Página "Quiero Vender" con solicitudes de compra
6. **Shopping** (`/shopping`) - Página "Quiero Comprar" con productos en venta
7. **Profile** (`/profile`) - Perfil del usuario con sus publicaciones
8. **Post Detail** (`/post/:id`) - Detalle de una publicación específica

### 3.2. Componentes Reutilizables

- **Navbar** - Barra de navegación principal
- **PostList** - Lista de publicaciones con scroll
- **PostCard** - Tarjeta individual de una publicación
- **PostDetail** - Detalle de una publicación
- **Filters** - Componente de filtros para búsqueda
- **ProfileHeader** - Encabezado del perfil de usuario
- **ProfileInfo** - Información personal del usuario
- **UserPosts** - Publicaciones del usuario
- **PurchaseHistory** - Historial de compras del usuario
- **PublishPostModal** - Modal para crear nuevas publicaciones

## 4. Estructura de Datos

### 4.1. Publicación (Post)

```typescript
interface Post {
  post_id: number;
  title: string;
  description: string;
  created_at: string;
  post_type: {
    type_id: number;
    type_name: "Venta" | "Compra";
  };
  user: {
    user_id: number;
    name: string;
  };
  images?: {
    image_id: number;
    url: string;
  }[];
  likes?: number;
  comments?: number;
  quantity_kg?: number;
  price_per_kg?: number;
  municipality?: {
    municipality_id: number;
    name: string;
  };
  product?: {
    product_id: number;
    name: string;
    description: string;
    image_url: string;
  };
}
```

### 4.2. Usuario (User)

```typescript
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  city: string;
  joinDate: string;
  imageUrl: string;
  bio: string;
  posts: Post[];
  purchases: Purchase[];
}
```

### 4.3. Compra (Purchase)

```typescript
interface Purchase {
  id: number;
  title: string;
  sellerName: string;
  date: string;
  price: number;
  imageUrl: string;
  rating?: number;
}
```

## 5. Flujo de Datos y Consumo de API

### 5.1. Endpoints Utilizados

Actualmente, el frontend utiliza datos mock almacenados en archivos JSON. Para la integración con el backend, se deben implementar los siguientes endpoints:

#### Publicaciones
- `GET /api/posts` - Obtener todas las publicaciones
- `GET /api/posts/{id}` - Obtener una publicación específica
- `POST /api/posts` - Crear una nueva publicación
- `PUT /api/posts/{id}` - Actualizar una publicación
- `DELETE /api/posts/{id}` - Eliminar una publicación

#### Usuarios
- `GET /api/users/{id}` - Obtener información de un usuario
- `PUT /api/users/{id}` - Actualizar perfil de usuario

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/logout` - Cerrar sesión

### 5.2. Ejemplo de Integración

Para integrar con el backend, se debe reemplazar el uso de datos mock con llamadas HTTP. Por ejemplo, en `wall.tsx`:

```typescript
// Antes (datos mock)
useEffect(() => {
  setPosts(postsData);
  setFilteredPosts(postsData);
}, []);

// Después (integración con API)
useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Error al cargar las publicaciones');
    }
  };

  fetchPosts();
}, []);
```

## 6. Estados y Contextos

La aplicación utiliza estados locales de React para la gestión de datos. Para una mejor escalabilidad, se recomienda implementar:

1. **Context API** o **Redux** para la gestión global del estado
2. **React Query** o **SWR** para la gestión de datos asíncronos y caching

## 7. Autenticación

El sistema de autenticación actualmente es simulado. Para la integración real:

1. Al iniciar sesión, el backend debe devolver un token JWT
2. Este token se debe almacenar en `localStorage` o `cookies`
3. En cada llamada a la API, se debe incluir el token en el header `Authorization: Bearer {token}`
4. El frontend debe verificar la validez del token y redirigir al login si es inválido

## 8. Manejo de Errores

La aplicación utiliza `react-hot-toast` para mostrar notificaciones de error. Se recomienda:

1. Implementar un interceptor de errores en Axios
2. Manejar códigos de error HTTP específicos (401, 403, 404, 500)
3. Mostrar mensajes de error amigables al usuario

## 9. Formularios y Validación

Los formularios utilizan validación básica de HTML5. Para una mejor experiencia:

1. Implementar validación con `Yup` y `Formik`
2. Validar datos tanto en frontend como en backend
3. Mostrar errores de validación específicos

## 10. Responsive Design

La aplicación utiliza Tailwind CSS con clases responsive:
- `sm:` para pantallas pequeñas
- `md:` para pantallas medianas
- `lg:` para pantallas grandes
- `xl:` para pantallas extra grandes

## 11. Próximos Pasos para Integración

1. **Configurar Axios** con base URL del backend
2. **Implementar autenticación** con tokens JWT
3. **Reemplazar datos mock** con llamadas a la API
4. **Agregar manejo de errores** global
5. **Implementar loading states** para mejor UX
6. **Agregar paginación** para listados largos

## 12. Consideraciones Técnicas

1. **CORS**: Asegurarse de que el backend permita solicitudes desde el dominio del frontend
2. **HTTPS**: En producción, usar HTTPS tanto en frontend como en backend
3. **Variables de entorno**: Utilizar `.env` para configurar URLs de API y otros parámetros
4. **Build y deployment**: El frontend se construye con `npm run build` y se sirve como archivos estáticos

## 13. Ejemplo de Estructura de Respuesta API

Las respuestas del backend deben seguir esta estructura para compatibilidad con el frontend:

```json
{
  "data": {
    "post_id": 1,
    "title": "Venta de tomates orgánicos",
    "description": "Tomates 100% orgánicos...",
    "post_type": {
      "type_id": 1,
      "type_name": "Venta"
    },
    "user": {
      "user_id": 101,
      "name": "Juan Pérez"
    }
  }
}
```

O para listados:

```json
{
  "data": [
    {
      "post_id": 1,
      "title": "Venta de tomates orgánicos",
      "post_type": {
        "type_id": 1,
        "type_name": "Venta"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```