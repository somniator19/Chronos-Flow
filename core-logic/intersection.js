/**
 * Detects all pairwise intersections (overlaps) between meetings.
 * @param {Array} meetings - Array of meeting objects, each with { id, start, end }
 * @returns {Array} Array of conflicting pairs: [['id1', 'id2'], ['id3', 'id4'], ...]
 */
export function detectPairwiseIntersections(meetings) {
  const conflicts = [];

  // Loop through every unique pair (i < j to avoid duplicates)
  for (let i = 0; i < meetings.length; i++) {
    for (let j = i + 1; j < meetings.length; j++) {
      const a = meetings[i];
      const b = meetings[j];

      // Overlap condition (classic interval overlap check)
      if (a.start < b.end && b.start < a.end) {
        conflicts.push([a.id, b.id]);
      }
    }
  }

  return conflicts;
}

// Example:
const sampleMeetings = [
  { id: 'm1', start: 900, end: 1030 },   // 9:00 - 10:30
  { id: 'm2', start: 1000, end: 1100 },  // 10:00 - 11:00
  { id: 'm3', start: 1130, end: 1230 },  // 11:30 - 12:30
  { id: 'm4', start: 945, end: 1115 }    // 9:45 - 11:15
];
const result = detectPairwiseIntersections(sampleMeetings);
console.log(result); // It will give: [['m1','m2'], ['m1','m4'], ['m2','m4']]