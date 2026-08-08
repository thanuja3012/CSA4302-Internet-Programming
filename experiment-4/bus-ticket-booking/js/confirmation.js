/* Confirmation page renders final booking details */
const confirmationDetails = document.getElementById('confirmationDetails');
const printButton = document.getElementById('printTicket');
const downloadButton = document.getElementById('downloadTicket');

function loadConfirmation() {
  const params = getQueryParams();
  const bookingId = params.bookingId;
  let booking = JSON.parse(sessionStorage.getItem('busTicket_currentBooking'));
  if (bookingId) {
    const bookings = getData(STORAGE_KEYS.bookings);
    booking = bookings.find(b => b.id === bookingId) || booking;
  }
  if (!booking) {
    confirmationDetails.innerHTML = '<div class="alert alert-warning">No booking details available. Please go to My Bookings.</div>';
    return;
  }
  confirmationDetails.innerHTML = `
    <div class="card card-shadow text-start p-4">
      <div class="mb-4">
        <h4 class="mb-1">${booking.busName}</h4>
        <p class="text-muted mb-1">Booking ID: ${booking.id}</p>
        <p class="text-muted">Payment Status: <strong>${booking.paymentStatus}</strong></p>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <p class="mb-1"><strong>Passenger Name</strong></p>
          <p>${booking.passengers[0]?.name || 'N/A'}</p>
        </div>
        <div class="col-md-6">
          <p class="mb-1"><strong>Bus Number</strong></p>
          <p>${booking.busNumber}</p>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6"><p class="mb-1"><strong>Route</strong></p><p>${booking.source} → ${booking.destination}</p></div>
        <div class="col-md-6"><p class="mb-1"><strong>Journey Date</strong></p><p>${formatDate(booking.date)}</p></div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6"><p class="mb-1"><strong>Departure Time</strong></p><p>${booking.departureTime}</p></div>
        <div class="col-md-6"><p class="mb-1"><strong>Seats</strong></p><p>${booking.seats.join(', ')}</p></div>
      </div>
      <div><p class="mb-1"><strong>Total Amount</strong></p><p>${formatCurrency(booking.totalAmount)}</p></div>
    </div>`;
}

function downloadTicketFile() {
  const booking = JSON.parse(sessionStorage.getItem('busTicket_currentBooking'));
  if (!booking) return;
  const content = `Booking Confirmed\nBooking ID: ${booking.id}\nBus: ${booking.busName}\nRoute: ${booking.source} → ${booking.destination}\nDate: ${formatDate(booking.date)}\nSeats: ${booking.seats.join(', ')}\nAmount: ${formatCurrency(booking.totalAmount)}\nPayment Status: ${booking.paymentStatus}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Ticket_${booking.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

window.addEventListener('DOMContentLoaded', () => {
  if (confirmationDetails) loadConfirmation();
  if (printButton) printButton.addEventListener('click', () => window.print());
  if (downloadButton) downloadButton.addEventListener('click', downloadTicketFile);
});