const STORAGE_KEY = 'chronos-ui-options';

const DEFAULT_OPTIONS = {
  viewMode: 'list',      // 'list' | 'range'
  sortMode: 'start',     // 'start' | 'end'
  filters: {
    showConflictsOnly: false
  }
};

export function loadUIOptions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_OPTIONS);

    return {
      ...DEFAULT_OPTIONS,
      ...JSON.parse(raw),
      filters: {
        ...DEFAULT_OPTIONS.filters,
        ...JSON.parse(raw).filters
      }
    };
  } catch {
    return structuredClone(DEFAULT_OPTIONS);
  }
}
export function saveUIOptions(options) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
}