document.addEventListener('DOMContentLoaded', function() {

    const unScrollContent = document.querySelector('.un-scroll-content');
    const toggleIcon = document.getElementById('toggleIcon');

    function toggleIconVisibility() {
        if (window.scrollY >= window.innerHeight) {
            toggleIcon.classList.add('show'); 
        } 
        
        else {
            toggleIcon.classList.remove('show');
        }
    }

    toggleIconVisibility();

    window.addEventListener('scroll', toggleIconVisibility);

    toggleIcon.addEventListener('click', function() {
        console.log("Toggle icon clicked");

        if (unScrollContent.classList.contains('active')) {
            
            unScrollContent.style.transform = 'translateX(100%)';
            unScrollContent.classList.remove('active');
            toggleIcon.classList.remove('fa-chevron-right');
            toggleIcon.classList.add('fa-chevron-left');
            toggleIcon.classList.remove('active');
            console.log("Left icon active");
            toggleIcon.style.right = '0px'; 
        } 
        
        else {
            unScrollContent.style.transform = 'translateX(0)';
            unScrollContent.classList.add('active');
            toggleIcon.classList.remove('fa-chevron-left');
            toggleIcon.classList.add('fa-chevron-right');
            toggleIcon.classList.add('active');
            toggleIcon.style.right = '202px';
            console.log("Right icon active");
        }
    });

    window.addEventListener('resize', resetUnScrollContent);
    resetUnScrollContent();
});