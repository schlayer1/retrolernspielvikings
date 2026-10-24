// ============================================================
// ARCHÄOLOGISCHE LEITFUNDE – 5 Historische Relikte der Wikingerzeit
// Versteckte Fundstücke auf der Weltkarte mit interaktivem Mini-Quiz
// ============================================================

export interface VikingRelic {
  id: string;
  name: string;
  epoch: string;
  year: string;
  findLocation: string;
  icon: string;
  x: number;
  y: number;
  minChapter: number;
  historicalContext: string;
  significance: string;
  question: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
}

export const VIKING_RELICS: VikingRelic[] = [
  {
    id: 'relic_oseberg_schiff',
    name: 'Das Oseberg-Schiff & Schlitten',
    epoch: 'Frühe Wikingerzeit & Klinkerbaukunst',
    year: '834 n. Chr.',
    findLocation: 'Schiffbauplatz & Helling am Fjord',
    icon: '/assets/icons/relic_oseberg_schiff.png',
    x: 28,
    y: 22,
    minChapter: 1,
    historicalContext:
      'Im Königs-Schiffsgrab von Oseberg (Norwegen) fanden Archäologen ein über 21 Meter langes, prachtvoll geschnitztes Eichen-Langschiff. Es diente als letzte Ruhestätte für zwei hochgestellte Frauen und enthielt geschnitzte Prunkschlitten, Betten und Textilien.',
    significance:
      'Besterhaltenes Langschiff der Weltgeschichte: Beweist die meisterhafte Klinkerbaukunst und die hohe soziale Stellung vornehmer Frauen in der Wikingerzeit.',
    question: 'Was beweist der archäologische Fund des Oseberg-Schiffes von 834 n. Chr.?',
    options: [
      'Dass Wikinger hochelastische Klinkerschiffe meisterhaft bauten und Frauen hohe Bestattungsehren genossen',
      'Dass die Wikinger überhaupt keine Segel kannten',
      'Dass alle Schiffe aus reinem Eisen geschmiedet wurden'
    ],
    correctIndex: 0,
  },
  {
    id: 'relic_lindisfarne_gospels',
    name: 'Das Evangeliar von Lindisfarne',
    epoch: 'Der Schock von 793 & Klosterkultur',
    year: 'ca. 715–793 n. Chr.',
    findLocation: 'Kloster-Scriptorium auf Holy Island',
    icon: '/assets/icons/relic_lindisfarne_gospels.png',
    x: 56,
    y: 21,
    minChapter: 4,
    historicalContext:
      'Dieses meisterhafte illuminierte Evangelienbuch wurde von Bischof Eadfrith von Lindisfarne auf feinstem Kalbspergament gemalt. Beim verheerenden Wikingerüberfall 793 konnte die unschätzbare Handschrift von den fliehenden Mönchen gerettet und über Jahrhunderte bewahrt werden.',
    significance:
      'Höhepunkt der insularen Buchmalerei: Die Handschrift überstand die Plünderung und bezeugt das Aufeinandertreffen christlicher Schriftkultur und nordischer Überfälle.',
    question: 'Welches Schicksal ereilte das Evangeliar von Lindisfarne beim Überfall 793?',
    options: [
      'Mönche retteten die kostbare Handschrift vor Zerstörung und hüteten sie auf der Flucht',
      'Es wurde von den Wikingern auf See geworfen und ging für immer verloren',
      'Es wurde als Verpackungsmaterial für Trockenfisch verwendet'
    ],
    correctIndex: 0,
  },
  {
    id: 'relic_jelling_stein',
    name: 'Der Große Runenstein von Jelling',
    epoch: 'Reichseinigung & Christianisierung',
    year: 'ca. 965 n. Chr.',
    findLocation: 'Königshügel von Jelling',
    icon: '/assets/icons/relic_jelling_stein.png',
    x: 48,
    y: 38,
    minChapter: 8,
    historicalContext:
      'König Harald Blauzahn ließ diesen dreiseitigen Monumentalstein für seine Eltern Gorm und Thyra errichten. Er trägt die berühmte Inschrift: "König Harald gebot, dieses Denkmal zu setzen... der ganz Dänemark gewann und Norwegen und die Dänen zu Christen machte."',
    significance:
      'Gilt als offizielle "Geburtsurkunde Dänemarks" und zeigt die früheste Christusdarstellung im Norden, kunstvoll verwoben mit heidnischen Drachenschlingen.',
    question: 'Warum wird der Große Runenstein von Jelling als "Taufstein Dänemarks" bezeichnet?',
    options: [
      'Weil er schriftlich die Christianisierung und staatliche Einigung ganz Dänemarks unter König Harald verkündet',
      'Weil aus ihm heiliges Taufwasser für die gesamte Ostsee geschöpft wurde',
      'Weil er von Papst Gregor persönlich aus Rom nach Dänemark getragen wurde'
    ],
    correctIndex: 0,
  },
  {
    id: 'relic_sonnenstein',
    name: 'Der Sonnenstein von Hrafnsey (Islandspat)',
    epoch: 'Atlantik-Nautik & Grönlandfahrt',
    year: 'ca. 982 n. Chr.',
    findLocation: 'Navigations-Peilstand am Eriksfjord',
    icon: '/assets/icons/relic_sonnenstein.png',
    x: 21,
    y: 42,
    minChapter: 10,
    historicalContext:
      'In alten isländischen Sagas wird beschrieben, wie König Olav bei bewölktem Himmel einen Sonnenstein gen Himmel richtete, um die verdeckte Sonne zu sehen. Neuzeitliche Physiker fanden heraus, dass Calcitkristalle polarisiertes Himmelslicht brechen und den Sonnenstand auf wenige Grad genau anzeigen.',
    significance:
      'Geniale optische Navigationshilfe: Machte wochenlange Hochseefahrten durch dichten Polarnebel ohne Magnetkompass erst möglich.',
    question: 'Auf welchem physikalischen Prinzip beruhte die Navigation mit dem Sonnenstein?',
    options: [
      'Polarisation des Himmelslichts: Der Kristall spaltet das Licht und zeigt den Sonnenstand auch bei Wolken und Nebel',
      'Fluoreszenz bei radioaktiver Polarstrahlung',
      'Wärmespeicherung, die bei Sonnenlicht heiss wurde'
    ],
    correctIndex: 0,
  },
  {
    id: 'relic_vinland_fibel',
    name: 'Bronzene Ringnadel von L’Anse aux Meadows',
    epoch: 'Entdeckung Amerikas & Vinland',
    year: 'ca. 1000 n. Chr.',
    findLocation: 'Grabungsstätte L’Anse aux Meadows (Neufundland)',
    icon: '/assets/icons/relic_vinland_fibel.png',
    x: 62,
    y: 50,
    minChapter: 11,
    historicalContext:
      '1968 entdeckten Anne Stine und Helge Ingstad bei Ausgrabungen in Neufundland eine typisch skandinavische Bronzeringnadel (Gewandspange) in einem der Rasensodenhäuser neben Schmiedeschlacke aus lokaler Raseneisenerzverhüttung.',
    significance:
      'Der unanfechtbare wissenschaftliche Beweis: Diese winzige Nadel belegt zweifelsfrei, dass Europäer um das Jahr 1000 n. Chr. in Nordamerika lebten und arbeiteten.',
    question: 'Welche historische Gewissheit lieferte die in Neufundland gefundene Bronzeringnadel?',
    options: [
      'Sie bewies endgültig, dass Wikinger 500 Jahre vor Kolumbus tatsächlich dauerhafte Gebäude in Nordamerika errichteten',
      'Dass die Wikinger Bronze aus China importierten',
      'Dass Neufundland damals eine römische Provinz war'
    ],
    correctIndex: 0,
  },
];
