const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const atlasJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/assets/world/world_atlas.json'), 'utf8'));
const frames = atlasJson.frames;

function getPngDims(filePath) {
  const buf = fs.readFileSync(filePath);
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const propDims = {
  relic_marker_glow: { w: 32, h: 32 },
  npc: { w: 17, h: 32 }
};
const propsDir = path.join(ROOT, 'public/assets/props');
if (fs.existsSync(propsDir)) {
  for (const f of fs.readdirSync(propsDir)) {
    if (f.endsWith('.png')) {
      propDims[f.replace('.png', '')] = getPngDims(path.join(propsDir, f));
    }
  }
}

const worldCode = fs.readFileSync(path.join(ROOT, 'src/scenes/WorldScene.ts'), 'utf8');
const relicsCode = fs.readFileSync(path.join(ROOT, 'src/data/relics.ts'), 'utf8');
const itemsCode = fs.readFileSync(path.join(ROOT, 'src/data/items.ts'), 'utf8');

const items = [];
function addBox(label, x, y, w, h, scale = 1, originX = 0.5, originY = 0.9, shrink = 0.95) {
  const sw = w * scale * shrink;
  const sh = h * scale * shrink;
  const cx = x + (0.5 - originX) * (w * scale);
  const cy = y + (0.5 - originY) * (h * scale);
  items.push({
    label,
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w * scale),
    h: Math.round(h * scale),
    left: cx - sw / 2,
    right: cx + sw / 2,
    top: cy - sh / 2,
    bottom: cy + sh / 2
  });
}

// 1. Parse seedPoints & rocks in scatterNordicNature()
const seedRegex = /\{\s*x:\s*(\d+)\s*,\s*y:\s*(\d+)\s*,\s*f:\s*'([^']+)'\s*,\s*s:\s*([0-9.]+)\s*\}/g;
let m;
while ((m = seedRegex.exec(worldCode)) !== null) {
  const tx = parseFloat(m[1]);
  const ty = parseFloat(m[2]);
  const f = m[3];
  const s = parseFloat(m[4]);
  const d = frames[f]?.frame || { w: 48, h: 48 };
  if (f.startsWith('tree_')) {
    addBox(`tree:${f}(${tx},${ty})`, tx * 16, ty * 16, d.w, d.h, s);
    const bd = frames['bush_berry_red']?.frame || { w: 32, h: 28 };
    addBox(`bush_berry_red(${tx + 4},${ty + 1})`, (tx + 4) * 16, (ty + 1) * 16, bd.w, bd.h, 0.52);
    const fd = frames['fern_1']?.frame || { w: 16, h: 16 };
    addBox(`fern_1(${tx - 4},${ty + 1})`, (tx - 4) * 16, (ty + 1) * 16, fd.w, fd.h, 0.45);
  } else {
    addBox(`rock:${f}(${tx},${ty})`, tx * 16, ty * 16, d.w, d.h, s);
  }
}

// 2. Parse placeDecor(X * 16, Y * 16, 'frame', scale)
const decorDirectRegex = /placeDecor\(\s*(\d+)\s*\*\s*16\s*,\s*(\d+)\s*\*\s*16\s*,\s*'([^']+)'(?:\s*,\s*([0-9.]+))?/g;
while ((m = decorDirectRegex.exec(worldCode)) !== null) {
  const tx = parseFloat(m[1]);
  const ty = parseFloat(m[2]);
  const f = m[3];
  const s = m[4] ? parseFloat(m[4]) : 1.0;
  const d = frames[f]?.frame || { w: 32, h: 32 };
  addBox(`decor:${f}(${tx},${ty})`, tx * 16, ty * 16, d.w, d.h, s);
}

// 3. Parse placeProp(X * 16, Y * 16, 'propKey', scale)
const propRegex = /placeProp\(\s*(\d+)\s*\*\s*16\s*,\s*(\d+)\s*\*\s*16\s*,\s*'([^']+)'\s*,\s*([0-9.]+)\s*\)/g;
while ((m = propRegex.exec(worldCode)) !== null) {
  const tx = parseFloat(m[1]);
  const ty = parseFloat(m[2]);
  const key = m[3];
  const s = parseFloat(m[4]);
  const d = propDims[key] || { w: 48, h: 48 };
  addBox(`prop:${key}(${tx},${ty})`, tx * 16, ty * 16, d.w, d.h, s, 0.5, 0.9);
}

// 4. Parse mentors in mentorCoords
const mentorRegex = /(\d+):\s*\{\s*x:\s*(\d+)\s*,\s*y:\s*(\d+)\s*,\s*id:\s*'([^']+)'/g;
while ((m = mentorRegex.exec(worldCode)) !== null) {
  const tx = parseFloat(m[2]);
  const ty = parseFloat(m[3]);
  const id = m[4];
  addBox(`mentor:${id}(${tx},${ty})`, tx * 16, ty * 16, 17, 32, 1.0, 0.5, 0.9);
}

// 5. Parse VIKING_RELICS
const relicBlockRegex = /id:\s*'([^']+)'[\s\S]*?x:\s*(\d+)\s*,\s*y:\s*(\d+)/g;
while ((m = relicBlockRegex.exec(relicsCode)) !== null) {
  const id = m[1];
  const tx = parseFloat(m[2]);
  const ty = parseFloat(m[3]);
  addBox(`relic:${id}(${tx},${ty})`, tx * 16, ty * 16, 32, 32, 0.65, 0.5, 0.8);
}

// 6. Parse VIKING_BUILDINGS
const builtScaleMap = {
  viking_longhouse_thatched: 0.65,
  viking_blot_fire_altar: 0.36,
  viking_drakkar_full: 0.62,
  monastery_scriptorium_desk: 0.42,
  viking_camp_tent: 0.55,
  paris_fortress_gate: 0.72,
  viking_cottage_gable: 0.85,
  viking_god_totem_odin: 0.38,
  viking_runestone_classic: 0.38,
  viking_round_hut: 0.82,
  viking_fishnet_drying: 0.50,
  bridge_timber_crossing: 0.60,
};
const bldRegex = /id:\s*'([^']+)'\s*,\s*name:\s*'[^']+'\s*,\s*chapter:\s*\d+\s*,\s*propKey:\s*'([^']+)'\s*,\s*x:\s*(\d+)\s*,\s*y:\s*(\d+)/g;
while ((m = bldRegex.exec(itemsCode)) !== null) {
  const id = m[1];
  const key = m[2];
  const tx = parseFloat(m[3]);
  const ty = parseFloat(m[4]);
  // Note: build_k07_jorvik_market at (48,30) is the same cottage rendered by ch >= 7 check; let's check both
  const sc = builtScaleMap[key] || 0.6;
  const d = propDims[key] || { w: 48, h: 48 };
  addBox(`built:${id}:${key}(${tx},${ty})`, tx * 16, ty * 16, d.w, d.h, sc, 0.5, 0.9);
}

// 7. Parse Wildlife.ts spawnAnimal
const wildlifePath = path.join(__dirname, '../src/world/Wildlife.ts');
if (fs.existsSync(wildlifePath)) {
  const wildlifeCode = fs.readFileSync(wildlifePath, 'utf8');
  const animalRegex = /spawnAnimal\(\s*(\d+)\s*\*\s*16\s*,\s*(\d+)\s*\*\s*16\s*,\s*'([^']+)'\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9.]+)\s*\)/g;
  while ((m = animalRegex.exec(wildlifeCode)) !== null) {
    const tx = parseFloat(m[1]);
    const ty = parseFloat(m[2]);
    const key = m[3];
    const sc = parseFloat(m[4]);
    addBox(`animal:${key}(${tx},${ty})`, tx * 16, ty * 16, 96, 96, sc, 0.5, 0.85);
  }
}

let overlaps = 0;
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const a = items[i];
    const b = items[j];
    const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (ix > 2 && iy > 2) {
      overlaps++;
      console.error(`❌ OVERLAP #${overlaps}: ${a.label} [${a.w}x${a.h} at (${a.x},${a.y})] <-> ${b.label} [${b.w}x${b.h} at (${b.x},${b.y})] by ${Math.round(ix)}x${Math.round(iy)}px`);
    }
  }
}

if (overlaps > 0) {
  console.error(`\nFAILED: ${overlaps} visual bounding-box overlap(s) detected across ${items.length} placed objects!`);
  process.exit(1);
} else {
  console.log(`✅ Layout Check Passed: ${items.length} placed objects verified with 0 visual bounding-box overlaps!`);
}
