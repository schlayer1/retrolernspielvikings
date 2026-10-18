export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChapterData {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  introDialog: string[];
  questDescription: string;
  hints: string[];
  quiz: QuizQuestion[];
  summary: string;
  unlocksText: string;
}

// ============================================================
// INTERAKTIVE FACHBEGRIFF-HERVORHEBUNG (für Dialog-Tooltips)
// ============================================================
export const HIGHLIGHT_TERMS: Record<string, string> = {
  'Langhaus': 'langhaus',
  'Langhauses': 'langhaus',
  'Schlüsselgewalt': 'schluesselgewalt',
  'Jarl': 'jarl',
  'Jarls': 'jarl',
  'Karl': 'karl_bauer',
  'Freie Bauern': 'karl_bauer',
  'Thraell': 'thraell',
  'Unfreie': 'thraell',
  'Asen': 'asen_vanen',
  'Vanen': 'asen_vanen',
  'Blót': 'blot',
  'Blótfest': 'blot',
  'Futhark': 'futhark',
  'Runen': 'futhark',
  'Klinkerbauweise': 'klinkerbauweise',
  'Langschiff': 'drakkar',
  'Drakkar': 'drakkar',
  'Knarr': 'knarr',
  'Lindisfarne': 'relic_lindisfarne_gospels',
  'Kloster': 'monastery_scriptorium_desk',
  'Waräger': 'waraeger',
  'Dnepr': 'portage',
  'Portage': 'portage',
  'Danegeld': 'danegeld',
  'Belagerung': 'siege_catapult_wood',
  'Danelag': 'danelag',
  'Jorvik': 'jorvik',
  'York': 'jorvik',
  'Harald Blauzahn': 'harald_blauzahn',
  'Jelling': 'jelling_steine',
  'Thing': 'thing',
  'Althing': 'althing',
  'Lögberg': 'althing',
  'Sonnenstein': 'sonnenstein',
  'Grönland': 'sonnenstein',
  'Vinland': 'leif_eriksson',
  'Leif Eriksson': 'leif_eriksson',
  'Skraelinger': 'skraelinger',
  'Stamford Bridge': 'stamford_bridge',
};

export const CHAPTERS: ChapterData[] = [
  // --- KAPITEL 1: DER HOF AM FJORD (ca. 780 n. Chr.) ---
  {
    id: 1,
    title: 'Kapitel 1: Der Hof am Fjord',
    subtitle: 'Alltag, autarke Landwirtschaft & Schlüsselgewalt',
    year: 'ca. 780 n. Chr.',
    mentorId: 'npc_astrid_elder',
    mentorName: 'Hausherrin Astrid',
    mentorRole: 'Herrin des Hofes am Hardangerfjord',
    introDialog: [
      'Willkommen auf unserem Hof am Fjord, junger Wanderer! Sei gegrüßt im Schutze unseres großen Langhauses.',
      'Sieh dich um: Ein Wikingerhof ist eine autarke Lebensgemeinschaft. Wir pflügen steinige Böden für Gerste und Roggen und hüten Schafe und Rinder.',
      'Als Hausherrin trage ich den eisernen Schlüsselbund sichtbar an meiner Fibel. Das ist meine Schlüsselgewalt über Vorratskammern, Truhen und das Gesinde.',
      'In unserer Gesellschaft gibt es drei Stände: Den adligen Jarl, uns freie Bauern – die Karls – und die unfreien Knechte, die Thraell.',
      'Hilf uns, den Hof für den herannahenden Winter zu rüsten: Sichere Gerstenvorräte, füttere die Schafe und trage Bauholz für die Vorratsgrube herbei!'
    ],
    questDescription: 'Unterstütze Hausherrin Astrid: Versorge das Weidevieh, sammle Gerste und errichte das Vorrats-Langhaus am Fjord!',
    hints: [
      'Sprich mit Astrid vor dem großen Langhaus.',
      'Sammle Getreide und Holz in der Umgebung der Koppel.',
      'Errichte den Hof-Ausbau mit Taste [B] am Bauplatz nahe dem Fjord.'
    ],
    quiz: [
      {
        question: 'Was bedeutete die "Schlüsselgewalt" für eine Wikingerfrau im Alltag?',
        options: [
          'Sie hatte das alleinige Verfügungsrecht über die Vorratskammern, Finanzen und das Hofgesinde',
          'Sie war verpflichtet, als Kriegerin auf Beutezug zu gehen',
          'Sie durfte den Hof niemals ohne Erlaubnis des Königs verlassen'
        ],
        correctIndex: 0,
        explanation: 'Die Schlüsselgewalt verlieh der Hausherrin eine herausragende juristische und wirtschaftliche Stellung in der nordischen Hofgemeinschaft.'
      },
      {
        question: 'Wie war die soziale Hierarchie der Wikingergesellschaft gegliedert?',
        options: [
          'Jarl (Adel/Fürsten), Karl (freie Bauern/Handwerker) und Thraell (Unfreie/Knechte)',
          'Patrizier, Plebejer und Senatoren nach römischem Vorbild',
          'Lehnsherren, Vasallen und Zunftmeister'
        ],
        correctIndex: 0,
        explanation: 'Die nordische Ständegesellschaft war dreigeteilt: Jarls führten die Sippen an, Karls bildeten das freie Rückgrat, Thraells verrichteten schwerste Arbeiten.'
      }
    ],
    summary: 'Du hast den Hofalltag am Fjord gemeistert, die Bedeutung der autarken Wirtschaft verstanden und die Schlüsselgewalt der nordischen Frauen kennengelernt.',
    unlocksText: 'Kapitel 2 freigeschaltet: Die Hallen der Götter (Nordische Mythologie & Blót)'
  },

  // --- KAPITEL 2: DIE HALLEN DER GÖTTER (ca. 785 n. Chr.) ---
  {
    id: 2,
    title: 'Kapitel 2: Die Hallen der Götter',
    subtitle: 'Nordische Mythologie, Blót-Opferfeste & Futhark-Runen',
    year: 'ca. 785 n. Chr.',
    mentorId: 'npc_thorgest_gode',
    mentorName: 'Gode Thorgest',
    mentorRole: 'Kultpriester & Runenmeister',
    introDialog: [
      'Heil dir, Fremder! Du betrittst den heiligen Hain der Asen und Vanen, wo die Götter im Rauschen der Eschen zu uns sprechen.',
      'Odin der Allvater gab sein Auge für Weisheit, Thor schützt uns mit Mjölnir vor den Riesen des Frosts, und Freya schenkt Fruchtbarkeit dem Boden.',
      'Heute Nacht feiern wir das Blót – das festliche Opfermahl. Wir trinken Met zu Ehren der Götter und weihen ihnen Fleisch und Met zur Stärkung der Sippe.',
      'Sieh auch diese mächtigen Steine: Wir ritzen Futhark-Runen ein. Runen sind nicht nur Schriftzeichen, sondern Träger geheimer Schutz- und Segenskräfte!',
      'Hilf mir, das Blót-Feuer im Steinkreis zu entfachen und ritze mit mir die Runenformel in das Heiligtum!'
    ],
    questDescription: 'Bereite das rituelle Blót-Opfer vor: Entfache das heilige Feuer, spende Met und weihe den Futhark-Runenstein im Hain!',
    hints: [
      'Triff Gode Thorgest am heiligen Steinkreis im Hain.',
      'Schnitze mit Taste [C] ein Runenamulett im Handwerksmenü.',
      'Weihe das Blót-Heiligtum mit Taste [B] am Opferaltar.'
    ],
    quiz: [
      {
        question: 'Welchem Zweck diente das Blót-Opferfest in der nordischen Religion?',
        options: [
          'Es stärkte die Bindung zwischen Göttern und Gemeinschaft durch gemeinsames Mahl und Opfergaben',
          'Es war eine Strafmaßnahme gegen ungebhorsame Knechte',
          'Es diente dem reinen Verkauf von Handelswaren an Fremde'
        ],
        correctIndex: 0,
        explanation: 'Blót bedeutet "Stärkung": Die Sippe opferte Met und Tiere, um Wohlstand, Fruchtbarkeit und Frieden von den Göttern zu erbitten.'
      },
      {
        question: 'Was ist das "Futhark" und wie wurde es vor allem genutzt?',
        options: [
          'Das ältere germanische Runenalphabet, geritzt in Holz, Knochen und Stein für Gedenk- und Weiheinschriften',
          'Ein lateinisches Messbuch der Mönche',
          'Ein geheimer militärischer Morsecode'
        ],
        correctIndex: 0,
        explanation: 'Das Futhark (benannt nach den ersten Lauten F-U-Th-A-R-K) war das Schriftsystem der Germanen für Denksteine, Eigentumsmarken und Amulette.'
      }
    ],
    summary: 'Du hast den religiösen Kosmos der Wikinger erkundet, die Bedeutung von Blót und Walhall verstanden und das ältere Futhark-Runensystem studiert.',
    unlocksText: 'Kapitel 3 freigeschaltet: Der Bau der Drachenboote (Klinkerbauweise & Langschiffe)'
  },

  // --- KAPITEL 3: DER BAU DER DRACHENBOOTE (ca. 790 n. Chr.) ---
  {
    id: 3,
    title: 'Kapitel 3: Der Bau der Drachenboote',
    subtitle: 'Klinkerbauweise, Langschiffe & die seetüchtige Knarr',
    year: 'ca. 790 n. Chr.',
    mentorId: 'npc_halvdan_shipwright',
    mentorName: 'Halvdan der Schiffbauer',
    mentorRole: 'Meister-Zimmermann am Fjord',
    introDialog: [
      'Horch auf den Klang der Äxte! Ohne unsere Schiffe wären wir Wikinger an unseren steinigen Fjorden gefangen.',
      'Unser Geheimnis ist die Klinkerbauweise: Die Eichenplanken überlappen einander wie Dachziegel und werden mit tausenden Eisennägeln vernietet.',
      'Dadurch ist der Rumpf biegsam und federt den gewaltigen Wellenschlag des Nordatlantiks ab wie ein lebendiger Fisch!',
      'Wir bauen zwei Schiffstypen: Das schlanke Langschiff – das Drakkar – für schnelle Fahrten mit Rudern und Rahsegel, und die bauchige Knarr für Fracht und Vieh.',
      'Hilf mir an der Helling: Siedet Kiefernharz zu klebrigem Schiffsteer, dichtet die Fugen mit wollgetränktem Teer ab und setzt die Ruder ein!'
    ],
    questDescription: 'Vollende den Schiffbau am Fjord: Schmiede Klinkernägel, siede Schiffsteer und staple die Ruder für das Langschiff!',
    hints: [
      'Gehe zur Helling am Fjordrand zu Halvdan.',
      'Schmiede im Handwerksmenü [C] Klinkernägel aus Raseneisenerz.',
      'Errichte die Schiffswerft mit Taste [B] am Ufer.'
    ],
    quiz: [
      {
        question: 'Was zeichnet die wikingerzeitliche Klinkerbauweise technisch aus?',
        options: [
          'Überlappende Planken mit Eisennieten, die dem Rumpf extreme Elastizität und geringen Tiefgang verleihen',
          'Massive Betonplatten, die das Schiff unzerstörbar machen',
          'Nebeneinander geklebte Baumrinden ohne Metallverbindungen'
        ],
        correctIndex: 0,
        explanation: 'Die Klinkerbauweise erlaubte elastische Rümpfe mit nur 1 Meter Tiefgang – perfekt zum Anlanden an flachen Sandstränden und Befahren von Flüssen.'
      },
      {
        question: 'Worin unterschied sich die "Knarr" vom kriegerischen "Langschiff"?',
        options: [
          'Die Knarr war ein bauchiges, tiefbordiges Hochsee-Handelsschiff für Fracht, Getreide, Holz und Siedlerfamilien',
          'Die Knarr war ausschließlich ein kleines Einbaum-Flussboot',
          'Die Knarr hatte überhaupt keine Segel und wurde von Sklaven gerudert'
        ],
        correctIndex: 0,
        explanation: 'Während das schlanke Langschiff für Schnelligkeit und Truppentransport gebaut war, ermöglichte die Knarr den Überseehandel und die Besiedlung des Atlantiks.'
      }
    ],
    summary: 'Du hast die ingenieurtechnische Meisterleistung der Klinkerbauweise gemeistert und die Schiffstypen Langschiff und Knarr kennengelernt.',
    unlocksText: 'Kapitel 4 freigeschaltet: Der Schock von Lindisfarne (793 n. Chr. & Ursachen der Fahrten)'
  },

  // --- KAPITEL 4: DER SCHOCK VON LINDISFARNE (793 n. Chr.) ---
  {
    id: 4,
    title: 'Kapitel 4: Der Schock von Lindisfarne',
    subtitle: 'Der Überfall auf das Inselkloster & Kulturkonflikt',
    year: '793 n. Chr.',
    mentorId: 'npc_cuthbert_monk',
    mentorName: 'Mönch Cuthberht',
    mentorRole: 'Schreiber & Chronist des Klosters Lindisfarne',
    introDialog: [
      'Im Herrn bewahre uns! Es war der 8. Juni des Jahres 793, als Drachenschiffe am nebligen Horizont unserer Insel Holy Island auftauchten.',
      'Niemals zuvor hatte jemand gewagt, ein heiliges Gotteshaus zu plündern. Die Nordmänner kannten das christliche Asylrecht nicht – Klöster waren für sie ungeschützte Schatzkammern voller Gold und Silber.',
      'Die Ursachen für die Fahrten sind vielschichtig: Heimatliche Überbevölkerung, strenge Erbteilung, der Drang nach Reichtum und Ruhm, aber auch Handelskonflikte.',
      'Doch wir dürfen nicht in Hass verharren: Hilf mir, die kostbarsten illuminierten Schriften – das heilige Evangeliar von Lindisfarne – vor der Zerstörung zu bergen!',
      'Verhandle mit den Männern des Nordens: Biete ihnen Tauschgüter, um Menschenleben und Schriftrollen zu retten!'
    ],
    questDescription: 'Friedenspädagogische Rettungsmission: Berge die Klosterschriften, schütze das Scriptorium und rette das Evangeliar von Lindisfarne!',
    hints: [
      'Finde Mönch Cuthberht im Innenhof des Klosters.',
      'Berge das Relikt "Evangeliar von Lindisfarne" nahe dem Scriptorium.',
      'Errichte eine Schutzmauer am Klosterarchiv mit Taste [B].'
    ],
    quiz: [
      {
        question: 'Warum markiert das Jahr 793 mit Lindisfarne in der Geschichtsschreibung den Beginn der Wikingerzeit?',
        options: [
          'Weil der Überfall auf ein wehrloses Kloster das christliche Europa zutiefst schockierte und eine 300-jährige Epoche einleitete',
          'Weil die Wikinger an diesem Tag das Christentum freiwillig annahmen',
          'Weil damals das erste Segelschiff der Weltgeschichte erfunden wurde'
        ],
        correctIndex: 0,
        explanation: 'Der Überfall erschütterte die zeitgenössische Welt, weil Klöster bis dahin als unantastbare Friedensorte galten. Zeitgenössische Chroniken sahen darin ein göttliches Strafgericht.'
      },
      {
        question: 'Welche historischen Ursachen führten zu den ersten Fahrten der Nordmänner über die Nordsee?',
        options: [
          'Knappheit an fruchtbarem Ackerland in Skandinavien, Erbteilung, Beutegier und neue Übersee-Schiffbautechnik',
          'Ein weltweiter Vulkanausbruch, der ganz Skandinavien zerstörte',
          'Ein päpstlicher Kreuzzugsaufruf zur Befreiung Jerusalems'
        ],
        correctIndex: 0,
        explanation: 'Klimatische Gunstphasen ließen die Bevölkerung wachsen, während raue Felsböden limitiert waren. Zweitgeborene Söhne suchten auf See Land, Ruhm und Silber.'
      }
    ],
    summary: 'Du hast das historische Schlüsseldatum 793 multiperspektivisch analysiert, das Evangeliar gerettet und die tieferen Ursachen der Raubzüge erarbeitet.',
    unlocksText: 'Kapitel 5 freigeschaltet: Die Handelswege nach Osten (Waräger, Dnepr & Miklagard)'
  },

  // --- KAPITEL 5: DIE HANDELSWEGE NACH OSTEN (ca. 860 n. Chr.) ---
  {
    id: 5,
    title: 'Kapitel 5: Die Handelswege nach Osten',
    subtitle: 'Die Waräger, Fluss-Portage & Fernhandel bis Miklagard',
    year: 'ca. 860 n. Chr.',
    mentorId: 'npc_rorik_varaeger',
    mentorName: 'Waräger Rorik',
    mentorRole: 'Kaufmann & Flussschiffer auf der Dnepr-Route',
    introDialog: [
      'Guten Wind, Gefährte! Während die Dänen nach Westen zogen, fuhren wir Schweden – die Waräger oder Rus – über die Ostsee in die osteuropäischen Flüsse.',
      'Über Newa, Wolchow und den Dnepr fahren wir tausende Meilen südwärts bis ins Schwarze Meer und zur goldenen Kaiserstadt Miklagard (Konstantinopel).',
      'Doch an den Stromschnellen des Dnepr lauert die größte Härte: Dort müssen wir unsere Boote über Land schleppen! Das nennen wir "Portage" – Holzrollen unter den Kiel und ziehen mit aller Kraft.',
      'In Kiew tauschen wir Honig, Bienenwachs, feinsten Bernstein und Pelze gegen arabische Silberdirhams und byzantinische Seide.',
      'Hilf mir, die Holzrollen am Portage-Ufer auszulegen und die Silberwaage für den Tauschhandel mit den Händlern zu eichen!'
    ],
    questDescription: 'Organisiere die Waräger-Flussexpedition: Richte die Holzrollen für die Portage her, wiege Silberdirhams und baue das Handelskontor!',
    hints: [
      'Sprich mit Waräger Rorik am Flussufer.',
      'Wiege Silberdirhams im Handwerksmenü [C].',
      'Errichte das Waräger-Kontor mit Taste [B] an der Flussschleife.'
    ],
    quiz: [
      {
        question: 'Was versteht man unter dem Begriff "Portage" in der Flussnavigation der Waräger?',
        options: [
          'Das mühsame Schleppen und Rollen von Booten über Land zwischen zwei Flusssystemen oder an Stromschnellen vorbei',
          'Das Bezahlen von Brückenzoll an byzantinische Zöllner',
          'Das Trocknen von Fischen im Frachtraum'
        ],
        correctIndex: 0,
        explanation: 'Da die Wasserscheiden osteuropäischer Flüsse nicht verbunden waren, zogen die Waräger ihre Klinkerschiffe auf Baumstämmen über Land.'
      },
      {
        question: 'Welche Fernhandelsgüter tauschten die Waräger im Orient und in Byzanz vor allem ein?',
        options: [
          'Arabische Silbermünzen (Dirhams), kostbare Seide und Gewürze gegen Pelze, Honig und Bernstein',
          'Römischen Zement gegen ägyptische Mumien',
          'Eisenbahnschienen gegen Baumwolle'
        ],
        correctIndex: 0,
        explanation: 'Hunderttausende gefundene arabische Silberdirhams in skandinavischen Hortfunden beweisen das gigantische Ausmaß des eurasischen Wikingerhandels.'
      }
    ],
    summary: 'Du hast die Ostexpedition der Waräger gemeistert, das Prinzip der Portage verstanden und den eurasischen Fernhandel bis Byzanz nachvollzogen.',
    unlocksText: 'Kapitel 6 freigeschaltet: Der Belagerungsring um Paris (885–886 n. Chr. & Danegeld)'
  },

  // --- KAPITEL 6: DER BELAGERUNGSRING UM PARIS (885–886 n. Chr.) ---
  {
    id: 6,
    title: 'Kapitel 6: Der Belagerungsring um Paris',
    subtitle: 'Belagerungstaktiken, Graf Odo & das Danegeld',
    year: '885–886 n. Chr.',
    mentorId: 'npc_graf_odo',
    mentorName: 'Graf Odo von Paris',
    mentorRole: 'Verteidiger der Île de la Cité & späterer König',
    introDialog: [
      'Seid gegrüßt in unserer belagerten Stadt an der Seine. Hunderte Langschiffe mit zehntausend Wikingern unter Sigfred sperren den Fluss!',
      'Sie errichteten mächtige Katapulte, Belagerungstürme und versuchten, unsere hölzerne Seine-Brücke in Brand zu stecken, um weiter ins Herz des Fränkischen Reiches vorzudringen.',
      'Monatelang hungern die Bürger auf der Flussinsel. Doch statt reiner Zerstörung verhandeln wir: Der fränkische Kaiser Karl der Dicke zahlt 700 Pfund Silber – das Danegeld!',
      'Geld statt Blutvergießen: Das Danegeld erkauft den Abzug der Flotte und schützt tausende Zivilisten vor dem Verhungern.',
      'Hilf uns, die Zivilbevölkerung auf der Insel mit Mehl und Arznei zu versorgen, die Brückenbefestigung zu verstärken und die Danegeld-Tributbeutel zu packen!'
    ],
    questDescription: 'Friedenspädagogische Belagerungsverhandlung: Versorge die Pariser Zivilbevölkerung, sichere die Brücke und packe den Danegeld-Tributbeutel!',
    hints: [
      'Finde Graf Odo vor dem Steintor von Paris.',
      'Packe mit Taste [C] den Danegeld-Tributbeutel im Handwerksmenü.',
      'Errichte die Seine-Brückenbefestigung mit Taste [B].'
    ],
    quiz: [
      {
        question: 'Was bezweckten mittelalterliche Herrscher mit der Zahlung von "Danegeld"?',
        options: [
          'Sie erkauften den strategischen Abzug von Wikingerflotten und Friedensfristen, um Zivilbevölkerung und Städte zu schützen',
          'Sie finanzierten den Bau von Wikingerschiffen im eigenen Land',
          'Sie kauften den heidnischen Göttern skandinavische Tempel ab'
        ],
        correctIndex: 0,
        explanation: 'Danegeld war eine pragmatische politische Lösegeld- und Tributzahlung: Es schonte das eigene Heer und verhinderte die totale Verwüstung von Metropolen.'
      },
      {
        question: 'Wie schützte Graf Odo die Seine-Insel (Île de la Cité) von Paris vor den Schiffen?',
        options: [
          'Durch befestigte Holzbrücken mit Wehrtürmen, die den Wikingerschiffen die Durchfahrt flussaufwärts versperrten',
          'Durch den Bau eines gigantischen Staudamms aus Marmor',
          'Durch den Einsatz von Unterwasser-U-Booten'
        ],
        correctIndex: 0,
        explanation: 'Die niedrigen Brücken von Paris waren unüberwindliche Barrieren für die Masten der Drakkar-Schiffe und machten die Stadt zum strategischen Knotenpunkt.'
      }
    ],
    summary: 'Du hast die Belagerung von Paris 885/886 analysiert, die Logik strategischer Danegeldzahlungen begriffen und humanitäre Notversorgung erprobt.',
    unlocksText: 'Kapitel 7 freigeschaltet: Das Danelag und das Gesetz von York (ca. 870–900 n. Chr.)'
  },

  // --- KAPITEL 7: DAS DANELAG UND DAS GESETZ VON YORK (ca. 870–900 n. Chr.) ---
  {
    id: 7,
    title: 'Kapitel 7: Das Danelag und das Gesetz von York',
    subtitle: 'Sesshaftwerdung, Kulturtransfer & das Gesetz von Jorvik',
    year: 'ca. 870–900 n. Chr.',
    mentorId: 'npc_guthrum_jarl',
    mentorName: 'Jarl Guthrum',
    mentorRole: 'Herrscher des Danelag & König von Ostanglien',
    introDialog: [
      'Willkommen in Jorvik – dem Herzen unseres Danelag! Wir sind nicht mehr nur Krieger auf Beutezug, wir sind sesshafte Bauern, Handwerker und Händler geworden.',
      'Nach dem Vertrag mit dem angelsächsischen König Alfred dem Großen gilt hier im Osten Englands unser eigenes nordisches Recht: das "Danelag" (Dänisches Recht).',
      'Schau dich in den Gassen von Jorvik um: Angelsachsen und Nordleute leben Tür an Tür. Unsere Sprachen verschmelzen – viele englische Wörter wie "law", "skin", "sky" oder "window" stammen aus unserem Altnordischen!',
      'Geregelte Gerichte schlichten Streitigkeiten zwischen Einheimischen und Neusiedlern. Recht und Handel ersetzen die Axt.',
      'Hilf uns, den großen Marktplatz von Jorvik auszubauen: Errichte Stände für Knochenschnitzer und Weberinnen und richte die Danelag-Gerichtsstätte her!'
    ],
    questDescription: 'Baue das multikulturelle Danelag auf: Fördere den Handwerkshandel in Jorvik, richte den Webrahmen und baue die Gerichtsstätte!',
    hints: [
      'Triff Jarl Guthrum auf dem Marktplatz von Jorvik.',
      'Bearbeite Schafwolle im Handwerksmenü [C].',
      'Errichte die Danelag-Gerichtsstätte mit Taste [B].'
    ],
    quiz: [
      {
        question: 'Was bezeichnete das historische "Danelag" (Danelaw) im mittelalterlichen England?',
        options: [
          'Das von skandinavischen Siedlern beherrschte Gebiet im Osten und Norden Englands, in dem dänisches Recht galt',
          'Ein Gesetz, das allen Dänen das Tragen von Rüstungen verbot',
          'Einen Schiffskanal zwischen London und Edinburgh'
        ],
        correctIndex: 0,
        explanation: 'Das Danelag entstand nach 878: Die Nordleute wurden dauerhaft sesshaft, betrieben Landwirtschaft und prägten Sprache, Ortsnamen und Recht Englands.'
      },
      {
        question: 'Welches bleibende sprachliche Erbe hinterließen die Wikinger im Englischen?',
        options: [
          'Zahlreiche alltägliche Wörter altnordischen Ursprungs wie "sky", "egg", "leg", "window" und "law"',
          'Die Einführung von chinesischen Schriftzeichen',
          'Die Abschaffung aller Vokale'
        ],
        correctIndex: 0,
        explanation: 'Durch das enge Zusammenleben von Angelsachsen und Skandinaviern flossen hunderte altnordische Begriffe dauerhaft in die englische Sprache ein.'
      }
    ],
    summary: 'Du hast den Wandel von Räubern zu sesshaften Siedlern im Danelag nachvollzogen und den nachhaltigen Kultur- und Sprachtransfer in England verstanden.',
    unlocksText: 'Kapitel 8 freigeschaltet: Die Taufe des Königs (Harald Blauzahn & Jelling ca. 965 n. Chr.)'
  },

  // --- KAPITEL 8: DIE TAUFE DES KÖNIGS (ca. 965 n. Chr.) ---
  {
    id: 8,
    title: 'Kapitel 8: Die Taufe des Königs',
    subtitle: 'Christianisierung Skandinaviens & Harald Blauzahn in Jelling',
    year: 'ca. 965 n. Chr.',
    mentorId: 'npc_harald_blauzahn',
    mentorName: 'König Harald Blauzahn',
    mentorRole: 'König von Dänemark & Einiger des Reiches',
    introDialog: [
      'Ich bin König Harald Gormsson, den sie Blauzahn nennen! Ich habe ganz Dänemark und Norwegen unter einer Krone geeint.',
      'Doch die Zeiten wandeln sich: Im Süden wächst die Macht des christlichen Ostfrankenreichs von Kaiser Otto I. Um unser Reich vor Angriffen zu schützen, ließ ich mich von Bischof Poppo taufen.',
      'Die Annahme des Christentums war eine geniale politische Weichenstellung: Sie sicherte mir die Anerkennung Europas und stärkte meine königliche Zentralgewalt gegenüber abtrünnigen Jarls.',
      'Hier in Jelling lasse ich die größten Runensteine der Welt errichten – den "Taufstein Dänemarks". Auf ihm steht: "Harald machte die Dänen zu Christen."',
      'Hilf mir, die Steine von Jelling aufzurichten, weihe die Holzkirche und ziehe festliche Taufkerzen für das Einigungsfest!'
    ],
    questDescription: 'Vollende das Monument von Jelling: Ziehe Taufkerzen, richte den großen Jelling-Runenstein auf und errichte die Holzkirche!',
    hints: [
      'Sprich mit König Harald Blauzahn vor den Hügeln von Jelling.',
      'Ziehe Bienenwachskerzen mit Taste [C].',
      'Errichte das Jelling-Monument mit Taste [B].'
    ],
    quiz: [
      {
        question: 'Warum ließ sich König Harald Blauzahn um 965 taufen und christianisierte Dänemark?',
        options: [
          'Aus klugem politischem Kalkül: Zur Abwehr des mächtigen Ostfrankenreichs und zur Festigung seiner königlichen Zentralmacht',
          'Weil ihm die Wikingerschiffe weggenommen wurden',
          'Weil ein Gesetz der Wikinger den alten Glauben verboten hatte'
        ],
        correctIndex: 0,
        explanation: 'Die Taufe schützte Dänemark vor kaiserlichen Kreuzzügen und ermöglichte es dem König, die zersplitterten Sippen zu einem europäischen Flächenstaat zu einen.'
      },
      {
        question: 'Was zeigt der Große Runenstein von Jelling, der oft als "Taufstein Dänemarks" bezeichnet wird?',
        options: [
          'Eine Christusdarstellung mit Flechtwerk und eine Inschrift über die Einigung und Christianisierung Dänemarks',
          'Eine genaue Karte des Nordpols',
          'Einen Stammbaum römischer Kaiser'
        ],
        correctIndex: 0,
        explanation: 'Der Große Jellingstein verbindet nordische Flechtband-Ornamentik mit einer frühen Christusdarstellung und gilt als Nationaldenkmal Dänemarks.'
      }
    ],
    summary: 'Du hast die politische Dimension der Christianisierung Skandinaviens analysiert und die Jelling-Steine als Meilenstein der dänischen Staatsbildung verstanden.',
    unlocksText: 'Kapitel 9 freigeschaltet: Der Thing von Island (ca. 930–990 n. Chr. & das Althing am Lögberg)'
  },

  // --- KAPITEL 9: DER THING VON ISLAND (ca. 930–990 n. Chr.) ---
  {
    id: 9,
    title: 'Kapitel 9: Der Thing von Island',
    subtitle: 'Rechtsprechung, das Althing & Konfliktlösung am Lögberg',
    year: 'ca. 930–990 n. Chr.',
    mentorId: 'npc_thorgeir_speaker',
    mentorName: 'Gesetzessprecher Thorgeir',
    mentorRole: 'Gesetzessprecher des Althings am Lögberg',
    introDialog: [
      'Willkommen in Þingvellir, auf der vulkanischen Erde Islands! Vor über sechzig Jahren flohen unsere Ahnen vor der Tyrannei skandinavischer Könige auf diese Insel.',
      'Wir wollten keinen König über uns haben. Stattdessen schufen wir das Althing – eines der ältesten noch bestehenden Parlamente der Welt!',
      'Jeden Sommer im Juni versammeln sich alle freien Bauern Islands hier in dieser Felsenschlucht. Ich stehe auf dem Lögberg – dem Gesetzesfelsen – und sage das gesamte Gesetz auswendig auf!',
      'Hier lösen wir Blutfehden friedlich durch Wergeld-Schlichtung, beschließen neue Gesetze und halten Gericht. Das Wort steht über dem Schwert.',
      'Hilf mir, die Thinghütten (Búðir) für die eintreffenden Häuptlinge herzurichten und binde die Gesetzesrolle mit Lederband!'
    ],
    questDescription: 'Organisiere das Althing in Þingvellir: Binde die Gesetzesrolle, schlichte Rechtsstreitigkeiten und errichte die Thingstätte am Lögberg!',
    hints: [
      'Triff Gesetzessprecher Thorgeir am Gesetzesfelsen Lögberg.',
      'Binde die Pergamentrolle mit Lederband im Handwerksmenü [C].',
      'Errichte die Thingstätte mit Taste [B].'
    ],
    quiz: [
      {
        question: 'Welche weltgeschichtliche Besonderheit zeichnet das isländische "Althing" (gegründet 930) aus?',
        options: [
          'Es war eine königsfreie demokratische Vollversammlung freier Bauern und gilt als eines der ältesten Parlamente der Welt',
          'Es durfte nur von ausländischen Königen einberufen werden',
          'Dort wurde ausschließlich über Piratenbeute abgestimmt'
        ],
        correctIndex: 0,
        explanation: 'Island hatte keinen Monarchen; das Althing regelte über Jahrhunderte Rechtsprechung und Gesetzgebung in einer genossenschaftlich organisierten Freistaatsordnung.'
      },
      {
        question: 'Welche Aufgabe hatte der "Gesetzessprecher" (Lögsögumaður) auf dem Althing?',
        options: [
          'Er musste das gesamte mündlich überlieferte Recht über drei Jahre hinweg vom Lögberg fehlerfrei vortragen und Streitigkeiten schlichten',
          'Er war der Oberbefehlshaber der isländischen Kriegsflotte',
          'Er zog von allen Bürgern Steuern für den Papst ein'
        ],
        correctIndex: 0,
        explanation: 'Vor der schriftlichen Aufzeichnung im 12. Jahrhundert musste der Gesetzessprecher das riesige Gesetzeswerk auswendig beherrschen und vortragen.'
      }
    ],
    summary: 'Du hast die frühe Parlamentstradition des Althings erkundet, friedliche Konfliktlösung am Lögberg kennengelernt und die Verfassung Islands erforscht.',
    unlocksText: 'Kapitel 10 freigeschaltet: Kurs auf das Unbekannte – Grönland (ca. 982 n. Chr. & Erik der Rote)'
  },

  // --- KAPITEL 10: KURS AUF DAS UNBEKANNTE – GRÖNLAND (ca. 982 n. Chr.) ---
  {
    id: 10,
    title: 'Kapitel 10: Kurs auf das Unbekannte – Grönland',
    subtitle: 'Nautik, der Sonnenstein & Erik der Rote in Brattahlíð',
    year: 'ca. 982 n. Chr.',
    mentorId: 'npc_erik_der_rote',
    mentorName: 'Erik der Rote',
    mentorRole: 'Entdecker & Begründer der Grönlandsiedlung',
    introDialog: [
      'Schau hinaus auf den eisigen Ozean! Weil ich wegen eines Totschlags aus Island verbannt wurde, segelte ich westwärts in den Sturm.',
      'Viele hielten mich für verloren, doch ich fand neues Land mit grünen Fjorden! Ich nannte es "Grönland" – das Grüne Land –, damit viele Bauern mir folgten.',
      'Wie wir ohne Kompass durch dichten Nebel navigieren? Mit unserem Sonnenstein! Es ist ein Calcit-Doppelspatkristall: Halte ihn in den bewölkten Himmel, und er polarisiert das Licht – so finden wir die Sonne selbst im Schneesturm!',
      'Zudem beobachten wir den Flug von Kolkraben und Wale. Hier in Brattahlíð bauen wir Häuser aus dicken Grassoden gegen die arktische Kälte.',
      'Hilf mir, den Sonnenstein am Peilstand zu kalibrieren und baue das kälteisolierte Soden-Langhaus am Eriksfjord!'
    ],
    questDescription: 'Trotze der arktischen Kälte: Poliere den Sonnenstein-Kristall, bestimme den Sonnenstand und errichte das Soden-Langhaus in Brattahlíð!',
    hints: [
      'Triff Erik den Roten am arktischen Ufer von Brattahlíð.',
      'Poliere den Sonnenstein-Kristall im Handwerksmenü [C].',
      'Errichte das Soden-Langhaus mit Taste [B] am Peilstand.'
    ],
    quiz: [
      {
        question: 'Wie funktionierte der legendäre "Sonnenstein" (Calcit-Doppelspat) der nordischen Seefahrer?',
        options: [
          'Er polarisiert das diffuse Himmelslicht, sodass der Sonnenstand selbst bei dichter Wolkendecke und Nebel exakt gepeilt werden konnte',
          'Er leuchtete im Dunkeln wie eine Taschenlampe durch radioaktive Strahlung',
          'Er zeigte wie ein magnetischer Kompass automatisch immer nach Norden'
        ],
        correctIndex: 0,
        explanation: 'Optische Experimente bewiesen, dass Islandspat (Calcit) polarisiertes Licht spaltet und den genauen Azimut der Sonne bei Nebel sichtbar macht.'
      },
      {
        question: 'Warum nannte Erik der Rote das kalte arktische Land verheißungsvoll "Grönland"?',
        options: [
          'Als gezielte Werbemaßnahme, um isländische Bauern und Siedler zur Auswanderung in die Fjorde zu bewegen',
          'Weil dort damals riesige Tropenwälder mit Palmen wuchsen',
          'Weil es die heimatliche Farbe seines Clans war'
        ],
        correctIndex: 0,
        explanation: 'Die Saga berichtet wörtlich, Erik habe gesagt, die Leute würden viel eher dorthin ziehen wollen, wenn das Land einen schönen, einladenden Namen trüge.'
      }
    ],
    summary: 'Du hast die bahnbrechende Navigationskunst auf offener See erforscht, die Funktion des Sonnensteins verstanden und das arktische Überleben gemeistert.',
    unlocksText: 'Kapitel 11 freigeschaltet: Das sagenhafte Vinland (ca. 1000 n. Chr. & Leif Eriksson in Amerika)'
  },

  // --- KAPITEL 11: DAS SAGENHAFTE VINLAND (ca. 1000 n. Chr.) ---
  {
    id: 11,
    title: 'Kapitel 11: Das sagenhafte Vinland',
    subtitle: 'Leif Eriksson in Neufundland & Erstkontakt mit indigenen Völkern',
    year: 'ca. 1000 n. Chr.',
    mentorId: 'npc_leif_eriksson',
    mentorName: 'Leif Eriksson',
    mentorRole: 'Entdecker von Vinland (L’Anse aux Meadows)',
    introDialog: [
      'Heil dir am fernen Ufer der Welt! Fast 500 Jahre vor Christoph Kolumbus setzten unsere Klinkerschiffe Segel nach Westen und erreichten diesen Kontinent.',
      'Mein Vater Erik fand Grönland – ich fuhr weiter an Küsten vorbei, die wir Helluland (Steinland) und Markland (Waldland) nannten, bis wir hier in Vinland (Weinland / Weideland) anlandeten.',
      'Hier wachsen wilde Weintrauben, prächtige Bauhölzer und riesige Lachse schwimmen in den Bächen. In L’Anse aux Meadows bauten wir unsere Siedlung.',
      'Hier trafen wir auf die Einheimischen – die Skraelinger (Beothuk / Innu). Wir versuchten friedlichen Tauschhandel: Wir gaben ihnen Milch und rotes Wolltuch für edle Pelze.',
      'Hilf uns, den Tauschplatz am Fluss auszubauen: Berge die bronzene Ringnadel als historischen Beweis und schnüre friedliche Handelsbündel!'
    ],
    questDescription: 'Erkunde die erste europäische Siedlung in Amerika: Schnüre Tauschbündel mit Milch und Wolltuch und baue die Vinland-Station in L’Anse aux Meadows!',
    hints: [
      'Sprich mit Leif Eriksson am Flussufer von L’Anse aux Meadows.',
      'Schnüre das friedliche Tauschbündel mit Taste [C].',
      'Errichte die Vinland-Siedlung mit Taste [B].'
    ],
    quiz: [
      {
        question: 'Welcher archäologische Fundort in Neufundland bewies 1960 endgültig, dass Wikinger um 1000 n. Chr. Amerika erreichten?',
        options: [
          'L’Anse aux Meadows mit skandinavischen Sodenhäusern, Schmiedeschlacke und einer Bronzefibel',
          'Das Grab des Kolumbus in Washington D.C.',
          'Römische Münzen am Strand von Miami'
        ],
        correctIndex: 0,
        explanation: 'Die Ausgrabungen des Ehepaars Ingstad in L’Anse aux Meadows brachten skandinavische Gebäude und eine Bronzenadel ans Licht – heute UNESCO-Welterbe.'
      },
      {
        question: 'Wie verlief der Erstkontakt zwischen den Nordleuten und den indigenen Völkern ("Skraelingern")?',
        options: [
          'Zunächst friedlicher Tauschhandel (Milch & Tuch gegen Pelze), doch Missverständnisse und Feindseligkeiten führten zur Aufgabe der fernen Siedlung',
          'Die Wikinger bauten eine gigantische Eisenbahnlinie quer durch Amerika',
          'Die Ureinwohner wurden von den Wikingern sofort als Könige gekrönt'
        ],
        correctIndex: 0,
        explanation: 'Wegen der extrem weiten Nachschubwege über den Atlantik und wachsender Konflikte mit der zahlenmäßig überlegenen Urbevölkerung gaben die Wikinger Vinland nach wenigen Jahren auf.'
      }
    ],
    summary: 'Du hast die transatlantische Pionierleistung Leif Erikssons erforscht, die Archäologie von L’Anse aux Meadows analysiert und den Erstkontakt erarbeitet.',
    unlocksText: 'Kapitel 12 freigeschaltet: Das Ende der Ära – Stamford Bridge (1066 n. Chr. & Ausklang)'
  },

  // --- KAPITEL 12: DAS ENDE DER ÄRA – STAMFORD BRIDGE (1066 n. Chr.) ---
  {
    id: 12,
    title: 'Kapitel 12: Das Ende der Ära – Stamford Bridge',
    subtitle: 'Der Wandel zum Feudalismus & das historische Ende 1066',
    year: '1066 n. Chr.',
    mentorId: 'npc_olav_kyrre',
    mentorName: 'Olav Kyrre der Friedfertige',
    mentorRole: 'König von Norwegen & Friedensstifter',
    introDialog: [
      'Friede sei mit dir an den Ufern des Derwent. Der 25. September 1066 an der Stamford Bridge markiert das endgültige Ende unseres Zeitalters.',
      'Mein Vater, König Harald Hardrada – der letzte große Wikingerfürst –, fiel hier im Kampf gegen den angelsächsischen König Harold Godwinson.',
      'Doch ich wählte den Weg des Friedens: König Harold bot mir ehrenvollen Abzug. Wir schworen ewigen Frieden, bestatteten die Toten und fuhren mit den verbliebenen Schiffen heim.',
      'Aus wilden Wikingerhäuptlingen sind christliche Könige geworden. Skandinavien ist nun Teil der europäischen Feudalordnung mit Kirchen, Bistümern und schriftlichem Recht.',
      'Hilf uns, eine Sanitäts- und Friedensstation an der Brücke von Stamford Bridge zu errichten: Mische Wundsalben für die Verwundeten und setze das Friedensmemorial!'
    ],
    questDescription: 'Friedenspädagogischer Epochenabschluss: Mische heilende Wundsalbe, versorge Versehrte beider Seiten und errichte das Friedensmemorial an der Stamford Bridge!',
    hints: [
      'Triff König Olav Kyrre an der Holzbrücke von Stamford Bridge.',
      'Mische Wundsalbe aus Kräutern und Wachs im Handwerksmenü [C].',
      'Errichte das Friedensmemorial mit Taste [B].'
    ],
    quiz: [
      {
        question: 'Warum gilt die Schlacht von Stamford Bridge im September 1066 als historischer Schlusspunkt der Wikingerzeit?',
        options: [
          'Mit dem Tod von Harald Hardrada scheiterte der letzte Versuch einer skandinavischen Herrschaft über England; Skandinavien wandelte sich zu christlichen Feudalstaaten',
          'Weil die Wikinger danach alle Schiffe verbrannten und das Meer vergaßen',
          'Weil die Pest alle Bewohner Nordeuropas auslöschte'
        ],
        correctIndex: 0,
        explanation: 'Nach 1066 endeten die großen Raub- und Invasionszüge. Die skandinavischen Reiche wurden zu festen Bestandteilen des christlich-europäischen Staatensystems.'
      },
      {
        question: 'Welchen nachhaltigen Beinamen trug der junge König Olav nach 1066 und wofür stand seine Regentschaft?',
        options: [
          'Olav Kyrre ("der Ruhige/Friedfertige"), der Norwegen fast drei Jahrzehnte des Friedens, des Städtebaus (Bergen) und des Aufschwungs schenkte',
          'Olav der Schreckliche, der die gesamte Welt eroberte',
          'Olav der Goldene, der alles Geld an England verschenkte'
        ],
        correctIndex: 0,
        explanation: 'Olav Kyrre führte fast 30 Jahre lang keinen einzigen Krieg, gründete Handelsstädte wie Bergen und steht für den erfolgreichen Wandel zu einer friedlichen Zivilgesellschaft.'
      }
    ],
    summary: 'Du hast alle 12 Kapitel des Wikinger-Lernabenteuers vollendet, den Wandel vom frühmittelalterlichen Fjorddorf bis zur europäischen Staatenbildung gemeistert und dein Geschichtsdiplom errungen!',
    unlocksText: '🎉 Gratulation! Alle 12 Kapitel gemeistert. Öffne deine Urkunde mit Taste [U]!'
  }
];
