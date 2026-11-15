const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function captureProgram1Interactions() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950, deviceScaleFactor: 1 });
  const htmlPath = 'file:///' + path.resolve(__dirname, 'Program-1-Vanilla-JS/index.html').replace(/\\/g, '/');
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Capture main dashboard view
  await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program1_ui.png') });
  console.log('Program 1 main UI captured.');

  // Interact with form: fill in a new pet appointment and submit
  await page.type('#petName', 'Bella');
  await page.select('#species', 'Dog');
  await page.type('#breed', 'Shih Tzu');
  await page.type('#ownerName', 'Sukhada Bhave');
  await page.type('#ownerPhone', '9876543210');
  await page.type('#ownerEmail', 'sukhada.b@example.com');
  await page.type('#appointmentDate', '2026-11-25T11:00');
  await page.select('#service', 'Vaccination');
  await page.type('#notes', 'Puppy DHPP booster shot and general wellness checkup.');

  // Click submit
  await page.click('#submitBtn');
  await new Promise(r => setTimeout(r, 600));

  // Open edit modal on one of the items to showcase modal & DOM manipulation
  const editButtons = await page.$$('.btn-edit');
  if (editButtons.length > 0) {
    await editButtons[0].click();
    await new Promise(r => setTimeout(r, 400));
  }

  await page.screenshot({ path: path.resolve(__dirname, 'screenshots/program1_interaction.png') });
  console.log('Program 1 interaction & modal captured.');

  await browser.close();
}

captureProgram1Interactions().catch(err => {
  console.error('Interaction capture failed:', err);
  process.exit(1);
});
