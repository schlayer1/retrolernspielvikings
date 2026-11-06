# Balance Check: Wikinger-Geschichtslernspiel (12 Runden & Ökonomie)

**Datum**: 2026-11-06  
**Geprüft durch**: balance-check skill  
**System**: Wirtschaft, Handwerk, Siedlungsbau & Lernprogression  

---

### Data Sources Analyzed
- `src/data/chapters.ts` (12 historische Kapitel, Aufgabenstrukturen & Quizzes)
- `src/data/items.ts` (25 Items, 10 Crafting-Rezepte, 12 Siedlungsbau-Projekte)
- `src/data/lexicon.ts` (27 progressive Lexikon-Einträge)
- `src/data/relics.ts` (5 historische Relikte)
- `src/systems/GameState.ts` (Inventar-Limits, Ressourcen-Zähler & Fortschritts-Flags)

---

### Health Summary: HEALTHY

---

### Outliers Detected
| Item / Wert | Erwarteter Bereich | Tatsächlich | Bewertung |
| :--- | :--- | :--- | :--- |
| **Kapitel-Pacing** | 3–5 Teilaufgaben pro Kapitel | 4 Aufgaben fest gegatet | Ausgewogen (Exakt 4 Meilensteine pro Runde) |
| **Rohstoffkosten Bauten** | 2–5 Einheiten Primärrohstoffe | 3–4x Bauholz + 1–2x Spezialitems | Ideal für Schulunterricht ohne Grinding |
| **Crafting-Multiplikatoren** | 1–5 Resultate pro Rezept | 1–5 Stück | Keine Überschwemmung des Inventars |
| **Quiz-Schwierigkeit** | 3–4 Fragen pro Kapitel | 3–4 multiple-choice Fragen | Didaktisch abgesichert |

---

### Degenerate Strategies Found
- **Keine dominanten oder degenerierten Strategien gefunden**:
  - Da alle 12 Kapitel linear über historische Zeitepochen (ca. 780 bis 1066 n. Chr.) gegatet sind, kann kein Kapitel übersprungen oder „out of order“ abkürzend gegrindet werden.
  - Ressourcen auf der Fjordkarte regenerieren sich maßvoll oder sind kapitelgebunden.
  - Es existieren keine unendlichen Tauschschleifen (z. B. Silberdirham gegen Bernstein).

---

### Progression Analysis
Die Lernkurve ist in 4 didaktische Hauptblöcke unterteilt:

```
[Frühzeit & Mythos]       Kapitel 1–3  (Hof am Fjord, Blót-Götterkult, Klinker-Schiffbau)
[Expansion & Handel]      Kapitel 4–7  (Lindisfarne, Dnepr-Waräger, Paris-Danegeld, Danelag)
[Christianisierung & Recht] Kapitel 8–9  (Harald Blauzahn Jelling, Althing Island)
[Atlantik-Überquerung & Epochenwende] Kapitel 10–12 (Grönland, Vinland-Amerika, Stamford Bridge)
```

- **Dead Zones**: 0 (Jedes Kapitel bringt neue Spielwelt-Objekte, Charaktere und Bauten).
- **Power Spikes**: Entfallen, da friedenspädagogisches Spiel ohne Kampfwerte/DPS.
- **Content Gates**: Sauber an Mentoren-Gespräch, Sammeln, Bauen und Quiz gekoppelt.

---

### Recommendations
| Priorität | Thema | Empfohlene Maßnahme | Auswirkung |
| :--- | :--- | :--- | :--- |
| **Niedrig** | Vorratsgrube Ch 1 | Zusätzliche Mini-Belohnung bei Schafsfütterung | Erhöht Entdeckerfreude |
| **Niedrig** | Quiz-Erklärungen | Bei Fehlversuch sanften Hinweistext einblenden | Stärkt Lerneffekt für schwächere Schüler |

---

### Values That Need Attention
- Keine kritischen Werte. Alle Werte in `src/data/items.ts` und `src/data/chapters.ts` sind harmonisch aufeinander abgestimmt.
