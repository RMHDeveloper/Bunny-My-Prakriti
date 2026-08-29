
export enum Dosha {
  VATA = 'Vata',
  PITTA = 'Pitta',
  KAPHA = 'Kapha'
}

export interface DoshaScore {
  vata: number;
  pitta: number;
  kapha: number;
}

export interface PrakritiState extends DoshaScore {}

export interface VikritiState extends DoshaScore {
  imbalanceScore: number;
  lifestyleShifts: string[];
}

export interface Question {
  id: string;
  label: string;
  options: {
    label: string;
    dosha: Dosha;
    description: string;
  }[];
}

export interface AppState {
  step: 'intro' | 'prakriti' | 'vikriti' | 'dashboard';
  prakritiScores: PrakritiState | null;
  vikritiData: VikritiState | null;
  currentFeeling: string;
  selectedSymptoms: string[];
}
