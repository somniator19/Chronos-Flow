// Example of a meeting
const sampleMeeting = {
  id: crypto.randomUUID(),  // Generates unique ID
  start: new Date('2026-01-10T09:00:00').getTime(),  // Unix timestamp (ms)
  end: new Date('2026-01-10T10:30:00').getTime(),
  title: 'Team Glitch',
  location: 'Google Meet',
  notes: 'Discuss project progress, Q&A session, celebrating milestones and planning next steps.'
};
// Array to hold all meetings (can be added from LocalStorage later)
let meetings = [sampleMeeting];

// Function to add a meeting (can be used in other files)
export function addMeeting(startDate, endDate, title = '', location = '', notes = '') {
  const id = crypto.randomUUID();
  const newMeeting = {
    id,
    start: new Date(startDate).getTime(),
    end: new Date(endDate).getTime(),
    title,
    location,
    notes
  };
  meetings.push(newMeeting);
  return newMeeting;
}

// Function to get all meetings
export function getMeetings() {
  return meetings;
}

// This will be saved to LocalStorage for persistence later
export function saveMeetings() {
  localStorage.setItem('meetings', JSON.stringify(meetings));
}
export function loadMeetings() {
  const saved = localStorage.getItem('meetings');
  if (saved) meetings = JSON.parse(saved);
}
/*Example usage
addMeeting('2026-01-10T10:00', '2026-01-10T11:00', 'Study Session');
console.log(getMeetings());
*/