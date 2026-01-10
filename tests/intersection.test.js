import { describe, it, expect } from 'vitest';
import { detectPairwiseIntersections } from '../core-logic/intersection.js';

describe('Pairwise Intersection Detection', () => {
  it('detects overlapping meetings correctly', () => {
    const meetings = [
      { id: 'm1', start: 900, end: 1030 },   // 9:00 - 10:30
      { id: 'm2', start: 1000, end: 1100 },  // 10:00 - 11:00 → overlaps
      { id: 'm3', start: 1130, end: 1230 }   // 11:30 - 12:30 → no overlap
    ];

    const result = detectPairwiseIntersections(meetings);
    expect(result).toHaveLength(1);
    expect(result).toContainEqual(['m1', 'm2']);
  });

  it('returns empty array when no overlaps', () => {
    const meetings = [
      { id: 'm1', start: 900, end: 1000 },
      { id: 'm2', start: 1100, end: 1200 }
    ];
    expect(detectPairwiseIntersections(meetings)).toEqual([]);
  });

  it('handles empty array or single item', () => {
    expect(detectPairwiseIntersections([])).toEqual([]);
    expect(detectPairwiseIntersections([{ id: 'm1', start: 900, end: 1000 }])).toEqual([]);
  });
});