// ==========================================================
// LUX ACCESSORIES — SHOPPING CART
// Persists cart contents in localStorage so it survives
// page navigation and reloads across the whole site.
// ==========================================================

const CART_STORAGE_KEY = 'lux_cart';

function getCart() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.warn('Could not read cart from storage, starting fresh.', err);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    renderCartBadge();
    renderCartPanel();
}

function addToCart(product) {
    if (!product.id) return;
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
    openCartPanel();
}

function removeFromCart(id) {
    saveCart(getCart().filter((item) => item.id !== id));
}

function updateQty(id, qty) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (qty <= 0) {
        removeFromCart(id);
        return;
    }

    item.qty = qty;
    saveCart(cart);
}

function cartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
    return getCart().reduce((sum, item) => sum + item.qty * item.price, 0);
}

function formatPrice(value) {
    const num = Number(value);
    return `$${Number.isFinite(num) ? num.toFixed(2) : '0.00'}`;
}

function renderCartBadge() {
    document.querySelectorAll('.cart-count').forEach((el) => {
        el.textContent = String(cartCount());
    });
}

function buildCartPanel() {
    if (document.getElementById('cartPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'cartPanel';
    panel.className = 'cart-panel';
    panel.innerHTML = `
        <div class="cart-panel-overlay" data-cart-close></div>
        <div class="cart-panel-inner" role="dialog" aria-label="Shopping bag">
            <div class="cart-panel-header">
                <h4>Your Bag</h4>
                <button type="button" class="cart-panel-close" data-cart-close aria-label="Close bag">&times;</button>
            </div>
            <div class="cart-panel-items"></div>
            <div class="cart-panel-footer">
                <div class="cart-panel-total">
                    <span>Total</span>
                    <strong class="cart-total">$0.00</strong>
                </div>
                <button type="button" class="cart-checkout-btn">Checkout</button>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    panel.querySelectorAll('[data-cart-close]').forEach((el) => {
        el.addEventListener('click', closeCartPanel);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeCartPanel();
    });
}

function renderCartPanel() {
    const panel = document.getElementById('cartPanel');
    if (!panel) return;

    const itemsEl = panel.querySelector('.cart-panel-items');
    const cart = getCart();

    if (!cart.length) {
        itemsEl.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
    } else {
        itemsEl.innerHTML = cart
            .map(
                (item) => `
            <div class="cart-line" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-line-info">
                    <h5>${item.name}</h5>
                    <span>${formatPrice(item.price)}</span>
                    <div class="cart-qty">
                        <button type="button" data-action="dec" aria-label="Decrease quantity">-</button>
                        <span>${item.qty}</span>
                        <button type="button" data-action="inc" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button type="button" class="cart-line-remove" data-action="remove" aria-label="Remove item">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `
            )
            .join('');
    }

    panel.querySelector('.cart-total').textContent = formatPrice(cartTotal());

    itemsEl.querySelectorAll('.cart-line').forEach((line) => {
        const id = line.dataset.id;

        line.querySelector('[data-action="inc"]')?.addEventListener('click', () => {
            const item = getCart().find((i) => i.id === id);
            if (item) updateQty(id, item.qty + 1);
        });

        line.querySelector('[data-action="dec"]')?.addEventListener('click', () => {
            const item = getCart().find((i) => i.id === id);
            if (item) updateQty(id, item.qty - 1);
        });

        line.querySelector('[data-action="remove"]')?.addEventListener('click', () => {
            removeFromCart(id);
        });
    });
}

function openCartPanel() {
    buildCartPanel();
    renderCartPanel();
    document.getElementById('cartPanel').classList.add('active');
    document.body.classList.add('cart-open');
}

function closeCartPanel() {
    document.getElementById('cartPanel')?.classList.remove('active');
    document.body.classList.remove('cart-open');
}

document.addEventListener('DOMContentLoaded', () => {
    buildCartPanel();
    renderCartBadge();
    renderCartPanel();

    // Cart icon in the nav opens the panel instead of navigating away.
    document.querySelectorAll('.cart-icon').forEach((icon) => {
        icon.addEventListener('click', (event) => {
            event.preventDefault();
            openCartPanel();
        });
    });

    // "Add to Bag" buttons on product cards.
    document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            const card = btn.closest('[data-id]');
            if (!card) return;

            addToCart({
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                image: card.querySelector('img')?.getAttribute('src') || '',
            });
        });
    });

    // Placeholder checkout action — wire this up to a real checkout flow later.
    document.addEventListener('click', (event) => {
        if (event.target.closest('.cart-checkout-btn')) {
            alert('Checkout is not implemented yet — this is where payment would happen.');
        }
    });
});