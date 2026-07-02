const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");

if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

const heroSlider = document.querySelector("[data-hero-slider]");
const heroDots = document.querySelectorAll("[data-hero-dot]");

if (heroSlider && heroDots.length) {
    const heroImages = [
        "../images/photo-1617038260897-41a1f14a8ca5.jpg",
        "../images/photo-1617038260897-41a1f14a8ca5.jpg",
        "../images/photo-1617038260897-41a1f14a8ca5.jpg"
    ];

    let currentHero = 0;

    function setHeroSlide(index) {
        currentHero = index;
        heroSlider.style.setProperty("--hero-image", `url('${heroImages[index]}')`);
        heroDots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === index);
        });
    }

    heroDots.forEach((dot) => {
        dot.addEventListener("click", () => {
            setHeroSlide(Number(dot.dataset.heroDot));
        });
    });

    setInterval(() => {
        setHeroSlide((currentHero + 1) % heroImages.length);
    }, 5000);
}

// Products filtering and URL category handling
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    function showCategory(cat){
        products.forEach(p => {
            const pCat = p.getAttribute('data-category') || '';
            if(cat === 'all' || cat.toLowerCase() === pCat.toLowerCase()){
                p.style.display = '';
            } else {
                p.style.display = 'none';
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-category');
            showCategory(cat);
            history.replaceState(null, '', '?category=' + encodeURIComponent(cat));
            filterBtns.forEach(b => {
                b.classList.remove('btn-dark');
                b.classList.add('btn-outline-dark');
            });
            btn.classList.add('btn-dark');
            btn.classList.remove('btn-outline-dark');
        });
    });

    // read category from URL
    const params = new URLSearchParams(window.location.search);
    const catFromUrl = params.get('category');
    if(catFromUrl){
        // try to find matching button
        const matchBtn = Array.from(filterBtns).find(b => b.getAttribute('data-category').toLowerCase() === catFromUrl.toLowerCase());
        if(matchBtn) matchBtn.click(); else showCategory(catFromUrl);
    }
});

