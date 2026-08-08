/* Admin login, dashboard and management utilities */
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginMessage = document.getElementById('adminLoginMessage');
const adminDashboard = document.getElementById('adminDashboard');
const busTableBody = document.getElementById('busTableBody');
const busForm = document.getElementById('busForm');
const busModal = document.getElementById('busModal');
const busIdInput = document.getElementById('busId');
const busNameInput = document.getElementById('busName');
const busNumberInput = document.getElementById('busNumber');
const busCategorySelect = document.getElementById('busCategory');
const busSourceInput = document.getElementById('busSource');
const busDestinationInput = document.getElementById('busDestination');
const busDepartureTimeInput = document.getElementById('busDepartureTime');
const busArrivalTimeInput = document.getElementById('busArrivalTime');
const busDateInput = document.getElementById('busDate');
const busPriceInput = document.getElementById('busPrice');
const busSeatsInput = document.getElementById('busSeats');
const busDescriptionInput = document.getElementById('busDescription');
const adminBusMessage = document.getElementById('adminBusMessage');
const categoryTableBody = document.getElementById('categoryTableBody');
const categoryForm = document.getElementById('categoryForm');
const categoryIdInput = document.getElementById('categoryId');
const categoryNameInput = document.getElementById('categoryName');
const categoryMessage = document.getElementById('categoryMessage');
const userTableBody = document.getElementById('userTableBody');
const bookingAdminTable = document.getElementById('bookingAdminTable');
const filterBookingBtn = document.getElementById('filterBookingBtn');
const filterDate = document.getElementById('filterDate');
const filterStatus = document.getElementById('filterStatus');
const filterPayment = document.getElementById('filterPayment');

function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();
  if (username === 'admin' && password === 'admin123') {
    setAdminSession(true);
    showAlert(adminLoginMessage, 'Admin login successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'admin-dashboard.html', 1200);
  } else {
    showAlert(adminLoginMessage, 'Invalid admin credentials.', 'danger');
  }
}

function renderAdminDashboard() {
  requireAdmin();
  const buses = getData(STORAGE_KEYS.buses);
  const users = getData(STORAGE_KEYS.users);
  const bookings = getData(STORAGE_KEYS.bookings);
  document.getElementById('adminTotalBuses').textContent = buses.length;
  document.getElementById('adminTotalUsers').textContent = users.length;
  document.getElementById('adminTotalBookings').textContent = bookings.length;
  document.getElementById('adminCancelledBookings').textContent = bookings.filter(b => b.status === 'Cancelled').length;
  const bookingDates = bookings.map(b => formatDate(b.date));
  const bookingCounts = {};
  bookingDates.forEach(date => bookingCounts[date] = (bookingCounts[date] || 0) + 1);
  const chartLabels = Object.keys(bookingCounts);
  const chartData = Object.values(bookingCounts);
  const bookingsChart = document.getElementById('bookingsChart');
  const revenueChart = document.getElementById('revenueChart');
  const categoryChart = document.getElementById('categoryChart');
  if (bookingsChart) new Chart(bookingsChart, { type: 'bar', data: { labels: chartLabels, datasets: [{ label: 'Bookings', data: chartData, backgroundColor: '#0d6efd' }] }, options: { responsive: true, plugins: { legend: { display: false } } } });
  if (revenueChart) new Chart(revenueChart, { type: 'line', data: { labels: chartLabels, datasets: [{ label: 'Revenue', data: chartLabels.map((_, idx) => bookings.filter((b, index) => index <= idx && b.paymentStatus === 'Paid').reduce((sum, b2) => sum + b2.totalAmount, 0)), borderColor: '#198754', backgroundColor: 'rgba(25,135,84,0.15)' }] }, options: { responsive: true, plugins: { legend: { display: false } } } });
  const categoryLabels = [...new Set(buses.map(bus => bus.category))];
  const categoryCounts = categoryLabels.map(cat => buses.filter(bus => bus.category === cat).length);
  if (categoryChart) new Chart(categoryChart, { type: 'doughnut', data: { labels: categoryLabels, datasets: [{ data: categoryCounts, backgroundColor: ['#0d6efd', '#6610f2', '#198754', '#fd7e14', '#6f42c1'] }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } } } });
}

function renderBusCategoryOptions() {
  if (!busCategorySelect) return;
  const categories = getData(STORAGE_KEYS.categories);
  busCategorySelect.innerHTML = categories.map(category => `<option value="${category.name}">${category.name}</option>`).join('');
}

function renderBusTable() {
  if (!busTableBody) return;
  const buses = getData(STORAGE_KEYS.buses);
  busTableBody.innerHTML = buses.map(bus => `
    <tr>
      <td>${bus.name}</td>
      <td>${bus.number}</td>
      <td>${bus.category}</td>
      <td>${bus.source} → ${bus.destination}</td>
      <td>${formatDate(bus.date)}</td>
      <td>${formatCurrency(bus.price)}</td>
      <td>${bus.totalSeats}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editBus('${bus.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBus('${bus.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function resetBusForm() {
  if (!busForm) return;
  busForm.reset();
  busIdInput.value = '';
}

function editBus(id) {
  const buses = getData(STORAGE_KEYS.buses);
  const bus = buses.find(item => item.id === id);
  if (!bus) return;
  busIdInput.value = bus.id;
  busNameInput.value = bus.name;
  busNumberInput.value = bus.number;
  busCategorySelect.value = bus.category;
  busSourceInput.value = bus.source;
  busDestinationInput.value = bus.destination;
  busDepartureTimeInput.value = bus.depTime;
  busArrivalTimeInput.value = bus.arrTime;
  busDateInput.value = bus.date;
  busPriceInput.value = bus.price;
  busSeatsInput.value = bus.totalSeats;
  busDescriptionInput.value = bus.description;
  const modal = bootstrap.Modal.getOrCreateInstance(busModal);
  modal.show();
}

function deleteBus(id) {
  if (!confirm('Delete this bus route permanently?')) return;
  const buses = getData(STORAGE_KEYS.buses).filter(bus => bus.id !== id);
  setData(STORAGE_KEYS.buses, buses);
  showAlert(adminBusMessage, 'Bus deleted successfully.', 'success');
  renderBusTable();
}

function saveBus(event) {
  event.preventDefault();
  const buses = getData(STORAGE_KEYS.buses);
  const busData = {
    id: busIdInput.value || `bus${Date.now()}`,
    name: busNameInput.value.trim(),
    number: busNumberInput.value.trim(),
    category: busCategorySelect.value,
    source: busSourceInput.value.trim(),
    destination: busDestinationInput.value.trim(),
    depLocation: `${busSourceInput.value.trim()} Station`,
    arrLocation: `${busDestinationInput.value.trim()} Station`,
    depTime: busDepartureTimeInput.value.trim(),
    arrTime: busArrivalTimeInput.value.trim(),
    duration: 'N/A',
    date: busDateInput.value,
    price: Number(busPriceInput.value),
    totalSeats: Number(busSeatsInput.value),
    bookedSeats: [],
    description: busDescriptionInput.value.trim()
  };
  if (!busData.name || !busData.number || !busData.category || !busData.source || !busData.destination || !busData.depTime || !busData.arrTime || !busData.date || !busData.price || !busData.totalSeats) {
    showAlert(adminBusMessage, 'Please fill out all required bus fields.', 'danger');
    return;
  }
  const existingIndex = buses.findIndex(bus => bus.id === busData.id);
  if (existingIndex >= 0) {
    busData.bookedSeats = buses[existingIndex].bookedSeats;
    buses[existingIndex] = busData;
    showAlert(adminBusMessage, 'Bus details updated successfully.', 'success');
  } else {
    buses.push(busData);
    showAlert(adminBusMessage, 'New bus added successfully.', 'success');
  }
  setData(STORAGE_KEYS.buses, buses);
  renderBusTable();
  resetBusForm();
  bootstrap.Modal.getOrCreateInstance(busModal).hide();
}

function renderCategoryTable() {
  if (!categoryTableBody) return;
  const categories = getData(STORAGE_KEYS.categories);
  categoryTableBody.innerHTML = categories.map(category => `
    <tr>
      <td>${category.name}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editCategory('${category.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function resetCategoryForm() {
  if (!categoryForm) return;
  categoryForm.reset();
  categoryIdInput.value = '';
}

function editCategory(id) {
  const categories = getData(STORAGE_KEYS.categories);
  const category = categories.find(cat => cat.id === id);
  if (!category) return;
  categoryIdInput.value = category.id;
  categoryNameInput.value = category.name;
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('categoryModal'));
  modal.show();
}

function deleteCategory(id) {
  if (!confirm('Delete this category? Existing buses will remain unchanged.')) return;
  const categories = getData(STORAGE_KEYS.categories).filter(cat => cat.id !== id);
  setData(STORAGE_KEYS.categories, categories);
  showAlert(categoryMessage, 'Category deleted successfully.', 'success');
  renderCategoryTable();
  renderBusCategoryOptions();
}

function saveCategory(event) {
  event.preventDefault();
  const categories = getData(STORAGE_KEYS.categories);
  const name = categoryNameInput.value.trim();
  if (!name) {
    showAlert(categoryMessage, 'Enter a category name.', 'danger');
    return;
  }
  const existingIndex = categories.findIndex(cat => cat.id === categoryIdInput.value);
  if (existingIndex >= 0) {
    categories[existingIndex].name = name;
    showAlert(categoryMessage, 'Category updated successfully.', 'success');
  } else {
    categories.push({ id: `cat${Date.now()}`, name });
    showAlert(categoryMessage, 'Category added successfully.', 'success');
  }
  setData(STORAGE_KEYS.categories, categories);
  renderCategoryTable();
  renderBusCategoryOptions();
  resetCategoryForm();
  bootstrap.Modal.getOrCreateInstance(document.getElementById('categoryModal')).hide();
}

function renderUserTable() {
  if (!userTableBody) return;
  const users = getData(STORAGE_KEYS.users);
  userTableBody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.fullName}</td>
      <td>${user.email}</td>
      <td>${user.mobile}</td>
      <td>${formatDate(user.registrationDate)}</td>
      <td><span class="badge bg-${user.status === 'Active' ? 'success' : 'secondary'}">${user.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="toggleUserStatus('${user.id}')">${user.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function toggleUserStatus(id) {
  const users = getData(STORAGE_KEYS.users);
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) return;
  users[userIndex].status = users[userIndex].status === 'Active' ? 'Inactive' : 'Active';
  setData(STORAGE_KEYS.users, users);
  renderUserTable();
}

function deleteUser(id) {
  if (!confirm('Delete this user account and all related bookings?')) return;
  const users = getData(STORAGE_KEYS.users).filter(user => user.id !== id);
  setData(STORAGE_KEYS.users, users);
  renderUserTable();
}

function renderBookingAdminTable(bookings) {
  if (!bookingAdminTable) return;
  const users = getData(STORAGE_KEYS.users);
  bookingAdminTable.innerHTML = bookings.map(booking => {
    const user = users.find(userItem => userItem.id === booking.userId);
    return `
      <tr>
        <td>${booking.id}</td>
        <td>${user?.fullName || 'Guest'}</td>
        <td>${booking.busName}</td>
        <td>${formatDate(booking.date)}</td>
        <td>${booking.seats.join(', ')}</td>
        <td>${formatCurrency(booking.totalAmount)}</td>
        <td>${booking.paymentStatus}</td>
        <td>${booking.status}</td>
      </tr>
    `;
  }).join('');
}

function applyBookingFilter() {
  if (!bookingAdminTable) return;
  let bookings = getData(STORAGE_KEYS.bookings);
  if (filterDate?.value) bookings = bookings.filter(b => b.date === filterDate.value);
  if (filterStatus?.value) bookings = bookings.filter(b => b.status === filterStatus.value);
  if (filterPayment?.value) bookings = bookings.filter(b => b.paymentStatus === filterPayment.value);
  renderBookingAdminTable(bookings);
}

window.editBus = editBus;
window.deleteBus = deleteBus;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;

window.addEventListener('DOMContentLoaded', () => {
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleAdminLogin);
  }

  const adminPageElements = [adminDashboard, busTableBody, categoryTableBody, userTableBody, bookingAdminTable];
  if (adminPageElements.some(el => el)) {
    requireAdmin();
  }

  if (adminDashboard) {
    renderAdminDashboard();
  }
  if (busCategorySelect) {
    renderBusCategoryOptions();
  }
  if (busTableBody) {
    renderBusTable();
  }
  if (busForm) {
    busForm.addEventListener('submit', saveBus);
    busModal?.addEventListener('show.bs.modal', () => renderBusCategoryOptions());
  }
  if (categoryTableBody) {
    renderCategoryTable();
  }
  if (categoryForm) {
    categoryForm.addEventListener('submit', saveCategory);
  }
  if (userTableBody) {
    renderUserTable();
  }
  if (bookingAdminTable) {
    renderBookingAdminTable(getData(STORAGE_KEYS.bookings));
    filterBookingBtn?.addEventListener('click', applyBookingFilter);
  }
});
