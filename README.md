# 🚀 Proyecto MAI – Arquitectura con Docker, Laravel y React

## 📘 Descripción
MAI es un sistema modular que utiliza **Laravel** como backend (APIs), **React** como frontend y servicios adicionales gestionados por **Docker Compose** (MySQL, Nginx, PhpMyAdmin y n8n).  

El flujo de trabajo está pensado para que el **frontend consuma únicamente las APIs** expuestas por Laravel, evitando accesos directos a la base de datos.

## 🛠️ Requisitos Previos

- Docker y Docker Compose instalados
- Git para clonar el repositorio
- Node.js y npm (para desarrollo frontend)
- Composer (para gestión de dependencias de PHP)

## 🚀 Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd MAI
```

### 2. Configurar Variables de Entorno

#### Variables Globales (.env en la raíz)
Crea tu archivo `.env` a partir del ejemplo y ajusta los valores sensibles:

```bash
cp .env.example .env
```

```env
MYSQL_ROOT_PASSWORD=tu_contraseña_root
MYSQL_DATABASE=mai_db
MYSQL_USER=mai_user
MYSQL_PASSWORD=mai_pass
PMA_USER=root
PMA_PASSWORD=tu_contraseña_root
```

#### Variables del Backend (backend/.env)
Copia el archivo `.env.example` a `.env` en la carpeta backend y configura:

```env
APP_NAME=MAI
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=mai_db  # Debe ser el nombre de la base de datos, NO el nombre del contenedor. El host es `DB_HOST=mysql`.
DB_USERNAME=mai_user
DB_PASSWORD=mai_pass
```

### 3. Iniciar los Contenedores

```bash
docker-compose up -d
```

### 4. Instalar Dependencias del Backend

```bash
docker-compose exec php composer install
docker-compose exec php php artisan key:generate
docker-compose exec php php artisan migrate
```

### 5. Instalar Dependencias del Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Estructura del Proyecto

```
MAI/
├── backend/               # Aplicación Laravel
│   ├── app/              # Lógica de la aplicación
│   ├── config/           # Archivos de configuración
│   ├── database/         # Migraciones, seeders, factories
│   ├── routes/           # Definición de rutas de la API
│   └── ...
├── docker/               # Configuraciones personalizadas de Docker
├── frontend/             # Aplicación React
├── mysql/                # Volumen de datos de MySQL
├── n8n/                  # Configuración de n8n
├── docker-compose.yml    # Configuración de servicios
└── .env                 # Variables de entorno globales
```

## 🛠️ Comandos Útiles

### Base de Datos

- **Ejecutar migraciones**:
  ```bash
  docker-compose exec php php artisan migrate
  ```

- **Ejecutar seeders**:
  ```bash
  docker-compose exec php php artisan db:seed
  ```

- **Acceder a MySQL**:
  ```bash
  docker-compose exec mysql mysql -u mai_user -p
  ```

### Desarrollo

- **Reconstruir contenedores**:
  ```bash
  docker-compose down
  docker-compose up -d --build
  ```

- **Ver logs de un servicio**:
  ```bash
  docker-compose logs -f [servicio]
  # Ejemplo: docker-compose logs -f php
  ```

- **Ejecutar pruebas**:
  ```bash
  docker-compose exec php php artisan test
  ```

## 🌐 Servicios Disponibles

| Servicio   | URL                     | Credenciales                  |
|------------|-------------------------|-------------------------------|
| Aplicación | http://localhost       | -                             |
| PhpMyAdmin | http://localhost:8080  | Usuario: root / Contraseña: [la de MYSQL_ROOT_PASSWORD] |
| n8n        | http://localhost:5678  | -                             |
| Frontend (Vite) | http://localhost:5173 | -                             |

## 🚀 Desarrollo de APIs con Laravel

### Crear un nuevo recurso de API

1. **Crear migración y modelo**:
   ```bash
   docker-compose exec php php artisan make:model Product -m
   ```

2. **Definir la migración** en `database/migrations/..._create_products_table.php`

3. **Definir el modelo** en `app/Models/Product.php`

4. **Crear controlador de API**:
   ```bash
   docker-compose exec php php artisan make:controller API/ProductController --api
   ```

5. **Definir rutas** en `routes/api.php`:
   ```php
   use App\Http\Controllers\API\ProductController;
   
   Route::apiResource('products', ProductController::class);
   ```

6. **Implementar métodos** en `app/Http/Controllers/API/ProductController.php`

## 📚 Recurso de ejemplo: `prubea`

Se añadió un recurso de ejemplo para gestionar datos básicos de una persona en la tabla `prubea`.

Estructura de tabla (`database/migrations/*_create_prubea_table.php`):
- id, nombres, apellidos, email (único), telefono, fecha_nacimiento, timestamps

Archivos principales:
- Modelo: `backend/app/Models/Prubea.php`
- Controlador: `backend/app/Http/Controllers/API/PrubeaController.php`
- Rutas: `backend/routes/api.php` (via `Route::apiResource('prubea', ...)`)
- Seeder: `backend/database/seeders/PrubeaSeeder.php` (invocado desde `DatabaseSeeder`)

Comandos para aplicar migraciones y seeders:
```bash
docker compose exec php php artisan migrate
docker compose exec php php artisan db:seed --class=PrubeaSeeder
# o sembrar todo lo registrado en DatabaseSeeder
docker compose exec php php artisan db:seed
```

Endpoints disponibles (públicos para pruebas):
- GET `/api/prubea` → listar
- GET `/api/prubea/{id}` → ver detalle
- POST `/api/prubea` → crear
- PUT/PATCH `/api/prubea/{id}` → actualizar
- DELETE `/api/prubea/{id}` → eliminar

Ejemplos con curl:
```bash
# Listar
curl http://localhost/api/prubea

# Crear
curl -X POST http://localhost/api/prubea \
  -H 'Content-Type: application/json' \
  -d '{
    "nombres": "Ana",
    "apellidos": "Ramírez",
    "email": "ana.ramirez@example.com",
    "telefono": "+57 3000000000",
    "fecha_nacimiento": "1995-08-15"
  }'

# Actualizar
curl -X PUT http://localhost/api/prubea/1 \
  -H 'Content-Type: application/json' \
  -d '{ "telefono": "+57 3111111111" }'

# Eliminar
curl -X DELETE http://localhost/api/prubea/1
```

Ejemplo de consumo desde React (frontend) usando el proxy `/api`:
```tsx
import { useEffect, useState } from 'react';

type Row = {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string | null;
  fecha_nacimiento?: string | null;
};

export default function PrubeaList() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/prubea');
      const data = await res.json();
      setRows(data);
    })();
  }, []);

  return (
    <ul>
      {rows.map(r => (
        <li key={r.id}>{r.nombres} {r.apellidos} - {r.email}</li>
      ))}
    </ul>
  );
}
```

### Consumir API desde React

Ejemplo de componente React que consume la API:

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
```

## 🔄 Flujo de Trabajo con Git

1. Crear una rama para cada característica:
   ```bash
   git checkout -b feature/nombre-de-la-caracteristica
   ```

2. Hacer commits atómicos con mensajes descriptivos

3. Hacer push de la rama al repositorio remoto

4. Crear un Pull Request para revisión

## 🐛 Solución de Problemas

### Problemas comunes

1. **Error de permisos en Linux/Mac**:
   ```bash
   sudo chown -R $USER:$USER .
   ```

2. **Reconstruir contenedores después de cambios en Dockerfile**:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

3. **Limpiar caché de Laravel**:
   ```bash
   docker-compose exec php php artisan cache:clear
   docker-compose exec php php artisan config:clear
   docker-compose exec php php artisan route:clear
   docker-compose exec php php artisan view:clear
   ```

4. **Diferencia entre `docker compose` y `docker-compose`**:
   - Sistemas recientes usan `docker compose ...` (sin guion).
   - Sistemas antiguos usan `docker-compose ...` (con guion).
   - Usa uno u otro según lo que tengas instalado.

5. **Reconstrucción total con cambio de credenciales MySQL**:
   - Si cambiaste credenciales en `.env` raíz y ya existía la carpeta `docker/mysql/data`, elimina esa carpeta para re-inicializar MySQL con las nuevas credenciales:
     ```bash
     docker compose down
     rm -rf docker/mysql/data
     docker compose up -d --build
     ```
   - Advertencia: esto borra los datos de la base de datos.

6. **No commitees archivos `.env` reales**:
   - Sube solo los `*.env.example`.
   - Asegúrate de tener un `.gitignore` que ignore `.env` en la raíz y en cada servicio.

## 🖥️ Frontend (Vite + React)

### Proxy de desarrollo con Vite

Se configuró `frontend/vite.config.ts` para proxyear llamadas a `/api` hacia `http://localhost` (Nginx del backend). Así, en el frontend puedes usar rutas relativas como `fetch('/api/...')` sin CORS.

Archivo: `frontend/vite.config.ts`

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### Comandos Frontend

Desde `frontend/`:

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # build de producción
npm run preview # previsualización local del build
```

### Ejemplo de consumo de API en React

```tsx
import { useEffect, useState } from 'react';

type Product = { id: number; name: string; price: number };

export default function Products() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <ul>
      {data.map((p) => (
        <li key={p.id}>{p.name} - ${p.price}</li>
      ))}
    </ul>
  );
}
```

## 📌 Cambios recientes aplicados

- `docker-compose.yml` ahora lee variables desde `.env` raíz (`MYSQL_*`, `PMA_*`).
- Corregida la ruta del Dockerfile de PHP a `docker/dockerfiles/php.dockerfile`.
- `backend/.env.example` actualizado para usar `DB_HOST=mysql` y credenciales del servicio.
- `frontend/vite.config.ts` añadido con proxy para `/api`.

## 📝 Licencia

Este proyecto está bajo la licencia MIT.



### 🔹 Backend (Laravel) 
- **`app/`** → Lógica de negocio (Models, Controllers, Services).  
- **`routes/`** → Endpoints de la API (`api.php`).  
- **`config/`** → Configuración de Laravel (BD, mail, cache).  
- **`database/`** → Migraciones y seeders.  
- **`.env`** → Variables de entorno para el backend.  

### 🔹 Frontend (React + Vite)
- **`src/`** → Código fuente (componentes, hooks, contextos).  
- **`public/`** → Archivos estáticos.  
- **`vite.config.js`** → Configuración de Vite.  

### 🔹 Docker Services
Definidos en `docker-compose.yml`:

- **`mysql_db`** → Base de datos MySQL.  
- **`php_fpm`** → Donde corre PHP/Laravel.  
- **`nginx_server`** → Proxy inverso y servidor web.  
- **`phpmyadmin`** → Panel web para administrar MySQL.  
- **`n8n`** → Automatización e integraciones externas.  

---

## ⚙️ Variables de Entorno

### 📌 Backend (`backend/.env`)

```env
APP_NAME=MAI
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=mysql_db
DB_PORT=3306
DB_DATABASE=mai_db
DB_USERNAME=mai_user
DB_PASSWORD=mai_pass



MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=mai_db
MYSQL_USER=mai_user
MYSQL_PASSWORD=mai_pass

PHP_VERSION=8.2
NODE_VERSION=18
