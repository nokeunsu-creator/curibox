import { describe, it, expect } from 'vitest';
import {
  loadAllTrivia,
  buildDeck,
  shuffleDeterministic,
} from './triviaLoader';
import { ALL_CATEGORIES, isAdItem } from '../models/types';
import type { TriviaItem } from '../models/types';

describe('loadAllTrivia', () => {
  it('returns 500 items (7 categories total)', () => {
    const all = loadAllTrivia();
    expect(all.length).toBe(500);
  });

  it('assigns global sequential ids 1..N', () => {
    const all = loadAllTrivia();
    expect(all[0].id).toBe(1);
    expect(all[all.length - 1].id).toBe(500);
    all.forEach((item, idx) => {
      expect(item.id).toBe(idx + 1);
    });
  });

  it('contains all 7 categories', () => {
    const all = loadAllTrivia();
    const categories = new Set(all.map((i) => i.category));
    expect(categories.size).toBe(ALL_CATEGORIES.length);
    ALL_CATEGORIES.forEach((c) => expect(categories.has(c)).toBe(true));
  });

  it('has at least 60 items per category', () => {
    const all = loadAllTrivia();
    const counts = new Map<string, number>();
    all.forEach((i) => counts.set(i.category, (counts.get(i.category) ?? 0) + 1));
    counts.forEach((count) => expect(count).toBeGreaterThanOrEqual(60));
  });

  it('every item has non-empty title and content', () => {
    const all = loadAllTrivia();
    all.forEach((item) => {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.content.length).toBeGreaterThan(0);
    });
  });
});

describe('buildDeck', () => {
  const sample: TriviaItem[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    category: '우주',
    title: `t${i + 1}`,
    content: `c${i + 1}`,
  }));

  it('inserts an ad after every 10 trivia (interval=10)', () => {
    const deck = buildDeck(sample, 10);
    expect(isAdItem(deck[10])).toBe(true);
    expect(isAdItem(deck[21])).toBe(true);
    expect((deck[10] as { id: string }).id).toBe('ad-1');
    expect((deck[21] as { id: string }).id).toBe('ad-2');
  });

  it('does not append an ad at the very end', () => {
    const deck = buildDeck(sample, 10);
    expect(isAdItem(deck[deck.length - 1])).toBe(false);
  });

  it('preserves all original trivia items', () => {
    const deck = buildDeck(sample, 10);
    const triviaCount = deck.filter((d) => !isAdItem(d)).length;
    expect(triviaCount).toBe(sample.length);
  });

  it('total length = 30 trivia + 2 ads = 32 (last skipped)', () => {
    const deck = buildDeck(sample, 10);
    expect(deck.length).toBe(32);
  });

  it('respects custom interval', () => {
    const deck = buildDeck(sample, 5);
    expect(isAdItem(deck[5])).toBe(true);
    expect(isAdItem(deck[11])).toBe(true);
  });
});

describe('shuffleDeterministic', () => {
  const arr = Array.from({ length: 50 }, (_, i) => i);

  it('produces the same order for the same seed', () => {
    const a = shuffleDeterministic(arr, 42);
    const b = shuffleDeterministic(arr, 42);
    expect(a).toEqual(b);
  });

  it('produces a different order for a different seed', () => {
    const a = shuffleDeterministic(arr, 1);
    const b = shuffleDeterministic(arr, 999);
    expect(a).not.toEqual(b);
  });

  it('does not mutate the input', () => {
    const original = [...arr];
    shuffleDeterministic(arr, 7);
    expect(arr).toEqual(original);
  });

  it('preserves all elements', () => {
    const shuffled = shuffleDeterministic(arr, 123);
    expect(shuffled.sort((a, b) => a - b)).toEqual(arr);
  });
});
