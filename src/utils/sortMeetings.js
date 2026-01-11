/**

  @param {Array} meetings
  @returns {Array}
 */
export function sortMeetingsByStartTime(meetings) {
    const sortedMeetings = [...meetings];

    for (let i = 0; i < sortedMeetings.length - 1; i += 1) {
        for (let j = 0; j < sortedMeetings.length - 1 - i; j += 1) {
            if (sortedMeetings[j].startTime > sortedMeetings[j + 1].startTime) {
                const temp = sortedMeetings[j];
                sortedMeetings[j] = sortedMeetings[j + 1];
                sortedMeetings[j + 1] = temp;
            }
        }
    }

    return sortedMeetings;
}
