# Program 2: React Application for Pet Care Appointment

**Course Outcome:** CO3 (Develop dynamic React single-page applications using functional components, hooks, props, state, event handling & routing)  
**Student:** sukhada bhave | **Roll No:** 67 | **Branch:** B.E. (AI & DS) Semester V

---

## Overview
This program implements a Single Page Application (SPA) in React 18 for pet care appointment booking and clinical monitoring. It demonstrates component-driven software architecture, declarative JSX rendering, state lifting, custom React hooks (`useState`, `useEffect`), props validation, controlled input forms, conditional UI rendering, and client-side routing using React Router DOM.

## Key Technical Concepts Demonstrated
1. **Functional Components & Reusability**:
   - `Navbar`: Global responsive header with academic metadata and dynamic appointment count.
   - `AppointmentCard`: Modular card displaying pet records, tags, and action buttons.
   - `AppointmentForm`: Controlled form handling input changes, data validation, and state lifting.
   - `AppointmentList`: Filterable, searchable, and sortable grid view.
   - `StatusBadge`: Pure presentation component mapping status to styling tokens.
   - `StatsSummary`: Dynamic KPI calculation bar.
2. **State & Lifecycle Management**:
   - `useState` for local form states, active filter criteria, query strings, and notification toasts.
   - `useEffect` for synchronizing state with browser `localStorage` and simulated initial data loading.
3. **Conditional Rendering**:
   - Dynamic render states for loading spinners, empty list illustrations, validation error alerts, and status pills.
4. **React Router DOM (v6)**:
   - Declarative route navigation: `/` (Appointments Listing), `/book` (Booking Form), `/analytics` (Operational Breakdown), and `*` (404 Not Found).
5. **Event Handling & Data Flow**:
   - Unidirectional data flow with callback functions passed as props (`onAddAppointment`, `onStatusChange`, `onDelete`).

## How to Install & Run
```bash
# Navigate to directory
cd Program-2-React-App

# Install dependencies
npm install

# Start Vite development server
npm run dev
# The application will launch at http://localhost:5173
```
