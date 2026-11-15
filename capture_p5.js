const puppeteer = require('puppeteer-core');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function waitForServer(url, timeout = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode < 400) resolve();
        else setTimeout(check, 300);
      }).on('error', (err) => {
        if (Date.now() - start > timeout) reject(new Error(`Timed out waiting for ${url}`));
        else setTimeout(check, 300);
      });
    };
    check();
  });
}

async function captureProgram5() {
  console.log('1. Starting Program 5 Backend on port 6001...');
  const backend = spawn('node', ['server.js'], {
    cwd: path.resolve(__dirname, 'Program-5-FullStack-Integration/backend'),
    stdio: 'inherit'
  });

  console.log('2. Starting Program 5 Frontend on port 5174...');
  const frontend = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--port', '5174'], {
    cwd: path.resolve(__dirname, 'Program-5-FullStack-Integration/frontend'),
    stdio: 'ignore'
  });

  try {
    await waitForServer('http://localhost:6001/api/health');
    console.log('Backend API is healthy!');

    await waitForServer('http://localhost:5174/');
    console.log('Frontend is running!');

    const browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 950, deviceScaleFactor: 1 });

    // Step A: Capture Dashboard with initial DB data
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program5_fullstack_dashboard.png') });
    console.log('Program 5 Dashboard captured.');

    // Step B: Navigate to /book and pre-fill form
    await page.goto('http://localhost:5174/book', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    await page.type('input[name="petName"]', 'Buddy');
    await page.select('select[name="species"]', 'Dog');
    await page.type('input[name="breed"]', 'Golden Retriever');
    await page.type('input[name="ownerName"]', 'Sukhada Bhave (Roll 67)');
    await page.type('input[name="ownerPhone"]', '9876543210');
    await page.type('input[name="ownerEmail"]', 'sukhada.bhave@vetcare.com');
    await page.type('input[name="appointmentDate"]', '2026-11-30T10:00');
    await page.select('select[name="service"]', 'Surgery Consultation');
    await page.type('textarea[name="notes"]', 'Pre-operative evaluation for orthopedic knee examination.');

    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program5_fullstack_booking.png') });
    console.log('Program 5 Booking form captured.');

    // Step C: Submit form to trigger HTTP POST to Express & SQLite/Postgres
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));

    // Step D: Capture updated Dashboard showing the newly persisted DB record
    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program5_database_persisted.png') });
    console.log('Program 5 Database persisted state captured.');

    // Step E: Capture Staff Login page
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program5_login.png') });
    console.log('Program 5 Staff Login captured.');

    await browser.close();
  } finally {
    backend.kill();
    frontend.kill();
  }
}

captureProgram5().catch(err => {
  console.error('Program 5 capture failed:', err);
  process.exit(1);
});
