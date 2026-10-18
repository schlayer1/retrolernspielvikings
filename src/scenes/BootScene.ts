import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // 1. World Atlases & Ground Tilesets
    this.load.atlas('world_atlas', '/assets/world/world_atlas.png', '/assets/world/world_atlas.json');
    this.load.image('ground_a2', '/assets/world/ground_a2.png');
    this.load.image('overworld', '/assets/gfx/Overworld.png');
    this.load.image('farm', '/assets/gfx/farm.png');
    this.load.image('objects', '/assets/gfx/objects.png');
    this.load.image('cow', '/assets/gfx/cow.png');
    this.load.image('goat', '/assets/gfx/goat.png');

    // 2. Player Characters (16x32 Spritesheets)
    this.load.spritesheet('player_ragnar', '/assets/gfx/npcs/player_ragnar.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet('player_astrid', '/assets/gfx/npcs/player_astrid.png', {
      frameWidth: 16,
      frameHeight: 32,
    });

    // 3. Mentors & Historical Figures (12 Chapters)
    const mentorSheets = [
      'npc_astrid_elder',
      'npc_thorgest_gode',
      'npc_halvdan_shipwright',
      'npc_cuthbert_monk',
      'npc_rorik_varaeger',
      'npc_graf_odo',
      'npc_guthrum_jarl',
      'npc_harald_blauzahn',
      'npc_thorgeir_speaker',
      'npc_erik_der_rote',
      'npc_leif_eriksson',
      'npc_olav_kyrre',
    ];
    mentorSheets.forEach((id) => {
      this.load.spritesheet(id, `/assets/gfx/npcs/${id}.png`, {
        frameWidth: 16,
        frameHeight: 32,
      });
    });

    // 4. Props & Structures
    const propKeys = [
      'viking_langhaus_large',
      'viking_longhouse_thatched',
      'viking_cottage_gable',
      'viking_round_hut',
      'viking_fortress_gate',
      'viking_watchtower_wood',
      'viking_shed_workshop',
      'viking_village_well',
      'viking_haystack_large',
      'viking_wood_pile_stacked',
      'viking_chopping_block',
      'viking_pelt_bear_spread',
      'viking_pelt_white_wolf',
      'viking_runestone_futhark_red',
      'viking_runestone_knotwork',
      'viking_runestone_classic',
      'viking_god_totem_odin',
      'viking_god_totem_wolf',
      'viking_blot_fire_altar',
      'viking_dragon_post_carved',
      'viking_banner_raven_red',
      'viking_banner_gryphon_blue',
      'viking_drakkar_full',
      'viking_knarr_trading',
      'viking_drakkar_red_sail',
      'viking_ship_blue_sail',
      'viking_wooden_dock',
      'viking_camp_tent',
      'viking_iron_anchor',
      'viking_stacked_cargo_barrels',
      'viking_fishnet_drying',
      'viking_weapon_rack_axes',
      'viking_weapon_rack_spears',
      'viking_shield_stand_rune',
      'viking_armor_stand_chainmail',
      'viking_spit_roast_campfire',
      'viking_treasure_chest_danegeld',
      'viking_bone_trophy_totem',
      'monastery_scriptorium_desk',
      'monastery_golden_altar',
      'monastery_stone_arch',
      'paris_fortress_gate',
      'paris_stone_tower',
      'paris_stone_wall',
      'siege_catapult_wood',
      'battlefield_wooden_stakes',
      'bridge_timber_crossing',
      // Fauna
      'fauna_wisent_auerochse',
      'fauna_wisent_front',
      'fauna_sheep_flock',
      'fauna_lambs_group',
      'fauna_sheep_black',
      'fauna_sheep_white',
      'fauna_lamb_white',
      'fauna_lamb_brown',
      'fauna_goat_ram',
      'fauna_horse_brown',
      'fauna_horse_saddled',
      'fauna_horse_white',
    ];
    propKeys.forEach((k) => {
      this.load.image(k, `/assets/props/${k}.png`);
    });

    // 5. Invariant Rule (Section 2.6): Load all relics & icons both with 'icon_' prefix and without
    const relicAndIconKeys = [
      'relic_oseberg_schiff',
      'relic_lindisfarne_gospels',
      'relic_jelling_stein',
      'relic_sonnenstein',
      'relic_vinland_fibel',
      'relic_marker_glow',
      'althing',
      'asen_vanen',
      'karl_bauer',
      'berserker',
      'blot',
      'danegeld',
      'danelag',
      'drakkar',
      'futhark',
      'gjermundbu_helm',
      'harald_blauzahn',
      'jarl',
      'jelling_steine',
      'jorvik',
      'klinkerbauweise',
      'knarr',
      'landnamabok',
      'langhaus',
      'leif_eriksson',
      'portage',
      'schluesselgewalt',
      'skraelinger',
      'sonnenstein',
      'stamford_bridge',
      'thing',
      'thraell',
      'waraeger',
      'schiffsteer',
      'klinkernagel',
      'silber_dirham',
      'wundsalbe',
      'taufkerze',
      'holz',
      'wasser',
      'getreide',
      'eisenerz',
      'silbererz',
      'bernstein',
      'wolle',
      'samen',
      'schmiede_hammer',
      'sichel',
      'hacke',
      'ziegenkaese',
      'panis_brot',
      'garum_fisch',
    ];

    relicAndIconKeys.forEach((key) => {
      this.load.image(`icon_${key}`, `/assets/icons/${key}.png`);
      this.load.image(key, `/assets/icons/${key}.png`);
    });
  }

  create() {
    this.createWalkAnimations('player_ragnar');
    this.createWalkAnimations('player_astrid');

    const mentorSheets = [
      'npc_astrid_elder',
      'npc_thorgest_gode',
      'npc_halvdan_shipwright',
      'npc_cuthbert_monk',
      'npc_rorik_varaeger',
      'npc_graf_odo',
      'npc_guthrum_jarl',
      'npc_harald_blauzahn',
      'npc_thorgeir_speaker',
      'npc_erik_der_rote',
      'npc_leif_eriksson',
      'npc_olav_kyrre',
    ];
    mentorSheets.forEach((id) => this.createWalkAnimations(id));

    // Transition to World and UI
    this.scene.start('World');
    this.scene.start('UI');
  }

  private createWalkAnimations(key: string): void {
    // LPC Spritesheet Offset Standard (272x256 px with 16x32 frames -> 17 columns per row):
    // Row 0: Down (frames 0..3, idle: 0)
    // Row 1: Right (frames 17..20, idle: 17)
    // Row 2: Up (frames 34..37, idle: 34)
    // Row 3: Left (frames 51..54, idle: 51)
    if (!this.anims.exists(`${key}_walk_down`)) {
      this.anims.create({
        key: `${key}_walk_down`,
        frames: this.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!this.anims.exists(`${key}_walk_right`)) {
      this.anims.create({
        key: `${key}_walk_right`,
        frames: this.anims.generateFrameNumbers(key, { start: 17, end: 20 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!this.anims.exists(`${key}_walk_up`)) {
      this.anims.create({
        key: `${key}_walk_up`,
        frames: this.anims.generateFrameNumbers(key, { start: 34, end: 37 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!this.anims.exists(`${key}_walk_left`)) {
      this.anims.create({
        key: `${key}_walk_left`,
        frames: this.anims.generateFrameNumbers(key, { start: 51, end: 54 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!this.anims.exists(`${key}_idle_down`)) {
      this.anims.create({
        key: `${key}_idle_down`,
        frames: [{ key, frame: 0 }],
        frameRate: 1,
      });
    }
    if (!this.anims.exists(`${key}_idle_right`)) {
      this.anims.create({
        key: `${key}_idle_right`,
        frames: [{ key, frame: 17 }],
        frameRate: 1,
      });
    }
    if (!this.anims.exists(`${key}_idle_up`)) {
      this.anims.create({
        key: `${key}_idle_up`,
        frames: [{ key, frame: 34 }],
        frameRate: 1,
      });
    }
    if (!this.anims.exists(`${key}_idle_left`)) {
      this.anims.create({
        key: `${key}_idle_left`,
        frames: [{ key, frame: 51 }],
        frameRate: 1,
      });
    }
  }
}
