/*==========================================================
   UI persistence + meeting storage helpers (UI layer only)
==========================================================*/
const STORAGE_KEY = 'meetings';
const UI_OPTIONS_KEY = 'meetingManagerUIOptions';

/*===============================
   Meetings (UI-side storage)
===============================*/

export function getAllMeetings() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getMeetingById(id) {
  return getAllMeetings().find((m) => m.id === id);
}

export function createMeeting(data) {
  const meetings = getAllMeetings();
  const newMeeting = { id: crypto.randomUUID(), ...data };
  meetings.push(newMeeting);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
  return newMeeting;
}

export function updateMeeting(id, updates) {
  const updated = getAllMeetings().map((m) =>
    m.id === id ? { ...m, ...updates } : m
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteMeeting(id) {
  const filtered = getAllMeetings().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/*=============================================
   UI Options (view mode, sort mode, filters)
=============================================*/

const defaultUIOptions = {
  viewMode: 'list',
  sortMode: 'start',
  filters: {
    showConflictsOnly: false
  }
};

export function loadUIOptions() {
  const stored = localStorage.getItem(UI_OPTIONS_KEY);
  if (!stored) return defaultUIOptions;

  try {
    const parsed = JSON.parse(stored);
    return {
      ...defaultUIOptions,
      ...parsed,
      filters: {
        ...defaultUIOptions.filters,
        ...(parsed.filters || {})
      }
    };
  } catch {
    return defaultUIOptions;
  }
}

export function saveUIOptions(options) {
  localStorage.setItem(UI_OPTIONS_KEY, JSON.stringify(options));
}

export function updateUIOption(key, value) {
  const options = loadUIOptions();

  if (key === 'filters') {
    options.filters = { ...options.filters, ...value };
  } else {
    options[key] = value;
  }

  saveUIOptions(options);
  return options;
}
