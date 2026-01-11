/**
 * Checks if two meetings overlap based on their start/end time values
 * @param {Object} meetingA - Meeting object with id, startTime, endTime
 * @param {Object} meetingB - Meeting object with id, startTime, endTime
 * @returns {Object} Normalized overlap result structure
 */
export function checkOverlap(meetingA, meetingB) {
    // Ensure we're comparing the same day (same date)
    const sameDate = meetingA.date === meetingB.date;
    
    if (!sameDate) {
        return {
            meetingId0: meetingA.id,
            meetingId1: meetingB.id,
            overlaps: false
        };
    }

    // Check if time ranges overlap: meetingA starts before meetingB ends AND meetingB starts before meetingA ends
    const overlaps = meetingA.startTime < meetingB.endTime && meetingB.startTime < meetingA.endTime;

    return {
        meetingId0: meetingA.id,
        meetingId1: meetingB.id,
        overlaps
    };
}
