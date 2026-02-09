// ------------------------------------
// Slideshow / Presentation Module
// ------------------------------------

// ---- Core Slideshow Functions ----

function startSlideshow() {
    generatePresentationSlides();
    lucide.createIcons();
    document.getElementById('admin-container').classList.add('hidden');
    document.getElementById('presentation-container').classList.remove('hidden');

    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((e) => { });
    }

    currentSlideIndex = 0;
    isPaused = false;
    showSlide(0);
    updateSlideCounter();

    const intervalInput = document.getElementById('setting-interval');
    const intervalSeconds = intervalInput ? parseInt(intervalInput.value) || 8 : 8;

    startSlideInterval(intervalSeconds);
}

function startSlideInterval(seconds) {
    if (slideIntervalId) clearInterval(slideIntervalId);
    slideIntervalId = setInterval(() => {
        if (isPaused) return;
        const slides = document.querySelectorAll('.slide');
        if (slides.length === 0) return;
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
        updateSlideCounter();
    }, seconds * 1000);
}

function togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('pause-btn');

    if (isPaused) {
        btn.innerHTML = `
            <i data-lucide="play" class="w-5 h-5"></i>
            <span>재생</span>
        `;
        btn.classList.add('bg-green-500/50');
        btn.classList.remove('bg-white/20');
    } else {
        btn.innerHTML = `
            <i data-lucide="pause" class="w-5 h-5"></i>
            <span>일시정지</span>
        `;
        btn.classList.remove('bg-green-500/50');
        btn.classList.add('bg-white/20');
    }
    lucide.createIcons();
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(currentSlideIndex);
    updateSlideCounter();
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
    updateSlideCounter();
}

function updateSlideCounter() {
    const slides = document.querySelectorAll('.slide');
    const counter = document.getElementById('slide-counter');
    if (counter) {
        counter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
    }
}

function showControlsTemporarily() {
    const controlsWrapper = document.getElementById('slideshow-controls-wrapper');
    if (!controlsWrapper) return;

    controlsWrapper.classList.add('active');

    if (controlsTimeoutId) {
        clearTimeout(controlsTimeoutId);
    }

    controlsTimeoutId = setTimeout(() => {
        controlsWrapper.classList.remove('active');
    }, 1000);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    if (!slides || slides.length === 0) return;
    slides.forEach(s => s.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
}

function stopSlideshow() {
    if (slideIntervalId) clearInterval(slideIntervalId);
    isPaused = false;
    document.getElementById('presentation-container').classList.add('hidden');
    document.getElementById('admin-container').classList.remove('hidden');

    if (document.exitFullscreen) {
        document.exitFullscreen().catch((e) => { });
    }

    // Clean up the slide container when stopping
    const container = document.getElementById('slideshow-slides');
    if (container) {
        container.innerHTML = '';
    }
}

function getStatusColor(status) {
    if (status.includes('가족 찾는 중')) return 'bg-juo-orange';
    if (status.includes('가족 맞이 준비중')) return 'bg-blue-500';
    if (status.includes('행복한 집으로')) return 'bg-emerald-500';
    if (status.includes('가능')) return 'bg-juo-orange';
    if (status.includes('대기') || status.includes('예약')) return 'bg-blue-500';
    return 'bg-green-600';
}

// ---- Slide Generation ----

function generatePresentationSlides() {
    const container = document.getElementById('slideshow-slides');
    if (!container) return;
    container.innerHTML = '';

    let slideIndex = 1;

    // Slide 1 - Premium Hero (static)
    container.innerHTML += getSlide1PremiumHero();

    // Slide 2 - Notice (if enabled)
    if (config.notice.enabled && config.notice.title) {
        container.innerHTML += getSlide2Notice(slideIndex);
        slideIndex++;
    }

    // Dynamic slides from config.slides
    config.slides.forEach((slide) => {
        if (slide.pet1.hidden && slide.pet2.hidden) return;

        let content = '';

        if (!slide.pet1.hidden && !slide.pet2.hidden) {
            content = `
                <div class="w-full flex flex-col h-full p-20 bg-slate-50">
                    <div class="flex justify-between items-end mb-10 shrink-0">
                        <h2 class="text-5xl font-black text-slate-800 uppercase tracking-tighter">${config.intro.title} <span class="text-juo-orange ml-4">${config.intro.subtitle}</span></h2>
                        <p class="text-xl text-slate-500 italic">Today's Featured Pets</p>
                    </div>
                    <div class="grid grid-cols-2 gap-12 flex-grow h-0">
                        ${createStandardCard(slide.pet1)}
                        ${createStandardCard(slide.pet2)}
                    </div>
                </div>`;
        } else if (!slide.pet1.hidden) {
            content = `
                <div class="w-full flex flex-col h-full bg-slate-50">
                    <div class="flex justify-between items-end px-20 pt-20 pb-6 shrink-0">
                        <h2 class="text-5xl font-black text-slate-800 uppercase tracking-tighter">${config.intro.title} <span class="text-juo-orange ml-4">${config.intro.subtitle}</span></h2>
                        <p class="text-xl text-slate-500 italic">Today's Featured Pet</p>
                    </div>
                    <div class="flex-grow">${createHeroCard(slide.pet1)}</div>
                </div>`;
        } else if (!slide.pet2.hidden) {
            content = `
                <div class="w-full flex flex-col h-full bg-slate-50">
                    <div class="flex justify-between items-end px-20 pt-20 pb-6 shrink-0">
                        <h2 class="text-5xl font-black text-slate-800 uppercase tracking-tighter">${config.intro.title} <span class="text-juo-orange ml-4">${config.intro.subtitle}</span></h2>
                        <p class="text-xl text-slate-500 italic">Today's Featured Pet</p>
                    </div>
                    <div class="flex-grow">${createHeroCard(slide.pet2)}</div>
                </div>`;
        }

        container.innerHTML += `<div id="slide-${slideIndex}" class="slide ${!slide.pet1.hidden && !slide.pet2.hidden ? '' : 'p-0'}">${content}</div>`;
        slideIndex++;
    });

    // Static Section Helper
    const addStaticSlide = (contentHTML, bgClass) => {
        container.innerHTML += `<div id="slide-${slideIndex}" class="slide flex-col ${bgClass}">${contentHTML}</div>`;
        slideIndex++;
    };

    // Slide 3 - Pet Insurance
    addStaticSlide(getSlide3PetInsurance(), 'p-0 justify-center');

    // Slide 4 - Bridge 1 (Donut Chart)
    addStaticSlide(getSlide4BridgeDonutChart(), 'p-0');

    // Slide 5 - Bridge 2 (Puzzle: Pet Insurance -> Membership)
    addStaticSlide(getSlide5BridgePuzzle(), 'p-0');

    // Slide 6-A - White & Silver Membership
    addStaticSlide(getSlide6MembershipSilver(), 'p-0');

    // Slide 6-B - Gold & VIP Membership
    addStaticSlide(getSlide6MembershipGoldVip(config.shelterMode), 'p-0');

    // Slide 7 was removed

    // Slide 8 - Closing / CTA
    addStaticSlide(getSlide8ClosingCta(), 'p-0');

    // Re-run icons after all slides are generated
    lucide.createIcons();
}

// ---- Keyboard Controls ----

document.addEventListener('keydown', (e) => {
    const presentationContainer = document.getElementById('presentation-container');
    if (presentationContainer.classList.contains('hidden')) return;

    if (e.key === 'Escape') {
        stopSlideshow();
    } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePause();
        showControlsTemporarily();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
        showControlsTemporarily();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        showControlsTemporarily();
    }
});

// ---- Window Exports for Inline HTML Handlers ----

window.startSlideshow = startSlideshow;
window.startSlideInterval = startSlideInterval;
window.togglePause = togglePause;
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.updateSlideCounter = updateSlideCounter;
window.showControlsTemporarily = showControlsTemporarily;
window.generatePresentationSlides = generatePresentationSlides;
window.showSlide = showSlide;
window.stopSlideshow = stopSlideshow;
window.getStatusColor = getStatusColor;
