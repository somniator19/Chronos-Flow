import { openForm, closeForm, saveFormData, editFormData, deleteFormData, renderAllMeetings } from './utils/formUtils';
import { loadUIOptions, updateUIOption } from './utils/queries';

const main = () => {
    const addNewMeeting = document.querySelector('#add-new-meeting-btn');

    const saveNewMeeting = document.querySelector('#create-meeting-save-btn');
    const cancelNewMeeting = document.querySelector('#create-meeting-cancel-btn');

    const viewMeeting = document.querySelector('#view-meeting-btn');
    const saveMeeting = document.querySelector('#view-meeting-save-btn');
    const editMeeting = document.querySelector('#view-meeting-edit-btn');
    const deleteMeeting = document.querySelector('#view-meeting-delete-btn');
    const cancelMeeting = document.querySelector('#view-meeting-cancel-btn');
    const modalCloseBtn = document.querySelector('#modal-close-btn');
    const modalOverlay = document.querySelector('#modal-overlay');

    // UI Controls
    const viewModeSelect = document.querySelector('#view-mode-select');
    const sortModeSelect = document.querySelector('#sort-mode-select');
    const conflictsOnlyFilter = document.querySelector('#conflicts-only-filter');

    // new meeting
    addNewMeeting.addEventListener('click', () => openForm('#create-meeting-form', true));
    saveNewMeeting.addEventListener('click', () => saveFormData('#create-meeting-form', true));
    cancelNewMeeting.addEventListener('click', () => closeForm('#create-meeting-form', true));

    // existing meeting handlers
    saveMeeting.addEventListener('click', () => {
        const form = document.querySelector('#view-meeting-form');
        const meetingId = form?.dataset.currentMeetingId || '';
        saveFormData('#view-meeting-form', false, meetingId);
    });
    editMeeting.addEventListener('click', () => editFormData('#view-meeting-form'));
    deleteMeeting.addEventListener('click', () => {
        const form = document.querySelector('#view-meeting-form');
        const meetingId = form?.dataset.currentMeetingId || '';
        deleteFormData('#view-meeting-form', meetingId);
    });
    cancelMeeting.addEventListener('click', () => closeForm('#view-meeting-form', false));

    // Modal close handlers
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            // Close the currently visible form
            const createForm = document.querySelector('#create-meeting-form');
            const viewForm = document.querySelector('#view-meeting-form');
            
            if (createForm && !createForm.hidden) {
                closeForm('#create-meeting-form', true);
            } else if (viewForm && !viewForm.hidden) {
                closeForm('#view-meeting-form', false);
            }
        });
    }

    // Close modal when clicking on overlay (but not on the modal container)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                const createForm = document.querySelector('#create-meeting-form');
                const viewForm = document.querySelector('#view-meeting-form');
                
                if (createForm && !createForm.hidden) {
                    closeForm('#create-meeting-form', true);
                } else if (viewForm && !viewForm.hidden) {
                    closeForm('#view-meeting-form', false);
                }
            }
        });
    }

    // UI Options handlers
    if (viewModeSelect) {
        const options = loadUIOptions();
        viewModeSelect.value = options.viewMode;
        viewModeSelect.addEventListener('change', (e) => {
            updateUIOption('viewMode', e.target.value);
            renderAllMeetings();
        });
    }

    if (sortModeSelect) {
        const options = loadUIOptions();
        sortModeSelect.value = options.sortMode;
        sortModeSelect.addEventListener('change', (e) => {
            updateUIOption('sortMode', e.target.value);
            renderAllMeetings();
        });
    }

    if (conflictsOnlyFilter) {
        const options = loadUIOptions();
        // Ensure filters object exists
        const filters = options.filters || {};
        conflictsOnlyFilter.checked = filters.showConflictsOnly === true;
        conflictsOnlyFilter.addEventListener('change', (e) => {
            // Explicitly set boolean value
            updateUIOption('filters', { showConflictsOnly: Boolean(e.target.checked) });
            renderAllMeetings();
        });
    }

    // Make time inputs fully clickable
    const setupTimeInputs = () => {
        const timeInputs = document.querySelectorAll('input[type="time"]:not([readonly])');
        timeInputs.forEach(input => {
            // Skip if already has our handler
            if (input.dataset.timeInputSetup === 'true') {
                return;
            }
            
            // Mark as setup
            input.dataset.timeInputSetup = 'true';
            
            // Add click handler to open time picker when clicking anywhere on the field
            input.addEventListener('click', (e) => {
                // Focus the input first
                if (document.activeElement !== input) {
                    input.focus();
                }
                
                // Try to open the native time picker (modern browsers)
                // This allows clicking anywhere on the field to open the picker
                if (typeof input.showPicker === 'function') {
                    try {
                        input.showPicker();
                    } catch (err) {
                        // showPicker might not be available or might throw
                        // Fall back to default browser behavior
                    }
                }
                // For browsers without showPicker, the default click behavior should work
            });
        });
    };

    // Setup time inputs initially
    setupTimeInputs();
    
    // Re-setup time inputs when modal opens (using MutationObserver)
    if (modalOverlay) {
        const observer = new MutationObserver(() => {
            // Small delay to ensure DOM is ready
            setTimeout(setupTimeInputs, 50);
        });
        observer.observe(modalOverlay, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['hidden']
        });
    }

    // Initial render
    renderAllMeetings();
};

main();

