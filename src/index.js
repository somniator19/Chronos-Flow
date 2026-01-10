import { openForm, closeForm, saveFormData, editFormData, deleteFormData } from './utils/formUtils.js';

const main = () => {
    const addNewMeeting = document.querySelector('#add-new-meeting-btn');

    const saveNewMeeting = document.querySelector('#create-meeting-save-btn');
    const cancelNewMeeting = document.querySelector('#create-meeting-cancel-btn');

    const viewMeeting = document.querySelector('#view-meeting-btn');
    const saveMeeting = document.querySelector('#view-meeting-save-btn');
    const editMeeting = document.querySelector('#view-meeting-edit-btn');
    const deleteMeeting = document.querySelector('#view-meeting-delete-btn');
    const cancelMeeting = document.querySelector('#view-meeting-cancel-btn');

    // new meeting
    addNewMeeting.addEventListener('click', () => openForm('#create-meeting-form', true));
    saveNewMeeting.addEventListener('click', () => saveFormData('#create-meeting-form', true));
    cancelNewMeeting.addEventListener('click', () => closeForm('#create-meeting-form', true));

    // existing meeting
    viewMeeting.addEventListener('click', () =>
        openForm('#view-meeting-form', false, viewMeeting.dataset.id)
    );
    saveMeeting.addEventListener('click', () =>
        saveFormData('#view-meeting-form', false, viewMeeting.dataset.id)
    );
    editMeeting.addEventListener('click', () => editFormData('#view-meeting-form'));
    deleteMeeting.addEventListener('click', () =>
        deleteFormData('#view-meeting-form', viewMeeting.dataset.id)
    );
    cancelMeeting.addEventListener('click', () => closeForm('#view-meeting-form', false));
};

main();
