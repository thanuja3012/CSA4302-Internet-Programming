document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.querySelector('.booking-form');
  const searchButton = document.querySelector('.hero-search-card .btn-primary');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const button = bookingForm.querySelector('button[type="submit"]') || bookingForm.querySelector('button');
      if (!button) return;

      const oldText = button.textContent;
      button.textContent = 'Booking Requested';
      button.disabled = true;

      setTimeout(() => {
        button.textContent = oldText;
        button.disabled = false;
      }, 1800);
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      searchButton.textContent = 'Searching...';
      setTimeout(() => {
        searchButton.textContent = 'Search Doctors';
      }, 900);
    });
  }

  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach(item => item.classList.toggle('active', item === link));
    });
  });
});
