// Small interactions for a static landing/dashboard page
const navLinks = document.querySelectorAll('.main-nav a');

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.toggle('active', item === link));
  });
});

const bookingForm = document.querySelector('.booking-form');
const requestButton = document.querySelector('.booking-form button');

if (requestButton && bookingForm) {
  requestButton.addEventListener('click', () => {
    requestButton.textContent = 'Reservation Requested';
    requestButton.classList.add('success-button');
  });
}

const serviceCards = document.querySelectorAll('.service-card button');

serviceCards.forEach((button) => {
  button.addEventListener('click', () => {
    serviceCards.forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    button.textContent = 'Selected';
  });
});
