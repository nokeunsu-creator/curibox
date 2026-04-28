import type { TriviaItem, DeckItem } from '../models/types';
import space from '../../assets/trivia/space.json';
import body from '../../assets/trivia/body.json';
import history from '../../assets/trivia/history.json';
import animal from '../../assets/trivia/animal.json';
import nature from '../../assets/trivia/nature.json';
import science from '../../assets/trivia/science.json';
import culture from '../../assets/trivia/culture.json';

const RAW_GROUPS = [space, body, history, animal, nature, science, culture] as TriviaItem[][];

export function loadAllTrivia(): TriviaItem[] {
  return RAW_GROUPS.flat().map((item, idx) => ({ ...item, id: idx + 1 }));
}

export function buildDeck(items: TriviaItem[], adInterval = 10): DeckItem[] {
  const result: DeckItem[] = [];
  items.forEach((item, idx) => {
    result.push(item);
    const isLast = idx === items.length - 1;
    if ((idx + 1) % adInterval === 0 && !isLast) {
      const adNumber = (idx + 1) / adInterval;
      result.push({ id: `ad-${adNumber}`, isAd: true });
    }
  });
  return result;
}

export function shuffleDeterministic<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed | 0;
  const nextRandom = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
