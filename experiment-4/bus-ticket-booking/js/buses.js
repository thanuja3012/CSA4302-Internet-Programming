/* Bus search and listing logic */
const busesPage = document.getElementById('busesPage');
const busSearchForm = document.getElementById('busSearchForm');
const busList = document.getElementById('busList');

function renderBusCards(buses) {
  if (!busList) return;
  if (!buses.length) {
    busList.innerHTML = '<div class="alert alert-warning">No buses found for the selected route and date. Try another search.</div>';
    return;
  }
  busList.innerHTML = buses.map(bus => {
    const availableSeats = bus.totalSeats - bus.bookedSeats.length;
    return `
      <div class="col-lg-6">
        <div class="card bus-card p-3 mb-4">
          <div class="row g-3 align-items-center">
            <div class="col-md-8">
              <h5 class="mb-1">${bus.name}</h5>
              <p class="mb-1 text-muted">${bus.number} • ${bus.category}</p>
              <p class="mb-1"><strong>${bus.source}</strong> → <strong>${bus.destination}</strong></p>
              <p class="mb-1"><i class="bi bi-clock"></i> Departure: ${bus.depTime} • Arrival: ${bus.arrTime}</p>
              <p class="mb-1"><i class="bi bi-geo-alt"></i> ${bus.depLocation} • ${bus.arrLocation}</p>
            </div>
            <div class="col-md-4 text-end">
              <p class="fs-4 fw-semibold text-primary mb-1">${formatCurrency(bus.price)}</p>
              <p class="mb-1 text-success">${availableSeats} seats left</p>
              <p class="mb-1 text-muted">${bus.duration}</p>
              <div class="d-grid gap-2 mt-2">
                <a href="booking.html?busId=${bus.id}" class="btn btn-outline-primary btn-sm">View Seats</a>
                <a href="booking.html?busId=${bus.id}" class="btn btn-primary btn-sm">Book Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function filterBuses(source, destination, date) {
  const buses = getData(STORAGE_KEYS.buses);
  return buses.filter(bus => {
    const matchesSource = source ? bus.source.toLowerCase().includes(source.toLowerCase()) : true;
    const matchesDestination = destination ? bus.destination.toLowerCase().includes(destination.toLowerCase()) : true;
    const matchesDate = date ? bus.date === date : true;
    return matchesSource && matchesDestination && matchesDate;
  });
}

function populateSearchFields() {
  const params = getQueryParams();
  if (params.source) document.getElementById('searchSource').value = params.source;
  if (params.destination) document.getElementById('searchDestination').value = params.destination;
  if (params.date) document.getElementById('searchDate').value = params.date;
  if (params.time) document.getElementById('searchTime').value = params.time;
  const results = filterBuses(params.source || '', params.destination || '', params.date || '');
  renderBusCards(results);
}

if (busSearchForm) {
  busSearchForm.addEventListener('submit', event => {
    event.preventDefault();
    const source = document.getElementById('searchSource').value.trim();
    const destination = document.getElementById('searchDestination').value.trim();
    const date = document.getElementById('searchDate').value;
    const results = filterBuses(source, destination, date);
    renderBusCards(results);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (busesPage) populateSearchFields();
});
