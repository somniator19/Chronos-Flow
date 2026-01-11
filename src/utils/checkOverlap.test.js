import { describe, it, expect } from 'vitest';
import { checkOverlap } from './checkOverlap.js';

describe('checkOverlap', () => {
    const baseDate = new Date('2025-12-27').getTime();
    
    it('should detect overlapping meetings on the same day', () => {
        const meetingA = {
            id: '1',
            date: baseDate,
            startTime: new Date('2025-12-27T10:00:00').getTime(),
            endTime: new Date('2025-12-27T11:00:00').getTime()
        };
        const meetingB = {
            id: '2',
            date: baseDate,
            startTime: new Date('2025-12-27T10:30:00').getTime(),
            endTime: new Date('2025-12-27T11:30:00').getTime()
        };
        
        const result = checkOverlap(meetingA, meetingB);
        expect(result.overlaps).toBe(true);
        expect(result.meetingId0).toBe('1');
        expect(result.meetingId1).toBe('2');
    });
    
    it('should not detect overlap for non-overlapping meetings', () => {
        const meetingA = {
            id: '1',
            date: baseDate,
            startTime: new Date('2025-12-27T10:00:00').getTime(),
            endTime: new Date('2025-12-27T11:00:00').getTime()
        };
        const meetingB = {
            id: '2',
            date: baseDate,
            startTime: new Date('2025-12-27T11:00:00').getTime(),
            endTime: new Date('2025-12-27T12:00:00').getTime()
        };
        
        const result = checkOverlap(meetingA, meetingB);
        expect(result.overlaps).toBe(false);
    });
    
    it('should not detect overlap for meetings on different days', () => {
        const meetingA = {
            id: '1',
            date: new Date('2025-12-27').getTime(),
            startTime: new Date('2025-12-27T10:00:00').getTime(),
            endTime: new Date('2025-12-27T11:00:00').getTime()
        };
        const meetingB = {
            id: '2',
            date: new Date('2025-12-28').getTime(),
            startTime: new Date('2025-12-28T10:00:00').getTime(),
            endTime: new Date('2025-12-28T11:00:00').getTime()
        };
        
        const result = checkOverlap(meetingA, meetingB);
        expect(result.overlaps).toBe(false);
    });
    
    it('should return normalized result structure', () => {
        const meetingA = {
            id: 'meeting-a',
            date: baseDate,
            startTime: new Date('2025-12-27T10:00:00').getTime(),
            endTime: new Date('2025-12-27T11:00:00').getTime()
        };
        const meetingB = {
            id: 'meeting-b',
            date: baseDate,
            startTime: new Date('2025-12-27T10:30:00').getTime(),
            endTime: new Date('2025-12-27T11:30:00').getTime()
        };
        
        const result = checkOverlap(meetingA, meetingB);
        expect(result).toHaveProperty('meetingId0');
        expect(result).toHaveProperty('meetingId1');
        expect(result).toHaveProperty('overlaps');
        expect(typeof result.overlaps).toBe('boolean');
    });
});
