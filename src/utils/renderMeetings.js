export function renderMeetings({ meetings, clusters, uiOptions }) {
  const container = document.querySelector('#meetings-container');
  if (!container) return;

  container.innerHTML = '';

  const { viewMode, sortMode, filters } = uiOptions;
  const showConflictsOnly = filters?.showConflictsOnly === true;
  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Flatten clusters into renderable items
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  let items = [];

  clusters.forEach((cluster) => {
    const isConflict = cluster.length > 1;

    cluster.forEach((meeting) => {
      if (showConflictsOnly && !isConflict) return;

      items.push({
        ...meeting,
        isConflict
      });
    });
  });

  /*~~~~~~~~~~
    Sorting
  ~~~~~~~~~~*/
  if (sortMode === 'start') {
    items.sort((a, b) => a.start - b.start);
  } else if (sortMode === 'end') {
    items.sort((a, b) => a.end - b.end);
  }
  /*~~~~~~~~~~~~~~
    Render modes
  ~~~~~~~~~~~~~~*/
  if (viewMode === 'range') {
    renderRangeView(container, items);
  } else {
    renderListView(container, items);
  }
}

/* ~~~~~~~~~~~~~
   List view
~~~~~~~~~~~~~ */
function renderListView(container, items) {
  items.forEach((m) => {
    const el = document.createElement('div');
    el.className = 'meeting-item';

    if (m.isConflict) {
      el.classList.add('conflict');
    }

    el.textContent = `${m.id} | ${m.start} – ${m.end}`;
    container.appendChild(el);
  });
}

/* ~~~~~~~~~~~~~~
   Range view
~~~~~~~~~~~~~~ */
function renderRangeView(container, items) {
  const timeline = document.createElement('div');
  timeline.className = 'timeline';

  const min = Math.min(...items.map(m => m.start));
  const max = Math.max(...items.map(m => m.end));
  const span = max - min || 1;

  items.forEach((m) => {
    const bar = document.createElement('div');
    bar.className = 'timeline-item';

    if (m.isConflict) {
      bar.classList.add('conflict');
    }

    const left = ((m.start - min) / span) * 100;
    const width = ((m.end - m.start) / span) * 100;

    bar.style.left = `${left}%`;
    bar.style.width = `${width}%`;

    bar.textContent = m.id;
    timeline.appendChild(bar);
  });

  container.appendChild(timeline);
}