const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture(url, outputPath, width = 1280, height = 900) {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000)); // allow animations and state to settle

  await page.screenshot({ path: outputPath, fullPage: false });
  console.log(`Saved screenshot to: ${outputPath}`);
  await browser.close();
}

async function run() {
  const htmlPath = 'file:///' + path.resolve(__dirname, 'Program-1-Vanilla-JS/index.html').replace(/\\/g, '/');
  const outPath = path.resolve(__dirname, 'screenshots/program1_ui.png');
  await capture(htmlPath, outPath);
}

run().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
