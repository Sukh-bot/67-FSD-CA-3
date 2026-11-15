/**
 * Node.js Server-Side Utility for Pet Care Appointments
 * Built without Express using Native Core Modules (http, fs, path, events, stream)
 * FSD Continuous Assessment (CA-3) | Program 3 (CO4)
 * Student: sukhada bhave | Roll No: 67 | B.E. AI & DS (Sem V)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { appointmentEmitter, AUDIT_LOG_FILE } = require('./eventEmitter');
const { createAppointmentCsvStream } = require('./streamHandler');

const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, 'data', 'appointments.json');

// Ensure data folder and files exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
}
if (!fs.existsSync(AUDIT_LOG_FILE)) {
  fs.writeFileSync(AUDIT_LOG_FILE, `[${new Date().toISOString()}] Audit log initialized by sukhada bhave (Roll 67)\n`, 'utf-8');
}

/**
 * Helper to read records from disk asynchronously using fs.promises
 */
async function readAppointments() {
  try {
    const raw = await fs.promises.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading appointments file:', err);
    return [];
  }
}

/**
 * Helper to write records to disk asynchronously using fs.promises
 */
async function writeAppointments(data) {
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Helper to read JSON request body stream
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Guard against huge payload attacks
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', err => reject(err));
  });
}

/**
 * Helper to send JSON responses with CORS headers
 */
function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
}

// Create native HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  console.log(`\x1b[35m[HTTP]\x1b[0m ${method} ${pathname}`);

  try {
    // -----------------------------------------------------------------
    // 1. Root Dashboard Landing Page
    // -----------------------------------------------------------------
    if (pathname === '/' && method === 'GET') {
      const appointments = await readAppointments();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Program 3 - Core Node.js HTTP Server</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 30px; margin: 0; }
            .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; max-width: 900px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
            .badge { background: #0d9488; color: white; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; display: inline-block; margin-bottom: 12px; }
            h1 { margin: 0 0 8px; color: #38bdf8; font-size: 1.6rem; }
            p { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; }
            .meta { background: #0b1120; border-left: 4px solid #38bdf8; padding: 12px; border-radius: 6px; margin: 16px 0; font-size: 0.85rem; }
            .routes-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 0.85rem; }
            .routes-table th, .routes-table td { padding: 10px; border: 1px solid #334155; text-align: left; }
            .routes-table th { background: #0f172a; color: #e2e8f0; }
            .method-get { color: #38bdf8; font-weight: 700; }
            .method-post { color: #4ade80; font-weight: 700; }
            .method-put { color: #fbbf24; font-weight: 700; }
            .method-del { color: #f87171; font-weight: 700; }
            .btn { background: #0284c7; color: white; padding: 8px 14px; text-decoration: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; display: inline-block; margin-right: 8px; }
            .btn:hover { background: #0369a1; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">CO4 | Node.js Server Utility (No Express)</span>
            <h1>🐾 Pet Care Appointment Server Utility</h1>
            <p>Engineered using core Node.js modules: <code>http</code>, <code>fs/promises</code>, <code>path</code>, <code>events.EventEmitter</code>, and <code>stream.Readable</code>.</p>
            
            <div class="meta">
              <strong>Student:</strong> sukhada bhave | <strong>Roll No:</strong> 67 | <strong>Course:</strong> B.E. AI & DS (Sem V)<br>
              <strong>Active Storage File:</strong> <code>${DATA_FILE}</code> (${appointments.length} records loaded)
            </div>

            <h3>Exposed Endpoints</h3>
            <table class="routes-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Route URL</th>
                  <th>Description</th>
                  <th>Module Demonstrations</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="method-get">GET</span></td>
                  <td><a href="/api/appointments" style="color:#38bdf8;">/api/appointments</a></td>
                  <td>List all pet appointments</td>
                  <td><code>fs.promises.readFile</code> & <code>path.join</code></td>
                </tr>
                <tr>
                  <td><span class="method-get">GET</span></td>
                  <td><a href="/api/appointments/stream/export" style="color:#38bdf8;">/api/appointments/stream/export</a></td>
                  <td>Export appointments as CSV stream</td>
                  <td><code>stream.Readable</code> piped to HTTP <code>res</code></td>
                </tr>
                <tr>
                  <td><span class="method-get">GET</span></td>
                  <td><a href="/api/appointments/stream/logs" style="color:#38bdf8;">/api/appointments/stream/logs</a></td>
                  <td>Stream live audit event logs</td>
                  <td><code>fs.createReadStream</code> piped to <code>res</code></td>
                </tr>
                <tr>
                  <td><span class="method-post">POST</span></td>
                  <td>/api/appointments</td>
                  <td>Book new appointment</td>
                  <td><code>parseRequestBody</code>, <code>fs.writeFile</code>, <code>EventEmitter ('appointment:created')</code></td>
                </tr>
                <tr>
                  <td><span class="method-put">PUT</span></td>
                  <td>/api/appointments/:id</td>
                  <td>Update status/notes</td>
                  <td><code>fs.writeFile</code>, <code>EventEmitter ('appointment:updated')</code></td>
                </tr>
                <tr>
                  <td><span class="method-del">DELETE</span></td>
                  <td>/api/appointments/:id</td>
                  <td>Cancel appointment</td>
                  <td><code>fs.writeFile</code>, <code>EventEmitter ('appointment:cancelled')</code></td>
                </tr>
              </tbody>
            </table>

            <div style="margin-top: 24px;">
              <a href="/api/appointments" class="btn">📋 View Appointments JSON</a>
              <a href="/api/appointments/stream/export" class="btn">⬇️ Download CSV Stream</a>
              <a href="/api/appointments/stream/logs" class="btn">📜 Stream Audit Logs</a>
            </div>
          </div>
        </body>
        </html>
      `);
    }

    // -----------------------------------------------------------------
    // 2. Stream Export Endpoint: GET /api/appointments/stream/export
    // Demonstrates: stream.Readable piped to HTTP response
    // -----------------------------------------------------------------
    if (pathname === '/api/appointments/stream/export' && method === 'GET') {
      const appointments = await readAppointments();
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="appointments-export.csv"',
        'Access-Control-Allow-Origin': '*'
      });

      const csvStream = createAppointmentCsvStream(appointments);
      console.log(`\x1b[32m[STREAM]\x1b[0m Piping ${appointments.length} appointment records into CSV response stream.`);
      return csvStream.pipe(res);
    }

    // -----------------------------------------------------------------
    // 3. Stream Audit Logs: GET /api/appointments/stream/logs
    // Demonstrates: fs.createReadStream piped to HTTP response
    // -----------------------------------------------------------------
    if (pathname === '/api/appointments/stream/logs' && method === 'GET') {
      if (!fs.existsSync(AUDIT_LOG_FILE)) {
        return sendJsonResponse(res, 404, { success: false, message: 'Audit log not found' });
      }

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });

      console.log(`\x1b[32m[STREAM]\x1b[0m Piping audit log stream via fs.createReadStream.`);
      const logStream = fs.createReadStream(AUDIT_LOG_FILE);
      return logStream.pipe(res);
    }

    // -----------------------------------------------------------------
    // 4. REST CRUD: GET /api/appointments
    // -----------------------------------------------------------------
    if (pathname === '/api/appointments' && method === 'GET') {
      const appointments = await readAppointments();
      return sendJsonResponse(res, 200, {
        success: true,
        count: appointments.length,
        student: "sukhada bhave (Roll 67)",
        data: appointments
      });
    }

    // -----------------------------------------------------------------
    // 5. REST CRUD: GET /api/appointments/:id
    // -----------------------------------------------------------------
    const singleMatch = pathname.match(/^\/api\/appointments\/([a-zA-Z0-9\-_]+)$/);
    if (singleMatch && method === 'GET') {
      const id = singleMatch[1];
      const appointments = await readAppointments();
      const record = appointments.find(a => a.id.toLowerCase() === id.toLowerCase());

      if (!record) {
        return sendJsonResponse(res, 404, {
          success: false,
          error: `Appointment with ID "${id}" was not found.`
        });
      }

      return sendJsonResponse(res, 200, {
        success: true,
        data: record
      });
    }

    // -----------------------------------------------------------------
    // 6. REST CRUD: POST /api/appointments
    // Demonstrates: Request Body parsing, File System writing, EventEmitter
    // -----------------------------------------------------------------
    if (pathname === '/api/appointments' && method === 'POST') {
      const body = await parseRequestBody(req);

      // Validate required fields
      if (!body.petName || !body.ownerName || !body.ownerPhone || !body.service) {
        return sendJsonResponse(res, 400, {
          success: false,
          error: 'Validation Error: petName, ownerName, ownerPhone, and service are mandatory fields.'
        });
      }

      const appointments = await readAppointments();

      const newRecord = {
        id: body.id || `APT-${Math.floor(3000 + Math.random() * 7000)}`,
        petName: body.petName.trim(),
        species: body.species || 'Dog',
        breed: body.breed || 'Unknown',
        ownerName: body.ownerName.trim(),
        ownerPhone: body.ownerPhone.trim(),
        ownerEmail: body.ownerEmail || 'client@example.com',
        appointmentDate: body.appointmentDate || new Date(Date.now() + 86400000).toISOString(),
        service: body.service,
        status: body.status || 'Scheduled',
        notes: body.notes || '',
        createdAt: new Date().toISOString()
      };

      appointments.push(newRecord);
      await writeAppointments(appointments);

      // Emit event using custom EventEmitter
      appointmentEmitter.emit('appointment:created', newRecord);

      return sendJsonResponse(res, 201, {
        success: true,
        message: 'Appointment created successfully',
        data: newRecord
      });
    }

    // -----------------------------------------------------------------
    // 7. REST CRUD: PUT /api/appointments/:id
    // Demonstrates: Updating records in File System & emitting update event
    // -----------------------------------------------------------------
    if (singleMatch && method === 'PUT') {
      const id = singleMatch[1];
      const body = await parseRequestBody(req);
      const appointments = await readAppointments();
      const index = appointments.findIndex(a => a.id.toLowerCase() === id.toLowerCase());

      if (index === -1) {
        return sendJsonResponse(res, 404, {
          success: false,
          error: `Cannot update: Appointment "${id}" not found.`
        });
      }

      const previousStatus = appointments[index].status;
      appointments[index] = {
        ...appointments[index],
        ...body,
        id: appointments[index].id, // protect ID
        updatedAt: new Date().toISOString()
      };

      await writeAppointments(appointments);

      // Emit event
      appointmentEmitter.emit('appointment:updated', appointments[index], previousStatus);

      return sendJsonResponse(res, 200, {
        success: true,
        message: `Appointment ${id} updated successfully`,
        data: appointments[index]
      });
    }

    // -----------------------------------------------------------------
    // 8. REST CRUD: DELETE /api/appointments/:id
    // Demonstrates: Removing record from File System & emitting cancel event
    // -----------------------------------------------------------------
    if (singleMatch && method === 'DELETE') {
      const id = singleMatch[1];
      const appointments = await readAppointments();
      const index = appointments.findIndex(a => a.id.toLowerCase() === id.toLowerCase());

      if (index === -1) {
        return sendJsonResponse(res, 404, {
          success: false,
          error: `Cannot delete: Appointment "${id}" not found.`
        });
      }

      const deleted = appointments.splice(index, 1)[0];
      await writeAppointments(appointments);

      // Emit event
      appointmentEmitter.emit('appointment:cancelled', deleted);

      return sendJsonResponse(res, 200, {
        success: true,
        message: `Appointment "${deleted.petName}" (${id}) was cancelled and removed.`,
        data: deleted
      });
    }

    // 404 Route Not Found
    return sendJsonResponse(res, 404, {
      success: false,
      error: `Route ${method} ${pathname} not found on Core Node.js HTTP Server.`
    });

  } catch (err) {
    console.error('Internal Server Error:', err);
    return sendJsonResponse(res, 500, {
      success: false,
      error: 'Internal Server Error',
      details: err.message
    });
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 [Program 3] Node.js Core Server running on: http://localhost:${PORT}`);
  console.log(`👤 Student: sukhada bhave | Roll No: 67 | Course: B.E. AI & DS`);
  console.log(`📦 Storage: ${DATA_FILE}`);
  console.log(`📢 Events & Streams Active!`);
  console.log(`======================================================\n`);
});

module.exports = server;
