const slides = document.querySelectorAll('.homepage-slideshow');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide() {
    slides.forEach((slide, index) => {

        if (index === currentSlide) {
            slide.style.display = 'block';
            dots[index].style.opacity = 1; 
        } 
        
        else {
            slide.style.display = 'none';
            dots[index].style.opacity = 0.5; 
        }
    });
}

showSlide();

document.querySelector('.next-left').addEventListener('click', () => {
    currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
    
    showSlide();
});

document.querySelector('.next-right').addEventListener('click', () => {
    currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
    
    showSlide();
});