
import { Dosha, Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'frame',
    label: 'Body Frame & Structure',
    options: [
      { label: 'Slim / Lanky', dosha: Dosha.VATA, description: 'Thin bones, prominent joints, difficulty gaining weight.' },
      { label: 'Medium / Athletic', dosha: Dosha.PITTA, description: 'Moderate build, good muscle tone, maintains weight easily.' },
      { label: 'Large / Solid', dosha: Dosha.KAPHA, description: 'Broad frame, thick bones, gains weight easily.' }
    ]
  },
  {
    id: 'skin',
    label: 'Skin Texture & Temperature',
    options: [
      { label: 'Dry / Thin', dosha: Dosha.VATA, description: 'Cold to touch, rough, prone to cracking.' },
      { label: 'Warm / Oily', dosha: Dosha.PITTA, description: 'Sensitive, prone to redness or freckles.' },
      { label: 'Cool / Damp', dosha: Dosha.KAPHA, description: 'Soft, smooth, thick, pale, or oily.' }
    ]
  },
  {
    id: 'weather',
    label: 'Weather Sensitivity',
    options: [
      { label: 'Cold / Windy', dosha: Dosha.VATA, description: 'Dislike of cold, dry, or windy environments.' },
      { label: 'Heat / Humidity', dosha: Dosha.PITTA, description: 'Dislike of hot weather, intense sun, or sweating.' },
      { label: 'Damp / Rainy', dosha: Dosha.KAPHA, description: 'Dislike of humid, cloudy, or wet weather.' }
    ]
  },
  {
    id: 'energy',
    label: 'Energy Patterns',
    options: [
      { label: 'Bursts / Tiring', dosha: Dosha.VATA, description: 'Sudden high energy followed by fatigue.' },
      { label: 'Intense / Focused', dosha: Dosha.PITTA, description: 'Strong, determined energy; works hard.' },
      { label: 'Steady / Enduring', dosha: Dosha.KAPHA, description: 'Consistent stamina but slow to start.' }
    ]
  },
  {
    id: 'memory',
    label: 'Memory & Learning',
    options: [
      { label: 'Quick learn / forget', dosha: Dosha.VATA, description: 'Grasps concepts fast but forgets easily.' },
      { label: 'Sharp / Logical', dosha: Dosha.PITTA, description: 'Strong focus, analytical, precise memory.' },
      { label: 'Slow / Permanent', dosha: Dosha.KAPHA, description: 'Takes time to learn but never forgets.' }
    ]
  },
  {
    id: 'stress',
    label: 'Reaction to Stress',
    options: [
      { label: 'Anxiety', dosha: Dosha.VATA, description: 'Prone to worry, fear, and racing thoughts.' },
      { label: 'Irritability', dosha: Dosha.PITTA, description: 'Prone to anger, frustration, and criticism.' },
      { label: 'Withdrawal', dosha: Dosha.KAPHA, description: 'Becomes quiet, stubborn, or avoids conflict.' }
    ]
  },
  {
    id: 'sleep',
    label: 'Sleep Patterns',
    options: [
      { label: 'Light / Interrupted', dosha: Dosha.VATA, description: 'Short duration, frequent waking.' },
      { label: 'Sound / Efficient', dosha: Dosha.PITTA, description: 'Moderate sleep, wakes up refreshed.' },
      { label: 'Deep / Heavy', dosha: Dosha.KAPHA, description: 'Long sleep, difficult to wake up.' }
    ]
  }
];

export const SYMPTOMS = [
  'Bloated', 'Anxious', 'Heartburn', 'Lethargic', 'Dry Skin', 'Irritable', 'Heavy',
  'Acne', 'Constipated', 'Insomnia', 'Brain Fog', 'Joint Pain', 'Night Sweats'
];

export const DOSHA_COLORS = {
  [Dosha.VATA]: '#0284c7', // Sky 600
  [Dosha.PITTA]: '#d97706', // Amber 600
  [Dosha.KAPHA]: '#16a34a'  // Green 600
};
