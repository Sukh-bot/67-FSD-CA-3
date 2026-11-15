/**
 * Program 5: Integrated Express Backend with Sequelize ORM
 * FSD Continuous Assessment (CA-3) | CO6
 * Student: sukhada bhave | Roll No: 67 | B.E. AI & DS (Sem V)
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const seedDatabase = require('./seeders/seedData');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 6001;

// CORS configuration supporting Vite frontend and cloud deployments
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health / Status Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'PetCare Full-Stack API',
    database: process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite (Sequelize)',
    developer: 'sukhada bhave (Roll 67)',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Error handling middleware
app.use(errorHandler);

// Start Server and Database
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('\x1b[32m[DB SUCCESS]\x1b[0m Database connection established with Sequelize.');

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 [Program 5] Integrated Backend running on: http://localhost:${PORT}`);
      console.log(`👤 Student: sukhada bhave | Roll No: 67 | B.E. AI & DS (Sem V)`);
      console.log(`🗄️ Database: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite'}`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to initialize server or database:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
