import { VikingRelic } from '../data/relics';
import { sound } from '../audio/sound';

export class ArtifactInspectorModal {
  private overlay: HTMLElement | null = null;
  private isBackSide = false;
  private isZoomed = false;

  public open(relic: VikingRelic, onClose?: () => void): void {
    this.isBackSide = false;
    this.isZoomed = false;

    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.id = 'artifact-inspector-modal';
      this.overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(12, 8, 6, 0.88);
        backdrop-filter: blur(6px); z-index: 3500; display: flex;
        align-items: center; justify-content: center; padding: 16px;
        font-family: 'Cinzel', Georgia, system-ui, sans-serif;
      `;
      document.body.appendChild(this.overlay);
    }

    const render = () => {
      if (!this.overlay) return;
      const displayTitle = relic.name || 'Archäologisches Relikt';
      const iconUrl = relic.icon || '/assets/icons/relic_marker_glow.png';
      const dating = relic.year || 'ca. 800–1050 n. Chr.';
      const location = relic.findLocation || 'Skandinavien & Nordatlantik';
      const context = relic.historicalContext || '';
      const significance = relic.significance || '';

      this.overlay.innerHTML = `
        <div style="background: linear-gradient(145deg, #24160e, #140d08); border: 2px solid #d4af37; border-radius: 12px; max-width: 660px; width: 100%; color: #fef3c7; box-shadow: 0 20px 50px rgba(0,0,0,0.85); overflow: hidden;">
          <!-- Top Inspector Bar -->
          <div style="background: linear-gradient(90deg, #3d2314, #1f120a); border-bottom: 1.5px solid #d4af37; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 20px;">🔍</span>
              <div>
                <h3 style="margin: 0; font-size: 16px; color: #fde68a; letter-spacing: 0.5px;">360°-Quelleninspektor</h3>
                <div style="font-size: 11px; color: #cbd5e1; font-family: system-ui, sans-serif;">Archäologische Originalquelle der Wikingerzeit</div>
              </div>
            </div>
            <button id="inspector-close-btn" style="background: transparent; border: 1px solid #78350f; color: #fde68a; font-size: 16px; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;">✕</button>
          </div>

          <!-- Inspector Body -->
          <div style="padding: 20px; display: grid; grid-template-columns: 200px 1fr; gap: 20px; align-items: center;">
            <!-- Interactive Visual Preview -->
            <div style="text-align: center; background: radial-gradient(circle, #3d2314 0%, #170d07 80%); border: 1.5px solid #b45309; border-radius: 10px; padding: 18px; box-shadow: inset 0 0 20px rgba(0,0,0,0.7);">
              <div style="height: 140px; display: flex; align-items: center; justify-content: center; position: relative;">
                <img id="inspector-artifact-img" src="${iconUrl}" alt="${displayTitle}" style="max-height: 110px; max-width: 110px; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.8)); transform: ${this.isBackSide ? 'scaleX(-1)' : 'scaleX(1)'} ${this.isZoomed ? 'scale(1.3)' : 'scale(1)'}; transition: transform 0.4s ease;" />
              </div>
              <div style="margin-top: 10px; display: flex; gap: 6px; justify-content: center;">
                <button id="inspector-rotate-btn" style="background: #451a03; border: 1px solid #d97706; color: #fef08a; font-size: 11px; padding: 5px 9px; border-radius: 4px; cursor: pointer; font-family: system-ui;">🔄 Drehen</button>
                <button id="inspector-zoom-btn" style="background: #451a03; border: 1px solid #d97706; color: #fef08a; font-size: 11px; padding: 5px 9px; border-radius: 4px; cursor: pointer; font-family: system-ui;">🔍 Zoom</button>
              </div>
            </div>

            <!-- Context & Facts -->
            <div style="font-family: system-ui, -apple-system, sans-serif;">
              <h4 style="margin: 0 0 6px 0; font-size: 17px; color: #fbbf24; font-family: 'Cinzel', Georgia, serif;">${displayTitle}</h4>
              <div style="display: flex; gap: 12px; margin-bottom: 12px; font-size: 12px;">
                <span style="background: #3b2011; border: 1px solid #92400e; padding: 2px 8px; border-radius: 4px; color: #fde68a;">⏳ ${dating}</span>
                <span style="background: #3b2011; border: 1px solid #92400e; padding: 2px 8px; border-radius: 4px; color: #cbd5e1;">📍 ${location}</span>
              </div>
              <p style="font-size: 12.5px; line-height: 1.5; color: #e2e8f0; margin: 0 0 10px 0;">${context}</p>
              <div style="background: rgba(180, 83, 9, 0.15); border-left: 3px solid #f59e0b; padding: 8px 10px; font-size: 11.5px; color: #fde68a; line-height: 1.45;">
                <strong>Archäologische Bedeutung:</strong> ${significance}
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div style="background: #190f09; border-top: 1px solid #573016; padding: 12px 18px; display: flex; justify-content: flex-end; gap: 10px;">
            <button id="inspector-done-btn" style="background: linear-gradient(180deg, #d97706, #b45309); border: 1px solid #fef08a; color: #fff; font-weight: bold; font-size: 12px; padding: 7px 18px; border-radius: 5px; cursor: pointer;">Inspektion abschließen [ESC]</button>
          </div>
        </div>
      `;

      this.overlay.querySelector('#inspector-rotate-btn')?.addEventListener('click', () => {
        this.isBackSide = !this.isBackSide;
        sound.playClick();
        render();
      });

      this.overlay.querySelector('#inspector-zoom-btn')?.addEventListener('click', () => {
        this.isZoomed = !this.isZoomed;
        sound.playClick();
        render();
      });

      const handleClose = () => {
        if (this.overlay) {
          this.overlay.style.display = 'none';
        }
        sound.playClick();
        if (onClose) onClose();
      };

      this.overlay.querySelector('#inspector-close-btn')?.addEventListener('click', handleClose);
      this.overlay.querySelector('#inspector-done-btn')?.addEventListener('click', handleClose);
    };

    render();
    this.overlay.style.display = 'flex';
  }
}
