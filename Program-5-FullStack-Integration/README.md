# Program 5: Full-Stack Integration & Cloud Deployment

**Course Outcome:** CO6 (Full-Stack Application Integration, Database Persistence with Sequelize ORM, CORS, Environment Variables, and Cloud Deployment Preparation on Vercel and Render)  
**Student:** sukhada bhave | **Roll No:** 67 | **Branch:** B.E. (AI & DS) Semester V

---

## 1. System Architecture Overview
Program 5 provides an end-to-end integrated web application for pet care appointment booking, monitoring, and administrative status updates:
- **Client Tier**: React 18 SPA bundled with Vite, styled with modern responsive CSS, and routed with React Router DOM.
- **API Tier**: Express.js REST API providing secure CRUD endpoints, CORS enablement, request logging, and error interception.
- **Persistence Tier**: Sequelize ORM abstracting database access. Operates locally with SQLite (`database.sqlite`) for instantaneous zero-friction evaluation and supports PostgreSQL in production via the `DATABASE_URL` environment variable.
- **Security & Session**: JWT authentication tokens with bcrypt-hashed passwords.
- **Deployment Tier**: Prepared for deployment on **Vercel** (frontend) and **Render** (backend & managed PostgreSQL).

---

## 2. Database Schema & Models
### Model 1: `User` (`users` table)
| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | Primary Key, Default UUIDv4 | Unique User Identifier |
| `name` | STRING | AllowNull: false, min 2 chars | Staff/Vet Full Name |
| `email` | STRING | AllowNull: false, Unique, isEmail | Email Address for Login |
| `passwordHash`| STRING | AllowNull: false | Encrypted password (bcrypt) |
| `role` | STRING | Default 'Veterinarian' | Role (Admin / Vet / Staff) |
| `createdAt` | DATE | Auto-managed | Account Creation Timestamp |
| `updatedAt` | DATE | Auto-managed | Last Update Timestamp |

### Model 2: `Appointment` (`appointments` table)
| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | STRING | Primary Key, `APT-XXXX` format | Appointment Identifier |
| `petName` | STRING | AllowNull: false, min 2 chars | Pet Patient Name |
| `species` | STRING | AllowNull: false | Dog, Cat, Bird, Rabbit, etc. |
| `breed` | STRING | Default 'Mixed' | Breed information |
| `ownerName` | STRING | AllowNull: false | Pet Guardian Name |
| `ownerPhone`| STRING | AllowNull: false | 10-digit Phone Number |
| `ownerEmail`| STRING | AllowNull: false, isEmail | Contact Email Address |
| `appointmentDate` | DATE | AllowNull: false | Scheduled Datetime |
| `service` | STRING | AllowNull: false | General Checkup, Vaccination, etc.|
| `status` | ENUM | 'Scheduled','Confirmed','In Progress','Completed','Cancelled' | Consultation Lifecycle Status |
| `notes` | TEXT | AllowNull: true | Clinical symptoms or instructions |
| `createdBy` | STRING | Default 'Web Client' | Audit Creator Name |

---

## 3. Environment Variables Configuration
### Backend `.env`:
```env
PORT=6001
NODE_ENV=development
CLIENT_URL=http://localhost:5174
JWT_SECRET=super_secret_fsd_ca3_key_roll67_sukhada
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite
# Production PostgreSQL (Render):
# DATABASE_URL=postgres://petcare_admin:secret@dpg-render-postgres:5432/petcare_db
```

### Frontend `.env`:
```env
VITE_API_URL=http://localhost:6001/api
```

---

## 4. Cloud Deployment Guide

### A. Deploying Backend to Render
1. Push the code repository to GitHub.
2. In the Render Dashboard, create a **New PostgreSQL Database** named `petcare-postgres-db`. Note the Internal Connection String.
3. Create a **New Web Service** pointing to the repository root with directory `Program-5-FullStack-Integration/backend`:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Set Environment Variables on Render:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: Linked from `petcare-postgres-db`
   - `JWT_SECRET`: Random 64-character secret
5. Deploy Web Service. The backend API will be live at `https://petcare-backend-api.onrender.com`.

### B. Deploying Frontend to Vercel
1. Link the repository to Vercel.
2. Select Root Directory: `Program-5-FullStack-Integration/frontend`.
3. Framework Preset: `Vite`.
4. Build Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Environment Variables:
   - `VITE_API_URL`: `https://petcare-backend-api.onrender.com/api`
6. `vercel.json` ensures client-side routing fallback and API proxying.
7. Click **Deploy**. The React frontend will be live on Vercel!

---

## 5. Local Execution Instructions
```bash
# 1. Start Backend:
cd Program-5-FullStack-Integration/backend
npm install
npm run seed  # Syncs Sequelize tables and inserts seed records
npm start     # Runs server on http://localhost:6001

# 2. Start Frontend:
cd ../frontend
npm install
npm run dev   # Runs React client on http://localhost:5174
```
