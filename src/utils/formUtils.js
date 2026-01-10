import { createMeeting, deleteMeeting, getMeetingById, updateMeeting } from './queries.js';

const getHighestZIndex = (id) => {
    let max = 0;
    const sidebar = document.querySelector(id);
    const children = sidebar.children;
    for (const child of children) {
        if (child.style.zIndex && parseInt(child.style.zIndex) > max) {
            max = parseInt(child.style.zIndex);
        }
    }
    return max;
};

const toggleReadOnly = (formId, status) => {
    const form = document.querySelector(formId);
    form.querySelector('#view-meeting-topic').readOnly = status;
    form.querySelector('#view-meeting-description').readOnly = status;
    form.querySelector('#view-meeting-date').readOnly = status;
    form.querySelector('#view-meeting-start-time').readOnly = status;
    form.querySelector('#view-meeting-end-time').readOnly = status;
    form.querySelector('#view-meeting-invited').readOnly = status;
    form.querySelector('#view-meeting-accepted').readOnly = status;
};

export const getFormData = (formId) => {
    const form = document.querySelector(formId);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    return data;
};

const extractDateTime = (data) => {
    const date = new Date(data['date']).getTime();
    const startTime = new Date(`${data['date']}T${data['start-time']}`).getTime();
    const endTime = new Date(`${data['date']}T${data['end-time']}`).getTime();
    return [date, startTime, endTime];
};

const convertFromTimestamp = (timestamp, part = 'time') => {
    const offset = new Date(timestamp).getTimezoneOffset() * 60000;
    const isoString = new Date(timestamp - offset).toISOString();
    const [date, timePart] = isoString.split('T');
    const time = timePart.slice(0, 5);
    if (part === 'date') {
        return date;
    }
    return time;
};

const populateForm = (formId, meetindId) => {
    const form = document.querySelector(formId);
    const data = getMeetingById(meetindId);
    const date = convertFromTimestamp(parseInt(data.date), 'date');
    const startTime = convertFromTimestamp(parseInt(data.startTime));
    const endTime = convertFromTimestamp(parseInt(data.endTime));

    form.querySelector('#view-meeting-topic').value = data.topic;
    form.querySelector('#view-meeting-description').value = data.description;
    form.querySelector('#view-meeting-date').value = date;
    form.querySelector('#view-meeting-start-time').value = startTime;
    form.querySelector('#view-meeting-end-time').value = endTime;
    form.querySelector('#view-meeting-invited').value = data.contactsInvited;
    form.querySelector('#view-meeting-accepted').value = data.contactsAccepted;
};

export const openForm = (formId, newForm, meetindId = '') => {
    const maxIndex = getHighestZIndex('#sidebar');
    const form = document.querySelector(formId);
    form.style.zIndex = maxIndex + 1;
    form.hidden = false;

    if (!newForm) {
        populateForm(formId, meetindId);
    } else {
        form.querySelector('.meeting-topic').focus();
    }
};

export const saveFormData = (formId, newForm, meetindId) => {
    const formData = getFormData(formId);
    const [date, startTime, endTime] = extractDateTime(formData);
    const data = {
        ...formData,
        date,
        startTime,
        endTime,
    };
    if (newForm) {
        createMeeting(data);
    } else {
        updateMeeting(meetindId, data);
    }
    closeForm(formId, newForm);
    return data;
};

export const closeForm = (formId, newForm) => {
    const form = document.querySelector(formId);
    form.reset();
    if (!newForm) {
        toggleReadOnly(formId, true);
    }
    form.style.zIndex = 100;
    form.hidden = true;
};

export const editFormData = (formId) => {
    toggleReadOnly(formId, false);
    document.querySelector('#view-meeting-topic').focus();
};

export const deleteFormData = (formId, meetindId) => {
    deleteMeeting(meetindId);
    closeForm(formId, false);
};
