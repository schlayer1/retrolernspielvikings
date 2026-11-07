/**
 * 5 Didaktische Mitmach-Stationen für Die Wikinger (stations.ts)
 * Interaktive historische Mini-Simulationen:
 * 1. Langschiff-Klinkerbau & Holznägel (Schiffbaukunst)
 * 2. Sonnenstein & Schattenkompass (Nordsee-Navigation)
 * 3. Hacksilber-Feinwaage in Hedeby (Geldloser Fernhandel)
 * 4. Jelling-Runen & Jüngeres Futhark (Schrift- & Gedenkkultur)
 * 5. Althing am Gesetzesfelsen (Rechtsfindung & Thingfrieden)
 */

export interface InteractiveStation {
  id: string;
  chapterId: number;
  title: string;
  subtitle: string;
  type: 'crop_rotation' | 'mortar_crafting' | 'symbol_decoder' | 'arch_construction' | 'scale_weighing';
  x: number;
  y: number;
  lexiconUnlockId: string;
  description: string;
  instruction: string;
  successMessage: string;
  config: Record<string, any>;
}

export const STATIONS: InteractiveStation[] = [
  {
    id: 'station_langschiff_bau',
    chapterId: 3,
    title: 'Klinkerbau des Langschiffs (Drakkar)',
    subtitle: 'Nordische Schiffbaukunst: Eichenspanten, Klinkerung & Teer',
    type: 'arch_construction',
    x: 480,
    y: 440,
    lexiconUnlockId: 'klinkerbau',
    description:
      'Wikinger-Langschiffe wurden in genialer Klinkerbauweise gefertigt: Die elastischen Eichenplanken überlappten wie Dachziegel und wurden mit eisernen Nieten vernietet. Moos und geteerte Tierhaare dichteten die Fugen ab.',
    instruction:
      'Vollende die 4 Konstruktionsschritte der Werft, um das seetüchtige Langschiff auf den Fjord zu bringen!',
    successMessage:
      'Der Klinkerbau ist vollendet! Das flexible Langschiff gleitet unversehrt durch tosende Atlantikwellen.',
    config: {
      steps: [
        'Massiven T-förmigen Eichenkiel als tragendes Rückgrat im Fjordbett aufbocken',
        'Elastische Eichenplanken überlappend anheften und mit Eisennieten vernieten',
        'Schiffsfugen mit geteerten Tierhaaren und Kiefernharz wasserdicht kalfatern',
        'Drachenkopf (Gjallar) am Steven aufstecken und Rahsegel aus Wolle hissen',
      ],
    },
  },
  {
    id: 'station_sonnenstein',
    chapterId: 4,
    title: 'Offene-See-Navigation mit dem Sonnenstein',
    subtitle: 'Nautik im Nordatlantik: Calcit-Kristall, Polarisation & Sonnenkompass',
    type: 'symbol_decoder',
    x: 640,
    y: 560,
    lexiconUnlockId: 'sonnenstein',
    description:
      'Ohne Magnetkompass steuerten die Nordmänner über Tausende Kilometer über das offene Meer nach Island und Grönland. Mit einem doppelbrechenden Calcit-Kristall (Sonnenstein) lokalisierten sie die Sonne selbst bei dichtestem Nebel und Wolkendecke.',
    instruction:
      'Lese die drei optischen Himmelszeichen ab, um den Westkurs nach England zu halten!',
    successMessage:
      'Kurs perfekt korrigiert! Die Silhouette der britischen Küste taucht aus dem Morgennebel auf.',
    config: {
      symbols: [
        { symbol: '💎 Doppelbrechung (Calcit)', meaning: 'Beide Lichtpunkte deckungsgleich: Die exakte Sonnenposition im Nebel' },
        { symbol: '🪵 Sonnenkompass (Sonnenscheibe)', meaning: 'Schattenstab zeigt die geografische Ost-West-Referenzlinie' },
        { symbol: '🐦 Rabenflug (Floki-Peilung)', meaning: 'Aufsteigender Rabe fliegt geradewegs auf das nächste Festland zu' },
      ],
    },
  },
  {
    id: 'station_silberwaage',
    chapterId: 5,
    title: 'Hacksilber-Waage im Fernhandelsplatz Hedeby',
    subtitle: 'Gewichtsgeldwirtschaft: Dirhams, Barren & Waaggewichte',
    type: 'scale_weighing',
    x: 380,
    y: 720,
    lexiconUnlockId: 'hacksilber',
    description:
      'In skandinavischen Handelszentren wie Hedeby und Birka zählte nicht die Prägung einer Münze, sondern ausschließlich das reine Silberfeingewicht. Arabische Silber-Dirhams und Schmuckspangen wurden kurzerhand zerhackt (Hacksilber).',
    instruction:
      'Bringe die Bronzewaage mit passenden Hacksilberstücken ins Gleichgewicht mit dem Walrosszahn!',
    successMessage:
      'Präzises Silberfeingewicht bestätigt! Das edle Tauschgeschäft mit den Händlern aus Byzanz ist besiegelt.',
    config: {
      targetWeight: 18,
      unit: 'Wikinger-Öre (Gramm Silber)',
      availableWeights: [1, 2, 5, 10],
    },
  },
  {
    id: 'station_futhark_runen',
    chapterId: 8,
    title: 'Jelling-Runenstein: Die Taufe des Nordens',
    subtitle: 'Jüngeres Futhark & Runenritzung für König Harald Blauzahn',
    type: 'symbol_decoder',
    x: 820,
    y: 620,
    lexiconUnlockId: 'juengeres_futhark',
    description:
      'Auf dem großen Stein von Jelling ließ Harald Blauzahn um 965 n. Chr. die Christianisierung der Dänen und Norweger meißeln. Verwendet wurde das reduzierte 16-teilige Jüngere Futhark im dramatischen Runenschlingen-Stil.',
    instruction:
      'Entziffere die drei zentralen Runeninschriften des Denkmals!',
    successMessage:
      'Königliche Inschrift meisterhaft gedeutet! Haralds Name und die Einigung des Nordens sind für die Nachwelt bewahrt.',
    config: {
      symbols: [
        { symbol: 'ᚼ (Hagall)', meaning: 'Harald König bot machen dieses Denkmal' },
        { symbol: 'ᛏ (Tyr)', meaning: 'Der ganz Dänemark und Norwegen gewann' },
        { symbol: 'ᛋ (Sol)', meaning: 'Und der die Dänen zum christlichen Glauben führte' },
      ],
    },
  },
  {
    id: 'station_thing_recht',
    chapterId: 9,
    title: 'Thingordnung am Gesetzessprecherfelsen (Lögberg)',
    subtitle: 'Rechtsordnung ohne König: Gesetze, Fehde & Wergeld',
    type: 'crop_rotation',
    x: 740,
    y: 840,
    lexiconUnlockId: 'althing',
    description:
      'Das Althing auf Island (gegründet 930 n. Chr.) war eines der ältesten Parlamente der Welt. Unter freiem Himmel trug der gewählte Gesetzessprecher (Lögsögumaður) auswendig ein Drittel des gesamten Rechts vor.',
    instruction:
      'Weise den drei Streitfällen der Thingversammlung den rechtskräftigen Urteilsspruch zu!',
    successMessage:
      'Thingfrieden gewahrt! Die Streitparteien schwören Frieden auf den heiligen Eidring.',
    config: {
      fields: [
        { id: 'case_1', name: '1. Streit um abgetriebenes Schaf im Herbststurm', correctCrop: 'Eigentumsrückgabe gegen Finderlohn in Trockenfisch' },
        { id: 'case_2', name: '2. Blutrache nach Grenzstreit am Fjordhang', correctCrop: 'Zahlung eines vollen Wergeldes in Hacksilber zur Fehdebeilegung' },
        { id: 'case_3', name: '3. Bruch des heiligen Thingfriedens auf dem Lögberg', correctCrop: 'Vollständige Friedlosigkeit (Skóggangur) und Ächtung' },
      ],
      options: [
        'Eigentumsrückgabe gegen Finderlohn in Trockenfisch',
        'Zahlung eines vollen Wergeldes in Hacksilber zur Fehdebeilegung',
        'Vollständige Friedlosigkeit (Skóggangur) und Ächtung',
      ],
    },
  },
];
