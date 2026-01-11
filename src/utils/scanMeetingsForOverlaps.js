import { checkOverlap } from './checkOverlap';

export function scanMeetingsForOverlaps(meetings) {
    const overlaps = [];

    for (let i = 0; i < meetings.length; i += 1) {
        for (let j = i + 1; j < meetings.length; j += 1) {
            overlaps.push(checkOverlap(meetings[i], meetings[j]));
        }
    }

    return overlaps;
}
