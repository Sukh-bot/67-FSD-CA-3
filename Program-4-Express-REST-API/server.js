/**
 * Express.js REST API Server
 * Pet Care Appointment System
 * FSD Continuous Assessment (CA-3) | Program 4 (CO5)
 * Student: sukhada bhave | Roll No: 67 | B.E. AI & DS (Sem V)
 */

const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Root Documentation Landing Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Program 4 - Express.js REST API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 32px; margin: 0; }
        .box { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; max-width: 960px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .tag { background: #6366f1; color: white; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 0.8rem; display: inline-block; margin-bottom: 12px; }
        h1 { color: #818cf8; font-size: 1.6rem; margin: 0 0 8px; }
        p { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; }
        .student-banner { background: #0b1120; border-left: 4px solid #818cf8; padding: 12px; border-radius: 6px; margin: 16px 0; font-size: 0.85rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 0.84rem; }
        th, td { padding: 9px 12px; border: 1px solid #334155; text-align: left; }
        th { background: #0f172a; color: #e2e8f0; }
        .m-get { color: #38bdf8; font-weight: 700; }
        .m-post { color: #4ade80; font-weight: 700; }
        .m-put { color: #fbbf24; font-weight: 700; }
        .m-del { color: #f87171; font-weight: 700; }
        .pill-prot { background: #4338ca; color: #e0e7ff; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; }
        .pill-pub { background: #065f46; color: #d1fae5; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; }
        .btn { background: #4f46e5; color: white; padding: 8px 14px; text-decoration: none; border-radius: 6px; font-size: 0.82rem; font-weight: 600; display: inline-block; margin-right: 8px; margin-top: 16px; }
        .btn:hover { background: #4338ca; }
      </style>
    </head>
    <body>
      <div class="box">
        <span class="tag">CO5 | Express.js REST API with JWT Auth & Middleware</span>
        <h1>🐾 Pet Care Appointment REST API</h1>
        <p>Production-grade Express.js application featuring request logging, input validation, bcrypt password hashing, JWT token authentication, and centralized error handling.</p>
        
        <div class="student-banner">
          <strong>Student:</strong> sukhada bhave | <strong>Roll No:</strong> 67 | <strong>Course:</strong> B.E. AI & DS (Sem V)<br>
          <strong>Status:</strong> Active & Serving API Requests on Port ${PORT}
        </div>

        <h3>API Route Manifest</h3>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Auth Type</th>
              <th>Middleware & Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="m-post">POST</span></td>
              <td>/api/auth/register</td>
              <td><span class="pill-pub">Public</span></td>
              <td><code>validateRegistration</code>, bcrypt password hashing (10 salt rounds)</td>
            </tr>
            <tr>
              <td><span class="m-post">POST</span></td>
              <td>/api/auth/login</td>
              <td><span class="pill-pub">Public</span></td>
              <td>bcrypt compare, issues signed JWT token</td>
            </tr>
            <tr>
              <td><span class="m-get">GET</span></td>
              <td>/api/auth/me</td>
              <td><span class="pill-prot">JWT Protected</span></td>
              <td><code>authenticateJWT</code>, returns decoded token user</td>
            </tr>
            <tr>
              <td><span class="m-get">GET</span></td>
              <td>/api/appointments</td>
              <td><span class="pill-pub">Public</span></td>
              <td>List all records with query filters (<code>status</code>, <code>service</code>, <code>search</code>, <code>sortBy</code>)</td>
            </tr>
            <tr>
              <td><span class="m-get">GET</span></td>
              <td>/api/appointments/:id</td>
              <td><span class="pill-pub">Public</span></td>
              <td>Fetch single appointment by ID</td>
            </tr>
            <tr>
              <td><span class="m-post">POST</span></td>
              <td>/api/appointments</td>
              <td><span class="pill-prot">JWT Protected</span></td>
              <td><code>authenticateJWT</code> + <code>validateAppointment</code> middleware</td>
            </tr>
            <tr>
              <td><span class="m-put">PUT</span></td>
              <td>/api/appointments/:id</td>
              <td><span class="pill-prot">JWT Protected</span></td>
              <td><code>authenticateJWT</code>, updates record</td>
            </tr>
            <tr>
              <td><span class="m-del">DELETE</span></td>
              <td>/api/appointments/:id</td>
              <td><span class="pill-prot">JWT Protected</span></td>
              <td><code>authenticateJWT</code>, deletes record</td>
            </tr>
            <tr>
              <td><span class="m-get">GET</span></td>
              <td>/api/appointments/admin/stats</td>
              <td><span class="pill-prot">JWT Protected</span></td>
              <td><code>authenticateJWT</code>, returns operational clinic statistics</td>
            </tr>
          </tbody>
        </table>

        <div>
          <a href="/api/appointments" class="btn">📋 View Appointments Endpoint</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Catch-All 404 Handler
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 [Program 4] Express REST API running on: http://localhost:${PORT}`);
    console.log(`👤 Student: sukhada bhave | Roll No: 67 | Course: B.E. AI & DS`);
    console.log(`🔐 JWT Auth & Bcrypt Security Initialized`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
