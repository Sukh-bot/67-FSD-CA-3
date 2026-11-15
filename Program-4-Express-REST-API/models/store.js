/**
 * Data Access Store for Program 4 (Express REST API)
 * FSD Continuous Assessment (CA-3) | Roll No: 67 (sukhada bhave)
 */

const bcrypt = require('bcryptjs');

// In-memory persistent collections
let users = [
  {
    id: "USR-001",
    name: "Dr. Sukhada Bhave",
    email: "sukhada.bhave@vetclinic.com",
    // Pre-hashed password for: "DoctorPass@123"
    passwordHash: bcrypt.hashSync("DoctorPass@123", 10),
    role: "Veterinarian",
    createdAt: new Date().toISOString()
  }
];

let appointments = [
  {
    id: "APT-4001",
    petName: "Max",
    species: "Dog",
    breed: "German Shepherd",
    ownerName: "Arjun Verma",
    ownerPhone: "9820123456",
    ownerEmail: "arjun.v@example.com",
    appointmentDate: "2026-11-24T10:30",
    service: "General Checkup",
    status: "Confirmed",
    notes: "Post-surgery recovery assessment.",
    createdAt: "2026-11-15T09:00:00Z"
  },
  {
    id: "APT-4002",
    petName: "Cleo",
    species: "Cat",
    breed: "Siamese",
    ownerName: "Shruti Sen",
    ownerPhone: "9833221100",
    ownerEmail: "shruti.s@example.com",
    appointmentDate: "2026-11-25T14:00",
    service: "Vaccination",
    status: "Scheduled",
    notes: "FVRCP booster vaccination.",
    createdAt: "2026-11-15T09:30:00Z"
  },
  {
    id: "APT-4003",
    petName: "Shadow",
    species: "Dog",
    breed: "Siberian Husky",
    ownerName: "Karthik Iyer",
    ownerPhone: "9819001122",
    ownerEmail: "karthik.i@example.com",
    appointmentDate: "2026-11-26T16:15",
    service: "Grooming & Spa",
    status: "In Progress",
    notes: "Thermal coat blowout and nail trimming.",
    createdAt: "2026-11-15T10:00:00Z"
  }
];

module.exports = {
  users,
  appointments
};
