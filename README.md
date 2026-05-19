# 🚀 Gigflow Smart Leads Dashboard

A production-ready, full-stack **Smart Leads Management Dashboard** built with the **MERN stack** and **TypeScript**. Designed for sales teams to manage leads efficiently — with role-based access control, real-time filtering, CSV export, and a polished responsive UI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development (Manual)](#local-development-manual)
  - [Local Development (Docker)](#local-development-docker)
  - [Production Deployment (Docker)](#production-deployment-docker)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication-apis)
  - [Leads](#leads-apis)
- [Role-Based Access Control](#role-based-access-control)
- [Database Schema](#database-schema)
- [Frontend Routes](#frontend-routes)
- [Docker Configuration](#docker-configuration)
- [Performance Optimizations](#performance-optimizations)
- [Security](#security)
- [Contributing](#contributing)

---

## Overview

Gigflow Smart Leads Dashboard is a **production-grade CRM-style dashboard** that allows authenticated users to:

- Register and log in with JWT-based authentication
- Manage sales leads (create, view, edit, delete)
- Filter leads by status, source, and keyword search with **debounced input**
- Paginate through large datasets efficiently
- Export all leads to **CSV** (admin only)
- View real-time **dashboard statistics**
- Operate within a **role-controlled environment** (Admin vs Sales)

---

## Features

| Feature | Details |
|---|---|
| 🔐 Authentication | JWT-based login & registration with bcrypt password hashing |
| 🛡️ Role-Based Access | Admin and Sales roles with route-level authorization |
| 📋 Lead Management | Full CRUD — create, read, update, delete leads |
| 🔍 Advanced Filtering | Filter by status, source, keyword search, and sort order — all simultaneously |
| ⚡ Debounced Search | 500ms debounce prevents excessive API calls on every keystroke |
| 📄 Pagination | Server-side pagination with 10 records per page |
| 📤 CSV Export | Export all leads to CSV (admin-only endpoint) |
| 📊 Dashboard Stats | Aggregated stats — total leads, by status, by source |
| 🐳 Docker Support | Dev and production Docker Compose configurations included |
| 🌐 Nginx Serving | Production frontend served via Nginx with SPA routing |
| 📱 Responsive UI | Fully responsive with TailwindCSS, works on desktop and mobile |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.6 | UI Framework |
| TypeScript | ~6.0.2 | Static Typing |
| Vite | ^8.0.12 | Build Tool & Dev Server |
| TailwindCSS | ^4.3.0 | Styling |
| React Router DOM | ^7.15.1 | Client-Side Routing |
| Zustand | ^5.0.13 | Global State Management |
| Axios | ^1.16.1 | HTTP Client |
| React Hook Form | ^7.76.0 | Form Management |
| Zod | ^4.4.3 | Schema Validation |
| Recharts | ^3.8.1 | Dashboard Charts |
| Lucide React | ^1.16.0 | Icons |
| GSAP | ^3.15.0 | Animations |
| Three.js / R3F | ^0.184.0 | 3D Visual Elements |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | ^5.2.1 | Web Framework |
| TypeScript | ^6.0.3 | Static Typing |
| MongoDB | Latest | Database |
| Mongoose | ^9.6.2 | ODM / Schema Layer |
| JSON Web Token | ^9.0.3 | Authentication Tokens |
| bcrypt | ^6.0.0 | Password Hashing |
| Zod | ^4.4.3 | Request Validation |
| helmet | ^8.1.0 | HTTP Security Headers |
| morgan | ^1.10.1 | HTTP Request Logging |
| cors | ^2.8.6 | Cross-Origin Resource Sharing |
| json2csv | ^6.0.0-alpha.2 | CSV Export |

### DevOps

| Tool | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container Orchestration |
| Nginx | Production Frontend Server |

---

## Architecture

### Frontend — Feature-Based Modular Architecture

```
src/
├── api/            # Centralized Axios instance with JWT interceptors
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI and shared components
│   ├── ui/         # Generic UI primitives (Button, Input, Badge, Modal, etc.)
│   └── LeadForm.tsx
│   └── ProtectedRoute.tsx
├── features/       # Feature modules
│   ├── auth/       # Login, Register, auth store
│   └── leads/      # Leads table, filters, lead detail
├── hooks/          # Custom React hooks (useDebounce, etc.)
├── layouts/        # DashboardLayout (Sidebar + Topbar + Content)
├── pages/          # Route-level page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── Leads.tsx
├── routes/         # Route definitions and guards
├── store/          # Zustand global stores
├── types/          # Shared TypeScript interfaces
├── utils/          # Utility/helper functions
├── App.tsx
└── main.tsx
```

### Backend — Layered Architecture

```
src/
├── config/         # Database connection (MongoDB)
├── controllers/    # Request handlers (auth, leads)
├── middlewares/    # JWT auth, RBAC, validation, error handler
├── models/         # Mongoose models (User, Lead)
├── repositories/   # Data access layer (DB queries)
├── routes/         # Express route definitions
├── services/       # Business logic layer
├── types/          # Shared TypeScript types and interfaces
├── utils/          # Helper utilities
├── validations/    # Zod schemas for request validation
├── app.ts          # Express app setup
└── server.ts       # HTTP server entry point
```

---

## Project Structure

```
dashboard/
├── backend/
│   ├── src/
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── nginx.conf
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml          # Development
├── docker-compose.prod.yml     # Production
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18+
- **npm** v9+
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Docker** & **Docker Compose** _(optional but recommended)_

---

### Local Development (Manual)

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gigflow-dashboard.git
cd gigflow-dashboard
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Edit .env and fill in your MONGO_URI and JWT_SECRET

# Start development server
npm run dev
```

The backend will start at `http://localhost:5000`.

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173`.

---

### Local Development (Docker)

Run the entire stack (MongoDB + Backend + Frontend) with a single command:

```bash
# From the project root
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| MongoDB | mongodb://localhost:27017 |

To stop all services:

```bash
docker compose down
```

To stop and remove all volumes (wipe database):

```bash
docker compose down -v
```

---

### Production Deployment (Docker)

```bash
# Build and start production containers
docker compose -f docker-compose.prod.yml up --build -d
```

| Service | URL |
|---|---|
| Frontend (Nginx) | http://localhost:80 |
| Backend API | http://localhost:5000 |

> **Note:** Set `JWT_SECRET` as an environment variable before deploying to production. Never use the default development secret in production.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | ✅ | `5000` | Port the backend server listens on |
| `MONGO_URI` | ✅ | — | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | Secret key for signing JWT tokens |
| `NODE_ENV` | ✅ | `development` | Application environment (`development` / `production`) |
| `CLIENT_URL` | ✅ | `http://localhost:5173` | Allowed CORS origin (frontend URL) |

#### Example `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file to version control.** Use `.env.example` as a reference template.

---

## API Reference

**Base URL:** `http://localhost:5000/api`

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

All API responses follow this standard structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

---

### Authentication APIs

#### Register a New User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "admin"
}
```

> `role` accepts: `"admin"` or `"sales"`

**Response `201`:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

#### Login

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response `200`:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

#### Get Current User

```http
GET /api/auth/me
```

🔒 **Protected** — Requires Bearer token.

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

### Leads APIs

All leads endpoints require authentication (`Authorization: Bearer <token>`).

#### Get All Leads (with Filtering, Search & Pagination)

```http
GET /api/leads
```

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `page` | `number` | Page number (default: `1`) |
| `limit` | `number` | Results per page (default: `10`) |
| `status` | `string` | Filter by status: `new`, `contacted`, `qualified`, `lost` |
| `source` | `string` | Filter by source: `website`, `instagram`, `referral` |
| `search` | `string` | Search by name or email (case-insensitive regex) |
| `sort` | `string` | Sort order: `latest` (default) or `oldest` |

**Example:**

```http
GET /api/leads?page=1&status=qualified&source=instagram&search=john&sort=latest
```

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "John Smith",
      "email": "john@company.com",
      "status": "qualified",
      "source": "instagram",
      "assignedTo": "...",
      "createdBy": "...",
      "createdAt": "2026-05-19T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
```

---

#### Get Single Lead

```http
GET /api/leads/:id
```

🔒 **Protected**

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Smith",
    "email": "john@company.com",
    "status": "qualified",
    "source": "instagram",
    "createdAt": "2026-05-19T10:00:00.000Z"
  }
}
```

---

#### Create Lead

```http
POST /api/leads
```

🔒 **Protected**

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@startup.com",
  "status": "new",
  "source": "website",
  "assignedTo": "user_object_id"
}
```

> `status` accepts: `new` | `contacted` | `qualified` | `lost`  
> `source` accepts: `website` | `instagram` | `referral`

**Response `201`:**

```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { ... }
}
```

---

#### Update Lead

```http
PUT /api/leads/:id
```

🔒 **Protected**

**Request Body** (any fields to update):

```json
{
  "status": "contacted",
  "source": "referral"
}
```

**Response `200`:**

```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": { ... }
}
```

---

#### Delete Lead

```http
DELETE /api/leads/:id
```

🔒 **Protected** | 🛡️ **Admin only**

**Response `200`:**

```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

#### Export Leads to CSV

```http
GET /api/leads/export/csv
```

🔒 **Protected** | 🛡️ **Admin only**

Returns a downloadable `.csv` file with columns:

- Name
- Email
- Status
- Source
- Created At

**Response headers:**

```
Content-Type: text/csv
Content-Disposition: attachment; filename="leads.csv"
```

---

#### Get Dashboard Statistics

```http
GET /api/leads/stats/dashboard
```

🔒 **Protected**

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "totalLeads": 120,
    "byStatus": {
      "new": 40,
      "contacted": 30,
      "qualified": 35,
      "lost": 15
    },
    "bySource": {
      "website": 60,
      "instagram": 40,
      "referral": 20
    }
  }
}
```

---

## Role-Based Access Control

| Action | Admin | Sales |
|---|---|---|
| View leads | ✅ | ✅ |
| Create leads | ✅ | ✅ |
| Edit leads | ✅ | ✅ (assigned only) |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ❌ |
| Manage users | ✅ | ❌ |
| View dashboard stats | ✅ | ✅ |

---

## Database Schema

### User Schema

```typescript
interface IUser {
  name: string;
  email: string;                  // unique, indexed
  password: string;               // bcrypt hashed
  role: "admin" | "sales";
  createdAt: Date;
  updatedAt: Date;
}
```

### Lead Schema

```typescript
interface ILead {
  name: string;
  email: string;                               // indexed
  status: "new" | "contacted" | "qualified" | "lost";  // indexed
  source: "website" | "instagram" | "referral";        // indexed
  assignedTo?: ObjectId;                       // ref: User
  createdBy: ObjectId;                         // ref: User
  createdAt: Date;
  updatedAt: Date;
}
```

> MongoDB indexes are created on `email`, `status`, and `source` fields for optimized query performance.

---

## Frontend Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Redirects to `/login` |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/dashboard` | 🔒 Protected | Overview stats and charts |
| `/leads` | 🔒 Protected | Leads list with filters and pagination |

Protected routes automatically redirect unauthenticated users to `/login`.

---

## Docker Configuration

### Development (`docker-compose.yml`)

| Service | Image | Port | Notes |
|---|---|---|---|
| `mongodb` | `mongo:latest` | `27017` | Persisted with named volume |
| `backend` | Custom (Node.js 18) | `5000` | Hot-reload via `ts-node-dev`, volume mount |
| `frontend` | Custom (Node.js 18) | `5173` | Hot-reload via Vite with polling |

### Production (`docker-compose.prod.yml`)

| Service | Image | Port | Notes |
|---|---|---|---|
| `mongodb` | `mongo:latest` | `27017` | Persistent, `restart: unless-stopped` |
| `backend` | Custom (Node.js 18) | `5000` | Compiled TypeScript, `restart: unless-stopped` |
| `frontend` | `nginx:alpine` | `80` | Multi-stage build, static assets via Nginx |

### Frontend Production Build — Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Performance Optimizations

### Frontend

- **Debounced Search** — 500ms delay prevents API spam on keystrokes
- **Server-side Pagination** — Only fetches 10 records at a time
- **Zustand State** — Lightweight, minimal re-renders
- **Lazy Loading** — Route-level code splitting with `React.lazy`
- **Memoization** — `useMemo` / `useCallback` on expensive computations

### Backend

- **MongoDB Indexes** — On `email`, `status`, `source` for fast filtering
- **Dynamic Query Objects** — Build Mongoose filter queries conditionally
- **Projection** — Return only required fields from DB
- **Pagination with skip/limit** — Avoids loading entire collections

---

## Security

| Measure | Implementation |
|---|---|
| Password Hashing | `bcrypt` with salt rounds = 10 |
| JWT Expiry | Tokens expire in 7 days |
| HTTP Security Headers | `helmet` middleware |
| CORS Protection | Restricted to `CLIENT_URL` only |
| Input Validation | Zod schemas on all request bodies |
| Protected Routes | JWT middleware on all non-auth routes |
| Role Authorization | `authorizeRoles()` middleware on admin endpoints |
| Sensitive Data | Stack traces hidden in production |

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

### Commit Convention

```
feat: add new feature
fix: resolve a bug
refactor: code cleanup without behavior change
docs: update documentation
chore: dependency updates or tooling
```

---

## License

This project is licensed under the **ISC License**.

---

<div align="center">
  <strong>Built with ❤️ using the MERN Stack + TypeScript</strong>
</div>
