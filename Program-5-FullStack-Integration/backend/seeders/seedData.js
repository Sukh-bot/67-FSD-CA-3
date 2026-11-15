const bcrypt = require('bcryptjs');
const { sequelize, User, Appointment } = require('../models');

async function seedDatabase() {
  await sequelize.sync({ alter: true });

  const userCount = await User.count();
  if (userCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Sukhada@2026', salt);

    await User.create({
      name: 'Dr. Sukhada Bhave',
      email: 'sukhada.bhave@vetcare.com',
      passwordHash,
      role: 'Chief Veterinary Officer'
    });
    console.log('Seeded default admin user: sukhada.bhave@vetcare.com');
  }

  const aptCount = await Appointment.count();
  if (aptCount === 0) {
    await Appointment.bulkCreate([
      {
        id: 'APT-5001',
        petName: 'Rocky',
        species: 'Dog',
        breed: 'Labrador',
        ownerName: 'Vikas Sharma',
        ownerPhone: '9820112233',
        ownerEmail: 'vikas.s@example.com',
        appointmentDate: new Date(Date.now() + 86400000),
        service: 'Vaccination',
        status: 'Confirmed',
        notes: 'Rabies Booster and Deworming.',
        createdBy: 'Dr. Sukhada Bhave'
      },
      {
        id: 'APT-5002',
        petName: 'Mimi',
        species: 'Cat',
        breed: 'Persian Cat',
        ownerName: 'Radha Joshi',
        ownerPhone: '9833224455',
        ownerEmail: 'radha.j@example.com',
        appointmentDate: new Date(Date.now() + 172800000),
        service: 'Grooming & Spa',
        status: 'Scheduled',
        notes: 'Full coat grooming and claw clipping.',
        createdBy: 'Dr. Sukhada Bhave'
      },
      {
        id: 'APT-5003',
        petName: 'Thor',
        species: 'Dog',
        breed: 'German Shepherd',
        ownerName: 'Aakash Deshmukh',
        ownerPhone: '9819998877',
        ownerEmail: 'aakash.d@example.com',
        appointmentDate: new Date(Date.now() + 259200000),
        service: 'General Checkup',
        status: 'In Progress',
        notes: 'Limping on right hind leg after agility training.',
        createdBy: 'Dr. Sukhada Bhave'
      }
    ]);
    console.log('Seeded default appointment records.');
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database sync and seed completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
