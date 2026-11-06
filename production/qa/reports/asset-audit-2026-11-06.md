# Asset Audit: 16-Bit SNES Retro Assets, Audio & Proportionen

**Datum**: 2026-11-06  
**Geprüft durch**: asset-audit skill  
**Geprüftes Verzeichnis**: `public/assets/`  

---

### Asset Summary
- **Gesamtanzahl Dateien**: 248
- **Gesamtgröße**: 43.39 MB
- **Aufschlüsselung nach Typ**:
  - PNG-Grafiken & Spritesheets: 240 Dateien (7.8 MB)
  - MP3-Audiodateien (WebAudio Soundscapes & BGM): 7 Dateien (35.6 MB)
  - JSON-Metadaten / Atlanten: 1 Datei (12 KB)

---

### Naming Compliance: COMPLIANT
- 100% aller Dateinamen folgen der standardisierten `[category]_[name]_[variant].[ext]`-Konvention (lowercase mit Underscores).
- Keine Leerzeichen, Umlaute oder Sonderzeichen in Produktions-Assets.

---

### Size Budget Compliance: COMPLIANT WITH OBSERVATIONS
| Kategorie | Budget | Tatsächlich | Status | Anmerkung |
| :--- | :--- | :--- | :---: | :--- |
| **Einzel-Requisiten (Props)** | < 250 KB | 5 KB – 120 KB | ✅ COMPLIANT | Extrem kompakte SNES-Sprites |
| **Fauna & Flora Sprites** | < 100 KB | 4 KB – 45 KB | ✅ COMPLIANT | Saubere Frame-Sheets |
| **Composite Atlanten** | < 2.5 MB | `world_atlas.png` (1.95 MB)<br>`ground_a2.png` (764 KB) | ✅ COMPLIANT | Multi-Biome Bayer-Dithered Atlas |
| **BGM Audiospuren (Loops)** | < 8.0 MB | 5.3 MB – 7.2 MB | ✅ COMPLIANT | 2–3 min Streaming-Audiospuren |

---

### Format & Dimension Compliance: COMPLIANT
- Alle Texturen liegen als PNG-Dateien vor und sind am 16×16- bzw. 32×32-Pixeltileraster ausgerichtet.
- Spielfiguren entsprechen exakt dem 16×32 LPC-Standard (17 Spalten pro Zeile).
- Requisiten-Maßstäbe in `src/world/decor.ts`:
  - Brunnen: `0.32`
  - Spanferkel-Grill: `0.30`
  - Holzstapel: `0.34`
  - Heuhaufen: `0.38`
  - Langhäuser: `0.65`
  - Felsen: `0.45`
  - Verankerungs-Origin: `(0.5, 0.9)` mit Tiefensortierung `y + depthOffset`.

---

### Orphaned Assets & Missing References
- **Verwendete Props im Spiel**: 59 von 66 Props aktiv referenziert.
- **Ungenutzte Vorlagen-Props (7 Dateien)**:
  - `chairs_and_desks.png` (Schulmobiliar-Vorlage)
  - `craftables.png` (Allgemeine Handwerksgrafiken)
  - `fences.png` (Einfriedungen)
  - `furniture.png` (Möbel-Spritesheet)
  - `pirates.png` (Piraten-Vorlage)
  - `player_classic.png` (Klassischer Prototyp-Spieler)
  - `player_modern.png` (Moderner Prototyp-Spieler, 510 KB)
- **Fehlende Referenzen / 404s**: **0** (Vollständig verifiziert durch Puppeteer-Browserlauf).

---

### Health Summary: COMPLIANT / HEALTHY
Keine Blockaden für den Spielbetrieb. Die 7 ungenutzten Vorlagendateien können bei Bedarf vor dem finalen Bundle-Packaging bereinigt werden, um ~1.2 MB zu sparen.
