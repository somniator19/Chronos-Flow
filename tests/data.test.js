import { describe, it, expect } from 'vitest';
import { addMeeting, getMeetings } from '../data.js';

describe('Meeting Data Structure', () => {
  it('adds meeting with correct timestamps', () => {
    const newMeeting = addMeeting('2026-01-10T09:00:00', '2026-01-10T10:00:00', 'Test Meeting');
    expect(newMeeting.start).toBe(new Date('2026-01-10T09:00:00').getTime());
    expect(newMeeting.end).toBe(new Date('2026-01-10T10:00:00').getTime());
    expect(getMeetings()).toContainEqual(newMeeting);
  });
});