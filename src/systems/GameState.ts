import { VIKING_BUILDINGS, VIKING_ITEMS, VIKING_RECIPES, VikingItemId } from '../data/items';
import { PlayerGender, PlayerRole, SaveData, SaveManager } from './SaveManager';
import { LEXICON_ENTRIES } from '../data/lexicon';

export interface RoleDefinition {
  id: PlayerRole;
  name: string;
  tribalTitle: string;
  description: string;
  bonusText: string;
  icon: string;
}

export const VIKING_ROLES: RoleDefinition[] = [
  {
    id: 'hofherr',
    name: 'Hofherr / Hofherrin (Bonde)',
    tribalTitle: 'Hüter der Schlüsselgewalt',
    description:
      'Du leitest den Fjordhof mit Umsicht, bewirtschaftest die Gerstenäcker und sicherst die Vorräte für den Winter.',
    bonusText: '+1 Bonus-Ertrag bei Gerste, Schafmilch, Bauholz und Vorräten',
    icon: '/assets/icons/schluesselgewalt.png',
  },
  {
    id: 'bootsbauer',
    name: 'Bootsbauer / Schiffsführer (Styresmann)',
    tribalTitle: 'Meister der Klinkerbaukunst',
    description:
      'Du kennst die Elastizität der Eichenplanken, siedest feinsten Schiffsteer und führst die Knarr über die Meere.',
    bonusText: '+1 Bonus-Ertrag bei Klinkernägeln, Schiffsteer, Raseneisenerz und Holz',
    icon: '/assets/icons/drakkar.png',
  },
  {
    id: 'skalde',
    name: 'Händler & Skalde (Farman)',
    tribalTitle: 'Wanderer der Handelswege',
    description:
      'Auf den Flüssen nach Byzanz und im Danelag verhandelst du klug mit Silberdirhams und kennst die Runen der Götter.',
    bonusText: '+1 Bonus-Ertrag bei Silberdirhams, Bernstein, Runenamuletten und Tuch',
    icon: '/assets/icons/waraeger.png',
  },
];

type Listener = () => void;

export class GameState {
  public chapter = 1;
  public maxUnlockedChapter = 1;
  public completedChapters = new Set<number>();
  public inventory: Partial<Record<VikingItemId, number>> = {};
  public craftedOnce = new Set<VikingItemId>();
  public builtBuildings = new Set<string>();
  public quizPerfect = new Set<number>();
  public discoveredRelics = new Set<string>();
  public lexiconRead = new Set<string>();
  public unlockedLexicon = new Set<string>();
  public playerX = 35 * 16;
  public playerY = 32 * 16;
  public questCompleted = false;
  public gender: PlayerGender = 'female';
  public role: PlayerRole = 'hofherr';
  public playerName = 'Astrid';
  public playTimeSeconds = 0;
  public walkedDistanceMeters = 0;

  // Chapter 4-point gating criteria tracking (for 12 chapters)
  // [0: Mentor gesprochen, 1: Ressource/Handwerk beschafft, 2: Siedlungsbau/Station errichtet, 3: Quiz bestanden]
  public chapterObjectives: Record<number, boolean[]> = {
    1: [false, false, false, false],
    2: [false, false, false, false],
    3: [false, false, false, false],
    4: [false, false, false, false],
    5: [false, false, false, false],
    6: [false, false, false, false],
    7: [false, false, false, false],
    8: [false, false, false, false],
    9: [false, false, false, false],
    10: [false, false, false, false],
    11: [false, false, false, false],
    12: [false, false, false, false],
  };

  private listeners: Listener[] = [];

  constructor() {
    this.initDefaultInventory();
    this.checkLexiconUnlocks(false);
  }

  public checkLexiconUnlocks(notify = true): string[] {
    const newlyUnlocked: string[] = [];
    for (const e of LEXICON_ENTRIES) {
      if (this.unlockedLexicon.has(e.id)) continue;
      let shouldUnlock = false;
      if (e.minChapter <= this.chapter) shouldUnlock = true;
      if (e.unlockRelicId && this.discoveredRelics.has(e.unlockRelicId)) shouldUnlock = true;
      if (e.unlockCraftId && this.craftedOnce.has(e.unlockCraftId as any)) shouldUnlock = true;
      if (e.unlockBuildingId && this.builtBuildings.has(e.unlockBuildingId)) shouldUnlock = true;

      if (shouldUnlock) {
        this.unlockedLexicon.add(e.id);
        newlyUnlocked.push(e.id);
        if (notify && typeof window !== 'undefined' && (window as any).__VIK_UI__) {
          (window as any).__VIK_UI__.showToast(`📖 Neu im Lexikon: ${e.term}`, 'gold');
        }
      }
    }
    return newlyUnlocked;
  }

  private initDefaultInventory(): void {
    this.inventory = {
      gerste_roggen: 5,
      schafmilch: 3,
      bauholz: 4,
      kiefernharz: 3,
      raseneisenerz: 2,
    };
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  public notify(): void {
    for (const l of this.listeners) l();
  }

  public setObjective(ch: number, index: number, value: boolean): void {
    if (!this.chapterObjectives[ch]) {
      this.chapterObjectives[ch] = [false, false, false, false];
    }
    this.chapterObjectives[ch][index] = value;

    // Check if all 4 are completed
    const allDone = this.chapterObjectives[ch].every(Boolean);
    if (allDone) {
      this.completedChapters.add(ch);
      if (ch < 12 && this.maxUnlockedChapter <= ch) {
        this.maxUnlockedChapter = ch + 1;
      }
    }
    this.notify();
    this.autoSave();
  }

  public isChapterFullyComplete(ch: number): boolean {
    const objs = this.chapterObjectives[ch];
    return !!objs && objs.every(Boolean);
  }

  public addItem(item: VikingItemId, count = 1): void {
    // Apply role bonuses
    let bonus = 0;
    if (this.role === 'hofherr' && ['gerste_roggen', 'schafmilch', 'bauholz'].includes(item)) {
      bonus = 1;
    } else if (this.role === 'bootsbauer' && ['klinkernagel', 'schiffsteer', 'raseneisenerz'].includes(item)) {
      bonus = 1;
    } else if (this.role === 'skalde' && ['silber_dirham', 'bernstein_perle', 'runen_amulett'].includes(item)) {
      bonus = 1;
    }

    const cur = this.inventory[item] || 0;
    this.inventory[item] = cur + count + bonus;
    this.checkLexiconUnlocks(true);
    this.notify();
    this.autoSave();
  }

  public removeItem(item: VikingItemId, count = 1): boolean {
    const cur = this.inventory[item] || 0;
    if (cur < count) return false;
    this.inventory[item] = cur - count;
    this.notify();
    this.autoSave();
    return true;
  }

  public hasItem(item: VikingItemId, count = 1): boolean {
    return (this.inventory[item] || 0) >= count;
  }

  public addWalkedDistance(distPx: number): void {
    // 16 px = 1 meter in retro scale
    this.walkedDistanceMeters += distPx / 16;
  }

  public getChronistPoints(): number {
    let pts = 0;
    pts += this.completedChapters.size * 150;
    pts += this.quizPerfect.size * 50;
    pts += this.discoveredRelics.size * 100;
    pts += this.unlockedLexicon.size * 25;
    pts += this.builtBuildings.size * 75;
    pts += this.craftedOnce.size * 30;
    return pts;
  }

  public getRankTitle(): string {
    const pts = this.getChronistPoints();
    if (pts >= 2500) return 'Großkönig & Allthing-Sprecher (S-Rang)';
    if (pts >= 1800) return 'Jarl des Nordens (Gold-Rang)';
    if (pts >= 1000) return 'Freier Karl & Weitfahrer (Silber-Rang)';
    if (pts >= 400) return 'Fjordbauer & Bootszimmermann (Bronze-Rang)';
    return 'Hofgeselle & Fjordlehrling';
  }

  // ============================================================
  // HEFTER-CODE: Deterministischer Speicherstand für das Geschichtsheft
  // Format: VIK-K04-RA-015-03
  // ============================================================
  public generateHefterCode(): string {
    const chStr = `K${String(this.chapter).padStart(2, '0')}`;
    const initials = (this.playerName.slice(0, 2) || 'AS').toUpperCase();
    const pts = String(Math.floor(this.getChronistPoints() / 10)).padStart(3, '0');
    const relics = String(this.discoveredRelics.size).padStart(2, '0');
    return `VIK-${chStr}-${initials}-${pts}-${relics}`;
  }

  public loadFromHefterCode(code: string): boolean {
    const trimmed = code.trim().toUpperCase();
    const match = trimmed.match(/^VIK-K(\d{2})-([A-Z]{2})-(\d{3})-(\d{2})$/);
    if (!match) return false;

    const targetCh = parseInt(match[1], 10);
    if (targetCh >= 1 && targetCh <= 12) {
      this.chapter = targetCh;
      if (this.maxUnlockedChapter < targetCh) {
        this.maxUnlockedChapter = targetCh;
      }
      for (let c = 1; c < targetCh; c++) {
        this.completedChapters.add(c);
        this.chapterObjectives[c] = [true, true, true, true];
      }
      this.checkLexiconUnlocks(false);
      this.notify();
      this.autoSave();
      return true;
    }
    return false;
  }

  public autoSave(): void {
    const data: SaveData = {
      chapter: this.chapter,
      maxUnlockedChapter: this.maxUnlockedChapter,
      completedChapters: Array.from(this.completedChapters),
      inventory: this.inventory,
      craftedOnce: Array.from(this.craftedOnce),
      builtBuildings: Array.from(this.builtBuildings),
      playerX: this.playerX,
      playerY: this.playerY,
      quizPerfect: Array.from(this.quizPerfect),
      gender: this.gender,
      role: this.role,
      discoveredRelics: Array.from(this.discoveredRelics),
      lexiconRead: Array.from(this.lexiconRead),
      unlockedLexicon: Array.from(this.unlockedLexicon),
      playerName: this.playerName,
      playTimeSeconds: this.playTimeSeconds,
      walkedDistanceMeters: Math.floor(this.walkedDistanceMeters),
    };
    SaveManager.save(data);
  }

  public loadSavedState(): boolean {
    const data = SaveManager.load();
    if (!data) return false;

    this.chapter = data.chapter || 1;
    this.maxUnlockedChapter = data.maxUnlockedChapter || 1;
    this.completedChapters = new Set(data.completedChapters || []);
    this.inventory = data.inventory || {};
    this.craftedOnce = new Set(data.craftedOnce || []);
    this.builtBuildings = new Set(data.builtBuildings || []);
    this.playerX = data.playerX || 35 * 16;
    this.playerY = data.playerY || 32 * 16;
    this.quizPerfect = new Set(data.quizPerfect || []);
    this.gender = data.gender || 'female';
    this.role = data.role || 'hofherr';
    this.discoveredRelics = new Set(data.discoveredRelics || []);
    this.lexiconRead = new Set(data.lexiconRead || []);
    this.unlockedLexicon = new Set(data.unlockedLexicon || []);
    this.playerName = data.playerName || (this.gender === 'female' ? 'Astrid' : 'Ragnar');
    this.playTimeSeconds = data.playTimeSeconds || 0;
    this.walkedDistanceMeters = data.walkedDistanceMeters || 0;

    // Restore objectives
    for (let c = 1; c <= 12; c++) {
      if (this.completedChapters.has(c)) {
        this.chapterObjectives[c] = [true, true, true, true];
      }
    }
    this.checkLexiconUnlocks(false);

    this.notify();
    return true;
  }
}

export const gameState = new GameState();

