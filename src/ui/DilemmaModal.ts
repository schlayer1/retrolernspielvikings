/**
 * Dilemma- & Thingsentscheidungs-Modal (DOM-Overlay)
 */

import { DilemmaDef, DilemmaOption } from '../data/dilemmas';

export class DilemmaModal {
  private el: HTMLElement;
  private currentDilemma: DilemmaDef | null = null;
  private onChosenCallback: ((opt: DilemmaOption) => void) | null = null;

  constructor() {
    this.el = document.createElement('div');
    this.el.id = 'dilemma-modal';
    this.el.className = 'dilemma-overlay';
    this.el.style.display = 'none';
    document.body.appendChild(this.el);
    this.injectStyles();
  }

  public open(dilemma: DilemmaDef, onChosen: (opt: DilemmaOption) => void): void {
    this.currentDilemma = dilemma;
    this.onChosenCallback = onChosen;
    this.render();
    this.el.style.display = 'flex';
  }

  public close(): void {
    this.el.style.display = 'none';
    this.currentDilemma = null;
  }

  private render(): void {
    if (!this.currentDilemma) return;
    const d = this.currentDilemma;

    this.el.innerHTML = `
      <div class="dilemma-card">
        <div class="dilemma-header">
          <span class="dilemma-badge">🛡️ ${d.councilTitle}</span>
          <span class="dilemma-speaker">Leitung: <strong>${d.mentorSpeaker}</strong></span>
        </div>
        <h2 class="dilemma-title">${d.conflictTitle}</h2>
        <div class="dilemma-body">
          <p class="dilemma-text">${d.conflictText}</p>
        </div>
        <div class="dilemma-prompt">⚖️ Dein Spruch am Lögberg: Wie entscheidest du auf dem Thing?</div>
        <div class="dilemma-options">
          ${d.options.map((opt, i) => `
            <button class="dilemma-opt-btn" data-index="${i}">
              <div class="opt-head">
                <span class="opt-num">Option ${i + 1}</span>
                <strong class="opt-title">${opt.title}</strong>
              </div>
              <p class="opt-arg">„${opt.argumentText}“</p>
              <div class="opt-rewards">
                🎁 <strong>Ertrag für Hof & Sippe:</strong> 
                ${Object.entries(opt.rewards).map(([k, v]) => `+${v} ${k}`).join(', ')}
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.el.querySelectorAll('.dilemma-opt-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).dataset.index || '0', 10);
        const opt = d.options[idx];
        this.selectOption(opt);
      });
    });
  }

  private selectOption(opt: DilemmaOption): void {
    this.el.innerHTML = `
      <div class="dilemma-card dilemma-feedback-card">
        <div class="dilemma-badge">⚖️ Thingsbeschluss verkündet!</div>
        <h2 class="dilemma-title">${opt.title}</h2>
        <div class="feedback-box">
          <p class="feedback-text">📌 ${opt.feedbackText}</p>
        </div>
        <div class="rewards-summary">
          <strong>Erhaltene Güter:</strong>
          <ul>
            ${Object.entries(opt.rewards).map(([k, v]) => `<li>+${v} ${k}</li>`).join('')}
          </ul>
        </div>
        <button class="btn-primary" id="dilemma-close-btn" style="margin-top:16px;padding:8px 20px;cursor:pointer;">
          Spruch im Thingbuch verzeichnen & fortfahren
        </button>
      </div>
    `;

    this.el.querySelector('#dilemma-close-btn')?.addEventListener('click', () => {
      this.close();
      if (this.onChosenCallback) this.onChosenCallback(opt);
    });
  }

  private injectStyles(): void {
    if (document.getElementById('dilemma-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'dilemma-modal-styles';
    style.textContent = `
      .dilemma-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.78);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 35;
        padding: 16px;
      }
      .dilemma-card {
        background: #fdf6e3;
        border: 3px solid #0369a1;
        border-radius: 12px;
        max-width: 620px;
        width: 100%;
        padding: 20px 24px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
        color: #1f2937;
        font-family: system-ui, sans-serif;
      }
      .dilemma-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        border-bottom: 1.5px solid #e2e8f0;
        padding-bottom: 6px;
      }
      .dilemma-badge {
        background: #e0f2fe;
        color: #0369a1;
        border: 1px solid #38bdf8;
        padding: 3px 8px;
        border-radius: 99px;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
      }
      .dilemma-speaker {
        font-size: 12px;
        color: #475569;
      }
      .dilemma-title {
        font-size: 16px;
        font-weight: 800;
        color: #0c4a6e;
        margin: 0 0 10px 0;
      }
      .dilemma-text {
        font-size: 13.5px;
        line-height: 1.5;
        color: #334155;
        margin-bottom: 14px;
      }
      .dilemma-prompt {
        font-weight: 800;
        font-size: 13px;
        color: #0369a1;
        margin-bottom: 10px;
      }
      .dilemma-options {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .dilemma-opt-btn {
        background: #ffffff;
        border: 2px solid #0284c7;
        border-radius: 8px;
        padding: 10px 14px;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
      }
      .dilemma-opt-btn:hover {
        background: #f0f9ff;
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(2, 132, 199, 0.25);
      }
      .opt-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }
      .opt-num {
        background: #0284c7;
        color: #fff;
        font-size: 10px;
        font-weight: 800;
        padding: 1px 6px;
        border-radius: 4px;
      }
      .opt-title {
        color: #0c4a6e;
        font-size: 13.5px;
      }
      .opt-arg {
        font-size: 12.5px;
        font-style: italic;
        color: #475569;
        margin: 2px 0 6px 0;
      }
      .opt-rewards {
        font-size: 11.5px;
        color: #15803d;
      }
      .feedback-box {
        background: #f0fdf4;
        border: 1px solid #86efac;
        padding: 10px 14px;
        border-radius: 6px;
        margin: 12px 0;
      }
      .feedback-text {
        color: #166534;
        font-size: 13px;
        line-height: 1.45;
        margin: 0;
      }
      .rewards-summary {
        font-size: 12.5px;
        color: #15803d;
      }
      .rewards-summary ul {
        margin: 4px 0 0 18px;
        padding: 0;
      }
    `;
    document.head.appendChild(style);
  }
}
