// Renders product cards from PRODUCTS (see products-data.js) into .products-grid.
// Runs before script.js so the filter buttons find the cards already in the DOM.

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderProductCard(p) {
    const goldClass = p.featured ? ' gold' : '';
    const safeName = escapeHtml(p.name);
    return `
            <article class="product-card${goldClass}" data-category="${p.category}" data-id="${p.id}" data-name="${safeName}" data-price="${p.price}">
                <img src="images/${p.image}" alt="${safeName}">
                <h3>${safeName}</h3>
                <span>$${p.price.toFixed(2)}</span>
                <button type="button" class="add-to-cart-btn">Add to Bag</button>
            </article>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.products-grid');
    if (!grid || typeof PRODUCTS === 'undefined') return;
    grid.innerHTML = PRODUCTS.map(renderProductCard).join('\n');
});