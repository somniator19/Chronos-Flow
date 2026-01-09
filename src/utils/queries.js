const STORAGE_KEY = 'meetings';

export function getAllMeetings() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function getMeetingById(id) {
    return getAllMeetings().find((meeting) => meeting.id === id);
}

export function createMeeting(data) {
    const meetings = getAllMeetings();

    const newMeeting = { id: crypto.randomUUID(), ...data };

    meetings.push(newMeeting);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));

    return newMeeting;
}

export function updateMeeting(id, updates) {
    const updatedMeetings = getAllMeetings().map((meeting) =>
        meeting.id === id ? { ...meeting, ...updates } : meeting
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMeetings));
}

export function deleteMeeting(id) {
    const filteredMeetings = getAllMeetings().filter((meeting) => meeting.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMeetings));
}
