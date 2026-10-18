import Phaser from 'phaser';
import { sound } from '../audio/sound';
import { CHAPTERS } from '../data/chapters';
import { VIKING_BUILDINGS, VIKING_ITEMS, VikingItemId } from '../data/items';
import { VIKING_RELICS, VikingRelic } from '../data/relics';
import { gameState } from '../systems/GameState';
import { WorldDecorManager } from '../world/decor';
import { WildlifeManager } from '../world/Wildlife';
import { LivingWorldManager } from '../world/LivingWorldManager';

interface InteractiveTarget {
  id: string;
  kind: 'mentor' | 'resource' | 'relic' | 'portal' | 'trader' | 'building_plot';
  name: string;
  sub: string;
  x: number;
  y: number;
  minChapter: number;
  itemId?: VikingItemId;
  relic?: VikingRelic;
  buildingId?: string;
}

export class WorldScene extends Phaser.Scene {
  public mapW = 100;
  public mapH = 80;
  public player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
  };

  private dynamicGroup!: Phaser.GameObjects.Group;
  private mentorSprite: Phaser.GameObjects.Sprite | null = null;
  private targets: InteractiveTarget[] = [];
  private activeTarget: InteractiveTarget | null = null;
  private labelLayer!: HTMLDivElement;
  public currentChapterData: any;
  public currentCompassText = '';

  private decorManager!: WorldDecorManager;
  private wildlifeManager!: WildlifeManager;
  private livingWorldManager!: LivingWorldManager;
  private stepTimer = 0;
  private facing: 'down' | 'up' | 'left' | 'right' = 'down';
  private bakedGroundEpoch = -1;
  private groundImage?: Phaser.GameObjects.Image;
  private sunlightOverlay?: Phaser.GameObjects.Rectangle;

  // Mentor positions for all 12 chapters (entzerrend platziert mit min. 3 Kacheln Abstand zu Bauplätzen)
  private mentorCoords: Record<number, { x: number; y: number; id: string; name: string }> = {
    1: { x: 36, y: 32, id: 'npc_astrid_elder', name: 'Hausherrin Astrid (Fjordhof)' },
    2: { x: 64, y: 26, id: 'npc_thorgest_gode', name: 'Gode Thorgest (Blót-Hain)' },
    3: { x: 26, y: 22, id: 'npc_halvdan_shipwright', name: 'Halvdan (Schiffsbauwerft)' },
    4: { x: 50, y: 20, id: 'npc_cuthbert_monk', name: 'Mönch Cuthberht (Lindisfarne)' },
    5: { x: 68, y: 36, id: 'npc_rorik_varaeger', name: 'Waräger Rorik (Fluss-Portage)' },
    6: { x: 34, y: 48, id: 'npc_graf_odo', name: 'Graf Odo von Paris (Seine-Insel)' },
    7: { x: 46, y: 32, id: 'npc_guthrum_jarl', name: 'Jarl Guthrum (Jorvik-Markt)' },
    8: { x: 56, y: 44, id: 'npc_harald_blauzahn', name: 'König Harald Blauzahn (Jelling)' },
    9: { x: 26, y: 40, id: 'npc_thorgeir_speaker', name: 'Gesetzessprecher Thorgeir (Lögberg)' },
    10: { x: 18, y: 46, id: 'npc_erik_der_rote', name: 'Erik der Rote (Brattahlíð)' },
    11: { x: 66, y: 54, id: 'npc_leif_eriksson', name: 'Leif Eriksson (Vinland)' },
    12: { x: 42, y: 58, id: 'npc_olav_kyrre', name: 'Olav Kyrre (Stamford Bridge)' },
  };

  constructor() {
    super('World');
  }

  create() {
    (window as any).__VIK_WORLD__ = this;
    this.createCharacterAnimations();
    this.bakeVikingTerrainTexture(gameState.chapter);

    this.groundImage = this.add
      .image(0, 0, 'viking_ground_baked')
      .setOrigin(0, 0)
      .setDepth(0);

    this.decorManager = new WorldDecorManager(this);
    this.wildlifeManager = new WildlifeManager(this);
    this.livingWorldManager = new LivingWorldManager(this);

    // 1. Waterways: Deep fjord in the West and rivers
    this.buildFjordAndRivers();

    // 2. Scatter Nordic nature: Pines, birches, mossy rocks, ferns
    this.scatterNordicNature();

    // 3. Static settlements, buildings & monuments
    this.buildStaticVikingWorld();

    this.dynamicGroup = this.add.group();
    this.rebuildChapterEntities();

    // 4. Player Spawn
    const texKey = gameState.gender === 'female' ? 'player_astrid' : 'player_ragnar';
    this.player = this.add
      .sprite(gameState.playerX, gameState.playerY, texKey, 0)
      .setOrigin(0.5, 0.9)
      .setDepth(gameState.playerY);
    this.livingWorldManager.registerPlayer(this.player);

    // 5. Living wildlife: Wisente, sheep, rams, horses
    this.wildlifeManager.init(this.mapW, this.mapH);

    // 6. Sunlight Overlay
    this.sunlightOverlay = this.add
      .rectangle(0, 0, this.mapW * 16, this.mapH * 16, 0xfef08a, 0.04)
      .setOrigin(0, 0)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(8500);

    // Camera setup
    this.cameras.main.setBounds(0, 0, this.mapW * 16, this.mapH * 16);
    this.cameras.main.startFollow(this.player, true, 0.14, 0.14);
    this.cameras.main.setRoundPixels(true);
    this.updateCameraZoom();
    this.scale.on('resize', () => this.updateCameraZoom());

    // Keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,A,S,D,E') as {
      W: Phaser.Input.Keyboard.Key;
      A: Phaser.Input.Keyboard.Key;
      S: Phaser.Input.Keyboard.Key;
      D: Phaser.Input.Keyboard.Key;
      E: Phaser.Input.Keyboard.Key;
    };

    this.initDOMLabelLayer();

    // Subscribe to state changes (chapter progress, building construction)
    gameState.subscribe(() => {
      this.bakeVikingTerrainTexture(gameState.chapter);
      this.rebuildChapterEntities();
    });

    // Start background music
    sound.playChapterBGM(gameState.chapter);
  }

  private updateCameraZoom(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const zoom = w < 900 || h < 500 ? 2.25 : 2.75;
    this.cameras.main.setZoom(zoom);
  }

  private initDOMLabelLayer(): void {
    let existing = document.getElementById('world-label-layer') as HTMLDivElement | null;
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'world-label-layer';
      existing.style.position = 'fixed';
      existing.style.inset = '0';
      existing.style.pointerEvents = 'none';
      existing.style.zIndex = '15';
      document.body.appendChild(existing);
    }
    this.labelLayer = existing;
    this.labelLayer.style.display = 'block';
  }

  private createCharacterAnimations(): void {
    // Handled in BootScene
  }

  // =========================================================================
  // 16-BIT PER-PIXEL A2 SAMPLING + 4x4 BAYER DITHERING
  // =========================================================================
  private isWaterTile(tx: number, ty: number): boolean {
    // Timber bridges across the water
    if (ty >= 26 && ty <= 28 && tx >= 10 && tx <= 18) return false; // Fjord shipyard bridge
    if (ty >= 46 && ty <= 48 && tx >= 28 && tx <= 36) return false; // Paris Seine bridge
    if (ty >= 56 && ty <= 58 && tx >= 38 && tx <= 46) return false; // Stamford Bridge

    // Deep Fjord in the West (x = 0..16, y = 0..38)
    const fjordShore = 14 + Math.round(Math.sin(ty * 0.15) * 3);
    if (tx <= fjordShore && ty <= 38) return true;

    // Seine & Dnepr River branch winding South (x = 30..36, y = 42..75)
    const riverCenter = 33 + Math.round(Math.sin(ty * 0.14) * 2.5);
    if (Math.abs(tx - riverCenter) <= 2 && ty >= 42 && ty <= 75) return true;

    // Fjord lake near Vinland (tx: 68..75, ty: 56..60)
    if (tx >= 68 && tx <= 75 && ty >= 56 && ty <= 60) return true;

    return false;
  }

  private bakeVikingTerrainTexture(ch: number): void {
    const epoch = ch <= 3 ? 1 : ch <= 7 ? 2 : ch <= 11 ? 3 : 4;
    if (this.textures.exists('viking_ground_baked') && this.bakedGroundEpoch === epoch) {
      return;
    }
    this.bakedGroundEpoch = epoch;

    const W = this.mapW * 16;
    const H = this.mapH * 16;

    const srcA2 = this.textures.get('ground_a2').getSourceImage() as HTMLImageElement;

    const extractData = (img: HTMLImageElement) => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      return { data: ctx.getImageData(0, 0, img.width, img.height).data, w: img.width };
    };

    const a2 = extractData(srcA2);

    const sampleBlock = (
      sheet: { data: Uint8ClampedArray; w: number },
      bx: number,
      by: number,
      px: number,
      py: number,
    ): [number, number, number] => {
      const u = ((px % 48) + 48) % 48;
      const v = ((py % 48) + 48) % 48;
      const sx = bx * 96 + 24 + u;
      const sy = by * 144 + 72 + v; // Standard +72
      const idx = (sy * sheet.w + sx) * 4;
      return [sheet.data[idx], sheet.data[idx + 1], sheet.data[idx + 2]];
    };

    const distToSeg = (
      px: number,
      py: number,
      ax: number,
      ay: number,
      bx: number,
      by: number,
    ): number => {
      const dx = bx - ax;
      const dy = by - ay;
      const l2 = dx * dx + dy * dy;
      if (l2 === 0) return Math.hypot(px - ax, py - ay);
      const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
      return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
    };

    // Organic Trail Network across the Viking World
    const trails: Array<[number, number, number, number, number, 'dirt' | 'cobble' | 'boardwalk']> = [
      // Fjord Shore <-> Langhaus Farm
      [16 * 16, 22 * 16, 34 * 16, 30 * 16, 16, 'dirt'],
      // Farm <-> Blót Sacred Grove
      [34 * 16, 30 * 16, 64 * 16, 26 * 16, 16, 'dirt'],
      // Farm <-> Jorvik Market / Lindisfarne
      [34 * 16, 30 * 16, 48 * 16, 32 * 16, 16, epoch >= 2 ? 'cobble' : 'dirt'],
      // Jorvik <-> Jelling Royal Mound
      [48 * 16, 32 * 16, 56 * 16, 44 * 16, 16, 'dirt'],
      // Farm <-> Althing Lögberg (Southwest)
      [34 * 16, 30 * 16, 26 * 16, 40 * 16, 16, 'dirt'],
      // Althing <-> Brattahlíð (West shore)
      [26 * 16, 40 * 16, 18 * 16, 46 * 16, 16, 'dirt'],
      // Jorvik <-> Paris Bridgehead
      [48 * 16, 32 * 16, 34 * 16, 48 * 16, 16, epoch >= 2 ? 'cobble' : 'dirt'],
      // Paris <-> Stamford Bridge
      [34 * 16, 48 * 16, 42 * 16, 58 * 16, 16, epoch >= 3 ? 'cobble' : 'dirt'],
      // Jelling <-> Vinland Shore
      [56 * 16, 44 * 16, 66 * 16, 54 * 16, 16, 'dirt'],
    ];

    const bayer4 = [
      [0 / 16, 8 / 16, 2 / 16, 10 / 16],
      [12 / 16, 4 / 16, 14 / 16, 6 / 16],
      [3 / 16, 11 / 16, 1 / 16, 9 / 16],
      [15 / 16, 7 / 16, 13 / 16, 5 / 16],
    ];

    let canvasTex: Phaser.Textures.CanvasTexture;
    if (this.textures.exists('viking_ground_baked')) {
      canvasTex = this.textures.get('viking_ground_baked') as Phaser.Textures.CanvasTexture;
    } else {
      canvasTex = this.textures.createCanvas('viking_ground_baked', W, H)!;
    }

    const ctx = canvasTex.getContext();
    const imgData = ctx.createImageData(W, H);
    const dst = imgData.data;

    for (let y = 0; y < H; y += 2) {
      for (let x = 0; x < W; x += 2) {
        const dither = bayer4[(y >> 1) & 3][(x >> 1) & 3] - 0.5;
        const jitter = Math.sin(x * 0.034) * Math.cos(y * 0.034) * 5 + dither * 8;

        // Distance to road network
        let minRoadDist = 999;
        let trailType: 'dirt' | 'cobble' | 'boardwalk' = 'dirt';
        for (const [x1, y1, x2, y2, r, type] of trails) {
          const d = distToSeg(x + jitter * 0.5, y + jitter * 0.5, x1, y1, x2, y2) - r;
          if (d < minRoadDist) {
            minRoadDist = d;
            trailType = type;
          }
        }

        // Shoreline / Fjord beach distance
        const tx = Math.floor(x / 16);
        const ty = Math.floor(y / 16);
        const isWater = this.isWaterTile(tx, ty);

        let shoreDist = 999;
        if (!isWater) {
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              if (this.isWaterTile(tx + dx, ty + dy)) {
                const dist = Math.hypot(dx * 16, dy * 16) + jitter * 0.6;
                if (dist < shoreDist) shoreDist = dist;
              }
            }
          }
        }

        for (let py = y; py < y + 2 && py < H; py++) {
          for (let px = x; px < x + 2 && px < W; px++) {
            let rgb: [number, number, number];

            if (isWater) {
              // Handled by dynamic water overlay in buildFjordAndRivers()
              rgb = [14, 52, 92];
            } else if (shoreDist < 18) {
              // Sand / pebbled beach along the fjord (bx=2, by=1)
              rgb = shoreDist < 10 ? sampleBlock(a2, 2, 1, px, py) : sampleBlock(a2, 1, 0, px, py);
            } else if (minRoadDist < 0) {
              // Trails & paths
              if (trailType === 'cobble') {
                rgb = minRoadDist < -3 ? sampleBlock(a2, 6, 1, px, py) : sampleBlock(a2, 1, 0, px, py);
              } else {
                rgb = sampleBlock(a2, 1, 0, px, py); // Warm clay / dirt path
              }
            } else {
              // Rich Nordic Flora Biome: Lush meadow grass, deep forest grass, mossy floor
              const wave = Math.sin(x * 0.024 + y * 0.02) * 0.5 + Math.cos(x * 0.018 - y * 0.026) * 0.5;
              if (wave + dither * 0.55 > 0.65) {
                rgb = sampleBlock(a2, 0, 3, px, py); // Mossy deep pine forest floor
              } else if (wave + dither * 0.55 > 0.2) {
                rgb = sampleBlock(a2, 0, 1, px, py); // Deep forest grass
              } else {
                rgb = sampleBlock(a2, 1, 1, px, py); // Lush meadow grass
              }
            }

            const oi = (py * W + px) * 4;
            dst[oi] = rgb[0];
            dst[oi + 1] = rgb[1];
            dst[oi + 2] = rgb[2];
            dst[oi + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    canvasTex.refresh();

    if (this.groundImage) {
      this.groundImage.setTexture('viking_ground_baked');
    }
  }

  // =========================================================================
  // WATERWAYS, FJORD & SHORELINE
  // =========================================================================
  private buildFjordAndRivers(): void {
    const waterFrames = [
      { x: 16, y: 16, w: 16, h: 16 }, // Official skill standard [16,16,16,16]
    ];

    for (let ty = 0; ty < this.mapH; ty++) {
      for (let tx = 0; tx < this.mapW; tx++) {
        if (this.isWaterTile(tx, ty)) {
          this.add
            .image(tx * 16 + 8, ty * 16 + 8, 'overworld')
            .setCrop(waterFrames[0].x, waterFrames[0].y, waterFrames[0].w, waterFrames[0].h)
            .setDepth(2);
        }

      }
    }
    this.livingWorldManager.initWaterEffects();
  }


  // =========================================================================
  // SCATTER NORDIC NATURE (Oaks, Pines, Bushes, Rocks)
  // =========================================================================
  private scatterNordicNature(): void {
    const random = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    let seed = 42;
    for (let i = 0; i < 220; i++) {
      const rx = Math.floor(random(seed++) * (this.mapW - 6)) + 3;
      const ry = Math.floor(random(seed++) * (this.mapH - 6)) + 3;

      if (this.isWaterTile(rx, ry)) continue;

      // Keep clear of core settlements & paths
      const distToFarm = Math.hypot(rx - 34, ry - 30);
      const distToGrove = Math.hypot(rx - 64, ry - 26);
      const distToJorvik = Math.hypot(rx - 48, ry - 32);
      const distToParis = Math.hypot(rx - 34, ry - 48);

      if (distToFarm < 6 || distToGrove < 5 || distToJorvik < 5 || distToParis < 5) continue;

      const pick = random(seed++);
      const px = rx * 16;
      const py = ry * 16;

      if (pick < 0.35) {
        // High pine / fir / oak trees
        const treeFrames = ['tree_pine_1', 'tree_pine_2', 'tree_fir_1', 'tree_oak_1'];
        const treeFrame = treeFrames[Math.floor(random(seed++) * treeFrames.length)];
        const spr = this.decorManager.placeDecor(px, py, treeFrame, 0.72, 0);
        if (spr) this.livingWorldManager.registerFlora(spr);
      } else if (pick < 0.6) {
        // Bush / shrub
        const bushFrames = ['bush_a', 'bush_b', 'bush_berry_red', 'bush_berry_blue'];
        const bushFrame = bushFrames[Math.floor(random(seed++) * bushFrames.length)];
        const spr = this.decorManager.placeDecor(px, py, bushFrame, 0.52, 0);
        if (spr) this.livingWorldManager.registerFlora(spr);
      } else if (pick < 0.8) {
        // Fern / wild grass
        const fernFrames = ['fern_1', 'fern_2', 'fern_3', 'fern_4'];
        const fernFrame = fernFrames[Math.floor(random(seed++) * fernFrames.length)];
        const spr = this.decorManager.placeDecor(px, py, fernFrame, 0.45, 0);
        if (spr) this.livingWorldManager.registerFlora(spr);
      } else {
        // Mossy stone / pebbles
        const rockFrames = ['rock_small_a', 'rock_small_b', 'rock_small_c', 'rock_small_d', 'rock_moss_a', 'rock_moss_b'];
        const rockFrame = rockFrames[Math.floor(random(seed++) * rockFrames.length)];
        const scale = rockFrame.startsWith('rock_moss_') ? 0.32 : 0.45;
        this.decorManager.placeDecor(px, py, rockFrame, scale, 0);
      }
    }
  }

  // =========================================================================
  // STATIC BUILDINGS, LANDMARKS & STRUCTURES
  // =========================================================================
  private buildStaticVikingWorld(): void {
    // --- 1. ASTRID'S FJORD FARM & VILLAGE (K1 & K3) ---
    // Great Thatched Longhouse
    this.decorManager.placeProp(34 * 16, 26 * 16, 'viking_longhouse_thatched', 0.65);
    // Huts and sheds around farm
    this.decorManager.placeProp(26 * 16, 28 * 16, 'viking_cottage_gable', 0.6);
    this.decorManager.placeProp(42 * 16, 26 * 16, 'viking_round_hut', 0.6);
    this.decorManager.placeProp(38 * 16, 32 * 16, 'viking_shed_workshop', 0.6);
    // Village Well & Wood piles (Calibrated proportional sizes)
    this.decorManager.placeProp(30 * 16, 33 * 16, 'viking_village_well', 0.32);
    this.decorManager.placeProp(40 * 16, 34 * 16, 'viking_wood_pile_stacked', 0.34);
    this.decorManager.placeProp(42 * 16, 34 * 16, 'viking_chopping_block', 0.5);
    this.decorManager.placeProp(24 * 16, 36 * 16, 'viking_haystack_large', 0.38);
    // Hearth Fire & Roasting Boar
    this.decorManager.placeProp(34 * 16, 32 * 16, 'viking_spit_roast_campfire', 0.3);
    this.livingWorldManager.registerFireSource(34 * 16, 32 * 16, true, 26, 0xffa533);

    // --- 2. FJORD SHORE & SHIPYARD (K3) ---
    // Wooden Harbor Pier
    this.decorManager.placeProp(16 * 16, 20 * 16, 'viking_wooden_dock', 0.6);
    // Moored Longships
    this.decorManager.placeProp(10 * 16, 16 * 16, 'viking_drakkar_red_sail', 0.45);
    this.decorManager.placeProp(8 * 16, 26 * 16, 'viking_ship_blue_sail', 0.45);
    this.decorManager.placeProp(12 * 16, 32 * 16, 'viking_knarr_trading', 0.45);
    // Anchors & Cargo barrels
    this.decorManager.placeProp(18 * 16, 24 * 16, 'viking_iron_anchor', 0.35);
    this.decorManager.placeProp(19 * 16, 21 * 16, 'viking_stacked_cargo_barrels', 0.35);
    this.decorManager.placeProp(20 * 16, 25 * 16, 'viking_fishnet_drying', 0.38);

    // --- 3. SACRED BLÓT GROVE & RUNESTONES (K2) ---
    this.decorManager.placeProp(64 * 16, 23 * 16, 'viking_blot_fire_altar', 0.35);
    this.livingWorldManager.registerFireSource(64 * 16, 23 * 16, true, 30, 0xef4444);
    this.decorManager.placeProp(60 * 16, 24 * 16, 'viking_runestone_futhark_red', 0.36);
    this.decorManager.placeProp(68 * 16, 24 * 16, 'viking_runestone_knotwork', 0.36);
    this.decorManager.placeProp(62 * 16, 20 * 16, 'viking_god_totem_odin', 0.35);
    this.decorManager.placeProp(66 * 16, 20 * 16, 'viking_god_totem_wolf', 0.35);
    const banner = this.decorManager.placeProp(58 * 16, 26 * 16, 'viking_banner_raven_red', 0.35);
    if (banner) this.livingWorldManager.registerBanner(banner);

    // Lindisfarne, Paris, Danelag and Stamford Bridge props are dynamically gated in rebuildChapterEntities()
  }

  // =========================================================================
  // DYNAMIC ENTITIES & CHAPTER GATING (Rebuilt per chapter & build events)
  // =========================================================================
  public rebuildChapterEntities(): void {
    this.dynamicGroup.clear(true, true);
    this.targets = [];

    const ch = gameState.chapter;
    this.currentChapterData = CHAPTERS.find((c) => c.id === ch) || CHAPTERS[0];
    const mentorInfo = this.mentorCoords[ch] || this.mentorCoords[1];

    // 1. Current Chapter Mentor
    this.mentorSprite = this.add
      .sprite(mentorInfo.x * 16, mentorInfo.y * 16, mentorInfo.id, 0)
      .setOrigin(0.5, 0.9)
      .setDepth(mentorInfo.y * 16);
    this.dynamicGroup.add(this.mentorSprite);
    this.livingWorldManager.registerMentor(this.mentorSprite);

    this.targets.push({
      id: mentorInfo.id,
      kind: 'mentor',
      name: mentorInfo.name,
      sub: '[E] Ansprechen (Kapitelaufgabe & Dialog)',
      x: mentorInfo.x * 16,
      y: mentorInfo.y * 16,
      minChapter: ch,
    });

    // 2. Built Infrastructure Projects (Taste [B])
    VIKING_BUILDINGS.forEach((b) => {
      const isBuilt = gameState.builtBuildings.has(b.id);
      if (isBuilt) {
        const img = this.decorManager.placeProp(b.x * 16, b.y * 16, b.propKey, 0.6);
        if (img) this.dynamicGroup.add(img);
      } else if (b.chapter === ch) {
        // Active building site
        this.targets.push({
          id: b.id,
          kind: 'building_plot',
          name: b.name,
          sub: `[B] Bauprojekt errichten (${b.costText})`,
          x: b.x * 16,
          y: b.y * 16,
          minChapter: ch,
          buildingId: b.id,
        });
      }
    });

    // 3. Chapter-gated historical structures
    if (ch >= 4) {
      const p1 = this.decorManager.placeProp(52 * 16, 17 * 16, 'monastery_stone_arch', 0.5);
      const p2 = this.decorManager.placeProp(54 * 16, 18 * 16, 'monastery_golden_altar', 0.35);
      const p3 = this.decorManager.placeProp(48 * 16, 18 * 16, 'viking_weapon_rack_spears', 0.35);
      if (p1) this.dynamicGroup.add(p1);
      if (p2) this.dynamicGroup.add(p2);
      if (p3) this.dynamicGroup.add(p3);
    }

    if (ch >= 7) {
      const p4 = this.decorManager.placeProp(48 * 16, 30 * 16, 'viking_cottage_gable', 0.6);
      const p5 = this.decorManager.placeProp(52 * 16, 31 * 16, 'viking_shield_stand_rune', 0.35);
      const p6 = this.decorManager.placeProp(44 * 16, 32 * 16, 'viking_armor_stand_chainmail', 0.35);
      if (p4) this.dynamicGroup.add(p4);
      if (p5) this.dynamicGroup.add(p5);
      if (p6) this.dynamicGroup.add(p6);
    }

    if (ch >= 6) {
      const p7 = this.decorManager.placeProp(32 * 16, 68 * 16, 'paris_fortress_gate', 0.6);
      const p8 = this.decorManager.placeProp(36 * 16, 66 * 16, 'paris_stone_tower', 0.6);
      const p9 = this.decorManager.placeProp(28 * 16, 68 * 16, 'paris_stone_wall', 0.6);
      const p10 = this.decorManager.placeProp(38 * 16, 70 * 16, 'siege_catapult_wood', 0.4);
      const p11 = this.decorManager.placeProp(30 * 16, 71 * 16, 'battlefield_wooden_stakes', 0.35);
      const p12 = this.decorManager.placeProp(35 * 16, 72 * 16, 'viking_treasure_chest_danegeld', 0.35);
      if (p7) this.dynamicGroup.add(p7);
      if (p8) this.dynamicGroup.add(p8);
      if (p9) this.dynamicGroup.add(p9);
      if (p10) this.dynamicGroup.add(p10);
      if (p11) this.dynamicGroup.add(p11);
      if (p12) this.dynamicGroup.add(p12);
    }

    if (ch >= 12) {
      const p13 = this.decorManager.placeProp(42 * 16, 74 * 16, 'bridge_timber_crossing', 0.6);
      const p14 = this.decorManager.placeProp(46 * 16, 75 * 16, 'viking_camp_tent', 0.5);
      if (p13) this.dynamicGroup.add(p13);
      if (p14) this.dynamicGroup.add(p14);
    }

    // 3. Archaeological Relics (5 Historical Relics on Map)
    VIKING_RELICS.forEach((r) => {
      const isFound = gameState.discoveredRelics.has(r.id);
      if (!isFound && r.minChapter <= ch) {
        // Glowing discovery marker (Section 2.6)
        const marker = this.add
          .image(r.x * 16, r.y * 16, 'relic_marker_glow')
          .setDepth(r.y * 16 - 2)
          .setScale(0.95);
        this.dynamicGroup.add(marker);

        // Pulsing glow tween
        this.tweens.add({
          targets: marker,
          scale: 1.08,
          alpha: 0.85,
          yoyo: true,
          repeat: -1,
          duration: 900,
          ease: 'Sine.easeInOut',
        });

        this.targets.push({
          id: r.id,
          kind: 'relic',
          name: r.name,
          sub: '[E] Historisches Relikt untersuchen & bergen',
          x: r.x * 16,
          y: r.y * 16,
          minChapter: r.minChapter,
          relic: r,
        });
      }
    });

    // 4. Natural Resource Hotspots (Gerste, Holz, Moor-Erz, Bernstein, Kräuter)
    const hotspots: Array<{ id: string; name: string; item: VikingItemId; x: number; y: number }> = [
      { id: 'res_gerste_1', name: 'Reifes Gerstenfeld', item: 'gerste_roggen', x: 30 * 16, y: 35 * 16 },
      { id: 'res_gerste_2', name: 'Roggenacker am Fjord', item: 'gerste_roggen', x: 26 * 16, y: 34 * 16 },
      { id: 'res_holz_1', name: 'Eichenbestand am Waldrand', item: 'bauholz', x: 44 * 16, y: 22 * 16 },
      { id: 'res_holz_2', name: 'Kiefernforst am Hang', item: 'bauholz', x: 50 * 16, y: 36 * 16 },
      { id: 'res_erz_1', name: 'Raseneisenerz im Fjordmoor', item: 'raseneisenerz', x: 22 * 16, y: 38 * 16 },
      { id: 'res_bernstein_1', name: 'Bernsteinfund am Strand', item: 'bernstein_perle', x: 18 * 16, y: 28 * 16 },
      { id: 'res_kraeuter_1', name: 'Berg-Heilkräuter', item: 'heil_kraeuter', x: 38 * 16, y: 56 * 16 },
      { id: 'res_schaf_1', name: 'Weideschafe & Ziegen', item: 'schafmilch', x: 28 * 16, y: 46 * 16 },
    ];

    hotspots.forEach((h) => {
      this.targets.push({
        id: h.id,
        kind: 'resource',
        name: h.name,
        sub: `[E] Sammeln (+1 ${VIKING_ITEMS[h.item].name})`,
        x: h.x,
        y: h.y,
        minChapter: 1,
        itemId: h.item,
      });
      this.livingWorldManager.registerResourceHotspot(h.x, h.y);
    });
  }

  // =========================================================================
  // UPDATE LOOP: MOVEMENT, SINGLE-PROXIMITY BADGE & LIVING WORLD
  // =========================================================================
  update(time: number, delta: number) {
    const ui = this.scene.get('UI') as any;
    if (ui && ui.isModalOpen && ui.isModalOpen()) {
      if (this.labelLayer) this.labelLayer.innerHTML = '';
      return;
    }

    const isMoving = this.handlePlayerMovement(delta);
    this.livingWorldManager.update(delta, this.player.x, this.player.y, isMoving);
    this.wildlifeManager.update(time, delta, this.player.x, this.player.y);
    this.updateSingleProximityBadge();
    this.updateQuestCompass();
  }

  private handlePlayerMovement(delta: number): boolean {
    const dt = delta / 1000;
    const speed = 125; // px/sec

    const ui = this.scene.get('UI') as any;
    const touch = ui ? ui.touchControls : null;

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown || (touch && touch.dx < -0.2)) {
      vx -= 1;
    }
    if (this.cursors.right.isDown || this.wasd.D.isDown || (touch && touch.dx > 0.2)) {
      vx += 1;
    }
    if (this.cursors.up.isDown || this.wasd.W.isDown || (touch && touch.dy < -0.2)) {
      vy -= 1;
    }
    if (this.cursors.down.isDown || this.wasd.S.isDown || (touch && touch.dy > 0.2)) {
      vy += 1;
    }

    const isMoving = vx !== 0 || vy !== 0;

    if (isMoving) {
      const len = Math.hypot(vx, vy);
      vx = (vx / len) * speed * dt;
      vy = (vy / len) * speed * dt;

      const nextX = Phaser.Math.Clamp(this.player.x + vx, 16, (this.mapW - 1) * 16);
      const nextY = Phaser.Math.Clamp(this.player.y + vy, 16, (this.mapH - 1) * 16);

      // Water collision check
      const ntx = Math.floor(nextX / 16);
      const nty = Math.floor(nextY / 16);

      if (!this.isWaterTile(ntx, nty)) {
        this.player.x = nextX;
        this.player.y = nextY;
        this.player.setDepth(nextY);
        gameState.playerX = nextX;
        gameState.playerY = nextY;
        gameState.addWalkedDistance(Math.hypot(vx, vy));
      }

      // Orientation & Animation
      const pKey = gameState.gender === 'female' ? 'player_astrid' : 'player_ragnar';
      if (Math.abs(vx) > Math.abs(vy)) {
        if (vx > 0) {
          this.facing = 'right';
          this.player.play(`${pKey}_walk_right`, true);
        } else {
          this.facing = 'left';
          this.player.play(`${pKey}_walk_left`, true);
        }
      } else {
        if (vy > 0) {
          this.facing = 'down';
          this.player.play(`${pKey}_walk_down`, true);
        } else {
          this.facing = 'up';
          this.player.play(`${pKey}_walk_up`, true);
        }
      }

      // Step Sound
      this.stepTimer -= delta;
      if (this.stepTimer <= 0) {
        sound.playStep();
        this.stepTimer = 340;
      }
    } else {
      const pKey = gameState.gender === 'female' ? 'player_astrid' : 'player_ragnar';
      this.player.stop();
      this.player.setFrame(this.facing === 'down' ? 0 : this.facing === 'right' ? 17 : this.facing === 'up' ? 34 : 51);
    }

    // Interaction key [E] check
    if (Phaser.Input.Keyboard.JustDown(this.wasd.E) || (touch && touch.actionPressed)) {
      if (touch) touch.actionPressed = false;
      this.triggerActiveInteraction();
    }

    return isMoving;
  }

  // =========================================================================
  // SINGLE-PROXIMITY WORLD DOM BADGE (< 44px)
  // =========================================================================
  private updateSingleProximityBadge(): void {
    if (!this.labelLayer) return;

    let nearest: InteractiveTarget | null = null;
    let minDist = 44; // Max proximity radius (Section 1.2)

    for (const t of this.targets) {
      const dist = Math.hypot(this.player.x - t.x, this.player.y - t.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = t;
      }
    }

    this.activeTarget = nearest;

    if (!nearest) {
      this.labelLayer.innerHTML = '';
      return;
    }

    // Project world coordinates to screen pixels
    const cam = this.cameras.main;
    const sx = (nearest.x - cam.scrollX) * cam.zoom + this.scale.width / 2 - (cam.width * cam.zoom) / 2;
    const sy = (nearest.y - 24 - cam.scrollY) * cam.zoom + this.scale.height / 2 - (cam.height * cam.zoom) / 2;

    // Single DOM Badge rendering
    this.labelLayer.innerHTML = `
      <div class="world-dom-label" style="left: ${sx}px; top: ${sy}px;">
        <div class="world-dom-label-title">${nearest.name}</div>
        <div class="world-dom-label-sub">${nearest.sub}</div>
      </div>
    `;
  }

  private triggerActiveInteraction(): void {
    if (!this.activeTarget) return;

    const t = this.activeTarget;
    const ui = this.scene.get('UI') as any;
    if (!ui) return;

    sound.playSelect();

    if (t.kind === 'mentor') {
      const chData = CHAPTERS.find((c) => c.id === gameState.chapter);
      if (chData) {
        ui.openMentorDialog(chData);
      }
    } else if (t.kind === 'building_plot') {
      ui.openBuildingModal(t.buildingId);
    } else if (t.kind === 'relic') {
      if (t.relic) {
        ui.openRelicModal(t.relic);
      }
    } else if (t.kind === 'resource') {
      if (t.itemId) {
        gameState.addItem(t.itemId, 1);
        gameState.setObjective(gameState.chapter, 1, true); // Mark resource/craft objective
        sound.playCraftSuccess();
        ui.showToast(`+1 ${VIKING_ITEMS[t.itemId].name} gesammelt!`, 'success');
      }
    }
  }

  // =========================================================================
  // LIVE QUEST-RADAR & ZIEL-KOMPASS (Section 1.3)
  // =========================================================================
  public updateQuestCompass(): void {
    if (!this.player) return;

    const ch = gameState.chapter;
    const objs = gameState.chapterObjectives[ch] || [false, false, false, false];
    const mentorInfo = this.mentorCoords[ch] || this.mentorCoords[1];

    let targetX = mentorInfo.x * 16;
    let targetY = mentorInfo.y * 16;
    let targetName = mentorInfo.name.split(' (')[0];

    if (!objs[0]) {
      // 1. Need to speak with mentor
      targetX = mentorInfo.x * 16;
      targetY = mentorInfo.y * 16;
      targetName = mentorInfo.name.split(' (')[0];
    } else if (!objs[1]) {
      // 2. Resource / crafting task: find nearest resource hotspot
      let nearestDist = 999999;
      for (const t of this.targets) {
        if (t.kind === 'resource') {
          const d = Math.hypot(t.x - this.player.x, t.y - this.player.y);
          if (d < nearestDist) {
            nearestDist = d;
            targetX = t.x;
            targetY = t.y;
            targetName = t.name;
          }
        }
      }
    } else if (!objs[2]) {
      // 3. Building project
      const bPlot = this.targets.find((t) => t.kind === 'building_plot');
      if (bPlot) {
        targetX = bPlot.x;
        targetY = bPlot.y;
        targetName = bPlot.name;
      } else {
        targetX = mentorInfo.x * 16;
        targetY = mentorInfo.y * 16;
        targetName = mentorInfo.name.split(' (')[0];
      }
    } else if (!objs[3]) {
      // 4. Chapter Quiz at mentor
      targetX = mentorInfo.x * 16;
      targetY = mentorInfo.y * 16;
      targetName = `${mentorInfo.name.split(' (')[0]} (Quiz)`;
    } else {
      // All 4 completed: prompt to advance
      if (ch < 12) {
        const nextMentor = this.mentorCoords[ch + 1];
        if (nextMentor) {
          targetX = nextMentor.x * 16;
          targetY = nextMentor.y * 16;
          targetName = `${nextMentor.name.split(' (')[0]}`;
        } else {
          targetName = 'Zeitstrahl (Taste Z)';
        }
      } else {
        targetName = 'Alle 12 Kapitel gemeistert!';
      }
    }

    const dx = targetX - this.player.x;
    const dy = targetY - this.player.y;
    const distPx = Math.hypot(dx, dy);
    const meters = Math.max(2, Math.round(distPx / 8));
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    let dirStr = '→ Osten';
    if (angle >= -112.5 && angle < -67.5) dirStr = '↑ Norden';
    else if (angle >= -67.5 && angle < -22.5) dirStr = '↗ Nordosten';
    else if (angle >= -22.5 && angle < 22.5) dirStr = '→ Osten';
    else if (angle >= 22.5 && angle < 67.5) dirStr = '↘ Südosten';
    else if (angle >= 67.5 && angle < 112.5) dirStr = '↓ Süden';
    else if (angle >= 112.5 && angle < 157.5) dirStr = '↙ Südwesten';
    else if (angle >= -157.5 && angle < -112.5) dirStr = '↖ Nordwesten';
    else dirStr = '← Westen';

    if (distPx < 32) {
      this.currentCompassText = `📍 Ziel direkt vor dir: ${targetName} (drücke E)`;
    } else {
      this.currentCompassText = `🧭 ${targetName}: ${dirStr} (${meters} m)`;
    }
  }
}
