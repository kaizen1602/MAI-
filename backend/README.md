

---

### **Principios Generales Aplicados**

1.  **Enfoque en Recursos:** La API se organiza en torno a los "recursos" que representa tu base de datos (usuarios, productos, publicaciones, etc.).
2.  **Uso de Métodos HTTP:** Se utilizan los verbos HTTP estándar de forma semántica (GET para obtener, POST para crear, PUT/PATCH para actualizar, DELETE para borrar).
3.  **Convenciones de Nomenclatura:** Se usan sustantivos en plural para las colecciones de recursos (ej. `/products`, `/posts`).
4.  **Seguridad y Autorización:** Se distingue entre rutas públicas, rutas que requieren autenticación, y rutas que requieren un nivel de autorización específico (ser el dueño del recurso o ser administrador).
5.  **Respuestas Claras:** Se asume que la API devolverá códigos de estado HTTP apropiados (200 OK, 201 Created, 404 Not Found, 403 Forbidden, etc.) y respuestas JSON consistentes.
6.  **Paginación y Filtrado:** Los endpoints que devuelven listas (`GET` a una colección) deben soportar paginación (`?page=1&limit=15`) y filtrado (`?status=ACTIVE`) para ser eficientes.

---

### **Análisis de Endpoints por Recurso**

#### **1. Autenticación y Perfil de Usuario (`auth`, `users`)**

Estos endpoints gestionan el ciclo de vida de la sesión del usuario. Los que ya tienes están muy bien planteados.

*   `POST /api/auth/register`
    *   **Función:** Registrar un nuevo usuario en el sistema.
    *   **Método:** `POST`
    *   **Acceso:** Público.
    *   **Request Body:** `name`, `email`, `password`, `password_confirmation`, `phone_number`, `adress_details`. El `roles_role_id` debería asignarse por defecto a un rol de "usuario normal" en el backend, no ser enviado por el cliente por seguridad.
    *   **Respuesta Exitosa:** `201 Created`. Devuelve los datos del usuario creado (sin el hash de la contraseña) y un token de autenticación (Sanctum).

*   `POST /api/auth/login`
    *   **Función:** Iniciar sesión con un usuario existente.
    *   **Método:** `POST`
    *   **Acceso:** Público.
    *   **Request Body:** `email`, `password`.
    *   **Respuesta Exitosa:** `200 OK`. Devuelve los datos del usuario y un nuevo token de autenticación.

*   `GET /api/auth/profile`
    *   **Función:** Obtener los datos del usuario actualmente autenticado.
    *   **Método:** `GET`
    *   **Acceso:** Requiere Autenticación.
    *   **Respuesta Exitosa:** `200 OK`. Devuelve el objeto completo del usuario autenticado.

*   `PUT /api/auth/profile`
    *   **Función:** Actualizar los datos del perfil del usuario autenticado.
    *   **Método:** `PUT` o `PATCH`.
    *   **Acceso:** Requiere Autenticación.
    *   **Request Body:** Campos que se pueden modificar: `full_name`, `phone_number`, `adress_details`. No se debería permitir cambiar el email o el rol por esta vía sin un proceso de verificación.
    *   **Respuesta Exitosa:** `200 OK`. Devuelve el objeto del usuario actualizado.

*   `POST /api/auth/logout`
    *   **Función:** Invalidar el token de autenticación actual.
    *   **Método:** `POST`
    *   **Acceso:** Requiere Autenticación.
    *   **Respuesta Exitosa:** `200 OK` o `204 No Content`.

*   `POST /api/auth/logout-all`
    *   **Función:** Invalidar todos los tokens de sesión del usuario (cierra sesión en todos los dispositivos).
    *   **Método:** `POST`
    *   **Acceso:** Requiere Autenticación.
    *   **Respuesta Exitosa:** `200 OK` o `204 No Content`.

*   `GET /api/users/{user_id}`
    *   **Función:** Obtener el perfil público de un usuario específico (por ejemplo, para ver quién hizo una publicación).
    *   **Método:** `GET`
    *   **Acceso:** Requiere Autenticación.
    *   **Detalles:** Es crucial que este endpoint **NO** devuelva información sensible como `email`, `adress_details`, `is_verified`. Solo debería devolver `user_id`, `full_name`, `created_at` y quizás una calificación promedio calculada a partir de las `reviews`.
    *   **Respuesta Exitosa:** `200 OK`.

#### **2. Productos (`products`)**

Estos son los tipos de productos agrícolas. Generalmente son datos maestros gestionados por administradores.

*   `GET /api/products`
    *   **Función:** Obtener una lista de todos los productos disponibles.
    *   **Método:** `GET`
    *   **Acceso:** Público.
    *   **Detalles:** Debería soportar búsqueda (`?search=tomate`) y paginación.
    *   **Respuesta Exitosa:** `200 OK`. Devuelve un array de objetos de producto.

*   `GET /api/products/{product_id}`
    *   **Función:** Obtener los detalles de un producto específico.
    *   **Método:** `GET`
    *   **Acceso:** Público.
    *   **Respuesta Exitosa:** `200 OK`. Devuelve un único objeto de producto.

*   `POST /api/products`, `PUT /api/products/{product_id}`, `DELETE /api/products/{product_id}`
    *   **Función:** Crear, actualizar y eliminar productos.
    *   **Acceso:** **Solo Administradores.** Un usuario normal no debería poder crear nuevos tipos de productos.

#### **3. Publicaciones (`posts`)**

Este es el corazón de la aplicación, donde los usuarios compran y venden.

*   `GET /api/posts`
    *   **Función:** Obtener un listado de todas las publicaciones activas.
    *   **Método:** `GET`
    *   **Acceso:** Público.
    *   **Detalles:** **Crítico** que soporte filtros avanzados: `?product_id=5`, `?municipality_id=120`, `?post_type_id=1` (venta), `?user_id=10`, ordenamiento (`?sortBy=price_per_kg&order=asc`) y paginación.
    *   **Respuesta Exitosa:** `200 OK`. Devuelve un array de publicaciones.

*   `POST /api/posts`
    *   **Función:** Crear una nueva publicación (oferta de venta o solicitud de compra).
    *   **Método:** `POST`
    *   **Acceso:** Requiere Autenticación.
    *   **Request Body:** `title`, `description`, `quantity_kg`, `price_per_kg`, `post_types_type_id`, `products_product_id`, `municipalities_municipality_id`. El `users_user_id` se obtiene del usuario autenticado, no del body. El `status` se establece en `ACTIVE` por defecto.
    *   **Respuesta Exitosa:** `201 Created`. Devuelve la publicación recién creada.

*   `GET /api/posts/{post_id}`
    *   **Función:** Obtener los detalles completos de una publicación específica.
    *   **Método:** `GET`
    *   **Acceso:** Público.
    *   **Detalles:** La respuesta debería incluir información anidada pero simplificada del usuario que la creó, el producto y las imágenes asociadas.
    *   **Respuesta Exitosa:** `200 OK`.

*   `PUT /api/posts/{post_id}`
    *   **Función:** Actualizar una publicación existente.
    *   **Método:** `PUT` o `PATCH`.
    *   **Acceso:** Requiere Autenticación y **Autorización** (solo el dueño de la publicación puede editarla).
    *   **Request Body:** Campos editables como `title`, `description`, `quantity_kg`, `price_per_kg`.
    *   **Respuesta Exitosa:** `200 OK`. Devuelve la publicación actualizada.

*   `DELETE /api/posts/{post_id}`
    *   **Función:** Eliminar o marcar como "cerrada" una publicación.
    *   **Método:** `DELETE`.
    *   **Acceso:** Requiere Autenticación y **Autorización** (solo el dueño o un admin).
    *   **Detalles:** Una buena práctica es no borrar el registro (soft delete), sino cambiar su `status` a `CLOSED` o `DELETED`.
    *   **Respuesta Exitosa:** `204 No Content`.

*   `POST /api/posts/{post_id}/images`
    *   **Función:** Añadir una imagen a una publicación.
    *   **Método:** `POST`.
    *   **Acceso:** Requiere Autenticación y **Autorización** (dueño de la publicación).
    *   **Request Body:** `multipart/form-data` con el archivo de la imagen.
    *   **Respuesta Exitosa:** `201 Created`. Devuelve el objeto de la imagen creada (`image_id`, `image_url`).

*   `DELETE /api/post-images/{image_id}`
    *   **Función:** Eliminar una imagen de una publicación.
    *   **Método:** `DELETE`.
    *   **Acceso:** Requiere Autenticación y **Autorización** (dueño de la publicación a la que pertenece la imagen).
    *   **Respuesta Exitosa:** `204 No Content`.

#### **4. Datos Geográficos (`departments`, `municipalities`)**

Estos son datos de catálogo, generalmente de solo lectura para los usuarios.

*   `GET /api/departments`
    *   **Función:** Listar todos los departamentos.
    *   **Método:** `GET`
    *   **Acceso:** Público.

*   `GET /api/departments/{department_id}/municipalities`
    *   **Función:** Listar todos los municipios de un departamento específico.
    *   **Método:** `GET`
    *   **Acceso:** Público.
    *   **Detalles:** Este diseño es más RESTful que un simple `GET /api/municipalities?department_id=X`.

#### **5. Precios de Referencia (`price_references`)**

Endpoints para consultar datos históricos de precios.

*   `GET /api/price-references`
    *   **Función:** Obtener datos históricos de precios.
    *   **Método:** `GET`
    *   **Acceso:** Público.
    *   **Detalles:** Es fundamental que este endpoint permita filtrar por `product_id`, `municipality_id`, y un rango de fechas (`?start_date=...&end_date=...`). Podría usarse para generar gráficos en el frontend.
    *   **Respuesta Exitosa:** `200 OK`.

*   `POST /api/price-references`
    *   **Función:** Añadir un nuevo registro de precio de referencia.
    *   **Acceso:** **Solo Administradores o roles de confianza.** No debería ser una ruta abierta.

#### **6. Alertas de Precios (`price_alerts`)**

Endpoints para que cada usuario gestione sus propias alertas.

*   `GET /api/my-alerts`
    *   **Función:** Obtener todas las alertas de precios creadas por el usuario autenticado.
    *   **Método:** `GET`
    *   **Acceso:** Requiere Autenticación.
    *   **Respuesta Exitosa:** `200 OK`.

*   `POST /api/my-alerts`
    *   **Función:** Crear una nueva alerta de precio para el usuario autenticado.
    *   **Método:** `POST`
    *   **Acceso:** Requiere Autenticación.
    *   **Request Body:** `condition`, `threshold_price`, `products_product_id`, `municipalities_municipality_id`.
    *   **Respuesta Exitosa:** `201 Created`.

*   `DELETE /api/my-alerts/{alert_id}`
    *   **Función:** Eliminar una alerta de precio.
    *   **Método:** `DELETE`
    *   **Acceso:** Requiere Autenticación y **Autorización** (solo el dueño de la alerta).
    *   **Respuesta Exitosa:** `204 No Content`.

#### **7. Reseñas de Usuarios (`reviews`)**

*   `GET /api/users/{user_id}/reviews`
    *   **Función:** Obtener todas las reseñas hechas a un usuario específico.
    *   **Método:** `GET`
    *   **Acceso:** Público.
    *   **Respuesta Exitosa:** `200 OK`.

*   `POST /api/reviews`
    *   **Función:** Crear una nueva reseña de un usuario a otro.
    *   **Método:** `POST`
    *   **Acceso:** Requiere Autenticación.
    *   **Request Body:** `reviewed_id` (ID del usuario a calificar), `rating`, `comment`. El `reviewer_id` se obtiene del token.
    *   **Detalles:** Se debería implementar lógica de negocio para evitar que un usuario se califique a sí mismo o califique a otro múltiples veces por la misma transacción.
    *   **Respuesta Exitosa:** `201 Created`.

#### **8. Favoritos (`user_publication_favorites`)**

*   `GET /api/my-favorites`
    *   **Función:** Obtener la lista de publicaciones favoritas del usuario autenticado.
    *   **Método:** `GET`
    *   **Acceso:** Requiere Autenticación.
    *   **Respuesta Exitosa:** `200 OK`.

*   `POST /api/my-favorites`
    *   **Función:** Marcar una publicación como favorita.
    *   **Método:** `POST`
    *   **Acceso:** Requiere Autenticación.
    *   **Request Body:** `post_id`.
    *   **Respuesta Exitosa:** `201 Created` o `200 OK` si ya existía.

*   `DELETE /api/my-favorites/{post_id}`
    *   **Función:** Quitar una publicación de la lista de favoritos.
    *   **Método:** `DELETE`
    *   **Acceso:** Requiere Autenticación.
    *   **Respuesta Exitosa:** `204 No Content`.

