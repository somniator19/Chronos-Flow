/**

  @param {Array} meetings
  @returns {Array}
 */
  

import { checkOverlap } from './checkOverlap.js';

export function scanMeetingsForOverlaps(meetings) {
    const overlaps = [];

    for (let i = 0; i < meetings.length; i += 1) {
        for (let j = i + 1; j < meetings.length; j += 1) {
            overlaps.push(checkOverlap(meetings[i], meetings[j]));
        }
    }

    return overlaps;
}

export function sortMeetingsByStartTime(meetings) {
    var visited = new Set();
    var clusters = [];
     
     function searchMeet(meeting,cluster ){
         visited.add(meeting.id)
         cluster.push(meeting)

         for (other of meetings){
            if (!visited.has(other.id) && intersects(meeting, other) ){
                searchMeet(other, cluster)
            }
         }
     }

     for (item of items){
        if(!visited.has(item.id)){
            const cluster = [];
            searchMeet(item, cluster)
            clusters.push(cluster);
        }
     }
     return clusters;
    }