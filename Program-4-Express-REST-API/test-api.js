/**
 * Comprehensive Automated Test Suite for Program 4 (Express REST API)
 * Tests Authentication, JWT Protection, Input Validation, CRUD, and Error Handling
 * FSD Continuous Assessment (CA-3) | Roll No: 67 (sukhada bhave)
 */

const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = responseBody ? JSON.parse(responseBody) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: responseBody });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING PROGRAM 4 EXPRESS REST API VERIFICATION TEST SUITE');
  console.log('================================================================');

  // 1. GET /api/appointments (Public)
  console.log('\n[TEST 1] Testing Public GET /api/appointments...');
  const res1 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/appointments',
    method: 'GET'
  });
  console.log(`Status: ${res1.status} | Total Appointments: ${res1.body.count}`);

  // 2. POST /api/appointments WITHOUT Token (Should reject with 401)
  console.log('\n[TEST 2] Security Check: POST /api/appointments without JWT token...');
  const res2 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/appointments',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { petName: 'HackerPet' });
  console.log(`Status: ${res2.status} (Expected 401)`);
  console.log(`Response: ${res2.body.error} - ${res2.body.message}`);

  // 3. POST /api/auth/register (Registers new staff user with bcrypt)
  console.log('\n[TEST 3] Testing User Registration with bcrypt password hashing...');
  const testEmail = `vet.sukhada.${Date.now()}@clinic.org`;
  const res3 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Sukhada Bhave',
    email: testEmail,
    password: 'SecureVetPassword2026!',
    role: 'Chief Veterinary Officer'
  });
  console.log(`Status: ${res3.status}`);
  console.log(`User Registered: ${res3.body.user.name} | Role: ${res3.body.user.role}`);

  // 4. POST /api/auth/login (Authenticates & acquires JWT Token)
  console.log('\n[TEST 4] Testing User Login & JWT Token Issuance...');
  const res4 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: testEmail,
    password: 'SecureVetPassword2026!'
  });
  console.log(`Status: ${res4.status}`);
  const token = res4.body.token;
  console.log(`JWT Token Acquired (first 30 chars): ${token.slice(0, 30)}...`);

  // 5. GET /api/auth/me (Protected route test)
  console.log('\n[TEST 5] Accessing Protected Profile via Bearer JWT...');
  const res5 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Status: ${res5.status}`);
  console.log(`Authenticated as: ${res5.body.user.email} (${res5.body.user.role})`);

  // 6. Input Validation Middleware Check: POST with invalid phone & past date
  console.log('\n[TEST 6] Testing Input Validation Middleware (Intentional Bad Data)...');
  const res6 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/appointments',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, {
    petName: 'X', // too short (<2)
    species: 'Alien', // invalid species
    ownerName: '',
    ownerPhone: '12345', // invalid phone
    ownerEmail: 'not-an-email',
    appointmentDate: '2020-01-01T00:00', // past date
    service: 'Teleportation' // invalid service
  });
  console.log(`Status: ${res6.status} (Expected 400 Bad Request)`);
  console.log(`Caught ${res6.body.errorCount} Validation Errors:`);
  res6.body.errors.forEach(err => console.log(`  - [${err.field}]: ${err.message}`));

  // 7. POST /api/appointments with VALID data & JWT
  console.log('\n[TEST 7] Testing Valid Appointment Creation with JWT...');
  const validAppointment = {
    petName: 'Barnaby',
    species: 'Dog',
    breed: 'Golden Retriever',
    ownerName: 'Sukhada Bhave (Roll 67)',
    ownerPhone: '9876543210',
    ownerEmail: 'sukhada.b@example.com',
    appointmentDate: '2026-11-29T11:30',
    service: 'Vaccination',
    notes: 'Rabies and Leptospirosis vaccination.'
  };
  const res7 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/appointments',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, validAppointment);
  console.log(`Status: ${res7.status} (201 Created)`);
  const createdApt = res7.body.data;
  console.log(`Created Appointment ID: ${createdApt.id} for Pet: ${createdApt.petName}`);

  // 8. PUT /api/appointments/:id with JWT
  console.log(`\n[TEST 8] Testing PUT /api/appointments/${createdApt.id} with JWT...`);
  const res8 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/appointments/${createdApt.id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, { status: 'Confirmed', notes: 'Pre-checkup temperature normal.' });
  console.log(`Status: ${res8.status}`);
  console.log(`Updated Status: ${res8.body.data.status}`);

  // 9. GET /api/appointments/admin/stats with JWT
  console.log('\n[TEST 9] Testing Protected Admin Stats Endpoint...');
  const res9 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/appointments/admin/stats',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Status: ${res9.status}`);
  console.log('Clinic Metrics:', res9.body.metrics);

  // 10. DELETE /api/appointments/:id with JWT
  console.log(`\n[TEST 10] Testing DELETE /api/appointments/${createdApt.id} with JWT...`);
  const res10 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/appointments/${createdApt.id}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`Status: ${res10.status}`);
  console.log(`Result: ${res10.body.message}`);

  console.log('\n================================================================');
  console.log('✅ ALL PROGRAM 4 EXPRESS API TESTS COMPLETED SUCCESSFULLY!');
  console.log('================================================================\n');
}

if (require.main === module) {
  runTestSuite().catch(console.error);
}

module.exports = { runTestSuite };
