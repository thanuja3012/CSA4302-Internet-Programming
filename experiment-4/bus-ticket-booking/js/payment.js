/* Demo payment module for completing bookings */
const paymentPage = document.getElementById('paymentPage');
const paymentForm = document.getElementById('paymentForm');
const paymentMessage = document.getElementById('paymentMessage');

function renderPaymentSummary(booking) {
  if (!booking || !paymentPage) return;
  const summaryContainer = document.getElementById('paymentSummary');
  summaryContainer.innerHTML = `
    <div class="card card-shadow p-4 mb-4">
      <h5 class="mb-3">Booking Summary</h5>
      <p class="mb-1"><strong>Booking ID:</strong> ${booking.id}</p>
      <p class="mb-1"><strong>Bus:</strong> ${booking.busName}</p>
      <p class="mb-1"><strong>Route:</strong> ${booking.source} → ${booking.destination}</p>
      <p class="mb-1"><strong>Date:</strong> ${formatDate(booking.date)}</p>
      <p class="mb-1"><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
      <p class="mb-1"><strong>Total Amount:</strong> ${formatCurrency(booking.totalAmount)}</p>
    </div>`;
}

function loadPaymentPage() {
  const booking = JSON.parse(sessionStorage.getItem('busTicket_currentBooking'));
  if (!booking) {
    if (paymentPage) paymentPage.innerHTML = '<div class="alert alert-warning">No booking found. Please start a booking first.</div>';
    return;
  }
  renderPaymentSummary(booking);
}

function validateCardDetails() {
  const cardType = document.querySelector('input[name="paymentMethod"]:checked')?.value;
  if (!cardType) return null;
  const cardNumber = document.getElementById('cardNumber').value.trim();
  const cardHolder = document.getElementById('cardHolder').value.trim();
  const expiry = document.getElementById('expiryDate').value.trim();
  const cvv = document.getElementById('cvv').value.trim();
  const upiId = document.getElementById('upiId').value.trim();
  if (cardType === 'UPI') {
    if (!upiId) return null;
    return { method: cardType, upiId };
  }
  if (!cardNumber || !cardHolder || !expiry || !cvv) return null;
  if (!/^[0-9]{16}$/.test(cardNumber)) return null;
  if (!/^[0-9]{3,4}$/.test(cvv)) return null;
  return { method: cardType, cardNumber, cardHolder, expiry, cvv };
}

function completePayment(event) {
  event.preventDefault();
  const details = validateCardDetails();
  if (!details) {
    showAlert(paymentMessage, 'Please complete valid payment information before proceeding.', 'danger');
    return;
  }
  const booking = JSON.parse(sessionStorage.getItem('busTicket_currentBooking'));
  if (!booking) return;
  const bookings = getData(STORAGE_KEYS.bookings);
  const index = bookings.findIndex(b => b.id === booking.id);
  if (index === -1) return;
  bookings[index].paymentStatus = 'Paid';
  bookings[index].status = 'Confirmed';
  bookings[index].paymentMethod = details.method;
  setData(STORAGE_KEYS.bookings, bookings);
  sessionStorage.setItem('busTicket_currentBooking', JSON.stringify(bookings[index]));
  const buses = getData(STORAGE_KEYS.buses);
  const busIndex = buses.findIndex(b => b.id === booking.busId);
  if (busIndex !== -1) {
    buses[busIndex].bookedSeats = Array.from(new Set([...buses[busIndex].bookedSeats, ...booking.seats]));
    setData(STORAGE_KEYS.buses, buses);
  }
  showAlert(paymentMessage, 'Payment successful! Redirecting to confirmation...', 'success');
  setTimeout(() => window.location.href = 'confirmation.html', 1400);
}

if (paymentForm) {
  paymentForm.addEventListener('submit', completePayment);
}

window.addEventListener('DOMContentLoaded', () => {
  if (paymentPage) loadPaymentPage();
});
