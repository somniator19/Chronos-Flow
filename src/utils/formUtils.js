/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   UI-only form handling helpers (open, close, save, edit, delete)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
import {
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getMeetingById
} from './queries';

/*^^^^^^^^^^^^^^^
   Modal helpers
^^^^^^^^^^^^^^^*/

const showModal = () => {
  const overlay = document.querySelector('#modal-overlay');
  if (overlay) {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }
};

const hideModal = () => {
  const overlay = document.querySelector('#modal-overlay');
  if (overlay) {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }
};

const updateModalVisibility = () => {
  const overlay = document.querySelector('#modal-overlay');
  if (!overlay) return;

  const visibleForm = [...overlay.querySelectorAll('form')]
    .some(f => !f.hidden);

  visibleForm ? showModal() : hideModal();
};

/*^^^^^^^^^^^^^^^^
   Form helpers
^^^^^^^^^^^^^^^^*/

export const getFormData = (formId) => {
  const form = document.querySelector(formId);
  return Object.fromEntries(new FormData(form).entries());
};

const extractDateTime = (data) => {
  const date = new Date(data.date).getTime();
  const startTime = new Date(`${data.date}T${data['start-time']}`).getTime();
  const endTime = new Date(`${data.date}T${data['end-time']}`).getTime();
  return { date, startTime, endTime };
};

const populateForm = (formId, meetingId) => {
  const form = document.querySelector(formId);
  const meeting = getMeetingById(meetingId);
  if (!form || !meeting) return;

  form.querySelector('#view-meeting-topic').value = meeting.topic;
  form.querySelector('#view-meeting-description').value = meeting.description;
};

/*^^^^^^^^^^^^^
   Public API
^^^^^^^^^^^^^*/

export const openForm = (formId, isNew, meetingId = '') => {
  const overlay = document.querySelector('#modal-overlay');
  overlay?.querySelectorAll('form').forEach(f => f.hidden = true);

  const form = document.querySelector(formId);
  if (!form) return;

  form.hidden = false;
  if (!isNew) populateForm(formId, meetingId);
  form.dataset.currentMeetingId = meetingId;

  updateModalVisibility();
};

export const closeForm = (formId) => {
  const form = document.querySelector(formId);
  if (!form) return;

  form.reset();
  form.hidden = true;
  updateModalVisibility();
};

export const saveFormData = (formId, isNew, meetingId) => {
  const raw = getFormData(formId);
  const times = extractDateTime(raw);
  const data = { ...raw, ...times };

  if (isNew) {
    createMeeting(data);
  } else {
    updateMeeting(meetingId, data);
  }

  closeForm(formId);
};

export const editFormData = () => {
  document.querySelector('#view-meeting-topic')?.focus();
};

export const deleteFormData = (formId, meetingId) => {
  deleteMeeting(meetingId);
  closeForm(formId);
};
