import Phaser from 'phaser';
import { sound } from '../audio/sound';
import { CHAPTERS, HIGHLIGHT_TERMS } from '../data/chapters';
import { VIKING_BUILDINGS, VIKING_ITEMS, VIKING_RECIPES, VikingItemId } from '../data/items';
import { LEXICON_ENTRIES } from '../data/lexicon';
import { VIKING_RELICS, VikingRelic } from '../data/relics';
import { gameState, VIKING_ROLES } from '../systems/GameState';
import { PlayerGender, PlayerRole } from '../systems/SaveManager';
import { TouchControls } from '../ui/TouchControls';
import { PrintSheetManager } from '../ui/PrintSheet';
import { DilemmaModal } from '../ui/DilemmaModal';
import { VIKING_DILEMMAS } from '../data/dilemmas';

export type ModalType =
  | 'none'
  | 'start'
  | 'dialog'
  | 'quiz'
  | 'relic_quiz'
  | 'inventory'
  | 'craft'
  | 'build'
  | 'lexicon'
  | 'timeline'
  | 'certificate'
  | 'pause'
  | 'dilemma';

export class UIScene extends Phaser.Scene {
  public touchControls!: TouchControls;
  private activeModal: ModalType = 'start';
  private dilemmaModal!: DilemmaModal;
  private uiRoot!: HTMLDivElement;
  private hudHeader!: HTMLDivElement;
  private questBox!: HTMLDivElement;
  private modalOverlay!: HTMLDivElement;
  private toastContainer!: HTMLDivElement;

  private lexiconSearch = '';
  private lexiconCategory = 'Alle';
  private lexSelected = 'karl_bauer';

  // Dialog & Quiz state
  private dialogLines: string[] = [];
  private dialogIndex = 0;
  private dialogSpeaker = '';
  private dialogRole = '';
  private dialogPortrait = '';
  private activeRelic: VikingRelic | null = null;

  constructor() {
    super('UI');
  }

  create() {
    (window as any).__VIK_UI__ = this;
    (window as any).__GERM_UI__ = this;
    this.initDOMStructure();
    this.dilemmaModal = new DilemmaModal();
    this.touchControls = new TouchControls((key) => this.handleShortcutKey(key));
    this.registerKeyboardShortcuts();

    gameState.subscribe(() => {
      this.renderHUD();
      this.renderQuestTracker();
    });

    // Playtime counter
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.activeModal !== 'start' && this.activeModal !== 'pause') {
          gameState.playTimeSeconds += 1;
        }
      },
    });

    this.renderHUD();
    this.renderQuestTracker();
    this.openStartScreen();
  }

  public isModalOpen(): boolean {
    return this.activeModal !== 'none';
  }

  private initDOMStructure(): void {
    let root = document.getElementById('ui-layer') as HTMLDivElement | null;
    if (!root) {
      root = document.createElement('div');
      root.id = 'ui-layer';
      document.body.appendChild(root);
    }
    this.uiRoot = root;
    this.uiRoot.innerHTML = '';

    this.hudHeader = document.createElement('div');
    this.hudHeader.className = 'hud-top-bar';

    this.questBox = document.createElement('div');
    this.questBox.className = 'hud-quest-tracker';

    this.modalOverlay = document.createElement('div');
    this.modalOverlay.className = 'modal-backdrop';
    this.modalOverlay.style.display = 'none';

    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';

    this.uiRoot.appendChild(this.hudHeader);
    this.uiRoot.appendChild(this.questBox);
    this.uiRoot.appendChild(this.modalOverlay);
    this.uiRoot.appendChild(this.toastContainer);
  }

  private registerKeyboardShortcuts(): void {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();
      if (key === 'ESCAPE' || key === 'P') {
        if (this.activeModal === 'none') {
          this.openPauseDashboard();
        } else if (this.activeModal !== 'start') {
          this.closeModal();
        }
        return;
      }

      if (this.activeModal !== 'none') return;

      this.handleShortcutKey(key);
    });
  }

  public handleShortcutKey(key: string): void {
    switch (key) {
      case 'I':
        this.openInventory();
        break;
      case 'C':
        this.openCrafting();
        break;
      case 'B':
        this.openBuildingModal();
        break;
      case 'L':
        this.openLexicon();
        break;
      case 'Z':
        this.openTimeline();
        break;
      case 'U':
        this.openCertificate();
        break;
      case 'R':
        this.openDilemma();
        break;
      case 'M':
        const muted = sound.toggleBGMMute();
        this.showToast(muted ? '🔇 Musik stummgeschaltet' : '🎵 Musik eingeschaltet', 'info');
        break;
      case 'P':
        this.openPauseDashboard();
        break;
    }
  }

  public showToast(msg: string, type: 'info' | 'success' | 'warning' = 'info'): void {
    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;
    toast.textContent = msg;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // =========================================================================
  // HUD TOP BAR & QUEST TRACKER
  // =========================================================================
  private renderHUD(): void {
    const chData = CHAPTERS.find((c) => c.id === gameState.chapter) || CHAPTERS[0];
    const roleDef = VIKING_ROLES.find((r) => r.id === gameState.role) || VIKING_ROLES[0];

    this.hudHeader.innerHTML = `
      <div class="hud-left">
        <div class="hud-ch-badge">Kapitel ${gameState.chapter} von 12 &bull; ${chData.year}</div>
        <div class="hud-ch-title">${chData.title.split(': ')[1] || chData.title}</div>
      </div>
      <div class="hud-right">
        <div class="hud-player-tag">
          ${gameState.gender === 'female' ? '👧' : '👦'} ${gameState.playerName} (${roleDef.tribalTitle})
        </div>
        <div class="hud-relics-badge">
          🏆 ${gameState.discoveredRelics.size} / 5 Relikte
        </div>
        <div class="hud-quick-buttons">
          <button class="hud-btn" onclick="window.__VIK_UI__.handleShortcutKey('I')" title="Beutel & Vorräte [I]">🎒 [I]</button>
          <button class="hud-btn" onclick="window.__VIK_UI__.handleShortcutKey('C')" title="Handwerk [C]">🔨 [C]</button>
          <button class="hud-btn" onclick="window.__VIK_UI__.handleShortcutKey('B')" title="Bauten [B]">🏛️ [B]</button>
          <button class="hud-btn" onclick="window.__VIK_UI__.handleShortcutKey('L')" title="Fachlexikon [L]">📖 [L]</button>
          <button class="hud-btn" onclick="window.__VIK_UI__.handleShortcutKey('Z')" title="Zeitstrahl [Z]">⏳ [Z]</button>
          <button class="hud-btn" onclick="window.__VIK_UI__.handleShortcutKey('R')" title="Thing & Dilemma [R]">⚖️ [R]</button>
          <button class="hud-btn" onclick="window.__VIK_UI__.handleShortcutKey('U')" title="Geschichtsdiplom [U]">📜 [U]</button>
          <button class="hud-btn" onclick="window.__VIK_UI__.handleShortcutKey('P')" title="Chronisten-Pause [P]">⚙️ [P]</button>
        </div>
      </div>
    `;
  }

  private renderQuestTracker(): void {
    const chData = CHAPTERS.find((c) => c.id === gameState.chapter) || CHAPTERS[0];
    const objs = gameState.chapterObjectives[gameState.chapter] || [false, false, false, false];
    const completedCount = objs.filter(Boolean).length;
    const isDone = completedCount === 4;

    const world = this.scene.get('World') as any;
    const compassText = world && world.currentCompassText ? world.currentCompassText : '🧭 Kompass aktiv...';

    // Current task description
    let activeTaskText = `Sprich mit ${chData.mentorName.split(' (')[0]} (E).`;
    if (objs[0] && !objs[1]) {
      activeTaskText = `Sammle Rohstoffe am Fjord oder stelle Ausrüstung her (C).`;
    } else if (objs[0] && objs[1] && !objs[2]) {
      activeTaskText = `Errichte das Kapitel-Bauvorhaben am Bauplatz (B).`;
    } else if (objs[0] && objs[1] && objs[2] && !objs[3]) {
      activeTaskText = `Meistere das didaktische Kapitel-Quiz bei ${chData.mentorName.split(' (')[0]} (E).`;
    } else if (isDone) {
      activeTaskText = `Kapitel gemeistert! Reise weiter über den Zeitstrahl (Z).`;
    }

    this.questBox.innerHTML = `
      <div class="quest-header">
        <span class="quest-title-text">${chData.title} · ${chData.year}</span>
        <span class="quest-counter ${isDone ? 'quest-done' : ''}">${completedCount} / 4</span>
      </div>
      <div class="quest-task-line"><b>Aufgabe:</b> ${activeTaskText}</div>
      <div class="quest-divider"></div>
      <div id="hud-compass" class="quest-compass">${compassText}</div>
    `;
  }

  update(): void {
    const world = this.scene.get('World') as any;
    if (world && world.currentCompassText) {
      const compassEl = document.getElementById('hud-compass');
      if (compassEl && compassEl.textContent !== world.currentCompassText) {
        compassEl.textContent = world.currentCompassText;
      }
    }
  }

  // =========================================================================
  // MODAL MANAGEMENT
  // =========================================================================
  private setModalContent(html: string, type: ModalType): void {
    this.activeModal = type;
    this.modalOverlay.innerHTML = html;
    this.modalOverlay.style.display = 'flex';
    this.touchControls.setVisible(false);
    sound.playOpenModal();
  }

  public closeModal(): void {
    this.activeModal = 'none';
    this.modalOverlay.style.display = 'none';
    this.modalOverlay.innerHTML = '';
    this.touchControls.setVisible(true);
    sound.playCloseModal();
  }

  // =========================================================================
  // 1. DOKUMENTEN- & PERGAMENT-STARTSCREEN (12-Kapitel-Grid)
  // =========================================================================
  public openStartScreen(): void {
    const roles = VIKING_ROLES;

    const showcases = [
      { span: 'K1 & K2', title: 'Hof & Götter', year: '780–785', desc: 'Fjorddorf, Schlüsselgewalt & Blót' },
      { span: 'K3 & K4', title: 'Schiffe & 793', year: '790–793', desc: 'Klinkerbau, Drakkar & Lindisfarne' },
      { span: 'K5 & K6', title: 'Waräger & Paris', year: '860–886', desc: 'Fluss-Portage & Danegeld' },
      { span: 'K7 & K8', title: 'Danelag & König', year: '870–965', desc: 'Jorvik-Gesetz & Harald Blauzahn' },
      { span: 'K9 & K10', title: 'Althing & Grönland', year: '930–982', desc: 'Lögberg-Recht & Sonnenstein' },
      { span: 'K11 & K12', title: 'Vinland & Ende', year: '1000–1066', desc: 'Amerika-Erstkontakt & 1066' },
    ];

    let showcaseHtml = showcases
      .map(
        (s) => `
        <div class="start-showcase-card">
          <div class="showcase-span">${s.span} (${s.year})</div>
          <div class="showcase-title">${s.title}</div>
          <div class="showcase-desc">${s.desc}</div>
        </div>
      `,
      )
      .join('');

    let chCards = CHAPTERS.map((c) => {
      const activeClass = c.id === gameState.chapter ? 'active' : '';
      return `
        <div class="parchment-ch-card ${activeClass}" onclick="window.__VIK_UI__.selectStartChapter(${c.id})">
          <div class="ch-card-header">K${c.id} &bull; ${c.year}</div>
          <div class="ch-card-title">${c.title.split(': ')[1] || c.title}</div>
          <div class="ch-card-sub">${c.subtitle}</div>
        </div>
      `;
    }).join('');

    let roleCards = roles
      .map((r) => {
        const active = r.id === gameState.role ? 'active' : '';
        return `
        <div class="role-card ${active}" onclick="window.__VIK_UI__.selectRole('${r.id}')">
          <div class="role-title">${r.name}</div>
          <div class="role-tribal">${r.tribalTitle}</div>
          <div class="role-desc">${r.description}</div>
          <div class="role-bonus">✨ ${r.bonusText}</div>
        </div>
      `;
      })
      .join('');

    const html = `
      <div class="modal-card parchment-startscreen">
        <div class="start-header">
          <div class="start-school-badge">🏛️ Heimbürgeschule Kahla &bull; 16-Bit Geschichtslernspiel</div>
          <h1 class="start-main-title">DIE WIKINGER: VOM FJORD NACH VINLAND</h1>
          <div class="start-subtitle">Alltag, seefahrerische Pionierleistungen, Kulturtransfer & Staatenbildung (780–1066 n. Chr.)</div>
        </div>

        <div class="start-hero-showcase">
          <div class="showcase-header">✨ 12 Runden historischer Erkenntnisgewinn (780 bis 1066 n. Chr.)</div>
          <div class="showcase-grid">${showcaseHtml}</div>
        </div>

        <div class="start-setup-section">
          <div class="start-input-group">
            <label>1. Dein Schülername:</label>
            <input type="text" id="start-name-input" class="start-text-input" value="${gameState.playerName}" maxlength="18" onchange="window.__VIK_UI__.updatePlayerName(this.value)" />
          </div>

          <div class="start-input-group">
            <label>2. Deine Spielfigur:</label>
            <div class="start-gender-row">
              <button class="gender-btn ${gameState.gender === 'female' ? 'active' : ''}" onclick="window.__VIK_UI__.selectGender('female')">
                👧 Astrid (Freie Hausherrin)
              </button>
              <button class="gender-btn ${gameState.gender === 'male' ? 'active' : ''}" onclick="window.__VIK_UI__.selectGender('male')">
                👦 Ragnar (Fjord-Entdecker)
              </button>
            </div>
          </div>
        </div>

        <div class="start-roles-section">
          <label>3. Deine historische Begabung (Rollenbonus):</label>
          <div class="start-roles-grid">${roleCards}</div>
        </div>

        <div class="start-chapter-picker-section" style="margin-top: 14px;">
          <label style="font-size: 12px; font-weight: 700; color: #451a03; margin-bottom: 6px; display: block;">
            4. Start-Kapitel wählen (Direkteinstieg für den Geschichtsunterricht):
          </label>
          <div class="parchment-chapter-grid">${chCards}</div>
        </div>

        <div class="start-code-row">
          <span>📝 Hefter-Kurzcode vorhanden?</span>
          <input type="text" id="start-code-input" class="code-input" placeholder="VIK-K04-AS-015-03" />
          <button class="btn-sub" onclick="window.__VIK_UI__.loadHefterCodeFromInput()">Code laden</button>
        </div>

        <div class="start-footer">
          <div class="start-controls-hint">
            🎮 Steuerung: WASD / Pfeiltasten &bull; [E] Interagieren &bull; [I] Beutel &bull; [C] Handwerk &bull; [B] Bauten &bull; [Z] Zeitstrahl
          </div>
          <button id="start-game-btn" class="btn-primary start-launch-btn" onclick="window.__VIK_UI__.startGameFromStartscreen()">
            🚀 In die Wikingerzeit eintauchen!
          </button>
        </div>
      </div>
    `;

    this.setModalContent(html, 'start');
  }

  public updatePlayerName(val: string): void {
    if (val.trim()) {
      gameState.playerName = val.trim();
    }
  }

  public selectGender(g: PlayerGender): void {
    gameState.gender = g;
    if (g === 'female' && gameState.playerName === 'Ragnar') gameState.playerName = 'Astrid';
    if (g === 'male' && gameState.playerName === 'Astrid') gameState.playerName = 'Ragnar';
    this.openStartScreen();
  }

  public selectRole(r: PlayerRole): void {
    gameState.role = r;
    this.openStartScreen();
  }

  public selectStartChapter(ch: number): void {
    gameState.chapter = ch;
    this.openStartScreen();
  }

  public loadHefterCodeFromInput(): void {
    const input = document.getElementById('start-code-input') as HTMLInputElement | null;
    if (!input || !input.value.trim()) return;
    const ok = gameState.loadFromHefterCode(input.value.trim());
    if (ok) {
      this.showToast('✅ Speicherstand aus Hefter-Code erfolgreich geladen!', 'success');
      this.openStartScreen();
    } else {
      this.showToast('❌ Ungültiger Hefter-Code (Format: VIK-K01-AS-000-00)', 'warning');
    }
  }

  public startGameFromStartscreen(): void {
    const input = document.getElementById('start-name-input') as HTMLInputElement | null;
    if (input && input.value.trim()) {
      gameState.playerName = input.value.trim();
    }
    this.closeModal();
    sound.playChapterBGM(gameState.chapter);
    this.showToast(`Kapitel ${gameState.chapter} gestartet! Suche deinen Mentor auf.`, 'info');
  }

  // =========================================================================
  // 2. DIALOG-SYSTEM MIT SPRECHER-AVATAREN & TOOLTIPS
  // =========================================================================
  public openMentorDialog(chData: any): void {
    this.dialogLines = chData.introDialog;
    this.dialogIndex = 0;
    this.dialogSpeaker = chData.mentorName;
    this.dialogRole = chData.mentorRole;
    this.dialogPortrait = `/assets/gfx/portraits/${chData.mentorId}.png`;

    gameState.setObjective(gameState.chapter, 0, true); // Mark mentor consulted
    this.renderDialogStep();
  }

  private renderDialogStep(): void {
    const line = this.dialogLines[this.dialogIndex];
    const isLast = this.dialogIndex >= this.dialogLines.length - 1;

    // Highlight key terms in text
    let highlightedText = line;
    for (const [term, key] of Object.entries(HIGHLIGHT_TERMS)) {
      const reg = new RegExp(`\\b${term}\\b`, 'g');
      highlightedText = highlightedText.replace(
        reg,
        `<span class="lex-term-tooltip" onclick="window.__VIK_UI__.openLexiconDirect('${key}')">${term}</span>`,
      );
    }

    const html = `
      <div class="modal-card dialog-modal">
        <div class="dialog-layout">
          <div class="dialog-portrait-box">
            <div class="dialog-avatar-frame">
              <img src="${this.dialogPortrait}" class="dialog-avatar-img" onerror="this.style.display='none'" />
            </div>
            <div class="dialog-speaker-name">${this.dialogSpeaker}</div>
            <div class="dialog-speaker-role">${this.dialogRole}</div>
          </div>
          <div class="dialog-content-box">
            <div class="dialog-bubble-text">${highlightedText}</div>
            <div class="dialog-action-row">
              <div class="dialog-step-indicator">Abschnitt ${this.dialogIndex + 1} von ${this.dialogLines.length}</div>
              <div style="display: flex; gap: 8px;">
                ${
                  isLast
                    ? `<button class="btn-primary" onclick="window.__VIK_UI__.startChapterQuiz()">Zum Kapitel-Quiz 📝</button>
                       <button class="btn-secondary" onclick="window.__VIK_UI__.closeModal()">Hof erkunden</button>`
                    : `<button class="btn-primary" onclick="window.__VIK_UI__.nextDialogStep()">Weiter ➔</button>`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setModalContent(html, 'dialog');
  }

  public nextDialogStep(): void {
    sound.playSelect();
    this.dialogIndex += 1;
    this.renderDialogStep();
  }

  // =========================================================================
  // 3. MULTIPERSPEKTIVISCHES KAPITEL-QUIZ
  // =========================================================================
  public startChapterQuiz(): void {
    const chData = CHAPTERS.find((c) => c.id === gameState.chapter);
    if (!chData || !chData.quiz || chData.quiz.length === 0) {
      this.closeModal();
      return;
    }
    this.renderQuizQuestion(0, 0);
  }

  private renderQuizQuestion(qIdx: number, score: number): void {
    const chData = CHAPTERS.find((c) => c.id === gameState.chapter)!;
    const q = chData.quiz[qIdx];
    const totalQ = chData.quiz.length;

    const optHtml = q.options
      .map(
        (opt, i) => `
        <button class="quiz-opt-btn" onclick="window.__VIK_UI__.handleQuizAnswer(${qIdx}, ${i}, ${score})">
          ${String.fromCharCode(65 + i)}) ${opt}
        </button>
      `,
      )
      .join('');

    const html = `
      <div class="modal-card" style="max-width: 680px;">
        <div class="modal-header-row">
          <h2>📝 Kapitel ${gameState.chapter}-Quiz (Frage ${qIdx + 1} von ${totalQ})</h2>
          <button class="modal-close-btn" onclick="window.__VIK_UI__.closeModal()">&times;</button>
        </div>
        <div class="quiz-question-box">
          <div class="quiz-question-title">${q.question}</div>
          <div class="quiz-options-list">${optHtml}</div>
        </div>
      </div>
    `;

    this.setModalContent(html, 'quiz');
  }

  public handleQuizAnswer(qIdx: number, selected: number, score: number): void {
    const chData = CHAPTERS.find((c) => c.id === gameState.chapter)!;
    const q = chData.quiz[qIdx];
    const isCorrect = selected === q.correctIndex;

    if (isCorrect) {
      sound.playQuizCorrect();
      score += 1;
    } else {
      sound.playQuizWrong();
    }

    const nextIdx = qIdx + 1;
    const hasNext = nextIdx < chData.quiz.length;

    const html = `
      <div class="modal-card" style="max-width: 650px;">
        <div class="modal-header-row">
          <h2>${isCorrect ? '✨ Didaktisch Richtig!' : '💡 Historischer Hintergrund'}</h2>
        </div>
        <div class="quiz-feedback-box ${isCorrect ? 'correct' : 'wrong'}">
          <div style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">
            ${isCorrect ? 'Hervorragend geantwortet!' : 'Das war noch nicht ganz historisch exakt:'}
          </div>
          <div style="font-size: 13px; line-height: 1.45; color: #fef3c7;">${q.explanation}</div>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
          ${
            hasNext
              ? `<button class="btn-primary" onclick="window.__VIK_UI__.renderQuizQuestion(${nextIdx}, ${score})">Nächste Frage ➔</button>`
              : `<button class="btn-primary" onclick="window.__VIK_UI__.finishChapterQuiz(${score})">Quiz abschließen</button>`
          }
        </div>
      </div>
    `;

    this.setModalContent(html, 'quiz');
  }

  public finishChapterQuiz(score: number): void {
    const chData = CHAPTERS.find((c) => c.id === gameState.chapter)!;
    const passed = score >= 1;

    if (passed) {
      gameState.setObjective(gameState.chapter, 3, true); // Mark quiz completed
      if (score === chData.quiz.length) {
        gameState.quizPerfect.add(gameState.chapter);
      }
      sound.playChapterComplete();
      this.showToast(`Kapitel-Quiz bestanden (${score}/${chData.quiz.length})!`, 'success');

      // Check if all 4 gating criteria are met
      if (gameState.isChapterFullyComplete(gameState.chapter)) {
        this.openChapterCompletionModal();
        return;
      }
    } else {
      this.showToast('Versuche das Quiz erneut, um die Kapitel-Auszeichnung zu erlangen!', 'warning');
    }

    this.closeModal();
  }

  private openChapterCompletionModal(): void {
    const ch = gameState.chapter;
    const chData = CHAPTERS.find((c) => c.id === ch)!;

    const html = `
      <div class="modal-card" style="max-width: 620px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 10px;">🏆</div>
        <h2 style="font-family: 'Cinzel', serif; font-size: 22px; color: var(--amber-light); margin-bottom: 8px;">
          KAPITEL ${ch} VOLLSTÄNDIG GEMEISTERT!
        </h2>
        <div style="font-size: 14px; color: #86efac; font-weight: 700; margin-bottom: 14px;">
          Alle 4 didaktischen Gating-Kriterien erfüllt
        </div>
        <div style="font-size: 13px; color: #e2d9cc; line-height: 1.5; margin-bottom: 18px; text-align: left; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px;">
          ${chData.summary}
        </div>
        <div style="display: flex; justify-content: center; gap: 10px;">
          ${
            ch < 12
              ? `<button class="btn-primary" onclick="window.__VIK_UI__.advanceToNextChapter(${ch + 1})">
                  Weiter zu Kapitel ${ch + 1} ➔
                 </button>`
              : `<button class="btn-primary" onclick="window.__VIK_UI__.openCertificate()">
                  Zur feierlichen Urkunde [U] 📜
                 </button>`
          }
          <button class="btn-secondary" onclick="window.__VIK_UI__.closeModal()">Hof weiterspielen</button>
        </div>
      </div>
    `;

    this.setModalContent(html, 'dialog');
  }

  public advanceToNextChapter(nextCh: number): void {
    gameState.chapter = nextCh;
    sound.playChapterBGM(nextCh);
    this.closeModal();
    this.showToast(`Kapitel ${nextCh} freigeschaltet!`, 'success');
  }

  // =========================================================================
  // 4. ARCHÄOLOGISCHE RELIKTE (5 Historische Funde)
  // =========================================================================
  public openRelicModal(relic: VikingRelic): void {
    this.activeRelic = relic;

    const optHtml = relic.options
      .map(
        (opt, i) => `
        <button class="quiz-opt-btn" onclick="window.__VIK_UI__.handleRelicAnswer(${i})">
          ${String.fromCharCode(65 + i)}) ${opt}
        </button>
      `,
      )
      .join('');

    const html = `
      <div class="modal-card" style="max-width: 680px;">
        <div class="modal-header-row">
          <h2>🏆 Leitfund: ${relic.name}</h2>
          <button class="modal-close-btn" onclick="window.__VIK_UI__.closeModal()">&times;</button>
        </div>
        <div style="display: flex; gap: 16px; margin-bottom: 16px;">
          <div style="width: 72px; height: 72px; background: rgba(0,0,0,0.4); border: 2px solid var(--amber-gold); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <img src="${relic.icon}" style="width: 48px; height: 48px; image-rendering: pixelated;" />
          </div>
          <div>
            <div style="font-size: 11px; color: var(--amber-light); font-weight: 700; text-transform: uppercase;">
              ${relic.epoch} &bull; ${relic.year} &bull; Fundort: ${relic.findLocation}
            </div>
            <div style="font-size: 12px; color: #fef3c7; line-height: 1.4; margin-top: 4px;">
              ${relic.historicalContext}
            </div>
            <div style="font-size: 11px; color: #86efac; font-weight: 600; margin-top: 6px;">
              💡 Archäologische Bedeutung: ${relic.significance}
            </div>
          </div>
        </div>
        <div class="quiz-question-box">
          <div class="quiz-question-title">Relikt-Quiz: ${relic.question}</div>
          <div class="quiz-options-list">${optHtml}</div>
        </div>
      </div>
    `;

    this.setModalContent(html, 'relic_quiz');
  }

  public handleRelicAnswer(selected: number): void {
    if (!this.activeRelic) return;
    const r = this.activeRelic;
    const isCorrect = selected === r.correctIndex;

    if (isCorrect) {
      sound.playRelicFound();
      gameState.discoveredRelics.add(r.id);
      this.showToast(`Relikt geborgen: ${r.name}! (+100 Punkte)`, 'success');
    } else {
      sound.playQuizWrong();
      this.showToast('Das war leider nicht korrekt. Untersuche das Relikt erneut!', 'warning');
    }

    this.closeModal();
  }

  // =========================================================================
  // 5. STANDARDISIERTES 7-KACHEL-PAUSE-DASHBOARD (Section 4.3)
  // =========================================================================
  public openPauseDashboard(): void {
    const hefterCode = gameState.generateHefterCode();
    const pts = gameState.getChronistPoints();
    const rankTitle = gameState.getRankTitle();
    const track = sound.getChapterTrackInfo(gameState.chapter);
    const bgmMuted = sound.bgmMuted;
    const vol = Math.round(sound.getVolume() * 100);

    const mins = Math.floor(gameState.playTimeSeconds / 60);
    const secs = gameState.playTimeSeconds % 60;
    const timeStr = `${mins}:${String(secs).padStart(2, '0')} Min.`;

    const distM = Math.floor(gameState.walkedDistanceMeters);
    const distStr = distM > 1000 ? `${(distM / 1000).toFixed(2)} km` : `${distM} m`;

    const html = `
      <div class="modal-card pause-dashboard-modal" style="max-width: 900px;">
        <div class="modal-header-row">
          <h2>⚙️ Chronisten-Zentrale (Pause & Lernstand)</h2>
          <button class="modal-close-btn" onclick="window.__VIK_UI__.closeModal()">&times;</button>
        </div>

        <div class="pause-tiles-grid">
          <!-- Kachel 1: Hefter-Code -->
          <div class="pause-tile-card">
            <div class="tile-icon">📝</div>
            <div class="tile-title">1. Hefter-Code (Schulheft)</div>
            <div class="tile-code-display">${hefterCode}</div>
            <div style="display: flex; gap: 6px; margin: 4px 0;">
              <button class="btn-sub" onclick="window.__VIK_UI__.copyHefterCode()">📋 Code kopieren</button>
            </div>
            <div class="tile-subtext">Notiere diesen Code in dein Geschichtsheft, um deinen Stand jederzeit fortzusetzen.</div>
          </div>

          <!-- Kachel 2: Chronisten-Rang -->
          <div class="pause-tile-card">
            <div class="tile-icon">👑</div>
            <div class="tile-title">2. Rang & Punkte</div>
            <div class="tile-main-stat">${pts} Punkte</div>
            <div class="tile-subtext">${rankTitle}</div>
          </div>

          <!-- Kachel 3: Audiokulisse -->
          <div class="pause-tile-card">
            <div class="tile-icon">🎵</div>
            <div class="tile-title">3. Musik & Kulisse</div>
            <div style="font-size: 11px; font-weight: 700; color: #fef3c7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${track.title}
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
              <button class="btn-sub" onclick="window.__VIK_UI__.toggleBgmFromPause()">${bgmMuted ? 'Ton an 🔊' : 'Stumm 🔇'}</button>
              <input type="range" min="0" max="100" value="${vol}" oninput="window.__VIK_UI__.setBgmVolFromPause(this.value)" style="width: 80px;" />
              <span style="font-size: 10px; color: #cbd5e1;">${vol}%</span>
            </div>
          </div>

          <!-- Kachel 4: Archäologische Leitfunde -->
          <div class="pause-tile-card">
            <div class="tile-icon">🏆</div>
            <div class="tile-title">4. Leitfunde / Relikte</div>
            <div class="tile-main-stat">${gameState.discoveredRelics.size} von 5 geborgen</div>
            <button class="btn-sub" style="margin-top: 4px;" onclick="window.__VIK_UI__.openCertificate()">Zur Übersicht [U]</button>
          </div>

          <!-- Kachel 5: Fachlexikon -->
          <div class="pause-tile-card">
            <div class="tile-icon">📖</div>
            <div class="tile-title">5. Historisches Glossar</div>
            <div class="tile-main-stat">${gameState.unlockedLexicon.size} von 27 entdeckt</div>
            <button class="btn-sub" style="margin-top: 4px;" onclick="window.__VIK_UI__.openLexicon()">Lexikon öffnen [L]</button>
          </div>

          <!-- Kachel 6: Siedlungsbauten -->
          <div class="pause-tile-card">
            <div class="tile-icon">🏛️</div>
            <div class="tile-title">6. Bauvorhaben</div>
            <div class="tile-main-stat">${gameState.builtBuildings.size} von 12 errichtet</div>
            <button class="btn-sub" style="margin-top: 4px;" onclick="window.__VIK_UI__.openBuildingModal()">Bauten ansehen [B]</button>
          </div>

          <!-- Kachel 7: Live-Statistiken -->
          <div class="pause-tile-card">
            <div class="tile-icon">⏱️</div>
            <div class="tile-title">7. Erkundungsfortschritt</div>
            <div style="font-size: 12px; color: #fef3c7; font-weight: 700;">Gespielt: ${timeStr}</div>
            <div style="font-size: 12px; color: #86efac; font-weight: 700; margin-top: 3px;">Gelaufen: ${distStr}</div>
          </div>
        </div>

        <div class="pause-footer-controls">
          <div class="pause-controls-keymap">
            ⌨️ <b>Tastatur:</b> WASD / Pfeile: Bewegen &bull; [E]: Interagieren &bull; [I]: Beutel &bull; [C]: Handwerk &bull; [B]: Bauten &bull; [Z]: Zeitstrahl &bull; [R]: Thing/Dilemma &bull; [U]: Diplom &bull; [M]: Musik &bull; [P/ESC]: Schließen
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-sub" onclick="window.__VIK_UI__.triggerHefterPrint()">🖨️ Hefterblatt drucken (A4)</button>
            <button class="btn-primary" onclick="window.__VIK_UI__.closeModal()">Weiterspielen ➔</button>
          </div>
        </div>
      </div>
    `;

    this.setModalContent(html, 'pause');
  }

  public toggleBgmFromPause(): void {
    sound.toggleBGMMute();
    this.openPauseDashboard();
  }

  public setBgmVolFromPause(val: string): void {
    const num = parseInt(val, 10) / 100;
    sound.setVolume(num);
    this.openPauseDashboard();
  }

  public copyHefterCode(): void {
    const code = gameState.generateHefterCode();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        this.showToast('📋 Hefter-Code in Zwischenablage kopiert!', 'success');
      }).catch(() => {
        this.showToast(`Code: ${code}`, 'info');
      });
    } else {
      this.showToast(`Code: ${code}`, 'info');
    }
  }

  // =========================================================================
  public openInventory(): void {
    const items = Object.entries(gameState.inventory).filter(
      ([_, count]) => typeof count === 'number' && count > 0,
    ) as [VikingItemId, number][];

    let itemsHtml = items.length
      ? items
          .map(([id, count]) => {
            const def = VIKING_ITEMS[id as VikingItemId];
            if (!def) return '';
            return `
            <div class="inv-item-card">
              <div class="inv-item-icon-box">
                <img src="${def.icon}" style="width: 32px; height: 32px; image-rendering: pixelated;" />
              </div>
              <div class="inv-item-details">
                <div class="inv-item-name">${def.name} <span class="inv-item-count">&times; ${count}</span></div>
                <div class="inv-item-desc">${def.desc}</div>
                <div class="inv-item-hist">💡 ${def.historicalNote}</div>
              </div>
            </div>
          `;
          })
          .join('')
      : '<div style="color: #cbd5e1; font-size: 13px; text-align: center; padding: 20px;">Dein Beutel ist aktuell leer. Sammle Gerste, Holz oder Mooreisen!</div>';

    const html = `
      <div class="modal-card" style="max-width: 750px;">
        <div class="modal-header-row">
          <h2>🎒 Beutel & Vorratskammer [I]</h2>
          <button class="modal-close-btn" onclick="window.__VIK_UI__.closeModal()">&times;</button>
        </div>
        <div class="inv-items-grid">${itemsHtml}</div>
      </div>
    `;

    this.setModalContent(html, 'inventory');
  }

  // =========================================================================
  // 7. HANDWERK & HERSTELLUNG [C]
  // =========================================================================
  public openCrafting(): void {
    const recipes = VIKING_RECIPES.filter((r) => r.minChapter <= gameState.chapter);

    let recHtml = recipes
      .map((r) => {
        const canCraft = r.ingredients.every((ing) => gameState.hasItem(ing.item, ing.count));
        const ingStr = r.ingredients
          .map((ing) => `${ing.count}x ${VIKING_ITEMS[ing.item]?.name || ing.item}`)
          .join(', ');

        return `
        <div class="craft-recipe-card">
          <div style="flex-grow: 1;">
            <div style="font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; color: var(--amber-light);">
              ${r.name} &bull; ${r.resultCount}x ${VIKING_ITEMS[r.resultItem]?.name || r.resultItem}
            </div>
            <div style="font-size: 11px; color: #cbd5e1; margin: 3px 0;">${r.desc}</div>
            <div style="font-size: 11px; color: ${canCraft ? '#86efac' : '#fca5a5'}; font-weight: 600;">
              Bedarf: ${ingStr}
            </div>
          </div>
          <button class="btn-primary ${canCraft ? '' : 'disabled'}" ${canCraft ? '' : 'disabled'} onclick="window.__VIK_UI__.craftRecipe('${r.id}')">
            Herstellen 🔨
          </button>
        </div>
      `;
      })
      .join('');

    const html = `
      <div class="modal-card" style="max-width: 750px;">
        <div class="modal-header-row">
          <h2>🔨 Handwerk & Werkstatt [C]</h2>
          <button class="modal-close-btn" onclick="window.__VIK_UI__.closeModal()">&times;</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">${recHtml}</div>
      </div>
    `;

    this.setModalContent(html, 'craft');
  }

  public craftRecipe(recId: string): void {
    const r = VIKING_RECIPES.find((rec) => rec.id === recId);
    if (!r) return;

    for (const ing of r.ingredients) {
      if (!gameState.removeItem(ing.item, ing.count)) {
        this.showToast('Nicht genügend Rohstoffe vorhanden!', 'warning');
        return;
      }
    }

    gameState.addItem(r.resultItem, r.resultCount);
    gameState.craftedOnce.add(r.resultItem);
    gameState.setObjective(gameState.chapter, 1, true); // Mark craft objective
    sound.playCraftSuccess();
    this.showToast(`${r.resultCount}x ${VIKING_ITEMS[r.resultItem]?.name} erfolgreich hergestellt!`, 'success');
    this.openCrafting();
  }

  // =========================================================================
  // 8. SIEDLUNGS- & INFRASTRUKTUR-BAUTEN [B]
  // =========================================================================
  public openBuildingModal(highlightId?: string): void {
    const buildings = VIKING_BUILDINGS;

    let bHtml = buildings
      .map((b) => {
        const isBuilt = gameState.builtBuildings.has(b.id);
        const isCurrent = b.chapter === gameState.chapter;

        return `
        <div class="building-card ${isBuilt ? 'built' : isCurrent ? 'current' : ''}">
          <div style="flex-grow: 1;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; color: var(--amber-light);">
                ${b.name} (Kapitel ${b.chapter})
              </span>
              ${isBuilt ? '<span class="badge-built">✓ Errichtet</span>' : ''}
            </div>
            <div style="font-size: 11px; color: #cbd5e1; margin: 3px 0;">${b.desc}</div>
            <div style="font-size: 10px; color: #86efac;">💡 Bedeutung: ${b.historicalSignificance}</div>
            <div style="font-size: 10px; color: #fde047; margin-top: 2px;">Kosten: ${b.costText}</div>
          </div>
          ${
            !isBuilt && isCurrent
              ? `<button class="btn-primary" onclick="window.__VIK_UI__.constructBuilding('${b.id}')">Errichten 🏛️</button>`
              : ''
          }
        </div>
      `;
      })
      .join('');

    const html = `
      <div class="modal-card" style="max-width: 800px;">
        <div class="modal-header-row">
          <h2>🏛️ Siedlungs- & Infrastruktur-Bauvorhaben [B]</h2>
          <button class="modal-close-btn" onclick="window.__VIK_UI__.closeModal()">&times;</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">${bHtml}</div>
      </div>
    `;

    this.setModalContent(html, 'build');
  }

  public constructBuilding(bId: string): void {
    const b = VIKING_BUILDINGS.find((p) => p.id === bId);
    if (!b) return;

    gameState.builtBuildings.add(b.id);
    gameState.setObjective(gameState.chapter, 2, true); // Mark building objective
    sound.playCraftSuccess();
    this.showToast(`Bauprojekt "${b.name}" erfolgreich errichtet!`, 'success');
    this.openBuildingModal();
  }

  // =========================================================================
  // 9. HISTORISCHES FACHLEXIKON [L] (Progressive Unlocking)
  // =========================================================================
  public openLexiconDirect(termId: string): void {
    this.lexSelected = termId;
    this.openLexicon();
  }

  public selectLexiconEntry(termId: string): void {
    this.lexSelected = termId;
    this.openLexicon();
  }

  public speakLexicon(id: string): void {
    const entry = LEXICON_ENTRIES.find((e) => e.id === id);
    if (!entry) return;
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${entry.term}. ${entry.definition}. Merksatz: ${entry.merksatz}`);
    u.lang = 'de-DE';
    u.rate = 0.96;
    window.speechSynthesis.speak(u);
  }

  public openLexicon(): void {
    if (!LEXICON_ENTRIES.some((e) => e.id === this.lexSelected)) {
      this.lexSelected = LEXICON_ENTRIES[0].id;
    }

    const current = LEXICON_ENTRIES.find((e) => e.id === this.lexSelected) || LEXICON_ENTRIES[0];
    const isKnown = gameState.unlockedLexicon.has(current.id);

    if (isKnown) {
      gameState.lexiconRead.add(current.id);
    }

    const unlockedCount = gameState.unlockedLexicon.size;
    const totalCount = LEXICON_ENTRIES.length;

    const listHtml = LEXICON_ENTRIES.map((e) => {
      const known = gameState.unlockedLexicon.has(e.id);
      const active = e.id === this.lexSelected ? 'active' : '';
      const locked = known ? '' : 'locked';
      return `
        <button class="lex-item-btn ${active} ${locked}" onclick="window.__VIK_UI__.selectLexiconEntry('${e.id}')">
          ${
            known
              ? `<img class="pixel-icon" src="${e.icon}" alt="" style="width:20px;height:20px;image-rendering:pixelated;" />`
              : `<span style="font-size:15px;width:20px;text-align:center;">🔒</span>`
          }
          <div style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${e.term}
          </div>
        </button>
      `;
    }).join('');

    const detailHtml = isKnown
      ? `
        <div style="display:flex;align-items:center;gap:14px;border-bottom:2px solid rgba(212,175,55,0.3);padding-bottom:12px;">
          <img class="pixel-icon" src="${current.icon}" alt="${current.term}" style="width:48px;height:48px;image-rendering:pixelated;" />
          <div>
            <div style="font-size:12px;font-weight:800;color:#f59e0b;text-transform:uppercase;">${current.category}</div>
            <h3 style="margin:2px 0 0 0;font-size:20px;color:#fef3c7;font-family:'Cinzel',serif;">${current.term}</h3>
          </div>
        </div>
        <div style="font-size:15px;line-height:1.65;color:#e2e8f0;margin-top:14px;">
          ${current.definition}
        </div>
        <div class="lex-term-merksatz" style="margin-top:14px;background:#1e293b;padding:12px;border-radius:8px;border:1px solid #10b981;">
          📌 <b>Geschichts-Merksatz:</b> ${current.merksatz}
        </div>
        <div style="margin-top:auto;padding-top:16px;display:flex;gap:8px;">
          <button class="btn-action" style="background:#b45309;color:#fff;" onclick="window.__VIK_UI__.speakLexicon('${current.id}')">🔊 Eintrag vorlesen</button>
        </div>
      `
      : `
        <div style="display:flex;align-items:center;gap:14px;border-bottom:2px solid rgba(212,175,55,0.3);padding-bottom:12px;">
          <span style="font-size:38px;">🔒</span>
          <div>
            <div style="font-size:12px;font-weight:800;color:#94a3b8;text-transform:uppercase;">${current.category}</div>
            <h3 style="margin:2px 0 0 0;font-size:19px;color:#cbd5e1;font-family:'Cinzel',serif;">${current.term} (Noch nicht entdeckt)</h3>
          </div>
        </div>
        <div class="lex-hint-box">
          <strong>💡 Such-Tipp – Wie schalte ich diesen Eintrag frei?</strong>
          <div style="margin-top:8px;font-size:14px;line-height:1.55;color:#fef3c7;">
            ${current.unlockHint}
          </div>
        </div>
      `;

    const html = `
      <div class="modal-card" style="max-width: 900px;">
        <div class="modal-header-row">
          <h2>📖 Lexikon der Wikingerzeit (${unlockedCount} / ${totalCount} entdeckt) [L]</h2>
          <button class="modal-close-btn" onclick="window.__VIK_UI__.closeModal()">&times; Schließen (Esc)</button>
        </div>
        <div class="lex-layout">
          <div class="lex-list">${listHtml}</div>
          <div class="lex-detail-card">${detailHtml}</div>
        </div>
      </div>
    `;

    this.setModalContent(html, 'lexicon');
  }

  // =========================================================================
  // 10. THEMENINTERNER PHASENVERGLEICH & ZEITSTRAHL [Z] (Section 4.3)
  // =========================================================================
  public openTimeline(): void {
    const phases = [
      {
        phase: 'Phase 1: Hofleben & Götterglaube (ca. 780–793 n. Chr.)',
        chapters: 'Kapitel 1 bis 3',
        focus: 'Alltag im Fjorddorf, autarke Landwirtschaft, Schlüsselgewalt der Frau, Blót-Opferfeste & Klinkerbau der Schiffe',
        tech: 'Langhaus, Pflugbau, Weidewirtschaft, Futhark-Runen, Drakkar & Knarr',
      },
      {
        phase: 'Phase 2: Raubzüge, Flüsse & Danegeld (793–886 n. Chr.)',
        chapters: 'Kapitel 4 bis 6',
        focus: 'Der Schock von Lindisfarne, Ursachen der Fahrten, Waräger-Flusshandel nach Byzanz & Belagerung von Paris',
        tech: 'Hochseenavigation, Dnepr-Portage, arabische Silberdirhams, Danegeld-Tribute',
      },
      {
        phase: 'Phase 3: Sesshaftwerdung & Christianisierung (ca. 870–965 n. Chr.)',
        chapters: 'Kapitel 7 und 8',
        focus: 'Das Danelag in England, Jorvik-Handel, Sprachmischung & Harald Blauzahns Taufe in Jelling',
        tech: 'Anglo-dänisches Recht, Münzprägung, Jelling-Denkmäler, Holzkirchenbau',
      },
      {
        phase: 'Phase 4: Atlantikexpeditionen & Staatenbildung (930–1066 n. Chr.)',
        chapters: 'Kapitel 9 bis 12',
        focus: 'Das isländische Althing am Lögberg, Grönlandfahrt, Vinland (Neufundland) & Stamford Bridge 1066',
        tech: 'Demokratischer Thingfrieden, Sonnenstein-Polarnautik, Sodenbauten, Übergang zum europäischen Feudalismus',
      },
    ];

    let phtml = phases
      .map(
        (p, idx) => `
        <div class="timeline-phase-card">
          <div class="timeline-phase-badge">Epochenphase ${idx + 1} &bull; ${p.chapters}</div>
          <div class="timeline-phase-title">${p.phase}</div>
          <div style="font-size: 12px; color: #cbd5e1; margin: 4px 0;"><b>Historischer Fokus:</b> ${p.focus}</div>
          <div style="font-size: 11px; color: #fde047;"><b>Technologie & Kultur:</b> ${p.tech}</div>
        </div>
      `,
      )
      .join('');

    const html = `
      <div class="modal-card" style="max-width: 800px;">
        <div class="modal-header-row">
          <h2>⏳ Phasen-Zeitstrahl der Wikingerzeit (780–1066) [Z]</h2>
          <button class="modal-close-btn" onclick="window.__VIK_UI__.closeModal()">&times;</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">${phtml}</div>
      </div>
    `;

    this.setModalContent(html, 'timeline');
  }

  // =========================================================================
  // 11. FEIERLICHE URKUNDE / GESCHICHTSDIPLOM [U]
  // =========================================================================
  public openCertificate(): void {
    const pts = gameState.getChronistPoints();
    const rank = gameState.getRankTitle();
    const dateStr = new Date().toLocaleDateString('de-DE');

    const html = `
      <div class="modal-card parchment-certificate" style="max-width: 720px; text-align: center; border: 4px double #854d0e; padding: 28px;">
        <div style="font-size: 11px; font-weight: 700; color: #854d0e; letter-spacing: 2px; text-transform: uppercase;">
          🏛️ Heimbürgeschule Kahla &bull; Fachkonferenz Geschichte
        </div>
        <h1 style="font-family: 'Cinzel', serif; font-size: 26px; color: #451a03; margin: 8px 0;">
          CHRONISTEN-DIPLOM DER WIKINGERZEIT
        </h1>
        <div style="font-size: 13px; color: #78350f; font-weight: 600; margin-bottom: 16px;">
          Hiermit wird bescheinigt, dass
        </div>
        <div style="font-family: 'Cinzel', serif; font-size: 24px; color: #1e130c; font-weight: 800; border-bottom: 2px solid #ca8a04; display: inline-block; padding: 0 24px 4px 24px; margin-bottom: 14px;">
          ${gameState.playerName}
        </div>
        <div style="font-size: 13px; color: #291b12; line-height: 1.5; max-width: 580px; margin: 0 auto 16px auto;">
          alle 12 didaktischen Etappen von den Fjordhöfen Norwegens über das Danelag und Byzanz bis nach Grönland, Vinland und Stamford Bridge mit historischer Urteilskompetenz gemeistert hat.
        </div>

        <div style="display: flex; justify-content: center; gap: 24px; margin: 16px 0; background: rgba(254, 240, 138, 0.4); padding: 12px; border-radius: 8px; border: 1px solid #ca8a04;">
          <div>
            <div style="font-size: 11px; color: #854d0e; font-weight: 700;">CHRONISTEN-RANG</div>
            <div style="font-family: 'Cinzel', serif; font-size: 15px; color: #451a03; font-weight: 800;">${rank}</div>
          </div>
          <div>
            <div style="font-size: 11px; color: #854d0e; font-weight: 700;">EPOCHENPUNKTE</div>
            <div style="font-family: 'Cinzel', serif; font-size: 15px; color: #451a03; font-weight: 800;">${pts} Pkt.</div>
          </div>
          <div>
            <div style="font-size: 11px; color: #854d0e; font-weight: 700;">LEITFUNDE</div>
            <div style="font-family: 'Cinzel', serif; font-size: 15px; color: #451a03; font-weight: 800;">${gameState.discoveredRelics.size} / 5</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; padding-top: 12px; border-top: 1px solid #d4af37;">
          <div style="text-align: left; font-size: 11px; color: #78350f;">
            Datum: ${dateStr}<br />
            Hefter-Code: <b>${gameState.generateHefterCode()}</b>
          </div>
          <div style="width: 60px; height: 60px; border: 2px dashed #ca8a04; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
            🛡️
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-sub" onclick="window.__VIK_UI__.triggerHefterPrint()">🖨️ Hefterblatt drucken (A4)</button>
            <button class="btn-primary" onclick="window.__VIK_UI__.closeModal()">Zurück zum Hof</button>
          </div>
        </div>
      </div>
    `;

    this.setModalContent(html, 'certificate');
  }

  public triggerHefterPrint(): void {
    const relicsData = VIKING_RELICS.map((r) => ({
      title: r.name,
      note: r.historicalContext || r.significance || 'Bedeutender archäologischer Leitfund der Wikingerzeit.'
    }));
    const keyTerms = Object.values(LEXICON_ENTRIES).slice(0, 3).map((t) => ({
      term: t.term,
      definition: t.merksatz ? `${t.definition} (📌 ${t.merksatz})` : t.definition
    }));
    PrintSheetManager.triggerPrint({
      schoolName: 'Staatliche Regelschule Heimbürgeschule Kahla',
      epochTitle: 'Die Wikinger: Seefahrt, Handel, Glaube & Gesetz (780–1066 n. Chr.)',
      playerName: gameState.playerName,
      hefterCode: gameState.generateHefterCode(),
      rankTitle: `${gameState.getRankTitle()} (${gameState.getChronistPoints()} Pkt. · ${gameState.discoveredRelics.size}/5 Leitfunde)`,
      relics: relicsData,
      dilemmaSummary: gameState.dilemmaSummary || undefined,
      keyTerms
    });
  }

  public openDilemma(): void {
    const d = VIKING_DILEMMAS[0];
    if (!d) return;
    this.activeModal = 'dilemma';
    this.dilemmaModal.open(d, (opt) => {
      gameState.storyFlags[opt.storyFlag] = true;
      gameState.dilemmaSummary = `${d.conflictTitle}: ${opt.title} – ${opt.argumentText}`;
      for (const [k, v] of Object.entries(opt.rewards)) {
        if (v && v > 0) gameState.addItem(k as VikingItemId, v);
      }
      this.showToast(`⚖️ Spruch am Lögberg verkündet: ${opt.title}`, 'success');
      this.closeModal();
    });
  }
}
