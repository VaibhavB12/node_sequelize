# Authentication & Authorization API Documentation

## Overview

This API provides secure authentication and authorization with user and product management capabilities. It features:

- JWT-based authentication with signed HTTP-only cookies
- Role-based authorization (user/admin)
- User management (CRUD operations)
- Product management with ownership
- Secure password storage with bcrypt
- Sequelize ORM with MySQL

## Table of Contents

1. [API Endpoints](#api-endpoints)
2. [Authentication](#authentication)
3. [Models](#models)
4. [Setup Instructions](#setup-instructions)
5. [Testing](#testing)
6. [Environment Variables](#environment-variables)
7. [Error Handling](#error-handling)

## API Endpoints

### Authentication

| Endpoint       | Method | Description                | Access       |
|----------------|--------|----------------------------|--------------|
| `/auth/register` | POST   | Register new user          | Public       |
| `/auth/login`    | POST   | Login user                 | Public       |
| `/auth/logout`   | POST   | Logout user                | Authenticated|

### Users

| Endpoint       | Method | Description                | Access       |
|----------------|--------|----------------------------|--------------|
| `/users`        | GET    | Get all users              | Admin only   |
| `/users/:id`    | GET    | Get user by ID             | Authenticated|
| `/users/:id`    | PUT    | Update user                | Authenticated|
| `/users/:id`    | DELETE | Delete user                | Admin only   |

### Products

| Endpoint       | Method | Description                | Access       |
|----------------|--------|----------------------------|--------------|
| `/products`     | GET    | Get all products           | Public       |
| `/products`     | POST   | Create new product         | Authenticated|
| `/products/:id` | PUT    | Update product             | Owner/Admin  |
| `/products/:id` | DELETE | Delete product             | Owner/Admin  |

## Authentication

### Register

**Request:**
```json
POST /auth/register
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
201 Created
{
  "id": 1,
  "name": "New User",
  "email": "user@example.com",
  "role": "user"
}
```

### Login

**Request:**
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
200 OK
{
  "token": "jwt.token.here",
  "user": {
    "id": 1,
    "name": "New User",
    "email": "user@example.com",
    "role": "user"
  }
}
```

*Note: The token is also set as a signed HTTP-only cookie*

## Models

### User

| Field    | Type     | Description                     |
|----------|----------|---------------------------------|
| id       | Integer  | Auto-incremented primary key    |
| name     | String   | User's full name               |
| email    | String   | Unique email address           |
| role     | Enum     | 'user' or 'admin'              |
| password | String   | Bcrypt-hashed password         |

### Product

| Field       | Type     | Description                     |
|-------------|----------|---------------------------------|
| id          | Integer  | Auto-incremented primary key    |
| name        | String   | Product name                   |
| price       | Float    | Product price                  |
| description | Text     | Product description            |
| userId      | Integer  | Foreign key to owner user      |

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a MySQL database
4. Set up environment variables (see below)
5. Run the server:
   ```bash
   npm start
   ```

## Testing

### Automated Tests with Postman

1. Import the [Postman collection](#postman-test-collection)
2. Set up environment variables in Postman
3. Run the collection tests

### Manual Testing

Use the provided demo data:
- Admin: `admin@example.com` / `password123`
- Regular user: `user@example.com` / `password123`

## Environment Variables

Create a `.env` file in the root directory:

```env
DB_NAME=auth_demo
DB_USER=root
DB_PASS=your_db_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret_key
COOKIE_SECRET=your_cookie_secret_key
```

## Error Handling

The API returns standardized error responses:

### Common Error Responses

| Status Code | Error Type           | Description                     |
|-------------|----------------------|---------------------------------|
| 400         | Bad Request          | Invalid request data           |
| 401         | Unauthorized         | Authentication required        |
| 403         | Forbidden            | Insufficient permissions       |
| 404         | Not Found            | Resource not found             |
| 500         | Internal Server Error| Server error                   |

**Example Error Response:**
```json
{
  "error": "Detailed error message"
}
```