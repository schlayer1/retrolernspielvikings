const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function main() {
  const groups = [
    { name: 'Viking age-1', dir: 'Assets/extracted/Viking age-1' },
    { name: 'Viking', dir: 'Assets/extracted/Viking' },
    { name: 'Medieval Monastery', dir: 'Assets/extracted/Medieval Monastery' },
    { name: 'Medieval Farm', dir: 'Assets/extracted/Medieval Farm' },
    { name: 'Medieval Fortress Tileset', dir: 'Assets/extracted/Medieval Fortress Tileset' },
    { name: 'Medieval Battlefield', dir: 'Assets/extracted/Medieval Battlefield' },
    { name: 'Ruined Medieval Village', dir: 'Assets/extracted/Ruined Medieval Village' },
  ];

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { background: #12131a; color: #eee; font-family: -apple-system, sans-serif; padding: 24px; }
    h1 { color: #facc15; font-size: 24px; margin-bottom: 20px; }
    h2 { color: #38bdf8; font-size: 18px; margin-top: 30px; border-bottom: 1px solid #334; padding-bottom: 6px; }
    .grid-wrap { display: flex; flex-wrap: wrap; gap: 20px; }
    .sheet-card { background: #1e202e; border: 1px solid #374151; border-radius: 8px; overflow: hidden; }
    .card-title { background: #2a2d40; padding: 6px 12px; font-weight: bold; font-size: 13px; color: #fde047; }
    .canvas-container { position: relative; width: 768px; height: 768px; }
    .sheet-img { width: 768px; height: 768px; image-rendering: pixelated; display: block; }
    .coord-grid { position: absolute; top: 0; left: 0; width: 768px; height: 768px; pointer-events: none; }
    line { stroke: rgba(255, 255, 255, 0.22); stroke-width: 1; }
    text { fill: #facc15; font-size: 9px; font-weight: bold; font-family: monospace; }
  </style></head><body><h1>Vikings & Medieval Asset Sheet Inspector (48x48 Cell Grid)</h1>`;

  for (const g of groups) {
    if (!fs.existsSync(g.dir)) continue;
    html += `<h2>${g.name}</h2><div class="grid-wrap">`;
    const files = fs.readdirSync(g.dir).filter(f => f.endsWith('.png') && (f.startsWith('tile-B') || f.includes('(')));
    for (const f of files) {
      const full = path.join(g.dir, f);
      const b64 = fs.readFileSync(full).toString('base64');
      html += `
      <div class="sheet-card">
        <div class="card-title">${g.name} &bull; ${f}</div>
        <div class="canvas-container">
          <img src="data:image/png;base64,${b64}" class="sheet-img" />
          <svg class="coord-grid" viewBox="0 0 768 768">`;
      for (let i = 0; i <= 16; i++) {
        html += `<line x1="${i * 48}" y1="0" x2="${i * 48}" y2="768" />`;
        html += `<line x1="0" y1="${i * 48}" x2="768" y2="${i * 48}" />`;
      }
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          if (x % 2 === 0 && y % 2 === 0) {
            html += `<text x="${x * 48 + 3}" y="${y * 48 + 12}">${x},${y}</text>`;
          }
        }
      }
      html += `</svg></div></div>`;
    }
    html += `</div>`;
  }

  html += `</body></html>`;
  fs.mkdirSync('scratch', { recursive: true });
  fs.writeFileSync('scratch/sheet_overview.html', html);
  console.log('✅ Generated scratch/sheet_overview.html');
}

main().catch(console.error);
