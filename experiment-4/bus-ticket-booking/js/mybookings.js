/* My bookings page logic and booking cancellation */
const bookingHistoryTable = document.getElementById('bookingHistoryTable');
const bookingCount = document.getElementById('bookingCount');
const upcomingCount = document.getElementById('upcomingCount');
const completedCount = document.getElementById('completedCount');
const cancelledCount = document.getElementById('cancelledCount');

function getStatusLabel(status) {
  const badge = {
    Confirmed: 'success',
    'Pending Payment': 'warning',
    Cancelled: 'danger'
  };
  return badge[status] || 'secondary';
}

function loadMyBookings() {
  requireLogin();
  const currentUser = getCurrentUser();
  const bookings = getData(STORAGE_KEYS.bookings).filter(booking => booking.userId === currentUser.id);
  bookingCount.textContent = bookings.length;
  upcomingCount.textContent = bookings.filter(b => b.status === 'Confirmed').length;
  completedCount.textContent = 0;
  cancelledCount.textContent = bookings.filter(b => b.status === 'Cancelled').length;
  bookingHistoryTable.innerHTML = bookings.map(booking => `
    <tr>
      <td>${booking.id}</td>
      <td>${booking.busName}</td>
      <td>${booking.source} → ${booking.destination}</td>
      <td>${formatDate(booking.date)}</td>
      <td>${booking.seats.join(', ')}</td>
      <td>${formatCurrency(booking.totalAmount)}</td>
      <td><span class="badge bg-${getStatusLabel(booking.status)}">${booking.status}</span></td>
      <td>
        <a href="confirmation.html?bookingId=${booking.id}" class="btn btn-sm btn-outline-primary me-1">View</a>
        ${booking.status !== 'Cancelled' ? `<button class="btn btn-sm btn-danger" onclick="cancelBooking('${booking.id}')">Cancel</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function cancelBooking(bookingId) {
  const confirmed = confirm('Are you sure you want to cancel this booking?');
  if (!confirmed) return;
  const bookings = getData(STORAGE_KEYS.bookings);
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) return;
  bookings[bookingIndex].status = 'Cancelled';
  bookings[bookingIndex].paymentStatus = 'Refund Pending';
  setData(STORAGE_KEYS.bookings, bookings);
  const selectedBooking = bookings[bookingIndex];
  const buses = getData(STORAGE_KEYS.buses);
  const busIndex = buses.findIndex(b => b.id === selectedBooking.busId);
  if (busIndex !== -1) {
    buses[busIndex].bookedSeats = buses[busIndex].bookedSeats.filter(seat => !selectedBooking.seats.includes(seat));
    setData(STORAGE_KEYS.buses, buses);
  }
  showAlert(document.getElementById('myBookingsMessage'), 'Booking cancelled successfully and seats are available again.', 'success');
  loadMyBookings();
}

window.addEventListener('DOMContentLoaded', () => {
  if (bookingHistoryTable) loadMyBookings();
});