# 🏗️ Backend - MAI (Mercado Agro Inteligente)

## 📋 Arquitectura General

El backend está construido con **Laravel 10** y sigue una arquitectura MVC con API RESTful.

### 🗄️ Base de Datos
- **Motor**: MySQL 8.0
- **ORM**: Eloquent
- **Migraciones**: Laravel Migrations
- **Seeders**: Datos iniciales y de prueba

## 🏛️ Estructura de Directorios

```
backend/
├── app/
│   ├── Http/Controllers/Api/     # Controladores de API
│   ├── Models/                  # Modelos Eloquent
│   ├── Services/                # Servicios de negocio
│   └── Traits/                  # Traits reutilizables
├── database/
│   ├── migrations/              # Migraciones de BD
│   └── seeders/                 # Seeders de datos
├── routes/
│   └── api.php                  # Rutas de API
└── config/                      # Configuración
```

## 🎯 Modelos Principales

### User (Usuario)
```php
- id, name, email, phone_number
- address_details, profile_image
- role_id (Vendedor/Comprador)
- is_verified, is_admin
```

### Post (Publicación)
```php
- id, title, description
- quantity_kg, price_per_kg
- post_type_id (Oferta/Demanda)
- product_id, user_id, municipality_id
- status (ACTIVE/INACTIVE)
```

### Product (Producto)
```php
- id, name, description
- product_type_id (Granos/Verduras/Frutas/etc)
- image_url
```

### Transaction (Transacción)
```php
- id, buyer_id, seller_id
- post_id, quantity_kg, price_per_kg
- total_amount, status
- notes, completed_at
```

## 🔌 API Endpoints

### Autenticación
```
POST /api/auth/login          # Iniciar sesión
POST /api/auth/register       # Registro
POST /api/auth/logout         # Cerrar sesión
GET  /api/auth/profile        # Perfil del usuario
POST /api/auth/profile        # Actualizar perfil
```

### Publicaciones
```
GET    /api/posts             # Listar publicaciones
POST   /api/posts             # Crear publicación
GET    /api/posts/{id}        # Ver publicación
PUT    /api/posts/{id}        # Actualizar publicación
DELETE /api/posts/{id}        # Eliminar publicación
```

### Productos
```
GET  /api/products            # Listar productos
GET  /api/products/{id}       # Ver producto
POST /api/products            # Crear producto
```

### Datos de Soporte
```
GET /api/post-types           # Tipos de publicación
GET /api/product-types        # Tipos de producto
GET /api/departments          # Departamentos
GET /api/municipalities       # Municipios
```

## 🔐 Autenticación

**Sistema**: Laravel Sanctum (Token-based)

**Flujo**:
1. Usuario envía credenciales a `/api/auth/login`
2. Backend valida y retorna token
3. Frontend incluye token en headers: `Authorization: Bearer {token}`
4. Middleware `auth:sanctum` valida token en rutas protegidas

## 📊 Seeders y Datos Iniciales

### Datos Esenciales
- **Roles**: Vendedor, Comprador
- **Tipos de Publicación**: Oferta, Demanda
- **Tipos de Producto**: Granos básicos, Frutas, Verduras, Tubérculos, Café
- **Departamentos y Municipios**: Datos de Honduras

### Usuarios de Prueba
- **Vendedor**: `vendedor@test.com` / `password`
- **Comprador**: `comprador@test.com` / `password`

### Productos Reales
- Tomate, Lechuga, Cebolla, Papa, Plátano, Maíz, Frijol, Café

## 🛠️ Comandos Útiles

```bash
# Migraciones
docker exec php_fpm php artisan migrate
docker exec php_fpm php artisan migrate:status
docker exec php_fpm php artisan migrate:fresh

# Seeders
docker exec php_fpm php artisan db:seed
docker exec php_fpm php artisan db:seed --class=UserSeeder

# Cache y Configuración
docker exec php_fpm php artisan cache:clear
docker exec php_fpm php artisan config:clear
docker exec php_fpm php artisan route:list

# Desarrollo
docker exec php_fpm php artisan tinker
docker exec php_fpm php artisan make:controller Api/NewController
```

## 🔧 Configuración

### Variables de Entorno (.env)
```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=mai_db
DB_USERNAME=mai_user
DB_PASSWORD=mai_pass
```

### Docker
- **Contenedor**: `php_fpm`
- **Puerto**: 9000 (interno)
- **Proxy**: Nginx en puerto 80

## 📝 Respuestas de API

### Formato Estándar
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

### Errores
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... } // Para errores de validación
}
```

## 🚀 Características Implementadas

✅ **Autenticación completa**
✅ **CRUD de publicaciones**
✅ **Sistema de productos**
✅ **Filtros y búsqueda**
✅ **Gestión de imágenes**
✅ **Favoritos de usuarios**
✅ **Reseñas y calificaciones**
✅ **Transacciones (estructura)**
✅ **Datos geográficos**
✅ **Roles y permisos**

## 🔍 Debugging

### Logs
```bash
# Ver logs de Laravel
docker exec php_fpm tail -f storage/logs/laravel.log

# Ver logs de Docker
docker-compose logs php_fpm
```

### Base de Datos
```bash
# Acceso directo a MySQL
docker exec mysql_db mysql -u mai_user -pmai_pass mai_db

# Ver tablas
docker exec mysql_db mysql -u mai_user -pmai_pass mai_db -e "SHOW TABLES;"
```

El backend está completamente funcional y listo para producción. 🎉
