document.addEventListener('DOMContentLoaded', () => {
  const complaintForm = document.querySelector('.complaint-form');
  const quickButton = document.querySelector('.quick-actions .icon-button');

  if (complaintForm) {
    complaintForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const submitButton = complaintForm.querySelector('button[type="submit"]');
      if (!submitButton) return;

      const originalText = submitButton.textContent;
      submitButton.textContent = 'Complaint Submitted';
      submitButton.disabled = true;

      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 1800);
    });
  }

  if (quickButton) {
    quickButton.addEventListener('click', () => {
      const complaintFormContainer = document.querySelector('#contact .complaint-form');
      if (complaintFormContainer) {
        complaintFormContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate([
          { transform: 'translateY(12px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 }
        ], {
          duration: 550,
          easing: 'ease-out'
        });
      }
    });
  }, { threshold: 0.24 });

  document.querySelectorAll('.feature-card, .role-card, .process-item, .contact-card').forEach((item) => {
    observer.observe(item);
  });
});
