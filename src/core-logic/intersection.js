import { getMeetings } from './data.js';
/**
 * Detects all pairwise intersections (overlaps) between meetings.
 * @param {Array} meetings - Array of meeting objects { id, start, end, ... }
 * @returns {Array} Array of conflicting pairs: [['id1', 'id2'], ['id3', 'id4'], ...]
 */
export function detectPairwiseIntersections(meetings = getMeetings()) {
  const conflicts = [];

  // Loop through every unique pair (i < j to avoid duplicates A-B and B-A)
  for (let i = 0; i < meetings.length; i++) {
    for (let j = i + 1; j < meetings.length; j++) {
      const a = meetings[i];
      const b = meetings[j];

      // Classic overlap condition
      if (a.start < b.end && b.start < a.end) {
        conflicts.push([a.id, b.id]); // Normalized: array of IDs
      }
    }
  }

  return conflicts;
}

/* Example usage
const sample = [
  { id: 'm1', start: 900, end: 1030 },   // 9:00 - 10:30
  { id: 'm2', start: 1000, end: 1100 },  // 10:00 - 11:00
  { id: 'm3', start: 1130, end: 1230 }   // 11:30 - 12:30
];
console.log(detectPairwiseIntersections(sample)); // → [['m1', 'm2']]
*/