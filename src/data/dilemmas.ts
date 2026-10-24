/**
 * Historische Dilemma- & Thingsberatungen für die Wikingerzeit
 */

import { VikingItemId } from './items';

export interface DilemmaOption {
  id: string;
  title: string;
  argumentText: string;
  rewards: Partial<Record<VikingItemId, number>>;
  storyFlag: string;
  feedbackText: string;
}

export interface DilemmaDef {
  id: string;
  chapter: number;
  councilTitle: string;
  mentorSpeaker: string;
  illustrationKey: string;
  conflictTitle: string;
  conflictText: string;
  options: DilemmaOption[];
}

export const VIKING_DILEMMAS: DilemmaDef[] = [
  {
    id: 'dilemma_ch3_althing_streit',
    chapter: 3,
    councilTitle: 'Althing-Versammlung an der Gesetzesklippe (Lögberg)',
    mentorSpeaker: 'Gesetzessprecher Thorgeir Ljósvetningagoði',
    illustrationKey: 'council_thing',
    conflictTitle: 'Blutfehde oder Wergeld: Wie soll der Streit zwischen zwei Sippen beigelegt werden?',
    conflictText: 'Am Lögberg fordern die Angehörigen nach einem tödlichen Streit am Fjord Rache und die Erklärung der Friedlosigkeit (Skóggangr). Doch Gesetzessprecher Thorgeir mahnt: "Wenn wir das Gesetz zerreißen, zerreißen wir den Frieden im Land!" Die Sippe des Beschuldigten bietet ein hohes Wergeld (Mannbuße in Hacksilber) an.',
    options: [
      {
        id: 'opt_wergeld',
        title: 'Wergeld-Sühne annehmen & Fehdefrieden stiften',
        argumentText: 'Ein friedliches Miteinander am Fjord erfordert Vernunft. Durch Sühnegeld in Silber und Vieh wird die Ehre der Sippe wiederhergestellt, ohne neues Blut zu vergießen.',
        rewards: { silber_dirham: 15, wolle_tuch: 6 },
        storyFlag: 'dilemma_ch3_wergeld_settlement',
        feedbackText: 'Das Thing stimmt zu! Mit Handschlag und Gesetzesschwur wird die Fehde beendet. Das Hacksilber sichert den Sippenfrieden.'
      },
      {
        id: 'opt_verfemung',
        title: 'Friedlosigkeit aussprechen (Verbannung)',
        argumentText: 'Wer den Hof des Nachbarn heimtückisch brandmarkt, hat sein Recht auf Sippenschutz verwirkt und muss als Geächteter das Land verlassen.',
        rewards: { gesetzes_rolle: 1, bernstein_perle: 5 },
        storyFlag: 'dilemma_ch3_outlawry_judgment',
        feedbackText: 'Der Richtspruch ist gefallen: Der Täter wird verbannt. Die Autorität des Things und die Unantastbarkeit der Höfe ist gestärkt.'
      }
    ]
  }
];
