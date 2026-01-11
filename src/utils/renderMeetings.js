/**
 * Renders meetings grouped by conflict clusters,
 * @param {Array<Array<Object>>} clusters
 * @param {Object} uiOptions
 */
export function renderMeetings(clusters = [], uiOptions = {}) {
  const container = document.querySelector('#meetings-container');
  if (!container) return;

  container.innerHTML = '';

  const {
    viewMode = 'list',
    sortMode = 'start',
    filters = {}
  } = uiOptions;

  const showConflictsOnly = filters.showConflictsOnly === true;

  /*───────────────────────────────────────
    Flatten clusters into renderable items
  ──────────────────────────────────────*/
  let items = [];

  clusters.forEach((cluster, clusterIndex) => {
    if (!Array.isArray(cluster)) return;

    const isConflict = cluster.length > 1;
    if (showConflictsOnly && !isConflict) return;

    cluster.forEach(meeting => {
      items.push({
        ...meeting,
        isConflict,
        clusterIndex
      });
    });
  });

  /*───────────
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

    const start = formatTime(m.start);
    const end = formatTime(m.end);

    el.textContent = `${m.title} | ${start} – ${end}`;
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
  const span = Math.max(1, max - min);

  items.forEach(m => {
    const bar = document.createElement('div');
    bar.className = 'timeline-item';

    bar.classList.add(`cluster-${m.clusterIndex}`);

    if (m.isConflict) bar.classList.add('conflict');

    const left = ((m.start - min) / span) * 100;
    const width = ((m.end - m.start) / span) * 100;

    bar.style.left = `${left}%`;
    bar.style.width = `${width}%`;

    bar.textContent = m.title;

    timeline.appendChild(bar);
  });

  container.appendChild(timeline);
}

/* ─────────────
   Utilities
───────────── */
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}