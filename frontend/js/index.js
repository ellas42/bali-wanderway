let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-item");
const indicators = document.querySelectorAll(".indicator");
const videos = document.querySelectorAll(".carousel-item video");

function updateCarousel() {
  const carousel = document.querySelector(".carousel");
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

  indicators.forEach((ind, idx) => {
    ind.classList.toggle("active", idx === currentSlide);
  });

  videos.forEach((video, idx) => {
    if (idx === currentSlide) {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
}

function moveCarousel(direction) {
  currentSlide += direction;
  if (currentSlide < 0) currentSlide = slides.length - 1;
  if (currentSlide >= slides.length) currentSlide = 0;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

setInterval(() => {
  moveCarousel(1);
}, 5000);

videos[0].play();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});


// header
const header = document.querySelector('.navbar');
let lastScroll = 0;
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

     if (currentScroll <= 0) {
        header.classList.remove('visible');
    } else if (currentScroll > scrollThreshold) {
        header.classList.add('visible');
    }
    
    
    lastScroll = currentScroll;
});