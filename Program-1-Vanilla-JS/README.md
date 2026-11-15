# Program 1: Browser-Based Pet Care Appointment Interface

**Course Outcomes:** CO1 (Design responsive web pages with HTML, CSS & DOM manipulation), CO2 (Asynchronous programming & Fetch API)  
**Student:** sukhada bhave | **Roll No:** 67 | **Branch:** B.E. (AI & DS) Semester V

---

## Overview
This program implements a responsive, accessible, and interactive Pet Care Appointment Interface for "Paws & Claws Veterinary Care". It showcases client-side DOM manipulation, real-time input validation, asynchronous data retrieval using the Fetch API with `async`/`await`, JSON serialization/deserialization, live state updates, sorting, and simulation of standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).

## Key Features
1. **Semantic HTML5 & Modern CSS3**:
   - Flexbox & CSS Grid layouts.
   - Clean, professional veterinary theme with custom variables and animations.
   - Mobile-first responsive layout with accessible interactive components.
2. **DOM Manipulation & Event Handling (CO1)**:
   - Dynamic creation, insertion, updating, and deletion of appointment cards.
   - Real-time form field input validation (names, regex for 10-digit phone, RFC-compliant email, future-dated appointments).
   - Modal dialog for updating appointment statuses and clinical notes.
3. **Asynchronous JavaScript & Fetch API (CO2)**:
   - Asynchronous data fetching from `appointments.json` via `fetch()` with `async`/`await`.
   - Comprehensive error handling with graceful fallback to sample records if network or file protocol restrictions occur.
   - Simulated RESTful HTTP activity inspector showing `GET`, `POST`, `PUT`, and `DELETE` requests in real-time.
4. **Filtering, Searching & Sorting**:
   - Live search by pet name, owner name, breed, or appointment ID.
   - Filtering by appointment status (`Scheduled`, `Confirmed`, `In Progress`, `Completed`, `Cancelled`) and service category.
   - Multi-field sorting (Date Earliest/Latest, Pet Name A-Z/Z-A, Status).
5. **KPI Metrics Dashboard**:
   - Real-time counters showing total, scheduled, confirmed, and completed appointments.

## How to Run
1. Open `index.html` directly in any modern web browser, OR
2. Serve via a local web server (e.g. `npx serve .` or VS Code Live Server) on port 3000 / 5000.
