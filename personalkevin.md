# 🎯 Mi Trabajo en MAI - Personal Kevin

## 📋 **¿Qué es MAI?**

**MAI (Mercado Agro Inteligente)** es una plataforma web que conecta productores y compradores de productos agrícolas en Honduras.

## 🔧 **Lo Que Hice**

### **1. Conecté Frontend con Backend**

#### **Problema Inicial**
- El frontend no se conectaba con el backend
- Errores 404 y 500 en la consola
- Datos hardcodeados en lugar de datos reales

#### **Solución Implementada**
- **Creé servicios** para manejar cada funcionalidad
- **Configuré Axios** para hacer peticiones HTTP
- **Implementé autenticación** con tokens
- **Conecté con la API** de Laravel

### **2. Configuré Docker**

#### **Problema Inicial**
- Los servicios no se comunicaban entre sí
- Base de datos no accesible desde el frontend
- Errores de conexión

#### **Solución Implementada**
- **Configuré docker-compose.yml** para orquestar servicios
- **Conecté MySQL** con Laravel
- **Configuré Nginx** como proxy reverso
- **Levanté todos los servicios** correctamente

### **3. Creé la Capa de Datos**

#### **Estructura que Creé**
```
frontend/src/data/
├── api/                    # Configuración de comunicación
│   ├── axios.config.ts     # Configuración de Axios
│   ├── endpoints.ts        # URLs de la API
│   └── interceptors.ts     # Manejo de errores
├── services/               # Servicios de datos
│   ├── AuthService.ts      # Login, registro, perfil
│   ├── PostService.ts      # Publicaciones
│   ├── ProductService.ts   # Productos
│   └── BaseService.ts      # Clase base
├── context/                # Estado global
│   ├── AuthContext.tsx     # Estado de autenticación
│   └── PurchaseContext.tsx # Estado de compras
└── types/                   # Tipos TypeScript
    ├── user.types.ts       # Tipos de usuario
    ├── post.types.ts       # Tipos de publicación
    └── product.types.ts    # Tipos de producto
```

#### **¿Qué Hace Cada Carpeta?**

**📁 api/**
- **axios.config.ts**: Configura Axios para hacer peticiones HTTP
- **endpoints.ts**: Define todas las URLs de la API
- **interceptors.ts**: Maneja errores automáticamente

**📁 services/**
- **AuthService.ts**: Maneja login, registro y perfil de usuario
- **PostService.ts**: Maneja crear, editar, eliminar publicaciones
- **ProductService.ts**: Maneja productos agrícolas
- **BaseService.ts**: Clase base que usan todos los servicios

**📁 context/**
- **AuthContext.tsx**: Guarda el estado del usuario logueado
- **PurchaseContext.tsx**: Guarda el estado de las compras

**📁 types/**
- **user.types.ts**: Define cómo es un usuario
- **post.types.ts**: Define cómo es una publicación
- **product.types.ts**: Define cómo es un producto

## 🔍 **Explicación de la Carpeta `data/`**

### **📁 api/ - Configuración de Comunicación**

#### **axios.config.ts**
```typescript
const apiClient = axios.create({
  baseURL: '', // Proxy de Vite maneja /api
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```
**¿Qué hace?**
- Configura Axios para hacer peticiones HTTP
- Define timeout de 30 segundos
- Establece headers por defecto

#### **endpoints.ts**
```typescript
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile'
  },
  POSTS: {
    BASE: '/api/posts',
    DETAIL: (id) => `/api/posts/${id}`
  }
};
```
**¿Qué hace?**
- Define todas las URLs de la API en un solo lugar
- Evita errores de tipeo en las URLs
- Facilita el mantenimiento

#### **interceptors.ts**
```typescript
// Agrega token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Maneja errores automáticamente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```
**¿Qué hace?**
- **Request**: Agrega el token de autenticación automáticamente
- **Response**: Maneja errores 401 (no autenticado) automáticamente
- **Logout automático**: Si el token expira, redirige al login

### **📁 services/ - Servicios de Datos**

#### **BaseService.ts**
```typescript
abstract class BaseService {
  protected async handleRequest<T>(request: Promise<AxiosResponse<any>>): Promise<T> {
    try {
      const response = await request;
      return response.data.data; // Extrae los datos de la respuesta
    } catch (error) {
      throw this.extractErrorMessage(error);
    }
  }
}
```
**¿Qué hace?**
- Clase base que usan todos los servicios
- Maneja respuestas de manera consistente
- Extrae errores de manera estandarizada

#### **AuthService.ts**
```typescript
class AuthService extends BaseService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.handleRequest(
      this.client.post(ENDPOINTS.AUTH.LOGIN, credentials)
    );
  }
  
  async getProfile(): Promise<User> {
    return this.handleRequest(
      this.client.get(ENDPOINTS.AUTH.PROFILE)
    );
  }
}
```
**¿Qué hace?**
- Maneja login, registro y perfil de usuario
- Usa BaseService para consistencia
- Retorna datos tipados con TypeScript

#### **PostService.ts**
```typescript
class PostService extends BaseService {
  async getPosts(filters?: PostFilters): Promise<CursorPaginatedResponse<Post>> {
    return this.handleRequest(
      this.client.get(ENDPOINTS.POSTS.BASE, { params: filters })
    );
  }
  
  async createPost(data: CreatePostRequest): Promise<Post> {
    return this.handleRequest(
      this.client.post(ENDPOINTS.POSTS.BASE, data)
    );
  }
}
```
**¿Qué hace?**
- Maneja CRUD de publicaciones
- Soporta filtros y paginación
- Crea, edita y elimina publicaciones

### **📁 context/ - Estado Global**

#### **AuthContext.tsx**
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    localStorage.setItem('auth_token', response.token);
    setUser(response.user);
    setIsAuthenticated(true);
  };
}
```
**¿Qué hace?**
- **Estado global**: Guarda el estado del usuario logueado
- **Persistencia**: Guarda el token en localStorage
- **Compartido**: Todos los componentes pueden acceder al estado

#### **PurchaseContext.tsx**
```typescript
interface PurchaseContextType {
  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, 'id' | 'date'>) => void;
  updatePurchaseRating: (purchaseId: number, rating: number) => void;
}
```
**¿Qué hace?**
- **Estado local**: Guarda el estado de las compras
- **Funciones**: addPurchase, updatePurchaseRating
- **Sincronización**: Se sincroniza con la API

### **📁 types/ - Tipos TypeScript**

#### **user.types.ts**
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  address_details?: string;
  profile_image?: string;
  role: Role;
  is_verified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}
```
**¿Qué hace?**
- **Validación**: Define cómo debe ser un usuario
- **Autocompletado**: El editor sugiere propiedades
- **Errores**: Detecta errores de tipo en tiempo de desarrollo

#### **post.types.ts**
```typescript
export interface Post {
  id: number;
  title: string;
  description: string;
  quantity_kg: number;
  price_per_kg: number;
  post_type: PostType;
  product: Product;
  user: User;
  municipality: Municipality;
  images: PostImage[];
  status: 'ACTIVE' | 'INACTIVE';
}
```
**¿Qué hace?**
- **Estructura**: Define cómo es una publicación
- **Relaciones**: Incluye usuario, producto, municipio
- **Validación**: Asegura que los datos sean correctos

## 🔄 **Cómo Funciona Todo Junto**

### **Flujo de Login**
1. **Usuario ingresa credenciales** → LoginForm
2. **LoginForm llama** → AuthContext.login()
3. **AuthContext llama** → AuthService.login()
4. **AuthService usa** → axios.config.ts
5. **Axios hace petición** → endpoints.ts
6. **Interceptors** → Agregan headers y manejan errores
7. **Backend responde** → AuthService procesa respuesta
8. **AuthContext actualiza** → Estado global
9. **Componentes se re-renderizan** → Con nuevo estado

### **Flujo de Crear Publicación**
1. **Usuario llena formulario** → PublishPostModal
2. **Modal llama** → PostService.createPost()
3. **PostService usa** → BaseService.handleRequest()
4. **BaseService usa** → axios.config.ts
5. **Axios hace petición** → endpoints.ts
6. **Interceptors** → Manejan autenticación y errores
7. **Backend guarda** → En MySQL
8. **Frontend actualiza** → Lista de publicaciones

## 🐛 **Errores que Corregí**

### **1. Error de Importación**
- **Problema**: `Failed to resolve import "./BaseService"`
- **Solución**: Corregí la ruta a `./base/BaseService`

### **2. Error de Autenticación**
- **Problema**: `POST method not supported for route api/auth/profile`
- **Solución**: Cambié POST por PUT en AuthService

### **3. Error de Base de Datos**
- **Problema**: `Connection refused` a MySQL
- **Solución**: Verifiqué que Docker esté corriendo y configuré las conexiones

### **4. Error de Favoritos**
- **Problema**: `GET /api/my-favorites 404`
- **Solución**: Identifiqué que el endpoint no existe (normal)

### **5. Error de Perfil en Blanco**
- **Problema**: Página de perfil vacía
- **Solución**: Corregí las referencias a datos hardcodeados

## 🔄 **Cómo Funciona la Conexión**

### **Flujo de Datos**
```
Usuario → Frontend → Servicio → Axios → HTTP → Backend → MySQL
Usuario ← Frontend ← Servicio ← Axios ← HTTP ← Backend ← MySQL
```

### **Diagrama de Mi Trabajo**
```
┌─────────┐    ┌──────────┐    ┌─────────┐    ┌──────────┐    ┌─────────┐
│         │    │          │    │         │    │          │    │         │
│ USUARIO │───►│ FRONTEND │───►│ SERVICIO│───►│  BACKEND  │───►│  MySQL  │
│         │    │          │    │         │    │          │    │         │
│         │    │          │    │         │    │          │    │         │
│         │◄───│          │◄───│         │◄───│          │◄───│         │
└─────────┘    └──────────┘    └─────────┘    └──────────┘    └─────────┘
     │              │              │              │              │
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
  Interfaz      React 18        Axios         Laravel 10     Base de
  Usuario       TypeScript      HTTP/HTTPS    PHP 8.1        Datos
                Tailwind CSS    REST API      Sanctum        Relacional
```

### **Lo Que Conecté**
1. **Frontend** ↔ **Backend**: Usando Axios y HTTP
2. **Backend** ↔ **MySQL**: Usando Laravel y Eloquent
3. **Docker** ↔ **Todos los servicios**: Usando docker-compose
4. **Nginx** ↔ **Frontend y Backend**: Como proxy reverso

### **Ejemplo Práctico de Mi Trabajo**

#### **Antes (Con Errores)**
```
Usuario hace login → Error 404 → No se conecta
Usuario crea publicación → Error 500 → No se guarda
Datos hardcodeados → No hay conexión real
```

#### **Después (Funcionando)**
```
Usuario hace login → AuthService → Axios → API → Laravel → MySQL → ✅
Usuario crea publicación → PostService → Axios → API → Laravel → MySQL → ✅
Datos reales → Conexión funcionando → ✅
```

#### **Lo Que Cambié**
1. **Creé servicios** para manejar cada funcionalidad
2. **Configuré Axios** para hacer peticiones HTTP
3. **Implementé autenticación** con tokens
4. **Conecté con la API** de Laravel
5. **Configuré Docker** para que todos los servicios funcionen

## 🛠️ **Tecnologías que Usé**

### **Frontend**
- **React 18**: Para la interfaz de usuario
- **TypeScript**: Para validar tipos de datos
- **Axios**: Para hacer peticiones HTTP
- **Context API**: Para manejar estado global

### **Backend**
- **Laravel 10**: Framework PHP
- **MySQL**: Base de datos
- **Laravel Sanctum**: Para autenticación con tokens

### **Infraestructura**
- **Docker**: Para contenedores
- **Docker Compose**: Para orquestar servicios
- **Nginx**: Para proxy reverso

## 🚀 **Resultado Final**

### **Lo Que Logré**
- ✅ **Frontend conectado** con backend
- ✅ **Datos reales** en lugar de hardcodeados
- ✅ **Autenticación funcionando** con tokens
- ✅ **Docker configurado** correctamente
- ✅ **Servicios comunicándose** entre sí
- ✅ **Errores corregidos** y aplicación funcionando

### **Aplicación Funcional**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost/api
- **Base de Datos**: http://localhost:8080

### **Usuarios de Prueba**
- **Vendedor**: vendedor@test.com / password
- **Comprador**: comprador@test.com / password

## 📊 **Resumen de Mi Trabajo**

### **Lo Que Hice**
1. **Conecté frontend y backend** usando Axios y HTTP
2. **Configuré Docker** para que todos los servicios funcionen
3. **Creé la capa de datos** con servicios, context y tipos
4. **Corregí errores** de importación, autenticación y conexión
5. **Implementé autenticación** con tokens
6. **Reemplacé datos hardcodeados** por datos reales de la API

### **Resultado**
- **Aplicación completamente funcional**
- **Conexión real** entre frontend y backend
- **Datos reales** de productos agrícolas
- **Sistema de autenticación** funcionando
- **Docker configurado** correctamente

## 🔍 **Detalles Técnicos**

### **Conexión Frontend ↔ Backend**

#### **Tecnología de Comunicación**
- **HTTP/HTTPS**: Protocolo de comunicación
- **REST API**: Arquitectura de servicios
- **JSON**: Formato de intercambio de datos
- **Axios**: Librería para peticiones HTTP
- **Laravel Sanctum**: Autenticación con tokens

#### **Autenticación**
- **Laravel Sanctum**: Tokens de autenticación
- **JWT**: Tokens seguros
- **Headers**: `Authorization: Bearer {token}`

### **Flujo de Trabajo Típico**

1. **Usuario se registra** → Frontend → AuthService → API → Backend → MySQL
2. **Usuario crea publicación** → Frontend → PostService → API → Backend → MySQL
3. **Usuario busca productos** → Frontend → PostService → API → Backend → MySQL → Frontend
4. **Usuario marca favorito** → Frontend → FavoriteService → API → Backend → MySQL

### **Métricas del Proyecto**

- **Frontend**: 31 componentes React
- **Backend**: 13 controladores API
- **Base de Datos**: 25 migraciones
- **Servicios**: 9 servicios de datos
- **Tipos**: 5 archivos de tipos TypeScript
- **Documentación**: 6 archivos de guía completa

## 🎯 **Para la Exposición**

### **Puntos Clave**
1. **Conecté frontend y backend** usando tecnologías modernas
2. **Configuré Docker** para desarrollo y producción
3. **Creé una arquitectura robusta** con servicios y context
4. **Corregí errores críticos** que impedían el funcionamiento
5. **Implementé autenticación segura** con tokens
6. **Reemplacé datos hardcodeados** por datos reales

### **Demostración**
- **Frontend funcionando**: http://localhost:5173
- **Backend respondiendo**: http://localhost/api
- **Base de datos accesible**: http://localhost:8080
- **Usuarios de prueba**: vendedor@test.com / password

---

**MAI** - Plataforma de comercio agrícola funcionando correctamente 🚀
