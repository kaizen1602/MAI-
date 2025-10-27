# 🚀 Guía de Instalación Completa - MAI

Esta guía te llevará paso a paso desde clonar el repositorio hasta tener la aplicación funcionando completamente.

## 📋 Prerrequisitos

- **Docker** y **Docker Compose** instalados
- **Node.js** (versión 18 o superior)
- **PHP** (versión 8.1 o superior) - solo para desarrollo local
- **Composer** - solo para desarrollo local

## 🔧 Paso 1: Clonar y Configurar el Proyecto

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd MAI-

# Crear archivo de variables de entorno
cp backend/.env.example backend/.env
```

## 🐳 Paso 2: Configurar Docker

```bash
# Levantar todos los servicios
docker-compose up -d

# Verificar que todos los contenedores estén corriendo
docker ps
```

**Servicios que se levantarán:**
- MySQL (puerto 3306)
- PHP-FPM (backend)
- Nginx (puerto 80)
- PhpMyAdmin (puerto 8080)
- Frontend (puerto 5173)

## 🗄️ Paso 3: Configurar Base de Datos

```bash
# Ejecutar migraciones
docker exec php_fpm php artisan migrate

# Ejecutar seeders esenciales
docker exec php_fpm php artisan db:seed --class=RoleSeeder
docker exec php_fpm php artisan db:seed --class=PostTypeSeeder
docker exec php_fpm php artisan db:seed --class=DepartmentMunicipalitySeeder
docker exec php_fpm php artisan db:seed --class=ProductTypeSeeder
docker exec php_fpm php artisan db:seed --class=UserSeeder

# Crear productos reales
docker exec mysql_db mysql -u mai_user -pmai_pass mai_db -e "
INSERT INTO products (name, description, product_type_id, created_at, updated_at) VALUES
('Tomate', 'Tomates frescos y jugosos, perfectos para ensaladas y cocina', 3, NOW(), NOW()),
('Lechuga', 'Lechuga fresca y crujiente, ideal para ensaladas', 3, NOW(), NOW()),
('Cebolla', 'Cebollas moradas y blancas, excelente para cocinar', 3, NOW(), NOW()),
('Papa', 'Papas frescas, perfectas para freír o cocinar', 4, NOW(), NOW()),
('Plátano', 'Plátanos maduros, ricos en potasio', 2, NOW(), NOW()),
('Maíz', 'Maíz fresco, perfecto para elote o pozole', 1, NOW(), NOW()),
('Frijol', 'Frijoles negros, ricos en proteína', 1, NOW(), NOW()),
('Café', 'Café arábica de altura, tostado artesanalmente', 5, NOW(), NOW());"

# Crear publicaciones de ejemplo
docker exec mysql_db mysql -u mai_user -pmai_pass mai_db -e "
INSERT INTO posts (title, description, quantity_kg, price_per_kg, post_type_id, product_id, user_id, municipality_id, status, created_at, updated_at) VALUES
('Venta de Tomates Frescos', 'Tomates orgánicos cultivados sin pesticidas, perfectos para ensaladas y salsas. Disponibles en diferentes tamaños.', 50, 2500, 1, 1, 1, 13, 'ACTIVE', NOW(), NOW()),
('Busco Lechuga para Restaurante', 'Necesito lechuga fresca para mi restaurante. Cantidad mínima 20kg por semana.', 20, 3000, 2, 2, 2, 13, 'ACTIVE', NOW(), NOW()),
('Venta de Papas de Calidad', 'Papas frescas cosechadas esta semana, ideales para freír o cocinar. Excelente calidad garantizada.', 100, 1800, 1, 4, 1, 13, 'ACTIVE', NOW(), NOW()),
('Compro Maíz para Tortillas', 'Busco maíz fresco para hacer tortillas artesanales. Preferiblemente de la región.', 30, 2200, 2, 6, 2, 13, 'ACTIVE', NOW(), NOW()),
('Café Premium de Exportación', 'Café arábica de altura, proceso artesanal. Perfecto para exportación o consumo local premium.', 25, 15000, 1, 8, 1, 13, 'ACTIVE', NOW(), NOW());"
```

## 🎨 Paso 4: Configurar Frontend

```bash
# Instalar dependencias
cd frontend
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🔐 Paso 5: Credenciales de Acceso

**Usuarios de prueba:**
- **Vendedor**: `vendedor@test.com` / `password`
- **Comprador**: `comprador@test.com` / `password`

## 🌐 Paso 6: Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost/api
- **PhpMyAdmin**: http://localhost:8080
  - Usuario: `mai_user`
  - Contraseña: `mai_pass`
  - Base de datos: `mai_db`

## ✅ Verificación Final

1. **Frontend carga correctamente** en http://localhost:5173
2. **Login funciona** con las credenciales de prueba
3. **Se pueden crear publicaciones** (Oferta/Demanda)
4. **Se pueden ver publicaciones** en el muro
5. **PhpMyAdmin muestra datos** realistas

## 🛠️ Comandos Útiles

```bash
# Ver logs de contenedores
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Parar servicios
docker-compose down

# Ver estado de migraciones
docker exec php_fpm php artisan migrate:status

# Limpiar caché de Laravel
docker exec php_fpm php artisan cache:clear
docker exec php_fpm php artisan config:clear

# Reinstalar dependencias del frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## 🚨 Solución de Problemas

### Error de conexión a base de datos
```bash
# Verificar que MySQL esté corriendo
docker ps | grep mysql

# Reiniciar MySQL
docker-compose restart mysql
```

### Error de permisos en Laravel
```bash
# Dar permisos a storage
docker exec php_fpm chmod -R 775 storage bootstrap/cache
```

### Frontend no carga
```bash
# Verificar que el puerto 5173 esté libre
lsof -i :5173

# Reiniciar frontend
cd frontend && npm run dev
```

### Errores 404 y 500 en Consola (Clonación Nueva)

Si ves estos errores en la consola del navegador:
- `GET http://localhost:5173/api/my-favorites 404 (Not Found)`
- `POST http://localhost:5173/api/auth/profile 500 (Internal Server Error)`
- `Resource not found`

**Causa**: El backend no está configurado correctamente o no está corriendo.

**Solución paso a paso**:

1. **Verificar que Docker esté corriendo**:
```bash
docker ps
# Deberías ver: mysql_db, php_fpm, nginx, phpmyadmin
```

2. **Si no ves los contenedores, levantarlos**:
```bash
docker-compose up -d
```

3. **Verificar que las migraciones estén ejecutadas**:
```bash
docker exec php_fpm php artisan migrate:status
```

4. **Si no hay migraciones, ejecutarlas**:
```bash
docker exec php_fpm php artisan migrate
docker exec php_fpm php artisan db:seed
```

5. **Verificar que el backend responda**:
```bash
curl http://localhost/api/auth/profile
# Debería devolver un error 401 (no autenticado), no 404
```

6. **Si sigue fallando, reiniciar todo**:
```bash
docker-compose down
docker-compose up -d
docker exec php_fpm php artisan migrate
docker exec php_fpm php artisan db:seed
```

7. **Verificar logs del backend**:
```bash
docker-compose logs php_fpm
```

### Error específico: "The POST method is not supported for route api/auth/profile"

**Causa**: El endpoint `/api/auth/profile` solo acepta GET y PUT, no POST.

**Solución**: Verificar que el frontend esté usando PUT para actualizar el perfil:
```typescript
// En AuthService.ts debería ser:
await this.client.put(ENDPOINTS.AUTH.PROFILE, data);
// NO POST
```

### Error específico: "my-favorites 404"

**Causa**: El endpoint de favoritos no existe en el backend.

**Solución**: Verificar que el backend tenga el endpoint:
```bash
docker exec php_fpm php artisan route:list | grep favorites
```

Si no existe, el componente `UserFavorites` fallará. Esto es normal si no se ha implementado aún.

¡Listo! Tu aplicación MAI debería estar funcionando completamente. 🎉
