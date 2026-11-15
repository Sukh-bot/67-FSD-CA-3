# Full Stack Development (FSD) – Continuous Assessment 3 (CA-3)
## B.E. (Artificial Intelligence & Data Science) | Semester V

### Student Information:
- **Student Name:** sukhada bhave
- **Roll No:** 67
- **Degree:** B.E. (AI & DS)
- **Department:** Department of Artificial Intelligence and Data Science
- **Course Outcomes:** CO1, CO2, CO3, CO4, CO5, CO6

---

## Repository Structure

```
.
├── Program-1-Vanilla-JS/            # CO1, CO2: Browser-based UI with DOM manipulation, Fetch API & async/await
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── appointments.json
│   └── README.md
│
├── Program-2-React-App/             # CO3: React SPA with functional components, hooks, props, state & routing
│   ├── src/
│   │   ├── components/              # AppointmentCard, AppointmentForm, StatsSummary, StatusBadge, etc.
│   │   ├── pages/                   # Home, BookAppointment, Analytics, NotFound
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
├── Program-3-Node-Core-Server/      # CO4: Server utility without Express (http, fs, path, EventEmitter, stream)
│   ├── server.js
│   ├── eventEmitter.js
│   ├── streamHandler.js
│   ├── test-client.js
│   ├── data/appointments.json
│   └── README.md
│
├── Program-4-Express-REST-API/      # CO5: Express REST API with CRUD, logging, input validation, JWT & bcrypt
│   ├── server.js
│   ├── middleware/                  # auth.js, logger.js, validate.js, errorHandler.js
│   ├── controllers/                 # authController.js, appointmentController.js
│   ├── routes/                      # authRoutes.js, appointmentRoutes.js
│   ├── test-api.js
│   └── README.md
│
├── Program-5-FullStack-Integration/ # CO6: React frontend + Express backend + Sequelize ORM + Deployment setup
│   ├── backend/                     # Express REST API with Sequelize ORM (PostgreSQL & SQLite)
│   │   ├── config/database.js
│   │   ├── models/                  # User.js, Appointment.js
│   │   ├── seeders/seedData.js
│   │   ├── render.yaml
│   │   └── server.js
│   ├── frontend/                    # React 18 client connected to backend API
│   │   ├── src/api/client.js
│   │   ├── src/pages/               # Dashboard, BookAppointment, AuthLogin
│   │   └── vercel.json
│   └── README.md
│
├── screenshots/                     # 13 verified high-resolution execution screenshots
│   ├── program1_ui.png
│   ├── program1_interaction.png
│   ├── program2_home.png
│   ├── program2_form.png
│   ├── program2_analytics.png
│   ├── program3_dashboard.png
│   ├── program3_api_response.png
│   ├── program4_api_routes.png
│   ├── program4_appointments_json.png
│   ├── program5_fullstack_dashboard.png
│   ├── program5_fullstack_booking.png
│   ├── program5_database_persisted.png
│   └── program5_login.png
│
├── CA3_FSD_Practical_Submission_Roll67.md   # Complete Academic Laboratory Submission Report
├── CA3_FSD_Practical_Submission_Roll67.html # Standalone HTML Report with embedded images
├── CA3_FSD_Practical_Submission_Roll67.pdf  # Formal Academic PDF document (A4 format)
├── vercel.json                              # Frontend deployment configuration
└── render.yaml                              # Backend & PostgreSQL deployment configuration
```

---

## Course Outcome (CO) Mapping

| No. | Task / Program | Course Outcome | Description |
|---|---|---|---|
| **1** | Pet Care Appointment Interface | **CO1, CO2** | HTML5, CSS3, JavaScript DOM manipulation, event handling, Fetch API, `async`/`await`, JSON, dynamic sorting & status updates. |
| **2** | React Pet Care Application | **CO3** | Functional components, JSX, props, `useState`, `useEffect`, conditional rendering, controlled forms, React Router DOM (v6). |
| **3** | Node.js Server-Side Utility | **CO4** | Core Node.js HTTP server without Express, `fs/promises`, `path`, `events.EventEmitter` lifecycle events, and `stream.Readable` CSV exports. |
| **4** | Express.js REST API | **CO5** | CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`), custom logging, input validation middleware, centralized error handling, bcrypt password hashing, and JWT authorization. |
| **5** | Full-Stack Integration | **CO6** | React frontend connected to Express API, database persistence with Sequelize ORM (SQLite / PostgreSQL), CORS, environment variables, deployment on Vercel and Render. |

---

## How to Run Locally

### Program 1: Vanilla JS Interface
```bash
cd Program-1-Vanilla-JS
# Open index.html directly in any browser
```

### Program 2: React Application
```bash
cd Program-2-React-App
npm install
npm run dev
# Running on http://localhost:5173
```

### Program 3: Node.js Core Server
```bash
cd Program-3-Node-Core-Server
node server.js
# Running on http://localhost:4000
# Run automated test suite:
node test-client.js
```

### Program 4: Express.js REST API
```bash
cd Program-4-Express-REST-API
npm install
node server.js
# Running on http://localhost:5000
# Run automated test suite:
node test-api.js
```

### Program 5: Full-Stack Integrated App
```bash
# Terminal 1 - Backend API:
cd Program-5-FullStack-Integration/backend
npm install
node server.js
# Running on http://localhost:6001

# Terminal 2 - Frontend Client:
cd Program-5-FullStack-Integration/frontend
npm install
npm run dev
# Running on http://localhost:5174
```

---

## Deployment Configuration

- **Backend (Render):** Defined in [`render.yaml`](./render.yaml) deploying a Node.js web service linked to a managed PostgreSQL database.
- **Frontend (Vercel):** Defined in [`vercel.json`](./vercel.json) deploying the Vite React SPA with API proxying and client-side routing rewrites.
