// ~~~~~~~~~~~~~~~~~~~~~~~
// UI utilities (UI-only)
// ~~~~~~~~~~~~~~~~~~~~~~~
import {
  openForm,
  closeForm,
  saveFormData,
  editFormData,
  deleteFormData
} 
from './utils/formUtils';

// ~~~~~~~~~~~~~~~~~~~~~~
// Core logic (pure)
// ~~~~~~~~~~~~~~~~~~~~~~
import { getMeetings } from '../core-logic/data.js';
import { buildConflictClusters } from '../core-logic/clustering.js';

// ~~~~~~~~~~~~~~~~~~~~~
// Rendering + UI state
// ~~~~~~~~~~~~~~~~~~~~~
import { loadUIOptions, saveUIOptions } from './utils/uiOptions.js';
import { renderMeetings } from './utils/renderMeetings.js';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Persistent UI state (single)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let uiOptions = loadUIOptions();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Central render pipeline
// Fetch data → cluster → render using current UI state
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const render = () => {
  const meetings = getMeetings();
  const clusters = buildConflictClusters(meetings);

  renderMeetings({
    meetings,
    clusters,
    uiOptions
  });
};

// ~~~~~~~~~~~~~~~
// App bootstrap
// ~~~~~~~~~~~~~~~
const main = () => {
  // Buttons
  const addNewMeeting = document.querySelector('#add-new-meeting-btn');
  const saveNewMeeting = document.querySelector('#create-meeting-save-btn');
  const cancelNewMeeting = document.querySelector('#create-meeting-cancel-btn');

  const saveMeeting = document.querySelector('#view-meeting-save-btn');
  const editMeeting = document.querySelector('#view-meeting-edit-btn');
  const deleteMeeting = document.querySelector('#view-meeting-delete-btn');
  const cancelMeeting = document.querySelector('#view-meeting-cancel-btn');

  const modalCloseBtn = document.querySelector('#modal-close-btn');
  const modalOverlay = document.querySelector('#modal-overlay');

  // UI controls
  const viewModeSelect = document.querySelector('#view-mode-select');
  const sortModeSelect = document.querySelector('#sort-mode-select');
  const conflictsOnlyFilter = document.querySelector('#conflicts-only-filter');

  // ~~~~~~~~~~~~~~~~~~~~~~
  // New meeting handlers
  // ~~~~~~~~~~~~~~~~~~~~~~
  addNewMeeting?.addEventListener('click', () =>
    openForm('#create-meeting-form', true)
  );

  saveNewMeeting?.addEventListener('click', () => {
    saveFormData('#create-meeting-form', true);
    render();
  });

  cancelNewMeeting?.addEventListener('click', () =>
    closeForm('#create-meeting-form', true)
  );

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Existing meeting handlers
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~
  saveMeeting?.addEventListener('click', () => {
    const form = document.querySelector('#view-meeting-form');
    const meetingId = form?.dataset.currentMeetingId || '';
    saveFormData('#view-meeting-form', false, meetingId);
    render();
  });

  editMeeting?.addEventListener('click', () =>
    editFormData('#view-meeting-form')
  );

  deleteMeeting?.addEventListener('click', () => {
    const form = document.querySelector('#view-meeting-form');
    const meetingId = form?.dataset.currentMeetingId || '';
    deleteFormData('#view-meeting-form', meetingId);
    render();
  });

  cancelMeeting?.addEventListener('click', () =>
    closeForm('#view-meeting-form', false)
  );

  // ~~~~~~~~~~~~~~~~~~~~~
  // Modal close helpers
  // ~~~~~~~~~~~~~~~~~~~~~
  const closeActiveModal = () => {
    const createForm = document.querySelector('#create-meeting-form');
    const viewForm = document.querySelector('#view-meeting-form');

    if (createForm && !createForm.hidden) {
      closeForm('#create-meeting-form', true);
    } else if (viewForm && !viewForm.hidden) {
      closeForm('#view-meeting-form', false);
    }
  };

  modalCloseBtn?.addEventListener('click', closeActiveModal);

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeActiveModal();
  });

  // ~~~~~~~~~~~~~~~~~~~
  // UI option handlers
  // ~~~~~~~~~~~~~~~~~~~
  if (viewModeSelect) {
    viewModeSelect.value = uiOptions.viewMode;
    viewModeSelect.addEventListener('change', (e) => {
      uiOptions.viewMode = e.target.value;
      saveUIOptions(uiOptions);
      render();
    });
  }

  if (sortModeSelect) {
    sortModeSelect.value = uiOptions.sortMode;
    sortModeSelect.addEventListener('change', (e) => {
      uiOptions.sortMode = e.target.value;
      saveUIOptions(uiOptions);
      render();
    });
  }

  if (conflictsOnlyFilter) {
    conflictsOnlyFilter.checked = uiOptions.filters.showConflictsOnly === true;
    conflictsOnlyFilter.addEventListener('change', (e) => {
      uiOptions.filters.showConflictsOnly = Boolean(e.target.checked);
      saveUIOptions(uiOptions);
      render();
    });
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // Time input usability
  // ~~~~~~~~~~~~~~~~~~~~~
  const setupTimeInputs = () => {
    const timeInputs = document.querySelectorAll(
      'input[type="time"]:not([readonly])'
    );

    timeInputs.forEach((input) => {
      if (input.dataset.timeInputSetup === 'true') return;
      input.dataset.timeInputSetup = 'true';

      input.addEventListener('click', () => {
        input.focus();
        if (typeof input.showPicker === 'function') {
          try { input.showPicker(); } catch {}
        }
      });
    });
  };

  setupTimeInputs();

  if (modalOverlay) {
    const observer = new MutationObserver(() =>
      setTimeout(setupTimeInputs, 50)
    );

    observer.observe(modalOverlay, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden']
    });
  }

  // ~~~~~~~~~~~~~~~
  // Initial render
  // ~~~~~~~~~~~~~~~
  render();
};

main();