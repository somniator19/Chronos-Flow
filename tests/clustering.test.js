// clustering.test.js
import { describe, it, expect } from 'vitest';
import { buildConflictClusters } from '../clustering.js';

/**
 * Builds a conflict matrix from an array of meetings.
 * Used to simulate inferred conflicts in tests.
 */
function inferConflicts(meetings) {
  const conflicts = [];
  for (let i = 0; i < meetings.length; i++) {
    for (let j = i + 1; j < meetings.length; j++) {
      const a = meetings[i];
      const b = meetings[j];
      // Overlap if start < other.end && other.start < end
      if (a.start < b.end && b.start < a.end) {
        conflicts.push([a.id, b.id]);
      }
    }
  }
  return conflicts;
}

describe('buildConflictClusters – exhaustive behaviour', () => {
  /** 1. No conflicts – each meeting stands alone */
  it('returns one cluster per meeting when there are no conflicts', () => {
    const meetings = [
      { id: 'm1', start: 900, end: 1000 },
      { id: 'm2', start: 1030, end: 1130 },
      { id: 'm3', start: 1200, end: 1300 },
    ];
    const clusters = buildConflictClusters(meetings, []); // explicit empty conflict list

    expect(clusters).toHaveLength(3);
    clusters.forEach(cluster => expect(cluster).toHaveLength(1));
  });

  /** 2 Direct overlap – two meetings intersect */
  it('groups directly overlapping meetings into a single cluster', () => {
    const meetings = [
      { id: 'm1', start: 900, end: 1030 },
      { id: 'm2', start: 1000, end: 1100 },
      { id: 'm3', start: 1130, end: 1230 },
    ];
    const conflicts = [['m1', 'm2']]; // only m1 <-> m2 conflict

    const clusters = buildConflictClusters(meetings, conflicts);
    expect(clusters).toHaveLength(2);

    const sizes = clusters.map(c => c.length).sort(); // order‑agnostic
    expect(sizes).toEqual([1, 2]); // one singleton, one pair
  });

  /** 3. Transitive (indirect) overlap – A<->B, B<->C => A,B,C together */
  it('groups indirectly connected meetings into the same cluster', () => {
    const meetings = [
      { id: 'm1', start: 900, end: 1030 },
      { id: 'm2', start: 1000, end: 1100 },
      { id: 'm3', start: 1045, end: 1200 },
    ];
    const conflicts = [
      ['m1', 'm2'],
      ['m2', 'm3'],
    ]; // m1 does NOT directly overlap m3, but they connect through m2

    const clusters = buildConflictClusters(meetings, conflicts);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]).toHaveLength(3);
  });

  /** 4 Multiple independent clusters */
  it('handles several independent conflict groups', () => {
    const meetings = [
      { id: 'a1', start: 900, end: 1030 },
      { id: 'a2', start: 1000, end: 1100 },
      { id: 'b1', start: 1200, end: 1300 },
      { id: 'b2', start: 1230, end: 1330 },
    ];
    const conflicts = [
      ['a1', 'a2'],
      ['b1', 'b2'],
    ];

    const clusters = buildConflictClusters(meetings, conflicts);
    expect(clusters).toHaveLength(2);
    clusters.forEach(cluster => expect(cluster).toHaveLength(2));
  });

  /** 5. Smoke test – let the function infer conflicts itself */
  it('infers conflicts when the second argument is omitted', () => {
    const meetings = [
      { id: 'a', start: 900, end: 1030 },
      { id: 'b', start: 1000, end: 1100 },
      { id: 'c', start: 1200, end: 1300 },
      { id: 'd', start: 1215, end: 1330 },
    ];

    const clusters = buildConflictClusters(meetings); // no explicit conflicts
    // Expected: two clusters – {a,b} and {c,d}
    expect(clusters).toHaveLength(2);
    const sortedIds = clusters.map(c => c.map(m => m.id).sort());

    expect(sortedIds).toContainEqual(['a', 'b']);
    expect(sortedIds).toContainEqual(['c', 'd']);
  });

  /** 6 Edge cases – empty input and single meeting */
  it('returns an empty array when there are no meetings', () => {
    expect(buildConflictClusters([])).toEqual([]);
  });

  it('returns a single‑element cluster for a lone meeting', () => {
    const meetings = [{ id: 'solo', start: 900, end: 1000 }];
    const clusters = buildConflictClusters(meetings);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]).toHaveLength(1);
    expect(clusters[0][0].id).toBe('solo');
  });
});