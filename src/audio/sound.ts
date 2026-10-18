class SoundSystem {
  private ctx: AudioContext | null = null;
  public muted = false;
  public bgmMuted = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmVolume = 0.28;
  private currentChapter = 1;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('vikings_bgm_muted');
      if (savedMute !== null) this.bgmMuted = savedMute === 'true';
      const savedVol = localStorage.getItem('vikings_bgm_vol');
      if (savedVol !== null) {
        const v = parseFloat(savedVol);
        if (!isNaN(v)) this.bgmVolume = Math.max(0, Math.min(1, v));
      }
    }
  }

  private getContext(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getVolume(): number {
    return this.bgmVolume;
  }

  public setVolume(val: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (typeof window !== 'undefined') {
      localStorage.setItem('vikings_bgm_vol', String(this.bgmVolume));
    }
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmMuted ? 0 : this.bgmVolume;
    }
  }

  public getChapterTrackInfo(chapter = 1): { path: string; title: string; subtitle: string } {
    const map: Record<number, { path: string; title: string; subtitle: string }> = {
      1: {
        path: '/assets/audio/bgm/bgm_warmth.mp3',
        title: 'Der Hof am Fjord',
        subtitle: 'Fjordwind, Weidetiere & Schlüsselgewalt (ca. 780 n. Chr.)',
      },
      2: {
        path: '/assets/audio/bgm/bgm_patterns.mp3',
        title: 'Die Hallen der Götter',
        subtitle: 'Blót-Feuer, Futhark-Runen & Walhall (ca. 785 n. Chr.)',
      },
      3: {
        path: '/assets/audio/bgm/bgm_heart.mp3',
        title: 'Klinkerbau am Fjordstrand',
        subtitle: 'Der Hauch des Ozeans & Langschiffbau (ca. 790 n. Chr.)',
      },
      4: {
        path: '/assets/audio/bgm/bgm_mist.mp3',
        title: 'Der Schock von Lindisfarne',
        subtitle: 'Klostergesang im Nordseenebel (793 n. Chr.)',
      },
      5: {
        path: '/assets/audio/bgm/bgm_oracle.mp3',
        title: 'Die Handelswege der Waräger',
        subtitle: 'Über die Flüsse nach Kiew & Byzanz (ca. 860 n. Chr.)',
      },
      6: {
        path: '/assets/audio/bgm/bgm_desert_canyon.mp3',
        title: 'Der Belagerungsring um Paris',
        subtitle: 'Waffenruhe an der Seine & Danegeld (885–886 n. Chr.)',
      },
      7: {
        path: '/assets/audio/bgm/bgm_warmth.mp3',
        title: 'Das Gesetz von Jorvik',
        subtitle: 'Das Danelag, Markt & angelsächsische Eintracht (ca. 870–900 n. Chr.)',
      },
      8: {
        path: '/assets/audio/bgm/bgm_oracle.mp3',
        title: 'Die Monumente von Jelling',
        subtitle: 'Harald Blauzahns Taufe & Reichseinigung (ca. 965 n. Chr.)',
      },
      9: {
        path: '/assets/audio/bgm/bgm_patterns.mp3',
        title: 'Der Felsen von Þingvellir',
        subtitle: 'Das Althing am Lögberg & freies Recht (ca. 930–990 n. Chr.)',
      },
      10: {
        path: '/assets/audio/bgm/bgm_mist.mp3',
        title: 'Kurs auf das Grüne Land',
        subtitle: 'Polarsturm, Sonnenstein & Eriksfjord (ca. 982 n. Chr.)',
      },
      11: {
        path: '/assets/audio/bgm/bgm_heart.mp3',
        title: 'Die Küsten von Vinland',
        subtitle: 'Leif Eriksson & L’Anse aux Meadows (ca. 1000 n. Chr.)',
      },
      12: {
        path: '/assets/audio/bgm/bgm_desert_epic.mp3',
        title: 'Der Friede von Stamford Bridge',
        subtitle: 'Olav Kyrre & das Ende der Ära (1066 n. Chr.)',
      },
    };
    return map[chapter] || map[1];
  }

  public playChapterBGM(chapter = 1): void {
    this.currentChapter = chapter;
    const track = this.getChapterTrackInfo(chapter);

    if (this.bgmAudio && this.bgmAudio.src.endsWith(track.path)) {
      if (!this.bgmMuted && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {});
      }
      return;
    }

    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.src = '';
      this.bgmAudio = null;
    }

    try {
      const audio = new Audio(track.path);
      audio.loop = true;
      audio.volume = this.bgmMuted ? 0 : this.bgmVolume;
      this.bgmAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play blocked until user interaction
        });
      }
    } catch {
      // Audio loading failure fallback
    }
  }

  public toggleBGMMute(): boolean {
    this.bgmMuted = !this.bgmMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('vikings_bgm_muted', String(this.bgmMuted));
    }
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmMuted ? 0 : this.bgmVolume;
      if (!this.bgmMuted && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {});
      }
    }
    return this.bgmMuted;
  }

  // ============================================================
  // WEBAUDIO 16-BIT RETRO SOUNDSYNTHESIZER
  // ============================================================
  private playTone(
    freq: number,
    type: OscillatorType,
    duration: number,
    gainVal = 0.15,
    freqSlide?: number
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (freqSlide) {
        osc.frequency.exponentialRampToValueAtTime(freqSlide, ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio error fallback
    }
  }

  public playStep(): void {
    this.playTone(180, 'triangle', 0.04, 0.04, 90);
  }

  public playSelect(): void {
    this.playTone(480, 'square', 0.06, 0.08, 640);
  }

  public playOpenModal(): void {
    this.playTone(330, 'sine', 0.08, 0.1, 550);
  }

  public playCloseModal(): void {
    this.playTone(440, 'sine', 0.07, 0.08, 220);
  }

  public playQuizCorrect(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'sine', 0.14, 0.12), idx * 75);
    });
  }

  public playQuizWrong(): void {
    this.playTone(220, 'sawtooth', 0.18, 0.14, 130);
  }

  public playRelicFound(): void {
    [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.22, 0.15), idx * 60);
    });
  }

  public playCraftSuccess(): void {
    this.playTone(392, 'square', 0.08, 0.1, 587.33);
    setTimeout(() => this.playTone(587.33, 'square', 0.12, 0.12, 880), 80);
  }

  public playChapterComplete(): void {
    [440, 554.37, 659.25, 880].forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.25, 0.15), idx * 100);
    });
  }
}

export const sound = new SoundSystem();
