const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/nicolekeller/.gemini/antigravity/brain/63380d0c-c6ac-4951-89d7-592d6308cd96';
const LOCAL_OUTPUT_DIR = path.resolve(__dirname, '..', 'verify_output');

// Ensure output directories exist
if (!fs.existsSync(LOCAL_OUTPUT_DIR)) {
  fs.mkdirSync(LOCAL_OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function saveScreenshot(page, filename) {
  const localPath = path.join(LOCAL_OUTPUT_DIR, filename);
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  await page.screenshot({ path: localPath });
  fs.copyFileSync(localPath, artifactPath);
  console.log(`✅ Captured: ${filename}`);
}

async function main() {
  console.log('🚀 Starting Vite preview server on port 4188...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4188', '--strictPort'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log(`[Vite] ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[Vite Err] ${d.toString().trim()}`));

  await sleep(2500);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const errors = [];
  const failedUrls = [];

  try {
    const page = await browser.newPage();

    page.on('pageerror', (err) => {
      console.error('PAGE ERROR:', err.message);
      errors.push(`PAGEERROR: ${err.message}`);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('CONSOLE ERROR:', msg.text());
        errors.push(`CONSOLE: ${msg.text()}`);
      }
    });

    page.on('response', (res) => {
      if (res.status() >= 400) {
        console.warn(`FAILED RESOURCE [${res.status()}]: ${res.url()}`);
        failedUrls.push(`${res.status()} ${res.url()}`);
      }
    });

    // -------------------------------------------------------------------------
    // 1. Desktop Start Screen (1440x900)
    // -------------------------------------------------------------------------
    console.log('Navigating to http://localhost:4188/ ...');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:4188/', { waitUntil: 'networkidle0' });
    await sleep(2000);

    await saveScreenshot(page, 'verify_1_desktop_start.png');

    // -------------------------------------------------------------------------
    // 2. Mobile Landscape Start Screen (844x390, iPhone Querformat)
    // -------------------------------------------------------------------------
    await page.setViewport({ width: 844, height: 390, deviceScaleFactor: 2 });
    await sleep(800);
    await saveScreenshot(page, 'verify_2_mobile_start.png');

    // -------------------------------------------------------------------------
    // 3. Switch back to Desktop 1440x900 & Launch Chapter 1 Dialog
    // -------------------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await sleep(600);

    // Click launch button to start Chapter 1
    await page.click('#start-game-btn');
    await sleep(1000);

    // Open mentor dialog with Astrid die Ältere
    await page.evaluate(() => {
      const world = window.__VIK_WORLD__;
      const ui = window.__VIK_UI__;
      if (world && ui && world.currentChapterData) {
        ui.openMentorDialog(world.currentChapterData);
      }
    });
    await sleep(800);

    await saveScreenshot(page, 'verify_3_ch1_dialog.png');

    // -------------------------------------------------------------------------
    // 4. Chapter 1 Overworld: Fjord village, longhouses, livestock & single-proximity label
    // -------------------------------------------------------------------------
    // Close dialog cleanly
    await page.evaluate(() => {
      const ui = window.__VIK_UI__;
      if (ui) ui.closeModal();
    });
    await sleep(600);

    // Position player slightly west of Astrid die Ältere (tx: 36, ty: 32)
    await page.evaluate(() => {
      const world = window.__VIK_WORLD__;
      if (world && world.player) {
        world.player.setPosition(34.8 * 16, 32 * 16);
        world.cameras.main.pan(35.5 * 16, 32 * 16, 200);
      }
    });
    await sleep(800);

    await saveScreenshot(page, 'verify_4_ch1_overworld.png');

    // -------------------------------------------------------------------------
    // 5. Water & Infrastructure Detail: Drakkar harbor docks & Fjord water
    // -------------------------------------------------------------------------
    await page.evaluate(() => {
      const world = window.__VIK_WORLD__;
      if (world && world.player) {
        // Drakkar & Harbor are at West coast (16..20 * 16, 22..26 * 16)
        world.player.setPosition(20 * 16, 24 * 16);
        world.cameras.main.pan(20 * 16, 24 * 16, 300);
      }
    });
    await sleep(1000);

    await saveScreenshot(page, 'verify_5_water_infrastructure.png');

    // -------------------------------------------------------------------------
    // 6. Evolved Location: Blót-Hain, Runestone & Constructed Buildings
    // -------------------------------------------------------------------------
    await page.evaluate(() => {
      const state = window.__VIK_STATE__;
      const world = window.__VIK_WORLD__;
      if (state) {
        state.builtBuildings.add('b_raederpflug');
        state.builtBuildings.add('b_langhaus_ausbau');
        state.notify();
      }
      if (world && world.player) {
        // Sacred grove & Runestone at (64 * 16, 26 * 16)
        world.player.setPosition(63 * 16, 26 * 16);
        world.cameras.main.pan(63 * 16, 26 * 16, 300);
      }
    });
    await sleep(1000);

    await saveScreenshot(page, 'verify_6_evolved_location.png');

    // -------------------------------------------------------------------------
    // 7. 7-Tile Pause Dashboard: Didactic Hub, Hefter-Code, Stats & Audio
    // -------------------------------------------------------------------------
    await page.evaluate(() => {
      const ui = window.__VIK_UI__;
      if (ui) {
        ui.openPauseDashboard();
      }
    });
    await sleep(800);

    await saveScreenshot(page, 'verify_7_pause_dashboard.png');

    // -------------------------------------------------------------------------
    // 8. Progressive Lexicon Modal: 2-column layout, locked entries & TTS
    // -------------------------------------------------------------------------
    await page.evaluate(() => {
      const ui = window.__VIK_UI__;
      if (ui) {
        ui.openLexicon();
      }
    });
    await sleep(800);

    await saveScreenshot(page, 'verify_8_progressive_lexicon.png');

    // -------------------------------------------------------------------------
    // Summary Report
    // -------------------------------------------------------------------------
    console.log('\n========================================');
    console.log('BROWSER VERIFICATION COMPLETE');
    console.log(`Page Errors: ${errors.length}`);
    console.log(`Failed Resources: ${failedUrls.length}`);
    if (errors.length > 0) {
      console.error('Errors found:\n' + errors.join('\n'));
    }
    if (failedUrls.length > 0) {
      console.warn('Failed URLs:\n' + failedUrls.join('\n'));
    }
    console.log('========================================\n');
  } finally {
    await browser.close();
    server.kill();
    console.log('Vite server stopped and browser closed.');
  }
}

main().catch((err) => {
  console.error('Verification script failed:', err);
  process.exit(1);
});
