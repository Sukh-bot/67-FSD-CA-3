const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function getBase64Image(filename) {
  const filePath = path.join(__dirname, 'screenshots', filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

async function buildReport() {
  console.log('Building standalone HTML & PDF submission document...');

  const img_p1_ui = getBase64Image('program1_ui.png');
  const img_p1_interaction = getBase64Image('program1_interaction.png');
  const img_p2_home = getBase64Image('program2_home.png');
  const img_p2_form = getBase64Image('program2_form.png');
  const img_p2_analytics = getBase64Image('program2_analytics.png');
  const img_p3_dashboard = getBase64Image('program3_dashboard.png');
  const img_p3_api = getBase64Image('program3_api_response.png');
  const img_p4_routes = getBase64Image('program4_api_routes.png');
  const img_p4_json = getBase64Image('program4_appointments_json.png');
  const img_p5_dashboard = getBase64Image('program5_fullstack_dashboard.png');
  const img_p5_booking = getBase64Image('program5_fullstack_booking.png');
  const img_p5_db = getBase64Image('program5_database_persisted.png');
  const img_p5_login = getBase64Image('program5_login.png');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FSD CA-3 Practical Submission | Roll 67 - sukhada bhave</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0f766e;
      --primary-dark: #134e4a;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-200: #e2e8f0;
      --slate-100: #f8fafc;
      --border: #cbd5e1;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      background: #f1f5f9;
      padding: 20px;
    }
    .document-page {
      background: #ffffff;
      max-width: 1040px;
      margin: 0 auto;
      padding: 50px 60px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      border-radius: 8px;
    }
    .cover-header {
      text-align: center;
      border-bottom: 3px double var(--primary);
      padding-bottom: 24px;
      margin-bottom: 30px;
    }
    .institute-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--primary-dark);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .dept-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--slate-700);
      margin-top: 4px;
    }
    .assessment-badge {
      display: inline-block;
      background: #0f766e;
      color: white;
      font-weight: 800;
      font-size: 0.85rem;
      padding: 6px 16px;
      border-radius: 20px;
      margin: 16px 0 10px;
      text-transform: uppercase;
    }
    .subject-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--slate-900);
    }
    .student-meta-box {
      background: #f0fdfa;
      border: 1.5px solid #99f6e4;
      border-radius: 8px;
      padding: 18px 24px;
      margin: 24px 0 36px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      font-size: 0.95rem;
    }
    .student-meta-box strong { color: var(--primary-dark); }
    h2.section-header {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--primary-dark);
      border-left: 5px solid var(--primary);
      padding-left: 12px;
      margin: 38px 0 16px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--slate-800);
      margin: 20px 0 10px;
    }
    p { margin-bottom: 12px; font-size: 0.95rem; color: #334155; }
    ul, ol { margin-left: 24px; margin-bottom: 16px; font-size: 0.95rem; }
    li { margin-bottom: 6px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0 24px;
      font-size: 0.88rem;
    }
    th, td {
      border: 1px solid var(--slate-200);
      padding: 10px 14px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      font-weight: 700;
      color: var(--slate-900);
    }
    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      background: #f1f5f9;
      color: #0f766e;
      padding: 2px 6px;
      border-radius: 4px;
    }
    pre {
      background: #0f172a;
      color: #e2e8f0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 14px 0 20px;
      line-height: 1.45;
    }
    .figure-box {
      margin: 24px 0;
      text-align: center;
      background: #f8fafc;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 14px;
    }
    .figure-box img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }
    .figure-caption {
      font-size: 0.84rem;
      color: var(--slate-600);
      font-weight: 600;
      margin-top: 10px;
    }
    .co-pill {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 0.76rem;
    }
    .page-break {
      page-break-before: always;
      margin-top: 40px;
    }
    @media print {
      body { background: white; padding: 0; }
      .document-page { box-shadow: none; padding: 20px 30px; max-width: 100%; }
      .page-break { page-break-before: always; }
      pre { white-space: pre-wrap; word-break: break-all; }
    }
  </style>
</head>
<body>

<div class="document-page">

  <!-- Cover / Header Header -->
  <div class="cover-header">
    <div class="institute-title">Department of Artificial Intelligence & Data Science</div>
    <div class="dept-title">B.E. (AI & DS) | Semester V | Continuous Assessment 3 (CA-3)</div>
    <div class="assessment-badge">Laboratory Practical Assignment Report</div>
    <div class="subject-title">Full Stack Development: Web Dev</div>
  </div>

  <div class="student-meta-box">
    <div><strong>Student Name:</strong> sukhada bhave</div>
    <div><strong>Roll Number:</strong> 67</div>
    <div><strong>Class & Semester:</strong> B.E. (AI & DS), Semester V</div>
    <div><strong>Academic Year:</strong> 2026–2027</div>
    <div><strong>Total Programs:</strong> 5 Programs (Covering CO1 through CO6)</div>
    <div><strong>Submission Date:</strong> November 15, 2026</div>
  </div>

  <!-- Course Outcomes Matrix -->
  <h2 class="section-header">Course Outcomes (CO1 – CO6) Mapping Matrix</h2>
  <table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Program Title</th>
        <th>Course Outcome</th>
        <th>Bloom's Level</th>
        <th>Key Modules & Frameworks</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Browser-Based Pet Care Appointment Interface</td>
        <td><span class="co-pill">CO1, CO2</span></td>
        <td>Level 3 (Apply), Level 4 (Analyze)</td>
        <td>HTML5, CSS3 Grid/Flexbox, JavaScript DOM, Fetch API, async/await</td>
      </tr>
      <tr>
        <td>2</td>
        <td>React Application for Pet Care Appointment</td>
        <td><span class="co-pill">CO3</span></td>
        <td>Level 3 (Apply), Level 4 (Analyze)</td>
        <td>React 18, JSX, Functional Components, useState, useEffect, React Router v6</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Node.js Server-Side Utility without Express</td>
        <td><span class="co-pill">CO4</span></td>
        <td>Level 3 (Apply), Level 4 (Analyze)</td>
        <td>Pure Node.js Core Modules (http, fs/promises, path, EventEmitter, stream.Readable)</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Express.js REST API with Middleware & JWT Security</td>
        <td><span class="co-pill">CO5</span></td>
        <td>Level 4 (Analyze), Level 5 (Evaluate)</td>
        <td>Express.js, Request Logging, Input Validation, Centralized Error Handling, JWT, Bcrypt</td>
      </tr>
      <tr>
        <td>5</td>
        <td>Full-Stack Integration & Cloud Deployment Setup</td>
        <td><span class="co-pill">CO6</span></td>
        <td>Level 5 (Evaluate), Level 6 (Create)</td>
        <td>React Frontend + Express Backend, Sequelize ORM (SQLite / PostgreSQL), CORS, Vercel & Render</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- PROGRAM 1 -->
  <h2 class="section-header">Program 1: Browser-Based Pet Care Appointment Interface</h2>
  <p><strong>Course Outcomes:</strong> <span class="co-pill">CO1</span> (HTML/CSS & DOM manipulation) and <span class="co-pill">CO2</span> (Asynchronous JavaScript & Fetch API)</p>
  
  <h3>1. Aim & Objectives</h3>
  <p>To design and implement a responsive browser-based pet care appointment interface using semantic HTML5, CSS3, and modern vanilla JavaScript. The interface validates user inputs, demonstrates asynchronous data retrieval using Fetch API with <code>async</code>/<code>await</code>, dynamically updates the DOM, supports multi-field sorting, and logs simulated HTTP network operations in real time.</p>

  <h3>2. Theoretical Highlights</h3>
  <ul>
    <li><strong>DOM Event Handling:</strong> Event listeners intercept input, change, and submit actions, executing validation without page refreshes.</li>
    <li><strong>Fetch API with <code>async</code>/<code>await</code>:</strong> Native Promise-based HTTP requests fetch remote datasets cleanly and handle network errors gracefully.</li>
    <li><strong>JSON Data Interchange:</strong> Form input is converted to standard JSON request payloads and rendered dynamically onto the view.</li>
  </ul>

  <div class="figure-box">
    <img src="${img_p1_ui}" alt="Program 1 Dashboard">
    <div class="figure-caption">Figure 1.1: Program 1 Main Dashboard View showing KPI metrics, appointment booking form, appointment cards, and live HTTP activity inspector.</div>
  </div>

  <div class="figure-box">
    <img src="${img_p1_interaction}" alt="Program 1 Interaction">
    <div class="figure-caption">Figure 1.2: Program 1 Dynamic Form Submission and Modal Dialog for editing consultation status and doctor's clinical notes.</div>
  </div>

  <div class="page-break"></div>

  <!-- PROGRAM 2 -->
  <h2 class="section-header">Program 2: React Application for Pet Care Appointment</h2>
  <p><strong>Course Outcome:</strong> <span class="co-pill">CO3</span> (React Functional Components, JSX, Props, State, Hooks & Routing)</p>

  <h3>1. Aim & Objectives</h3>
  <p>To architect a Single-Page Application (SPA) in React 18 for pet care appointment booking. Demonstrates modular functional components, JSX, props and state management via <code>useState</code> and <code>useEffect</code>, conditional rendering, and client-side routing with React Router DOM v6.</p>

  <h3>2. Theoretical Highlights</h3>
  <ul>
    <li><strong>Component-Driven Architecture:</strong> UI is partitioned into reusable components (<code>Navbar</code>, <code>AppointmentCard</code>, <code>AppointmentForm</code>, <code>StatsSummary</code>).</li>
    <li><strong>React Hooks:</strong> <code>useState</code> manages local form state; <code>useEffect</code> synchronizes state with browser <code>localStorage</code>.</li>
    <li><strong>React Router v6:</strong> Declarative routing between listing view (<code>/</code>), booking form (<code>/book</code>), and operational analytics (<code>/analytics</code>).</li>
  </ul>

  <div class="figure-box">
    <img src="${img_p2_home}" alt="React Home View">
    <div class="figure-caption">Figure 2.1: React Application Home View displaying appointment cards, search and filter controls, and dynamic KPI statistics.</div>
  </div>

  <div class="figure-box">
    <img src="${img_p2_form}" alt="React Booking Form">
    <div class="figure-caption">Figure 2.2: React Controlled Booking Form Component with input validation and state management.</div>
  </div>

  <div class="figure-box">
    <img src="${img_p2_analytics}" alt="React Analytics">
    <div class="figure-caption">Figure 2.3: React Operational Analytics View displaying service distribution and species breakdown.</div>
  </div>

  <div class="page-break"></div>

  <!-- PROGRAM 3 -->
  <h2 class="section-header">Program 3: Node.js Server-Side Utility without Express</h2>
  <p><strong>Course Outcome:</strong> <span class="co-pill">CO4</span> (Node.js Core Modules: HTTP, File System, Path, Events, and Streams)</p>

  <h3>1. Aim & Objectives</h3>
  <p>To develop a server-side pet care appointment utility purely with native Node.js core modules. Implements an HTTP server using <code>http.createServer</code>, stores and retrieves JSON records using <code>fs.promises</code> and <code>path</code>, dispatches lifecycle events with <code>EventEmitter</code>, and streams CSV data with <code>stream.Readable</code>.</p>

  <h3>2. Theoretical Highlights</h3>
  <ul>
    <li><strong>Native HTTP Server:</strong> Implements manual request routing for <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>DELETE</code> without external frameworks.</li>
    <li><strong>Asynchronous File I/O:</strong> Reads and writes records from flat files non-blockingly using <code>fs.promises</code>.</li>
    <li><strong>EventEmitter:</strong> Decoupled notification dispatching (<code>appointment:created</code>, <code>appointment:updated</code>, <code>appointment:cancelled</code>).</li>
    <li><strong>Node.js Streams:</strong> Memory-efficient CSV export using <code>stream.Readable.pipe(res)</code> and log streaming via <code>fs.createReadStream</code>.</li>
  </ul>

  <div class="figure-box">
    <img src="${img_p3_dashboard}" alt="Node Core Dashboard">
    <div class="figure-caption">Figure 3.1: Program 3 Core Node.js HTTP Server Web Dashboard and Route Catalog.</div>
  </div>

  <div class="figure-box">
    <img src="${img_p3_api}" alt="Node Core API JSON">
    <div class="figure-caption">Figure 3.2: Program 3 API Appointments JSON Response loaded asynchronously from file storage.</div>
  </div>

  <div class="page-break"></div>

  <!-- PROGRAM 4 -->
  <h2 class="section-header">Program 4: Express.js REST API with Middleware & JWT Security</h2>
  <p><strong>Course Outcome:</strong> <span class="co-pill">CO5</span> (RESTful APIs, Custom Middleware, Centralized Error Handling, JWT & Bcrypt)</p>

  <h3>1. Aim & Objectives</h3>
  <p>To develop a full-featured Express.js REST API for pet care appointment management. Features complete CRUD routes, custom request logging, input validation middleware, centralized error handling, and role-protected routes secured with bcrypt password hashing and signed JWT tokens.</p>

  <h3>2. Theoretical Highlights</h3>
  <ul>
    <li><strong>Middleware Pipeline:</strong> Middleware sequence handles latency logging, CORS, body parsing, input validation, and JWT verification.</li>
    <li><strong>Bcrypt Password Hashing:</strong> Applies 10 salt rounds to hash credentials, protecting against rainbow table attacks.</li>
    <li><strong>JWT Authentication:</strong> Issues signed bearer tokens verifying authenticity without server session storage.</li>
    <li><strong>Centralized Error Handling:</strong> Catches operational and runtime errors, responding with standardized JSON status codes.</li>
  </ul>

  <div class="figure-box">
    <img src="${img_p4_routes}" alt="Express REST API Routes">
    <div class="figure-caption">Figure 4.1: Express REST API Documentation Dashboard displaying route manifest and authentication rules.</div>
  </div>

  <div class="figure-box">
    <img src="${img_p4_json}" alt="Express Appointments JSON">
    <div class="figure-caption">Figure 4.2: Express REST API Appointments Endpoint delivering filtered JSON records.</div>
  </div>

  <div class="page-break"></div>

  <!-- PROGRAM 5 -->
  <h2 class="section-header">Program 5: Full-Stack Integration & Cloud Deployment</h2>
  <p><strong>Course Outcome:</strong> <span class="co-pill">CO6</span> (Full-Stack Architecture, Sequelize ORM, CORS, Environment Variables & Cloud Deployment)</p>

  <h3>1. Aim & Objectives</h3>
  <p>To integrate the React frontend with an Express backend, persisting data using Sequelize ORM with PostgreSQL and SQLite support. Implements CORS, environment variable isolation, and cloud deployment configuration for Vercel (frontend) and Render (backend).</p>

  <h3>2. Theoretical Highlights</h3>
  <ul>
    <li><strong>Full-Stack Architecture:</strong> Decoupled React client communicating with Express REST API over HTTP/JSON.</li>
    <li><strong>Sequelize ORM:</strong> Maps JavaScript models (<code>User</code>, <code>Appointment</code>) to SQL tables with schema migrations and validation.</li>
    <li><strong>CORS & Environment Variables:</strong> Configures cross-origin access and separates configuration via <code>.env</code>.</li>
    <li><strong>Cloud Deployment:</strong> Automated build manifests for Vercel (<code>vercel.json</code>) and Render (<code>render.yaml</code>).</li>
  </ul>

  <div class="figure-box">
    <img src="${img_p5_dashboard}" alt="Full-Stack Dashboard">
    <div class="figure-caption">Figure 5.1: Integrated Full-Stack Dashboard showing live data retrieved from Express API and Sequelize Database.</div>
  </div>

  <div class="figure-box">
    <img src="${img_p5_booking}" alt="Full-Stack Booking">
    <div class="figure-caption">Figure 5.2: Full-Stack Booking Interface dispatching HTTP POST requests to backend.</div>
  </div>

  <div class="figure-box">
    <img src="${img_p5_db}" alt="Database Persisted Record">
    <div class="figure-caption">Figure 5.3: Database Persistence Verification: Newly booked appointment ('Buddy') displayed in live table.</div>
  </div>

  <div class="figure-box">
    <img src="${img_p5_login}" alt="Staff JWT Login">
    <div class="figure-caption">Figure 5.4: Staff JWT Authentication Portal validating credentials and managing session tokens.</div>
  </div>

  <div class="page-break"></div>

  <!-- CONCLUSION -->
  <h2 class="section-header">Overall Conclusion & Student Declaration</h2>
  <p>All five assigned Full Stack Development Continuous Assessment (CA-3) programming exercises have been built, tested, verified, and documented. The assignments collectively demonstrate proficiency across the full web development stack: from HTML5/CSS3 and client-side DOM manipulation, through React single-page component development, to native Node.js core server utilities, secure Express.js REST APIs with JWT authentication, and full-stack integration with Sequelize ORM database persistence and cloud deployment manifests.</p>

  <div style="margin-top: 40px; border-top: 2px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between;">
    <div>
      <p><strong>Student Name:</strong> sukhada bhave</p>
      <p><strong>Roll No:</strong> 67</p>
      <p><strong>Branch:</strong> B.E. (AI & DS), Semester V</p>
    </div>
    <div style="text-align: right;">
      <p><strong>Evaluation Status:</strong> Completed & Verified</p>
      <p><strong>Date:</strong> November 15, 2026</p>
    </div>
  </div>

</div>

</body>
</html>`;

  const htmlPath = path.join(__dirname, 'CA3_FSD_Practical_Submission_Roll67.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
  console.log(`Saved Standalone Report HTML to: ${htmlPath}`);

  // Generate PDF via Puppeteer & Edge
  console.log('Rendering PDF via Headless Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const pdfPath = path.join(__dirname, 'CA3_FSD_Practical_Submission_Roll67.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
  });

  console.log(`Saved Formal Academic PDF to: ${pdfPath}`);
  await browser.close();
}

buildReport().catch(err => {
  console.error('Report build failed:', err);
  process.exit(1);
});
