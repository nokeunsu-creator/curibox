export type Category =
  | '우주'
  | '인체'
  | '역사'
  | '동물'
  | '자연'
  | '과학'
  | '문화';

export const ALL_CATEGORIES: Category[] = [
  '우주',
  '인체',
  '역사',
  '동물',
  '자연',
  '과학',
  '문화',
];

export interface TriviaItem {
  id: number;
  category: Category;
  title: string;
  content: string;
  isAd?: false;
}

export interface AdItem {
  id: string;
  isAd: true;
}

export type DeckItem = TriviaItem | AdItem;

export function isAdItem(item: DeckItem): item is AdItem {
  return 'isAd' in item && item.isAd === true;
}
