document.addEventListener('DOMContentLoaded', () => {
  const cartButton = document.querySelector('.cart-button');
  const addButtons = document.querySelectorAll('[class="add-button"]');

  addButtons.forEach((button) => {
    button.addEventListener('click', () => {
      button.textContent = 'Added';
      button.classList.add('added');

      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        const currentCount = Number(cartCount.textContent.trim()) || 0;
        cartCount.textContent = currentCount + 1;
      }
    });
  });

  if (cartButton) {
    cartButton.addEventListener('click', () => {
      cartButton.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' }
      ], {
        duration: 260,
        easing: 'ease-out'
      });
    });
  }
});
