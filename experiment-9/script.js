const cart = [];

const cartDrawer = document.querySelector('.cart-drawer');
const cartItems = document.getElementById('cartItems');
const cartCountBadge = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function showToast(message) {
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function renderCart() {
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="empty-cart"><span>Cart is empty</span></div>`;
    cartCountBadge.textContent = '0';
    cartTotal.textContent = '$0';
    return;
  }

  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <span class="mini-thumb"></span>
      <div>
        <h4>${item.name}</h4>
        <small>${item.category}</small>
      </div>
      <span class="cart-price">${item.price}</span>
    `;
    cartItems.appendChild(row);
  });

  const total = cart.reduce((acc, item) => acc + item.price, 0);
  cartCountBadge.textContent = cart.length;
  cartTotal.textContent = `$${total}`;
}

const cartButton = document.querySelector('.cart-button');
cartButton.addEventListener('click', openCart);

document.getElementById('closeCart').addEventListener('click', closeCart);

document.querySelectorAll('.add-button').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card.querySelector('h3').textContent;
    const category = card.dataset.category;
    const price = Number(card.querySelector('.price-tag').textContent.replace(/[^\d]/g, ''));

    cart.push({ name, category, price: price });
    renderCart();
    showToast(`${name} added`);
    openCart();
  });
});

const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;

    filterButtons.forEach(item => item.classList.toggle('active', item === button));

    document.querySelectorAll('[data-category]').forEach(card => {
      const shouldShow = selected === 'all' || card.dataset.category === selected;
      card.style.display = shouldShow ? 'block' : 'none';
    });
  });
});
