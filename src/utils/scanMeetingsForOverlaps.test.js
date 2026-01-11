import { describe, it, expect } from 'vitest';
import { scanMeetingsForOverlaps } from './scanMeetingsForOverlaps.js';

describe('scanMeetingsForOverlaps', () => {
    const baseDate = new Date('2025-12-27').getTime();
    
    it('should scan all meeting pairs', () => {
        const meetings = [
            {
                id: '1',
                date: baseDate,
                startTime: new Date('2025-12-27T10:00:00').getTime(),
                endTime: new Date('2025-12-27T11:00:00').getTime()
            },
            {
                id: '2',
                date: baseDate,
                startTime: new Date('2025-12-27T11:00:00').getTime(),
                endTime: new Date('2025-12-27T12:00:00').getTime()
            },
            {
                id: '3',
                date: baseDate,
                startTime: new Date('2025-12-27T10:30:00').getTime(),
                endTime: new Date('2025-12-27T11:30:00').getTime()
            }
        ];
        
        const overlaps = scanMeetingsForOverlaps(meetings);
        expect(overlaps.length).toBe(3); // C(3,2) = 3 pairs
        expect(overlaps.every(o => 
            o.hasOwnProperty('meetingId0') && 
            o.hasOwnProperty('meetingId1') && 
            o.hasOwnProperty('overlaps')
        )).toBe(true);
    });
    
    it('should return empty array for empty meetings', () => {
        const overlaps = scanMeetingsForOverlaps([]);
        expect(overlaps).toEqual([]);
    });
    
    it('should return empty array for single meeting', () => {
        const meetings = [{
            id: '1',
            date: baseDate,
            startTime: new Date('2025-12-27T10:00:00').getTime(),
            endTime: new Date('2025-12-27T11:00:00').getTime()
        }];
        const overlaps = scanMeetingsForOverlaps(meetings);
        expect(overlaps).toEqual([]);
    });
});
