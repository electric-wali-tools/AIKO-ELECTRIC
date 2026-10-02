/* ==========================================================================
   AIKO ELECTRIC BIKE (AMBIC AUTOMOBILES KANPUR) - INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    updateCalculator();
    initHeroSlider();
});

// Hero Slider Functions
let currentHeroSlideIndex = 0;
let heroSlideTimer = null;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    startHeroSliderTimer();

    const sliderWrapper = document.getElementById('heroSlidesWrapper');
    if (sliderWrapper) {
        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        sliderWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 40) {
                nextHeroSlide(); // Swipe left -> Next slide
            } else if (touchEndX - touchStartX > 40) {
                prevHeroSlide(); // Swipe right -> Prev slide
            }
        }, { passive: true });
    }
}

function startHeroSliderTimer() {
    clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(() => {
        nextHeroSlide();
    }, 3800); // Auto-slides every 3.8 seconds continuously
}

function showHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('#heroSliderDots .dot');
    if (!slides.length) return;

    if (index >= slides.length) currentHeroSlideIndex = 0;
    else if (index < 0) currentHeroSlideIndex = slides.length - 1;
    else currentHeroSlideIndex = index;

    slides.forEach((slide, i) => {
        if (i === currentHeroSlideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    dots.forEach((dot, i) => {
        if (i === currentHeroSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextHeroSlide() {
    showHeroSlide(currentHeroSlideIndex + 1);
    startHeroSliderTimer();
}

function prevHeroSlide() {
    showHeroSlide(currentHeroSlideIndex - 1);
    startHeroSliderTimer();
}

function goToHeroSlide(index) {
    showHeroSlide(index);
    startHeroSliderTimer();
}

// Mobile Drawer Navigation
function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    drawer.classList.toggle('active');
}

// Scooter Models Filtering
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const scooterCards = document.querySelectorAll('.scooter-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            scooterCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategories.includes(filterValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Dynamic EV Savings Calculator
function updateCalculator() {
    const dailyKmInput = document.getElementById('dailyKm');
    const dailyKmValSpan = document.getElementById('dailyKmVal');
    const petrolPriceInput = document.getElementById('petrolPrice');
    const petrolMileageInput = document.getElementById('petrolMileage');

    const monthlyPetrolSpan = document.getElementById('monthlyPetrol');
    const monthlyEVSpan = document.getElementById('monthlyEV');
    const yearlySavingsH3 = document.getElementById('yearlySavings');

    if (!dailyKmInput || !petrolPriceInput || !petrolMileageInput) return;

    const dailyKm = parseFloat(dailyKmInput.value) || 30;
    const petrolPrice = parseFloat(petrolPriceInput.value) || 96;
    const petrolMileage = parseFloat(petrolMileageInput.value) || 40;

    dailyKmValSpan.textContent = `${dailyKm} Km`;

    // Petrol calculation: (dailyKm / mileage) * price * 30 days
    const dailyPetrolCost = (dailyKm / petrolMileage) * petrolPrice;
    const monthlyPetrolCost = Math.round(dailyPetrolCost * 30);

    // EV calculation: EV costs ~₹0.15 per km
    const evCostPerKm = 0.15;
    const dailyEVCost = dailyKm * evCostPerKm;
    const monthlyEVCost = Math.round(dailyEVCost * 30);

    const netMonthlySavings = monthlyPetrolCost - monthlyEVCost;
    const netYearlySavings = netMonthlySavings * 12;

    monthlyPetrolSpan.textContent = `₹${monthlyPetrolCost.toLocaleString('en-IN')}`;
    monthlyEVSpan.textContent = `₹${monthlyEVCost.toLocaleString('en-IN')}`;
    yearlySavingsH3.textContent = `₹${netYearlySavings.toLocaleString('en-IN')}`;
}

// Modal Popup Handlers
function openTestRideModal(modelName = 'Aiko Electric Scooter') {
    const modal = document.getElementById('inquiryModal');
    const modalModelSpan = document.getElementById('modalModelName');
    modalModelSpan.textContent = modelName;
    modal.classList.add('active');
}

function openInquiryModal(modelName) {
    openTestRideModal(modelName);
}

function closeInquiryModal() {
    const modal = document.getElementById('inquiryModal');
    modal.classList.remove('active');
}

// Close modal if clicked outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('inquiryModal');
    if (e.target === modal) {
        closeInquiryModal();
    }
});

// Handle Form Submissions & Redirect to WhatsApp
function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const model = document.getElementById('selectedModel').value;
    const date = document.getElementById('preferredDate').value || 'As soon as possible';
    const address = document.getElementById('userAddress').value || 'Barra, Kanpur';

    const message = `Hello Aiko Electric (Ambic Automobiles)!\n\nI want to book a Test Ride / Inquire about Aiko EV Scooter:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n🛵 Model: ${model}\n📅 Preferred Date: ${date}\n📍 Location: ${address}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917905081805?text=${encodedMessage}`;

    alert(`Thank you ${name}! Redirecting your inquiry to Aiko Electric (Ambic Automobiles) on WhatsApp...`);
    window.open(whatsappUrl, '_blank');
}

function handleModalSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('modalName').value;
    const phone = document.getElementById('modalPhone').value;
    const city = document.getElementById('modalCity').value || 'Barra, Kanpur';
    const model = document.getElementById('modalModelName').textContent;

    const message = `Hello Aiko Electric!\n\nI am interested in buying / booking a test ride for ${model}:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n📍 Locality: ${city}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917905081805?text=${encodedMessage}`;

    closeInquiryModal();
    window.open(whatsappUrl, '_blank');
}

// Active Nav Link Scroll Highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});
