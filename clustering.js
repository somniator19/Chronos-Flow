//Builds conflict clusters (connected components) from pairwise intersections.

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

function inferConflicts(meetings) {
  const conflicts = [];
  for (let i = 0; i < meetings.length; i++) {
    for (let j = i + 1; j < meetings.length; j++) {
      const a = meetings[i];
      const b = meetings[j];
      if (overlaps(a, b)) {
        conflicts.push([a.id, b.id]);
      }
    }
  }
  return conflicts;
}

export function buildConflictClusters(meetings = [], conflicts = null) {
  if (!meetings.length) return [];

  const edges = conflicts ?? inferConflicts(meetings);

  const adj = new Map();
  meetings.forEach(m => adj.set(m.id, new Set()));

  edges.forEach(([a, b]) => {
    adj.get(a)?.add(b);
    adj.get(b)?.add(a);
  });

  const visited = new Set();
  const clusters = [];

  function dfs(id, cluster) {
    visited.add(id);
    cluster.push(id);
    for (const next of adj.get(id)) {
      if (!visited.has(next)) dfs(next, cluster);
    }
  }

  for (const m of meetings) {
    if (!visited.has(m.id)) {
      const ids = [];
      dfs(m.id, ids);
      clusters.push(ids.map(id => meetings.find(m => m.id === id)));
    }
  }

  return clusters;
}
