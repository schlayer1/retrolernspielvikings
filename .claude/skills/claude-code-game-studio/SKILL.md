---
name: claude-code-game-studio
description: >-
  Offizielle Referenzarchitektur und Workflow-Leitfaden für das Claude Code Game Studio
  Framework (Donchitos CCGS) in Spielentwicklungsprojekten. Orchestriert das gesamte
  3-Tier-Studio-Hierarchiemodell (Directors, Leads, Specialists mit 49 Agenten-Rollen),
  steuert 74 spezialisierte Workflow-Skills (/start, /adopt, /design-system, /dev-story,
  /balance-check, /gate-check, etc.), erzwingt das kollaborative User-First-Protokoll
  und koordiniert GDDs, ADRs, Sprints, QA-Evidenzen und Engine-Pipelines.
---

# Claude Code Game Studio (CCGS) — Master Skill

Dieses Dokument definiert die Architektur, Hierarchie, Protokolle und Workflows des **Claude Code Game Studios** (Donchitos CCGS). Es befähigt den KI-Assistenten, komplexe Spielprojekte wie ein professionelles, multi-disziplinäres Indie-Entwicklerstudio mit 49 spezialisierten Agenten-Rollen und 74 Workflow-Skills zu steuern.

---

## 1. Studio-Hierarchie (3 Tiers, 49 Agenten-Rollen)

Die Rollen verteilen sich auf drei Ebenen nach realem Studiovorbild:

```text
Tier 1 — Directors (Opus / Höchste Strategie & Gesamtvison)
  ├── creative-director       # Wächter über Spielerlebnis, Vision, Tonalität, Core Loop
  ├── technical-director      # Wächter über Architektur, Performance, Tech-Stack & Standards
  └── producer                # Sprintplanung, Scope-Management, Blocker-Beseitigung, Termine

Tier 2 — Department Leads (Sonnet / Domänen-Führung)
  ├── game-designer           # Spielmechaniken, Regelwerke, GDDs, Progressionssysteme
  ├── lead-programmer         # Code-Reviews, Architektur-Einhaltung, Refactoring-Leitlinien
  ├── art-director            # Art-Bibles, Farbpaletten, Spritesheet-Standards, Asset-Audits
  ├── audio-director          # Soundscapes, Musik-Bibles, WebAudio/Sound-Pipelines
  ├── narrative-director      # Storytelling, Dialoge, Lore, Quellenintegrität
  ├── qa-lead                 # Testpläne, Regressions-Suiten, Smoke-Checks, Evidenzprüfungen
  ├── release-manager         # Release-Gates, Build-Artefakte, Checklisten, Store-Packaging
  └── localization-lead       # Mehrsprachigkeit, Glossare, Kulturelle Lokalisierung

Tier 3 — Specialists (Domänen-Umsetzung & Handwerk)
  ├── Gameplay & Tech: gameplay-programmer, engine-programmer, ai-programmer,
  │                    network-programmer, tools-programmer, ui-programmer
  ├── Design & Art:    systems-designer, level-designer, economy-designer,
  │                    technical-artist, sound-designer, writer, world-builder, ux-designer
  ├── QA & Ops:        prototyper, performance-analyst, devops-engineer, analytics-engineer,
  │                    security-engineer, qa-tester, accessibility-specialist, live-ops-designer
  └── Engine-Spezialisten:
                       Godot (GDScript, Shaders, GDExtension),
                       Unity (DOTS/ECS, Shaders/VFX, Addressables, UI Toolkit),
                       Unreal Engine (GAS, Blueprints, Replication, UMG/CommonUI),
                       Phaser / Web (HTML5 Canvas, Retina DOM, WebAudio, Pixels, TypeScript)
```

---

## 2. Kollaboratives User-First-Protokoll

**Keine autonome Eigenmächtigkeit, sondern geführtes Pair-Programming.**

Jede signifikante Aktion durchläuft das verbindliche 5-Stufen-Protokoll:
$$\text{Frage} \longrightarrow \text{Optionen} \longrightarrow \text{Entscheidung} \longrightarrow \text{Entwurf/Draft} \longrightarrow \text{Genehmigung}$$

1. **Vor dem Schreiben fragen:** Vor dem Erstellen oder Modifizieren zentraler Architektur-, Story- oder GDD-Dateien fragt der Agent um Bestätigung.
2. **Entwürfe vorlegen:** Vor großen Änderungen werden Diffs oder Zusammenfassungen zur Begutachtung vorgelegt.
3. **Keine zerstörerische Neu-Generierung:** Bestehende GDDs, ADRs oder Codebasen werden bei `/adopt` oder Refactorings **niemals blind überschrieben**, sondern Lücken werden gezielt identifiziert und geschlossen.
4. **Single Source of Truth:** `project.yaml` und `production/session-state/active.md` dienen als persistentes Gedächtnis des Projekts.

---

## 3. Die 7 Phasen & Gate-Checks

Ein Projekt durchläuft 7 standardisierte Phasen. Der Übergang zwischen den Phasen erfolgt ausschließlich über `/gate-check`:

1. **Concept (`/start`, `/brainstorm`, `/quick-design`):**
   - High-Concept-Brief, Spielvision, Zielgruppe, Kernschleife (Core Loop).
2. **Systems Design (`/map-systems`, `/design-system`, `/review-all-gdds`):**
   - Game Design Documents (GDDs) in `design/gdd/`, Progression, Ökonomie, Mechaniken.
3. **Technical Setup (`/setup-engine`, `/create-architecture`, `/architecture-decision`):**
   - Engine-Konfiguration (`project.yaml`), Architecture Decision Records (ADRs) in `docs/adr/`.
4. **Pre-Production (`/prototype`, `/vertical-slice`, `/create-epics`, `/create-stories`):**
   - Spielbarer Vertical Slice, Validierung des "Game Feel", Epics und Stories in `production/stories/`.
5. **Production (`/sprint-plan`, `/dev-story`, `/story-readiness`, `/story-done`):**
   - Iterative Feature-Entwicklung, Story-Zyklen, Code-Reviews, fortlaufende Tests.
6. **Polish (`/balance-check`, `/perf-profile`, `/tech-debt`, `/smoke-check`, `/qa-plan`):**
   - Feintuning, HUD-Layout-Checks, 60 FPS Optimierung, Barrierefreiheit, Lokalisierung.
7. **Release (`/launch-checklist`, `/release-checklist`, `/changelog`, `/patch-notes`, `/team-release`):**
   - Finaler Build, Store-/Web-Packaging, Deployment-Verifikation, Git-Tagging.

---

## 4. Wichtige Slash-Commands & Skills

| Kategorie | Befehle / Skills | Zweck |
| :--- | :--- | :--- |
| **Onboarding & Nav** | `/start`, `/help`, `/project-stage-detect`, `/adopt`, `/settings` | Einstieg, Bestandsaufnahme, Konfiguration |
| **Game Design** | `/brainstorm`, `/map-systems`, `/design-system`, `/quick-design` | Mechaniken, GDDs, Regelsysteme |
| **Art & Audio** | `/art-bible`, `/asset-spec`, `/asset-audit`, `/team-audio` | Visuelle Identität, Paletten, Soundscape |
| **Architektur** | `/create-architecture`, `/architecture-decision` (ADRs) | Technische Entscheidungen, Datenmodelle |
| **Sprints & Stories**| `/create-epics`, `/create-stories`, `/sprint-plan`, `/dev-story`, `/story-done` | Backlog, agile Entwicklung, Abnahme |
| **QA & Tests** | `/qa-plan`, `/smoke-check`, `/balance-check`, `/perf-profile`, `/test-evidence-review` | Testpläne, Evidenzen, Screenshots |
| **Release** | `/gate-check`, `/release-checklist`, `/launch-checklist`, `/changelog` | Phasenübergänge, Go-Live, Notizen |

---

## 5. Integration mit dem didaktischen `/snes-history-game` Standard

Bei historischen Lernspielen (z. B. SNES Phaser 3 Retro-Spiele) kombiniert das Game Studio die Rollen und Workflows mit den festen didaktischen Vorgaben:
1. **Dual-Layer-Architektur:** 16-Bit Pixel-Canvas (Phaser 3) + gestochen scharfes DOM-UI (Retina, 220–280 ms animiert).
2. **Friedenspädagogik:** Keine kriegerischen Shooter-Mechaniken, sondern Diplomatie, Erkundung, Handwerk, autarke Landwirtschaft, historisches Wissen.
3. **Visuelle QA mit Puppeteer:** `/dev-story` schließt Features erst ab, wenn ein Screenshot in `production/qa/evidence/` abgelegt und verifiziert wurde (`node scripts/verify_in_browser.cjs`).
4. **Progressives Lexikon:** Automatische Freischaltung von Artikeln durch Erkundung und Aufgaben.
