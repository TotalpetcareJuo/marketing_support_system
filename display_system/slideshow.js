// ------------------------------------
// Slideshow / Presentation Module
// ------------------------------------

function startSlideshow() {
    generatePresentationSlides();
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

    // Slide 1
    container.innerHTML += `
        <div id="slide-0" class="slide active flex-col items-center justify-center text-center p-10 bg-white">
            <div class="mb-8">
                <i data-lucide="heart" class="w-20 h-20 text-juo-orange mx-auto mb-4"></i>
                <h1 class="text-6xl font-black mb-6 leading-tight">당신과 아이의 행복한 20년</h1>
                <p class="text-3xl text-gray-600 font-light">주오컴퍼니가 시작부터 끝까지 함꺼합니다.</p>
            </div>
            <div class="flex gap-8 mt-12">
                <div class="flex flex-col items-center"><div class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2"><i data-lucide="home" class="text-juo-orange"></i></div><span class="text-lg font-bold">안심입양</span></div>
                <div class="w-12 h-px bg-gray-300 self-center mt-[-20px]"></div>
                <div class="flex flex-col items-center"><div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2"><i data-lucide="stethoscope" class="text-blue-600"></i></div><span class="text-lg font-bold">건강관리</span></div>
                <div class="w-12 h-px bg-gray-300 self-center mt-[-20px]"></div>
                <div class="flex flex-col items-center"><div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2"><i data-lucide="shopping-bag" class="text-green-600"></i></div><span class="text-lg font-bold">정기구독</span></div>
                <div class="w-12 h-px bg-gray-300 self-center mt-[-20px]"></div>
                <div class="flex flex-col items-center"><div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2"><i data-lucide="sunset" class="text-purple-600"></i></div><span class="text-lg font-bold">장례서비스</span></div>
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
            @keyframes puzzle-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            @keyframes puzzle-connect-left {
                from { transform: translateX(-40px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes puzzle-connect-right {
                from { transform: translateX(40px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .puzzle-piece {
                position: relative;
                width: 340px;
                height: 380px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                padding-top: 3rem;
                padding-bottom: 2rem;
                border-radius: 2.5rem;
                box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.25);
                z-index: 10;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-top: 1px solid rgba(255, 255, 255, 0.6);
            }
            
            .puzzle-knob-right::after {
                content: '';
                position: absolute;
                top: 50%;
                right: -45px;
                transform: translateY(-50%);
                width: 90px;
                height: 90px;
                background: #2b70ed;
                border-radius: 50%;
                z-index: 20;
                box-shadow: 5px 0 15px rgba(0,0,0,0.05);
            }

            .puzzle-socket-left {
                padding-left: 2rem;
            }
            
            .puzzle-animate-left { animation: puzzle-connect-left 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both 0.3s, puzzle-float 6s ease-in-out infinite 1.5s; }
            .puzzle-animate-right { animation: puzzle-connect-right 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both 0.3s, puzzle-float 6s ease-in-out infinite 1.5s; animation-delay: 0.3s, 1.7s; }
            
            .icon-box {
                width: 7rem;
                height: 7rem;
                background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%);
                border: 1px solid rgba(255,255,255,0.4);
                border-radius: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: auto;
                margin-bottom: 1.5rem;
                backdrop-filter: blur(8px);
                box-shadow: inset 0 0 15px rgba(255,255,255,0.1);
            }
            @keyframes arrow-fade-in-final {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
        </style>

        <div class="w-full h-full flex flex-col items-center justify-center bg-[#f0f7ff] relative overflow-hidden">
            <!-- Decorations -->
            <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3"></div>
            
            <!-- Header -->
            <div class="absolute top-16 flex flex-col items-center z-20">
                <img src="display_system/LOGO.png" alt="TOTAL PETCARE MEMBERSHIP SERVICE" class="h-28 w-auto object-contain drop-shadow-sm opacity-90" />
            </div>

            <!-- Headline -->
            <div class="text-center z-20 mb-14 mt-8">
                <h2 class="text-6xl font-extrabold text-slate-700 mb-2 tracking-tight">
                    펫보험이 채워주지 못하는
                </h2>
                <h2 class="text-[7rem] font-black text-[#2563eb] tracking-tighter leading-none filter drop-shadow-sm relative inline-block">
                    <span class="relative">
                        빈틈
                         <svg class="absolute w-[110%] h-6 -bottom-2 -left-[5%] text-blue-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" /></svg>
                    </span>
                    <span class="text-6xl font-bold text-slate-700 tracking-tight ml-4 align-middle">을 채워드립니다.</span>
                </h2>
            </div>

            <div class="relative flex items-center justify-center z-10 scale-110 mt-24">
                <!-- Central Glow/Burst (z-0) -->
                <div class="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                     <div class="w-[100px] h-[500px] bg-white blur-[60px] opacity-60 mix-blend-overlay"></div>
                     <div class="w-[300px] h-[300px] bg-blue-400 blur-[100px] opacity-40 animate-pulse"></div>
                     <!-- Sparkles -->
                     <div class="absolute w-2 h-2 bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_white]"></div>
                </div>

                <!-- Swoosh Arrows (z-0) -->
                <!-- Top Arrow (Right Top -> Left Top) -->
                <svg class="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] z-0 pointer-events-none drop-shadow-[0_0_5px_rgba(59,130,246,0.2)]"
                     style="animation: arrow-fade-in-final 1s ease-out both 1.2s;">
                    <path d="M 580 80 Q 350 -50 120 80" fill="none" stroke="url(#grad_swoosh_top)" stroke-width="14" stroke-linecap="round" />
                    <!-- Arrowhead (Larger Sharp, Rotated 150deg) -->
                    <path d="M 120 80 L 85 65 L 95 80 L 85 95 Z" fill="#3b82f6" transform="rotate(150 120 80)" />
                    <defs>
                        <linearGradient id="grad_swoosh_top" x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.1" />
                            <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:0.6" />
                            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1" />
                        </linearGradient>
                    </defs>
                </svg>

                <!-- Bottom Arrow (Left Bottom -> Right Bottom) -->
                <svg class="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] z-0 pointer-events-none drop-shadow-[0_0_5px_rgba(59,130,246,0.2)]"
                     style="animation: arrow-fade-in-final 1s ease-out both 1.4s;">
                     <path d="M 120 270 Q 350 400 580 270" fill="none" stroke="url(#grad_swoosh_bottom)" stroke-width="14" stroke-linecap="round" />
                     <!-- Arrowhead (Larger Sharp, Rotated -30deg) -->
                     <path d="M 580 270 L 545 255 L 555 270 L 545 285 Z" fill="#3b82f6" transform="rotate(-30 580 270)" />
                     <defs>
                        <linearGradient id="grad_swoosh_bottom" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.1" />
                            <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:0.6" />
                            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1" />
                        </linearGradient>
                    </defs>
                </svg>

                <div class="puzzle-piece puzzle-animate-left relative w-[360px] h-[360px] flex flex-col items-center justify-center text-white z-10"
                     style="
                        background: linear-gradient(145deg, #3b82f6, #1d4ed8);
                        border-radius: 2.5rem;
                        mask-image: radial-gradient(circle 45px at 0% 50%, transparent 99%, white 100%);
                        -webkit-mask-image: radial-gradient(circle 45px at 0% 50%, transparent 99%, white 100%);
                        margin-right: -4px;
                        box-shadow: 0 20px 40px rgba(37, 99, 235, 0.4);
                     ">
                    <div class="absolute -top-[45px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] rounded-full z-10"
                         style="background: linear-gradient(to bottom, #3b82f6, #3b82f6);"></div>
                         
                    <div class="absolute -right-[45px] top-1/2 -translate-y-1/2 w-[90px] h-[90px] rounded-full z-20 shadow-lg"
                         style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);"></div>

                    <div class="relative z-30 flex flex-col items-center pt-8">
                        <div class="text-2xl font-bold text-center leading-snug opacity-95 mb-6 drop-shadow-md">
                            큰 수술비는<br>
                            <span class="text-yellow-300">펫보험</span>으로!
                        </div>
                        
                        <div class="mb-6 relative">
                            <i data-lucide="shield" class="w-28 h-28 text-white fill-white/20"></i>
                            <i data-lucide="paw-print" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 text-white fill-white"></i>
                        </div>
                        
                        <div class="text-5xl font-black tracking-tight drop-shadow-lg">펫보험</div>
                    </div>
                </div>
                <div class="puzzle-piece puzzle-animate-right relative w-[360px] h-[360px] flex flex-col items-center justify-center text-white z-10"
                     style="
                        background: linear-gradient(145deg, #60a5fa, #3b82f6);
                        border-radius: 2.5rem;
                        mask-image: radial-gradient(circle 45px at 0% 50%, transparent 99%, white 100%);
                        -webkit-mask-image: radial-gradient(circle 45px at 0% 50%, transparent 99%, white 100%);
                        margin-left: -50px; /* Overlap to fit the knob into the socket mask */
                        box-shadow: 0 20px 40px rgba(37, 99, 235, 0.4);
                     ">
                    <div class="absolute -bottom-[45px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] rounded-full z-10"
                         style="background: linear-gradient(to top, #3b82f6, #60a5fa);"></div>

                    <div class="relative z-30 flex flex-col items-center pt-8 pl-10">
                        <div class="text-2xl font-bold text-center leading-snug opacity-95 mb-6 drop-shadow-md">
                            매월 드는 사료/병원비는<br>
                            <span class="text-white border-b-2 border-white/50">안심보장솔루션</span>으로!
                        </div>
                        
                        <div class="mb-6">
                            <i data-lucide="heart" class="w-28 h-28 text-white fill-white"></i>
                        </div>
                        
                        <div class="text-4xl font-black tracking-tight drop-shadow-lg">안심보장솔루션</div>
                    </div>
                </div>
            </div>
            
        </div>
    `, 'p-0');

    // Slide 6 - Membership
    addStaticSlide(`
        <h2 class="text-center text-5xl font-black mb-12 uppercase tracking-tight">주오 멤버십 <span class="text-juo-orange">3대 라인업</span></h2>
            <div class="grid grid-cols-3 gap-8">
                <div class="bg-white p-8 rounded-3xl card-shadow border-t-8 border-gray-300">
                    <h3 class="text-3xl font-black mb-2 text-gray-500">White</h3>
                    <p class="text-slate-400 mb-6 font-bold">실속형 관리</p>
                    <div class="text-4xl font-black mb-8">50,000<span class="text-xl font-normal">원/월</span></div>
                    <ul class="space-y-4 mb-8 text-slate-600">
                        <li class="flex items-center gap-2"><i data-lucide="package" class="w-5 h-5 text-gray-400"></i> 사료+간식 정기배송</li>
                        <li class="flex items-center gap-2"><i data-lucide="tag" class="w-5 h-5 text-gray-400"></i> 쇼핑몰 상시 20% 할인</li>
                        <li class="flex items-center gap-2"><i data-lucide="message-circle" class="w-5 h-5 text-gray-400"></i> AI 건강 상담 지원</li>
                    </ul>
                </div>
                <div class="bg-white p-8 rounded-3xl card-shadow border-8 border-juo-orange scale-105 relative z-10">
                    <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-juo-orange text-white px-6 py-2 rounded-full font-black">매장 추천</div>
                    <h3 class="text-3xl font-black mb-2 text-juo-orange">Silver</h3>
                    <p class="text-slate-400 mb-6 font-bold">육아 집중 케어</p>
                    <div class="text-4xl font-black mb-8 text-juo-orange">100,000<span class="text-xl font-normal text-slate-800">원/월</span></div>
                    <ul class="space-y-4 mb-8 text-slate-800 font-bold">
                        <li class="flex items-center gap-2"><i data-lucide="syringe" class="w-6 h-6 text-juo-orange"></i> 초기 접종 + 중성화 0원</li>
                        <li class="flex items-center gap-2"><i data-lucide="package" class="w-6 h-6 text-juo-orange"></i> 사료+용품 매달 배송</li>
                        <li class="flex items-center gap-2"><i data-lucide="check" class="w-6 h-6 text-juo-orange"></i> 2년차 건강검진 지원</li>
                    </ul>
                </div>
                <div class="bg-white p-8 rounded-3xl card-shadow border-t-8 border-yellow-500">
                    <h3 class="text-3xl font-black mb-2 text-yellow-600">VIP</h3>
                    <p class="text-slate-400 mb-6 font-bold">프리미엄 올인원</p>
                    <div class="text-4xl font-black mb-8">160,000<span class="text-xl font-normal">원/월</span></div>
                    <ul class="space-y-4 mb-8 text-slate-600 font-bold">
                        <li class="flex items-center gap-2"><i data-lucide="star" class="w-5 h-5 text-yellow-500"></i> Silver 모든 혜택 포함</li>
                        <li class="flex items-center gap-2"><i data-lucide="graduation-cap" class="w-5 h-5 text-yellow-500"></i> 전문가 방문 교육 1회</li>
                        <li class="flex items-center gap-2"><i data-lucide="shopping-cart" class="w-5 h-5 text-yellow-500"></i> 30% 할인 + 무료배송</li>
                    </ul>
                </div>
            </div>`, 'p-16 bg-slate-50 justify-center');

    // Slide 7 - Insurance vs Membership Comparison
    addStaticSlide(`
        <h2 class="text-center text-5xl font-black mb-16 italic underline decoration-juo-orange underline-offset-8">보험인가요? 아니요, <span class="text-juo-orange">관리</span>입니다.</h2>
    <div class="flex gap-12 flex-grow">
        <div class="flex-1 bg-slate-800 p-10 rounded-3xl relative overflow-hidden">
            <div class="absolute -right-10 -top-10 opacity-10"><i data-lucide="gift" class="w-48 h-48 text-white"></i></div>
            <h3 class="text-3xl font-black mb-8 text-juo-orange flex items-center gap-3"><i data-lucide="smile"></i> 주오 멤버십 (일상)</h3>
            <div class="space-y-8">
                <div class="flex gap-4">
                    <div class="w-12 h-12 bg-juo-orange/20 rounded-xl flex items-center justify-center shrink-0"><i data-lucide="shopping-basket" class="text-juo-orange"></i></div>
                    <div><h4 class="text-xl font-bold">사료/패드비 0원</h4><p class="text-slate-400">보험에서 안 해주는 생활비 100% 케어</p></div>
                </div>
                <div class="flex gap-4">
                    <div class="w-12 h-12 bg-juo-orange/20 rounded-xl flex items-center justify-center shrink-0"><i data-lucide="syringe" class="text-juo-orange"></i></div>
                    <div><h4 class="text-xl font-bold">기초 접종/중성화 지원</h4><p class="text-slate-400">보험 면책 사항인 예방 의학 전액 지원</p></div>
                </div>
            </div>
        </div>
        <div class="self-center"><i data-lucide="plus" class="w-12 h-12 text-slate-600"></i></div>
        <div class="flex-1 border-2 border-slate-700 p-10 rounded-3xl relative overflow-hidden">
            <div class="absolute -right-10 -top-10 opacity-10"><i data-lucide="shield" class="w-48 h-48 text-white"></i></div>
            <h3 class="text-3xl font-black mb-8 text-blue-400 flex items-center gap-3"><i data-lucide="activity"></i> 펫보험 (사고/질병)</h3>
            <div class="space-y-8">
                <div class="flex gap-4">
                    <div class="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center shrink-0"><i data-lucide="alert-triangle" class="text-blue-400"></i></div>
                    <div><h4 class="text-xl font-bold">갑작스러운 고액 수술</h4><p class="text-slate-400">골절, 이물 섭취 등 예상치 못한 목돈 대비</p></div>
                </div>
                <div class="flex gap-4">
                    <div class="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center shrink-0"><i data-lucide="hospital" class="text-blue-400"></i></div>
                    <div><h4 class="text-xl font-bold">만성 질환 보장</h4><p class="text-slate-400">노령기 피부병, 신장병 등 지속적 병원비</p></div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-12 text-center text-2xl font-bold text-slate-400 italic">"일상은 <span class="text-juo-orange">멤버십</span>으로, 만약은 <span class="text-blue-400">보험</span>으로 완벽하게"</div>
    `, 'p-16 bg-slate-900 text-white justify-center');

    // Slide 8 - Closing / CTA
    addStaticSlide(`
        <div class="flex gap-20 items-center">
        <div class="text-left flex-1">
            <h2 class="text-6xl font-black mb-8 leading-tight">입양의 행복을<br><span class="text-juo-orange">주오</span>가 지켜드립니다.</h2>
            <div class="space-y-6 mb-12">
                <div class="flex items-center gap-4 text-2xl"><i data-lucide="phone-call" class="text-juo-orange"></i> 지금 매니저에게 <strong>Silver 등급</strong>을 문의하세요</div>
                <div class="flex items-center gap-4 text-2xl"><i data-lucide="qr-code" class="text-juo-orange"></i> QR 스캔으로 <strong>내 아이 건강수첩</strong> 열기</div>
            </div>
            <p class="text-slate-400 text-lg">* 본 멤버십 서비스는 1년 의무 약정 상품입니다.</p>
        </div>
        <div class="w-80 h-80 bg-slate-100 rounded-3xl flex items-center justify-center card-shadow border-4 border-slate-50 relative">
            <i data-lucide="qr-code" class="w-48 h-48 text-slate-800"></i>
            <div class="absolute -bottom-4 bg-juo-orange text-white px-6 py-2 rounded-full font-bold">SCAN ME</div>
        </div>
    </div>`, 'items-center justify-center p-16 bg-white');


    // Re-run icons
    lucide.createIcons();
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
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
    if (status.includes('꽃단장 중')) return 'bg-blue-500';
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
