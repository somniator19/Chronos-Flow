// Example of a  meeting
const sampleMeeting = {
  id: crypto.randomUUID(),  // this generates unique ID
  start: new Date('2026-01-10T09:00:00').getTime(),  // unix timestamp (ms)
  end: new Date('2026-01-10T10:30:00').getTime(),
  title: 'Team Glitch',
  location: 'Zoom',
  notes: 'Discuss project progress, Q&A session, celebrate milestones, and working on new steps.'
};
// Array to hold all meetings (from LocalStorage later)
let meetings = [sampleMeeting];

// Function to add a meeting (export for use in other files)
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

// Functions for persistence to save meetings to&from LocalStorage 
export function saveMeetings() {
  localStorage.setItem('meetings', JSON.stringify(meetings));
}
export function loadMeetings() {
  const saved = localStorage.getItem('meetings');
  if (saved) meetings = JSON.parse(saved);
}