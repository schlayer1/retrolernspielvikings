# Release Checklist: Die Wikinger (Vom Fjord nach Vinland)

**Datum**: 2026-11-06  
**Geprüft durch**: release-checklist skill  
**Plattform-Fokus**: Web & Epochenhub Retro Games (Desktop & iPad/Mobile)  
**Zertifizierungs-Tier**: Web / Schuleinsatz (`cert_tier: none / web`)  

---

### Phase 1: Code Readiness & Stabilität
- [x] **Quellcode-Audit (`src/`)**: 15 TypeScript-Quelldateien geprüft
  - `TODO`-Kommentare: 0
  - `FIXME`-Kommentare: 0
  - `HACK`-Kommentare: 0
  - Unbehandelte `console.log`: 0 (1 informatives Begleiter-Log)
- [x] **Vite Produktionsbuild**: 0 Fehler, minifiziert und optimiert
- [x] **Layout-Stabilitätsprüfung**: 117 platzierte Objekte auf der Spielkarte ohne Überlappungen
- [x] **Automatisierte Puppeteer-Browserprüfung**:
  - 8/8 Pflicht-Screenshots erfasst
  - Konsolenfehler: 0
  - Fehlgeschlagene Netzwerkressourcen (404/500): 0
- [x] **Speicher-Persistenz**: `SaveManager` speichert Kapitelstand, gesammelte Relikte, Inventar und freigeschaltete Lexikonartikel sicher im Browser-`localStorage`.

---

### Phase 2: Didaktik- & Content Readiness
- [x] **12 historische Runden vollständig bespielbar**:
  - Kapitel 1 bis 12 mit vollständigen Einführungsdialogen, Aufgabenstellungen und Quizzes.
  - Fachbegriff-Tooltips mit Erklärungen bei Klick.
- [x] **Progressives Wissenslexikon**:
  - Alle 27 Fachbegriffe (Futhark, Blót, Langhaus, Klinkerbau, Drakkar, Althing, etc.) mit historisch fundierten Erklärungstexten und Entdeckungs-Zähler (`X / 27`).
  - Vorlesefunktion (Web Speech API) für Inklusion.
- [x] **Didaktisches 1-Klick A4-Druckblatt (`PrintSheet`)**:
  - Generiert druckfertige, tintensparende Schüler-Hefterblätter mit Kapitelzusammenfassung, Quiz-Ergebnis, Relikten und Freitext-Reflexionsfeld.
- [x] **Friedenspädagogisches Konfliktmodell**:
  - Konsequenter Verzicht auf Waffengewalt oder Shooter-Mechaniken; Fokus auf Landwirtschaft, Handwerk, Schiffbau, Handel und Rechtsprechung.

---

### Phase 3: Epochenhub-Integration
- [x] **Titel & Metadaten**: *"Die Wikinger: Vom Fjord nach Vinland (780–1066 n. Chr.)"*
- [x] **Cover-Grafik**: Hochauflösendes 16-Bit Spielwelt-Cover in `public/assets/covers/vikings_cover.png` im Epochenhub synchronisiert.
- [x] **Routing**: Direkte Einbindung in die Epochenleiste des Hauptportals.
- [x] **Git Deployment**: Beide Repositories (`retrolernspielvikings` & `epochenhub`) auf aktuellem Stand im Branch `main`.

---

### Release-Empfehlung: 🟢 READY FOR RELEASE
Das Projekt erfüllt alle Anforderungen der Release-Checkliste und ist uneingeschränkt bereit für den praktischen Einsatz im Geschichtsunterricht.
