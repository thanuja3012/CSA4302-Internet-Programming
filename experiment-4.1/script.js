const navButtons = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.panel');
const toast = document.getElementById('toast');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const searchForm = document.getElementById('searchForm');
const searchResults = document.getElementById('searchResults');
const pnrForm = document.getElementById('pnrForm');
const pnrStatus = document.getElementById('pnrStatus');
const dashboardName = document.getElementById('dashboardName');
const dashboardStatus = document.getElementById('dashboardStatus');
const bookingHistory = document.getElementById('bookingHistory');
const logoutBtn = document.getElementById('logoutBtn');
const adminTrains = document.getElementById('adminTrains');
const trainForm = document.getElementById('trainForm');

const sampleTrains = [
  { id: 'TRN001', name: 'Express Line', origin: 'City A', destination: 'City B', date: '', class: 'Sleeper', seats: 22, fare: 550 },
  { id: 'TRN002', name: 'Sunrise Special', origin: 'City A', destination: 'City C', date: '', class: 'AC 3 Tier', seats: 14, fare: 880 },
  { id: 'TRN003', name: 'Coastal Express', origin: 'City B', destination: 'City D', date: '', class: 'AC 2 Tier', seats: 8, fare: 1320 },
  { id: 'TRN004', name: 'Night Rider', origin: 'City A', destination: 'City D', date: '', class: 'First Class', seats: 4, fare: 1980 }
];

let bookings = JSON.parse(localStorage.getItem('reservations')) || [];
let users = JSON.parse(localStorage.getItem('railUsers')) || [];
let currentUser = JSON.parse(sessionStorage.getItem('railUser')) || null;
let adminTrainsData = JSON.parse(localStorage.getItem('adminTrains')) || sampleTrains;

function showPanel(section) {
  panels.forEach(panel => panel.classList.remove('active-panel'));
  navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.section === section));
  document.getElementById(section).classList.add('active-panel');
}

navButtons.forEach(button => {
  button.addEventListener('click', () => showPanel(button.dataset.section));
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden');
  }, 2400);
}

function updateDashboard() {
  if (!currentUser) {
    dashboardName.textContent = 'Guest';
    dashboardStatus.textContent = 'Not signed in';
    bookingHistory.innerHTML = '<p>Please login to see your booking history.</p>';
    return;
  }

  dashboardName.textContent = currentUser.name;
  dashboardStatus.textContent = 'Signed in';

  const userBookings = bookings.filter(b => b.email === currentUser.email);
  if (!userBookings.length) {
    bookingHistory.innerHTML = '<p>You have not booked tickets yet. Search trains to start your journey.</p>';
    return;
  }

  bookingHistory.innerHTML = '';
  userBookings.slice().reverse().forEach(booking => {
    const item = document.createElement('div');
    item.className = 'booking-item';
    item.innerHTML = `
      <div>
        <strong>${booking.trainName}</strong>
        <p>${booking.origin} → ${booking.destination} • ${booking.classType}</p>
      </div>
      <div>
        <p><strong>${booking.status}</strong></p>
        <p>PNR: ${booking.pnr}</p>
      </div>
    `;
    bookingHistory.appendChild(item);
  });
}

function renderSearchResults(trains) {
  searchResults.innerHTML = '';
  if (!trains.length) {
    searchResults.innerHTML = '<p class="status-card">No matching trains found for this route and date.</p>';
    return;
  }

  trains.forEach(train => {
    const card = document.createElement('div');
    card.className = 'train-card';
    card.innerHTML = `
      <h3>${train.name} <span>${train.id}</span></h3>
      <p>${train.origin} → ${train.destination}</p>
      <p>Date: <strong>${train.date}</strong> • Class: <strong>${train.class}</strong></p>
      <p>Fare: ₹${train.fare} • Seats available: <strong>${train.seats}</strong></p>
      <button class="secondary-btn book-btn">Book Ticket</button>
    `;
    const button = card.querySelector('.book-btn');
    button.addEventListener('click', () => openBookingForm(train));
    searchResults.appendChild(card);
  });
}

function openBookingForm(train) {
  if (!currentUser) {
    showPanel('search');
    showToast('Please login before booking.');
    return;
  }

  const passengerName = prompt('Enter passenger full name:');
  if (!passengerName) {
    showToast('Booking cancelled.');
    return;
  }
  const passengerAge = prompt('Enter passenger age:');
  const email = currentUser.email;
  const pnr = `PNR${Math.floor(Math.random() * 9000000 + 1000000)}`;
  const ticket = {
    pnr,
    email,
    trainId: train.id,
    trainName: train.name,
    origin: train.origin,
    destination: train.destination,
    date: train.date,
    classType: train.class,
    fare: train.fare,
    passengerName,
    passengerAge,
    status: train.seats > 5 ? 'Confirmed' : train.seats > 0 ? 'RAC' : 'Waiting List',
    bookedAt: new Date().toLocaleString(),
    paymentMode: 'Online'
  };

  bookings.push(ticket);
  localStorage.setItem('reservations', JSON.stringify(bookings));

  const seatUpdate = adminTrainsData.find(t => t.id === train.id);
  if (seatUpdate) {
    seatUpdate.seats = Math.max(0, seatUpdate.seats - 1);
    localStorage.setItem('adminTrains', JSON.stringify(adminTrainsData));
  }

  updateDashboard();
  renderAdminTrains();
  showToast(`Booking confirmed! PNR: ${pnr}`);
}

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    showToast('Invalid credentials.');
    return;
  }
  currentUser = { name: user.name, email: user.email };
  sessionStorage.setItem('railUser', JSON.stringify(currentUser));
  updateDashboard();
  showToast(`Welcome back, ${user.name}!`);
});

registerForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password = document.getElementById('registerPassword').value;
  if (users.some(u => u.email === email)) {
    showToast('Email already registered.');
    return;
  }
  users.push({ name, email, password });
  localStorage.setItem('railUsers', JSON.stringify(users));
  showToast('Registration successful. Please login.');
  registerForm.reset();
});

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const origin = document.getElementById('origin').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const date = document.getElementById('travelDate').value;
  const classType = document.getElementById('classType').value;

  const matchedTrains = adminTrainsData
    .filter(train =>
      train.origin.toLowerCase().includes(origin.toLowerCase()) &&
      train.destination.toLowerCase().includes(destination.toLowerCase()) &&
      train.class === classType
    )
    .map(train => ({ ...train, date }));

  renderSearchResults(matchedTrains);
});

pnrForm.addEventListener('submit', event => {
  event.preventDefault();
  const pnrValue = document.getElementById('pnrNumber').value.trim().toUpperCase();
  const booking = bookings.find(b => b.pnr === pnrValue);
  if (!booking) {
    pnrStatus.innerHTML = '<p>PNR not found. Please verify the number and try again.</p>';
    return;
  }
  pnrStatus.innerHTML = `
    <div class="booking-row">
      <div>
        <h4>${booking.trainName}</h4>
        <p>${booking.origin} → ${booking.destination}</p>
        <p>Journey Date: ${booking.date}</p>
      </div>
      <div>
        <p><strong>Status: ${booking.status}</strong></p>
        <p>Fare Paid: ₹${booking.fare}</p>
        <p>Passenger: ${booking.passengerName}</p>
      </div>
    </div>
  `;
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  sessionStorage.removeItem('railUser');
  updateDashboard();
  showToast('Signed out successfully.');
});

trainForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('adminTrainName').value.trim();
  const route = document.getElementById('adminTrainRoute').value.trim();
  const date = document.getElementById('adminTrainDate').value;
  const seats = Number(document.getElementById('adminSeats').value);
  const [origin, destination] = route.split('-').map(t => t.trim());
  const id = `TRN${Math.floor(Math.random() * 900 + 100)}`;
  const newTrain = {
    id,
    name,
    origin: origin || 'Origin',
    destination: destination || 'Destination',
    date,
    class: 'Sleeper',
    seats,
    fare: 750
  };
  adminTrainsData.push(newTrain);
  localStorage.setItem('adminTrains', JSON.stringify(adminTrainsData));
  renderAdminTrains();
  trainForm.reset();
  showToast('Train schedule updated.');
});

function renderAdminTrains() {
  adminTrains.innerHTML = '';
  if (!adminTrainsData.length) {
    adminTrains.innerHTML = '<p class="status-card">No trains registered yet.</p>';
    return;
  }
  adminTrainsData.forEach(train => {
    const row = document.createElement('div');
    row.className = 'train-row';
    row.innerHTML = `
      <div>
        <strong>${train.name}</strong>
        <p>${train.origin} → ${train.destination}</p>
      </div>
      <div>
        <p>${train.date}</p>
        <p>Class: ${train.class}</p>
        <p>Seats: ${train.seats}</p>
      </div>
    `;
    adminTrains.appendChild(row);
  });
}

function init() {
  updateDashboard();
  renderAdminTrains();
}

init();
