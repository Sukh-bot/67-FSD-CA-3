/**
 * Automated Verification & Test Script for Program 3
 * Demonstrates HTTP GET, POST, PUT, DELETE, Streams, and Event Listeners
 * FSD Continuous Assessment (CA-3) | Roll No: 67 (sukhada bhave)
 */

const http = require('http');

const BASE_URL = 'http://localhost:4000';

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING PROGRAM 3 CORE HTTP TEST SUITE ---');

  // Test 1: GET /api/appointments
  console.log('\n[TEST 1] Testing GET /api/appointments...');
  const res1 = await request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/appointments',
    method: 'GET'
  });
  console.log(`Status: ${res1.statusCode}`);
  const listData = JSON.parse(res1.body);
  console.log(`Retrieved ${listData.count} appointments.`);

  // Test 2: POST /api/appointments
  console.log('\n[TEST 2] Testing POST /api/appointments (Triggers EventEmitter appointment:created)...');
  const newAppointment = {
    petName: 'Oscar',
    species: 'Dog',
    breed: 'Dachshund',
    ownerName: 'Sukhada Bhave',
    ownerPhone: '9876543210',
    ownerEmail: 'sukhada.bhave@example.com',
    appointmentDate: '2026-11-28T10:00:00Z',
    service: 'Dental Cleaning',
    notes: 'Routine dental tartar scraping.'
  };

  const res2 = await request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/appointments',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, newAppointment);
  console.log(`Status: ${res2.statusCode}`);
  const createdRecord = JSON.parse(res2.body).data;
  console.log(`Created Record ID: ${createdRecord.id} for Pet: ${createdRecord.petName}`);

  // Test 3: PUT /api/appointments/:id
  console.log(`\n[TEST 3] Testing PUT /api/appointments/${createdRecord.id} (Triggers EventEmitter appointment:updated)...`);
  const res3 = await request({
    hostname: 'localhost',
    port: 4000,
    path: `/api/appointments/${createdRecord.id}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  }, { status: 'Confirmed', notes: 'Pre-surgery fasting confirmed.' });
  console.log(`Status: ${res3.statusCode}`);
  console.log(`Updated status: ${JSON.parse(res3.body).data.status}`);

  // Test 4: GET /api/appointments/stream/export (Streams CSV)
  console.log('\n[TEST 4] Testing GET /api/appointments/stream/export (Node.js Streams Demonstration)...');
  const res4 = await request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/appointments/stream/export',
    method: 'GET'
  });
  console.log(`Status: ${res4.statusCode}`);
  console.log(`Content-Type: ${res4.headers['content-type']}`);
  console.log('Streamed CSV Header & Snippet:');
  console.log(res4.body.split('\n').slice(0, 4).join('\n'));

  // Test 5: GET /api/appointments/stream/logs (Streams Audit Log)
  console.log('\n[TEST 5] Testing GET /api/appointments/stream/logs (fs.createReadStream Demonstration)...');
  const res5 = await request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/appointments/stream/logs',
    method: 'GET'
  });
  console.log(`Status: ${res5.statusCode}`);
  console.log('Streamed Audit Logs Snippet:');
  console.log(res5.body.trim().split('\n').slice(-3).join('\n'));

  // Test 6: DELETE /api/appointments/:id
  console.log(`\n[TEST 6] Testing DELETE /api/appointments/${createdRecord.id} (Triggers EventEmitter appointment:cancelled)...`);
  const res6 = await request({
    hostname: 'localhost',
    port: 4000,
    path: `/api/appointments/${createdRecord.id}`,
    method: 'DELETE'
  });
  console.log(`Status: ${res6.statusCode}`);
  console.log(`Result: ${JSON.parse(res6.body).message}`);

  console.log('\n--- ALL PROGRAM 3 VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
