# Personal Blog Platform

A full-stack personal blog application with separate admin and user interfaces, built with Express.js, Prisma, and PostgreSQL. The platform supports user authentication, blog post management, and commenting functionality.

## 🎯 Project Overview

This is a personal blog platform that allows:
- **Users** to view published blog posts and leave comments
- **Admins** to create, edit, publish/unpublish, and delete blog posts
- **Authentication** system with JWT tokens and role-based access control

> **Note:** The frontend components (`frontend_admin/` and `frontend_user/`) were fully generated using AI to save development time, allowing focus on backend logic and API implementation.

## 🏗️ Architecture

The project follows a clean MVC (Model-View-Controller) architecture:

```
personal_blog/
├── backend/          # Express.js REST API
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/    # Authentication & authorization
│   │   ├── utils/          # Utility functions
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Server entry point
│   └── prisma/             # Database schema & migrations
├── frontend_admin/   # Admin dashboard (AI-generated)
└── frontend_user/    # Public blog interface (AI-generated)
```

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5.2.1
- **Database:** PostgreSQL
- **ORM:** Prisma 7.2.0
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **CORS:** Enabled for cross-origin requests

### Frontend
- **Technology:** Vanilla HTML/CSS/JavaScript
- **Status:** AI-generated for rapid prototyping

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                    # Express app setup & middleware
│   ├── server.js                 # Server entry point
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── postsController.js    # Blog post CRUD operations
│   │   └── commentController.js  # Comment management
│   ├── routes/
│   │   ├── authRoute.js          # Auth endpoints
│   │   ├── postRoute.js          # Post endpoints
│   │   └── commentRoute.js       # Comment endpoints
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── admin.js              # Admin role verification
│   └── utils/                    # Utility functions
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── client.js                 # Prisma client instance
│   ├── migrations/               # Database migrations
│   └── prisma.config.js          # Prisma configuration
├── package.json
└── .gitignore

frontend_admin/
├── index.html         # Admin login page
├── dashboard.html     # Admin dashboard
└── editor.html        # Post editor

frontend_user/
└── index.html         # Public blog view
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal_blog
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/blogdb"
   JWT_SECRET_KEY="your-secret-key-here"
   PORT=3000
   ```

4. **Set up the database**

   Ensure PostgreSQL is running and create a database:
   ```sql
   CREATE DATABASE blogdb;
   ```

   Grant necessary permissions to your database user:
   ```sql
   GRANT USAGE ON SCHEMA public TO your_username;
   GRANT CREATE ON SCHEMA public TO your_username;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO your_username;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO your_username;
   ```

5. **Run database migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

6. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

7. **Start the server**
   ```bash
   npm start
   # Or if you have a start script:
   node src/server.js
   ```

   The server will run on `http://localhost:3000` (or the port specified in your `.env`)

## 📊 Database Schema

The application uses three main models:

### User
- `id` (Int, Primary Key)
- `email` (String, Unique)
- `username` (String, Unique)
- `password` (String, Hashed)
- `isAdmin` (Boolean, Default: false)
- `createdAt` (DateTime)
- Relations: `posts[]`, `comments[]`

### Post
- `id` (Int, Primary Key)
- `title` (String)
- `content` (String)
- `published` (Boolean, Default: false)
- `authorId` (Int, Foreign Key → User)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `publishedAt` (DateTime, Optional)
- Relations: `author`, `comments[]`

### Comment
- `id` (Int, Primary Key)
- `content` (String)
- `authorId` (Int, Foreign Key → User)
- `postId` (Int, Foreign Key → Post)
- `createdAt` (DateTime)
- Relations: `author`, `post`

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

### Posts (`/api/posts`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/posts` | Get all published posts | No | No |
| GET | `/api/posts/all` | Get all posts (published + unpublished) | Yes | Yes |
| GET | `/api/posts/:id` | Get a specific post | No | No |
| POST | `/api/posts` | Create a new post | Yes | Yes |
| PUT | `/api/posts/:id` | Update a post | Yes | Yes |
| PUT | `/api/posts/:id/publish` | Toggle publish status | Yes | Yes |
| DELETE | `/api/posts/:id` | Delete a post | Yes | Yes |

### Comments (`/api/comments`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/comments` | Get all comments | Yes | Yes |
| POST | `/api/comments` | Create a comment | Yes | No |
| DELETE | `/api/comments/:id` | Delete a comment | Yes | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get a JWT token
2. **Include token** in requests: `Authorization: Bearer <token>`
3. **Token payload** contains: `{ id: userId, isAdmin: boolean }`

### Example Request
```javascript
fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <your-jwt-token>'
  },
  body: JSON.stringify({
    title: 'My Post',
    content: 'Post content...'
  })
});
```

## 🛡️ Middleware

- **`verifyJWT`**: Validates JWT token and attaches user info to `req.user`
- **`adminMiddleware`**: Ensures the user has admin privileges (`isAdmin: true`)

## 📝 Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Validate schema
npx prisma validate
```

## 🔧 Development

### Adding New Features

1. **Database changes**: Update `prisma/schema.prisma`, then run migrations
2. **New routes**: Add route files in `src/routes/`
3. **New controllers**: Add controller files in `src/controllers/`
4. **New middleware**: Add middleware files in `src/middleware/`

### Code Style

- ES6 Modules (`import`/`export`)
- Async/await for asynchronous operations
- Error handling with try-catch blocks
- RESTful API design principles

## 📦 Dependencies

### Production
- `express` - Web framework
- `@prisma/client` - Prisma ORM client
- `@prisma/adapter-pg` - PostgreSQL adapter for Prisma 7
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Development
- `prisma` - Prisma CLI

## 🚧 Future Enhancements

- [ ] Add pagination for posts and comments
- [ ] Implement search functionality
- [ ] Add image upload support
- [ ] Implement post categories/tags
- [ ] Add user profiles
- [ ] Email notifications
- [ ] Rate limiting
- [ ] Input validation middleware
- [ ] API documentation with Swagger/OpenAPI

## 📄 License

ISC

## 👤 Author

Personal blog project - Backend focused development

---

**Note:** Frontend components were AI-generated to accelerate development and focus on backend implementation.

