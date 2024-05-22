document.addEventListener('DOMContentLoaded', function() {
    const unScrollContent = document.querySelector('.un-scroll-content');
    const toggleIcon = document.getElementById('toggleIcon');

    toggleIcon.addEventListener('click', function() {
        if (unScrollContent.classList.contains('active')) {

            unScrollContent.style.transform = 'translateX(100%)';
            unScrollContent.classList.remove('active');
            toggleIcon.classList.remove('fa-chevron-right');
            toggleIcon.classList.add('fa-chevron-left');
        } 
        
        else {
            unScrollContent.style.transform = 'translateX(0)';
            unScrollContent.classList.add('active');
            toggleIcon.classList.remove('fa-chevron-left');
            toggleIcon.classList.add('fa-chevron-right');
        }

    });
});