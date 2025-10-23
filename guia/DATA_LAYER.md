# 🔗 Capa de Datos - MAI (Mercado Agro Inteligente)

## 📋 Arquitectura General

La capa de datos es el puente entre el frontend y el backend, manejando toda la comunicación API, gestión de estado y tipado de datos.

### 🏗️ Estructura
```
frontend/src/data/
├── api/                    # Configuración de API
├── services/               # Servicios de datos
├── context/                # Gestión de estado global
└── types/                  # Tipos TypeScript
```

## 🌐 Configuración de API

### Axios Configuration (`api/axios.config.ts`)
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

### Endpoints (`api/endpoints.ts`)
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
  // ... más endpoints
};
```

### Interceptores (`api/interceptors.ts`)
- **Request**: Agrega token de autenticación automáticamente
- **Response**: Maneja errores globales (401, 403, 404, 500)

## 🔧 Servicios de Datos

### AuthService
```typescript
class AuthService extends BaseService {
  async login(credentials: LoginRequest): Promise<AuthResponse>
  async register(data: RegisterRequest): Promise<AuthResponse>
  async logout(): Promise<void>
  async getProfile(): Promise<User>
  async updateProfile(data: Partial<User>): Promise<User>
}
```

### PostService
```typescript
class PostService extends BaseService {
  async getPosts(filters?: PostFilters): Promise<CursorPaginatedResponse<Post>>
  async getPost(id: number): Promise<Post>
  async createPost(data: CreatePostRequest): Promise<Post>
  async updatePost(id: number, data: UpdatePostRequest): Promise<Post>
  async deletePost(id: number): Promise<void>
}
```

### SupportDataService
```typescript
class SupportDataService extends BaseService {
  async getPostTypes(): Promise<PostType[]>
  async getProductTypes(): Promise<ProductType[]>
  async getDepartments(): Promise<Department[]>
  async getMunicipalitiesByDepartment(deptId: number): Promise<Municipality[]>
}
```

## 🎯 Gestión de Estado

### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
```

**Características**:
- Persistencia en localStorage
- Auto-logout en token expirado
- Estado global de autenticación

### PurchaseContext
```typescript
interface PurchaseContextType {
  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, 'id' | 'date'>) => void;
  updatePurchaseRating: (purchaseId: number, rating: number) => void;
}
```

**Características**:
- Estado local de compras
- Sincronización con API
- Gestión de calificaciones

## 📝 Tipos TypeScript

### Tipos de Usuario
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  address_details?: string;
  profile_image?: string;
  role: Role;
  is_verified: boolean;
}
```

### Tipos de Publicación
```typescript
interface Post {
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

### Tipos de API
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CursorPaginatedResponse<T> {
  data: T[];
  pagination: {
    per_page: number;
    next_cursor: string | null;
    prev_cursor: string | null;
    has_more_pages: boolean;
  };
}
```

## 🔄 Flujo de Datos

### 1. Autenticación
```
Usuario → LoginForm → AuthService → API → AuthContext → localStorage
```

### 2. Carga de Publicaciones
```
Component → PostService → API → Response → Component State
```

### 3. Creación de Publicación
```
PublishModal → PostService → API → Success → Refresh List
```

### 4. Gestión de Favoritos
```
PostCard → FavoriteService → API → Context Update → UI Update
```

## 🛠️ BaseService (Clase Base)

```typescript
abstract class BaseService {
  protected async handleRequest<T>(request: Promise<AxiosResponse<any>>): Promise<T>
  protected async handleFullResponse<T>(request: Promise<AxiosResponse<any>>): Promise<T>
  protected buildFormData(data: Record<string, any>): FormData
  protected extractErrorMessage(error: any): string
}
```

**Características**:
- Manejo consistente de respuestas API
- Extracción automática de datos
- Manejo de errores estandarizado
- Soporte para FormData

## 🔐 Manejo de Autenticación

### Token Management
```typescript
// Almacenamiento
localStorage.setItem('auth_token', token);
localStorage.setItem('user_data', JSON.stringify(user));

// Interceptor automático
config.headers.Authorization = `Bearer ${token}`;

// Limpieza en logout
localStorage.removeItem('auth_token');
localStorage.removeItem('user_data');
```

### Auto-logout
```typescript
// En interceptor de respuesta
if (status === 401) {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/login';
}
```

## 📊 Optimizaciones

### Debouncing
```typescript
// En filtros de búsqueda
const handleFilter = useCallback((filters: any) => {
  if (filterTimeout.current) {
    clearTimeout(filterTimeout.current);
  }
  filterTimeout.current = setTimeout(() => {
    loadPosts(filters);
  }, 500);
}, []);
```

### Caching
- **Context API**: Estado persistente
- **localStorage**: Datos de usuario
- **React Query**: (Futuro) Cache de API

### Error Handling
```typescript
try {
  const response = await service.getData();
  return response.data;
} catch (error) {
  console.error('API Error:', error);
  throw new Error('Error al cargar datos');
}
```

## 🔍 Debugging

### Logs Útiles
```typescript
// En servicios
console.log('API Request:', request);
console.log('API Response:', response);

// En contextos
console.log('Auth State:', { user, isAuthenticated });
console.log('Purchase State:', purchases);
```

### Network Tab
- Verificar peticiones HTTP
- Revisar headers de autenticación
- Monitorear respuestas de API

## 🚀 Características Implementadas

✅ **Configuración Axios completa**
✅ **Interceptores de autenticación**
✅ **Servicios para todas las entidades**
✅ **Context API para estado global**
✅ **Tipos TypeScript completos**
✅ **Manejo de errores robusto**
✅ **Debouncing en filtros**
✅ **Persistencia de estado**
✅ **Auto-logout en token expirado**

## 🔧 Comandos Útiles

```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Linting
npm run lint

# Build con verificación de tipos
npm run build
```

## 🚨 Solución de Problemas

### Error de conexión API
- Verificar configuración de proxy en `vite.config.ts`
- Revisar que el backend esté corriendo

### Problemas de tipos
- Verificar interfaces en `types/`
- Revisar respuestas de API

### Errores de autenticación
- Verificar token en localStorage
- Revisar interceptores de Axios

La capa de datos está completamente funcional y optimizada. 🎉
