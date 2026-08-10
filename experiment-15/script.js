const navLinks = document.querySelectorAll('.main-nav a');

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((l) => l.classList.toggle('active', l === link));
  });
});

const cards = document.querySelectorAll('.feature-card, .account-row, .admin-item, .process-list li');

cards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-6px)' }
    ], {
      duration: 280,
      easing: 'ease-out'
    });
  });
});

const glassPanels = document.querySelectorAll('.hero-panel, .panel, .scan-card');

window.addEventListener('load', () => {
  glassPanels.forEach((panel) => {
    panel.animate([
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 700,
      easing: 'ease-out'
    });
  });
});
