# Smart Leads Dashboard — Full Stack Development Plan

## 1. Project Overview

Build a production-ready Smart Leads Dashboard using the MERN stack with TypeScript.

The application should allow authenticated users to manage leads efficiently through a responsive dashboard with:

- JWT Authentication
- Role-based access control
- Lead CRUD operations
- Advanced filtering and search
- Pagination
- CSV Export
- Responsive UI
- Docker support
- Clean architecture
- Scalable code structure

---

# 2. Tech Stack

## Frontend

- React.js
- TypeScript
- TailwindCSS
- React Router DOM
- Axios
- Zustand or Redux Toolkit
- React Hook Form
- Zod
- TanStack Query (React Query)
- Lucide Icons
- Recharts (optional dashboard charts)

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- express-validator or Zod
- dotenv
- cors
- helmet
- morgan

## DevOps

- Docker
- Docker Compose

---

# 3. High-Level Architecture

## Frontend Architecture

Use feature-based modular architecture.

```txt
frontend/
 ├── src/
 │    ├── api/
 │    ├── app/
 │    ├── components/
 │    ├── features/
 │    ├── hooks/
 │    ├── layouts/
 │    ├── pages/
 │    ├── routes/
 │    ├── services/
 │    ├── store/
 │    ├── types/
 │    ├── utils/
 │    └── main.tsx
```

---

## Backend Architecture

Use layered architecture.

```txt
backend/
 ├── src/
 │    ├── config/
 │    ├── controllers/
 │    ├── middlewares/
 │    ├── models/
 │    ├── repositories/
 │    ├── routes/
 │    ├── services/
 │    ├── types/
 │    ├── utils/
 │    ├── validations/
 │    ├── app.ts
 │    └── server.ts
```

---

# 4. Application Roles

## Roles

### Admin

Permissions:

- Create leads
- Edit leads
- Delete leads
- View all leads
- Export CSV
- Manage users

### Sales User

Permissions:

- Create leads
- Edit assigned leads
- View leads
- Cannot delete leads
- Cannot manage users

---

# 5. Database Design

## User Schema

```ts
interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Lead Schema

```ts
interface ILead {
  name: string;
  email: string;
  status: "new" | "contacted" | "qualified" | "lost";
  source: "website" | "instagram" | "referral";
  assignedTo?: ObjectId;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

---

# 6. Backend Development Plan

## 6.1 Backend Setup

### Initialize Backend

```bash
mkdir backend
npm init -y
```

### Install Dependencies

#### Production

```bash
npm install express mongoose bcrypt jsonwebtoken cors dotenv helmet morgan
```

#### Dev

```bash
npm install -D typescript ts-node-dev @types/node @types/express @types/bcrypt @types/jsonwebtoken
```

---

## 6.2 TypeScript Configuration

Create:

```txt
tsconfig.json
```

Important settings:

```json
{
  "strict": true,
  "moduleResolution": "node",
  "esModuleInterop": true
}
```

---

## 6.3 Environment Variables

Create:

```txt
.env
```

Variables:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 6.4 MongoDB Connection

Create:

```txt
src/config/db.ts
```

Responsibilities:

- Connect database
- Handle connection errors
- Export DB connector

---

## 6.5 Authentication Module

### Endpoints

#### Register

```http
POST /api/auth/register
```

#### Login

```http
POST /api/auth/login
```

#### Get Current User

```http
GET /api/auth/me
```

Protected route.

---

### Password Hashing

Use bcrypt:

```ts
bcrypt.hash(password, 10)
```

---

### JWT Strategy

Payload:

```ts
{
  userId,
  role
}
```

Expiry:

```txt
7d
```

---

### Auth Middleware

Responsibilities:

- Read token
- Verify JWT
- Attach user to request
- Reject unauthorized users

---

### RBAC Middleware

Create middleware:

```ts
authorizeRoles("admin")
```

---

## 6.6 Lead Management Module

### Lead Routes

#### Create Lead

```http
POST /api/leads
```

#### Get Leads

```http
GET /api/leads
```

#### Get Single Lead

```http
GET /api/leads/:id
```

#### Update Lead

```http
PUT /api/leads/:id
```

#### Delete Lead

```http
DELETE /api/leads/:id
```

---

## 6.7 Advanced Filtering Logic

Support combined filters.

Example:

```http
/api/leads?status=qualified&source=instagram&search=rahul&page=1
```

---

### Backend Query Logic

Use dynamic query object:

```ts
const query: FilterQuery<ILead> = {};
```

---

### Search Logic

Search by:

- name
- email

Use regex:

```ts
{
  $or: [
    { name: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } }
  ]
}
```

---

### Sorting

Supported values:

- latest
- oldest

Implementation:

```ts
.sort({ createdAt: -1 })
```

or

```ts
.sort({ createdAt: 1 })
```

---

## 6.8 Pagination

Requirements:

- 10 records per page
- Backend pagination mandatory

Implementation:

```ts
.skip((page - 1) * limit)
.limit(limit)
```

---

### API Pagination Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 120,
    "page": 2,
    "pages": 12,
    "limit": 10
  }
}
```

---

## 6.9 CSV Export

### Endpoint

```http
GET /api/leads/export/csv
```

### Package

Use:

```bash
json2csv
```

### CSV Columns

- Name
- Email
- Status
- Source
- CreatedAt

---

## 6.10 Validation Layer

Use Zod or express-validator.

Validate:

- registration
- login
- lead creation
- lead updates
- query params

---

## 6.11 Error Handling

Create centralized error middleware.

Structure:

```json
{
  "success": false,
  "message": "Validation failed"
}
```

---

## 6.12 API Response Standard

All APIs should return:

```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {}
}
```

---

## 6.13 Security Best Practices

Implement:

- helmet
- rate limiting
- password hashing
- JWT expiration
- protected routes
- input validation
- avoid sensitive data exposure

---

# 7. Frontend Development Plan

## 7.1 Frontend Setup

Initialize:

```bash
npm create vite@latest
```

Choose:

- React
- TypeScript

---

## 7.2 Tailwind Setup

Install TailwindCSS.

Configure:

```txt
tailwind.config.js
```

Enable:

- dark mode
- custom colors
- responsive breakpoints

---

## 7.3 Routing

Use React Router.

Routes:

```txt
/login
/register
/dashboard
/leads
/leads/:id
```

Protected routes required.

---

## 7.4 Global State Management

Recommended:

### Zustand

Store:

- auth user
- token
- filters
- pagination

Alternative:

- Redux Toolkit

---

## 7.5 API Layer

Create centralized Axios instance.

Responsibilities:

- attach JWT
- intercept errors
- refresh auth state

---

## 7.6 Authentication UI

Pages:

### Login Page

Fields:

- email
- password

---

### Register Page

Fields:

- name
- email
- password
- role

---

## 7.7 Dashboard Layout

Structure:

```txt
Sidebar
Topbar
Content Area
```

Sidebar items:

- Dashboard
- Leads
- Export CSV
- Logout

Admin only:

- User Management

---

## 7.8 Leads Table

Columns:

- Name
- Email
- Status
- Source
- Created At
- Actions

Actions:

- View
- Edit
- Delete

---

## 7.9 Leads Form

Reusable component.

Used for:

- create
- update

Validation:

- required fields
- email format

---

## 7.10 Filtering UI

Include:

- status dropdown
- source dropdown
- search input
- sort dropdown

All filters should work simultaneously.

---

## 7.11 Debounced Search

Mandatory feature.

Implementation:

Use:

```ts
useDebounce()
```

Delay:

```txt
500ms
```

Avoid excessive API calls.

---

## 7.12 Pagination UI

Features:

- next button
- previous button
- page numbers
- disable invalid buttons

---

## 7.13 Loading States

Create reusable loaders.

Examples:

- table loading
- button spinner
- skeleton UI

---

## 7.14 Empty States

Examples:

```txt
No leads found
```

Provide action button:

```txt
Create Lead
```

---

## 7.15 Error UI

Display:

- API errors
- validation errors
- auth errors

Use:

- toast notifications
- inline messages

---

## 7.16 Dark Mode

Optional bonus feature.

Implementation:

- Tailwind dark class
- localStorage persistence

---

# 8. API Contract

## Auth APIs

### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "Anuj",
  "email": "anuj@gmail.com",
  "password": "123456",
  "role": "admin"
}
```

---

### Login

```http
POST /api/auth/login
```

Response:

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {}
}
```

---

## Leads APIs

### Get Leads

```http
GET /api/leads?page=1&status=qualified&source=website&search=anuj
```

---

# 9. Reusable Components

## Components List

### UI Components

- Button
- Input
- Modal
- Select
- Badge
- Table
- Pagination
- Loader
- EmptyState
- Toast

---

### Feature Components

- LeadForm
- LeadsTable
- FilterBar
- SearchBar
- ProtectedRoute

---

# 10. Frontend Pages

## Pages

### Public

- Login
- Register

### Protected

- Dashboard
- Leads List
- Lead Details
- Edit Lead

---

# 11. Folder Structure (Detailed)

## Frontend

```txt
src/
 ├── api/
 ├── assets/
 ├── components/
 │    ├── ui/
 │    └── common/
 ├── features/
 │    ├── auth/
 │    └── leads/
 ├── hooks/
 ├── layouts/
 ├── pages/
 ├── routes/
 ├── services/
 ├── store/
 ├── styles/
 ├── types/
 ├── utils/
 └── main.tsx
```

---

## Backend

```txt
src/
 ├── config/
 ├── controllers/
 ├── middlewares/
 ├── models/
 ├── repositories/
 ├── routes/
 ├── services/
 ├── validations/
 ├── utils/
 ├── types/
 ├── app.ts
 └── server.ts
```

---

# 13. Development Workflow

## Git Strategy

Use meaningful commits.

Examples:

```txt
feat: add authentication module
fix: resolve pagination bug
refactor: improve leads service structure
```

---

# 14. Testing Recommendations

## Backend

Use:

- Jest
- Supertest

Test:

- auth APIs
- leads APIs
- middleware

---

## Frontend

Use:

- React Testing Library
- Vitest

---

# 15. Performance Optimizations

## Frontend

- lazy loading
- memoization
- debounced search
- pagination

---

## Backend

- indexed fields
- optimized queries
- projection
- pagination

---

# 16. MongoDB Indexing

Create indexes:

```ts
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
```

---

# 18. README Requirements

README must include:

- project overview
- setup instructions
- environment variables
- API documentation
- screenshots
- deployment links

---

# 19. API Documentation

Recommended:

- Swagger
- Postman Collection

Document:

- all endpoints
- request bodies
- responses
- error responses

---

# 20. UI/UX Expectations

Dashboard should feel:

- modern
- minimal
- responsive
- professional

Use:

- spacing consistency
- hover states
- transitions
- accessible forms

---

# 21. Recommended Development Order

## Phase 1

- backend setup
- database connection
- auth module

---

## Phase 2

- leads CRUD APIs
- filtering
- pagination

---

## Phase 3

- frontend setup
- authentication UI

---

## Phase 4

- leads dashboard
- table
- filters

---

## Phase 5

- CSV export
- RBAC
- Docker

---

## Phase 6

- testing
- deployment
- documentation

---

# 22. Important Engineering Rules

## DO

- use TypeScript everywhere
- define interfaces properly
- use reusable components
- write scalable code
- separate concerns
- validate all requests

---

## DO NOT

- use any unnecessarily
- hardcode URLs
- create giant components
- mix business logic with UI
- skip loading/error states

---

# 23. Final Deliverables

Must include:

- GitHub repository
- README.md
- .env.example
- API documentation
- Docker setup
- Deployment link
- Clean commit history

---

# 24. Success Criteria

Project is considered successful if:

- all features work correctly
- filters work together
- pagination works correctly
- RBAC works properly
- codebase is scalable
- TypeScript usage is strong
- UI is responsive and polished

