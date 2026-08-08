/* Core shared utilities and demo data initialization */
const STORAGE_KEYS = {
  users: 'busTicket_users',
  buses: 'busTicket_buses',
  categories: 'busTicket_categories',
  bookings: 'busTicket_bookings',
  comments: 'busTicket_comments',
  news: 'busTicket_news',
  currentUser: 'busTicket_currentUser',
  adminSession: 'busTicket_adminLogged',
  initialized: 'busTicket_initialized'
};

function getData(key) {
  return JSON.parse(localStorage.getItem(key) || 'null') || [];
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.currentUser));
}

function setCurrentUser(user, remember = false) {
  sessionStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
  if (remember) {
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
  }
}

function clearCurrentUser() {
  sessionStorage.removeItem(STORAGE_KEYS.currentUser);
  localStorage.removeItem(STORAGE_KEYS.currentUser);
}

function getAdminSession() {
  return sessionStorage.getItem(STORAGE_KEYS.adminSession) === 'true';
}

function setAdminSession(active) {
  sessionStorage.setItem(STORAGE_KEYS.adminSession, active ? 'true' : 'false');
}

function formatDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function generateId(prefix = 'BK') {
  return `${prefix}${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
}

function showAlert(container, message, type = 'success') {
  if (!container) return;
  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

function initDemoData() {
  if (!localStorage.getItem(STORAGE_KEYS.initialized)) {
    const categories = [
      { id: 'cat1', name: 'Volvo' },
      { id: 'cat2', name: 'Sleeper Coach' },
      { id: 'cat3', name: 'AC Coach' },
      { id: 'cat4', name: 'Non-AC Coach' },
      { id: 'cat5', name: 'Deluxe Bus' }
    ];

    const buses = [
      {
        id: 'bus1',
        name: 'Chennai Express',
        number: 'TN 01 AB 1234',
        category: 'Volvo',
        source: 'Chennai',
        destination: 'Bangalore',
        depLocation: 'Chennai Central',
        arrLocation: 'Kempegowda Bus Stand',
        depTime: '08:00 AM',
        arrTime: '02:30 PM',
        duration: '6h 30m',
        date: '2026-09-15',
        price: 850,
        totalSeats: 20,
        bookedSeats: ['A1', 'B2', 'C3'],
        description: 'Premium Volvo sleeper with AC, Wi-Fi and onboard refreshments.'
      },
      {
        id: 'bus2',
        name: 'Bangalore Travels',
        number: 'KA 05 CD 7890',
        category: 'AC Coach',
        source: 'Bangalore',
        destination: 'Chennai',
        depLocation: 'Majestic',
        arrLocation: 'Tambaram',
        depTime: '07:30 PM',
        arrTime: '01:45 AM',
        duration: '6h 15m',
        date: '2026-09-16',
        price: 780,
        totalSeats: 20,
        bookedSeats: ['A4', 'D1'],
        description: 'Comfortable evening service with reclining seats and charging points.'
      },
      {
        id: 'bus3',
        name: 'Tamil Nadu Super Deluxe',
        number: 'TN 07 EF 4567',
        category: 'Deluxe Bus',
        source: 'Chennai',
        destination: 'Coimbatore',
        depLocation: 'Chennai Airport',
        arrLocation: 'Coimbatore Junction',
        depTime: '09:15 PM',
        arrTime: '05:00 AM',
        duration: '7h 45m',
        date: '2026-09-17',
        price: 950,
        totalSeats: 20,
        bookedSeats: ['E2', 'E3'],
        description: 'Super deluxe coach with meal service and spacious legroom.'
      },
      {
        id: 'bus4',
        name: 'Volvo Multi-Axle',
        number: 'KA 09 GH 1122',
        category: 'Volvo',
        source: 'Chennai',
        destination: 'Madurai',
        depLocation: 'Chennai Central',
        arrLocation: 'Madurai Bus Stand',
        depTime: '10:00 PM',
        arrTime: '06:15 AM',
        duration: '8h 15m',
        date: '2026-09-18',
        price: 1100,
        totalSeats: 20,
        bookedSeats: ['C1', 'B4','D3'],
        description: 'Multi-axle Volvo with mattress seats and luxury interiors.'
      },
      {
        id: 'bus5',
        name: 'GreenLine Sleeper',
        number: 'TN 10 IJ 3344',
        category: 'Sleeper Coach',
        source: 'Chennai',
        destination: 'Pondicherry',
        depLocation: 'Chennai Airport',
        arrLocation: 'Pondicherry Main Road',
        depTime: '06:45 AM',
        arrTime: '10:30 AM',
        duration: '3h 45m',
        date: '2026-09-19',
        price: 420,
        totalSeats: 20,
        bookedSeats: ['A2', 'D4'],
        description: 'Safe sleeper service with soft beds and refreshments included.'
      }
    ];

    const users = [
      {
        id: 'user1',
        fullName: 'Seetha Raj',
        email: 'seetha@example.com',
        mobile: '9876543210',
        dob: '1994-08-12',
        password: 'Seetha@123',
        address: 'Chennai, Tamil Nadu',
        registrationDate: new Date().toISOString(),
        status: 'Active'
      }
    ];

    const bookings = [];
    const comments = [];
    const news = [
      { id: 'news1', title: 'Safe Winter Journeys', description: 'Travel safe with our sanitized buses and flexible cancellation policy.', date: '2026-09-01' },
      { id: 'news2', title: 'Special Diwali Offers', description: 'Book early and save up to 25% on selected premium routes.', date: '2026-09-05' }
    ];

    setData(STORAGE_KEYS.categories, categories);
    setData(STORAGE_KEYS.buses, buses);
    setData(STORAGE_KEYS.users, users);
    setData(STORAGE_KEYS.bookings, bookings);
    setData(STORAGE_KEYS.comments, comments);
    setData(STORAGE_KEYS.news, news);
    localStorage.setItem(STORAGE_KEYS.initialized, 'true');
  }
  const rememberedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.currentUser));
  if (rememberedUser && !sessionStorage.getItem(STORAGE_KEYS.currentUser)) {
    sessionStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(rememberedUser));
  }
}

function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

function formatCurrency(value) {
  return `₹${parseFloat(value).toFixed(2)}`;
}

function updateNavbarUser() {
  const currentUser = getCurrentUser();
  const profileLinks = document.querySelectorAll('.nav-user-name');
  if (currentUser) {
    profileLinks.forEach(el => {
      el.textContent = currentUser.fullName.split(' ')[0];
    });
  }
}

function requireLogin() {
  if (!getCurrentUser()) {
    window.location.href = 'login.html';
  }
}

function requireAdmin() {
  if (!getAdminSession()) {
    window.location.href = 'admin-login.html';
  }
}

function logoutUser() {
  clearCurrentUser();
  window.location.href = 'index.html';
}

function logoutAdmin() {
  setAdminSession(false);
  window.location.href = 'admin-login.html';
}

window.addEventListener('DOMContentLoaded', () => {
  initDemoData();
  updateNavbarUser();
});
