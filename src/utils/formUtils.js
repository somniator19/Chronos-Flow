import { createMeeting, deleteMeeting, getMeetingById, updateMeeting, getAllMeetings, loadUIOptions } from './queries';
import { scanMeetingsForOverlaps } from './scanMeetingsForOverlaps';
import { buildConflictClusters, createConflictMap } from './clustering';
import { sortMeetingsByStartTime } from './sortMeetings';

// Show modal overlay
const showModal = () => {
    const overlay = document.querySelector('#modal-overlay');
    if (overlay) {
        overlay.hidden = false;
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
};

// Hide modal overlay
const hideModal = () => {
    const overlay = document.querySelector('#modal-overlay');
    if (overlay) {
        overlay.hidden = true;
        // Restore body scroll
        document.body.style.overflow = '';
    }
};

// Check if any form is visible and toggle modal visibility
const updateModalVisibility = () => {
    const overlay = document.querySelector('#modal-overlay');
    if (!overlay) return;
    
    const forms = overlay.querySelectorAll('form');
    let hasVisibleForm = false;
    
    for (const form of forms) {
        if (!form.hidden) {
            hasVisibleForm = true;
            break;
        }
    }
    
    // Show/hide modal based on form visibility
    if (hasVisibleForm) {
        showModal();
    } else {
        hideModal();
    }
};

// Toggle readOnly for the view form
const toggleReadOnly = (formId, status) => {
    const form = document.querySelector(formId);
    if (!form) return;
    
    const topicField = form.querySelector('#view-meeting-topic');
    const descriptionField = form.querySelector('#view-meeting-description');
    const dateField = form.querySelector('#view-meeting-date');
    const startTimeField = form.querySelector('#view-meeting-start-time');
    const endTimeField = form.querySelector('#view-meeting-end-time');
    const invitedField = form.querySelector('#view-meeting-invited');
    const acceptedField = form.querySelector('#view-meeting-accepted');
    const saveBtn = form.querySelector('#view-meeting-save-btn');
    const editBtn = form.querySelector('#view-meeting-edit-btn');
    
    if (topicField) topicField.readOnly = status;
    if (descriptionField) descriptionField.readOnly = status;
    if (dateField) dateField.readOnly = status;
    if (startTimeField) startTimeField.readOnly = status;
    if (endTimeField) endTimeField.readOnly = status;
    if (invitedField) invitedField.disabled = status;
    if (acceptedField) acceptedField.disabled = status;
    
    // Show/hide buttons based on edit mode
    if (saveBtn) saveBtn.style.display = status ? 'none' : 'inline-block';
    if (editBtn) editBtn.style.display = status ? 'inline-block' : 'none';
};

// Get form data as an object
export const getFormData = (formId) => {
    const form = document.querySelector(formId);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    return data;
};

// Extract date and timestamps
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
    return part === 'date' ? date : time;
};

// Populate view form with meeting data
const populateForm = (formId, meetingId) => {
    const form = document.querySelector(formId);
    const data = getMeetingById(meetingId);
    if (!data) return;

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

// Open a form
export const openForm = (formId, newForm, meetingId = '') => {
    const form = document.querySelector(formId);
    if (!form) return;
    
    // Hide ALL forms first, then show the one we want
    const overlay = document.querySelector('#modal-overlay');
    if (overlay) {
        const allForms = overlay.querySelectorAll('form');
        allForms.forEach(f => {
            f.hidden = true;
        });
    }
    
    // Now show only the form we want
    form.hidden = false;
    
    // Store meeting ID in form data attribute for later retrieval
    if (meetingId) {
        form.dataset.currentMeetingId = meetingId;
    }

    if (!newForm) {
        populateForm(formId, meetingId);
        // Set form to read-only mode initially
        toggleReadOnly(formId, true);
    } else {
        const topicInput = form.querySelector('.meeting-topic');
        if (topicInput) {
            topicInput.focus();
        }
    }
    
    // Show modal when a form is opened
    updateModalVisibility();
};

// Get meetings with conflict information
export const getMeetingsWithConflicts = () => {
    const meetings = getAllMeetings();
    const overlaps = scanMeetingsForOverlaps(meetings);
    const clusters = buildConflictClusters(overlaps);
    const conflictMap = createConflictMap(clusters);
    
    // Debug: log clusters to console
    if (clusters.length > 0) {
        console.log('Conflict clusters:', clusters);
        console.log('Cluster map:', Array.from(conflictMap.entries()));
    }
    
    return {
        meetings,
        conflictMap,
        clusters
    };
};

// Render all meetings with conflict highlighting
export const renderAllMeetings = () => {
    const options = loadUIOptions();
    const { meetings, conflictMap } = getMeetingsWithConflicts();
    
    // Filter meetings - only filter if showConflictsOnly is explicitly true
    let filteredMeetings = meetings;
    // Ensure filters object exists
    const filters = options.filters || {};
    const showConflictsOnly = filters.showConflictsOnly;
    
    if (showConflictsOnly === true) {
        filteredMeetings = meetings.filter(m => conflictMap.has(m.id));
    }
    // If showConflictsOnly is false, null, undefined, or not set, show all meetings
    
    // Sort meetings
    let sortedMeetings = [...filteredMeetings];
    if (options.sortMode === 'time') {
        sortedMeetings = sortMeetingsByStartTime(sortedMeetings);
    } else if (options.sortMode === 'topic') {
        sortedMeetings.sort((a, b) => (a.topic || '').localeCompare(b.topic || ''));
    }
    
    // Clear and render
    const article = document.querySelector('article');
    if (!article) return;
    
    article.innerHTML = '';
    
    if (options.viewMode === 'range') {
        renderRangeView(sortedMeetings, conflictMap);
    } else {
        renderListView(sortedMeetings, conflictMap);
    }
};

// Render meetings in list view grouped by day
const renderListView = (meetings, conflictMap) => {
    const article = document.querySelector('article');
    
    // Handle empty meetings
    if (!meetings || meetings.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'No meetings to display';
        emptyMsg.style.padding = '20px';
        emptyMsg.style.textAlign = 'center';
        article.appendChild(emptyMsg);
        return;
    }
    
    // Group meetings by day
    const meetingsByDay = {};
    meetings.forEach(meeting => {
        if (!meeting.date) return; // Skip if date is missing
        
        // Handle both timestamp (number) and date string formats
        let meetingDate;
        if (typeof meeting.date === 'number') {
            meetingDate = new Date(meeting.date);
        } else if (typeof meeting.date === 'string') {
            // Try parsing as timestamp first, then as date string
            const timestamp = parseInt(meeting.date);
            if (!isNaN(timestamp) && timestamp > 0) {
                meetingDate = new Date(timestamp);
            } else {
                meetingDate = new Date(meeting.date);
            }
        } else {
            return; // Skip if date format is unknown
        }
        
        // Validate date
        if (isNaN(meetingDate.getTime())) {
            console.warn('Invalid date for meeting:', meeting.id, meeting.date);
            return; // Skip invalid dates
        }
        
        // Use ISO date string as day identifier for flexibility
        const dayId = meetingDate.toISOString().split('T')[0];
        
        if (!meetingsByDay[dayId]) {
            meetingsByDay[dayId] = [];
        }
        meetingsByDay[dayId].push(meeting);
    });
    
    // Render each day
    Object.keys(meetingsByDay).sort().forEach(dayId => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.dataset.id = dayId;
        
        const dayTitle = document.createElement('strong');
        const dayDate = new Date(dayId + 'T00:00:00'); // Add time to avoid timezone issues
        // Validate date before formatting
        if (!isNaN(dayDate.getTime())) {
            const formattedDate = dayDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            dayTitle.textContent = formattedDate;
        } else {
            dayTitle.textContent = dayId; // Fallback to ISO string if date is invalid
        }
        dayDiv.appendChild(dayTitle);
        
        meetingsByDay[dayId].forEach(meeting => {
            const meetingDiv = document.createElement('div');
            meetingDiv.classList.add('meeting');
            meetingDiv.dataset.id = meeting.id;
            
            // Create meeting content with topic and time
            const topicSpan = document.createElement('span');
            topicSpan.classList.add('meeting-topic');
            topicSpan.textContent = meeting.topic;
            
            const timeSpan = document.createElement('span');
            timeSpan.classList.add('meeting-time');
            const startTime = convertFromTimestamp(meeting.startTime);
            const endTime = convertFromTimestamp(meeting.endTime);
            timeSpan.textContent = `${startTime} - ${endTime}`;
            
            meetingDiv.appendChild(topicSpan);
            meetingDiv.appendChild(timeSpan);
            
            // Highlight if in conflict with cluster-specific styling
            if (conflictMap.has(meeting.id)) {
                const clusterIndex = conflictMap.get(meeting.id);
                meetingDiv.classList.add('conflict');
                meetingDiv.classList.add(`conflict-cluster-${clusterIndex}`);
                meetingDiv.dataset.clusterIndex = clusterIndex;
                meetingDiv.title = `This meeting has scheduling conflicts (Cluster ${clusterIndex + 1})`;
            }
            
            // Add click handler to view meeting
            meetingDiv.addEventListener('click', () => {
                openForm('#view-meeting-form', false, meeting.id);
            });
            
            dayDiv.appendChild(meetingDiv);
        });
        
        article.appendChild(dayDiv);
    });
};

// Render meetings in range view on a vertical axis
const renderRangeView = (meetings, conflictMap) => {
    const article = document.querySelector('article');
    
    // Create range view container
    const rangeContainer = document.createElement('div');
    rangeContainer.classList.add('range-view');
    
    if (meetings.length === 0) {
        rangeContainer.innerHTML = '<p>No meetings to display</p>';
        article.appendChild(rangeContainer);
        return;
    }
    
    // Find min startTime and max endTime across all meetings
    let minStartTime = Infinity;
    let maxEndTime = -Infinity;
    
    meetings.forEach(meeting => {
        if (meeting.startTime && meeting.startTime < minStartTime) minStartTime = meeting.startTime;
        if (meeting.endTime && meeting.endTime > maxEndTime) maxEndTime = meeting.endTime;
    });
    
    if (minStartTime === Infinity || maxEndTime === -Infinity) {
        rangeContainer.innerHTML = '<p>No meetings to display</p>';
        article.appendChild(rangeContainer);
        return;
    }
    
    // Round down minStartTime to the nearest 15 minutes and round up maxEndTime
    const minDate = new Date(minStartTime);
    minDate.setMinutes(Math.floor(minDate.getMinutes() / 15) * 15, 0, 0);
    const roundedMinTime = minDate.getTime();
    
    const maxDate = new Date(maxEndTime);
    maxDate.setMinutes(Math.ceil(maxDate.getMinutes() / 15) * 15, 0, 0);
    const roundedMaxTime = maxDate.getTime();
    
    const timeRange = roundedMaxTime - roundedMinTime;
    
    // Calculate height for the container (1 pixel per minute)
    const minutesRange = timeRange / (60 * 1000);
    const containerHeight = Math.max(minutesRange, 600); // At least 600px (10 hours)
    
    // Create axis container with horizontal layout
    const axisDiv = document.createElement('div');
    axisDiv.classList.add('range-axis');
    
    // Create time labels (vertical on the left)
    const timeLabels = document.createElement('div');
    timeLabels.classList.add('time-labels');
    
    // Create grid lines container
    const gridLines = document.createElement('div');
    gridLines.classList.add('grid-lines');
    
    // Add labels every 30 minutes
    const labelInterval = 30 * 60 * 1000; // 30 minutes in milliseconds
    let currentTime = roundedMinTime;
    let previousDateStr = null;
    
    while (currentTime <= roundedMaxTime) {
        const timePercent = ((currentTime - roundedMinTime) / timeRange) * 100;
        const date = new Date(currentTime);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format for comparison
        const currentDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Create grid line
        const gridLine = document.createElement('div');
        gridLine.classList.add('grid-line');
        gridLine.style.top = `${timePercent}%`;
        gridLines.appendChild(gridLine);
        
        // Create time label with date if date changed
        const labelDiv = document.createElement('div');
        labelDiv.classList.add('time-label');
        labelDiv.style.top = `${timePercent}%`;
        
        const timeStr = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        
        // Add date if it's a new day or first label
        if (previousDateStr !== dateStr || currentTime === roundedMinTime) {
            const dateDiv = document.createElement('div');
            dateDiv.classList.add('time-label-date');
            dateDiv.textContent = currentDate;
            
            const timeDiv = document.createElement('div');
            timeDiv.classList.add('time-label-time');
            timeDiv.textContent = timeStr;
            
            labelDiv.appendChild(dateDiv);
            labelDiv.appendChild(timeDiv);
            previousDateStr = dateStr;
        } else {
            const timeDiv = document.createElement('div');
            timeDiv.classList.add('time-label-time');
            timeDiv.textContent = timeStr;
            labelDiv.appendChild(timeDiv);
        }
        
        timeLabels.appendChild(labelDiv);
        currentTime += labelInterval;
    }
    
    axisDiv.appendChild(timeLabels);
    
    // Create meeting bars container
    const meetingsContainer = document.createElement('div');
    meetingsContainer.classList.add('meetings-container');
    meetingsContainer.style.height = `${containerHeight}px`;
    
    // Set time labels container height to match meetings container
    timeLabels.style.height = `${containerHeight}px`;
    
    // Add grid lines to meetings container
    gridLines.style.height = `${containerHeight}px`;
    meetingsContainer.appendChild(gridLines);
    
    // Group meetings by time to avoid overlap
    const meetingLanes = [];
    
    // Sort meetings by start time
    const sortedMeetings = [...meetings].sort((a, b) => a.startTime - b.startTime);
    
    sortedMeetings.forEach(meeting => {
        // Find a lane where this meeting doesn't overlap
        let laneIndex = -1;
        for (let i = 0; i < meetingLanes.length; i++) {
            const lane = meetingLanes[i];
            const hasOverlap = lane.some(existing => {
                return !(meeting.endTime <= existing.startTime || meeting.startTime >= existing.endTime);
            });
            if (!hasOverlap) {
                laneIndex = i;
                break;
            }
        }
        
        // If no lane found, create a new one
        if (laneIndex === -1) {
            laneIndex = meetingLanes.length;
            meetingLanes.push([]);
        }
        
        meetingLanes[laneIndex].push(meeting);
        
        // Create meeting bar
        const meetingBar = document.createElement('div');
        meetingBar.classList.add('meeting-bar');
        
        if (conflictMap.has(meeting.id)) {
            const clusterIndex = conflictMap.get(meeting.id);
            meetingBar.classList.add('conflict');
            meetingBar.classList.add(`conflict-cluster-${clusterIndex}`);
            meetingBar.dataset.clusterIndex = clusterIndex;
        }
        
        // Calculate vertical position and height
        const topPercent = ((meeting.startTime - roundedMinTime) / timeRange) * 100;
        const heightPercent = ((meeting.endTime - meeting.startTime) / timeRange) * 100;
        
        // Calculate horizontal position (left offset for lane)
        const leftOffset = 80 + (laneIndex * 200); // 80px for time labels, 200px per lane
        
        meetingBar.style.top = `${topPercent}%`;
        meetingBar.style.height = `${heightPercent}%`;
        meetingBar.style.left = `${leftOffset}px`;
        meetingBar.style.width = '180px';
        meetingBar.textContent = meeting.topic;
        meetingBar.title = `${meeting.topic} (${new Date(meeting.startTime).toLocaleTimeString()} - ${new Date(meeting.endTime).toLocaleTimeString()})`;
        
        meetingBar.addEventListener('click', () => {
            openForm('#view-meeting-form', false, meeting.id);
        });
        
        meetingsContainer.appendChild(meetingBar);
    });
    
    axisDiv.appendChild(meetingsContainer);
    rangeContainer.appendChild(axisDiv);
    article.appendChild(rangeContainer);
};

// Render a single meeting to the page (for backward compatibility)
export const renderMeeting = (meeting) => {
    renderAllMeetings();
};

// Save form data

export const saveFormData = (formId, newForm, meetingId) => {
    const formData = getFormData(formId);
    const [date, startTime, endTime] = extractDateTime(formData);
    const data = { ...formData, date, startTime, endTime };

    if (newForm) {
        const newMeeting = createMeeting(data); // must return an id
        renderAllMeetings(); // render all meetings including the new one
    } else {
        updateMeeting(meetingId, data);
        renderAllMeetings(); // re-render to update conflicts
    }

    closeForm(formId, newForm);
    return data;
};

// Close form
export const closeForm = (formId, newForm) => {
    const form = document.querySelector(formId);
    if (!form) return;
    
    form.reset();
    if (!newForm) toggleReadOnly(formId, true);
    form.hidden = true;
    
    // Hide modal if no forms are visible
    updateModalVisibility();
};

// Edit form
export const editFormData = (formId) => {
    toggleReadOnly(formId, false);
    document.querySelector('#view-meeting-topic').focus();
};

// Delete meeting
export const deleteFormData = (formId, meetingId) => {
    deleteMeeting(meetingId);
    renderAllMeetings(); // re-render to update conflicts
    closeForm(formId, false);
};
