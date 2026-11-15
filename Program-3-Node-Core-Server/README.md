# Program 3: Node.js Server-Side Utility for Pet Care Appointment (Without Express)

**Course Outcome:** CO4 (Develop server-side utilities using Node.js core modules: HTTP, File System, Path, Events, and Streams)  
**Student:** sukhada bhave | **Roll No:** 67 | **Branch:** B.E. (AI & DS) Semester V

---

## Overview
This program implements a robust, lightweight server-side backend utility for pet care appointment management purely using native Node.js core runtime modules. **No third-party web frameworks (such as Express.js) are used.**

## Modules Used & Theoretical Concepts
1. **`http` Module**:
   - `http.createServer()` creates a native HTTP server handling incoming `ClientRequest` and producing `ServerResponse`.
   - Custom URL and regex matching handles routing for `GET`, `POST`, `PUT`, `DELETE` and query parameters.
   - Streaming request body parser buffers chunks while enforcing payload limits.
2. **`fs` and `path` Modules**:
   - `fs.promises.readFile()` and `fs.promises.writeFile()` handle asynchronous non-blocking persistent JSON file I/O.
   - `path.join(__dirname, ...)` ensures cross-platform POSIX and Windows filesystem compatibility.
3. **`events.EventEmitter`**:
   - Custom event emitter class (`AppointmentEmitter`) dispatches lifecycle events:
     - `appointment:created`: triggers audit logging and simulates email confirmations.
     - `appointment:updated`: triggers status change logging and SMS alerts.
     - `appointment:cancelled`: triggers slot release notifications.
4. **`stream` Module**:
   - `stream.Readable`: Custom stream generating on-the-fly CSV data row by row, piped directly to `res`.
   - `fs.createReadStream()`: Streams multi-line audit logs to the HTTP response without loading the whole file into RAM.

## API Endpoints
| HTTP Method | Route URL | Purpose |
|-------------|-----------|---------|
| `GET` | `/` | Web dashboard & documentation UI |
| `GET` | `/api/appointments` | Retrieve all appointments (JSON) |
| `GET` | `/api/appointments/:id` | Retrieve appointment by ID |
| `POST` | `/api/appointments` | Create appointment (triggers EventEmitter) |
| `PUT` | `/api/appointments/:id` | Update status/notes (triggers EventEmitter) |
| `DELETE` | `/api/appointments/:id` | Remove appointment (triggers EventEmitter) |
| `GET` | `/api/appointments/stream/export` | Download CSV using `stream.Readable` |
| `GET` | `/api/appointments/stream/logs` | Stream audit log using `fs.createReadStream` |

## Execution
```bash
# Start server
node server.js

# In a separate terminal or test runner
node test-client.js
```
