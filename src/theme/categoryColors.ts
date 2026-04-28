import type { Category } from '../models/types';

export interface CategoryTheme {
  bg: string;
  bgGradient: string;
  chip: string;
  chipText: string;
  text: string;
  subtext: string;
}

export const CATEGORY_THEME: Record<Category, CategoryTheme> = {
  우주: {
    bg: '#D6CCFF',
    bgGradient: 'linear-gradient(160deg, #E0D6FF 0%, #C4B5F5 100%)',
    chip: '#7C5BD9',
    chipText: '#FFFFFF',
    text: '#2A1F5C',
    subtext: '#5B4A8A',
  },
  인체: {
    bg: '#FFD6E0',
    bgGradient: 'linear-gradient(160deg, #FFE0EA 0%, #FFB8CC 100%)',
    chip: '#E55A82',
    chipText: '#FFFFFF',
    text: '#5C1F33',
    subtext: '#8A4A60',
  },
  역사: {
    bg: '#FFE8B3',
    bgGradient: 'linear-gradient(160deg, #FFF0C4 0%, #FFD980 100%)',
    chip: '#C48A1F',
    chipText: '#FFFFFF',
    text: '#5C3D14',
    subtext: '#8A6B33',
  },
  동물: {
    bg: '#C8F0D8',
    bgGradient: 'linear-gradient(160deg, #D8F5E2 0%, #A8E5BF 100%)',
    chip: '#3D9962',
    chipText: '#FFFFFF',
    text: '#194D2D',
    subtext: '#3D7558',
  },
  자연: {
    bg: '#BFE3F2',
    bgGradient: 'linear-gradient(160deg, #D0EBF5 0%, #99CDE5 100%)',
    chip: '#2D7FA8',
    chipText: '#FFFFFF',
    text: '#0F3D5C',
    subtext: '#3D6680',
  },
  과학: {
    bg: '#E0E0FF',
    bgGradient: 'linear-gradient(160deg, #ECECFF 0%, #C4C4F5 100%)',
    chip: '#5252C4',
    chipText: '#FFFFFF',
    text: '#1F1F5C',
    subtext: '#4A4A8A',
  },
  문화: {
    bg: '#FFD9B3',
    bgGradient: 'linear-gradient(160deg, #FFE5C4 0%, #FFC080 100%)',
    chip: '#C46F1F',
    chipText: '#FFFFFF',
    text: '#5C3014',
    subtext: '#8A5533',
  },
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  우주: '🌌',
  인체: '🧬',
  역사: '🏛️',
  동물: '🐾',
  자연: '🌊',
  과학: '🔬',
  문화: '🍜',
};
