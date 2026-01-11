/**
 * Groups intersecting items into conflict clusters (connected components)
 * @param {Array} overlaps - Array of overlap objects from scanMeetingsForOverlaps
 * @returns {Array} Array of clusters, where each cluster is an array of meeting IDs
 */
export function buildConflictClusters(overlaps) {
    // Filter to only actual overlaps
    const actualOverlaps = overlaps.filter(overlap => overlap.overlaps);
    
    if (actualOverlaps.length === 0) {
        return [];
    }

    // Build adjacency graph: map from meeting ID to set of connected meeting IDs
    const graph = new Map();
    
    actualOverlaps.forEach(overlap => {
        const id0 = overlap.meetingId0;
        const id1 = overlap.meetingId1;
        
        if (!graph.has(id0)) {
            graph.set(id0, new Set());
        }
        if (!graph.has(id1)) {
            graph.set(id1, new Set());
        }
        
        graph.get(id0).add(id1);
        graph.get(id1).add(id0);
    });

    // Use DFS to find connected components
    const visited = new Set();
    const clusters = [];

    function dfs(nodeId, currentCluster) {
        visited.add(nodeId);
        currentCluster.push(nodeId);
        
        const neighbors = graph.get(nodeId);
        if (neighbors) {
            neighbors.forEach(neighborId => {
                if (!visited.has(neighborId)) {
                    dfs(neighborId, currentCluster);
                }
            });
        }
    }

    // Find all connected components
    graph.forEach((neighbors, nodeId) => {
        if (!visited.has(nodeId)) {
            const cluster = [];
            dfs(nodeId, cluster);
            clusters.push(cluster);
        }
    });

    return clusters;
}

/**
 * Creates a map from meeting ID to cluster index for quick lookup
 * @param {Array} clusters - Array of clusters from buildConflictClusters
 * @returns {Map} Map from meeting ID to cluster index
 */
export function createConflictMap(clusters) {
    const conflictMap = new Map();
    
    clusters.forEach((cluster, index) => {
        cluster.forEach(meetingId => {
            conflictMap.set(meetingId, index);
        });
    });
    
    return conflictMap;
}
