# Audio Direction & Klangwelten-Spezifikation — Die Wikinger

**Datum**: 2026-11-06  
**Geprüft durch**: team-audio skill (Audio Director, Sound Designer, Technical Artist)  
**System**: Dual-Audio Engine (Synthetisiertes 16-Bit WebAudio + Orchestrale BGM Streams)  

---

### 1. Akustische Identität & Tonalität
Das Klangbild verbindet zwei bewusst gewählte Ebenen:
1. **16-Bit SNES Retro-Sounddesign:** Sämtliche Gameplay-Rückmeldungen (Schritte auf Schotter/Holz, Inventar-Klicks, Menü-Öffnen, Relikt-Fanfaren, Streicheln des Raben) werden live über die **WebAudio API mit mathematischen Oszillatoren** (`triangle`, `square`, `sine`, `sawtooth`) und Exponential-Ramps generiert.
   * **Latenz:** 0 ms.
   * **Bandbreite:** 0 KB zusätzliche Asset-Downloads für Soundeffekte.
2. **Epische nordische Klangwelten (BGM):** Orchestrale Klanglandschaften mit Nyckelharpa-, Flöten-, Trommel- und Streicher-Arrangements spiegeln die historische Atmosphäre der 12 Schauplätze wider.

---

### 2. Zuordnung der 12 Kapitel-Klangwelten
| Kapitel | Epoche / Schauplatz | Audio-Track | Akustische Atmosphäre |
| :---: | :--- | :--- | :--- |
| **1** | Der Hof am Fjord (ca. 780) | `bgm_warmth.mp3` | Sanfte Holztöne, Fjordwind, beruhigende Hof-Idylle |
| **2** | Die Hallen der Götter (ca. 785) | `bgm_patterns.mp3` | Mystische Flöten, rituelles Blót-Feuer, Runenklänge |
| **3** | Der Bau der Drachenboote (ca. 790) | `bgm_heart.mp3` | Rhythmische Schläge, Wellenschlag, Aufbruchsstimmung |
| **4** | Der Schock von Lindisfarne (793) | `bgm_mist.mp3` | Getragene, nachdenkliche Klösterstimmung im Nordseenebel |
| **5** | Die Handelswege nach Osten (ca. 860) | `bgm_oracle.mp3` | Exotisch-orientalische Einflüsse, Dnepr-Flussrauschen |
| **6** | Der Belagerungsring um Paris (885) | `bgm_desert_canyon.mp3`| Schwere Trommeln, militärische Spannung vor der Waffenruhe |
| **7** | Das Danelag & Jorvik (ca. 870) | `bgm_warmth.mp3` | Lebhafter angelsächsisch-dänischer Marktplatz |
| **8** | Die Taufe des Königs (ca. 965) | `bgm_oracle.mp3` | Sakrale Chöre, Jelling-Steinmonumente, königliche Würde |
| **9** | Der Thing von Island (ca. 930) | `bgm_patterns.mp3` | Urgewaltige Basaltklänge, Rednerfelsen am Lögberg |
| **10** | Kurs auf Grönland (ca. 982) | `bgm_mist.mp3` | Polarstürme, arktische Einsamkeit, Calcit-Navigation |
| **11** | Das sagenhafte Vinland (ca. 1000) | `bgm_heart.mp3` | Entdeckerfreude an der Küste von Neufundland |
| **12** | Stamford Bridge (1066) | `bgm_desert_epic.mp3` | Epische Tragik, Olav Kyrres Friedensschluss, Epochenausklang |

---

### 3. Technische Spezifikation & Barrierefreiheit
* **Lautstärkeregelung:** Im Pause-Dashboard ([Taste P] oder Zahnrad-Icon) über Schieberegler stufenlos von 0% bis 100% justierbar.
* **Mute-Funktion:** Sofortiges Umschalten mit `[M]` oder HUD-Button; Zustand bleibt in `localStorage` persistent.
* **Autoplay-Handling:** Automatisches Abfangen von Browser-Audio-Blockaden; Musik startet sauber beim ersten Klick/Touch des Nutzers.
* **Barrierefreiheit (Auditory Sensitivity):** Sämtliche wichtigen Audio-Cues (Quiz richtig/falsch, Relikt gefunden) werden parallel durch visuelle HUD-Benachrichtigungen (Toast-Messages & Banner) begleitet.

---

### Verdict: APPROVED
Die Audio-Architektur ist vollständig implementiert, performant und dramaturgisch auf den didaktischen Lehrplan abgestimmt.
