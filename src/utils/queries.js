const STORAGE_KEY = 'meetings';
const UI_OPTIONS_KEY = 'meetingManagerUIOptions';

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

// UI Options management
const defaultUIOptions = {
    viewMode: 'list',
    sortMode: 'time',
    filters: {
        showConflictsOnly: false
    }
};

export function loadUIOptions() {
    const stored = localStorage.getItem(UI_OPTIONS_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Deep merge filters object - ensure showConflictsOnly is explicitly set
            const mergedFilters = {
                ...defaultUIOptions.filters,
                ...(parsed.filters || {})
            };
            // Explicitly ensure showConflictsOnly is a boolean
            if (typeof mergedFilters.showConflictsOnly !== 'boolean') {
                mergedFilters.showConflictsOnly = defaultUIOptions.filters.showConflictsOnly;
            }
            
            return {
                ...defaultUIOptions,
                ...parsed,
                filters: mergedFilters
            };
        } catch (e) {
            return defaultUIOptions;
        }
    }
    return defaultUIOptions;
}

export function saveUIOptions(options) {
    localStorage.setItem(UI_OPTIONS_KEY, JSON.stringify(options));
}

export function updateUIOption(key, value) {
    const options = loadUIOptions();
    if (key === 'filters') {
        // Ensure filters object exists and merge properly
        if (!options.filters) {
            options.filters = { ...defaultUIOptions.filters };
        }
        options.filters = { ...options.filters, ...value };
    } else {
        options[key] = value;
    }
    saveUIOptions(options);
    return options;
}
