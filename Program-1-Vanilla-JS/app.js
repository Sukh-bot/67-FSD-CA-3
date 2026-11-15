/**
 * Paws & Claws Pet Care Appointment Portal
 * Subject: Full Stack Development (FSD) Continuous Assessment (CA-3)
 * Student: sukhada bhave | Roll No: 67 | B.E. AI & DS (Sem V)
 * Course Outcomes: CO1 (HTML/CSS/DOM) & CO2 (Async JS & Fetch API)
 */

// In-memory application state
let appointments = [];
const STORAGE_KEY = 'PAWS_CLAWS_APPOINTMENTS_V1';

// Default mock data for immediate fallback or initial load
const DEFAULT_FALLBACK_DATA = [
  {
    id: "APT-1001",
    petName: "Milo",
    species: "Dog",
    breed: "Golden Retriever",
    ownerName: "Rohan Sharma",
    ownerPhone: "9876543210",
    ownerEmail: "rohan.sharma@example.com",
    appointmentDate: "2026-11-20T10:30",
    service: "Vaccination",
    status: "Confirmed",
    notes: "Annual rabies booster and deworming.",
    createdAt: "2026-11-15T09:00:00Z"
  },
  {
    id: "APT-1002",
    petName: "Luna",
    species: "Cat",
    breed: "Persian",
    ownerName: "Pooja Kulkarni",
    ownerPhone: "9823456789",
    ownerEmail: "pooja.k@example.com",
    appointmentDate: "2026-11-21T14:00",
    service: "Grooming & Spa",
    status: "Scheduled",
    notes: "Full coat trim and claw clipping.",
    createdAt: "2026-11-15T09:30:00Z"
  },
  {
    id: "APT-1003",
    petName: "Charlie",
    species: "Dog",
    breed: "Beagle",
    ownerName: "Amit Deshmukh",
    ownerPhone: "9811223344",
    ownerEmail: "amit.d@example.com",
    appointmentDate: "2026-11-18T11:15",
    service: "General Checkup",
    status: "In Progress",
    notes: "Slight limp on front left paw after running.",
    createdAt: "2026-11-15T10:00:00Z"
  },
  {
    id: "APT-1004",
    petName: "Kiwi",
    species: "Bird",
    breed: "Cockatiel",
    ownerName: "Sneha Patil",
    ownerPhone: "9765432100",
    ownerEmail: "sneha.patil@example.com",
    appointmentDate: "2026-11-19T16:45",
    service: "General Checkup",
    status: "Completed",
    notes: "Routine beak and feather health examination.",
    createdAt: "2026-11-14T11:20:00Z"
  },
  {
    id: "APT-1005",
    petName: "Coco",
    species: "Rabbit",
    breed: "Holland Lop",
    ownerName: "Vikas Joshi",
    ownerPhone: "9988776655",
    ownerEmail: "vikas.j@example.com",
    appointmentDate: "2026-11-22T09:30",
    service: "Dental Cleaning",
    status: "Scheduled",
    notes: "Incisor overgrown, needs veterinary trimming.",
    createdAt: "2026-11-15T10:45:00Z"
  }
];

// DOM Element References
const form = document.getElementById('appointmentForm');
const container = document.getElementById('appointmentsContainer');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const filterService = document.getElementById('filterService');
const sortBy = document.getElementById('sortBy');
const recordCount = document.getElementById('recordCount');
const btnReloadMock = document.getElementById('btnReloadMock');
const networkLogConsole = document.getElementById('networkLogConsole');
const toastContainer = document.getElementById('toastContainer');

// KPI Counter Elements
const statTotal = document.getElementById('statTotal');
const statScheduled = document.getElementById('statScheduled');
const statConfirmed = document.getElementById('statConfirmed');
const statCompleted = document.getElementById('statCompleted');

// Edit Modal Elements
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editAptId = document.getElementById('editAptId');
const editPetName = document.getElementById('editPetName');
const editStatus = document.getElementById('editStatus');
const editDate = document.getElementById('editDate');
const editNotes = document.getElementById('editNotes');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupMinDateTime();
  attachEventListeners();
  loadInitialData();
});

/**
 * Sets the minimum selectable datetime to current time
 */
function setupMinDateTime() {
  const dateInput = document.getElementById('appointmentDate');
  const now = new Date();
  // Format YYYY-MM-DDTHH:MM
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  dateInput.min = `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Log HTTP activity to the live console component
 */
function logNetworkActivity(method, url, status, summary, payload = null) {
  const timeStr = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = 'log-entry';

  const methodClass = `log-${method.toLowerCase()}`;
  let payloadSummary = '';
  if (payload) {
    payloadSummary = ` | Body: ${JSON.stringify(payload).slice(0, 50)}...`;
  }

  entry.innerHTML = `
    <span class="log-time">[${timeStr}]</span>
    <span class="log-method ${methodClass}">${method}</span>
    <span class="log-url">${url}</span>
    <span class="log-status">${status}</span>
    <span class="log-summary">${summary}${payloadSummary}</span>
  `;

  networkLogConsole.prepend(entry);
}

/**
 * Display toast notification
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Retrieve data using Fetch API with async/await (Demonstrating CO2)
 */
async function loadInitialData(forceReload = false) {
  const localData = localStorage.getItem(STORAGE_KEY);

  if (localData && !forceReload) {
    try {
      appointments = JSON.parse(localData);
      logNetworkActivity('GET', 'localStorage://appointments', '200 OK', `Retrieved ${appointments.length} records from local cache`);
      renderAppointments();
      updateKPIs();
      return;
    } catch (e) {
      console.warn('Error reading from localStorage, re-fetching sample data', e);
    }
  }

  try {
    container.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Executing HTTP GET via Fetch API (async/await)...</p>
      </div>
    `;

    logNetworkActivity('GET', './appointments.json', '200 Pending', 'Initiating Fetch API request to appointments.json');

    // Fetch API call with async/await
    const response = await fetch('./appointments.json');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();
    appointments = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));

    logNetworkActivity('GET', './appointments.json', `${response.status} OK`, `Successfully fetched ${data.length} appointment records`);
    showToast(`Loaded ${data.length} appointments via Fetch API!`, 'success');
  } catch (error) {
    console.warn('Fetch API encountered an error (e.g. file:// protocol restriction). Falling back to mock dataset:', error);
    // Graceful fallback
    appointments = [...DEFAULT_FALLBACK_DATA];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));

    logNetworkActivity('GET', './appointments.json (Fallback)', '200 Mock OK', `CORS/File restriction handled: loaded ${appointments.length} sample records`);
    showToast('Loaded sample records (Fetch fallback for local runtime)', 'info');
  } finally {
    renderAppointments();
    updateKPIs();
  }
}

/**
 * Form Input Validation & Submission (Demonstrating CO1)
 */
function validateField(inputElement, errorElement, validationFn, errorMessage) {
  const isValid = validationFn(inputElement.value);
  if (!isValid) {
    inputElement.classList.add('input-invalid');
    errorElement.textContent = errorMessage;
    return false;
  } else {
    inputElement.classList.remove('input-invalid');
    errorElement.textContent = '';
    return true;
  }
}

function attachEventListeners() {
  // Live input validation listeners
  const petName = document.getElementById('petName');
  const petNameError = document.getElementById('petNameError');
  petName.addEventListener('input', () => {
    validateField(petName, petNameError, val => val.trim().length >= 2, 'Pet name must be at least 2 characters.');
  });

  const species = document.getElementById('species');
  const speciesError = document.getElementById('speciesError');
  species.addEventListener('change', () => {
    validateField(species, speciesError, val => val !== '', 'Please select a species.');
  });

  const ownerName = document.getElementById('ownerName');
  const ownerNameError = document.getElementById('ownerNameError');
  ownerName.addEventListener('input', () => {
    validateField(ownerName, ownerNameError, val => val.trim().length >= 2, 'Owner name must be at least 2 characters.');
  });

  const ownerPhone = document.getElementById('ownerPhone');
  const ownerPhoneError = document.getElementById('ownerPhoneError');
  ownerPhone.addEventListener('input', () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    validateField(ownerPhone, ownerPhoneError, val => phoneRegex.test(val.trim()), 'Enter a valid 10-digit mobile number.');
  });

  const ownerEmail = document.getElementById('ownerEmail');
  const ownerEmailError = document.getElementById('ownerEmailError');
  ownerEmail.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(ownerEmail, ownerEmailError, val => emailRegex.test(val.trim()), 'Please enter a valid email address.');
  });

  const appointmentDate = document.getElementById('appointmentDate');
  const appointmentDateError = document.getElementById('appointmentDateError');
  appointmentDate.addEventListener('change', () => {
    validateField(appointmentDate, appointmentDateError, val => {
      if (!val) return false;
      const selected = new Date(val);
      return selected > new Date();
    }, 'Appointment must be scheduled in the future.');
  });

  const service = document.getElementById('service');
  const serviceError = document.getElementById('serviceError');
  service.addEventListener('change', () => {
    validateField(service, serviceError, val => val !== '', 'Please choose a veterinary service.');
  });

  // Handle Form Submit (Simulates HTTP POST)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isPetValid = validateField(petName, petNameError, val => val.trim().length >= 2, 'Pet name must be at least 2 characters.');
    const isSpeciesValid = validateField(species, speciesError, val => val !== '', 'Please select a species.');
    const isOwnerValid = validateField(ownerName, ownerNameError, val => val.trim().length >= 2, 'Owner name must be at least 2 characters.');
    const isPhoneValid = validateField(ownerPhone, ownerPhoneError, val => /^[6-9]\d{9}$/.test(val.trim()), 'Enter a valid 10-digit mobile number.');
    const isEmailValid = validateField(ownerEmail, ownerEmailError, val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()), 'Please enter a valid email address.');
    const isDateValid = validateField(appointmentDate, appointmentDateError, val => val && new Date(val) > new Date(), 'Appointment must be in the future.');
    const isServiceValid = validateField(service, serviceError, val => val !== '', 'Please choose a veterinary service.');

    if (!isPetValid || !isSpeciesValid || !isOwnerValid || !isPhoneValid || !isEmailValid || !isDateValid || !isServiceValid) {
      showToast('Please fix the validation errors before submitting.', 'error');
      return;
    }

    // Build JSON Request Payload
    const newAppointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      petName: petName.value.trim(),
      species: species.value,
      breed: document.getElementById('breed').value.trim() || 'Mixed / Unknown',
      ownerName: ownerName.value.trim(),
      ownerPhone: ownerPhone.value.trim(),
      ownerEmail: ownerEmail.value.trim(),
      appointmentDate: appointmentDate.value,
      service: service.value,
      status: "Scheduled",
      notes: document.getElementById('notes').value.trim() || 'No specific notes recorded.',
      createdAt: new Date().toISOString()
    };

    // Simulate HTTP POST Request with Fetch API semantics
    logNetworkActivity('POST', '/api/appointments', '201 Created', `Booking appointment for ${newAppointment.petName} (${newAppointment.service})`, newAppointment);

    appointments.unshift(newAppointment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));

    showToast(`Appointment booked successfully for ${newAppointment.petName}! (ID: ${newAppointment.id})`, 'success');
    form.reset();
    setupMinDateTime();
    renderAppointments();
    updateKPIs();
  });

  // Filter & Search Controls
  searchInput.addEventListener('input', renderAppointments);
  filterStatus.addEventListener('change', renderAppointments);
  filterService.addEventListener('change', renderAppointments);
  sortBy.addEventListener('change', renderAppointments);

  // Reload Mock button
  btnReloadMock.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    loadInitialData(true);
  });

  // Edit Modal Event Listeners
  closeModalBtn.addEventListener('click', () => editModal.classList.add('hidden'));
  cancelModalBtn.addEventListener('click', () => editModal.classList.add('hidden'));

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = editAptId.value;
    const targetApt = appointments.find(a => a.id === id);

    if (targetApt) {
      targetApt.status = editStatus.value;
      targetApt.appointmentDate = editDate.value;
      targetApt.notes = editNotes.value.trim();

      // Simulate HTTP PUT Request
      logNetworkActivity('PUT', `/api/appointments/${id}`, '200 OK', `Updated status to "${targetApt.status}"`, targetApt);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      showToast(`Appointment ${id} updated successfully!`, 'success');
      editModal.classList.add('hidden');
      renderAppointments();
      updateKPIs();
    }
  });
}

/**
 * Render the appointment cards dynamically using DOM manipulation
 */
function renderAppointments() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedStatus = filterStatus.value;
  const selectedService = filterService.value;
  const currentSort = sortBy.value;

  // Filter records
  let filtered = appointments.filter(apt => {
    const matchesSearch =
      apt.petName.toLowerCase().includes(query) ||
      apt.ownerName.toLowerCase().includes(query) ||
      apt.breed.toLowerCase().includes(query) ||
      apt.id.toLowerCase().includes(query);

    const matchesStatus = (selectedStatus === 'ALL') || (apt.status === selectedStatus);
    const matchesService = (selectedService === 'ALL') || (apt.service === selectedService);

    return matchesSearch && matchesStatus && matchesService;
  });

  // Sort records
  filtered.sort((a, b) => {
    if (currentSort === 'date-asc') {
      return new Date(a.appointmentDate) - new Date(b.appointmentDate);
    } else if (currentSort === 'date-desc') {
      return new Date(b.appointmentDate) - new Date(a.appointmentDate);
    } else if (currentSort === 'name-asc') {
      return a.petName.localeCompare(b.petName);
    } else if (currentSort === 'name-desc') {
      return b.petName.localeCompare(a.petName);
    } else if (currentSort === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  recordCount.textContent = `${filtered.length} of ${appointments.length} Records`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🐾</div>
        <h3>No Appointments Found</h3>
        <p>No records matched your search or filter criteria. Try resetting filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  // Construct DOM elements dynamically
  filtered.forEach(apt => {
    const card = document.createElement('article');
    card.className = 'appointment-card';

    const speciesEmoji = getSpeciesEmoji(apt.species);
    const statusClass = `status-${apt.status.toLowerCase().replace(/\s+/g, '-')}`;
    const formattedDate = formatDateTime(apt.appointmentDate);

    card.innerHTML = `
      <div class="card-top">
        <div class="pet-title">
          <div class="pet-avatar">${speciesEmoji}</div>
          <div class="pet-name-block">
            <h3>${escapeHtml(apt.petName)} <small style="font-weight: normal; color: #64748b; font-size: 0.8rem;">(${apt.id})</small></h3>
            <span class="pet-meta">${escapeHtml(apt.species)} • ${escapeHtml(apt.breed)}</span>
          </div>
        </div>
        <span class="status-pill ${statusClass}">${apt.status}</span>
      </div>

      <div class="card-details-grid">
        <div class="detail-line">
          <span class="detail-label">👤 Owner:</span>
          <span>${escapeHtml(apt.ownerName)}</span>
        </div>
        <div class="detail-line">
          <span class="detail-label">📞 Phone:</span>
          <span>${escapeHtml(apt.ownerPhone)}</span>
        </div>
        <div class="detail-line">
          <span class="detail-label">🩺 Service:</span>
          <span><strong>${escapeHtml(apt.service)}</strong></span>
        </div>
        <div class="detail-line">
          <span class="detail-label">⏰ Slot:</span>
          <span>${formattedDate}</span>
        </div>
      </div>

      ${apt.notes ? `<div class="card-notes"><strong>Notes:</strong> ${escapeHtml(apt.notes)}</div>` : ''}

      <div class="card-actions">
        <div class="status-quick-change">
          <label style="font-size: 0.75rem; color: #64748b; margin-right: 4px;">Quick Status:</label>
          <select class="action-status-select" data-id="${apt.id}">
            <option value="Scheduled" ${apt.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
            <option value="Confirmed" ${apt.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="In Progress" ${apt.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${apt.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${apt.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
        <div class="action-buttons">
          <button class="btn btn-secondary btn-sm btn-edit" data-id="${apt.id}">✏️ Edit</button>
          <button class="btn btn-danger btn-sm btn-delete" data-id="${apt.id}">🗑️ Delete</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach card event listeners
  container.querySelectorAll('.action-status-select').forEach(select => {
    select.addEventListener('change', handleQuickStatusChange);
  });

  container.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', handleOpenEditModal);
  });

  container.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', handleDeleteAppointment);
  });
}

/**
 * Handle quick status dropdown change (Simulates HTTP PATCH)
 */
function handleQuickStatusChange(e) {
  const aptId = e.target.getAttribute('data-id');
  const newStatus = e.target.value;
  const target = appointments.find(a => a.id === aptId);

  if (target) {
    const oldStatus = target.status;
    target.status = newStatus;

    logNetworkActivity('PATCH', `/api/appointments/${aptId}/status`, '200 OK', `Status changed: "${oldStatus}" ➔ "${newStatus}"`, { status: newStatus });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    showToast(`Status of ${target.petName} changed to ${newStatus}`, 'info');
    renderAppointments();
    updateKPIs();
  }
}

/**
 * Open edit modal for an appointment
 */
function handleOpenEditModal(e) {
  const aptId = e.target.getAttribute('data-id');
  const target = appointments.find(a => a.id === aptId);

  if (target) {
    editAptId.value = target.id;
    editPetName.value = `${target.petName} (${target.species})`;
    editStatus.value = target.status;
    editDate.value = target.appointmentDate;
    editNotes.value = target.notes || '';
    editModal.classList.remove('hidden');
  }
}

/**
 * Delete an appointment (Simulates HTTP DELETE)
 */
function handleDeleteAppointment(e) {
  const aptId = e.target.getAttribute('data-id');
  const target = appointments.find(a => a.id === aptId);

  if (!target) return;

  if (confirm(`Are you sure you want to cancel and delete the appointment for "${target.petName}" (${target.id})?`)) {
    // Simulate HTTP DELETE
    logNetworkActivity('DELETE', `/api/appointments/${aptId}`, '204 No Content', `Deleted appointment record ${aptId} (${target.petName})`);

    appointments = appointments.filter(a => a.id !== aptId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    showToast(`Appointment for ${target.petName} deleted successfully.`, 'error');
    renderAppointments();
    updateKPIs();
  }
}

/**
 * Update KPI counters
 */
function updateKPIs() {
  statTotal.textContent = appointments.length;
  statScheduled.textContent = appointments.filter(a => a.status === 'Scheduled').length;
  statConfirmed.textContent = appointments.filter(a => a.status === 'Confirmed').length;
  statCompleted.textContent = appointments.filter(a => a.status === 'Completed').length;
}

/**
 * Helpers
 */
function getSpeciesEmoji(species) {
  switch (species) {
    case 'Dog': return '🐶';
    case 'Cat': return '🐱';
    case 'Bird': return '🦜';
    case 'Rabbit': return '🐰';
    case 'Reptile': return '🦎';
    default: return '🐾';
  }
}

function formatDateTime(isoString) {
  if (!isoString) return 'N/A';
  const d = new Date(isoString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
