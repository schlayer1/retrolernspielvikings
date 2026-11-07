/**
 * MusicManager.ts — Die Wikinger (ca. 780 – 1066 n. Chr.)
 * Dynamischer BGM-Manager mit MP3-Wiedergabe & 16-Bit WebAudio Chiptune Fallback.
 */

const CHAPTER_TRACK_MAP: Record<number, string> = {
  1: 'bgm_fjord_dawn',
  2: 'bgm_blot_ritual',
  3: 'bgm_shipwright_beat',
  4: 'bgm_sea_crossing',
  5: 'bgm_hedeby_market',
  6: 'bgm_paris_siege',
  7: 'bgm_danelaw_accord',
  8: 'bgm_jelling_runes',
  9: 'bgm_althing_peace',
  10: 'bgm_greenland_fjords',
  11: 'bgm_vinland_discovery',
  12: 'bgm_nordic_legacy',
};

export class MusicManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentTrackId: string | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.3;
  private fallbackCtx: AudioContext | null = null;
  private fallbackInterval: number | null = null;

  constructor() {
    const saved = localStorage.getItem('viking_music_muted');
    if (saved === 'true') {
      this.isMuted = true;
    }
  }

  public playChapterMusic(trackOrChapter: string | number | any): void {
    let trackId = 'bgm_fjord_dawn';
    if (typeof trackOrChapter === 'number') {
      trackId = CHAPTER_TRACK_MAP[trackOrChapter] || 'bgm_fjord_dawn';
    } else if (typeof trackOrChapter === 'string') {
      trackId = CHAPTER_TRACK_MAP[Number(trackOrChapter)] || trackOrChapter || 'bgm_fjord_dawn';
    } else if (trackOrChapter && typeof trackOrChapter === 'object') {
      if (trackOrChapter.music?.trackId) trackId = trackOrChapter.music.trackId;
      else if (trackOrChapter.trackId) trackId = trackOrChapter.trackId;
      else if (trackOrChapter.id) trackId = CHAPTER_TRACK_MAP[trackOrChapter.id] || 'bgm_fjord_dawn';
    }

    if (this.currentTrackId === trackId && (this.currentAudio || this.fallbackInterval)) return;
    this.currentTrackId = trackId;

    if (this.isMuted) return;

    this.stop();

    const audioPath = `/assets/audio/${trackId}.mp3`;
    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = this.volume;

    audio
      .play()
      .then(() => {
        this.currentAudio = audio;
      })
      .catch(() => {
        this.startWebAudioFallback(trackId);
      });
  }

  private startWebAudioFallback(trackId: string): void {
    if (this.fallbackInterval) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.fallbackCtx = new AudioCtx();

      let step = 0;
      const notes = [220, 261.63, 293.66, 329.63, 392.0, 440];

      this.fallbackInterval = window.setInterval(() => {
        if (!this.fallbackCtx || this.isMuted) return;
        if (this.fallbackCtx.state === 'suspended') {
          this.fallbackCtx.resume();
        }
        const osc = this.fallbackCtx.createOscillator();
        const gain = this.fallbackCtx.createGain();
        osc.type = 'triangle';
        const freq = notes[step % notes.length];
        osc.frequency.setValueAtTime(freq, this.fallbackCtx.currentTime);

        gain.gain.setValueAtTime(0.04, this.fallbackCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.fallbackCtx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.fallbackCtx.destination);

        osc.start();
        osc.stop(this.fallbackCtx.currentTime + 0.36);
        step++;
      }, 380);
    } catch {
      // Audio fallback quiet
    }
  }

  public stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
    if (this.fallbackCtx) {
      this.fallbackCtx.close().catch(() => {});
      this.fallbackCtx = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('viking_music_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stop();
    } else if (this.currentTrackId) {
      this.playChapterMusic(this.currentTrackId);
    }
    return !this.isMuted;
  }

  public get isPlaying(): boolean {
    return !this.isMuted && (this.currentAudio !== null || this.fallbackInterval !== null);
  }

  public get muted(): boolean {
    return this.isMuted;
  }
}

export const music = new MusicManager();
