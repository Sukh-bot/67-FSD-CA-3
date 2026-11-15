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

async function captureProgram3() {
  console.log('Starting Program 3 Core Node server on port 4000...');
  const server = spawn('node', ['server.js'], {
    cwd: path.resolve(__dirname, 'Program-3-Node-Core-Server'),
    stdio: 'inherit'
  });

  try {
    await waitForServer('http://localhost:4000/');
    console.log('Program 3 Core Server is ready!');

    // Run test client to trigger events and CRUD operations
    const { runTests } = require('./Program-3-Node-Core-Server/test-client.js');
    await runTests();

    const browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 950, deviceScaleFactor: 1 });

    // 1. Capture Dashboard HTML
    await page.goto('http://localhost:4000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program3_dashboard.png') });
    console.log('Program 3 Dashboard captured.');

    // 2. Capture API JSON listing
    await page.goto('http://localhost:4000/api/appointments', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program3_api_response.png') });
    console.log('Program 3 API Response captured.');

    await browser.close();
  } finally {
    server.kill();
  }
}

captureProgram3().catch(err => {
  console.error('Program 3 capture failed:', err);
  process.exit(1);
});
