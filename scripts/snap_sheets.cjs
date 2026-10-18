const fs = require('fs');
const puppeteer = require('puppeteer-core');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function snap() {
  fs.mkdirSync('scratch/snaps', { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file://' + process.cwd() + '/scratch/sheet_overview.html');
  await page.setViewport({ width: 1600, height: 1200 });
  const cards = await page.$$('.sheet-card');
  console.log('Found cards:', cards.length);
  for (let i = 0; i < Math.min(cards.length, 15); i++) {
    const titleEl = await cards[i].$('.card-title');
    const title = await page.evaluate(el => el.textContent, titleEl);
    const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
    await cards[i].screenshot({ path: 'scratch/snaps/' + cleanTitle + '.png' });
    console.log('Captured', cleanTitle);
  }
  await browser.close();
}
snap().catch(console.error);
