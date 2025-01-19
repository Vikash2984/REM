const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 60;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const icon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Add animation
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0)';
    }, 300);

    // Close mobile menu when theme is toggled
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
});

// Reveal animations on scroll
const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// Counter animation
const startCounters = () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCount();
                observer.unobserve(counter);
            }
        });

        observer.observe(counter);
    });
};

// Start counters when about section is visible
const aboutSection = document.querySelector('.about');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        startCounters();
        observer.unobserve(aboutSection);
    }
});

observer.observe(aboutSection);

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(44, 62, 80, 0.98)';
    } else {
        nav.style.background = 'rgba(44, 62, 80, 0.95)';
    }
});

// Carousel functionality
const carousel = document.querySelector('.carousel');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');

let currentIndex = 0;
const totalItems = carouselItems.length;

function getItemsPerSlide() {
    return window.innerWidth >= 768 ? 3 : 1;
}

function updateCarousel() {
    const itemsPerSlide = getItemsPerSlide();
    const slideWidth = 100 / itemsPerSlide;
    
    // Clone items for smooth looping
    carousel.innerHTML = '';
    const clonedItems = [];
    for (let i = 0; i < itemsPerSlide * 2 + totalItems; i++) {
        clonedItems.push(carouselItems[i % totalItems].cloneNode(true));
    }
    clonedItems.forEach(item => carousel.appendChild(item));
    
    carousel.style.transform = `translateX(-${(currentIndex + itemsPerSlide) * slideWidth}%)`;
}

function showNextItem() {
    const itemsPerSlide = getItemsPerSlide();
    currentIndex++;
    carousel.style.transition = 'transform 0.5s ease';
    updateCarousel();
    
    if (currentIndex >= totalItems) {
        currentIndex = 0;
        setTimeout(() => {
            carousel.style.transition = 'none';
            updateCarousel();
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease';
            }, 50);
        }, 500);
    }
}

function showPrevItem() {
    const itemsPerSlide = getItemsPerSlide();
    currentIndex--;
    carousel.style.transition = 'transform 0.5s ease';
    
    if (currentIndex < 0) {
        updateCarousel();
        currentIndex = totalItems - 1;
        setTimeout(() => {
            carousel.style.transition = 'none';
            updateCarousel();
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease';
            }, 50);
        }, 500);
    } else {
        updateCarousel();
    }
}

nextButton.addEventListener('click', () => {
    stopAutoScroll();
    showNextItem();
    startAutoScroll();
});

prevButton.addEventListener('click', () => {
    stopAutoScroll();
    showPrevItem();
    startAutoScroll();
});

// Auto-scroll functionality
let autoScrollInterval;

function startAutoScroll() {
    autoScrollInterval = setInterval(showNextItem, 1500); // Change slide every 1.5 seconds
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Start auto-scroll when the page loads
startAutoScroll();

// Pause auto-scroll when user interacts with the carousel
if (window.innerWidth >= 768) {
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
} else {
    carousel.addEventListener('touchstart', stopAutoScroll);
}

// Touch events for mobile swipe
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoScroll();
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoScroll();
});

function handleSwipe() {
    if (touchEndX < touchStartX) {
        showNextItem();
    }
    if (touchEndX > touchStartX) {
        showPrevItem();
    }
}

// Update carousel on window resize
window.addEventListener('resize', () => {
    stopAutoScroll();
    updateCarousel();
    startAutoScroll();
});

// Initial carousel setup
updateCarousel();