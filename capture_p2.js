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
        resolve();
      }).on('error', (err) => {
        if (Date.now() - start > timeout) {
          reject(new Error('Server start timed out'));
        } else {
          setTimeout(check, 300);
        }
      });
    };
    check();
  });
}

async function captureProgram2() {
  console.log('Starting Vite preview server...');
  const server = spawn('cmd.exe', ['/c', 'npx', 'vite', 'preview', '--port', '5173'], {
    cwd: path.resolve(__dirname, 'Program-2-React-App'),
    stdio: 'ignore'
  });

  try {
    await waitForServer('http://localhost:5173/');
    console.log('Preview server is up!');

    const browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 950, deviceScaleFactor: 1 });

    // 1. Capture Home Page
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program2_home.png') });
    console.log('Program 2 Home captured.');

    // 2. Capture Booking Form Page
    await page.goto('http://localhost:5173/book', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.type('#petName', 'Cocoa');
    await page.select('#species', 'Cat');
    await page.type('#breed', 'Ragdoll');
    await page.type('#ownerName', 'Sukhada Bhave (Roll 67)');
    await page.type('#ownerPhone', '9892112233');
    await page.type('#ownerEmail', 'sukhada.bhave@petcare.org');
    await page.type('#appointmentDate', '2026-11-26T14:30');
    await page.select('#service', 'Grooming & Spa');
    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program2_form.png') });
    console.log('Program 2 Booking Form captured.');

    // 3. Capture Analytics Page
    await page.goto('http://localhost:5173/analytics', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program2_analytics.png') });
    console.log('Program 2 Analytics captured.');

    await browser.close();
  } finally {
    server.kill();
  }
}

captureProgram2().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
