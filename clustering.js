/**
 * Detect whether two meetings overlap.
 * @param {{start:number,end:number}} a
 * @param {{start:number,end:number}} b
 * @returns {boolean}
 */
const overlaps = (a, b) => a.start < b.end && b.start < a.end;

/**
 * Infer conflict edges from a list of meetings.
 * @param {Array<{id:string,start:number,end:number}>} meetings
 * @returns {Array<[string,string]>}
 */
function inferConflicts(meetings) {
  const edges = [];
  for (let i = 0; i < meetings.length; i++) {
    const a = meetings[i];
    for (let j = i + 1; j < meetings.length; j++) {
      
        const b = meetings[j];
      if (overlaps(a, b)) edges.push([a.id, b.id]);
    }
  }
  return edges;
}

/**
 * Build an adjacency map (id → Set<neighborId>) from meetings + optional edge list.
 * Throws on duplicate IDs or malformed meetings.
 */
function buildAdjacencyMap(meetings, conflicts) {
  const byId = new Map();
  const adj = new Map();

  // Validate & initialise nodes
  for (const m of meetings) {
    if (byId.has(m.id))
      throw new Error(`Duplicate meeting id detected: ${m.id}`);
    if (typeof m.start !== 'number' || typeof m.end !== 'number')
      throw new TypeError(`Meeting ${m.id} must have numeric start/end`);
    byId.set(m.id, m);
    adj.set(m.id, new Set());
  }

  const edges = conflicts ?? inferConflicts(meetings);
  for (const [a, b] of edges) {
    if (a === b) continue; // ignore self‑loops
    adj.get(a).add(b);
    adj.get(b).add(a);
  }

  return { adj, byId };
}

/**
 * Build conflict clusters (connected components) from meetings.
 *
 * @param {Array<{id:string,start:number,end:number}>} meetings
 * @param {Array<[string,string]>|null} conflicts – optional pre‑computed edge list.
 * @returns {Array<Array<{id:string,start:number,end:number}>>}
 */
export function buildConflictClusters(meetings = [], conflicts = null) {
  if (!meetings.length) return [];

  const { adj, byId } = buildAdjacencyMap(meetings, conflicts);

  const visited = new Set();
  const clusters = [];

  const dfs = (id, acc) => {
    visited.add(id);
    acc.push(byId.get(id));
    for (const nxt of adj.get(id)) {
      if (!visited.has(nxt)) dfs(nxt, acc);
    }
  };

  for (const { id } of meetings) {
    if (!visited.has(id)) {
      const cluster = [];
      dfs(id, cluster);
      clusters.push(cluster);
    }
  }

  return clusters;
}
