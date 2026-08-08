document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        setTimeout(() => {
          button.textContent = originalText;
          alert('Request submitted successfully. This prototype demonstrates the reservation workflow.');
        }, 700);
      }
    });
  });
});
