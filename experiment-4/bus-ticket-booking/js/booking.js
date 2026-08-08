/* Booking page logic, seat selection and passenger details */
const bookingPage = document.getElementById('bookingPage');
const seatMapContainer = document.getElementById('seatMapContainer');
const selectedSeatsList = document.getElementById('selectedSeats');
const seatSummary = document.getElementById('seatSummary');
const passengerFormSection = document.getElementById('passengerFormSection');
const passengerFormsContainer = document.getElementById('passengerFormsContainer');
const bookingSummary = document.getElementById('bookingSummary');
const completeBookingButton = document.getElementById('completeBookingButton');

const seatOrder = ['A1','A2','empty','A3','A4','B1','B2','empty','B3','B4','C1','C2','empty','C3','C4','D1','D2','empty','D3','D4','E1','E2','empty','E3','E4'];
let selectedSeats = [];
let selectedBus = null;

function renderBusDetails(bus) {
  if (!bookingPage) return;
  const infoContainer = document.getElementById('busInfo');
  if (!infoContainer) return;
  infoContainer.innerHTML = `
    <div class="card card-shadow p-4 mb-4">
      <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
        <div>
          <h5>${bus.name}</h5>
          <p class="mb-1 text-muted">${bus.number} • ${bus.category}</p>
          <p class="mb-1"><strong>${bus.source}</strong> → <strong>${bus.destination}</strong></p>
          <p class="mb-1">Date: ${formatDate(bus.date)}</p>
        </div>
        <div class="text-md-end">
          <p class="mb-1">Departure: ${bus.depTime}</p>
          <p class="mb-1">Price: ${formatCurrency(bus.price)}</p>
        </div>
      </div>
    </div>`;
}

function updateSeatSelection() {
  if (!selectedSeatsList || !seatSummary) return;
  const price = selectedBus ? selectedBus.price : 0;
  selectedSeatsList.textContent = selectedSeats.join(', ') || 'None';
  seatSummary.innerHTML = `
    <p class="mb-1"><strong>Selected Seats:</strong> ${selectedSeats.length}</p>
    <p class="mb-1"><strong>Price per seat:</strong> ${formatCurrency(price)}</p>
    <p class="mb-1"><strong>Total:</strong> ${formatCurrency(price * selectedSeats.length)}</p>
  `;
  renderPassengerForms();
}

function renderPassengerForms() {
  if (!passengerFormsContainer) return;
  passengerFormsContainer.innerHTML = '';
  if (!selectedSeats.length) {
    passengerFormSection.classList.add('d-none');
    return;
  }
  passengerFormSection.classList.remove('d-none');
  selectedSeats.forEach((seat, index) => {
    const passengerCard = document.createElement('div');
    passengerCard.className = 'card p-3 mb-3';
    passengerCard.innerHTML = `
      <h6 class="mb-3">Passenger for seat ${seat}</h6>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Passenger Name</label>
          <input type="text" class="form-control passenger-name" data-seat="${seat}" required>
        </div>
        <div class="col-md-2">
          <label class="form-label">Age</label>
          <input type="number" class="form-control passenger-age" data-seat="${seat}" min="1" required>
        </div>
        <div class="col-md-2">
          <label class="form-label">Gender</label>
          <select class="form-select passenger-gender" data-seat="${seat}" required>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Mobile Number</label>
          <input type="tel" class="form-control passenger-mobile" data-seat="${seat}" placeholder="10 digits" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input type="email" class="form-control passenger-email" data-seat="${seat}" placeholder="email@example.com" required>
        </div>
      </div>`;
    passengerFormsContainer.appendChild(passengerCard);
  });
}

function renderSeatMap(bus) {
  if (!seatMapContainer) return;
  seatMapContainer.innerHTML = '';
  const bookedSeats = new Set(bus.bookedSeats || []);
  seatOrder.forEach(seatId => {
    const seatEl = document.createElement('div');
    if (seatId === 'empty') {
      seatEl.className = 'seat empty';
      seatMapContainer.appendChild(seatEl);
      return;
    }
    const isBooked = bookedSeats.has(seatId);
    const selected = selectedSeats.includes(seatId);
    seatEl.textContent = seatId;
    seatEl.className = `seat ${isBooked ? 'booked' : selected ? 'selected' : 'available'}`;
    seatEl.addEventListener('click', () => {
      if (isBooked) return;
      if (selected) {
        selectedSeats = selectedSeats.filter(s => s !== seatId);
      } else {
        selectedSeats.push(seatId);
      }
      renderSeatMap(bus);
      updateSeatSelection();
    });
    seatMapContainer.appendChild(seatEl);
  });
}

function validatePassengerDetails() {
  const passengerNames = document.querySelectorAll('.passenger-name');
  const passengerAges = document.querySelectorAll('.passenger-age');
  const passengerGenders = document.querySelectorAll('.passenger-gender');
  const passengerMobiles = document.querySelectorAll('.passenger-mobile');
  const passengerEmails = document.querySelectorAll('.passenger-email');
  const data = [];
  for (let i = 0; i < selectedSeats.length; i++) {
    const seat = selectedSeats[i];
    const name = passengerNames[i]?.value.trim();
    const age = passengerAges[i]?.value.trim();
    const gender = passengerGenders[i]?.value;
    const mobile = passengerMobiles[i]?.value.trim();
    const email = passengerEmails[i]?.value.trim();
    if (!name || !age || !gender || !mobile || !email) return null;
    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mobileRegex.test(mobile) || !emailRegex.test(email)) return null;
    data.push({ seat, name, age, gender, mobile, email });
  }
  return data;
}

function updateBookingSummary() {
  if (!bookingSummary) return;
  const seats = selectedSeats.length;
  if (!selectedBus) return;
  const price = selectedBus.price;
  bookingSummary.innerHTML = `
    <div class="card card-shadow p-4">
      <h5 class="mb-3">Booking Summary</h5>
      <p class="mb-1"><strong>Bus:</strong> ${selectedBus.name}</p>
      <p class="mb-1"><strong>Route:</strong> ${selectedBus.source} → ${selectedBus.destination}</p>
      <p class="mb-1"><strong>Date:</strong> ${formatDate(selectedBus.date)}</p>
      <p class="mb-1"><strong>Seats Selected:</strong> ${seats}</p>
      <p class="mb-1"><strong>Total:</strong> ${formatCurrency(price * seats)}</p>
      <p class="text-muted small mt-3">After selecting passenger details, click proceed to payment.</p>
    </div>`;
}

function loadBookingPage() {
  const params = getQueryParams();
  const busId = params.busId;
  const buses = getData(STORAGE_KEYS.buses);
  selectedBus = buses.find(bus => bus.id === busId);
  if (!selectedBus) {
    if (bookingPage) bookingPage.innerHTML = '<div class="alert alert-danger">Bus not found. Please go back to search buses.</div>';
    return;
  }
  renderBusDetails(selectedBus);
  renderSeatMap(selectedBus);
  updateSeatSelection();
  updateBookingSummary();
}

function handleBookingSubmit(event) {
  event.preventDefault();
  if (!selectedBus) return;
  if (!selectedSeats.length) {
    showAlert(document.getElementById('bookingMessage'), 'Please select at least one seat to continue.', 'danger');
    return;
  }
  const passengerData = validatePassengerDetails();
  if (!passengerData) {
    showAlert(document.getElementById('bookingMessage'), 'Please complete all passenger details correctly.', 'danger');
    return;
  }
  const existingBookings = getData(STORAGE_KEYS.bookings);
  const newBooking = {
    id: generateId('BK'),
    userId: getCurrentUser()?.id || 'guest',
    busId: selectedBus.id,
    busName: selectedBus.name,
    busNumber: selectedBus.number,
    source: selectedBus.source,
    destination: selectedBus.destination,
    date: selectedBus.date,
    departureTime: selectedBus.depTime,
    seats: [...selectedSeats],
    pricePerSeat: selectedBus.price,
    totalAmount: selectedBus.price * selectedSeats.length,
    status: 'Pending Payment',
    paymentStatus: 'Pending',
    passengers: passengerData,
    createdAt: new Date().toISOString()
  };
  existingBookings.push(newBooking);
  setData(STORAGE_KEYS.bookings, existingBookings);
  sessionStorage.setItem('busTicket_currentBooking', JSON.stringify(newBooking));
  window.location.href = 'payment.html';
}

if (completeBookingButton) {
  completeBookingButton.addEventListener('click', handleBookingSubmit);
}

window.addEventListener('DOMContentLoaded', () => {
  if (bookingPage) loadBookingPage();
});
