/**
 * Builds conflict clusters (connected components) from pairwise intersections.
 *
 * @param {Array} meetings - Array of meeting objects { id, ... }
 * @param {Array} conflicts - Array of conflicting pairs [['id1','id2'], ...]
 * @returns {Array} Array of clusters, each cluster is an array of meeting objects
 */
export function buildConflictClusters(meetings, conflicts) {
  // 1 Build adjacency list (graph)
  const graph = new Map();

  // Initialize graph nodes
  for (const meeting of meetings) {
    graph.set(meeting.id, new Set());
  }

  // Add edges
  for (const [a, b] of conflicts) {
    graph.get(a).add(b);
    graph.get(b).add(a);
  }

  // 2. DFS to find connected components
  const visited = new Set();
  const clusters = [];

  function dfs(meetingId, clusterIds) {
    visited.add(meetingId);
    clusterIds.push(meetingId);

    for (const neighbor of graph.get(meetingId)) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, clusterIds);
      }
    }
  }

  // 3 Run DFS from each unvisited node
  for (const meeting of meetings) {
    if (!visited.has(meeting.id)) {
      const clusterIds = [];
      dfs(meeting.id, clusterIds);

      // Convert IDs back to meeting objects
      const clusterMeetings = clusterIds.map(id =>
        meetings.find(m => m.id === id)
      );

      clusters.push(clusterMeetings);
    }
  }

  return clusters;
}
