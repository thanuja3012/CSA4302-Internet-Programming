document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            navLinks.forEach((item) => item.classList.toggle('active', item === link));
        });
    });

    const listingRows = document.querySelectorAll('.listing-row');
    listingRows.forEach((row) => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'translateY(-2px)';
            row.style.transition = 'transform 180ms ease';
        });

        row.addEventListener('mouseleave', () => {
            row.style.transform = 'translateY(0)';
        });
    });
});
