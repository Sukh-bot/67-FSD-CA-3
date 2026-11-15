const puppeteer = require('puppeteer-core');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function waitForServer(url, timeout = 10000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => resolve()).on('error', (err) => {
        if (Date.now() - start > timeout) reject(new Error('Server start timed out'));
        else setTimeout(check, 300);
      });
    };
    check();
  });
}

async function captureProgram4() {
  console.log('Starting Program 4 Express REST API server on port 5000...');
  const server = spawn('node', ['server.js'], {
    cwd: path.resolve(__dirname, 'Program-4-Express-REST-API'),
    stdio: 'inherit'
  });

  try {
    await waitForServer('http://localhost:5000/');
    console.log('Program 4 Express Server is ready!');

    // Run test suite
    const { runTestSuite } = require('./Program-4-Express-REST-API/test-api.js');
    await runTestSuite();

    const browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 950, deviceScaleFactor: 1 });

    // 1. Capture API Documentation Dashboard
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program4_api_routes.png') });
    console.log('Program 4 API Documentation captured.');

    // 2. Capture API Appointments JSON
    await page.goto('http://localhost:5000/api/appointments', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program4_appointments_json.png') });
    console.log('Program 4 Appointments JSON captured.');

    await browser.close();
  } finally {
    server.kill();
  }
}

captureProgram4().catch(err => {
  console.error('Program 4 capture failed:', err);
  process.exit(1);
});
