/**

  @param {Array} meetings
  @returns {Array}
 */

  
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