/**
 * Renders meetings grouped by conflict clusters.
 * @param {Array<Array<{id,start,end}>>} clusters
 * @param {Object} uiOptions
 */
export function renderMeetings(clusters = [], uiOptions = {}) {
  const container = document.querySelector('#meetings-container');
  if (!container) return;

  container.innerHTML = '';

  const { viewMode = 'list', sortMode = 'start', filters = {} } = uiOptions;
  const showConflictsOnly = filters.showConflictsOnly === true;

  /*─────────────────────────────────────── 
  Flatten clusters into renderable items 
  ───────────────────────────────────────*/
let items = [];

Object.entries(clusters).forEach(([label, meetings], clusterIndex) => {
  const list = Array.isArray(meetings)
    ? meetings
    : Object.values(meetings);

  const isConflict = list.length > 1;

  if (showConflictsOnly && !isConflict) return;

  list.forEach(meeting => {
    items.push({
      ...meeting,
      isConflict,
      clusterIndex,
      clusterLabel: label
    });
  });
});
  /*───────────── 
   Sorting 
  ─────────────*/
  if (sortMode === 'start') {
    items.sort((a, b) => a.start - b.start);
  } else if (sortMode === 'end') {
    items.sort((a, b) => a.end - b.end);
  }

  /*───────────── 
    Render mode 
  ─────────────*/
  if (viewMode === 'range') {
    renderRangeView(container, items);
  } else {
    renderListView(container, items);
  }
}

/* ─────────────
   List view
───────────── */
function renderListView(container, items) {
  items.forEach(m => {
    const el = document.createElement('div');
    el.className = 'meeting-item';

    el.classList.add(`cluster-${m.clusterIndex}`);
    if (m.isConflict) el.classList.add('conflict');

    el.textContent = `${m.id} | ${m.start} – ${m.end}`;
    container.appendChild(el);
  });
}

/* ─────────────
   Range view
───────────── */
function renderRangeView(container, items) {
  if (!items.length) return;

  const timeline = document.createElement('div');
  timeline.className = 'timeline';

  const min = Math.min(...items.map(m => m.start));
  const max = Math.max(...items.map(m => m.end));
  const span = Math.max(1, max - min); // avoid division by zero at all costs!

  items.forEach(m => {
    const bar = document.createElement('div');
    bar.className = 'timeline-item';

    bar.classList.add(`cluster-${m.clusterIndex}`);
    if (m.isConflict) bar.classList.add('conflict');

    const left = ((m.start - min) / span) * 100;
    const width = ((m.end - m.start) / span) * 100;

    bar.style.left = `${left}%`;
    bar.style.width = `${width}%`;

    bar.textContent = m.id;

    timeline.appendChild(bar);
  });

  container.appendChild(timeline);
}
