# Program 4: Express.js REST API for Pet Care Appointments

**Course Outcome:** CO5 (Develop RESTful Web Services with Express.js, Custom Middleware, JWT Authentication, and Centralized Error Handling)  
**Student:** sukhada bhave | **Roll No:** 67 | **Branch:** B.E. (AI & DS) Semester V

---

## Overview
This program implements a complete, enterprise-grade RESTful API built on Node.js and Express.js. It features full CRUD operations, robust request logging, declarative input validation middleware, password hashing using `bcryptjs` with salt rounds, signed JWT authentication, and centralized error handling.

## Core Architectural Pillars
1. **CRUD REST Routes**:
   - `GET /api/appointments`: Fetches appointments with query filtering (`status`, `service`), search keyword matching, and sorting.
   - `GET /api/appointments/:id`: Fetches a specific appointment by ID.
   - `POST /api/appointments`: Creates appointment (Protected with JWT & validated).
   - `PUT /api/appointments/:id`: Updates an appointment (Protected with JWT).
   - `DELETE /api/appointments/:id`: Deletes an appointment (Protected with JWT).
   - `GET /api/appointments/admin/stats`: Returns operational clinic metrics (Protected with JWT).
2. **Middleware Pipeline**:
   - `requestLogger`: Measures response latency, client IP, HTTP method, and response status with color-coded console output.
   - `validateAppointment`: Validates field presence, types, regex checks on phone & email, and future datetime restrictions; returns structured 400 Bad Request error arrays.
   - `authenticateJWT`: Extracts Bearer token from the `Authorization` header, verifies the signature using `jwt.verify`, attaches `req.user`, and prevents unauthorized access.
   - `errorHandler`: Express centralized error handler catching unexpected errors, returning standardized JSON responses with timestamps and paths.
3. **Security**:
   - Passwords hashed using bcrypt with 10 salt rounds.
   - Stateless JWT tokens signed with secret and expiry.
   - CORS enabled for cross-origin client integration.

## Installation & Execution
```bash
# Navigate to directory
cd Program-4-Express-REST-API

# Install dependencies
npm install

# Start Express server
node server.js

# Run automated test suite
node test-api.js
```
