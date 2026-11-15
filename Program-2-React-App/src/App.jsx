import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookAppointment from './pages/BookAppointment';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import { initialAppointments } from './data/initialData';
import './App.css';

const LOCAL_STORAGE_KEY = 'PETCARE_PLUS_REACT_APTS_V1';

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // useEffect Hook: Load appointments on initial render
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing stored appointments', err);
        setAppointments(initialAppointments);
      }
    } else {
      setAppointments(initialAppointments);
    }
    // Simulate brief network latency for state demo
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage when appointments change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
    }
  }, [appointments, isLoading]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Event Handler: Add new appointment
  const handleAddAppointment = (newApt) => {
    setAppointments((prev) => [newApt, ...prev]);
    triggerToast(`Appointment booked successfully for ${newApt.petName}!`);
  };

  // Event Handler: Update status
  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    triggerToast(`Updated appointment status to "${newStatus}"`);
  };

  // Event Handler: Delete appointment
  const handleDelete = (id) => {
    const target = appointments.find((a) => a.id === id);
    if (window.confirm(`Are you sure you want to cancel the appointment for ${target ? target.petName : 'this pet'}?`)) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      triggerToast(`Cancelled appointment for ${target ? target.petName : id}`);
    }
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar appointmentsCount={appointments.length} />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  appointments={appointments}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  isLoading={isLoading}
                />
              }
            />
            <Route
              path="/book"
              element={<BookAppointment onAddAppointment={handleAddAppointment} />}
            />
            <Route
              path="/analytics"
              element={<Analytics appointments={appointments} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global Toast */}
        {toastMessage && (
          <div className="global-toast">
            <span>🐾</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Academic Footer */}
        <footer className="academic-footer">
          <div className="container footer-grid">
            <div>
              <h4>Department of Artificial Intelligence and Data Science</h4>
              <p>Full Stack Development (Web Dev) Continuous Assessment 3 (CA-3)</p>
            </div>
            <div className="student-credit">
              <p>Developed by: <strong>sukhada bhave</strong></p>
              <p>Roll No: <strong>67</strong> | Semester V</p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
