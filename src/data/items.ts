export type VikingItemId =
  | 'gerste_roggen'
  | 'met_krug'
  | 'schafmilch'
  | 'wildbret_braten'
  | 'fisch_trocken'
  | 'bauholz'
  | 'kiefernharz'
  | 'schiffsteer'
  | 'raseneisenerz'
  | 'klinkernagel'
  | 'eisen_axt'
  | 'runen_amulett'
  | 'silber_dirham'
  | 'danegeld_beutel'
  | 'wolle_tuch'
  | 'bienenwachs'
  | 'taufkerze'
  | 'gesetzes_rolle'
  | 'sonnenstein_roh'
  | 'sonnenstein_poliert'
  | 'tausch_buendel'
  | 'heil_kraeuter'
  | 'wundsalbe'
  | 'bernstein_perle';

export type VikingItemCategory = 'food' | 'material' | 'tool' | 'culture';

export interface VikingItemDef {
  id: VikingItemId;
  name: string;
  category: VikingItemCategory;
  desc: string;
  historicalNote: string;
  icon: string;
  foodValue?: number;
}

export const VIKING_ITEMS: Record<VikingItemId, VikingItemDef> = {
  gerste_roggen: {
    id: 'gerste_roggen',
    name: 'Gerste & Roggen',
    category: 'food',
    desc: 'Kälteresistentes Getreide für Fladenbrot, Grütze und Bier.',
    historicalNote: 'Gerste war das Grundnahrungsmittel der Wikingergesellschaft und diente als Malz für Bier und Festmet.',
    icon: '/assets/icons/getreide.png',
    foodValue: 20,
  },
  met_krug: {
    id: 'met_krug',
    name: 'Nordischer Honigmet',
    category: 'food',
    desc: 'Würziger, vergorener Bienenhonig mit Fjordquellwasser in Tonkrügen.',
    historicalNote: 'Met war das rituelle Kultgetränk bei Blótfesten und Thingversammlungen der Asen-Götter.',
    icon: '/assets/icons/blot.png',
    foodValue: 25,
  },
  schafmilch: {
    id: 'schafmilch',
    name: 'Frische Schaf- & Ziegenmilch',
    category: 'food',
    desc: 'Nahrhafte Milch zur Herstellung von Skyr und Käse.',
    historicalNote: 'Schafe und Ziegen waren die wichtigsten Nutztiere in den felsigen Fjordtälern Norwegens und Islands.',
    icon: '/assets/icons/ziegenkaese.png',
    foodValue: 18,
  },
  wildbret_braten: {
    id: 'wildbret_braten',
    name: 'Gebratenes Wildschwein',
    category: 'food',
    desc: 'Saftiges Fleisch vom offenen Spießbraten über Buchenholz.',
    historicalNote: 'Nach altnordischem Glauben verspeisten die Einherjer in Walhall täglich den Eber Sæhrímnir.',
    icon: '/assets/icons/panis_brot.png',
    foodValue: 35,
  },
  fisch_trocken: {
    id: 'fisch_trocken',
    name: 'Stockfisch (Tørrfisk)',
    category: 'food',
    desc: 'An arktischer Luft getrockneter Kabeljau, jahrelang haltbar.',
    historicalNote: 'Stockfisch war die unverzichtbare Dauerverpflegung für wochenlange Atlantik-Überfahrten.',
    icon: '/assets/icons/garum_fisch.png',
    foodValue: 22,
  },
  bauholz: {
    id: 'bauholz',
    name: 'Eichen- & Kiefernbauholz',
    category: 'material',
    desc: 'Gerade gewachsene Stämme für Schiffsrümpfe und Langhäuser.',
    historicalNote: 'Krumm gewachsene Eichenäste wurden gezielt für die Spanten (Kniehölzer) der Langschiffe gesucht.',
    icon: '/assets/icons/holz.png',
  },
  kiefernharz: {
    id: 'kiefernharz',
    name: 'Kiefernharz & Pech',
    category: 'material',
    desc: 'Duftendes Harz aus nordischen Wäldern zum Teersieden.',
    historicalNote: 'In Teermeilern wurde aus Wurzelkiefern der Schiffsteer gewonnen, der die Klinkerrümpfe wasserdicht machte.',
    icon: '/assets/icons/schiffsteer.png',
  },
  schiffsteer: {
    id: 'schiffsteer',
    name: 'Gesiedeter Schiffsteer',
    category: 'material',
    desc: 'Zähflüssiger Holzteer zur Imprägnierung von Holz und Tauwerk.',
    historicalNote: 'Klinkerboote mussten mindestens einmal im Jahr gründlich mit warmem Holzteer gestrichen werden.',
    icon: '/assets/icons/schiffsteer.png',
  },
  raseneisenerz: {
    id: 'raseneisenerz',
    name: 'Moor-Raseneisenerz',
    category: 'material',
    desc: 'Rostbraune Eisenknollen aus feuchten Fjordmooren.',
    historicalNote: 'Skandinavien gewann sein gesamtes Werkzeugeisen aus oberflächlich gestochenem Raseneisenstein.',
    icon: '/assets/icons/eisenerz.png',
  },
  klinkernagel: {
    id: 'klinkernagel',
    name: 'Eiserne Klinkernägel',
    category: 'tool',
    desc: 'Vierkantige Eisennägel mit Nietenplatten für den Bootsbau.',
    historicalNote: 'Ein einziges Langschiff wie das Gokstad-Schiff benötigte über 3.000 handgeschmiedete Eisennägel.',
    icon: '/assets/icons/klinkernagel.png',
  },
  eisen_axt: {
    id: 'eisen_axt',
    name: 'Wikinger-Bartaxt (Skeggøx)',
    category: 'tool',
    desc: 'Vielseitige Axt zum Holzfällen, Zimmern und zur Jagd.',
    historicalNote: 'Die Bartaxt war das typische Alltags- und Universalwerkzeug jedes freien Bauern (Karl).',
    icon: '/assets/icons/schmiede_hammer.png',
  },
  runen_amulett: {
    id: 'runen_amulett',
    name: 'Geweihtes Runenamulett',
    category: 'culture',
    desc: 'In Knochen geschnitzte Schutzformel mit Futhark-Zeichen.',
    historicalNote: 'Runeninschriften dienten als magische Schutzformeln gegen Krankheit und Gefahren auf See.',
    icon: '/assets/icons/futhark.png',
  },
  silber_dirham: {
    id: 'silber_dirham',
    name: 'Arabischer Silberdirham',
    category: 'culture',
    desc: 'Hochreine Silbermünze aus dem Kalifat von Bagdad.',
    historicalNote: 'Wikinger rechneten nach Silbergewicht (Hackguthandel) – Dirhams wurden mit Waagen grammgenau abgewogen.',
    icon: '/assets/icons/silber_dirham.png',
  },
  danegeld_beutel: {
    id: 'danegeld_beutel',
    name: 'Danegeld-Tributbeutel',
    category: 'culture',
    desc: 'Schwerer Lederbeutel mit Silberbarren und gemünztem Danegeld.',
    historicalNote: 'Herrscher wie Karl der Dicke zahlten hunderttausende Pfund Silber, um Belagerungen zu beenden.',
    icon: '/assets/icons/danegeld.png',
  },
  wolle_tuch: {
    id: 'wolle_tuch',
    name: 'Gewebtes Wolltuch (Vadmal)',
    category: 'material',
    desc: 'Dicht gewebtes Wolltuch von nordischen Schafen.',
    historicalNote: 'Vadmal war die Währung des Nordens: Selbst Steuern und Schiffe wurden in Ellen Wolltuch bezahlt.',
    icon: '/assets/icons/wolle.png',
  },
  bienenwachs: {
    id: 'bienenwachs',
    name: 'Reines Bienenwachs',
    category: 'material',
    desc: 'Goldenes Wachs aus Waldbienenstöcken für Kerzen und Salben.',
    historicalNote: 'Kirchen und Klöster bezahlten hohe Summen für sauberes Bienenwachs für Altarkerzen.',
    icon: '/assets/icons/taufkerze.png',
  },
  taufkerze: {
    id: 'taufkerze',
    name: 'Jelling-Taufkerze',
    category: 'culture',
    desc: 'Festliche Wachskerze für christliche Tauf- und Friedensrituale.',
    historicalNote: 'Symbol für den Epochenwandel unter König Harald Blauzahn um 965 in Jelling.',
    icon: '/assets/icons/taufkerze.png',
  },
  gesetzes_rolle: {
    id: 'gesetzes_rolle',
    name: 'Lögberg-Gesetzesrolle',
    category: 'culture',
    desc: 'In Kalbsleder gebundene Gesetzesaufzeichnung des Althings.',
    historicalNote: 'Der Gesetzessprecher trug die Gesetze jährlich vom Gesetzesfelsen mündlich vor.',
    icon: '/assets/icons/landnamabok.png',
  },
  sonnenstein_roh: {
    id: 'sonnenstein_roh',
    name: 'Rohkristall Islandspat',
    category: 'material',
    desc: 'Ungeschliffener Doppelspatkristall aus isländischen Vulkanen.',
    historicalNote: 'Calcit spaltet einfallendes polarisiertes Himmelslicht in zwei Strahlen.',
    icon: '/assets/icons/sonnenstein.png',
  },
  sonnenstein_poliert: {
    id: 'sonnenstein_poliert',
    name: 'Polierter Sonnenstein',
    category: 'tool',
    desc: 'Fein geschliffenes Navigationsprisma zur Peilung der Sonne.',
    historicalNote: 'Ermöglichte Hochseenavigation selbst bei arktischem Nebel und dichtester Bewölkung.',
    icon: '/assets/icons/relic_sonnenstein.png',
  },
  tausch_buendel: {
    id: 'tausch_buendel',
    name: 'Vinland-Tauschbündel',
    category: 'culture',
    desc: 'Friedenspaket mit Trinkmilch, rotem Wolltuch und Getreide.',
    historicalNote: 'Leif Erikssons Siedler tauschten Milch und Wolle gegen Pelze der einheimischen Skraelinger.',
    icon: '/assets/icons/skraelinger.png',
  },
  heil_kraeuter: {
    id: 'heil_kraeuter',
    name: 'Nordische Heilkräuter',
    category: 'food',
    desc: 'Schafgarbe, Johanniskraut und Beifuß von den Berghängen.',
    historicalNote: 'Kräuterkundige Frauen wie Astrid wussten Wunden und Fieber mit Fjordkräutern zu heilen.',
    icon: '/assets/icons/wundsalbe.png',
    foodValue: 15,
  },
  wundsalbe: {
    id: 'wundsalbe',
    name: 'Wund- & Friedenssalbe',
    category: 'tool',
    desc: 'Desinfizierende Kräutersalbe mit Bienenwachs und Harz.',
    historicalNote: 'Diente nach Gefechten wie Stamford Bridge zur humanitären Versorgung Verwundeter beider Seiten.',
    icon: '/assets/icons/wundsalbe.png',
  },
  bernstein_perle: {
    id: 'bernstein_perle',
    name: 'Polierte Bernsteinperle',
    category: 'culture',
    desc: 'Fossiles Harz der Ostsee, poliert für Halsschmuck und Fernhandel.',
    historicalNote: 'Bernstein war das "Gold des Nordens" und wurde bis Rom und Bagdad hoch geschätzt.',
    icon: '/assets/icons/bernstein.png',
  },
};

// ============================================================
// HANDWERK & REZEPTE (Taste [C])
// ============================================================
export interface VikingRecipe {
  id: string;
  name: string;
  resultItem: VikingItemId;
  resultCount: number;
  ingredients: { item: VikingItemId; count: number }[];
  minChapter: number;
  desc: string;
}

export const VIKING_RECIPES: VikingRecipe[] = [
  {
    id: 'craft_klinkernagel',
    name: 'Klinkernägel schmieden',
    resultItem: 'klinkernagel',
    resultCount: 5,
    ingredients: [
      { item: 'raseneisenerz', count: 2 },
      { item: 'bauholz', count: 1 },
    ],
    minChapter: 1,
    desc: 'Schmiede aus verhüttetem Raseneisenerz stabile Nieten für den Bootsbau.',
  },
  {
    id: 'craft_runen_amulett',
    name: 'Futhark-Runenamulett schnitzen',
    resultItem: 'runen_amulett',
    resultCount: 1,
    ingredients: [
      { item: 'bauholz', count: 1 },
      { item: 'bernstein_perle', count: 1 },
    ],
    minChapter: 2,
    desc: 'Ritze heilige Schutzrunen der Asen in duftendes Hartholz.',
  },
  {
    id: 'craft_schiffsteer',
    name: 'Schiffsteer sieden',
    resultItem: 'schiffsteer',
    resultCount: 2,
    ingredients: [
      { item: 'kiefernharz', count: 2 },
      { item: 'bauholz', count: 1 },
    ],
    minChapter: 3,
    desc: 'Siede klebriges Kiefernharz zu wasserdichtem Holzteer für Langschiffe.',
  },
  {
    id: 'craft_silber_dirham',
    name: 'Silberdirham eichen & wiegen',
    resultItem: 'silber_dirham',
    resultCount: 3,
    ingredients: [
      { item: 'bernstein_perle', count: 1 },
      { item: 'fisch_trocken', count: 2 },
    ],
    minChapter: 5,
    desc: 'Tausche Ostsee-Bernstein und Trockenfisch gegen arabische Silbermünzen.',
  },
  {
    id: 'craft_danegeld_beutel',
    name: 'Danegeld-Tributbeutel packen',
    resultItem: 'danegeld_beutel',
    resultCount: 1,
    ingredients: [
      { item: 'silber_dirham', count: 3 },
      { item: 'wolle_tuch', count: 1 },
    ],
    minChapter: 6,
    desc: 'Schnüre Danegeld-Silberbarren in festes Tuch zur Abwendung von Zerstörung.',
  },
  {
    id: 'craft_taufkerze',
    name: 'Jelling-Taufkerze ziehen',
    resultItem: 'taufkerze',
    resultCount: 2,
    ingredients: [
      { item: 'bienenwachs', count: 2 },
      { item: 'wolle_tuch', count: 1 },
    ],
    minChapter: 8,
    desc: 'Ziehe goldgelbe Kerzen aus Bienenwachs für die Holzkirche von Jelling.',
  },
  {
    id: 'craft_gesetzes_rolle',
    name: 'Lögberg-Gesetzesrolle binden',
    resultItem: 'gesetzes_rolle',
    resultCount: 1,
    ingredients: [
      { item: 'wolle_tuch', count: 1 },
      { item: 'gerste_roggen', count: 2 },
    ],
    minChapter: 9,
    desc: 'Binde die schriftliche Aufzeichnung der Thinggesetze mit festem Lederband.',
  },
  {
    id: 'craft_sonnenstein_poliert',
    name: 'Sonnenstein-Kristall schleifen',
    resultItem: 'sonnenstein_poliert',
    resultCount: 1,
    ingredients: [
      { item: 'sonnenstein_roh', count: 1 },
      { item: 'kiefernharz', count: 1 },
    ],
    minChapter: 10,
    desc: 'Poliere das Calcit-Doppelprisma für die arktische Nebelpeilung.',
  },
  {
    id: 'craft_tausch_buendel',
    name: 'Vinland-Tauschbündel schnüren',
    resultItem: 'tausch_buendel',
    resultCount: 1,
    ingredients: [
      { item: 'schafmilch', count: 2 },
      { item: 'wolle_tuch', count: 1 },
    ],
    minChapter: 11,
    desc: 'Packe frische Schafmilch und rotes Wolltuch für den friedlichen Tausch.',
  },
  {
    id: 'craft_wundsalbe',
    name: 'Wund- & Friedenssalbe mischen',
    resultItem: 'wundsalbe',
    resultCount: 2,
    ingredients: [
      { item: 'heil_kraeuter', count: 2 },
      { item: 'bienenwachs', count: 1 },
    ],
    minChapter: 12,
    desc: 'Mische desinfizierende Fjordkräuter mit Bienenwachs für Versehrte.',
  },
];

// ============================================================
// SIEDLUNGS- & INFRASTRUKTUR-BAUTEN (Taste [B])
// ============================================================
export interface VikingBuildingProject {
  id: string;
  name: string;
  chapter: number;
  propKey: string;
  x: number;
  y: number;
  costText: string;
  desc: string;
  historicalSignificance: string;
}

export const VIKING_BUILDINGS: VikingBuildingProject[] = [
  {
    id: 'build_k01_langhaus',
    name: 'Hof-Langhaus & Vorratsgrube',
    chapter: 1,
    propKey: 'viking_longhouse_thatched',
    x: 42,
    y: 22,
    costText: '4x Bauholz, 2x Gerste',
    desc: 'Errichte das winterfeste Wohnstallhaus mit gedecktem Reetdach und Vorratslager.',
    historicalSignificance: 'Das Langhaus bot Schutz vor arktischer Kälte und vereinte Hofgesinde, Vieh und Vorräte unter einem Dach.',
  },
  {
    id: 'build_k02_blot_hain',
    name: 'Heiliger Blót-Opferhain & Runenstein',
    chapter: 2,
    propKey: 'viking_blot_fire_altar',
    x: 62,
    y: 26,
    costText: '2x Bauholz, 1x Runenamulett',
    desc: 'Weihe den kreisförmigen Opferaltar der Asen und Vanen im Hain.',
    historicalSignificance: 'Ort ritueller Festversammlungen, an dem die Sippe den Bund mit den Schutzgöttern feierte.',
  },
  {
    id: 'build_k03_werft',
    name: 'Klinker-Schiffswerft am Fjord',
    chapter: 3,
    propKey: 'viking_drakkar_full',
    x: 24,
    y: 18,
    costText: '4x Bauholz, 2x Klinkernägel, 1x Schiffsteer',
    desc: 'Baue die Helling mit Klinkerrumpf und Takelage direkt an die Fjordkante.',
    historicalSignificance: 'Die Wiege nordischer Seefahrt: Hier entstanden die elastischen Drakkar-Schiffe.',
  },
  {
    id: 'build_k04_monastery_protection',
    name: 'Kloster-Scriptorium & Schutzmauer',
    chapter: 4,
    propKey: 'monastery_scriptorium_desk',
    x: 52,
    y: 20,
    costText: '3x Bauholz, 1x Wolltuch',
    desc: 'Rette das Schreibpult und schütze das Scriptorium vor Feuer.',
    historicalSignificance: 'Ort unschätzbarer Schriftkultur, an dem das berühmte Evangeliar von Lindisfarne geschaffen wurde.',
  },
  {
    id: 'build_k05_waraeger_kontor',
    name: 'Waräger-Handelskontor mit Holzrollen',
    chapter: 5,
    propKey: 'viking_camp_tent',
    x: 66,
    y: 34,
    costText: '3x Bauholz, 1x Silberdirham',
    desc: 'Errichte das Flusskontor an der Dnepr-Wasserscheide mit Holzrollen.',
    historicalSignificance: 'Schlüsselstelle des osteuropäischen Fernhandels zwischen Nowgorod, Kiew und Byzanz.',
  },
  {
    id: 'build_k06_paris_bridgehead',
    name: 'Seine-Brückenbefestigung & Verhandlungstisch',
    chapter: 6,
    propKey: 'paris_fortress_gate',
    x: 38,
    y: 46,
    costText: '4x Bauholz, 1x Danegeldbeutel',
    desc: 'Verstärke die Holzbrücke über die Seine zur Abwendung weiterer Kämpfe.',
    historicalSignificance: 'Strategischer Brückenkopf, der Paris 885/886 schützte und zur diplomatischen Einigung führte.',
  },
  {
    id: 'build_k07_jorvik_market',
    name: 'Jorvik-Marktplatz & Danelag-Gericht',
    chapter: 7,
    propKey: 'viking_cottage_gable',
    x: 49,
    y: 29,
    costText: '3x Bauholz, 2x Wolltuch',
    desc: 'Baue die angelsächsisch-dänische Handwerksgasse mit Gerichtsstätte.',
    historicalSignificance: 'Das pulsierende Herz des Danelag, wo sich dänische und englische Kultur dauerhaft verbanden.',
  },
  {
    id: 'build_k08_jelling_monument',
    name: 'Großes Jelling-Steinmonument & Holzkirche',
    chapter: 8,
    propKey: 'viking_god_totem_odin',
    x: 58,
    y: 42,
    costText: '4x Bauholz, 1x Taufkerze',
    desc: 'Richte das monumentale königliche Denkmal Harald Blauzahns auf.',
    historicalSignificance: 'Das nationale Einigungs- und Taufdenkmal, das Dänemark ins christliche Europa integrierte.',
  },
  {
    id: 'build_k09_althing_site',
    name: 'Althing-Thingstätte am Lögberg',
    chapter: 9,
    propKey: 'viking_runestone_classic',
    x: 28,
    y: 38,
    costText: '3x Bauholz, 1x Gesetzesrolle',
    desc: 'Richte die Thinghütten (Búðir) in der Vulkanschlucht von Þingvellir her.',
    historicalSignificance: 'Eine der ältesten Parlamentsstätten der Menschheit, gegründet 930 für gerechte Streitschlichtung.',
  },
  {
    id: 'build_k10_brattahlid_hall',
    name: 'Soden-Langhaus in Brattahlíð & Peilstand',
    chapter: 10,
    propKey: 'viking_round_hut',
    x: 16,
    y: 44,
    costText: '3x Bauholz, 1x Sonnenstein',
    desc: 'Errichte das dickwandige Grassodenhaus Eriks des Roten am Eriksfjord.',
    historicalSignificance: 'Pioniersiedlung in Grönland, von der aus die Entdeckung Nordamerikas ihren Ausgang nahm.',
  },
  {
    id: 'build_k11_vinland_station',
    name: 'Vinland-Station L’Anse aux Meadows',
    chapter: 11,
    propKey: 'viking_fishnet_drying',
    x: 64,
    y: 52,
    costText: '3x Bauholz, 1x Tauschbündel',
    desc: 'Baue die europäische Entdeckerstation an den Ufern Neufundlands.',
    historicalSignificance: 'Erste europäische Ansiedlung in der Neuen Welt, 500 Jahre vor Christoph Kolumbus.',
  },
  {
    id: 'build_k12_stamford_memorial',
    name: 'Friedensmemorial an der Stamford Bridge',
    chapter: 12,
    propKey: 'bridge_timber_crossing',
    x: 44,
    y: 56,
    costText: '4x Bauholz, 1x Wundsalbe',
    desc: 'Errichte das Friedensmonument und die Sanitätsstation am Fluss Derwent.',
    historicalSignificance: 'Symbolischer Meilenstein für das friedliche Ende des Wikingerzeitalters unter Olav Kyrre 1066.',
  },
];
