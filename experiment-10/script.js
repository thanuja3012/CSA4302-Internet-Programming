const products = [
    {
        id: 1,
        name: 'Urban Twist Blazer',
        category: 'Women',
        subcategory: 'Formal Attire',
        price: 168,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&q=80',
        description: 'A structured statement blazer with soft-touch finish and elegant cut.'
    },
    {
        id: 2,
        name: 'Everyday Knit Hoodie',
        category: 'Men',
        subcategory: 'Casual Wear',
        price: 86,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1506629905607-ef4ff7c28e9b?auto=format&fit=crop&q=80',
        description: 'A warm layer with soft rib-detailing and a relaxed silhouette.'
    },
    {
        id: 3,
        name: 'Mini Explorer Backpack',
        category: 'Accessories',
        subcategory: 'Lifestyle',
        price: 54,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80',
        description: 'Compact city companion with organized storage and contemporary texture.'
    },
    {
        id: 4,
        name: 'Sculpted Street Denim',
        category: 'Women',
        subcategory: 'Casual Wear',
        price: 92,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80',
        description: 'A stretch denim essential cut for a confident everyday look.'
    },
    {
        id: 5,
        name: 'Flex Runner Sneakers',
        category: 'Footwear',
        subcategory: 'Seasonal Collections',
        price: 124,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80',
        description: 'A lightweight platform sneaker with premium foam support.'
    },
    {
        id: 6,
        name: 'Soft Cotton Kids Set',
        category: 'Kids',
        subcategory: 'Casual Wear',
        price: 38,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80',
        description: 'Soft-touch coordinated outfit made for easy movement and play.'
    }
];

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const cartDrawer = document.getElementById('cartDrawer');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

let cart = [];

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}

function renderProducts() {
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    const searchTerm = searchInput.value.trim().toLowerCase();

    let visibleProducts = products.filter(product => {
        const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
        const searchMatch = product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.subcategory.toLowerCase().includes(searchTerm);
        return categoryMatch && searchMatch;
    });

    const priceSort = sortSelect.value;
    if (priceSort === 'price-low') {
        visibleProducts = [...visibleProducts].sort((a, b) => a.price - b.price);
    } else if (priceSort === 'price-high') {
        visibleProducts = [...visibleProducts].sort((a, b) => b.price - a.price);
    } else if (priceSort === 'rating') {
        visibleProducts = [...visibleProducts].sort((a, b) => b.rating - a.rating);
    }

    if (visibleProducts.length === 0) {
        productGrid.innerHTML = `<article class="empty-card">No products found for your style edit.</article>`;
        return;
    }

    productGrid.innerHTML = visibleProducts.map(product => `
        <article class="product-card" data-category="${product.category}">
            <div class="product-image" style="background-image: url('${product.image}')">
                <span class="tag">${product.subcategory}</span>
                <span class="love">♡</span>
            </div>
            <div class="product-content">
                <div class="meta-row">
                    <span class="category-name">${product.category}</span>
                    <span class="product-rating">${'★'.repeat(Math.round(product.rating))}</span>
                </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-footer">
                    <span class="price">${formatPrice(product.price)}</span>
                    <button class="add-button add-to-cart" data-id="${product.id}">Add</button>
                </div>
            </div>
        </article>
    `).join('');
}

function renderCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);

    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">Your shopping bag is empty.</p>`;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <article class="cart-item">
            <img src="${item.image}" alt="" />
            <div>
                <h4>${item.name}</h4>
                <p>${item.category}</p>
                <p>Qty: ${item.quantity}</p>
                <span class="price">${formatPrice(item.price * item.quantity)}</span>
            </div>
            <button class="remove-cart-item" data-id="${item.id}">×</button>
        </article>
    `).join('');
}

productGrid.addEventListener('click', event => {
    if (event.target.classList.contains('add-to-cart')) {
        const productId = Number(event.target.dataset.id);
        const selected = products.find(product => product.id === productId);
        if (!selected) return;

        const existing = cart.find(item => item.id === selected.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...selected, quantity: 1 });
        }

        renderCart();
        cartDrawer.classList.add('open');
    }
});

cartItems.addEventListener('click', event => {
    if (event.target.classList.contains('remove-cart-item')) {
        const productId = Number(event.target.dataset.id);
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }
});

cartToggle.addEventListener('click', () => {
    cartDrawer.classList.toggle('open');
});

closeCart.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
});

searchInput.addEventListener('input', renderProducts);
sortSelect.addEventListener('change', renderProducts);
document.querySelectorAll('input[name="category"]').forEach(input => {
    input.addEventListener('change', renderProducts);
});

renderProducts();
renderCart();
