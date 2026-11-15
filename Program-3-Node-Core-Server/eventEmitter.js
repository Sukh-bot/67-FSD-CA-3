/**
 * Custom EventEmitter for Pet Care Appointment Lifecycle
 * FSD Continuous Assessment (CA-3) | Program 3
 * Student: sukhada bhave | Roll No: 67
 */

const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class AppointmentEmitter extends EventEmitter {}

const appointmentEmitter = new AppointmentEmitter();
const AUDIT_LOG_FILE = path.join(__dirname, 'data', 'audit.log');

// Helper to append log entries
function appendAuditLog(action, message, data = {}) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] [EVENT: ${action.toUpperCase()}] ${message} | Payload: ${JSON.stringify(data)}\n`;
  
  fs.appendFile(AUDIT_LOG_FILE, entry, (err) => {
    if (err) console.error('Failed to append to audit log:', err);
  });
  console.log(`\x1b[36m[EVENT EMITTED]\x1b[0m ${action} -> ${message}`);
}

// 1. Listener: Appointment Created Event
appointmentEmitter.on('appointment:created', (appointment) => {
  const msg = `New booking created for ${appointment.petName} (${appointment.species}) by ${appointment.ownerName}`;
  appendAuditLog('appointment:created', msg, { id: appointment.id, service: appointment.service });
  
  // Simulated Notification Dispatcher (Email / SMS)
  console.log(`\x1b[32m[NOTIFICATION]\x1b[0m 📧 Sent confirmation email to ${appointment.ownerEmail} for Pet: ${appointment.petName}`);
});

// 2. Listener: Appointment Status Updated Event
appointmentEmitter.on('appointment:updated', (appointment, previousStatus) => {
  const msg = `Status updated for ${appointment.petName} (ID: ${appointment.id}) from "${previousStatus}" to "${appointment.status}"`;
  appendAuditLog('appointment:updated', msg, { id: appointment.id, newStatus: appointment.status });
  
  console.log(`\x1b[33m[NOTIFICATION]\x1b[0m 📲 Sent SMS alert to ${appointment.ownerPhone}: Appointment status is now "${appointment.status}"`);
});

// 3. Listener: Appointment Cancelled/Deleted Event
appointmentEmitter.on('appointment:cancelled', (appointment) => {
  const msg = `Appointment cancelled for ${appointment.petName} (ID: ${appointment.id}) by ${appointment.ownerName}`;
  appendAuditLog('appointment:cancelled', msg, { id: appointment.id });
  
  console.log(`\x1b[31m[NOTIFICATION]\x1b[0m ⚠️ Alert: Slot released for ${appointment.appointmentDate}`);
});

module.exports = {
  appointmentEmitter,
  AUDIT_LOG_FILE
};
