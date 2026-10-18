export interface LexiconEntry {
  id: string;
  term: string;
  category: 'Siedlung & Alltag' | 'Technik & Seefahrt' | 'Handel & Kultur' | 'Recht & Glaube' | 'Staaten & Wandel';
  definition: string;
  merksatz: string;
  icon: string;
}

export const LEXICON_ENTRIES: LexiconEntry[] = [
  {
    id: 'althing',
    term: 'Das Althing',
    category: 'Recht & Glaube',
    definition: '930 n. Chr. in Þingvellir gegründete gesetzgebende und richterliche Vollversammlung aller freien isländischen Männer. Eines der ältesten noch existierenden Parlamente der Welt.',
    merksatz: 'In Island regierte kein König: Das freie Volk beschloss seine Gesetze selbst auf dem Althing.',
    icon: '/assets/icons/althing.png'
  },
  {
    id: 'asen_vanen',
    term: 'Asen und Vanen',
    category: 'Recht & Glaube',
    definition: 'Die beiden Hauptgöttergeschlechter der nordischen Mythologie: Die kriegerischen und ordnenden Asen (Odin, Thor) und die fruchtbarkeitsspendenden Vanen (Freyr, Freya).',
    merksatz: 'Nach mythologischem Krieg schlossen Asen und Vanen ewigen Frieden und tauschten Geiseln aus.',
    icon: '/assets/icons/asen_vanen.png'
  },
  {
    id: 'karl_bauer',
    term: 'Der Karl (Freier Bauer)',
    category: 'Siedlung & Alltag',
    definition: 'Der freie Stand in der Wikingergesellschaft. Karls besaßen eigenes Land, Vieh, trugen Waffen, nahmen am Thing teil und bildeten das wirtschaftliche Rückgrat der Sippe.',
    merksatz: 'Freie Bauern (Karls) erarbeiteten die Lebensgrundlage und durften auf dem Thing zu Recht sprechen.',
    icon: '/assets/icons/karl_bauer.png'
  },
  {
    id: 'berserker',
    term: 'Der Berserker',
    category: 'Siedlung & Alltag',
    definition: 'Krieger, die sich vor dem Kampf in religiöse Rauschzustände versetzten, Bärenfelle trugen und dem Göttervater Odin geweiht waren. Sie galten als schmerzunempfindlich.',
    merksatz: 'Berserker kämpften "im Bärenhemd" (ber-serkr) und genossen in den Sagas legendären Ruf.',
    icon: '/assets/icons/berserker.png'
  },
  {
    id: 'blot',
    term: 'Das Blót (Opferfest)',
    category: 'Recht & Glaube',
    definition: 'Zentrales Gemeinschafts- und Opferfest zu jahreszeitlichen Wendepunkten (Herbst, Winter/Julfest, Frühling). Den Göttern wurden Met und Tiere dargebracht, um Heil und Ernte zu sichern.',
    merksatz: 'Blót bedeutet "Stärkung": Sippe und Götter tranken und feierten gemeinsam an der Opferstätte.',
    icon: '/assets/icons/blot.png'
  },
  {
    id: 'danegeld',
    term: 'Das Danegeld',
    category: 'Staaten & Wandel',
    definition: 'Hohe Tribut- und Lösegeldzahlungen in Silber, die westeuropäische Herrscher (z. B. in England und Frankenreich) an Wikingerflotten zahlten, um deren Abzug oder Schutz zu erkaufen.',
    merksatz: 'Danegeld war die mittelalterliche Strategie: Bares Silber kaufte Zeit und schonte Menschenleben.',
    icon: '/assets/icons/danegeld.png'
  },
  {
    id: 'danelag',
    term: 'Das Danelag (Danelaw)',
    category: 'Staaten & Wandel',
    definition: 'Gebiet im Norden und Osten Englands, das im 9. Jahrhundert von dänischen Wikingern besiedelt wurde und unter deren Rechtsordnung stand. Hauptstadt war Jorvik (York).',
    merksatz: 'Im Danelag wurden aus skandinavischen Kriegern sesshafte Bauern, die eng mit Angelsachsen verschmolzen.',
    icon: '/assets/icons/danelag.png'
  },
  {
    id: 'drakkar',
    term: 'Das Drakkar (Drachenschiff)',
    category: 'Technik & Seefahrt',
    definition: 'Großes, schlankes Wikinger-Kriegsschiff mit geschnitztem Drachenkopf am Bug, Riemen und quadratischem Rahsegel. Dank geringem Tiefgang gleichermaßen für Hochsee und Flüsse geeignet.',
    merksatz: 'Das Drakkar war die technische Wunderwaffe des Nordens: Schnell, flexibel und überall anlandbar.',
    icon: '/assets/icons/drakkar.png'
  },
  {
    id: 'futhark',
    term: 'Das Futhark (Runenschrift)',
    category: 'Handel & Kultur',
    definition: 'Das germanische Runenalphabet, benannt nach den Lautwerten der ersten sechs Zeichen. Wurde mit geraden Linien in Holz, Knochen oder Stein geritzt und diente Gedenk- und Schutzinschriften.',
    merksatz: 'Runen hatten keine Rundungen – so ließen sie sich splittersicher in Holzfaser und Stein meißeln.',
    icon: '/assets/icons/futhark.png'
  },
  {
    id: 'gjermundbu_helm',
    term: 'Der Gjermundbu-Helm',
    category: 'Technik & Seefahrt',
    definition: 'Der einzige vollständig erhaltene Original-Wikingerhelm aus dem Gräberfeld Gjermundbu (Norwegen). Besitzt einen Augen- und Nasenschutz ("Brille"), aber KEINE Hörner!',
    merksatz: 'Hörnerhelme sind ein reines Opernmärchen des 19. Jahrhunderts – echte Wikinger trugen Brillenhelme.',
    icon: '/assets/icons/gjermundbu_helm.png'
  },
  {
    id: 'harald_blauzahn',
    term: 'König Harald Blauzahn',
    category: 'Staaten & Wandel',
    definition: 'Herrscher von Dänemark (ca. 910–987), der die zersplitterten Stämme vereinte und um 965 das Christentum annahm. Nach ihm ist heute die Funktechnologie "Bluetooth" benannt.',
    merksatz: 'Harald Blauzahn einte die dänischen Sippen und baute die Brücke ins christliche Europa.',
    icon: '/assets/icons/harald_blauzahn.png'
  },
  {
    id: 'jarl',
    term: 'Der Jarl (Adel/Fürst)',
    category: 'Siedlung & Alltag',
    definition: 'Oberste soziale Schicht der Wikingergesellschaft. Jarls waren mächtige Großgrundbesitzer, Flottenführer und Regionalfürsten mit eigener Gefolgschaft (Hird).',
    merksatz: 'Der Jarl regierte durch Reichtum, Großzügigkeit und den Schutz seiner Gefolgsleute.',
    icon: '/assets/icons/jarl.png'
  },
  {
    id: 'jelling_steine',
    term: 'Die Jelling-Steine',
    category: 'Handel & Kultur',
    definition: 'Zwei monumentale Runensteine im dänischen Jelling. Der größere Stein von König Harald Blauzahn mit der berühmten Christusdarstellung gilt als "Geburtsurkunde Dänemarks".',
    merksatz: 'Die Jelling-Steine vereinen heidnische Runenkunst mit dem neuen christlichen Königsanspruch.',
    icon: '/assets/icons/jelling_steine.png'
  },
  {
    id: 'jorvik',
    term: 'Jorvik (Wikinger-York)',
    category: 'Handel & Kultur',
    definition: 'Die blühende Hauptstadt des Danelag im heutigen England. Über 10.000 Menschen handelten hier mit Bernstein, Walrosszahn, Tuchen, Schwertern und arabischem Silber.',
    merksatz: 'In den Straßen von Jorvik trafen sich Händler aus Grönland, Byzanz und England zum Tausch.',
    icon: '/assets/icons/jorvik.png'
  },
  {
    id: 'klinkerbauweise',
    term: 'Die Klinkerbauweise',
    category: 'Technik & Seefahrt',
    definition: 'Traditionelle Schiffbautechnik, bei der sich die Rumpfplanken überlappen und mit Eisennieten verbunden werden. Verleiht den Booten herausragende Wellen-Elastizität und Leichtigkeit.',
    merksatz: 'Überlappende Eichenbohlen machten die Rümpfe elastisch wie Seeschlangen im Wellengang.',
    icon: '/assets/icons/klinkerbauweise.png'
  },
  {
    id: 'knarr',
    term: 'Die Knarr (Handelsschiff)',
    category: 'Technik & Seefahrt',
    definition: 'Bauchiges Hochsee-Frachtschiff der Wikinger mit hohem Freibord und großem Laderaum für Getreide, Holz, Vieh und Familien. Segelte über den offenen Nordatlantik bis Grönland.',
    merksatz: 'Ohne die seetüchtige Knarr wäre die Besiedlung Islands und Grönlands unmöglich gewesen.',
    icon: '/assets/icons/knarr.png'
  },
  {
    id: 'landnamabok',
    term: 'Das Landnámabók',
    category: 'Handel & Kultur',
    definition: 'Das mittelalterliche "Buch der Landnahme", das die Entdeckung und lückenlose Besiedlung Islands durch über 400 Sippen und Häuptlinge zwischen 874 und 930 n. Chr. dokumentiert.',
    merksatz: 'Das Landnámabók ist ein unschätzbares Grundbuch und Geschichtswerk der isländischen Besiedlung.',
    icon: '/assets/icons/landnamabok.png'
  },
  {
    id: 'langhaus',
    term: 'Das Langhaus',
    category: 'Siedlung & Alltag',
    definition: 'Zentrales, bootsförmig gebogenes Wohn- und Stallgebäude eines Hofes mit bis zu 30 Metern Länge. Eine offene Herdfeuerstelle im Zentrum bot Licht, Wärme und Kochstelle.',
    merksatz: 'Das Langhaus war das schützende Lebenszentrum für Mensch, Tier und Handwerk im Winter.',
    icon: '/assets/icons/langhaus.png'
  },
  {
    id: 'leif_eriksson',
    term: 'Leif Eriksson (Der Glückliche)',
    category: 'Staaten & Wandel',
    definition: 'Nordischer Seefahrer, der um das Jahr 1000 von Grönland aus als erster Europäer das nordamerikanische Festland (Vinland / Neufundland) erreichte und dort überwinterte.',
    merksatz: 'Leif Eriksson betrat Amerika fast fünf Jahrhunderte vor Christoph Kolumbus.',
    icon: '/assets/icons/leif_eriksson.png'
  },
  {
    id: 'portage',
    term: 'Die Portage (Fluss-Schleppen)',
    category: 'Technik & Seefahrt',
    definition: 'Mühsames Transportverfahren auf den osteuropäischen Flussrouten: Boote wurden über Wasserscheiden oder um Stromschnellen herum auf Holzrollen über Land gezogen.',
    merksatz: 'Durch Portage verbanden die Wikinger Ostsee, Dnjepr, Wolga und das Schwarze Meer.',
    icon: '/assets/icons/portage.png'
  },
  {
    id: 'schluesselgewalt',
    term: 'Die Schlüsselgewalt',
    category: 'Siedlung & Alltag',
    definition: 'Das juristische Recht der Wikinger-Hausherrin (Husfreya), über alle Vorratskammern, Haushaltsfinanzen, Truhen und das Gesinde auf dem Hof uneingeschränkt zu bestimmen.',
    merksatz: 'Der eiserne Schlüssel am Gürtel der Herrin war das unantastbare Symbol ihrer Hausmacht.',
    icon: '/assets/icons/schluesselgewalt.png'
  },
  {
    id: 'skraelinger',
    term: 'Die Skraelinger',
    category: 'Staaten & Wandel',
    definition: 'Altnordische Bezeichnung der Grönland- und Vinlandsagas für die indigenen Völker Nordamerikas und der Arktis (Beothuk, Innu und Dorset-Kultur), mit denen Tauschhandel betrieben wurde.',
    merksatz: 'Mit den Skraelingern tauschten die Wikinger Milch und Tuch gegen kostbare Wildpelze.',
    icon: '/assets/icons/skraelinger.png'
  },
  {
    id: 'sonnenstein',
    term: 'Der Sonnenstein (Islandspat)',
    category: 'Technik & Seefahrt',
    definition: 'Transparenter Doppelspatkristall (Calcit), der polarisiertes Sonnenlicht spaltet. Erlaubte es den Seefahrern, die Position der Sonne selbst bei Nebel und dichter Bewölkung exakt zu orten.',
    merksatz: 'Der Sonnenstein machte die unsichtbare Sonne im Polarnebel mit bloßem Auge peilbar.',
    icon: '/assets/icons/sonnenstein.png'
  },
  {
    id: 'stamford_bridge',
    term: 'Schlacht von Stamford Bridge (1066)',
    category: 'Staaten & Wandel',
    definition: 'Am 25. September 1066 besiegte der angelsächsische König Harold Godwinson das Heer von Harald Hardrada. Markiert das offizielle historische Ende der Wikingerzeit.',
    merksatz: 'Stamford Bridge 1066 schloss das Zeitalter der Wikinger und leitete den Feudalismus ein.',
    icon: '/assets/icons/stamford_bridge.png'
  },
  {
    id: 'thing',
    term: 'Das Thing',
    category: 'Recht & Glaube',
    definition: 'Traditionelle Volks-, Rechts- und Gerichtsversammlung aller freien Männer einer Region im Freien unter Hege des Thingfriedens. Streitfälle wurden verhandelt und Wergelder festgesetzt.',
    merksatz: 'Auf dem Thing regierte das gesprochene Recht – Blutrache wurde durch Schlichtung beigelegt.',
    icon: '/assets/icons/thing.png'
  },
  {
    id: 'thraell',
    term: 'Der Thraell (Unfreier/Knecht)',
    category: 'Siedlung & Alltag',
    definition: 'Unfreie Dienstboten, Knechte und Kriegsgefangene am Hof. Sie verrichteten Rodungen, Torfstechen und Stallarbeit, besaßen aber kein politisches Stimmrecht auf dem Thing.',
    merksatz: 'Thraells bildeten den untersten Stand der Gesellschaft und konnten sich durch Fleiß freikaufen.',
    icon: '/assets/icons/thraell.png'
  },
  {
    id: 'waraeger',
    term: 'Die Waräger (Rus)',
    category: 'Handel & Kultur',
    definition: 'Schwedische Wikinger, die ostwärts zogen, Städte wie Nowgorod und Kiew gründeten und als Elitetruppen (Warägergarde) dem byzantinischen Kaiser in Konstantinopel dienten.',
    merksatz: 'Waräger beherrschten die großen Ostflüsse und schufen die Keimzelle der Kiewer Rus.',
    icon: '/assets/icons/waraeger.png'
  }
];
