lucide.createIcons();

// Init
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('setting-interval').value = config.interval;
    document.getElementById('intro-title').value = config.intro.title;
    document.getElementById('intro-subtitle').value = config.intro.subtitle;
    renderLastSaved();
    renderNoticeEditor();
    renderAdminSlides();
});

function renderLastSaved() {
    const el = document.getElementById('last-saved-time');
    if (config.lastSaved) {
        el.textContent = `마지막 저장: ${config.lastSaved}`;
        el.classList.add('text-slate-600');
        el.classList.remove('text-slate-400');
    } else {
        el.textContent = '저장 기록 없음';
    }
}

// ------------------------------------
// Editor Logic (moved to display_system/editor.js)
// ------------------------------------
// Functions moved: savedRange, renderNoticeEditor, updateNoticeEditorVisibility,
// toggleNotice, updateNotice, formatText, setFontSize, setTextColor, setLineHeight,
// setLetterSpacing, handlePaste, previewNotice, handlePreviewEscape, closePreview
// ------------------------------------

function saveSettings() {
    config.interval = parseInt(document.getElementById('setting-interval').value) || 8;

    // Update Timestamp
    const now = new Date();
    config.lastSaved = now.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Update LocalStorage (using v3 key)
    localStorage.setItem('juoStoreDisplayConfig_v3', JSON.stringify(config));

    // Visual Feedback
    renderLastSaved();
    const btn = document.querySelector('button[onclick="saveSettings()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="check"></i> 저장됨';
    btn.classList.add('bg-green-600');
    lucide.createIcons();
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-600');
        lucide.createIcons();
    }, 1000);
}


// ------------------------------------
// Preview Logic
// ------------------------------------
// previewNotice, handlePreviewEscape, closePreview moved to display_system/editor.js

function previewSlide(slideId) {
    const slide = config.slides.find(s => s.id === slideId);
    if (!slide) return;

    // Fullscreen Request
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((e) => { });
    }

    const container = document.getElementById('preview-content');

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
                        <span class="text-4xl font-bold text-slate-400 pb-2">${pet.gender}</span>
                    </div>
                    <p class="text-3xl font-medium text-slate-500 flex items-center gap-3">
                        <i data-lucide="cake" class="w-8 h-8 text-juo-orange"></i> 출생일: ${pet.birth || '미정'}
                    </p>
                </div>
                <div class="border-t border-slate-200 pt-10">
                    <h4 class="text-2xl font-black text-slate-700 mb-6 flex items-center gap-3"><i data-lucide="clipboard-check" class="w-8 h-8 text-green-500"></i> 건강상태 체크</h4>
                    <ul class="space-y-4">${renderChecklist(pet.checklist || [], true)}</ul>
                </div>
            </div>
        </div>`;

    const createStandardCard = (pet) => `
        <div class="bg-white rounded-[3rem] overflow-hidden card-shadow flex flex-col border border-slate-200 h-full">
            <div class="h-[55%] bg-slate-200 relative bg-cover bg-center" style="background-image: url(${pet.image})">
                ${!pet.image ? '<div class="absolute inset-0 flex items-center justify-center text-slate-400 font-bold">사진 없음</div>' : ''}
                <div class="absolute bottom-6 left-6 px-8 py-4 rounded-full text-3xl font-black text-white ${getStatusColor(pet.status)} shadow-xl ring-4 ring-white/30 tracking-wide">${pet.status}</div>
            </div>
            <div class="h-[45%] p-8 flex flex-col justify-between">
                <div>
                    <h3 class="text-4xl font-black mb-2 text-slate-800">${pet.breed}</h3>
                    <div class="flex items-center gap-3 text-xl text-slate-500 mb-6 font-medium">
                        <span>${pet.gender}</span>
                        <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>${pet.birth} 출생</span>
                    </div>
                    <ul class="space-y-3">${renderChecklist(pet.checklist || [], false)}</ul>
                </div>
            </div>
        </div>`;

    const pet1Visible = !slide.pet1.hidden && slide.pet1.breed;
    const pet2Visible = !slide.pet2.hidden && slide.pet2.breed;

    let content = '';
    if (pet1Visible && pet2Visible) {
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
    } else if (pet1Visible) {
        content = `
            <div class="w-full flex flex-col h-full bg-slate-50">
                <div class="flex justify-between items-end px-20 pt-20 pb-6 shrink-0">
                    <h2 class="text-5xl font-black text-slate-800 uppercase tracking-tighter">${config.intro.title} <span class="text-juo-orange ml-4">${config.intro.subtitle}</span></h2>
                    <p class="text-xl text-slate-500 italic">Today's Featured Pet</p>
                </div>
                <div class="flex-grow">${createHeroCard(slide.pet1)}</div>
            </div>`;
    } else if (pet2Visible) {
        content = `
            <div class="w-full flex flex-col h-full bg-slate-50">
                <div class="flex justify-between items-end px-20 pt-20 pb-6 shrink-0">
                    <h2 class="text-5xl font-black text-slate-800 uppercase tracking-tighter">${config.intro.title} <span class="text-juo-orange ml-4">${config.intro.subtitle}</span></h2>
                    <p class="text-xl text-slate-500 italic">Today's Featured Pet</p>
                </div>
                <div class="flex-grow">${createHeroCard(slide.pet2)}</div>
            </div>`;
    } else {
        content = '<div class="flex items-center justify-center w-full h-full text-slate-400 text-2xl">표시할 펫 정보가 없습니다.</div>';
    }

    container.innerHTML = `<div class="slide flex w-full h-full">${content}</div>`;
    lucide.createIcons();
    document.getElementById('preview-container').classList.remove('hidden');
    
    // Add ESC key handler for slide preview
    document.addEventListener('keydown', handleSlidePreviewEscape);
}

function handleSlidePreviewEscape(e) {
    if (e.key === 'Escape') {
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((e) => { });
            }
        } else {
            closePreview();
        }
    }
}

// ------------------------------------
// Slideshow / Presentation Logic
// ------------------------------------
// All slideshow functions moved to display_system/slideshow.js

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
        document.exitFullscreen().catch(() => {});
    }
}

function getStatusColor(status) {
    switch(status) {
        case '🏠 가족 찾는 중': return 'bg-green-500';
        case '🌷 꽃단장 중': return 'bg-yellow-500';
        case '🌻 행복한 집으로': return 'bg-blue-500';
        default: return 'bg-slate-500';
    }
}

function resetData() {
    if (confirm('모든 데이터를 초기화하시겠습니까?\n저장된 슬라이드와 설정이 모두 삭제됩니다.')) {
        localStorage.removeItem('juoStoreDisplayConfig_v3');
        location.reload();
    }
}

// Expose functions to window for inline HTML handlers and cross-module access
window.previewSlide = previewSlide;
window.handleSlidePreviewEscape = handleSlidePreviewEscape;
