# API Documentation

This document provides detailed information about the API endpoints.

## Base URL

All endpoints are prefixed with `/api`.

## Response Structure

All API responses follow a consistent structure.

### Success Response

```json
{
    "success": true,
    "message": "Descriptive message of the result.",
    "data": { ... } // Contains the requested data
}
```

### Paginated Response

``json
{
    "success": true,
    "message": "Descriptive message of the result.",
    "data": [ ... ], // Array of items for the current page
    "pagination": {
        "total": 100,
        "per_page": 15,
        "current_page": 1,
        "last_page": 7,
        "from": 1,
        "to": 15,
        "prev_page_url": null,
        "next_page_url": "http://localhost/api/endpoint?page=2",
        "first_page_url": "http://localhost/api/endpoint?page=1",
        "last_page_url": "http://localhost/api/endpoint?page=7"
    }
}
```

### Error Response

``json
{
    "success": false,
    "message": "Error description.",
    "errors": { ... } // Optional, contains detailed validation errors
}
```

---

## Public Endpoints

These endpoints are accessible without authentication.

### Health Check

- **GET** `/ping`
  - **Description:** Checks if the API is running.
  - **Success Response (200):**
    ```json
    {
      "message": "API ON"
    }
    ```

---

### Authentication

#### Register

- **POST** `/auth/register`
  - **Description:** Creates a new user account.
  - **Request Body:**
    - `name` (string, required, max: 255): User's full name.
    - `email` (string, required, unique, email format): User's email address.
    - `password` (string, required, min: 8, confirmed): User's password.
    - `password_confirmation` (string, required): Confirmation of the password.
    - `phone_number` (string, nullable, max: 100): User's phone number.
    - `address_details` (string, nullable, max: 300): User's address details.
    - `role_id` (integer, required, exists in `roles` table): The ID for the user's role.
  - **Success Response (201):** The `data` object contains the `UserResource` and token information.
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone_number": "1234567890",
          "address_details": "123 Main St",
          "is_verified": false,
          "email_verified_at": null,
          "created_at": "2025-10-01T12:00:00.000000Z",
          "updated_at": "2025-10-01T12:00:00.000000Z",
          "role": {
            "id": 2,
            "name": "user"
          }
        },
        "access_token": "your_auth_token",
        "token_type": "Bearer"
      }
    }
    ```
  - **Error Response (422):** If validation fails.

#### Login

- **POST** `/auth/login`
  - **Description:** Authenticates a user and returns an access token.
  - **Request Body:**
    - `email` (string, required, email format): User's email address.
    - `password` (string, required, min: 8): User's password.
  - **Success Response (200):** The `data` object contains the `UserResource` and token information.
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone_number": "1234567890",
          "address_details": "123 Main St",
          "is_verified": true,
          "email_verified_at": "2025-09-30T10:00:00.000000Z",
          "created_at": "2025-09-30T10:00:00.000000Z",
          "updated_at": "2025-10-01T12:00:00.000000Z",
          "role": {
            "id": 2,
            "name": "user"
          }
        },
        "access_token": "your_auth_token",
        "token_type": "Bearer"
      }
    }
    ```
  - **Error Response (401):** If credentials are invalid.

---

## Protected Endpoints

These endpoints require authentication. You must include an `Authorization` header with the value `Bearer {your_access_token}`.

### Authentication

#### Get Profile

- **GET** `/auth/profile`
  - **Description:** Retrieves the authenticated user's profile information.
  - **Success Response (200):** The `data` object contains the `UserResource`.
    ```json
    {
      "success": true,
      "message": "Profile data obtained successfully",
      "data": {
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone_number": "1234567890",
          "address_details": "123 Main St",
          "is_verified": true,
          "email_verified_at": "2025-09-30T10:00:00.000000Z",
          "created_at": "2025-09-30T10:00:00.000000Z",
          "updated_at": "2025-10-01T12:00:00.000000Z",
          "role": {
            "id": 2,
            "name": "user"
          }
        }
      }
    }
    ```

#### Update Profile

- **PUT** `/auth/profile`
  - **Description:** Updates the authenticated user's profile information. All fields are optional.
  - **Request Body:**
    - `name` (string, optional, max: 255): User's new full name.
    - `email` (string, optional, unique, email format): User's new email address.
    - `password` (string, optional, min: 8, confirmed): User's new password.
    - `password_confirmation` (string, optional): Confirmation of the new password.
    - `phone_number` (string, nullable, max: 100): User's new phone number.
    - `address_details` (string, nullable, max: 300): User's new address details.
    - `role_id` (integer, optional, exists in `roles` table): The new ID for the user's role.
  - **Success Response (200):** The `data` object contains the updated `UserResource`.
    ```json
    {
      "success": true,
      "message": "Profile updated successfully",
      "data": {
        "user": {
          "id": 1,
          "name": "Updated Name",
          "email": "updated.email@example.com"
          // ... other updated details
        }
      }
    }
    ```

#### Logout

- **POST** `/auth/logout`
  - **Description:** Revokes the current access token, effectively logging the user out from the current device.
  - **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Session closed successfully",
      "data": null
    }
    ```

#### Logout from All Devices

- **POST** `/auth/logout-all`
  - **Description:** Revokes all access tokens for the user, logging them out from all devices.
  - **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "All sessions closed successfully",
      "data": null
    }
    ```

---

### Users

#### Get Public User Profile

- **GET** `/users/{user}`
  - **Description:** Retrieves the public profile of a specific user.
  - **URL Parameters:**
    - `user` (integer, required): The ID of the user.
  - **Success Response (200):** The `data` object contains a `PublicUserResource`.
    ```json
    {
      "success": true,
      "message": "Public profile obtained successfully",
      "data": {
        "user": {
          "user_id": 2,
          "name": "Jane Doe",
          "created_at": "2025-09-28T10:00:00.000000Z",
          "role": {
            "id": 2,
            "name": "user"
          },
          "average_rating": 4.5,
          "reviews_count": 10,
          "member_since": "2025-09-28"
        }
      }
    }
    ```

---

### Products

#### List Products

- **GET** `/products`
  - **Description:** Retrieves a paginated list of products. Supports filtering, searching, and sorting.
  - **Query Parameters:**
    - `search` (string, optional): A search term to filter products by name or description.
    - `product_type_id` (integer, optional): The ID of a product type to filter by.
    - `sort_by` (string, optional, default: 'name'): The field to sort by. Allowed values: `name`, `created_at`, `updated_at`.
    - `sort_order` (string, optional, default: 'asc'): The sort order. Allowed values: `asc`, `desc`.
    - `per_page` (integer, optional, default: 15): The number of items per page (min: 1, max: 100).
    - `page` (integer, optional, default: 1): The page number.
  - **Success Response (200):** A paginated response where the `data` array contains a list of `ProductResource` objects.
    ```json
    {
      "success": true,
      "message": "Products obtained successfully",
      "data": [
        {
          "id": 1,
          "name": "Organic Apples",
          "description": "Fresh and juicy organic apples.",
          "image_url": "http://example.com/images/apples.jpg",
          "product_type": {
            "id": 1,
            "type_name": "Fruit",
            "description": "Edible sweet plant products."
          },
          "created_at": "2025-10-01T12:00:00.000000Z",
          "updated_at": "2025-10-01T12:00:00.000000Z"
        }
        // ... other products
      ],
      "pagination": {
        "total": 50,
        "per_page": 15,
        "current_page": 1,
        "last_page": 4,
        "from": 1,
        "to": 15,
        "prev_page_url": null,
        "next_page_url": "http://localhost/api/products?page=2",
        "first_page_url": "http://localhost/api/products?page=1",
        "last_page_url": "http://localhost/api/products?page=4"
      }
    }
    ```

---

#### Get Product Details

- **GET** `/products/{product}`
  - **Description:** Get details for a single product, including statistics built from related posts (supply/demand).
  - **Access:** Public
  - **URL Parameters:**
    - `product` (integer, required): Product ID.
  - **Success Response (200):** Returns a single product object with `stats` derived from `posts`.
    ```json
    {
      "success": true,
      "message": "Detalles del producto obtenidos exitosamente",
      "data": {
        "id": 1,
        "name": "Organic Apples",
        "description": "Fresh and juicy organic apples.",
        "image_url": "http://example.com/images/apples.jpg",
        "product_type": {
          "id": 1,
          "type_name": "Fruit",
          "description": "Edible sweet plant products."
        },
        "created_at": "2025-10-01T12:00:00.000000Z",
        "updated_at": "2025-10-01T12:00:00.000000Z",
        "stats": {
          "supply": {
            "total_posts": 10,
            "total_quantity_kg": 2500,
            "average_price_per_kg": 1.5,
            "last_3_posts": [
              /* ... */
            ]
          },
          "demand": {
            "total_posts": 7,
            "total_quantity_kg": 900,
            "average_price_per_kg": 1.7,
            "last_3_posts": [
              /* ... */
            ]
          }
        }
      }
    }
    ```

---

#### Admin-only: Create Product

- **POST** `/products`
  - **Description:** Create a new product. Restricted to admin users via the `admin` middleware.
  - **Access:** Protected — requires `auth:sanctum` and `admin` middleware (user must have `is_admin = true`).
  - **Request Body (StoreProductRequest):**
    - `name` (string, required, max:255, unique:products,name)
    - `description` (string, required, max:1000)
    - `image_url` (string, optional, url, max:500)
    - `product_type_id` (integer, required, exists:products_type,id)
  - **Success Response (201):** Returns created product resource.
    ```json
    {
      "success": true,
      "message": "Producto creado exitosamente",
      "data": {
        /* ProductResource */
      }
    }
    ```
  - **Error Responses:**
    - `401 Unauthorized` (not authenticated)
      ```json
      { "success": false, "message": "No estás autenticado." }
      ```
    - `403 Forbidden` (authenticated but not admin)
      ```json
      {
        "success": false,
        "message": "No tienes permisos para realizar esta acción. Solo administradores."
      }
      ```
    - `422 Unprocessable Entity` (validation failure)
      ```json
      {
        "success": false,
        "message": "The given data was invalid.",
        "errors": {
          "name": ["The name field is required."],
          "product_type_id": ["The selected product type is invalid."]
        }
      }
      ```

---

#### Admin-only: Update Product

- **PUT** `/products/{product}`
  - **Description:** Update an existing product. Restricted to admin users via the `admin` middleware.
  - **Access:** Protected — requires `auth:sanctum` and `admin` middleware.
  - **URL Parameters:** `product` (integer, required)
  - **Request Body (UpdateProductRequest):** Any of the following (all optional but validated when present):
    - `name` (string, sometimes|required, max:255, unique except current)
    - `description` (string, nullable, max:1000)
    - `image_url` (string, nullable, url, max:500)
    - `product_type_id` (integer, sometimes|required, exists:products_type,id)
  - **Success Response (200):** Returns updated product resource.
    ```json
    {
      "success": true,
      "message": "Producto actualizado exitosamente",
      "data": {
        /* ProductResource */
      }
    }
    ```
  - **Error Responses:** `401`, `403`, `422` (same shapes as Create)

---

#### Admin-only: Delete Product

- **DELETE** `/products/{product}`
  - **Description:** Deletes a product. Restricted to admin users via the `admin` middleware. Deletion is prevented if the product has related posts.
  - **Access:** Protected — requires `auth:sanctum` and `admin` middleware.
  - **URL Parameters:** `product` (integer, required)
  - **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Producto eliminado exitosamente",
      "data": null
    }
    ```
  - **Error Responses:**
    - `401`, `403` as above
    - `409 Conflict` if the product has associated posts:
      ```json
      {
        "success": false,
        "message": "No se puede eliminar el producto porque tiene publicaciones asociadas"
      }
      ```

---

Notes about the `admin` middleware and behavior

- The project includes an `EnsureUserIsAdmin` middleware that checks the authenticated user's `is_admin` flag.
- Middleware responses follow the API response pattern and return `401` if not authenticated, or `403` if authenticated but not an admin.
- Example middleware response when not admin:
  ```json
  {
    "success": false,
    "message": "No tienes permisos para realizar esta acción. Solo administradores."
  }
  ```

Security and usage tips

- Always call the protected routes with an `Authorization: Bearer {token}` header obtained from `POST /auth/login`.
- The `StoreProductRequest` and `UpdateProductRequest` include human-friendly error messages; validation failures return a `422` with the `errors` object mapping fields to messages.

## Posts

### List Posts (with Cursor Pagination)

- **GET** `/posts`
  - **Description:** Retrieves a cursor-paginated list of posts. Supports filtering, searching and sorting. By default returns posts with status `ACTIVE`.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **Query Parameters:**
    - `search` (string, optional, max:255): Search term to filter posts by title or description.
    - `product_id` (integer, optional, exists:products,id): Filter posts by a specific product.
    - `municipality_id` (integer, optional, exists:municipalities,id): Filter posts by a specific municipality.
    - `post_type_id` (integer, optional, exists:post_types,id): Filter posts by type (e.g., sale or purchase).
    - `user_id` (integer, optional, exists:users,id): Filter posts by the user who created them.
    - `status` (string, optional, in:ACTIVE,CLOSED,EXPIRED, default: `ACTIVE`): Filter posts by status.
    - `sort_by` (string, optional, in:created_at,price_per_kg,quantity_kg,title,updated_at, default:`created_at`): Field to sort by. Must remain the same across paginated requests.
    - `sort_order` (string, optional, in:asc,desc, default:`desc`): Sort direction.
    - `per_page` (integer, optional, min:1, max:100, default:15): Number of items per page.
    - `cursor` (string, optional): Opaque cursor string used for cursor pagination. Use `pagination.next_cursor` / `pagination.prev_cursor` from the previous response.
  - **Success Response (200):** A cursor-paginated response where the `data` array contains a list of `PostResource` objects.

```json
{
  "success": true,
  "message": "Publicaciones obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "title": "Vendo Café Orgánico",
      "description": "Café de alta calidad de la región",
      "quantity_kg": 100.0,
      "price_per_kg": 8500.0,
      "total_price": 850000.0,
      "status": "ACTIVE",
      "post_type": {
        "id": 1,
        "name": "Venta",
        "description": "Publicación de venta de productos"
      },
      "product": {
        "id": 5,
        "name": "Café",
        "description": "Café colombiano",
        "image_url": "https://example.com/cafe.jpg",
        "product_type": {
          "id": 1,
          "name": "Agrícola",
          "description": "Tipo de producto"
        }
      },
      "user": {
        "id": 10,
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "phone_number": "+57 300 123 4567",
        "address_details": "Calle 10 #20-30",
        "is_verified": true
      },
      "municipality": {
        "id": 120,
        "name": "Cali"
      },
      "images": [
        {
          "id": 1,
          "url": "https://example.com/image1.jpg"
        }
      ],
      "favorites_count": 5,
      "is_favorited": false,
      "created_at": "2025-10-01T10:00:00.000000Z",
      "updated_at": "2025-10-01T10:00:00.000000Z"
    }
  ],
  "pagination": {
    "per_page": 15,
    "next_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNS0xMC0wMSAxMDowMDowMCIsImlkIjoxNSwiX3BvaW50c1RvTmV4dEl0ZW1zIjp0cnVlfQ",
    "prev_cursor": null,
    "next_page_url": "http://localhost/api/posts?cursor=eyJjcmVhdGVk...",
    "prev_page_url": null,
    "has_more_pages": true
  },
  "filters_applied": {
    "search": null,
    "product_id": null,
    "municipality_id": null,
    "post_type_id": null,
    "user_id": null,
    "status": "ACTIVE"
  },
  "sort_applied": {
    "sort_by": "created_at",
    "sort_order": "desc"
  }
}
```

- **Error Response (422):** If validation fails.

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "product_id": ["El producto seleccionado no existe."],
    "sort_by": [
      "El campo de ordenamiento no es válido. Valores permitidos: created_at, price_per_kg, quantity_kg, title, updated_at."
    ]
  }
}
```


---

### Notes on Cursor Pagination

- **Cursor-based pagination** is used instead of traditional offset-based pagination for better performance and consistency, especially with large datasets or when data is frequently changing.
- The `cursor` parameter is an opaque, encoded string that represents a specific position in the dataset. Clients should not attempt to modify or decode this value.
- To navigate through pages:
  1. Make an initial request without a `cursor` parameter to get the first page.
  2. Use the `pagination.next_cursor` value from the response to fetch the next page.
  3. Use the `pagination.prev_cursor` value to navigate back to the previous page.
  4. Check `pagination.has_more_pages` to determine if additional pages are available.
- Unlike offset pagination, cursor pagination does not provide a total count or specific page numbers, but it ensures consistent results even when new records are added or removed between requests.
- The `sort_by` field must always be consistent across paginated requests. Changing the sort order mid-pagination will result in inconsistent results.

Notes / implementation details to keep in mind:

- The endpoint is registered under the `auth:sanctum` middleware in `routes/api.php` — you must provide a valid bearer token.
- `is_favorited` is evaluated only when an authenticated user is present; it checks whether the current user has favorited the post and returns a boolean.
- `favorites_count` is returned when the `favoritedBy` relation is loaded; otherwise the resource returns `0` by default.
- The `images` returned by the resource include `id` and `url` (the resource maps the image model to `url`).
- The response `pagination` object follows the shape produced by the API trait's `cursorPaginatedResponse`: `per_page`, `next_cursor`, `prev_cursor`, `next_page_url`, `prev_page_url`, `has_more_pages`.


### Create Post (with Images)

- **POST** `/posts`
  - **Description:** Creates a new post (publication) with optional image upload. Only authenticated users can create posts.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **Request Body (multipart/form-data):**
    - `title` (string, required, max: 100): Title of the post.
    - `description` (string, optional, max: 400): Description of the post.
    - `quantity_kg` (number, required, min: 0.01, max: 999999.99): Quantity in kilograms.
    - `price_per_kg` (number, required, min: 0.01, max: 999999.99): Price per kilogram.
    - `post_type_id` (integer, required, exists:post_types,id): Type of post (sale/purchase).
    - `product_id` (integer, required, exists:products,id): Product ID.
    - `municipality_id` (integer, required, exists:municipalities,id): Municipality ID.
    - `images` (array of files, optional, max: 5): Up to 5 images. Each must be jpeg, png, jpg, or webp, max 5MB each.

  - **Validation Rules:**
    - All fields are validated as described above. See error messages for details.
    - Images must be sent as an array: `images[]`.

  - **Example Request (multipart/form-data):**
    ```http
    POST /api/posts
    Authorization: Bearer {token}
    Content-Type: multipart/form-data

    title: "Vendo Café Orgánico"
    description: "Café de alta calidad de la región"
    quantity_kg: 100.0
    price_per_kg: 8500.0
    post_type_id: 1
    product_id: 5
    municipality_id: 120
    images[]: [file1.jpg, file2.png]
    ```

  - **Success Response (201):** Returns the created post as a `PostResource`.
    ```json
    {
      "success": true,
      "message": "Publicación creada exitosamente",
      "data": {
        "id": 1,
        "title": "Vendo Café Orgánico",
        "description": "Café de alta calidad de la región",
        "quantity_kg": 100.0,
        "price_per_kg": 8500.0,
        "total_price": 850000.0,
        "status": "ACTIVE",
        "post_type": {
          "id": 1,
          "name": "Venta",
          "description": "Publicación de venta de productos"
        },
        "product": {
          "id": 5,
          "name": "Café",
          "description": "Café colombiano",
          "image_url": "https://example.com/cafe.jpg",
          "product_type": {
            "id": 1,
            "name": "Agrícola",
            "description": "Tipo de producto"
          }
        },
        "user": {
          "id": 10,
          "name": "Juan Pérez",
          "email": "juan@example.com",
          "phone_number": "+57 300 123 4567",
          "address_details": "Calle 10 #20-30",
          "is_verified": true
        },
        "municipality": {
          "id": 120,
          "name": "Cali"
        },
        "images": [
          {
            "id": 1,
            "url": "https://example.com/image1.jpg"
          },
          {
            "id": 2,
            "url": "https://example.com/image2.jpg"
          }
        ],
        "favorites_count": 0,
        "is_favorited": false,
        "created_at": "2025-10-01T10:00:00.000000Z",
        "updated_at": "2025-10-01T10:00:00.000000Z"
      }
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "title": ["El título de la publicación es obligatorio."],
        "images": ["No puedes subir más de 5 imágenes."],
        "images.0": ["Cada archivo debe ser una imagen."],
        "images.1": ["Las imágenes deben ser de tipo: jpeg, png, jpg o webp."]
      }
    }
    ```

  - **Notes:**
    - The post is always created with status `ACTIVE`.
    - Images are uploaded and stored; their URLs are returned in the response.
    - If an error occurs after uploading images, the API will attempt to delete any uploaded images.
    - The authenticated user is set as the post owner (`user_id`).


### Get Post Details

- **GET** `/posts/{post}`
  - **Description:** Retrieves the details of a specific post by its ID.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `post` (integer, required): The ID of the post.
  - **Success Response (200):** Returns a single post object as a `PostResource`.
    ```json
    {
      "success": true,
      "message": "Detalles de la publicación obtenidos exitosamente",
      "data": {
        "id": 1,
        "title": "Vendo Café Orgánico",
        "description": "Café de alta calidad de la región",
        "quantity_kg": 100.0,
        "price_per_kg": 8500.0,
        "total_price": 850000.0,
        "status": "ACTIVE",
        "post_type": {
          "id": 1,
          "name": "Venta",
          "description": "Publicación de venta de productos"
        },
        "product": {
          "id": 5,
          "name": "Café",
          "description": "Café colombiano",
          "image_url": "https://example.com/cafe.jpg",
          "product_type": {
            "id": 1,
            "name": "Agrícola",
            "description": "Tipo de producto"
          }
        },
        "user": {
          "id": 10,
          "name": "Juan Pérez",
          "email": "juan@example.com",
          "phone_number": "+57 300 123 4567",
          "address_details": "Calle 10 #20-30",
          "is_verified": true
        },
        "municipality": {
          "id": 120,
          "name": "Cali"
        },
        "images": [
          {
            "id": 1,
            "url": "https://example.com/image1.jpg"
          }
        ],
        "favorites_count": 5,
        "is_favorited": false,
        "created_at": "2025-10-01T10:00:00.000000Z",
        "updated_at": "2025-10-01T10:00:00.000000Z"
      }
    }
    ```

---

### Update Post

- **PUT** `/posts/{post}` (or POST with `_method=PUT` for form data)
  - **Description:** Updates an existing post. Only the owner of the post can update it.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `post` (integer, required): The ID of the post to update.
  - **Request Body (multipart/form-data or application/json):**
    - `title` (string, optional, max: 100): Title of the post.
    - `description` (string, optional, max: 400): Description of the post.
    - `quantity_kg` (number, optional, min: 0.01, max: 999999.99): Quantity in kilograms.
    - `price_per_kg` (number, optional, min: 0.01, max: 999999.99): Price per kilogram.
    - `post_type_id` (integer, optional, exists:post_types,id): Type of post (sale/purchase).
    - `product_id` (integer, optional, exists:products,id): Product ID.
    - `municipality_id` (integer, optional, exists:municipalities,id): Municipality ID.
    - `images` (array of files, optional, max: 5): Additional images to add to the post. Each must be jpeg, png, jpg, or webp, max 5MB each.
    - `_method` (string, optional): Set to "PUT" when using POST method to simulate PUT request (required for multipart/form-data).

  - **Validation Rules:**
    - Only the owner of the post can update it.
    - All fields are optional but validated when present.
    - Images must be sent as an array: `images[]`.

  - **Example Request (multipart/form-data):**
    ```http
    POST /api/posts/1
    Authorization: Bearer {token}
    Content-Type: multipart/form-data

    _method: PUT
    title: "Vendo Café Orgánico Premium"
    description: "Café de alta calidad de la región, cosecha especial"
    quantity_kg: 150.0
    price_per_kg: 9000.0
    images[]: [new_image.jpg]
    ```

  - **Success Response (200):** Returns the updated post as a `PostResource`.
    ```json
    {
      "success": true,
      "message": "Publicación actualizada exitosamente",
      "data": {
        "id": 1,
        "title": "Vendo Café Orgánico Premium",
        "description": "Café de alta calidad de la región, cosecha especial",
        "quantity_kg": 150.0,
        "price_per_kg": 9000.0,
        "total_price": 1350000.0,
        "status": "ACTIVE",
        "post_type": {
          "id": 1,
          "name": "Venta",
          "description": "Publicación de venta de productos"
        },
        "product": {
          "id": 5,
          "name": "Café",
          "description": "Café colombiano",
          "image_url": "https://example.com/cafe.jpg",
          "product_type": {
            "id": 1,
            "name": "Agrícola",
            "description": "Tipo de producto"
          }
        },
        "user": {
          "id": 10,
          "name": "Juan Pérez",
          "email": "juan@example.com",
          "phone_number": "+57 300 123 4567",
          "address_details": "Calle 10 #20-30",
          "is_verified": true
        },
        "municipality": {
          "id": 120,
          "name": "Cali"
        },
        "images": [
          {
            "id": 1,
            "url": "https://example.com/image1.jpg"
          },
          {
            "id": 3,
            "url": "https://example.com/new_image.jpg"
          }
        ],
        "favorites_count": 5,
        "is_favorited": false,
        "created_at": "2025-10-01T10:00:00.000000Z",
        "updated_at": "2025-10-02T15:30:00.000000Z"
      }
    }
    ```

  - **Error Response (403):** If the user is not the owner of the post.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para editar esta publicación."
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "title": ["El título no debe exceder los 100 caracteres."],
        "images": ["No puedes subir más de 5 imágenes."],
        "images.0": ["Cada archivo debe ser una imagen."],
        "product_id": ["El producto seleccionado no existe."]
      }
    }
    ```

  - **Notes:**
    - Only the owner of the post can update it.
    - All fields are optional; only provided fields will be updated.

---

### Delete Post

- **DELETE** `/posts/{post}`
  - **Description:** Deletes an existing post. Only the owner of the post can delete it.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `post` (integer, required): The ID of the post to delete.
  - **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Publicación eliminada exitosamente",
      "data": null
    }
    ```

  - **Error Response (403):** If the user is not the owner of the post.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para eliminar esta publicación."
    }
    ```

  - **Notes:**
    - Only the owner of the post can delete it.
    - Once deleted, a post cannot be recovered.

## Reviews

### List Reviews

- **GET** `/posts/{post}/reviews`
  - **Description:** Retrieves the list of reviews for a specific post.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `post` (integer, required): The ID of the post.
  - **Success Response (200):** Returns an array of review objects.
    ```json
    {
      "success": true,
      "message": "Lista de reseñas obtenida exitosamente",
      "data": [
        {
          "id": 1,
          "user": {
            "id": 15,
            "name": "Pedro Gómez",
            "email": "pedro@example.com",
            "phone_number": "+57 310 456 7890",
            "address_details": "Calle 15 #30-40",
            "is_verified": false
          },
          "post": {
            "id": 1,
            "title": "Vendo Café Orgánico",
            "description": "Café de alta calidad de la región",
            "quantity_kg": 100.0,
            "price_per_kg": 8500.0,
            "total_price": 850000.0,
            "status": "ACTIVE",
            "post_type": {
              "id": 1,
              "name": "Venta",
              "description": "Publicación de venta de productos"
            },
            "product": {
              "id": 5,
              "name": "Café",
              "description": "Café colombiano",
              "image_url": "https://example.com/cafe.jpg",
              "product_type": {
                "id": 1,
                "name": "Agrícola",
                "description": "Tipo de producto"
              }
            },
            "user": {
              "id": 10,
              "name": "Juan Pérez",
              "email": "juan@example.com",
              "phone_number": "+57 300 123 4567",
              "address_details": "Calle 10 #20-30",
              "is_verified": true
            },
            "municipality": {
              "id": 120,
              "name": "Cali"
            },
            "images": [
              {
                "id": 1,
                "url": "https://example.com/image1.jpg"
              }
            ],
            "favorites_count": 5,
            "is_favorited": false,
            "created_at": "2025-10-01T10:00:00.000000Z",
            "updated_at": "2025-10-01T10:00:00.000000Z"
          },
          "comment": "Excelente café, muy rico y de buena calidad.",
          "rating": 5,
          "date": "2025-10-03T16:45:00.000000Z"
        }
      ]
    }
    ```

  - **Notes:**
    - This endpoint only returns reviews for the specified post.
    - The response includes full user and post details with all relationships loaded.

---

### Add Review

- **POST** `/posts/{post}/reviews`
  - **Description:** Adds a new review to a specific post.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `post` (integer, required): The ID of the post.
  - **Request Body (application/json):**
    - `comment` (string, optional, max: 255): Comment of the review.
    - `rating` (integer, required, min: 1, max: 5): Rating of the review (1 to 5 stars).

  - **Validation Rules:**
    - All fields are validated as described above. See error messages for details.
    - Only authenticated users can add reviews.

  - **Example Request (application/json):**
    ```http
    POST /api/posts/1/reviews
    Authorization: Bearer {token}
    Content-Type: application/json

    {
      "comment": "Excelente café!",
      "rating": 4
    }
    ```

  - **Success Response (201):**
    ```json
    {
      "success": true,
      "message": "Reseña agregada exitosamente",
      "data": {
        "user_id": 15,
        "post_id": 1,
        "comment": "Excelente café!",
        "rating": 4,
        "date": "2025-10-04T18:00:00.000000Z"
      }
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "comment": ["El comentario no debe exceder los 255 caracteres."],
        "rating": ["El rating es obligatorio."]
      }
    }
    ```

  - **Notes:**
    - Users can add reviews to any existing post.
    - The `user_id` is automatically set to the authenticated user's ID.
    - The `date` is automatically set to the current timestamp.

---

### Delete Review

- **DELETE** `/posts/{post}/reviews/{review}`
  - **Description:** Deletes a specific review from a post.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `post` (integer, required): The ID of the post.
    - `review` (integer, required): The ID of the review.

  - **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Reseña eliminada exitosamente",
      "data": null
    }
    ```

  - **Error Response (403):** If the user is not the reviewer of the review.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para eliminar esta reseña."
    }
    ```

  - **Notes:**
    - Only the reviewer of the review can delete it.
    - Once deleted, a review cannot be recovered.

## Favorites

### List My Favorites

- **GET** `/my-favorites`
  - **Description:** Retrieves the list of favorite publications for the authenticated user.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **Success Response (200):** Returns an array of favorite post objects.
    ```json
    {
      "success": true,
      "message": "Lista de publicaciones favoritas obtenida exitosamente",
      "data": [
        {
          "id": 1,
          "title": "Vendo Café Orgánico",
          "description": "Café de alta calidad de la región",
          "quantity_kg": 100.0,
          "price_per_kg": 8500.0,
          "total_price": 850000.0,
          "status": "ACTIVE",
          "post_type": {
            "id": 1,
            "name": "Venta",
            "description": "Publicación de venta de productos"
          },
          "product": {
            "id": 5,
            "name": "Café",
            "description": "Café colombiano",
            "image_url": "https://example.com/cafe.jpg",
            "product_type": {
              "id": 1,
              "name": "Agrícola",
              "description": "Tipo de producto"
            }
          },
          "user": {
            "id": 10,
            "name": "Juan Pérez",
            "email": "juan@example.com",
            "phone_number": "+57 300 123 4567",
            "address_details": "Calle 10 #20-30",
            "is_verified": true
          },
          "municipality": {
            "id": 120,
            "name": "Cali"
          },
          "images": [
            {
              "id": 1,
              "url": "https://example.com/image1.jpg"
            }
          ],
          "favorites_count": 5,
          "is_favorited": true,
          "created_at": "2025-10-01T10:00:00.000000Z",
          "updated_at": "2025-10-01T10:00:00.000000Z"
        }
      ]
    }
    ```

  - **Notes:**
    - This endpoint only returns posts that the authenticated user has marked as favorites.
    - The response includes full post details with all relationships loaded.
    - The `is_favorited` field will always be `true` for these posts.

---

### Add to Favorites

- **POST** `/my-favorites`
  - **Description:** Mark a publication as favorite.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **Request Body (application/json):**
    - `post_id` (integer, required, exists:posts,id): The ID of the post to mark as favorite.

  - **Success Response (201):** If the post was not previously favorited.
    ```json
    {
      "success": true,
      "message": "Publicación añadida a favoritos exitosamente",
      "data": {
        "user_id": 15,
        "post_id": 1,
        "date": "2025-10-05T14:30:00.000000Z"
      }
    }
    ```

  - **Success Response (200):** If the post was already favorited.
    ```json
    {
      "success": true,
      "message": "La publicación ya está en tus favoritos",
      "data": null
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "post_id": ["El ID de la publicación es obligatorio."],
        "post_id.exists": ["La publicación seleccionada no existe."]
      }
    }
    ```

  - **Notes:**
    - Users can favorite any existing post.
    - If a post is already favorited, the endpoint returns a 200 status with a message.
    - The `user_id` is automatically set to the authenticated user's ID.
    - The `date` is automatically set to the current timestamp.

---

### Remove from Favorites

- **DELETE** `/my-favorites/{postId}`
  - **Description:** Remove a publication from the favorites list.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `postId` (integer, required): The ID of the post to remove from favorites.

  - **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Publicación eliminada de favoritos exitosamente",
      "data": null
    }
    ```

  - **Error Response (404):** If the post doesn't exist or is not in favorites.
    ```json
    {
      "success": false,
      "message": "La publicación no está en tus favoritos."
    }
    ```

  - **Notes:**
    - Only the authenticated user can remove posts from their favorites.
    - If the post doesn't exist, a different error message is returned.
    - Once removed, the post will no longer appear in the user's favorites list.

    - New images can be added but existing images cannot be removed through this endpoint.
    - The `updated_at` timestamp is automatically updated.
    - When sending form data (multipart/form-data), you must use the POST method with `_method=PUT` parameter to simulate a PUT request due to Laravel's handling of form data with PUT requests.
    - When sending JSON data, you can use the standard PUT method.

---

### Delete Post

- **DELETE** `/posts/{post}`
  - **Description:** Deletes a post and all associated images. Only the owner of the post can delete it.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `post` (integer, required): The ID of the post to delete.
  - **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Publicación eliminada exitosamente",
      "data": null
    }
    ```

  - **Error Response (403):** If the user is not the owner of the post.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para eliminar esta publicación."
    }
    ```

  - **Error Response (500):** If there's an error during deletion.
    ```json
    {
      "success": false,
      "message": "Error al eliminar la publicación. Por favor, intenta nuevamente."
    }
    ```

  - **Notes:**
    - Only the owner of the post can delete it.
    - All associated images are deleted from both the database and storage.
    - This operation is performed within a database transaction to ensure consistency.
    - Once deleted, a post cannot be recovered.

---

### Add Image to Post

- **POST** `/posts/{post}/images`
  - **Description:** Adds an image to an existing post. Only the owner of the post can add images.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `post` (integer, required): The ID of the post to which the image will be added.
  - **Request Body (multipart/form-data):**
    - `image` (file, required): The image file to upload. Must be jpeg, png, jpg, or webp, max 5MB.

  - **Validation Rules:**
    - Only the owner of the post can add images.
    - Posts can have a maximum of 5 images.
    - Image must be in jpeg, png, jpg, or webp format.
    - Image size must not exceed 5MB.

  - **Example Request (multipart/form-data):**
    ```http
    POST /api/posts/1/images
    Authorization: Bearer {token}
    Content-Type: multipart/form-data

    image: [image_file.jpg]
    ```

  - **Success Response (201):** Returns the created image object.
    ```json
    {
      "success": true,
      "message": "Imagen añadida exitosamente",
      "data": {
        "id": 5,
        "post_id": 1,
        "image_url": "http://localhost/storage/posts/1/1700000000_a1b2c3d4e5.jpg",
        "created_at": "2025-10-02T15:30:00.000000Z",
        "updated_at": "2025-10-02T15:30:00.000000Z"
      }
    }
    ```

  - **Error Response (403):** If the user is not the owner of the post.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para añadir imágenes a esta publicación."
    }
    ```

  - **Error Response (422):** If validation fails or the post already has 5 images.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "image": ["La imagen es obligatoria."]
      }
    }
    ```
    or
    ```json
    {
      "success": false,
      "message": "No puedes añadir más de 5 imágenes a una publicación."
    }
    ```

  - **Error Response (500):** If there's an error during the upload process.
    ```json
    {
      "success": false,
      "message": "Error al añadir la imagen. Por favor, intenta nuevamente."
    }
    ```

  - **Notes:**
    - Only the owner of the post can add images.
    - Posts can have a maximum of 5 images.
    - Images are stored in the `storage/app/public/posts/{post_id}` directory.
    - Image filenames are automatically generated to prevent conflicts.

---

### Delete Post Image

- **DELETE** `/posts/images/{image}`
  - **Description:** Deletes an image from a post. Only the owner of the post can delete its images.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `image` (integer, required): The ID of the image to delete.
  - **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Imagen eliminada exitosamente",
      "data": null
    }
    ```

  - **Error Response (403):** If the user is not the owner of the post to which the image belongs.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para eliminar esta imagen."
    }
    ```

  - **Error Response (500):** If there's an error during deletion.
    ```json
    {
      "success": false,
      "message": "Error al eliminar la imagen. Por favor, intenta nuevamente."
    }
    ```

  - **Notes:**
    - Only the owner of the post can delete its images.
    - The image is deleted from both the database and storage.
    - Once deleted, an image cannot be recovered.

## Price References

### List Price References

- **GET** `/price-references`
  - **Description:** Retrieves a list of price references. Supports filtering by product, municipality, and date range.
  - **Access:** Public
  - **Query Parameters:**
    - `product_id` (integer, optional, exists:products,id): Filter price references by a specific product.
    - `municipality_id` (integer, optional, exists:municipalities,id): Filter price references by a specific municipality.
    - `start_date` (date, optional): Filter price references from this date onwards (format: YYYY-MM-DD).
    - `end_date` (date, optional): Filter price references up to this date (format: YYYY-MM-DD).
    - `sort_by` (string, optional, in:date,price_per_kg,created_at, default:`date`): Field to sort by.
    - `sort_order` (string, optional, in:asc,desc, default:`desc`): Sort direction.

  - **Success Response (200):** Returns an array of price reference objects.
    ```json
    {
      "success": true,
      "message": "Referencias de precios obtenidas exitosamente",
      "data": [
        {
          "id": 1,
          "price_per_kg": 2500.00,
          "date": "2025-10-01",
          "source": "Mercado Central",
          "product_id": 5,
          "municipality_id": 120,
          "created_at": "2025-10-01T10:00:00.000000Z",
          "updated_at": "2025-10-01T10:00:00.000000Z",
          "product": {
            "id": 5,
            "name": "Café",
            "description": "Café colombiano"
          },
          "municipality": {
            "id": 120,
            "name": "Cali"
          }
        }
      ],
      "filters_applied": {
        "product_id": null,
        "municipality_id": null,
        "start_date": null,
        "end_date": null
      },
      "sort_applied": {
        "sort_by": "date",
        "sort_order": "desc"
      }
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "product_id": ["El producto seleccionado no existe."],
        "start_date": ["La fecha de inicio debe ser una fecha válida."],
        "sort_by": ["El campo de ordenamiento no es válido."]
      }
    }
    ```

  - **Notes:**
    - This endpoint is public and doesn't require authentication.
    - Results are ordered by date descending by default.
    - All filters are optional and can be combined.
    - Date range filters can be used independently (only start_date, only end_date, or both).
    - The response includes `filters_applied` and `sort_applied` objects showing which filters and sorting options were applied.

---

### Get Price Reference Details

- **GET** `/price-references/{priceReference}`
  - **Description:** Retrieves the details of a specific price reference by its ID.
  - **Access:** Public
  - **URL Parameters:**
    - `priceReference` (integer, required): The ID of the price reference.
  - **Success Response (200):** Returns a single price reference object.
    ```json
    {
      "success": true,
      "message": "Detalles de la referencia de precio obtenidos exitosamente",
      "data": {
        "id": 1,
        "price_per_kg": 2500.00,
        "date": "2025-10-01",
        "source": "Mercado Central",
        "product_id": 5,
        "municipality_id": 120,
        "created_at": "2025-10-01T10:00:00.000000Z",
        "updated_at": "2025-10-01T10:00:00.000000Z",
        "product": {
          "id": 5,
          "name": "Café",
          "description": "Café colombiano"
        },
        "municipality": {
          "id": 120,
          "name": "Cali"
        }
      }
    }
    ```

  - **Error Response (404):** If the price reference doesn't exist.
    ```json
    {
      "success": false,
      "message": "Recurso no encontrado"
    }
    ```

---

### Admin-only: Create Price Reference

- **POST** `/price-references`
  - **Description:** Create a new price reference. Restricted to admin users via the `admin` middleware.
  - **Access:** Protected — requires `auth:sanctum` and `admin` middleware (user must have `is_admin = true`).
  - **Request Body (application/json):**
    - `price_per_kg` (number, required, min: 0.01, max: 999999.99): Price per kilogram.
    - `date` (date, required): Date of the price reference (format: YYYY-MM-DD).
    - `source` (string, optional, max: 200): Source of the price information.
    - `product_id` (integer, required, exists:products,id): Product ID.
    - `municipality_id` (integer, required, exists:municipalities,id).

  - **Success Response (201):** Returns the created price reference object.
    ```json
    {
      "success": true,
      "message": "Referencia de precio creada exitosamente",
      "data": {
        "id": 2,
        "price_per_kg": 3200.00,
        "date": "2025-10-02",
        "source": "Mercado de Agricultores",
        "product_id": 5,
        "municipality_id": 120,
        "created_at": "2025-10-02T15:30:00.000000Z",
        "updated_at": "2025-10-02T15:30:00.000000Z",
        "product": {
          "id": 5,
          "name": "Café"
        },
        "municipality": {
          "id": 120,
          "name": "Cali"
        }
      }
    }
    ```

  - **Error Response (401):** If not authenticated.
    ```json
    {
      "success": false,
      "message": "No estás autenticado."
    }
    ```

  - **Error Response (403):** If authenticated but not admin.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para realizar esta acción. Solo administradores."
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "price_per_kg": ["El precio debe ser mayor a 0."],
        "date": ["La fecha es obligatoria."],
        "product_id": ["El producto seleccionado no existe."],
        "municipality_id": ["El municipio seleccionado no existe."]
      }
    }
    ```

  - **Notes:**
    - Only admin users can create price references.
    - All fields except `source` are required.
    - The `date` field should represent when the price was observed, not when it was entered into the system.
    - Once created, price references cannot be deleted, only updated.

---

### Admin-only: Update Price Reference

- **PUT** `/price-references/{priceReference}` (or POST with `_method=PUT`)
  - **Description:** Update an existing price reference. Restricted to admin users via the `admin` middleware.
  - **Access:** Protected — requires `auth:sanctum` and `admin` middleware (user must have `is_admin = true`).
  - **URL Parameters:**
    - `priceReference` (integer, required): The ID of the price reference to update.
  - **Request Body (application/json or multipart/form-data):**
    - `price_per_kg` (number, optional, min: 0.01, max: 999999.99): Price per kilogram.
    - `date` (date, optional): Date of the price reference (format: YYYY-MM-DD).
    - `source` (string, optional, max: 200): Source of the price information.
    - `product_id` (integer, optional, exists:products,id): Product ID.
    - `municipality_id` (integer, optional, exists:municipalities,id).
    - `_method` (string, optional): Set to "PUT" when using POST method to simulate PUT request (required for multipart/form-data).

  - **Success Response (200):** Returns the updated price reference object.
    ```json
    {
      "success": true,
      "message": "Referencia de precio actualizada exitosamente",
      "data": {
        "id": 1,
        "price_per_kg": 2800.00,
        "date": "2025-10-05",
        "source": "Mercado Central Actualizado",
        "product_id": 5,
        "municipality_id": 120,
        "created_at": "2025-10-01T10:00:00.000000Z",
        "updated_at": "2025-10-05T14:30:00.000000Z",
        "product": {
          "id": 5,
          "name": "Café"
        },
        "municipality": {
          "id": 120,
          "name": "Cali"
        }
      }
    }
    ```

  - **Error Response (401):** If not authenticated.
    ```json
    {
      "success": false,
      "message": "No estás autenticado."
    }
    ```

  - **Error Response (403):** If authenticated but not admin.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para realizar esta acción. Solo administradores."
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "price_per_kg": ["El precio debe ser mayor a 0."],
        "date": ["La fecha debe ser una fecha válida."],
        "product_id": ["El producto seleccionado no existe."],
        "municipality_id": ["El municipio seleccionado no existe."]
      }
    }
    ```

  - **Notes:**
    - Only admin users can update price references.
    - All fields are optional; only provided fields will be updated.
    - When sending form data (multipart/form-data), you must use the POST method with `_method=PUT` parameter to simulate a PUT request due to Laravel's handling of form data with PUT requests.
    - When sending JSON data, you can use the standard PUT method.
    - Price references cannot be deleted once created. If a price reference is no longer valid, it should be updated with appropriate information.

## Price Alerts

### List My Price Alerts

- **GET** `/my-alerts`
  - **Description:** Retrieves a list of price alerts created by the authenticated user. Supports filtering and sorting.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **Query Parameters:**
    - `product_id` (integer, optional, exists:products,id): Filter price alerts by a specific product.
    - `municipality_id` (integer, optional, exists:municipalities,id): Filter price alerts by a specific municipality.
    - `status` (string, optional, in:ACTIVE,INACTIVE): Filter price alerts by status.
    - `sort_by` (string, optional, in:condition,threshold_price,status,created_at, default:`created_at`): Field to sort by.
    - `sort_order` (string, optional, in:asc,desc, default:`desc`): Sort direction.

  - **Success Response (200):** Returns an array of price alert objects.
    ```json
    {
      "success": true,
      "message": "Alertas de precios obtenidas exitosamente",
      "data": [
        {
          "id": 1,
          "condition": "ABOVE",
          "threshold_price": 2500.00,
          "status": "ACTIVE",
          "user_id": 10,
          "product_id": 5,
          "municipality_id": 120,
          "created_at": "2025-10-01T10:00:00.000000Z",
          "updated_at": "2025-10-01T10:00:00.000000Z",
          "product": {
            "id": 5,
            "name": "Café",
            "description": "Café colombiano"
          },
          "municipality": {
            "id": 120,
            "name": "Cali"
          }
        }
      ],
      "filters_applied": {
        "product_id": null,
        "municipality_id": null,
        "status": null
      },
      "sort_applied": {
        "sort_by": "created_at",
        "sort_order": "desc"
      }
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "product_id": ["El producto seleccionado no existe."],
        "status": ["El estado debe ser: ACTIVE o INACTIVE."],
        "sort_by": ["El campo de ordenamiento no es válido. Valores permitidos: condition, threshold_price, status, created_at."]
      }
    }
    ```

  - **Notes:**
    - This endpoint only returns price alerts created by the authenticated user.
    - Results are ordered by creation date descending by default.
    - All filters are optional and can be combined.
    - The response includes `filters_applied` and `sort_applied` objects showing which filters and sorting options were applied.

---

### Create Price Alert

- **POST** `/my-alerts`
  - **Description:** Create a new price alert for the authenticated user.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **Request Body (application/json):**
    - `condition` (string, required, in:ABOVE,BELOW): Condition for the alert (ABOVE or BELOW the threshold price).
    - `threshold_price` (number, required, min: 0.01, max: 999999.99): Threshold price for the alert.
    - `product_id` (integer, required, exists:products,id): Product ID.
    - `municipality_id` (integer, required, exists:municipalities,id).

  - **Success Response (201):** Returns the created price alert object.
    ```json
    {
      "success": true,
      "message": "Alerta de precio creada exitosamente",
      "data": {
        "id": 2,
        "condition": "BELOW",
        "threshold_price": 3200.00,
        "status": "INACTIVE",
        "user_id": 10,
        "product_id": 5,
        "municipality_id": 120,
        "created_at": "2025-10-02T15:30:00.000000Z",
        "updated_at": "2025-10-02T15:30:00.000000Z",
        "product": {
          "id": 5,
          "name": "Café"
        },
        "municipality": {
          "id": 120,
          "name": "Cali"
        }
      }
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "condition": ["La condición debe ser ABOVE o BELOW."],
        "threshold_price": ["El precio límite debe ser mayor a 0."],
        "product_id": ["El producto seleccionado no existe."],
        "municipality_id": ["El municipio seleccionado no existe."]
      }
    }
    ```

  - **Notes:**
    - Only authenticated users can create price alerts.
    - The `user_id` is automatically set to the authenticated user's ID.
    - New price alerts are created with `INACTIVE` status by default.
    - All fields except `status` are required.

---

### Get Price Alert Details

- **GET** `/my-alerts/{priceAlert}`
  - **Description:** Retrieves the details of a specific price alert by its ID.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `priceAlert` (integer, required): The ID of the price alert.
  - **Success Response (200):** Returns a single price alert object.
    ```json
    {
      "success": true,
      "message": "Detalles de la alerta de precio obtenidos exitosamente",
      "data": {
        "id": 1,
        "condition": "ABOVE",
        "threshold_price": 2500.00,
        "status": "ACTIVE",
        "user_id": 10,
        "product_id": 5,
        "municipality_id": 120,
        "created_at": "2025-10-01T10:00:00.000000Z",
        "updated_at": "2025-10-01T10:00:00.000000Z",
        "product": {
          "id": 5,
          "name": "Café",
          "description": "Café colombiano"
        },
        "municipality": {
          "id": 120,
          "name": "Cali"
        }
      }
    }
    ```

  - **Error Response (403):** If the user is not the owner of the price alert.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para ver esta alerta de precio."
    }
    ```

  - **Error Response (404):** If the price alert doesn't exist.
    ```json
    {
      "success": false,
      "message": "Recurso no encontrado"
    }
    ```

  - **Notes:**
    - Only the owner of the price alert can view its details.
    - The endpoint uses Laravel's route model binding to automatically fetch the PriceAlert instance.

---

### Update Price Alert

- **PUT** `/my-alerts/{priceAlert}` (or POST with `_method=PUT`)
  - **Description:** Update an existing price alert. Only the owner can update their alerts.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `priceAlert` (integer, required): The ID of the price alert to update.
  - **Request Body (application/json or multipart/form-data):**
    - `condition` (string, optional, in:ABOVE,BELOW): Condition for the alert (ABOVE or BELOW the threshold price).
    - `threshold_price` (number, optional, min: 0.01, max: 999999.99): Threshold price for the alert.
    - `status` (string, optional, in:ACTIVE,INACTIVE): Status of the alert.
    - `product_id` (integer, optional, exists:products,id): Product ID.
    - `municipality_id` (integer, optional, exists:municipalities,id).
    - `_method` (string, optional): Set to "PUT" when using POST method to simulate PUT request (required for multipart/form-data).

  - **Success Response (200):** Returns the updated price alert object.
    ```json
    {
      "success": true,
      "message": "Alerta de precio actualizada exitosamente",
      "data": {
        "id": 1,
        "condition": "BELOW",
        "threshold_price": 2800.00,
        "status": "ACTIVE",
        "user_id": 10,
        "product_id": 5,
        "municipality_id": 120,
        "created_at": "2025-10-01T10:00:00.000000Z",
        "updated_at": "2025-10-05T14:30:00.000000Z",
        "product": {
          "id": 5,
          "name": "Café"
        },
        "municipality": {
          "id": 120,
          "name": "Cali"
        }
      }
    }
    ```

  - **Error Response (403):** If the user is not the owner of the price alert.
    ```json
    {
      "success": false,
      "message": "This action is unauthorized."
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "condition": ["La condición debe ser ABOVE o BELOW."],
        "threshold_price": ["El precio límite debe ser mayor a 0."],
        "status": ["El estado debe ser ACTIVE o INACTIVE."],
        "product_id": ["El producto seleccionado no existe."],
        "municipality_id": ["El municipio seleccionado no existe."]
      }
    }
    ```

  - **Notes:**
    - Only the owner of the price alert can update it.
    - All fields are optional; only provided fields will be updated.
    - When sending form data (multipart/form-data), you must use the POST method with `_method=PUT` parameter to simulate a PUT request due to Laravel's handling of form data with PUT requests.
    - When sending JSON data, you can use the standard PUT method.

---

### Delete Price Alert

- **DELETE** `/my-alerts/{priceAlert}`
  - **Description:** Deletes a price alert. Only the owner can delete their alerts.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `priceAlert` (integer, required): The ID of the price alert to delete.
  - **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Alerta de precio eliminada exitosamente",
      "data": null
    }
    ```

  - **Error Response (403):** If the user is not the owner of the price alert.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para eliminar esta alerta de precio."
    }
    ```

  - **Error Response (404):** If the price alert doesn't exist.
    ```json
    {
      "success": false,
      "message": "Recurso no encontrado"
    }
    ```

  - **Notes:**
    - Only the owner of the price alert can delete it.
    - Once deleted, a price alert cannot be recovered.

## Reviews

### List Reviews

- **GET** `/reviews`
  - **Description:** Retrieves a list of reviews. Supports filtering by reviewer or reviewed user, and sorting.
  - **Access:** Public
  - **Query Parameters:**
    - `reviewer_id` (integer, optional, exists:users,id): Filter reviews by the user who wrote them.
    - `reviewed_id` (integer, optional, exists:users,id): Filter reviews by the user who was reviewed.
    - `sort_by` (string, optional, in:rating,created_at,updated_at, default:`created_at`): Field to sort by.
    - `sort_order` (string, optional, in:asc,desc, default:`desc`): Sort direction.

  - **Success Response (200):** Returns an array of review objects.
    ```json
    {
      "success": true,
      "message": "Reseñas obtenidas exitosamente",
      "data": [
        {
          "id": 1,
          "rating": 5,
          "comment": "Excelente vendedor, muy confiable",
          "reviewer_id": 10,
          "reviewed_id": 15,
          "created_at": "2025-10-01T10:00:00.000000Z",
          "updated_at": "2025-10-01T10:00:00.000000Z",
          "reviewer": {
            "id": 10,
            "name": "Juan Pérez"
          },
          "reviewed": {
            "id": 15,
            "name": "María García"
          }
        }
      ],
      "filters_applied": {
        "reviewer_id": null,
        "reviewed_id": null
      },
      "sort_applied": {
        "sort_by": "created_at",
        "sort_order": "desc"
      }
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "reviewer_id": ["El usuario que califica no existe."],
        "reviewed_id": ["El usuario calificado no existe."],
        "sort_by": ["El campo de ordenamiento no es válido. Valores permitidos: rating, created_at, updated_at."],
        "sort_order": ["El orden debe ser: asc o desc."]
      }
    }
    ```

  - **Notes:**
    - This endpoint is public and doesn't require authentication.
    - Results are ordered by creation date descending by default.
    - All filters are optional and can be combined.
    - The response includes `filters_applied` and `sort_applied` objects showing which filters and sorting options were applied.

---

### Create Review

- **POST** `/reviews`
  - **Description:** Create a new review for a user.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **Request Body (application/json):**
    - `rating` (integer, required, min:1, max:5): Rating from 1 to 5 stars.
    - `comment` (string, optional, max:400): Comment about the user.
    - `reviewed_id` (integer, required, exists:users,id): ID of the user being reviewed.

  - **Success Response (201):** Returns the created review object.
    ```json
    {
      "success": true,
      "message": "Reseña creada exitosamente",
      "data": {
        "id": 2,
        "rating": 4,
        "comment": "Buen vendedor, entrega a tiempo",
        "reviewer_id": 10,
        "reviewed_id": 20,
        "created_at": "2025-10-02T15:30:00.000000Z",
        "updated_at": "2025-10-02T15:30:00.000000Z",
        "reviewer": {
          "id": 10,
          "name": "Juan Pérez"
        },
        "reviewed": {
          "id": 20,
          "name": "Carlos López"
        }
      }
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "rating": ["La calificación es obligatoria."],
        "rating.min": ["La calificación mínima es 1."],
        "rating.max": ["La calificación máxima es 5."],
        "comment": ["El comentario no debe exceder los 400 caracteres."],
        "reviewed_id": ["El usuario a calificar es obligatorio."]
      }
    }
    ```
    
  - **Error Response (422):** If user tries to review themselves.
    ```json
    {
      "success": false,
      "message": "No puedes calificarte a ti mismo."
    }
    ```

  - **Error Response (422):** If user has already reviewed the same user.
    ```json
    {
      "success": false,
      "message": "Ya has calificado previamente a este usuario."
    }
    ```

  - **Notes:**
    - Only authenticated users can create reviews.
    - Users cannot review themselves.
    - Each user can only review another user once.
    - The `reviewer_id` is automatically set to the authenticated user's ID.
    - All fields except `comment` are required.

---

### Get Review Details

- **GET** `/reviews/{review}`
  - **Description:** Retrieves the details of a specific review by its ID.
  - **Access:** Public
  - **URL Parameters:**
    - `review` (integer, required): The ID of the review.
  - **Success Response (200):** Returns a single review object.
    ```json
    {
      "success": true,
      "message": "Detalles de la reseña obtenidos exitosamente",
      "data": {
        "id": 1,
        "rating": 5,
        "comment": "Excelente vendedor, muy confiable",
        "reviewer_id": 10,
        "reviewed_id": 15,
        "created_at": "2025-10-01T10:00:00.000000Z",
        "updated_at": "2025-10-01T10:00:00.000000Z",
        "reviewer": {
          "id": 10,
          "name": "Juan Pérez"
        },
        "reviewed": {
          "id": 15,
          "name": "María García"
        }
      }
    }
    ```

  - **Error Response (404):** If the review doesn't exist.
    ```json
    {
      "success": false,
      "message": "Recurso no encontrado"
    }
    ```

  - **Notes:**
    - This endpoint is public and doesn't require authentication.
    - The endpoint uses Laravel's route model binding to automatically fetch the Review instance.

---

### Update Review

- **PUT** `/reviews/{review}` (or POST with `_method=PUT`)
  - **Description:** Update an existing review. Only the reviewer can update their review.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `review` (integer, required): The ID of the review to update.
  - **Request Body (application/json or multipart/form-data):**
    - `rating` (integer, optional, min:1, max:5): Rating from 1 to 5 stars.
    - `comment` (string, optional, max:400): Comment about the user.
    - `_method` (string, optional): Set to "PUT" when using POST method to simulate PUT request (required for multipart/form-data).

  - **Success Response (200):** Returns the updated review object.
    ```json
    {
      "success": true,
      "message": "Reseña actualizada exitosamente",
      "data": {
        "id": 1,
        "rating": 4,
        "comment": "Buen vendedor, entrega a tiempo. Actualizado después de más interacciones.",
        "reviewer_id": 10,
        "reviewed_id": 15,
        "created_at": "2025-10-01T10:00:00.000000Z",
        "updated_at": "2025-10-05T14:30:00.000000Z",
        "reviewer": {
          "id": 10,
          "name": "Juan Pérez"
        },
        "reviewed": {
          "id": 15,
          "name": "María García"
        }
      }
    }
    ```

  - **Error Response (403):** If the user is not the reviewer of the review.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para actualizar esta reseña."
    }
    ```

  - **Error Response (422):** If validation fails.
    ```json
    {
      "success": false,
      "message": "The given data was invalid.",
      "errors": {
        "rating": ["La calificación mínima es 1."],
        "comment": ["El comentario no debe exceder los 400 caracteres."]
      }
    }
    ```

  - **Notes:**
    - Only the reviewer of the review can update it.
    - All fields are optional; only provided fields will be updated.
    - When sending form data (multipart/form-data), you must use the POST method with `_method=PUT` parameter to simulate a PUT request due to Laravel's handling of form data with PUT requests.
    - When sending JSON data, you can use the standard PUT method.

---

### Delete Review

- **DELETE** `/reviews/{review}`
  - **Description:** Deletes a review. Only the reviewer can delete their review.
  - **Access:** Protected — requires `auth:sanctum` (include header `Authorization: Bearer {token}`).
  - **URL Parameters:**
    - `review` (integer, required): The ID of the review to delete.
  - **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Reseña eliminada exitosamente",
      "data": null
    }
    ```

  - **Error Response (403):** If the user is not the reviewer of the review.
    ```json
    {
      "success": false,
      "message": "No tienes permisos para eliminar esta reseña."
    }
    ```

  - **Error Response (404):** If the review doesn't exist.
    ```json
    {
      "success": false,
      "message": "Recurso no encontrado"
    }
    ```

  - **Notes:**
    - Only the reviewer of the review can delete it.
    - Once deleted, a review cannot be recovered.

