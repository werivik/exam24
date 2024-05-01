const slides = document.querySelectorAll('.homepage-slideshow');
let currentSlide = 0;
let dots = document.querySelectorAll('.dot');

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

function moveToNextSlide() {
    const nextSlideIndex = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
    slides[currentSlide].querySelector('.background-photo').classList.add('slide-left');
    slides[nextSlideIndex].querySelector('.background-photo').classList.remove('slide-right');
    currentSlide = nextSlideIndex;

    showSlide();
}

function moveToPreviousSlide() {
    const previousSlideIndex = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
    slides[currentSlide].querySelector('.background-photo').classList.add('slide-right');
    slides[previousSlideIndex].querySelector('.background-photo').classList.remove('slide-left');
    currentSlide = previousSlideIndex;

    showSlide();
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        
        showSlide();
    });
});

document.querySelector('.next-left').addEventListener('click', moveToPreviousSlide);
document.querySelector('.next-right').addEventListener('click', moveToNextSlide);