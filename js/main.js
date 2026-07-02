const menuButton = document.querySelector('.menu-btn');
const navigationMenu = document.querySelector('.nav-menu');

if (menuButton && navigationMenu) {
    const toggleMenu = () => {
        navigationMenu.classList.toggle('active');

        const isOpen = navigationMenu.classList.contains('active');
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.innerHTML = isOpen
            ? '<i class="bi bi-x-lg"></i>'
            : '<i class="bi bi-list"></i>';
    };

    menuButton.addEventListener('click', toggleMenu);

    menuButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMenu();
        }
    });

    navigationMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navigationMenu.classList.remove('active');
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.innerHTML = '<i class="bi bi-list"></i>';
        });
    });
}
