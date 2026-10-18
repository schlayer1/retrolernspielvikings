import Phaser from 'phaser';

export type AnimalState = 'idle_breathe' | 'graze_eat' | 'wander_tether' | 'player_aware';

interface AnimalEntity {
  sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;
  baseX: number;
  baseY: number;
  wanderRadius: number;
  speed: number;
  baseScale: number;
  state: AnimalState;
  stateTimer: number;
  targetX: number;
  targetY: number;
  facingRight: boolean;
  stepPhase: number;
  activeTween: Phaser.Tweens.Tween | null;
}

interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// Map obstacles to prevent animals from walking through walls, roofs or into deep water
const BUILDING_OBSTACLES: BoundingBox[] = [
  // Great Longhouse
  { minX: 30 * 16, maxX: 44 * 16, minY: 18 * 16, maxY: 28 * 16 },
  // Village huts
  { minX: 20 * 16, maxX: 30 * 16, minY: 22 * 16, maxY: 30 * 16 },
  { minX: 44 * 16, maxX: 54 * 16, minY: 20 * 16, maxY: 28 * 16 },
  // Smithy, Wood piles, Storehouse
  { minX: 42 * 16, maxX: 58 * 16, minY: 30 * 16, maxY: 42 * 16 },
  // Blót Sacred grove & Runestones (protected sacred zone)
  { minX: 58 * 16, maxX: 74 * 16, minY: 20 * 16, maxY: 38 * 16 },
  // Deep Fjord water
  { minX: 0, maxX: 18 * 16, minY: 0, maxY: 40 * 16 },
];

export class WildlifeManager {
  private scene: Phaser.Scene;
  private animals: AnimalEntity[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public init(mapW: number, mapH: number): void {
    // 1. Wisente & Rinder auf den Weiden am Waldsaum (96x96 -> ~33px tall bull)
    this.spawnAnimal(68 * 16, 42 * 16, 'fauna_wisent_auerochse', 24, 11, 0.33);
    this.spawnAnimal(74 * 16, 46 * 16, 'fauna_wisent_front', 22, 10, 0.33);

    // 2. Schafe & Lämmer auf der Fjord-Südweide (48x48 -> ~17px sheep, ~13px lambs)
    this.spawnAnimal(26 * 16, 44 * 16, 'fauna_sheep_black', 18, 14, 0.35);
    this.spawnAnimal(30 * 16, 46 * 16, 'fauna_sheep_white', 18, 13, 0.35);
    this.spawnAnimal(24 * 16, 42 * 16, 'fauna_lamb_white', 14, 15, 0.26);
    this.spawnAnimal(28 * 16, 48 * 16, 'fauna_lamb_brown', 14, 14, 0.26);

    // 3. Weideziegen am felsigen Hang (96x96 -> ~21px waist-high goat)
    this.spawnAnimal(34 * 16, 56 * 16, 'fauna_goat_ram', 18, 14, 0.23);
    this.spawnAnimal(38 * 16, 60 * 16, 'fauna_goat_ram', 20, 15, 0.23);

    // 4. Nordische Pferde auf der Hofkoppel (96x96 -> ~29px horse)
    this.spawnAnimal(20 * 16, 32 * 16, 'fauna_horse_brown', 20, 13, 0.30);
    this.spawnAnimal(22 * 16, 36 * 16, 'fauna_horse_saddled', 18, 12, 0.30);
  }

  private isPointBlocked(x: number, y: number): boolean {
    for (const b of BUILDING_OBSTACLES) {
      if (x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY) {
        return true;
      }
    }
    return false;
  }

  private spawnAnimal(x: number, y: number, texKey: string, radius: number, speed: number, baseScale = 0.3): void {
    try {
      const img = this.scene.add.image(x, y, texKey);
      img.setOrigin(0.5, 0.85);
      img.setScale(baseScale);
      img.setDepth(y);

      const entity: AnimalEntity = {
        sprite: img,
        baseX: x,
        baseY: y,
        wanderRadius: radius,
        speed,
        baseScale,
        state: 'idle_breathe',
        stateTimer: 1000 + Math.random() * 2000,
        targetX: x,
        targetY: y,
        facingRight: Math.random() > 0.5,
        stepPhase: Math.random() * Math.PI * 2,
        activeTween: null,
      };

      this.startBreathing(entity);
      this.animals.push(entity);
    } catch {
      // Ignore
    }
  }

  private startBreathing(a: AnimalEntity): void {
    if (a.activeTween) {
      a.activeTween.stop();
      a.activeTween = null;
    }
    a.activeTween = this.scene.tweens.add({
      targets: a.sprite,
      scaleY: a.baseScale * 1.025,
      duration: 1200 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  public update(time: number, delta: number, playerX: number, playerY: number): void {
    const dt = delta / 1000;

    for (const a of this.animals) {
      const dx = playerX - a.sprite.x;
      const dy = playerY - a.sprite.y;
      const distToPlayer = Math.sqrt(dx * dx + dy * dy);

      // 4-Phasen-Zustandsautomat
      if (distToPlayer < 36 && a.state !== 'player_aware') {
        a.state = 'player_aware';
        a.stateTimer = 2500;
        if (a.activeTween) {
          a.activeTween.stop();
          a.activeTween = null;
        }
        // Turn towards player and raise head
        a.facingRight = dx > 0;
        a.sprite.setScale(a.facingRight ? a.baseScale : -a.baseScale, a.baseScale * 1.03);
        a.sprite.setAngle(dx > 0 ? 3 : -3);
        continue;
      }

      a.stateTimer -= delta;

      switch (a.state) {
        case 'player_aware':
          if (distToPlayer >= 44 || a.stateTimer <= 0) {
            a.state = 'idle_breathe';
            a.stateTimer = 1500 + Math.random() * 2000;
            a.sprite.setAngle(0);
            this.startBreathing(a);
          }
          break;

        case 'idle_breathe':
          if (a.stateTimer <= 0) {
            if (Math.random() < 0.5) {
              // Switch to Graze
              a.state = 'graze_eat';
              a.stateTimer = 2200 + Math.random() * 2000;
              if (a.activeTween) a.activeTween.stop();
              // Graze head tilt
              a.activeTween = this.scene.tweens.add({
                targets: a.sprite,
                angle: a.facingRight ? 4 : -4,
                duration: 400,
                yoyo: true,
                repeat: 3,
                ease: 'Sine.easeInOut',
              });
            } else {
              // Switch to Wander
              a.state = 'wander_tether';
              a.stateTimer = 2000 + Math.random() * 2500;
              if (a.activeTween) {
                a.activeTween.stop();
                a.activeTween = null;
              }
              a.sprite.setAngle(0);

              const ang = Math.random() * Math.PI * 2;
              const r = Math.random() * a.wanderRadius;
              const tx = a.baseX + Math.cos(ang) * r;
              const ty = a.baseY + Math.sin(ang) * r;

              if (!this.isPointBlocked(tx, ty)) {
                a.targetX = tx;
                a.targetY = ty;
                a.facingRight = a.targetX > a.sprite.x;
              }
            }
          }
          break;

        case 'graze_eat':
          if (a.stateTimer <= 0) {
            a.state = 'idle_breathe';
            a.stateTimer = 1500 + Math.random() * 1500;
            a.sprite.setAngle(0);
            this.startBreathing(a);
          }
          break;

        case 'wander_tether':
          const tdx = a.targetX - a.sprite.x;
          const tdy = a.targetY - a.sprite.y;
          const tdist = Math.sqrt(tdx * tdx + tdy * tdy);

          if (tdist > 2 && a.stateTimer > 0) {
            const step = Math.min(tdist, a.speed * dt);
            const moveX = (tdx / tdist) * step;
            const moveY = (tdy / tdist) * step;

            const nextX = a.sprite.x + moveX;
            const nextY = a.sprite.y + moveY;

            if (!this.isPointBlocked(nextX, nextY)) {
              a.sprite.x = nextX;
              a.sprite.y = nextY;
              a.sprite.setDepth(a.sprite.y);

              // Step bobbing
              a.stepPhase += dt * 10;
              const bob = Math.sin(a.stepPhase) * 1.5;
              a.sprite.setScale(
                a.facingRight ? a.baseScale : -a.baseScale,
                a.baseScale + (bob * 0.015)
              );
            } else {
              // Stopped by obstacle
              a.state = 'idle_breathe';
              a.stateTimer = 1200 + Math.random() * 1500;
              this.startBreathing(a);
            }
          } else {
            a.state = 'idle_breathe';
            a.stateTimer = 1200 + Math.random() * 1500;
            a.sprite.setScale(a.facingRight ? a.baseScale : -a.baseScale, a.baseScale);
            this.startBreathing(a);
          }
          break;
      }
    }
  }
}
