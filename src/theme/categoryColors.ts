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

export const CATEGORY_THEME_DARK: Record<Category, CategoryTheme> = {
  우주: {
    bg: '#2A2540',
    bgGradient: 'linear-gradient(160deg, #3A2D6E 0%, #1F1A38 100%)',
    chip: '#9F7BE8',
    chipText: '#1A1530',
    text: '#E8DEFF',
    subtext: '#A89BD0',
  },
  인체: {
    bg: '#3E2530',
    bgGradient: 'linear-gradient(160deg, #5A2D40 0%, #2D1620 100%)',
    chip: '#FF8FAA',
    chipText: '#2A0F1A',
    text: '#FFD0DD',
    subtext: '#C0909E',
  },
  역사: {
    bg: '#3D3220',
    bgGradient: 'linear-gradient(160deg, #5C4520 0%, #2D2010 100%)',
    chip: '#F0BB60',
    chipText: '#2D1F08',
    text: '#FFE5B0',
    subtext: '#C0A878',
  },
  동물: {
    bg: '#1F3528',
    bgGradient: 'linear-gradient(160deg, #1F5538 0%, #0F2818 100%)',
    chip: '#7AD89E',
    chipText: '#0A2818',
    text: '#C8F0D8',
    subtext: '#88B098',
  },
  자연: {
    bg: '#1F2F3D',
    bgGradient: 'linear-gradient(160deg, #1F4D6E 0%, #0F2535 100%)',
    chip: '#7DC0E0',
    chipText: '#0A2535',
    text: '#C8E5F2',
    subtext: '#88A8B8',
  },
  과학: {
    bg: '#25254A',
    bgGradient: 'linear-gradient(160deg, #3D3D7A 0%, #1A1A38 100%)',
    chip: '#9090E8',
    chipText: '#1A1A38',
    text: '#D8D8FF',
    subtext: '#9898C8',
  },
  문화: {
    bg: '#3D2D1F',
    bgGradient: 'linear-gradient(160deg, #5C3D1F 0%, #2D1F0F 100%)',
    chip: '#F0A560',
    chipText: '#2D1A08',
    text: '#FFD8B0',
    subtext: '#C09878',
  },
};

export function getCategoryTheme(
  cat: Category,
  isDark: boolean
): CategoryTheme {
  return isDark ? CATEGORY_THEME_DARK[cat] : CATEGORY_THEME[cat];
}

export const CATEGORY_EMOJI: Record<Category, string> = {
  우주: '🌌',
  인체: '🧬',
  역사: '🏛️',
  동물: '🐾',
  자연: '🌊',
  과학: '🔬',
  문화: '🍜',
};
