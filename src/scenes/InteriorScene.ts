import Phaser from 'phaser';
import { gameState } from '../systems/GameState';
import { sound } from '../audio/sound';
import { STATIONS } from '../data/stations';
import { VIKING_RELICS } from '../data/relics';

export type InteriorRoomId =
  | 'langhaus_jarl'
  | 'bootswerft_drakkar'
  | 'heiligtum_odin'
  | 'handelskontor_hedeby';

export interface InteriorInitData {
  buildingId?: InteriorRoomId;
  roomId?: InteriorRoomId;
  buildingName?: string;
  title?: string;
  subtitle?: string;
  mentorId?: string;
  mentorName?: string;
  returnX: number;
  returnY: number;
}

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  speaker: string;
  text: string;
  action?: () => void;
}

export class InteriorScene extends Phaser.Scene {
  private initData!: InteriorInitData;
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
    ESC: Phaser.Input.Keyboard.Key;
  };
  private hotspots: Hotspot[] = [];
  private exitMat!: { x: number; y: number; w: number; h: number };
  private isExiting = false;
  private stepCooldown = 0;
  private domOverlay?: HTMLDivElement;

  constructor() {
    super({ key: 'InteriorScene' });
  }

  public init(data: InteriorInitData): void {
    const bId = data?.roomId || data?.buildingId || 'langhaus_jarl';
    this.initData = {
      buildingId: bId,
      roomId: bId,
      title: data?.title || this.getRoomTitle(bId),
      subtitle: data?.subtitle || 'Wikingerzeit · Skandinavien & Nordmeer',
      returnX: data?.returnX ?? 34 * 16,
      returnY: data?.returnY ?? 30 * 16,
    };
    this.hotspots = [];
    this.isExiting = false;
  }

  public create(): void {
    const ROOM_W = 352;
    const ROOM_H = 208;
    const CX = 240;
    const CY = 140;
    const LEFT = CX - ROOM_W / 2;
    const TOP = CY - ROOM_H / 2;

    this.cameras.main.setBackgroundColor('#0b1015');

    document.getElementById('interior-dom-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'interior-dom-overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:25;font-family:system-ui,sans-serif;';
    document.body.appendChild(overlay);
    this.domOverlay = overlay;

    const addDomTag = (
      rx: number,
      ry: number,
      text: string,
      bg = 'rgba(20,28,36,0.92)',
      border = '#38bdf8',
      color = '#e0f2fe'
    ) => {
      const el = document.createElement('div');
      const pctX = (rx / 480) * 100;
      const pctY = (ry / 270) * 100;
      el.style.cssText = `
        position:absolute;left:${pctX}%;top:${pctY}%;transform:translate(-50%,-50%);
        background:${bg};border:1.5px solid ${border};color:${color};
        padding:2px 8px;border-radius:999px;font-size:11px;font-weight:800;
        white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.7);
      `;
      el.textContent = text;
      overlay.appendChild(el);
    };

    // Header Banner
    const headerBanner = document.createElement('div');
    headerBanner.style.cssText = `
      position:absolute;left:50%;top:11%;transform:translate(-50%,-50%);
      background:linear-gradient(180deg,rgba(28,40,52,0.95),rgba(15,23,32,0.95));
      border:2px solid #38bdf8;border-radius:8px;padding:4px 14px;text-align:center;
      box-shadow:0 4px 14px rgba(0,0,0,0.8);
    `;
    const roomTitle =
      this.initData.title || this.getRoomTitle(this.initData.buildingId || 'langhaus_jarl');
    headerBanner.innerHTML = `
      <div style="color:#7dd3fc;font-size:13px;font-weight:900;letter-spacing:0.4px;">🛡️ ${roomTitle}</div>
      <div style="color:#e2e8f0;font-size:10.5px;font-weight:700;">Die Wikinger · Innenraum · [E] Interagieren · [ESC] Verlassen</div>
    `;
    overlay.appendChild(headerBanner);

    const g = this.add.graphics();
    g.fillStyle(0x131a22, 1);
    g.fillRect(LEFT - 10, TOP - 10, ROOM_W + 20, ROOM_H + 20);

    // Wall & Floor
    g.fillStyle(0x1e293b, 1);
    g.fillRect(LEFT, TOP, ROOM_W, 36);

    // Floor wooden planks
    for (let py = TOP + 36; py < TOP + ROOM_H; py += 16) {
      const shade = ((py - (TOP + 36)) / 16) % 2 === 0 ? 0x24180e : 0x2b1c11;
      g.fillStyle(shade, 1);
      g.fillRect(LEFT, py, ROOM_W, 16);
      g.lineStyle(1, 0x18100a, 0.45);
      g.strokeRect(LEFT, py, ROOM_W, 16);
    }

    // Outer wall border
    g.lineStyle(2, 0x475569, 1);
    g.strokeRect(LEFT, TOP, ROOM_W, ROOM_H);

    // Wall pillars
    for (let px = LEFT + 16; px < LEFT + ROOM_W; px += 48) {
      g.fillStyle(0x334155, 1);
      g.fillRect(px, TOP, 8, 36);
    }

    // Authentic braziers / torches on walls
    const torchCols = [LEFT + 24, LEFT + ROOM_W - 24];
    for (const tx of torchCols) {
      const flame = this.add
        .rectangle(tx, TOP + 18, 5, 8, 0xf59e0b, 0.95)
        .setDepth(TOP + 20);
      this.tweens.add({
        targets: flame,
        scaleY: 1.3,
        alpha: 0.7,
        duration: 350 + Math.random() * 200,
        yoyo: true,
        repeat: -1,
      });
    }

    this.buildRoomProps(this.initData.buildingId || 'langhaus_jarl', CX, CY, LEFT, TOP, ROOM_W, ROOM_H, addDomTag);

    // Exit mat at bottom
    this.exitMat = { x: CX, y: TOP + ROOM_H - 14, w: 56, h: 18 };
    g.fillStyle(0x0369a1, 1);
    g.fillRect(this.exitMat.x - 26, this.exitMat.y - 8, 52, 14);
    addDomTag(this.exitMat.x, this.exitMat.y, '🚪 Hinaus zum Fjord [ESC/E]', 'rgba(15,23,42,0.92)', '#38bdf8');

    // Player spawn
    const playerTex = gameState.gender === 'female' ? 'player_astrid' : 'player_ragnar';
    this.player = this.physics.add.sprite(CX, TOP + ROOM_H - 42, playerTex, 0);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(14, 18);
    this.player.setOffset(1, 14);
    this.player.setDepth(100);

    const charKey = gameState.gender === 'female' ? 'player_astrid' : 'player_ragnar';
    if (!this.anims.exists(`${charKey}_walk_down`)) {
      ['down', 'left', 'right', 'up'].forEach((dir, i) => {
        this.anims.create({
          key: `${charKey}_walk_${dir}`,
          frames: this.anims.generateFrameNumbers(playerTex, { start: i * 4, end: i * 4 + 3 }),
          frameRate: 8,
          repeat: -1,
        });
      });
    }

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,A,S,D,E,ESC') as {
      W: Phaser.Input.Keyboard.Key;
      A: Phaser.Input.Keyboard.Key;
      S: Phaser.Input.Keyboard.Key;
      D: Phaser.Input.Keyboard.Key;
      E: Phaser.Input.Keyboard.Key;
      ESC: Phaser.Input.Keyboard.Key;
    };
  }

  private buildRoomProps(
    bId: string,
    cx: number,
    _cy: number,
    left: number,
    top: number,
    w: number,
    _h: number,
    addDomTag: (rx: number, ry: number, text: string, bg?: string, border?: string, color?: string) => void
  ): void {
    if (bId === 'bootswerft_drakkar') {
      if (this.textures.exists('viking_chopping_block')) {
        this.add.image(cx, top + 52, 'viking_chopping_block').setScale(0.85).setDepth(top + 52);
      }
      if (this.textures.exists('viking_wood_pile_stacked')) {
        this.add.image(left + 78, top + 80, 'viking_wood_pile_stacked').setScale(0.75).setDepth(top + 80);
      }
      if (this.textures.exists('viking_iron_anchor')) {
        this.add.image(left + w - 78, top + 80, 'viking_iron_anchor').setScale(0.8).setDepth(top + 80);
      }

      this.add.sprite(cx, top + 68, 'npc_halvdan_shipwright', 0).setScale(1.0).setDepth(top + 68);
      addDomTag(cx, top + 46, '🔨 Schiffbauer Halvdan (E)', 'rgba(30,41,59,0.92)', '#38bdf8', '#7dd3fc');
      addDomTag(left + 78, top + 58, '🪵 Klinker-Planken (E)');
      addDomTag(left + w - 78, top + 58, '⚓ Eisennieten & Anker (E)');

      this.hotspots.push(
        {
          id: 'mentor_halvdan',
          x: cx,
          y: top + 70,
          label: 'Schiffbauer Halvdan ansprechen (E)',
          speaker: 'Halvdan – Meister der Klinkerwerft',
          text: 'Sei gegrüßt in der Werft! Ein echtes Langschiff muss auf den tosenden Wellen tanzen wie eine Schlange.',
        },
        {
          id: 'station_klinker_hotspot',
          x: left + 78,
          y: top + 80,
          label: 'Klinkerbau-Station starten (E)',
          speaker: 'Klinkerbau-Helling',
          text: 'Planken überlappend vernieten und kalfatern.',
          action: () => {
            const st = STATIONS.find((s) => s.id === 'station_langschiff_bau');
            const win = window as any;
            if (win.__openStation && st) win.__openStation(st.id);
          },
        },
        {
          id: 'relic_oseberg_hotspot',
          x: left + w - 78,
          y: top + 80,
          label: '360°-Quelleninspektor: Oseberg-Langschiff (E)',
          speaker: 'Oseberg-Schiffsfund',
          text: 'Prachtvoll geschnitztes Schiffsgrab von 834 n. Chr.',
          action: () => {
            const rel = VIKING_RELICS.find((r) => r.id === 'relic_oseberg_schiff');
            const win = window as any;
            if (win.__openArtifactInspector && rel) win.__openArtifactInspector(rel.id);
          },
        }
      );
    } else if (bId === 'heiligtum_odin') {
      if (this.textures.exists('viking_blot_fire_altar')) {
        this.add.image(cx, top + 50, 'viking_blot_fire_altar').setScale(0.85).setDepth(top + 50);
      }
      if (this.textures.exists('viking_god_totem_odin')) {
        this.add.image(left + 78, top + 80, 'viking_god_totem_odin').setScale(0.85).setDepth(top + 80);
      }
      if (this.textures.exists('viking_runestone_futhark_red')) {
        this.add.image(left + w - 78, top + 80, 'viking_runestone_futhark_red').setScale(0.8).setDepth(top + 80);
      }

      this.add.sprite(cx, top + 68, 'npc_thorgest_gode', 0).setScale(1.0).setDepth(top + 68);
      addDomTag(cx, top + 46, '⚡ Gode Thorgest (E)', 'rgba(30,41,59,0.92)', '#fde047', '#fde047');
      addDomTag(left + 78, top + 58, '🦅 Odin-Holztotem (E)');
      addDomTag(left + w - 78, top + 58, 'ᚠ Jelling-Runen (E)');

      this.hotspots.push(
        {
          id: 'mentor_thorgest',
          x: cx,
          y: top + 70,
          label: 'Gode Thorgest ansprechen (E)',
          speaker: 'Thorgest – Priester der Asen',
          text: 'Sei gegrüßt im heiligen Hain! Odin gab ein Auge für Weisheit, Thor schützt uns mit Mjölnir vor den Riesen.',
        },
        {
          id: 'station_runen_hotspot',
          x: left + w - 78,
          y: top + 80,
          label: 'Jelling-Runen entziffern (E)',
          speaker: 'Königlicher Runenstein',
          text: 'Runen im Jüngeren Futhark deuten.',
          action: () => {
            const st = STATIONS.find((s) => s.id === 'station_futhark_runen');
            const win = window as any;
            if (win.__openStation && st) win.__openStation(st.id);
          },
        }
      );
    } else if (bId === 'handelskontor_hedeby') {
      if (this.textures.exists('viking_stacked_cargo_barrels')) {
        this.add.image(cx, top + 52, 'viking_stacked_cargo_barrels').setScale(0.85).setDepth(top + 52);
      }
      if (this.textures.exists('viking_treasure_chest_danegeld')) {
        this.add.image(left + 78, top + 80, 'viking_treasure_chest_danegeld').setScale(0.85).setDepth(top + 80);
      }
      if (this.textures.exists('viking_pelt_bear_spread')) {
        this.add.image(left + w - 78, top + 80, 'viking_pelt_bear_spread').setScale(0.75).setDepth(top + 80);
      }

      this.add.sprite(cx, top + 68, 'npc_rorik_varaeger', 0).setScale(1.0).setDepth(top + 68);
      addDomTag(cx, top + 46, '⚖️ Waräger-Kaufmann Rorik (E)', 'rgba(30,41,59,0.92)', '#38bdf8', '#7dd3fc');
      addDomTag(left + 78, top + 58, '🪙 Hacksilber-Waage (E)');
      addDomTag(left + w - 78, top + 58, '🧭 Sonnenstein (E)');

      this.hotspots.push(
        {
          id: 'mentor_rorik',
          x: cx,
          y: top + 70,
          label: 'Waräger Rorik ansprechen (E)',
          speaker: 'Rorik – Kaufmann vom Dnepr',
          text: 'Willkommen im Kontor! Von Byzanz bis Grönland wiegen wir Hacksilber gegen Seide und Walrosszahn.',
        },
        {
          id: 'station_waage_hotspot',
          x: left + 78,
          y: top + 80,
          label: 'Hacksilber-Waage bedienen (E)',
          speaker: 'Feinwaage aus Bronze',
          text: 'Silber-Dirhams gegen Handelswaren abwägen.',
          action: () => {
            const st = STATIONS.find((s) => s.id === 'station_silberwaage');
            const win = window as any;
            if (win.__openStation && st) win.__openStation(st.id);
          },
        },
        {
          id: 'station_sonnenstein_hotspot',
          x: left + w - 78,
          y: top + 80,
          label: 'Sonnenstein-Navigation prüfen (E)',
          speaker: 'Nautischer Kristall',
          text: 'Polarisationspeilung der Sonne im Fjordnebel.',
          action: () => {
            const st = STATIONS.find((s) => s.id === 'station_sonnenstein');
            const win = window as any;
            if (win.__openStation && st) win.__openStation(st.id);
          },
        }
      );
    } else {
      // Default: langhaus_jarl (Großes Sippenlanghaus)
      if (this.textures.exists('viking_spit_roast_campfire')) {
        this.add.image(cx, top + 50, 'viking_spit_roast_campfire').setScale(0.85).setDepth(top + 50);
      }
      if (this.textures.exists('viking_weapon_rack_axes')) {
        this.add.image(left + 78, top + 80, 'viking_weapon_rack_axes').setScale(0.85).setDepth(top + 80);
      }
      if (this.textures.exists('viking_shield_stand_rune')) {
        this.add.image(left + w - 78, top + 80, 'viking_shield_stand_rune').setScale(0.8).setDepth(top + 80);
      }

      this.add.sprite(cx, top + 68, 'npc_astrid_elder', 0).setScale(1.0).setDepth(top + 68);
      addDomTag(cx, top + 46, '👑 Hausherrin Astrid (E)', 'rgba(30,41,59,0.92)', '#fde047', '#fde047');
      addDomTag(left + 78, top + 58, '🪓 Waffenständer & Äxte (E)');
      addDomTag(left + w - 78, top + 58, '🛡️ Runenschilde der Krieger (E)');

      this.hotspots.push(
        {
          id: 'mentor_astrid',
          x: cx,
          y: top + 70,
          label: 'Hausherrin Astrid ansprechen (E)',
          speaker: 'Astrid – Herrin des Hofes',
          text: 'Tritt ein an die warme Feuerstelle! Mein Schlüsselbund hütet die Vorräte der Sippe vor dem strengen Winter.',
        },
        {
          id: 'station_thing_hotspot',
          x: left + w - 78,
          y: top + 80,
          label: 'Althing-Rechtsordnung prüfen (E)',
          speaker: 'Gesetzesfelsen am Lögberg',
          text: 'Urteile und Thingfrieden nach altnordischem Recht.',
          action: () => {
            const st = STATIONS.find((s) => s.id === 'station_thing_recht');
            const win = window as any;
            if (win.__openStation && st) win.__openStation(st.id);
          },
        }
      );
    }
  }

  public update(_time: number, delta: number): void {
    if (!this.player || this.isExiting) {
      if (this.player?.body) (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      return;
    }

    if (this.wasd && Phaser.Input.Keyboard.JustDown(this.wasd.ESC)) {
      this.exitToOverworld();
      return;
    }

    const speed = 105;
    let vx = 0;
    let vy = 0;

    if (this.cursors?.left.isDown || this.wasd?.A.isDown) vx = -speed;
    else if (this.cursors?.right.isDown || this.wasd?.D.isDown) vx = speed;

    if (this.cursors?.up.isDown || this.wasd?.W.isDown) vy = -speed;
    else if (this.cursors?.down.isDown || this.wasd?.S.isDown) vy = speed;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(vx, vy);
    this.player.setDepth(this.player.y);

    const charKey = gameState.gender === 'female' ? 'player_astrid' : 'player_ragnar';
    if (vx !== 0 || vy !== 0) {
      const dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left') : vy > 0 ? 'down' : 'up';
      this.player.anims.play(`${charKey}_walk_${dir}`, true);
      this.stepCooldown -= delta;
      if (this.stepCooldown <= 0) {
        sound.playFootstep('wood');
        this.stepCooldown = 280;
      }
    } else {
      this.player.anims.stop();
    }

    let nearest: Hotspot | null = null;
    let minDist = 42;
    for (const h of this.hotspots) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, h.x, h.y);
      if (d < minDist) {
        minDist = d;
        nearest = h;
      }
    }

    const distExit = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.exitMat.x, this.exitMat.y);
    if (distExit < 26) {
      if (this.wasd && Phaser.Input.Keyboard.JustDown(this.wasd.E)) {
        this.exitToOverworld();
      }
    } else if (nearest) {
      if (this.wasd && Phaser.Input.Keyboard.JustDown(this.wasd.E)) {
        sound.playClick();
        if (nearest.action) {
          nearest.action();
        } else {
          const ui = this.scene.get('UI') as any;
          if (ui?.showNotification) {
            ui.showNotification(`💬 ${nearest.speaker}: "${nearest.text}"`);
          }
        }
      }
    }
  }

  public exitToOverworld(): void {
    if (this.isExiting) return;
    this.isExiting = true;
    sound.playClick();
    document.getElementById('interior-dom-overlay')?.remove();

    this.cameras.main.fadeOut(220, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop('InteriorScene');
      this.scene.wake('World');
      const worldScene = this.scene.get('World') as any;
      if (worldScene?.player) {
        worldScene.player.setPosition(this.initData.returnX, this.initData.returnY);
      }
      if (worldScene?.labelLayer) {
        worldScene.labelLayer.style.display = 'block';
      }
    });
  }

  private getRoomTitle(bId: string): string {
    switch (bId) {
      case 'bootswerft_drakkar':
        return 'Fjord-Bootswerft & Klinkerschmiede';
      case 'heiligtum_odin':
        return 'Heiligtum der Asen (Götterhain & Blót-Altar)';
      case 'handelskontor_hedeby':
        return 'Handelskontor von Hedeby (Hacksilber-Waage)';
      case 'langhaus_jarl':
      default:
        return 'Methalle des Jarls (Sippen-Langhaus)';
    }
  }
}
