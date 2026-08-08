/* Admin report generation and CSV export */
const reportTotalBookings = document.getElementById('reportTotalBookings');
const reportCancelledBookings = document.getElementById('reportCancelledBookings');
const reportRevenue = document.getElementById('reportRevenue');
const reportUsers = document.getElementById('reportUsers');
const reportBus = document.getElementById('reportBus');
const reportDate = document.getElementById('reportDate');
const reportTableBody = document.getElementById('reportTableBody');
const generateReportBtn = document.getElementById('generateReportBtn');
const printReportBtn = document.getElementById('printReportBtn');
const downloadReportBtn = document.getElementById('downloadReportBtn');

function loadReportPage() {
  requireAdmin();
  const users = getData(STORAGE_KEYS.users);
  const bookings = getData(STORAGE_KEYS.bookings);
  const buses = getData(STORAGE_KEYS.buses);
  reportTotalBookings.textContent = bookings.length;
  reportCancelledBookings.textContent = bookings.filter(b => b.status === 'Cancelled').length;
  reportRevenue.textContent = formatCurrency(bookings.filter(b => b.paymentStatus === 'Paid').reduce((sum, booking) => sum + booking.totalAmount, 0));
  reportUsers.textContent = users.length;
  reportBus.innerHTML = `<option value="">All Buses</option>` + buses.map(bus => `<option value="${bus.id}">${bus.name}</option>`).join('');
  renderReportTable(bookings);
}

function renderReportTable(bookings) {
  reportTableBody.innerHTML = bookings.map(booking => `
    <tr>
      <td>${booking.id}</td>
      <td>${getData(STORAGE_KEYS.users).find(user => user.id === booking.userId)?.fullName || 'Guest'}</td>
      <td>${booking.busName}</td>
      <td>${formatDate(booking.date)}</td>
      <td>${booking.seats.join(', ')}</td>
      <td>${formatCurrency(booking.totalAmount)}</td>
      <td>${booking.status}</td>
    </tr>
  `).join('');
}

function applyReportFilters() {
  let bookings = getData(STORAGE_KEYS.bookings);
  if (reportBus.value) {
    bookings = bookings.filter(booking => booking.busId === reportBus.value);
  }
  if (reportDate.value) {
    bookings = bookings.filter(booking => booking.date === reportDate.value);
  }
  renderReportTable(bookings);
}

function downloadCSV() {
  const rows = [['Booking ID', 'User', 'Bus', 'Date', 'Seats', 'Amount', 'Status']];
  const bookings = Array.from(reportTableBody.querySelectorAll('tr')).map(row => Array.from(row.children).map(cell => cell.textContent));
  const csvContent = rows.concat(bookings).map(r => r.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'booking-report.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

window.addEventListener('DOMContentLoaded', () => {
  if (reportTableBody) {
    loadReportPage();
    generateReportBtn.addEventListener('click', applyReportFilters);
    printReportBtn.addEventListener('click', () => window.print());
    downloadReportBtn.addEventListener('click', downloadCSV);
  }
});