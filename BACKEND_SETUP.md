# Guía de Configuración y Cambios del Backend (Laravel)

Este documento explica, paso a paso, los cambios realizados en el backend, junto con el porqué de cada decisión y los comandos necesarios para preparar y probar el entorno dentro de Docker.

## Objetivos
- Alinear Laravel para funcionar correctamente dentro de Docker.
- Exponer un recurso de ejemplo mediante API REST (`prubea`).
- Sembrar datos de prueba para validación rápida.
- Proveer comandos claros para instalación, migraciones, seeders y pruebas.

---

## 1) Variables de entorno del backend
- Archivo: `backend/.env.example`
- Cambios aplicados:
  - `DB_HOST=mysql`
  - `DB_DATABASE=mai_db`
  - `DB_USERNAME=mai_user`
  - `DB_PASSWORD=mai_pass`
- Motivo:
  - Dentro de Docker, los servicios se conectan por el nombre del servicio (DNS interno). En `docker-compose.yml`, el servicio de BD se llama `mysql`, de ahí `DB_HOST=mysql` y no `localhost`.
  - El resto de credenciales coinciden con el `.env` de la raíz para evitar inconsistencias.

---

## 2) Modelo de dominio
- Archivo: `backend/app/Models/Prubea.php`
- Qué se hizo:
  - Se creó el modelo `Prubea` y se fijó la tabla explícitamente como `prubea`.
  - Se definió `$fillable` con: `nombres`, `apellidos`, `email`, `telefono`, `fecha_nacimiento`.
- Motivo:
  - Eloquent, por convención, esperaría `prubeas` como nombre de tabla. Al usar un nombre singular, conviene fijarlo con `protected $table = 'prubea'`.
  - `$fillable` permite asignación masiva segura (`create`, `update`).

---

## 3) Migración de base de datos
- Archivo: `backend/database/migrations/2025_09_19_000000_create_prubea_table.php`
- Estructura creada:
  - `id`, `nombres` (string 120), `apellidos` (string 120), `email` (string 150, único), `telefono` (string 30, nullable), `fecha_nacimiento` (date, nullable), `timestamps`.
- Motivo:
  - Esquema mínimo para “datos básicos de una persona”.
  - Índice único en `email` para evitar duplicados y mejorar consultas.

---

## 4) Controlador API REST
- Archivo: `backend/app/Http/Controllers/API/PrubeaController.php`
- Endpoints implementados:
  - `index`, `show`, `store`, `update`, `destroy`.
- Validación:
  - Validaciones por endpoint (requeridos, tipos, longitudes y unicidad de `email`).
- Motivo:
  - Un CRUD estándar permite probar rápidamente la API y sirve como referencia para nuevos recursos.
  - La validación protege la integridad de datos.

---

## 5) Rutas de la API
- Archivo: `backend/routes/api.php`
- Registro de rutas:
  - `Route::apiResource('prubea', PrubeaController::class);`
- Motivo:
  - `apiResource` genera las rutas REST comunes con middleware `api` y prefijo `/api`, manteniendo el archivo ordenado y estándar.

---

## 6) Seeders (datos de ejemplo)
- Archivos:
  - `backend/database/seeders/PrubeaSeeder.php`
  - `backend/database/seeders/DatabaseSeeder.php`
- Qué se hizo:
  - `PrubeaSeeder` inserta 3 registros de ejemplo.
  - `DatabaseSeeder` invoca a `PrubeaSeeder`.
- Motivo:
  - Permite cargar datos iniciales con un comando y validar endpoints sin depender del frontend o herramientas externas.

---

## 7) Comandos: preparar y probar el backend
Ejecutar desde la raíz del proyecto (`MAI/`) y usando la CLI disponible en tu sistema:

- Instalar dependencias e inicializar APP_KEY:
```bash
docker compose exec php composer install
docker compose exec php php artisan key:generate
```

- Migraciones:
```bash
docker compose exec php php artisan migrate
```

- Seeders:
```bash
# Solo el seeder de prubea
docker compose exec php php artisan db:seed --class=PrubeaSeeder

# Todo lo registrado en DatabaseSeeder
docker compose exec php php artisan db:seed
```

- Limpiar cachés (si es necesario):
```bash
docker compose exec php php artisan optimize:clear
```

---

## 8) Endpoints disponibles y ejemplos
- Rutas generadas (públicas para pruebas):
  - GET `/api/prubea`
  - GET `/api/prubea/{id}`
  - POST `/api/prubea`
  - PUT/PATCH `/api/prubea/{id}`
  - DELETE `/api/prubea/{id}`

- Ejemplos con `curl`:
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

---

## 9) Razones técnicas y buenas prácticas
- **Host de BD por nombre de servicio (`mysql`)**: en Docker, los contenedores se resuelven por nombre de servicio.
- **Validaciones en controlador**: evitan datos inválidos y mejoran la robustez desde el inicio.
- **Índice único en `email`**: asegura consistencia y eficiencia en consultas.
- **`apiResource`**: estandariza el CRUD y reduce código repetitivo.
- **Seeders**: facilitan pruebas locales y CI/CD.

---

## 10) Revertir o ajustar
- Deshacer la última migración:
```bash
docker compose exec php php artisan migrate:rollback
```
- Volver a ejecutar seeders:
```bash
docker compose exec php php artisan db:seed
```
- Modificar estructura:
  - Editar/añadir nuevas migraciones y volver a migrar.

---

## 11) Próximos pasos sugeridos
- **Autenticación (Sanctum)**: proteger endpoints según roles/necesidades.
- **Tests**: añadir tests `Feature` y `Factory` para `Prubea`.
- **Versionado**: mover rutas a un namespace versionado si se requiere (`v1`).
- **API Resources**: estandarizar el formato de salida de las respuestas.
