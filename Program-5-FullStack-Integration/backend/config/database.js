/**
 * Sequelize Database Configuration
 * Supports PostgreSQL for Render deployment and SQLite for local development
 * FSD Continuous Assessment (CA-3) | Roll No: 67 (sukhada bhave)
 */

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // PostgreSQL configuration for Render / Supabase / Neon
  console.log('\x1b[34m[DATABASE]\x1b[0m Connecting to PostgreSQL Database via DATABASE_URL...');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: false
  });
} else {
  // Default Local SQLite configuration
  const storagePath = path.resolve(__dirname, '..', process.env.DB_STORAGE || 'database.sqlite');
  console.log(`\x1b[34m[DATABASE]\x1b[0m Initializing Sequelize with SQLite: ${storagePath}`);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
  });
}

module.exports = sequelize;
