const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function main() {
  console.log('🚀 Starting Vikings Asset Builder & Texture Baker...');

  [
    'public/assets/props',
    'public/assets/icons',
    'public/assets/gfx/npcs',
    'public/assets/gfx/portraits',
    'public/assets/world',
    'public/assets/audio/bgm',
  ].forEach((d) => fs.mkdirSync(d, { recursive: true }));

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Load available sheets as Base64
  const sheets = {
    viking_b1: fs.readFileSync('Assets/extracted/Viking age-1/tile-B-01.png').toString('base64'),
    viking_b2: fs.readFileSync('Assets/extracted/Viking age-1/tile-B-02.png').toString('base64'),
    viking_b3: fs.readFileSync('Assets/extracted/Viking age-1/tile-B-03.png').toString('base64'),
    viking_b4: fs.readFileSync('Assets/extracted/Viking age-1/tile-B-04.png').toString('base64'),
    viking_b5: fs.readFileSync('Assets/extracted/Viking age-1/tile-B-05.png').toString('base64'),
    viking_town_1: fs.readFileSync('Assets/extracted/Viking/1 (1).png').toString('base64'),
    viking_town_2: fs.readFileSync('Assets/extracted/Viking/2 (1).png').toString('base64'),
    viking_town_3: fs.readFileSync('Assets/extracted/Viking/3 (1).png').toString('base64'),
    monastery_b1: fs.readFileSync('Assets/extracted/Medieval Monastery/tile-B-01.png').toString('base64'),
    fortress_b1: fs.readFileSync('Assets/extracted/Medieval Fortress Tileset/tile-B-01.png').toString('base64'),
    battlefield_b1: fs.readFileSync('Assets/extracted/Medieval Battlefield/tile-B-01.png').toString('base64'),
    charBase: fs.readFileSync('public/assets/gfx/character.png').toString('base64'),
  };

  // 1. CROP DEFINITIONS FOR VIKING & MEDIEVAL PROPS (Strict Integer 48px Cell Coordinates)
  const cropDefs = [
    // --- VIKING VILLAGE & FARMLAND (K1 & K2) ---
    { id: 'viking_langhaus_large', sheet: 'viking_town_1', cx: 0, cy: 0, cw: 4, ch: 4, outW: 192, outH: 192 },
    { id: 'viking_longhouse_thatched', sheet: 'viking_b2', cx: 0, cy: 0, cw: 4, ch: 4, outW: 192, outH: 192 },
    { id: 'viking_cottage_gable', sheet: 'viking_b2', cx: 4, cy: 4, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_round_hut', sheet: 'viking_b2', cx: 12, cy: 2, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_fortress_gate', sheet: 'viking_town_1', cx: 4, cy: 4, cw: 4, ch: 4, outW: 192, outH: 192 },
    { id: 'viking_watchtower_wood', sheet: 'viking_town_1', cx: 8, cy: 4, cw: 2, ch: 4, outW: 96, outH: 192 },
    { id: 'viking_shed_workshop', sheet: 'viking_town_1', cx: 12, cy: 4, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_village_well', sheet: 'viking_town_3', cx: 8, cy: 12, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_haystack_large', sheet: 'viking_town_3', cx: 0, cy: 10, cw: 2, ch: 3, outW: 96, outH: 144 },
    { id: 'viking_wood_pile_stacked', sheet: 'viking_town_3', cx: 6, cy: 10, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_chopping_block', sheet: 'viking_town_3', cx: 6, cy: 12, cw: 1, ch: 1, outW: 48, outH: 48 },
    { id: 'viking_pelt_bear_spread', sheet: 'viking_b2', cx: 2, cy: 8, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_pelt_white_wolf', sheet: 'viking_b2', cx: 0, cy: 8, cw: 2, ch: 2, outW: 96, outH: 96 },

    // --- MYTHOLOGY, RITUALS & BLOT (K2 & K9) ---
    { id: 'viking_runestone_futhark_red', sheet: 'viking_town_3', cx: 10, cy: 6, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_runestone_knotwork', sheet: 'viking_town_3', cx: 4, cy: 6, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_runestone_classic', sheet: 'viking_town_3', cx: 6, cy: 6, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_god_totem_odin', sheet: 'viking_town_3', cx: 12, cy: 0, cw: 2, ch: 4, outW: 96, outH: 192 },
    { id: 'viking_god_totem_wolf', sheet: 'viking_town_3', cx: 14, cy: 0, cw: 2, ch: 4, outW: 96, outH: 192 },
    { id: 'viking_blot_fire_altar', sheet: 'viking_town_3', cx: 0, cy: 0, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_dragon_post_carved', sheet: 'viking_b1', cx: 8, cy: 0, cw: 1, ch: 2, outW: 48, outH: 96 },
    { id: 'viking_banner_raven_red', sheet: 'viking_b1', cx: 12, cy: 2, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_banner_gryphon_blue', sheet: 'viking_b1', cx: 12, cy: 4, cw: 2, ch: 2, outW: 96, outH: 96 },

    // --- SCHIFFBAU & HAFEN (K3, K5, K10, K11) ---
    { id: 'viking_drakkar_full', sheet: 'viking_b5', cx: 0, cy: 0, cw: 4, ch: 3, outW: 192, outH: 144 },
    { id: 'viking_knarr_trading', sheet: 'viking_b5', cx: 8, cy: 0, cw: 4, ch: 3, outW: 192, outH: 144 },
    { id: 'viking_drakkar_red_sail', sheet: 'viking_town_2', cx: 0, cy: 4, cw: 7, ch: 4, outW: 336, outH: 192 },
    { id: 'viking_ship_blue_sail', sheet: 'viking_town_2', cx: 4, cy: 8, cw: 4, ch: 4, outW: 192, outH: 192 },
    { id: 'viking_wooden_dock', sheet: 'viking_town_2', cx: 0, cy: 0, cw: 4, ch: 2, outW: 192, outH: 96 },
    { id: 'viking_camp_tent', sheet: 'viking_town_2', cx: 14, cy: 4, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_iron_anchor', sheet: 'viking_b5', cx: 8, cy: 8, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_stacked_cargo_barrels', sheet: 'viking_b5', cx: 12, cy: 0, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_fishnet_drying', sheet: 'viking_town_2', cx: 8, cy: 14, cw: 2, ch: 2, outW: 96, outH: 96 },

    // --- WAFFEN, RÜSTUNG & DANEGELD (K4, K6, K7, K12) ---
    { id: 'viking_weapon_rack_axes', sheet: 'viking_b3', cx: 0, cy: 0, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_weapon_rack_spears', sheet: 'viking_b3', cx: 4, cy: 0, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_shield_stand_rune', sheet: 'viking_b3', cx: 8, cy: 0, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_armor_stand_chainmail', sheet: 'viking_b4', cx: 0, cy: 0, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_spit_roast_campfire', sheet: 'viking_b4', cx: 0, cy: 6, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_treasure_chest_danegeld', sheet: 'viking_b4', cx: 0, cy: 4, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'viking_bone_trophy_totem', sheet: 'viking_b4', cx: 6, cy: 8, cw: 2, ch: 2, outW: 96, outH: 96 },

    // --- KLOSTER & CHRISTIANISIERUNG (K4 & K8 - Lindisfarne / Jelling) ---
    { id: 'monastery_scriptorium_desk', sheet: 'monastery_b1', cx: 2, cy: 8, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'monastery_golden_altar', sheet: 'monastery_b1', cx: 8, cy: 8, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'monastery_stone_arch', sheet: 'monastery_b1', cx: 6, cy: 0, cw: 2, ch: 3, outW: 96, outH: 144 },

    // --- PARIS-BELAGERUNG & STAMFORD BRIDGE (K6 & K12) ---
    { id: 'paris_fortress_gate', sheet: 'fortress_b1', cx: 4, cy: 0, cw: 2, ch: 3, outW: 96, outH: 144 },
    { id: 'paris_stone_tower', sheet: 'fortress_b1', cx: 12, cy: 10, cw: 2, ch: 4, outW: 96, outH: 192 },
    { id: 'paris_stone_wall', sheet: 'fortress_b1', cx: 0, cy: 0, cw: 4, ch: 2, outW: 192, outH: 96 },
    { id: 'siege_catapult_wood', sheet: 'battlefield_b1', cx: 10, cy: 12, cw: 2, ch: 2, outW: 96, outH: 96 },
    { id: 'battlefield_wooden_stakes', sheet: 'battlefield_b1', cx: 8, cy: 12, cw: 2, ch: 2, outW: 96, outH: 96 },
  ];

  console.log(`Processing ${cropDefs.length} Viking & Medieval prop crops in browser...`);

  const croppedAssets = await page.evaluate(
    async (defs, sheetB64s) => {
      function loadImage(b64) {
        return new Promise((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = 'data:image/png;base64,' + b64;
        });
      }

      const imgCache = {};
      for (const [key, b64] of Object.entries(sheetB64s)) {
        imgCache[key] = await loadImage(b64);
      }

      const out = {};
      for (const def of defs) {
        const sheetImg = imgCache[def.sheet];
        if (!sheetImg) continue;

        const canvas = document.createElement('canvas');
        canvas.width = def.outW;
        canvas.height = def.outH;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const srcX = def.cx * 48;
        const srcY = def.cy * 48;
        const srcW = def.cw * 48;
        const srcH = def.ch * 48;

        ctx.drawImage(sheetImg, srcX, srcY, srcW, srcH, 0, 0, def.outW, def.outH);
        out[def.id] = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
      }
      return out;
    },
    cropDefs,
    sheets,
  );

  for (const [id, b64] of Object.entries(croppedAssets)) {
    fs.writeFileSync(`public/assets/props/${id}.png`, Buffer.from(b64, 'base64'));
  }
  console.log(`✅ Saved ${Object.keys(croppedAssets).length} props to public/assets/props/`);

  // 2. PROCEDURAL 32x32 EDUCATIONAL RETINA ICONS & 5 RELICS
  console.log('Generating educational icons & relics...');

  const iconDefs = [
    // --- 5 ARCHÄOLOGISCHE LEITFUNDE / RELIKTE ---
    // Relikt 1: Oseberg-Schiff (834 n. Chr.)
    {
      id: 'relic_oseberg_schiff',
      svg: `
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(4, 18); ctx.quadraticCurveTo(16, 26, 28, 16); ctx.lineTo(27, 20); ctx.quadraticCurveTo(16, 28, 5, 22); ctx.fill();
        ctx.fillStyle = '#92400e';
        ctx.fillRect(15, 6, 2, 14);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.moveTo(17, 8); ctx.lineTo(24, 11); ctx.lineTo(17, 14); ctx.fill();
        ctx.fillStyle = '#d97706';
        ctx.beginPath(); ctx.arc(6, 15, 3, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(16, 16, 13, 0, Math.PI*2); ctx.stroke();
      `,
    },
    // Relikt 2: Evangeliar von Lindisfarne (793 n. Chr.)
    {
      id: 'relic_lindisfarne_gospels',
      svg: `
        ctx.fillStyle = '#1e3a8a'; ctx.fillRect(8, 6, 16, 20);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(15, 8, 2, 16); ctx.fillRect(11, 12, 10, 2);
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1; ctx.strokeRect(9, 7, 14, 18);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(11, 9, 2, 2); ctx.fillRect(19, 9, 2, 2); ctx.fillRect(11, 17, 2, 2); ctx.fillRect(19, 17, 2, 2);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(16, 16, 13, 0, Math.PI*2); ctx.stroke();
      `,
    },
    // Relikt 3: Großer Runenstein von Jelling (965 n. Chr.)
    {
      id: 'relic_jelling_stein',
      svg: `
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.moveTo(9, 26); ctx.lineTo(11, 8); ctx.lineTo(21, 8); ctx.lineTo(23, 26); ctx.fill();
        ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 1.5;
        // Christ figure / knotwork in red
        ctx.beginPath(); ctx.moveTo(16, 10); ctx.lineTo(16, 22); ctx.moveTo(12, 14); ctx.lineTo(20, 14); ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(16, 11, 2, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(16, 16, 13, 0, Math.PI*2); ctx.stroke();
      `,
    },
    // Relikt 4: Der Sonnenstein von Hrafnsey (Island-Spaltkristall Calcit)
    {
      id: 'relic_sonnenstein',
      svg: `
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.moveTo(16, 5); ctx.lineTo(25, 12); ctx.lineTo(22, 25); ctx.lineTo(10, 25); ctx.lineTo(7, 12); ctx.fill();
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath(); ctx.moveTo(16, 5); ctx.lineTo(19, 14); ctx.lineTo(14, 21); ctx.lineTo(10, 25); ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(15, 13, 3, 3);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(16, 16, 13, 0, Math.PI*2); ctx.stroke();
      `,
    },
    // Relikt 5: Bronzefibel von L'Anse aux Meadows (Neufundland, ca. 1000 n. Chr.)
    {
      id: 'relic_vinland_fibel',
      svg: `
        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(16, 15, 8, 0.4, Math.PI * 1.8); ctx.stroke();
        ctx.strokeStyle = '#b45309'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(8, 24); ctx.lineTo(24, 7); ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(24, 7, 2.5, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(16, 16, 13, 0, Math.PI*2); ctx.stroke();
      `,
    },

    // --- 27 FACHLEXIKON-BEGRIFFE ---
    {
      id: 'althing',
      svg: `
        ctx.fillStyle = '#334155'; ctx.beginPath(); ctx.moveTo(4, 26); ctx.lineTo(16, 8); ctx.lineTo(28, 26); ctx.fill();
        ctx.fillStyle = '#d97706'; ctx.fillRect(14, 16, 4, 10);
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(16, 12, 3, 0, Math.PI*2); ctx.fill();
      `,
    },
    {
      id: 'asen_vanen',
      svg: `
        ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.arc(11, 14, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#0284c7'; ctx.beginPath(); ctx.arc(21, 14, 6, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(14, 8, 4, 16);
      `,
    },
    {
      id: 'karl_bauer',
      svg: `
        ctx.fillStyle = '#854d0e'; ctx.fillRect(10, 14, 12, 14);
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(16, 10, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#15803d'; ctx.fillRect(7, 18, 4, 8);
      `,
    },
    {
      id: 'berserker',
      svg: `
        ctx.fillStyle = '#451a03'; ctx.beginPath(); ctx.arc(16, 14, 10, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#dc2626'; ctx.fillRect(11, 12, 3, 2); ctx.fillRect(18, 12, 3, 2);
        ctx.fillStyle = '#fef08a'; ctx.fillRect(13, 17, 6, 3);
      `,
    },
    {
      id: 'blot',
      svg: `
        ctx.fillStyle = '#991b1b'; ctx.beginPath(); ctx.arc(16, 20, 8, 0, Math.PI); ctx.fill();
        ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.moveTo(16, 6); ctx.lineTo(21, 16); ctx.lineTo(11, 16); ctx.fill();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.moveTo(16, 9); ctx.lineTo(19, 15); ctx.lineTo(13, 15); ctx.fill();
      `,
    },
    {
      id: 'danegeld',
      svg: `
        ctx.fillStyle = '#78350f'; ctx.fillRect(8, 12, 16, 14);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(14, 10, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(19, 10, 4, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fef08a'; ctx.fillRect(12, 15, 8, 4);
      `,
    },
    {
      id: 'danelag',
      svg: `
        ctx.fillStyle = '#1e3a8a'; ctx.fillRect(6, 6, 20, 20);
        ctx.fillStyle = '#dc2626'; ctx.fillRect(14, 6, 4, 20); ctx.fillRect(6, 14, 20, 4);
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.5; ctx.strokeRect(6, 6, 20, 20);
      `,
    },
    {
      id: 'drakkar',
      svg: `
        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.moveTo(4, 18); ctx.quadraticCurveTo(16, 26, 28, 14); ctx.lineTo(26, 20); ctx.quadraticCurveTo(16, 28, 6, 22); ctx.fill();
        ctx.fillStyle = '#dc2626'; ctx.fillRect(15, 7, 2, 13);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(17, 8, 6, 8);
        ctx.fillStyle = '#dc2626'; ctx.fillRect(19, 8, 2, 8);
      `,
    },
    {
      id: 'futhark',
      svg: `
        ctx.fillStyle = '#334155'; ctx.fillRect(8, 6, 16, 20);
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(14, 8); ctx.lineTo(14, 24); ctx.moveTo(14, 11); ctx.lineTo(19, 8); ctx.moveTo(14, 16); ctx.lineTo(19, 13); ctx.stroke();
      `,
    },
    {
      id: 'gjermundbu_helm',
      svg: `
        ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.arc(16, 15, 9, Math.PI, 0); ctx.fill();
        ctx.fillRect(8, 15, 16, 3);
        // spectacle eye guards
        ctx.fillStyle = '#334155'; ctx.fillRect(10, 16, 5, 4); ctx.fillRect(17, 16, 5, 4);
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(15, 14, 2, 8);
      `,
    },
    {
      id: 'harald_blauzahn',
      svg: `
        ctx.fillStyle = '#1d4ed8'; ctx.fillRect(10, 14, 12, 14);
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(16, 10, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(11, 5, 10, 3); // crown
        ctx.fillStyle = '#60a5fa'; ctx.fillRect(15, 12, 2, 2); // blue tooth
      `,
    },
    {
      id: 'jarl',
      svg: `
        ctx.fillStyle = '#451a03'; ctx.fillRect(9, 13, 14, 15);
        ctx.fillStyle = '#d97706'; ctx.fillRect(8, 12, 16, 3);
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(16, 9, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(13, 5, 6, 2);
      `,
    },
    {
      id: 'jelling_steine',
      svg: `
        ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.moveTo(7, 26); ctx.lineTo(9, 8); ctx.lineTo(17, 8); ctx.lineTo(19, 26); ctx.fill();
        ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(18, 26); ctx.lineTo(19, 12); ctx.lineTo(25, 12); ctx.lineTo(26, 26); ctx.fill();
      `,
    },
    {
      id: 'jorvik',
      svg: `
        ctx.fillStyle = '#78350f'; ctx.fillRect(6, 14, 8, 12); ctx.fillRect(16, 12, 10, 14);
        ctx.fillStyle = '#b45309'; ctx.beginPath(); ctx.moveTo(5, 14); ctx.lineTo(10, 8); ctx.lineTo(15, 14); ctx.fill();
        ctx.beginPath(); ctx.moveTo(15, 12); ctx.lineTo(21, 6); ctx.lineTo(27, 12); ctx.fill();
      `,
    },
    {
      id: 'klinkerbauweise',
      svg: `
        ctx.fillStyle = '#78350f';
        ctx.fillRect(6, 8, 20, 4);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(5, 11, 22, 4);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(4, 14, 24, 4);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(10, 10, 2, 2); ctx.fillRect(18, 10, 2, 2);
        ctx.fillRect(9, 13, 2, 2); ctx.fillRect(17, 13, 2, 2);
      `,
    },
    {
      id: 'knarr',
      svg: `
        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.ellipse(16, 20, 11, 6, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#92400e'; ctx.fillRect(15, 6, 2, 14);
        ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.moveTo(17, 8); ctx.lineTo(25, 12); ctx.lineTo(17, 15); ctx.fill();
      `,
    },
    {
      id: 'landnamabok',
      svg: `
        ctx.fillStyle = '#fef3c7'; ctx.fillRect(7, 5, 18, 22);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(10, 8, 12, 2); ctx.fillRect(10, 12, 12, 2); ctx.fillRect(10, 16, 12, 2); ctx.fillRect(10, 20, 8, 2);
        ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1.5; ctx.strokeRect(7, 5, 18, 22);
      `,
    },
    {
      id: 'langhaus',
      svg: `
        ctx.fillStyle = '#78350f'; ctx.fillRect(6, 14, 20, 12);
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath(); ctx.moveTo(4, 14); ctx.lineTo(16, 6); ctx.lineTo(28, 14); ctx.fill();
        ctx.strokeStyle = '#854d0e'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(14, 4); ctx.lineTo(18, 8); ctx.moveTo(18, 4); ctx.lineTo(14, 8); ctx.stroke();
      `,
    },
    {
      id: 'leif_eriksson',
      svg: `
        ctx.fillStyle = '#0369a1'; ctx.fillRect(10, 14, 12, 14);
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(16, 9, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#92400e'; ctx.fillRect(12, 12, 8, 4); // beard
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(11, 4, 10, 3);
      `,
    },
    {
      id: 'portage',
      svg: `
        ctx.fillStyle = '#78350f'; ctx.fillRect(6, 12, 20, 6); // boat
        ctx.fillStyle = '#b45309';
        for(let x=8; x<=22; x+=5) ctx.fillRect(x, 19, 3, 5); // wooden rollers
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(4, 25, 24, 3); // water
      `,
    },
    {
      id: 'schluesselgewalt',
      svg: `
        ctx.fillStyle = '#d97706';
        ctx.beginPath(); ctx.arc(12, 12, 5, 0, Math.PI*2); ctx.stroke();
        ctx.fillRect(16, 11, 10, 2);
        ctx.fillRect(22, 13, 2, 4); ctx.fillRect(25, 13, 2, 3);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.stroke();
      `,
    },
    {
      id: 'skraelinger',
      svg: `
        ctx.fillStyle = '#7c2d12'; ctx.fillRect(10, 14, 12, 14);
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(16, 9, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#dc2626'; ctx.fillRect(15, 3, 2, 5); // feather
      `,
    },
    {
      id: 'sonnenstein',
      svg: `
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.moveTo(16, 6); ctx.lineTo(24, 13); ctx.lineTo(20, 24); ctx.lineTo(12, 24); ctx.lineTo(8, 13); ctx.fill();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(16, 15, 3, 0, Math.PI*2); ctx.fill();
      `,
    },
    {
      id: 'stamford_bridge',
      svg: `
        ctx.fillStyle = '#78350f'; ctx.fillRect(4, 14, 24, 4); // bridge
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(4, 19, 24, 8); // river
        ctx.fillStyle = '#92400e'; ctx.fillRect(8, 17, 3, 6); ctx.fillRect(20, 17, 3, 6); // pillars
        ctx.fillStyle = '#dc2626'; ctx.fillRect(15, 9, 2, 6); // battle marker
      `,
    },
    {
      id: 'thing',
      svg: `
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.arc(16, 16, 10, 0, Math.PI*2); ctx.stroke();
        for(let a=0; a<Math.PI*2; a+=Math.PI/4) {
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(15 + Math.cos(a)*8, 15 + Math.sin(a)*8, 3, 3);
        }
        ctx.fillStyle = '#fef08a'; ctx.fillRect(15, 15, 3, 3);
      `,
    },
    {
      id: 'thraell',
      svg: `
        ctx.fillStyle = '#57534e'; ctx.fillRect(10, 15, 12, 13);
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(16, 11, 4.5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#78716c'; ctx.fillRect(12, 14, 8, 2); // collar/thrall bond
      `,
    },
    {
      id: 'waraeger',
      svg: `
        ctx.fillStyle = '#1e3a8a'; ctx.fillRect(10, 14, 12, 14);
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(16, 9, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fbbf24'; ctx.fillRect(13, 14, 6, 8); // Byzantine golden sash
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(8, 12, 2, 12); // Varangian axe
      `,
    },

    // --- CRAFTING & SPECIAL RESOURCE ICONS ---
    {
      id: 'schiffsteer',
      svg: `
        ctx.fillStyle = '#171717'; ctx.beginPath(); ctx.ellipse(16, 20, 10, 6, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#262626'; ctx.beginPath(); ctx.ellipse(16, 18, 8, 4, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#78350f'; ctx.fillRect(14, 8, 4, 10);
      `,
    },
    {
      id: 'klinkernagel',
      svg: `
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(14, 8, 4, 16);
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(11, 6, 10, 3);
        ctx.fillStyle = '#475569'; ctx.fillRect(15, 23, 2, 3);
      `,
    },
    {
      id: 'silber_dirham',
      svg: `
        ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.arc(16, 16, 10, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(16, 16, 8.5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#64748b';
        ctx.fillRect(11, 13, 10, 2); ctx.fillRect(11, 17, 10, 2);
      `,
    },
    {
      id: 'wundsalbe',
      svg: `
        ctx.fillStyle = '#78350f'; ctx.fillRect(10, 14, 12, 12);
        ctx.fillStyle = '#15803d'; ctx.beginPath(); ctx.ellipse(16, 14, 6, 3, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#86efac'; ctx.fillRect(14, 13, 4, 2);
      `,
    },
    {
      id: 'taufkerze',
      svg: `
        ctx.fillStyle = '#fef08a'; ctx.fillRect(14, 12, 4, 14);
        ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.moveTo(16, 6); ctx.lineTo(19, 11); ctx.lineTo(13, 11); ctx.fill();
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(16, 10, 1.5, 0, Math.PI*2); ctx.fill();
      `,
    },
    {
      id: 'relic_marker_glow',
      svg: `
        const grad = ctx.createRadialGradient(16, 16, 2, 16, 16, 14);
        grad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.5)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);

        ctx.fillStyle = '#78350f';
        ctx.beginPath(); ctx.ellipse(16, 24, 11, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#92400e';
        ctx.beginPath(); ctx.ellipse(16, 23, 9, 4, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(16, 17, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(14, 14, 4, 4);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(23, 7, 2, 6); ctx.fillRect(21, 9, 6, 2);
        ctx.fillRect(8, 11, 2, 4); ctx.fillRect(7, 12, 4, 2);
        ctx.fillRect(15, 16, 2, 2);
      `,
    },
  ];

  const renderedIcons = await page.evaluate(async (defs) => {
    const out = {};
    for (const d of defs) {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      const fn = new Function('ctx', d.svg);
      fn(ctx);

      out[d.id] = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
    }
    return out;
  }, iconDefs);

  for (const [id, b64] of Object.entries(renderedIcons)) {
    fs.writeFileSync(`public/assets/icons/${id}.png`, Buffer.from(b64, 'base64'));
  }
  console.log(`✅ Saved ${Object.keys(renderedIcons).length} icons to public/assets/icons/`);

  // 3. LUMINANZ-ERHALTENDE CHARAKTER- UND NPC-PIPELINE
  console.log('Generating characters and NPC spritesheets with luminance-preserving clothing remapping...');

  // Color ramps (dark to bright) for clothing remapping
  const npcRamps = {
    // Player 1: Ragnar (Explorer / Seafarer - oceanic deep blue, leather vest, bronze)
    player_ragnar: [
      [20, 30, 50],
      [35, 60, 95],
      [45, 95, 145],
      [80, 140, 190],
      [150, 195, 235],
    ],
    // Player 2: Astrid (Homestead Mistress / Free Woman - crimson wool dress, amber, fur)
    player_astrid: [
      [45, 15, 20],
      [95, 25, 35],
      [150, 40, 55],
      [195, 80, 90],
      [235, 150, 160],
    ],
    // K1: Astrid (Hofherrin - warm brown wool & linen apron with keys)
    npc_astrid_elder: [
      [35, 25, 20],
      [75, 50, 35],
      [120, 80, 55],
      [175, 130, 95],
      [225, 190, 150],
    ],
    // K2: Thorgest (Blót-Gode - mystic forest pine & white sacred mantle)
    npc_thorgest_gode: [
      [15, 35, 25],
      [30, 70, 50],
      [55, 115, 85],
      [110, 175, 140],
      [190, 235, 210],
    ],
    // K3: Halvdan (Schiffszimmermann - rough dark leather apron & pine tar)
    npc_halvdan_shipwright: [
      [25, 20, 15],
      [60, 45, 30],
      [105, 75, 45],
      [160, 115, 70],
      [215, 165, 110],
    ],
    // K4: Cuthbert (Lindisfarne Mönch - Benedictine habit brown & unbleached wool)
    npc_cuthbert_monk: [
      [30, 20, 15],
      [65, 45, 30],
      [100, 70, 45],
      [145, 105, 70],
      [190, 155, 120],
    ],
    // K5: Rorik (Waräger / Rus - Byzantine silk violet, gold braid & fur)
    npc_rorik_varaeger: [
      [35, 15, 45],
      [75, 25, 90],
      [130, 40, 145],
      [185, 90, 185],
      [235, 170, 230],
    ],
    // K6: Graf Odo (Graf von Paris - Frankish royal blue & gold fleur-de-lis)
    npc_graf_odo: [
      [20, 25, 60],
      [40, 50, 120],
      [70, 90, 180],
      [130, 150, 220],
      [210, 220, 255],
    ],
    // K7: Guthrum (Jarl von Danelag / York - rich forest green & Anglo-Danish bronze)
    npc_guthrum_jarl: [
      [20, 40, 25],
      [40, 80, 50],
      [70, 130, 80],
      [125, 180, 135],
      [190, 230, 195],
    ],
    // K8: Harald Blauzahn (König von Dänemark - royal purple & regal gold)
    npc_harald_blauzahn: [
      [40, 15, 40],
      [90, 30, 85],
      [150, 50, 140],
      [200, 110, 190],
      [245, 190, 240],
    ],
    // K9: Thorgeir (Gesetzessprecher Island - volcanic charcoal & natural sheep wool)
    npc_thorgeir_speaker: [
      [25, 25, 30],
      [55, 55, 65],
      [95, 95, 105],
      [150, 150, 160],
      [215, 215, 225],
    ],
    // K10: Erik der Rote (Grönland-Siedler - fiery rust, red beard & sealskin cloak)
    npc_erik_der_rote: [
      [50, 20, 10],
      [110, 35, 15],
      [175, 60, 25],
      [225, 110, 50],
      [255, 180, 110],
    ],
    // K11: Leif Eriksson (Vinland-Entdecker - weathered teal sea cloak & birch)
    npc_leif_eriksson: [
      [15, 35, 40],
      [30, 75, 85],
      [55, 125, 140],
      [100, 180, 195],
      [170, 230, 240],
    ],
    // K12: Olav Kyrre der Friedfertige (König - pure peaceful ivory, gold trim)
    npc_olav_kyrre: [
      [45, 40, 30],
      [90, 85, 65],
      [150, 145, 120],
      [205, 200, 175],
      [250, 245, 230],
    ],
  };

  const remappedNpcs = await page.evaluate(
    async (charBaseB64, ramps) => {
      function loadImage(b64) {
        return new Promise((res, rej) => {
          const img = new Image();
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = 'data:image/png;base64,' + b64;
        });
      }

      const baseImg = await loadImage(charBaseB64);
      const out = {};
      const portraits = {};

      for (const [npcId, ramp] of Object.entries(ramps)) {
        const canvas = document.createElement('canvas');
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(baseImg, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        // Process each 16x32 frame
        for (let fy = 0; fy < canvas.height; fy += 32) {
          for (let fx = 0; fx < canvas.width; fx += 16) {
            for (let py = 0; py < 32; py++) {
              for (let px = 0; px < 16; px++) {
                // Strict rule: PROTECT FACE ZONE (y = 10..18)
                if (py >= 10 && py <= 18) continue;

                const idx = ((fy + py) * canvas.width + (fx + px)) * 4;
                const r = d[idx],
                  g = d[idx + 1],
                  b = d[idx + 2],
                  a = d[idx + 3];
                if (a < 128) continue;

                // Modulate clothes: y >= 19 or headwear py <= 9
                if (py >= 19 && (r !== g || r > 80)) {
                  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                  const pos = lum * (ramp.length - 1);
                  const i0 = Math.floor(pos);
                  const i1 = Math.min(ramp.length - 1, i0 + 1);
                  const t = pos - i0;

                  const c0 = ramp[i0];
                  const c1 = ramp[i1];

                  d[idx] = Math.round(c0[0] + (c1[0] - c0[0]) * t);
                  d[idx + 1] = Math.round(c0[1] + (c1[1] - c0[1]) * t);
                  d[idx + 2] = Math.round(c0[2] + (c1[2] - c0[2]) * t);
                }
              }
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
        out[npcId] = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');

        // Extract frame 0 (front-facing idle: 16x32) scaled 3x (48x96) for crisp dialogue portraits
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 48;
        pCanvas.height = 96;
        const pCtx = pCanvas.getContext('2d');
        pCtx.imageSmoothingEnabled = false;
        pCtx.drawImage(canvas, 0, 0, 16, 32, 0, 0, 48, 96);
        portraits[npcId] = pCanvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
      }
      return { npcs: out, portraits };
    },
    sheets.charBase,
    npcRamps,
  );

  for (const [id, b64] of Object.entries(remappedNpcs.npcs)) {
    fs.writeFileSync(`public/assets/gfx/npcs/${id}.png`, Buffer.from(b64, 'base64'));
  }
  for (const [id, b64] of Object.entries(remappedNpcs.portraits)) {
    fs.writeFileSync(`public/assets/gfx/portraits/${id}.png`, Buffer.from(b64, 'base64'));
  }
  console.log(`✅ Saved ${Object.keys(remappedNpcs.npcs).length} characters to public/assets/gfx/npcs/`);
  console.log(`✅ Saved ${Object.keys(remappedNpcs.portraits).length} portraits to public/assets/gfx/portraits/`);

  await browser.close();
  console.log('\n🎉 Vikings Asset Baking & Remapping Complete!');
  console.log(`📊 Asset Usage Statistics:`);
  console.log(`   • ${cropDefs.length} Historic Viking, Monastery, Fortress & Battlefield props baked`);
  console.log(`   • ${iconDefs.length} Lehrplan icons & relics proceduralized in 32x32 Retina format`);
  console.log(`   • ${Object.keys(npcRamps).length} Characters & Mentors remapped with protected face geometry`);
}

main().catch((err) => {
  console.error('Asset build error:', err);
  process.exit(1);
});
