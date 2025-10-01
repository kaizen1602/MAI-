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

```json
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

```json
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
