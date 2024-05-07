document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    menuIcon.addEventListener('click', function() {

        navLinks.classList.toggle('active');

        if (navLinks.classList.contains('active')) {
            menuIcon.classList.replace('fa-bars', 'fa-xmark');
        } 
        
        else {
            menuIcon.classList.replace('fa-xmark', 'fa-bars');
        }
    });
});