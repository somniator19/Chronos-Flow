import { describe, it, expect } from 'vitest';
import { buildConflictClusters, createConflictMap } from './clustering.js';

describe('buildConflictClusters', () => {
    it('should return empty array when no overlaps exist', () => {
        const overlaps = [
            { meetingId0: '1', meetingId1: '2', overlaps: false },
            { meetingId0: '1', meetingId1: '3', overlaps: false }
        ];
        const clusters = buildConflictClusters(overlaps);
        expect(clusters).toEqual([]);
    });
    
    it('should group overlapping meetings into clusters', () => {
        const overlaps = [
            { meetingId0: '1', meetingId1: '2', overlaps: true },
            { meetingId0: '2', meetingId1: '3', overlaps: true },
            { meetingId0: '4', meetingId1: '5', overlaps: true }
        ];
        const clusters = buildConflictClusters(overlaps);
        expect(clusters.length).toBe(2);
        expect(clusters[0].sort()).toEqual(['1', '2', '3'].sort());
        expect(clusters[1].sort()).toEqual(['4', '5'].sort());
    });
    
    it('should handle single meeting overlaps', () => {
        const overlaps = [
            { meetingId0: '1', meetingId1: '2', overlaps: true }
        ];
        const clusters = buildConflictClusters(overlaps);
        expect(clusters.length).toBe(1);
        expect(clusters[0].sort()).toEqual(['1', '2'].sort());
    });
});

describe('createConflictMap', () => {
    it('should create map from meeting ID to cluster index', () => {
        const clusters = [['1', '2', '3'], ['4', '5']];
        const conflictMap = createConflictMap(clusters);
        expect(conflictMap.get('1')).toBe(0);
        expect(conflictMap.get('2')).toBe(0);
        expect(conflictMap.get('3')).toBe(0);
        expect(conflictMap.get('4')).toBe(1);
        expect(conflictMap.get('5')).toBe(1);
    });
    
    it('should return empty map for empty clusters', () => {
        const clusters = [];
        const conflictMap = createConflictMap(clusters);
        expect(conflictMap.size).toBe(0);
    });
});
