// ------------------------------------
// Slideshow / Presentation Module
// ------------------------------------

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

function generatePresentationSlides() {
    const container = document.getElementById('slideshow-slides');
    if (!container) return;
    container.innerHTML = '';
    let slideIndex = 1;

    // Slide 1 - Premium Hero
    container.innerHTML += `
        <div id="slide-0" class="slide active p-0 relative overflow-hidden bg-slate-900">
            <style>
                @keyframes slide1-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes slide1-glow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.6; }
                }
                @keyframes slide1-fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide1-popIn {
                    0% { opacity: 0; transform: scale(0.8); }
                    70% { transform: scale(1.05); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .slide1-orb-blue { animation: slide1-glow 8s ease-in-out infinite; }
                .slide1-orb-orange { animation: slide1-glow 10s ease-in-out infinite 2s; }
                .slide1-title { animation: slide1-fadeInUp 1s ease-out forwards; }
                .slide1-subtitle { animation: slide1-fadeInUp 1s ease-out 0.3s forwards; opacity: 0; }
                .slide1-card { animation: slide1-popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; opacity: 0; }
                .slide1-card-1 { animation-delay: 0.6s; }
                .slide1-card-2 { animation-delay: 0.75s; }
                .slide1-card-3 { animation-delay: 0.9s; }
                .slide1-card-4 { animation-delay: 1.05s; }
            </style>

            <!-- Dynamic Background Orbs -->
            <div class="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/30 rounded-full blur-[100px] slide1-orb-blue"></div>
            <div class="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[80px]"></div>

            <!-- Content -->
            <div class="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-12">
                
                <!-- Main Title Block -->
                <div class="mb-16">
                    <p class="text-2xl font-bold text-orange-300/80 tracking-[0.4em] uppercase mb-6 slide1-title">Premium Companion Care</p>
                    <h1 class="text-8xl font-black text-white leading-tight tracking-tight mb-6 slide1-title">
                        당신과 아이의 <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400">행복한 20년</span>
                    </h1>
                    <p class="text-4xl text-slate-400 font-medium slide1-subtitle">주오컴퍼니가 시작부터 끝까지 함께합니다.</p>
                </div>

                <!-- Service Cards (Glassmorphism Dock) -->
                <div class="flex gap-8 mt-8">
                    <!-- Card 1: 안심입양 -->
                    <div class="slide1-card slide1-card-1 group flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default">
                        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                            <i data-lucide="home" class="w-10 h-10 text-white"></i>
                        </div>
                        <span class="text-2xl font-bold text-white">안심입양</span>
                    </div>
                    <!-- Card 2: 건강관리 -->
                    <div class="slide1-card slide1-card-2 group flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default">
                        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <i data-lucide="stethoscope" class="w-10 h-10 text-white"></i>
                        </div>
                        <span class="text-2xl font-bold text-white">건강관리</span>
                    </div>
                    <!-- Card 3: 정기구독 -->
                    <div class="slide1-card slide1-card-3 group flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default">
                        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                            <i data-lucide="shopping-bag" class="w-10 h-10 text-white"></i>
                        </div>
                        <span class="text-2xl font-bold text-white">정기구독</span>
                    </div>
                    <!-- Card 4: 펫택시/훈련 -->
                    <div class="slide1-card slide1-card-4 group flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default">
                        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                            <i data-lucide="car" class="w-10 h-10 text-white"></i>
                        </div>
                        <span class="text-2xl font-bold text-white">펫택시/훈련</span>
                    </div>
                </div>
            </div>
        </div>`;

    // Slide 2 - Notice (if enabled)
    if (config.notice.enabled && config.notice.title) {
        container.innerHTML += `
            <div id="slide-${slideIndex}" class="slide flex-col items-center justify-center p-0 bg-slate-50 relative overflow-hidden">
                <style>
                    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
                    #slide-${slideIndex} .notice-content-wrapper {
                        font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
                    }
                </style>
                <div class="absolute inset-0 z-0 opacity-40" style="background-image: radial-gradient(#FF7A00 1px, transparent 1px); background-size: 40px 40px;"></div>
                <div class="absolute top-0 right-0 w-[50vh] h-[50vh] bg-orange-100 rounded-bl-full -z-10 blur-3xl opacity-60"></div>
                <div class="absolute bottom-0 left-0 w-[60vh] h-[60vh] bg-blue-50 rounded-tr-full -z-10 blur-3xl opacity-60"></div>
                <div class="max-w-[92%] w-full h-[88%] z-10 flex flex-col justify-center relative">
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-3 rounded-full shadow-lg border border-slate-100 flex items-center gap-3 z-20">
                        <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <span class="font-black text-slate-700 tracking-widest text-lg">OFFICIAL NOTICE</span>
                    </div>
                    <div class="bg-white/80 backdrop-blur-xl rounded-[4rem] w-full h-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 flex flex-col items-center justify-start text-center p-12 pt-40 relative overflow-hidden notice-content-wrapper">
                        <div class="absolute top-0 w-full h-2 bg-gradient-to-r from-juo-orange via-yellow-400 to-juo-orange"></div>
                        <div class="mb-14 relative">
                            <h2 class="text-8xl font-black text-slate-800 leading-tight tracking-tight drop-shadow-sm">${config.notice.title}</h2>
                            <div class="w-32 h-2 bg-juo-orange mx-auto mt-8 rounded-full opacity-30"></div>
                        </div>
                        <div class="relative w-full max-w-6xl">
                            <div class="text-6xl leading-[1.6] text-slate-600 font-medium break-all" style="white-space: pre-wrap; word-wrap: break-word;">${config.notice.content}</div>
                        </div>
                    </div>
                </div>
            </div>`;
        slideIndex++;
    }

    config.slides.forEach((slide) => {
        if (slide.pet1.hidden && slide.pet2.hidden) return;

        const renderChecklist = (items, isHero) => {
            const iconSize = isHero ? 'w-8 h-8' : 'w-6 h-6';
            const textSize = isHero ? 'text-3xl' : 'text-lg';
            const containerClass = isHero ? 'p-6 bg-white rounded-2xl shadow-sm border border-slate-100' : '';
            return items.map(item => `<li class="flex items-center gap-4 ${containerClass}"><div class="${iconSize} rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0"><i data-lucide="check-circle-2" class="w-full h-full p-1.5"></i></div><span class="${textSize} font-bold text-slate-700">${item}</span></li>`).join('');
        };

        const createHeroCard = (pet) => `
            <div class="flex w-full h-full bg-white overflow-hidden">
                <div class="w-[55%] h-full bg-slate-200 relative bg-cover bg-center" style="background-image: url(${pet.image})">
                    ${!pet.image ? '<div class="absolute inset-0 flex items-center justify-center text-slate-400 text-lg font-bold">사진 없음</div>' : ''}
                    <div class="absolute bottom-10 left-10">
                        <div class="inline-block px-10 py-4 rounded-full text-4xl font-black text-white ${getStatusColor(pet.status)} shadow-2xl mb-6 ring-4 ring-white/40 tracking-wider">${pet.status}</div>
                    </div>
                </div>
                <div class="w-[45%] p-20 flex flex-col justify-center bg-slate-50">
                    <div class="mb-12">
                        <div class="flex items-end gap-6 mb-6">
                            <h3 class="text-7xl font-black text-slate-800 tracking-tight">${pet.breed}</h3>
                        </div>
                        <div class="flex gap-4 mb-4">
                            <span class="text-4xl text-slate-500 font-medium">${pet.gender}</span>
                            <span class="w-px h-10 bg-slate-300"></span>
                            <span class="text-4xl text-slate-500 font-medium">${pet.birth} 출생</span>
                        </div>
                    </div>
                    <ul class="space-y-4">${renderChecklist(pet.checklist, true)}</ul>
                    <div class="mt-16 flex items-center gap-4 text-slate-400">
                        <i data-lucide="qr-code" class="w-10 h-10"></i>
                        <span class="text-2xl font-bold">상세 건강기록 확인하기</span>
                    </div>
                </div>
            </div>`;

        const createStandardCard = (pet) => `
            <div class="bg-white rounded-[3rem] overflow-hidden card-shadow flex flex-col border border-slate-200 h-full">
                <div class="h-[55%] bg-slate-200 relative bg-cover bg-center" style="background-image: url(${pet.image})">
                    ${!pet.image ? '<div class="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">[No Image]</div>' : ''}
                    <div class="absolute bottom-6 left-6">
                        <div class="px-8 py-4 rounded-full text-3xl font-black text-white ${getStatusColor(pet.status)} shadow-xl ring-4 ring-white/30 tracking-wide">${pet.status}</div>
                    </div>
                </div>
                <div class="h-[45%] p-8 flex flex-col justify-between">
                    <div>
                        <h3 class="text-4xl font-black mb-2 text-slate-800">${pet.breed}</h3>
                        <div class="flex items-center gap-3 text-xl text-slate-500 mb-6 font-medium">
                            <span>${pet.gender}</span>
                            <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>${pet.birth} 출생</span>
                        </div>
                        <ul class="space-y-3">${renderChecklist(pet.checklist, false)}</ul>
                    </div>
                </div>
            </div>`;

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

    // Static Sections
    const addStaticSlide = (contentHTML, bgClass) => {
        container.innerHTML += `<div id="slide-${slideIndex}" class="slide flex-col ${bgClass}">${contentHTML}</div>`;
        slideIndex++;
    };


    // Slide 4 - Pet Insurance (with full CSS animations from pet_insurance_slide.html)
    addStaticSlide(`
        <style>
            @keyframes pet-insurance-fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pet-insurance-popIn {
                0% { opacity: 0; transform: scale(0.8) rotate(-3deg); }
                70% { transform: scale(1.05) rotate(-3deg); }
                100% { opacity: 1; transform: scale(1) rotate(-3deg); }
            }
            @keyframes pet-insurance-popInStraight {
                0% { opacity: 0; transform: scale(0.8); }
                70% { transform: scale(1.05); }
                100% { opacity: 1; transform: scale(1); }
            }
            @keyframes pet-insurance-slideInRight {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes pet-insurance-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes pet-insurance-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            #slide-3 .pet-insurance-animate-receipt { animation: pet-insurance-popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both; }
            #slide-3 .pet-insurance-animate-arrow { animation: pet-insurance-slideInRight 0.4s ease-out 0.6s both; }
            #slide-3 .pet-insurance-animate-solution { animation: pet-insurance-fadeInUp 0.6s ease-out 0.8s both; }
            #slide-3 .pet-insurance-animate-price { animation: pet-insurance-popInStraight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.0s both; }
            .pet-insurance-animate-pulse { animation: pet-insurance-pulse 2s infinite ease-in-out; }
            .pet-insurance-float { animation: pet-insurance-float 6s ease-in-out infinite; }
            .pet-insurance-shadow-soft { box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1); }
            .pet-insurance-shadow-glow { box-shadow: 0 0 50px rgba(255, 122, 0, 0.2); }
        </style>
        
        <div class="pet-insurance-slide-content" style="display: flex; flex-direction: column; width: 100%; height: 100%; position: relative; background: radial-gradient(circle at 50% 10%, #fff 0%, #f1f5f9 100%); padding: 40px;">
            <div style="position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -100px; left: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,122,0,0.05) 0%, transparent 70%); border-radius: 50%;"></div>
            
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; z-index: 1;">
                
                <div style="text-align: center; margin-bottom: 30px; position: relative;">
                    <div style="display: inline-block; background: #fff; padding: 10px 30px; border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 20px; border: 1px solid #f1f5f9;">
                        <span style="font-weight: 700; color: #64748b; font-size: 18px;">📢 3대 질환 수술비 걱정 끝!</span>
                    </div>
                    <h1 style="font-size: 64px; font-weight: 900; color: #0f172a; line-height: 1.1; letter-spacing: -3px; margin: 0 0 16px 0;">
                        이제 펫보험은<br><span style="color: #FF7A00;">선택이 아닌 필수</span> 입니다
                    </h1>
                    <div style="font-size: 32px; font-weight: 700; color: #64748b; line-height: 1.3; letter-spacing: -1.5px;">
                        수술비 <span style="position: relative; color: #94a3b8; text-decoration: line-through; text-decoration-color: #ef4444; text-decoration-thickness: 5px;">300만 원</span>이 <span style="color: #1e293b;">90만 원</span>이 되는 마법
                    </div>
                </div>
                
                <div style="display: flex; align-items: flex-end; gap: 60px; margin-bottom: 30px;">
                    <div class="pet-insurance-shadow-soft pet-insurance-animate-receipt" style="width: 280px; background: #fff; border-radius: 24px; padding: 32px; text-align: center; position: relative; transform: rotate(-3deg); border: 1px solid #e2e8f0;">
                        <div style="font-size: 20px; font-weight: 700; color: #94a3b8; margin-bottom: 20px;">일반 진료비 영수증</div>
                        <div style="width: 70px; height: 70px; background: #f1f5f9; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="frown" style="width: 36px; height: 36px; color: #cbd5e1;"></i>
                        </div>
                        <div style="font-size: 60px; font-weight: 900; color: #ef4444; letter-spacing: -3px; line-height: 1; margin-bottom: 10px;">
                            300<span style="font-size: 32px; font-weight: 700; color: #94a3b8;">만</span>
                        </div>
                        <div style="font-size: 18px; color: #94a3b8; font-weight: 500;">전액 본인 부담</div>
                    </div>
                    
                    <i data-lucide="arrow-right" class="pet-insurance-animate-arrow" style="width: 48px; height: 48px; color: #cbd5e1; margin-bottom: 200px;"></i>
                    
                    <div class="pet-insurance-float pet-insurance-shadow-glow pet-insurance-animate-solution" style="width: 380px; background: white; border-radius: 36px; padding: 40px 32px; text-align: center; position: relative; z-index: 10; border: 5px solid #FF7A00;">
                        <div style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: #FF7A00; color: white; padding: 10px 28px; border-radius: 30px; font-weight: 900; font-size: 18px; box-shadow: 0 4px 10px rgba(255,122,0,0.3); white-space: nowrap;">
                            제휴 펫보험 적용 시
                        </div>
                        <div style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 24px;">🎉 부담금 확 줄었어요!</div>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 12px;">
                            <span style="font-size: 96px; font-weight: 900; color: #FF7A00; line-height: 1; letter-spacing: -4px;">90</span>
                            <div style="text-align: left; margin-top: 24px;">
                                <div style="font-size: 28px; font-weight: 700; color: #1e293b; line-height: 1;">만 원</div>
                                <div style="font-size: 16px; font-weight: 500; color: #64748b;">(본인 부담금)</div>
                            </div>
                        </div>
                        <div style="background: #fff7ed; border-radius: 20px; padding: 16px; margin-top: 24px;">
                            <span style="color: #c2410c; font-weight: 700; font-size: 20px;">총 210만 원</span>을 돌려받았어요 💰
                        </div>
                    </div>
                </div>
                
                <div class="pet-insurance-animate-price" style="width: 100%; max-width: 400px; display: flex; justify-content: center; margin-top: 10px;">
                    <div style="width: 100%; background: #16a34a; border-radius: 24px; padding: 24px 32px; box-shadow: 0 10px 30px rgba(22, 163, 74, 0.2); border: 2px solid #15803d; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; overflow: hidden; transform: scale(1.1);">
                        <div style="position: absolute; right: -20px; top: -20px; width: 100px; height: 100px; background: white; opacity: 0.1; border-radius: 50%;"></div>
                        <div class="pet-insurance-animate-pulse" style="position: absolute; top: 16px; right: 16px; background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800;">
                            동물등록 추가 할인
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 6px; text-align: center;">
                            <span style="font-size: 14px; font-weight: 700; color: #86efac;">알뜰한 보험료</span>
                            <span style="font-size: 18px; font-weight: 800; color: white;">월 보험료가 겨우?</span>
                        </div>
                        <div style="font-size: 42px; font-weight: 900; color: white; letter-spacing: -1.5px; line-height: 1;">
                            40,460원 <span style="font-size: 24px; color: #86efac; font-weight: 700;">부터~</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: white; border-top: 1px solid #f1f5f9; padding: 24px 48px; box-shadow: 0 -10px 40px rgba(0,0,0,0.03); margin-top: 20px; border-radius: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 40px;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div style="width: 80px; height: 80px; background: #eff6ff; border-radius: 20px; display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="bone" style="width: 40px; height: 40px; color: #3b82f6;"></i>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 900; color: #1e293b; margin-bottom: 4px;">슬개골 탈구</div>
                                <div style="font-size: 18px; font-weight: 600; color: #64748b;">1일 250만 원 한도</div>
                            </div>
                        </div>
                        
                        <div style="width: 1px; height: 80px; background: #e2e8f0;"></div>
                        
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div style="width: 80px; height: 80px; background: #fff7ed; border-radius: 20px; display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="sparkles" style="width: 40px; height: 40px; color: #f97316;"></i>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 900; color: #1e293b; margin-bottom: 4px;">피부 질환</div>
                                <div style="font-size: 18px; font-weight: 600; color: #64748b;">고가 약물 70% 보장</div>
                            </div>
                        </div>
                        
                        <div style="width: 1px; height: 80px; background: #e2e8f0;"></div>
                        
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div style="width: 80px; height: 80px; background: #f5f3ff; border-radius: 20px; display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="heart" style="width: 40px; height: 40px; color: #8b5cf6;"></i>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 900; color: #1e293b; margin-bottom: 4px;">구강 질환</div>
                                <div style="font-size: 18px; font-weight: 600; color: #64748b;">스케일링 보장</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 24px; padding-left: 48px; border-left: 2px solid #f1f5f9;">
                        <div style="text-align: right;">
                            <div style="font-size: 14px; color: #64748b; font-weight: 500; margin-bottom: 4px;">가입 및 상담 문의</div>
                            <div style="font-size: 32px; font-weight: 900; color: #1e293b; letter-spacing: -0.5px;">010-9101-1108</div>
                            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">지금 바로 전화주세요</div>
                        </div>
                        
                        <div style="width: 100px; height: 100px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <div style="width: 100%; height: 100%; background-image: repeating-linear-gradient(45deg, #f1f5f9 25%, transparent 25%, transparent 75%, #f1f5f9 75%, #f1f5f9), repeating-linear-gradient(45deg, #f1f5f9 25%, #f8fafc 25%, #f8fafc 75%, #f1f5f9 75%, #f1f5f9); background-position: 0 0, 10px 10px; background-size: 20px 20px; border-radius: 4px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `, 'p-0 justify-center');

    // Slide 4 - Bridge 1 (Donut Chart)
    addStaticSlide(`
        <style>
            @keyframes bubble-sequence {
                0% { opacity: 0; transform: scale(0.5); }
                15% { opacity: 1; transform: scale(1.2); }
                20% { transform: scale(1); }
                70% { opacity: 1; transform: scale(1); filter: blur(0px); }
                80% { opacity: 0; transform: scale(1.5); filter: blur(10px); }
                100% { opacity: 0; transform: scale(1.5); pointer-events: none; }
            }

            @keyframes content-enter {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }

            @keyframes donut-fill-red {
                0% { stroke-dasharray: 0, 100; }
                100% { stroke-dasharray: 80, 100; }
            }
            @keyframes donut-fill-gray {
                0% { stroke-dasharray: 0, 100; opacity: 0; }
                100% { stroke-dasharray: 20, 100; opacity: 1; }
            }
            @keyframes pop-in {
                0% { opacity: 0; transform: scale(0.5); }
                70% { transform: scale(1.1); }
                100% { opacity: 1; transform: scale(1); }
            }

            .bubble-phase {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 50;
                animation: bubble-sequence 4.5s ease-in-out forwards;
            }
            
            .content-phase {
                opacity: 0;
                animation: content-enter 0.8s ease-out 3.8s forwards;
            }

            .donut-segment-red {
                animation: donut-fill-red 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 4.2s;
            }
            .donut-segment-gray {
                animation: donut-fill-gray 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 4.2s;
            }

            .label-delayed {
                opacity: 0;
                animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .delay-1 { animation-delay: 4.6s; }
            .delay-2 { animation-delay: 4.8s; }
            .delay-3 { animation-delay: 5.0s; }

            .expense-label {
                position: absolute;
                padding: 1.0rem 2.2rem;
                background: #ffe4e6;
                color: #e11d48;
                border-radius: 9999px;
                font-weight: 800;
                font-size: 1.8rem;
                box-shadow: 0 10px 20px -5px rgba(225, 29, 72, 0.2);
                opacity: 0;
                white-space: nowrap;
                z-index: 20;
            }
            
            .bubble-container { filter: drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15)); }
        </style>

        <div class="relative w-full h-full bg-[#f8fafc] overflow-hidden flex items-center justify-center">
            
            <!-- Phase 1: Giant Floating Bubble -->
            <div class="bubble-phase">
                <div class="bubble-container transform scale-150 relative">
                    <div class="bg-white px-20 py-12 rounded-[4rem] flex flex-col items-center gap-8 text-center border border-slate-50">
                        <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Thinking%20Face.png" alt="Thinking Face" width="120" height="120" />
                        <h2 class="text-7xl font-black text-slate-800 tracking-tight leading-tight">그럼...<br>펫보험만 들면<br>충분한가요?</h2>
                    </div>
                    <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rotate-45"></div>
                </div>
            </div>

            <div class="content-phase flex flex-col items-center justify-center w-full h-full">
                <div class="text-center mb-10 relative z-10">
                    <p class="text-4xl text-slate-500 font-bold mb-4">아니요, 보험이 지켜주는건</p>
                    <div class="inline-block relative">
                        <p class="text-8xl font-black text-[#f43f5e] tracking-tight relative z-20">전체의 20% 뿐입니다.</p>
                        <div class="absolute bottom-4 left-0 w-full h-8 bg-[#ffe4e6] z-[-1]"></div>
                    </div>
                </div>

                <div class="relative w-[700px] h-[700px] flex items-center justify-center scale-90">
                    <div class="absolute inset-0 bg-red-50 rounded-full blur-3xl opacity-50 transform scale-75"></div>

                    <svg viewBox="0 0 36 36" class="w-full h-full rotate-[-90deg] drop-shadow-xl relative z-10">
                        <path class="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4.5" />
                        <path class="text-slate-500 donut-segment-gray" stroke-dasharray="20, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
                        <path class="text-[#f43f5e] donut-segment-red" stroke-dasharray="80, 100" stroke-dashoffset="-20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
                    </svg>

                    <div class="absolute inset-0 flex flex-col items-center justify-center pt-4 z-10">
                        <span class="text-3xl font-bold text-slate-500 mb-0">매일의 빈틈</span>
                        <span class="text-[140px] font-black text-[#f43f5e] tracking-tighter leading-none" style="text-shadow: 4px 4px 0px rgba(244, 63, 94, 0.1);">80%</span>
                    </div>

                    <div class="expense-label delay-2 label-delayed" style="top: 15%; right: 0; transform: translateX(20%);">배변 패드</div>
                    <div class="expense-label delay-3 label-delayed" style="top: 50%; left: -10%; transform: translateY(-50%);">사료/간식</div>
                    <div class="expense-label delay-2 label-delayed" style="bottom: 10%; left: 20%;">중성화 수술</div>
                    <div class="expense-label delay-3 label-delayed" style="bottom: 15%; right: 5%;">예방 접종</div>
                    <div class="expense-label delay-2 label-delayed" style="top: 50%; right: -10%; transform: translateY(-50%);">건강 검진</div>
                    
                    <div class="absolute top-[15%] left-[0%] transform -translate-x-[10%] bg-slate-600 text-white px-8 py-4 rounded-full font-bold text-2xl shadow-lg opacity-0 animate-[content-enter_0.5s_ease-out_5.1s_forwards] z-20">
                        펫보험 20%
                    </div>
                </div>
            </div>
        </div>
    `, 'p-0');

    // Slide 5 - Bridge 2 (Puzzle: Pet Insurance -> Membership)
    addStaticSlide(`
        <style>
            @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes pulse-core {
                0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 50px rgba(251, 191, 36, 0.3); }
                50% { transform: scale(1.05); opacity: 0.9; box-shadow: 0 0 80px rgba(251, 191, 36, 0.6); }
            }
            @keyframes float-label {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        </style>

        <div class="w-full h-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
            <!-- Background Decorations -->
            <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-50 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

            <!-- Headline Area -->
            <div class="text-center z-20 mb-16 relative">
                 <h2 class="text-6xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
                    펫보험이 채워주지 못하는 <span class="text-blue-500 relative inline-block">빈틈을<svg class="absolute w-full h-4 -bottom-1 left-0 text-blue-200" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 12 100 5" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" /></svg></span>
                </h2>
                <h2 class="text-[6rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 tracking-tighter leading-none drop-shadow-sm">
                    안심 보장 솔루션
                </h2>
                <h2 class="text-6xl font-bold text-slate-700 mt-4">이 <span class="underline decoration-4 decoration-orange-300 underline-offset-8">완벽하게</span> 채워드립니다</h2>
            </div>

            <!-- Main Visual: Three Column Layout -->
            <div class="flex items-center justify-center gap-12 z-10">
                
                <!-- Left: Pet Insurance -->
                <div class="w-[280px] flex flex-col items-center gap-4 animate-[float-label_6s_ease-in-out_infinite]">
                     <div class="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center shadow-lg">
                        <i data-lucide="shield" class="w-12 h-12 text-blue-600"></i>
                    </div>
                    <div class="text-center">
                        <p class="text-3xl font-bold text-slate-400 mb-1">큰 수술비는</p>
                        <p class="text-5xl font-black text-blue-600">펫보험</p>
                    </div>
                </div>

                <!-- Center: Circle -->
                <div class="w-[320px] h-[320px] rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 shadow-2xl flex items-center justify-center text-white animate-[pulse-core_3s_ease-in-out_infinite] flex-shrink-0">
                     <div class="text-center">
                        <i data-lucide="check-circle-2" class="w-24 h-24 mx-auto mb-4 text-white drop-shadow-md"></i>
                        <div class="text-5xl font-black tracking-tight drop-shadow-md">빈틈없는<br>보장</div>
                    </div>
                </div>

                <!-- Right: Ansim Solution -->
                <div class="w-[280px] flex flex-col items-center gap-4 animate-[float-label_6s_ease-in-out_infinite_reverse]">
                    <div class="w-24 h-24 rounded-2xl bg-orange-100 flex items-center justify-center shadow-lg">
                        <i data-lucide="heart-handshake" class="w-12 h-12 text-orange-600"></i>
                    </div>
                    <div class="text-center">
                        <p class="text-3xl font-bold text-slate-400 mb-1">매월 병원비/용품은</p>
                        <p class="text-5xl font-black text-orange-600">안심솔루션</p>
                    </div>
                </div>
            </div>
            
            <!-- Bottom Text -->
             <div class="absolute bottom-12 text-slate-400 text-xl font-medium tracking-wide">
                * 펫보험과 안심보장솔루션이 만나 완벽한 반려생활을 만듭니다
            </div>
        </div>
    `, 'p-0');

    // Slide 6-A - White & Silver Membership (Redesigned)
    addStaticSlide(`
        <style>
            @keyframes float-card {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            @keyframes shine {
                0% { background-position: 200% center; }
                100% { background-position: -200% center; }
            }
            @keyframes card-entrance {
                from { opacity: 0; transform: translateY(50px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .card-entrance-1 { animation: card-entrance 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
            .card-entrance-2 { animation: card-entrance 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards; opacity: 0; }
            
            .text-gradient-white {
                background: linear-gradient(to right, #94a3b8, #334155, #94a3b8);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shine 5s linear infinite;
            }
            .text-gradient-silver {
                background: linear-gradient(to right, #3b82f6, #60a5fa, #3b82f6);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shine 5s linear infinite;
            }
        </style>

    <div class="w-full h-full flex flex-col justify-center items-center bg-slate-50 relative overflow-hidden p-8">
        <!-- Background Elements -->
        <div class="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-blue-50/50 to-transparent"></div>
        <div class="absolute -top-20 -left-20 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px] opacity-40"></div>
        <div class="absolute bottom-0 right-0 w-[800px] h-[800px] bg-slate-100 rounded-full blur-[120px] opacity-60"></div>

        <div class="relative z-10 w-full max-w-[1600px] h-[90%] grid grid-cols-2 gap-12">

            <!-- White Tier -->
            <div class="card-entrance-1 relative group animate-[float-card_6s_ease-in-out_infinite]">
                <div class="absolute inset-0 bg-white rounded-[3rem] shadow-2xl border border-slate-100"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 opacity-50 rounded-[3rem]"></div>

                <div class="relative h-full flex flex-col p-12 overflow-hidden rounded-[3rem]">
                    <div class="absolute -right-10 -top-10 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50"></div>

                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <span class="px-6 py-2 bg-slate-100 text-slate-500 rounded-full font-black text-lg tracking-wide uppercase">Essential Plan</span>
                        <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner">
                            <i data-lucide="box" class="w-8 h-8 text-slate-400"></i>
                        </div>
                    </div>

                    <h2 class="text-[7rem] font-black text-slate-800 leading-none mb-2 tracking-tighter" style="font-family: 'Inter', sans-serif;">WHITE</h2>
                    <p class="text-2xl text-slate-400 font-bold mb-10 pl-2">매달 필요한 용품을 집앞까지 배송 🚚</p>

                    <div class="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100 shadow-md">
                        <span class="block text-slate-500 font-bold text-lg mb-2">프리미엄 구독 서비스</span>
                        <div class="text-4xl font-black text-slate-700 leading-tight">
                            매월 <span class="text-slate-900 border-b-4 border-slate-200">5만원 상당</span><br>프리미엄 패키지
                        </div>
                    </div>

                    <ul class="flex-grow space-y-6">
                        <li class="flex items-start gap-5">
                            <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <i data-lucide="check" class="w-6 h-6 text-slate-400"></i>
                            </div>
                            <div>
                                <span class="block text-2xl font-black text-slate-700 mb-1">더주오 시그니처 유기농 사료</span>
                                <span class="text-lg text-slate-400 font-medium">입맛 까다로운 아이도 잘 먹는, 믿을 수 있는 휴먼그레이드</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-5">
                            <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <i data-lucide="check" class="w-6 h-6 text-slate-400"></i>
                            </div>
                            <div>
                                <span class="block text-2xl font-black text-slate-700 mb-1">최고급 배변용품</span>
                                <span class="text-lg text-slate-400 font-medium">강아지용 '응가해주오' / 고양이용 '두부모래'</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-5">
                            <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <i data-lucide="check" class="w-6 h-6 text-slate-400"></i>
                            </div>
                            <div>
                                <span class="block text-2xl font-black text-slate-700 mb-1">프리미엄 수제간식</span>
                                <span class="text-lg text-slate-400 font-medium">첨가물 없는, 당일생산 더주오 수제간식</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Silver Tier -->
            <div class="card-entrance-2 relative group animate-[float-card_6s_ease-in-out_infinite] delay-1000">
                <div class="absolute inset-0 bg-white rounded-[3rem] shadow-2xl shadow-blue-200/50 border border-blue-100"></div>
                <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-white opacity-80 rounded-[3rem]"></div>

                <div class="relative h-full flex flex-col p-12 overflow-hidden rounded-[3rem]">
                    <div class="absolute -right-10 -top-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                    <div class="absolute right-8 top-8 animate-[float-y_3s_ease-in-out_infinite]">
                        <span class="px-5 py-2 bg-blue-600 text-white rounded-full font-black text-sm shadow-lg shadow-blue-300">BEST CHOICE</span>
                    </div>

                    <div class="flex justify-between items-start mb-4 relative z-10 mt-2">
                        <span class="px-6 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-lg tracking-wide uppercase border border-blue-100">Intensive Care</span>
                    </div>

                    <h2 class="text-[7rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 leading-none mb-2 tracking-tighter" style="font-family: 'Inter', sans-serif;">SILVER</h2>
                    <p class="text-2xl text-blue-400 font-bold mb-10 pl-2">우리아이 첫 1년, 집중적인 건강관리</p>

                    <div class="bg-blue-50 rounded-3xl p-8 mb-10 border border-blue-100 relative overflow-hidden shadow-sm">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-2xl opacity-20"></div>
                        <span class="block text-blue-500 font-bold text-lg mb-2">지원 혜택 환산 가치</span>
                        <div class="flex items-baseline gap-2">
                            <span class="text-5xl font-black text-blue-600 tracking-tight">약 200만원</span>
                            <span class="text-2xl font-bold text-blue-400">상당</span>
                        </div>
                    </div>

                    <ul class="flex-grow space-y-6">
                        <li class="flex items-center gap-5">
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                                <i data-lucide="package" class="w-6 h-6"></i>
                            </div>
                            <div class="flex-1">
                                <span class="block text-2xl font-black text-slate-700">White 혜택 포함</span>
                                <span class="text-lg text-slate-400 font-medium">(프리미엄 구독 서비스)</span>
                            </div>
                        </li>
                        <li class="flex items-center gap-5">
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                                <i data-lucide="syringe" class="w-6 h-6"></i>
                            </div>
                            <div class="flex-1">
                                <span class="block text-2xl font-black text-slate-700">필수 기초 접종 (1~6차)</span>
                                <span class="text-lg text-slate-400 font-medium">건강한 성장을 위한 필수 예방접종 지원</span>
                            </div>
                        </li>
                        <li class="flex items-center gap-5">
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                                <i data-lucide="search" class="w-6 h-6"></i>
                            </div>
                            <div class="flex-1">
                                <span class="block text-2xl font-black text-slate-700">항체가 확인 검사</span>
                                <span class="text-lg text-slate-400 font-medium">접종 완료 후 항체 생성 여부 확인</span>
                            </div>
                        </li>
                        <li class="flex items-center gap-5">
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                                <i data-lucide="scissors" class="w-6 h-6"></i>
                            </div>
                            <div class="flex-1">
                                <span class="block text-2xl font-black text-slate-700">중성화 수술 + 동물등록(내장형)</span>
                                <span class="text-lg text-slate-400 font-medium">반려동물 필수 수술 및 시술 지원</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`, 'p-0');

    const isShelterMode = config.shelterMode;
    
    const goldStyles = isShelterMode ? {
        wrapper: 'animate-[float-card_6s_ease-in-out_infinite]',
        bg: 'bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]',
        border: 'border-2 border-amber-200',
        shadow: 'card-gold-shadow',
        badge: `<span class="px-6 py-2 bg-amber-100 text-amber-800 rounded-full font-black text-lg tracking-wide border border-amber-200 shadow-sm flex items-center gap-2">
                    <i data-lucide="heart" class="w-4 h-4 fill-amber-600 text-amber-600"></i> 보호소 입양 가족 전용
                </span>`,
        title: 'text-amber-900',
        subtitle: 'text-amber-700',
        priceBox: 'bg-white/80 border-amber-200',
        priceText: 'text-amber-600',
        iconBg: 'bg-gradient-to-br from-amber-100 to-amber-200',
        iconColor: 'text-amber-700',
        itemTitle: 'text-amber-900',
        itemDesc: 'text-amber-800/80',
        opacity: 'opacity-100'
    } : {
        wrapper: '',
        bg: 'bg-slate-100',
        border: 'border border-slate-300',
        shadow: 'shadow-lg',
        badge: `<span class="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-full font-bold text-sm flex items-center gap-1">
                    <i data-lucide="home" class="w-3 h-3"></i> 보호소 전용 상품
                </span>`,
        title: 'text-slate-600',
        subtitle: 'text-slate-500',
        priceBox: 'bg-slate-50 border-slate-200',
        priceText: 'text-slate-500',
        iconBg: 'bg-slate-200',
        iconColor: 'text-slate-500',
        itemTitle: 'text-slate-700',
        itemDesc: 'text-slate-500',
        opacity: 'opacity-70'
    };
    
    addStaticSlide(`
        <style>
            @keyframes glimmer {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            .text-gold-gradient {
                background: linear-gradient(to right, #b45309, #f59e0b, #b45309);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shine 4s linear infinite;
            }
            .text-vip-gradient {
                background: linear-gradient(to right, #fde68a, #d97706, #fde68a);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shine 3s linear infinite;
            }
            .card-gold-shadow { box-shadow: 0 25px 50px -12px rgba(245, 158, 11, 0.25); }
            .card-vip-shadow { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
            @keyframes float-card {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        </style>

    <div class="w-full h-full flex flex-col justify-center items-center bg-[#0f172a] relative overflow-hidden p-8">
        <!-- Premium Background -->
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black"></div>
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]"></div>

        <div class="relative z-10 w-full max-w-[1600px] h-[90%] grid grid-cols-2 gap-12">

            <!-- Gold Tier -->
            <div class="card-entrance-1 relative group ${goldStyles.wrapper} ${goldStyles.opacity}">
                <div class="absolute inset-0 ${goldStyles.bg} rounded-[3rem] ${goldStyles.shadow} ${goldStyles.border}"></div>

                <div class="relative h-full flex flex-col p-12 overflow-hidden rounded-[3rem]">
                    <div class="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-amber-200 to-yellow-100 rounded-full blur-3xl opacity-40"></div>

                    <div class="flex justify-between items-start mb-6 relative z-10">
                        ${goldStyles.badge}
                    </div>

                    <h2 class="text-[7rem] font-black ${goldStyles.title} leading-none mb-2 tracking-tighter drop-shadow-sm" style="font-family: 'Inter', sans-serif;">GOLD</h2>
                    <p class="text-2xl ${goldStyles.subtitle} font-bold mb-10 pl-2">${isShelterMode ? '초기 의료부터 일상케어, 질병까지' : '보호소에서 입양 시 가입 가능합니다'}</p>

                    <div class="${goldStyles.priceBox} backdrop-blur-sm rounded-3xl p-8 mb-10 border shadow-xl">
                        <span class="block ${goldStyles.subtitle} font-bold text-lg mb-2">총 혜택 가치</span>
                        <div class="flex items-baseline gap-2">
                            <span class="text-6xl font-black ${goldStyles.priceText} tracking-tight">2,225,000</span>
                            <span class="text-3xl font-bold ${goldStyles.subtitle}">원</span>
                        </div>
                    </div>

                    <ul class="flex-grow space-y-5">
                        <li class="flex items-start gap-5 group/item">
                            <div class="w-12 h-12 rounded-full ${goldStyles.iconBg} flex items-center justify-center shrink-0 ${goldStyles.iconColor} shadow-inner">
                                <i data-lucide="package" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <span class="block text-2xl font-black ${goldStyles.itemTitle} mb-1">White 혜택 포함</span>
                                <span class="text-lg ${goldStyles.itemDesc} font-medium">(프리미엄 구독 서비스)</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-5 group/item">
                            <div class="w-12 h-12 rounded-full ${goldStyles.iconBg} flex items-center justify-center shrink-0 ${goldStyles.iconColor} shadow-inner">
                                <i data-lucide="activity" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <span class="block text-2xl font-black ${goldStyles.itemTitle} mb-1">종합 건강검진</span>
                                <span class="text-lg ${goldStyles.itemDesc} font-medium">60~70만원 상당 (기본, 혈액, 영상)</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-5 group/item">
                            <div class="w-12 h-12 rounded-full ${goldStyles.iconBg} flex items-center justify-center shrink-0 ${goldStyles.iconColor} shadow-inner">
                                <i data-lucide="syringe" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <span class="block text-2xl font-black ${goldStyles.itemTitle} mb-1">필수 예방 의료</span>
                                <span class="text-lg ${goldStyles.itemDesc} font-medium">종합백신, 광견병, 심장사상충(연간)</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-5 group/item">
                            <div class="w-12 h-12 rounded-full ${goldStyles.iconBg} flex items-center justify-center shrink-0 ${goldStyles.iconColor} shadow-inner">
                                <i data-lucide="coins" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <span class="block text-2xl font-black ${goldStyles.itemTitle} mb-1">의료비 지원</span>
                                <span class="text-lg ${goldStyles.itemDesc} font-medium">연간 50만원 한도 지원</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- VIP Tier -->
            <div class="card-entrance-2 relative group animate-[float-card_6s_ease-in-out_infinite] delay-1000">
                <div class="absolute inset-0 bg-[#1e293b] rounded-[3rem] card-vip-shadow border border-slate-700"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-transparent rounded-[3rem]"></div>

                <div class="relative h-full flex flex-col p-12 overflow-hidden rounded-[3rem]">
                    <div class="absolute -right-20 -top-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[80px]"></div>
                    <div class="absolute -left-10 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px]"></div>

                    <div class="flex justify-between items-start mb-6 relative z-10">
                        <span class="px-6 py-2 bg-gradient-to-r from-purple-900 to-slate-900 text-purple-200 rounded-full font-black text-lg tracking-wide border border-purple-700/50 shadow-lg shadow-purple-900/50 flex items-center gap-2">
                            <i data-lucide="crown" class="w-4 h-4 fill-amber-400 text-amber-400"></i> Premium Care
                        </span>
                    </div>

                    <h2 class="text-[7rem] font-black text-vip-gradient leading-none mb-2 tracking-tighter drop-shadow-lg" style="font-family: 'Inter', sans-serif;">VIP</h2>
                    <p class="text-2xl text-slate-400 font-bold mb-10 pl-2">단 하나도 놓치지 않는 프리미엄 케어</p>

                    <div class="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 mb-10 border border-slate-700 relative overflow-hidden">
                        <div class="absolute top-0 w-full h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-amber-400 animate-[shine_3s_linear_infinite]"></div>
                        <span class="block text-slate-400 font-bold text-lg mb-2">토탈 케어 가치 환산</span>
                        <div class="text-3xl font-black text-white leading-tight">
                            모든 혜택을 <span class="text-amber-400 border-b-2 border-amber-400/30">빈틈없이</span> 담았습니다
                        </div>
                    </div>

                    <ul class="flex-grow grid grid-cols-2 gap-x-4 gap-y-6 content-start">
                        <li class="flex items-start gap-4 group/item">
                            <i data-lucide="crown" class="w-8 h-8 text-amber-400 mt-1 shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"></i>
                            <div class="flex flex-col">
                                <span class="text-2xl font-bold text-amber-100">White 혜택 포함</span>
                                <span class="text-lg font-medium text-purple-200/70">(프리미엄 구독 서비스)</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-4 group/item">
                            <i data-lucide="scissors" class="w-8 h-8 text-amber-500/80 mt-1 shrink-0 group-hover/item:text-amber-400 transition-colors"></i>
                            <div class="flex flex-col">
                                <span class="text-2xl font-bold text-amber-100">중성화 수술 지원</span>
                                <span class="text-lg font-medium text-purple-200/70">(수술비 및 입원비 포함)</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-4 group/item">
                            <i data-lucide="activity" class="w-8 h-8 text-amber-500/80 mt-1 shrink-0 group-hover/item:text-amber-400 transition-colors"></i>
                            <div class="flex flex-col">
                                <span class="text-2xl font-bold text-amber-100">종합 건강검진 + 키트</span>
                                <span class="text-lg font-medium text-purple-200/70">(정밀 혈액, 초음파, X-ray)</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-4 group/item">
                            <i data-lucide="syringe" class="w-8 h-8 text-amber-500/80 mt-1 shrink-0 group-hover/item:text-amber-400 transition-colors"></i>
                            <div class="flex flex-col">
                                <span class="text-2xl font-bold text-amber-100">필수 예방 의료</span>
                                <span class="text-lg font-medium text-purple-200/70">(종합백신, 광견병, 심장사상충)</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-4 group/item">
                            <i data-lucide="tag" class="w-8 h-8 text-amber-500/80 mt-1 shrink-0 group-hover/item:text-amber-400 transition-colors"></i>
                            <div class="flex flex-col">
                                <span class="text-2xl font-bold text-amber-100">동물등록(내장형)</span>
                                <span class="text-lg font-medium text-purple-200/70">(반려동물 등록비용 전액 지원)</span>
                            </div>
                        </li>
                        <li class="flex items-start gap-4 group/item">
                            <i data-lucide="graduation-cap" class="w-8 h-8 text-amber-500/80 mt-1 shrink-0 group-hover/item:text-amber-400 transition-colors"></i>
                            <div class="flex flex-col">
                                <span class="text-2xl font-bold text-amber-100">전문가 방문 훈련</span>
                                <span class="text-lg font-medium text-purple-200/70">(1:1 맞춤형 행동 교정)</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`, 'p-0');

    /* Slide 7 removed as requested */

    // Slide 8 - Closing / CTA
    // Slide 8 - Closing / CTA (Premium Dark Redesign)
    addStaticSlide(`
        <div class="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-slate-900">
            <!--Dynamic Background-->
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
            <div class="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-orange-500/10 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite]"></div>
            <div class="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-purple-600/10 rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite] delay-1000"></div>
            
            <!--Rotating Light Effect-->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_100deg,rgba(255,255,255,0.03)_180deg,transparent_260deg)] animate-[spin_60s_linear_infinite]"></div>

            <!--Content -->
    <div class="relative z-10 text-center w-full max-w-7xl flex flex-col items-center justify-center h-full gap-16">

        <!-- Main Message -->
        <div class="space-y-2 animate-[float-y_5s_ease-in-out_infinite]">
            <p class="text-2xl font-bold text-orange-200/60 tracking-[0.5em] uppercase mb-8">Premium Membership</p>
            <h2 class="text-7xl md:text-8xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                <span class="block mb-2">입양의 <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">행복</span>을</span>
                <span class="inline-flex items-center gap-4">
                    <span class="text-white relative">
                        주오
                        <span class="absolute -bottom-2 left-0 w-full h-2 bg-orange-500 rounded-full opacity-60 blur-sm"></span>
                    </span>가 지켜드립니다
                </span>
            </h2>
        </div>

        <!-- CTA Card - Exquisite Glassmorphism -->
        <div class="relative w-full max-w-4xl group">
            <!-- Glow behind card -->
            <div class="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-[2.5rem] blur opacity-30 animate-pulse"></div>

            <div class="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center gap-8 overflow-hidden">

                <!-- Icon -->
                <div class="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl relative animate-[float-card_4s_ease-in-out_infinite_reverse]">
                    <div class="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
                    <i data-lucide="message-circle" class="w-10 h-10 text-orange-400 relative z-10"></i>
                </div>

                <!-- CTA Text -->
                <div class="space-y-2">
                    <h3 class="text-5xl font-black text-white tracking-tight">
                        지금 <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 decoration-wavy decoration-orange-500/30">매니저</span>에게 문의하세요
                    </h3>
                    <p class="text-2xl text-slate-400 font-medium">
                        전문 매니저가 우리 아이를 위한 <span class="text-slate-200 font-bold">최적의 플랜</span>을 설계해 드립니다.
                    </p>
                </div>

                <!-- Shine Animation -->
                <div class="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] animate-[shine_4s_infinite]"></div>
            </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center gap-3 text-slate-500 text-lg bg-slate-900/80 px-8 py-3 rounded-full border border-white/5 backdrop-blur-sm mt-8">
            <i data-lucide="info" class="w-5 h-5 opacity-70"></i>
            <span>본 멤버십 서비스는 1년 의무 약정 상품입니다.</span>
        </div>
    </div>
        </div>`, 'p-0');


    // Re-run icons
    lucide.createIcons();
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
}

function getStatusColor(status) {
    if (status.includes('가족 찾는 중')) return 'bg-juo-orange';
    if (status.includes('가족 맞이 준비중')) return 'bg-blue-500';
    if (status.includes('행복한 집으로')) return 'bg-emerald-500';
    if (status.includes('가능')) return 'bg-juo-orange';
    if (status.includes('대기') || status.includes('예약')) return 'bg-blue-500';
    return 'bg-green-600';
}

// Keyboard controls for slideshow
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

// Export functions to window for inline handlers
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
