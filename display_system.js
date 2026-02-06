lucide.createIcons();

// ----------------------------------------------------
// Logic
// ----------------------------------------------------

const defaultData = {
    interval: 8,
    lastSaved: null,
    intro: {
        title: 'New Arrivals',
        subtitle: '이번 주 새로운 가족'
    },
    notice: {
        enabled: true,
        title: '📢 매장 공지',
        content: '<p>공지사항 내용을 입력해주세요.</p>'
    },
    slides: [
        {
            id: Date.now(),
            pet1: {
                hidden: false,
                image: '', status: '🏠 가족 찾는 중', breed: '말티푸', gender: '여아', birth: '2024.11.12',
                checklist: ['원구충 3회 완료', '기초 접종 1차 완료', '건강검진 "양호"']
            },
            pet2: {
                hidden: false,
                image: '', status: '🌷 꽃단장 중', breed: '포메라니안', gender: '남아', birth: '2024.11.20',
                checklist: ['원구충 2회 완료', '기초 접종 진행 중', '부모견 정보 확인 가능']
            }
        }
    ]
};

let config = JSON.parse(localStorage.getItem('juoStoreDisplayConfig_v3')) || defaultData;

// MIGRATION: v2 to v3 (or missing checklist)
// If loaded data doesn't have 'checklist' array but has 'check1', migrate it.
config.slides.forEach(slide => {
    ['pet1', 'pet2'].forEach(petKey => {
        if (!slide[petKey].checklist) {
            slide[petKey].checklist = [];
            if (slide[petKey].check1) slide[petKey].checklist.push(slide[petKey].check1);
            if (slide[petKey].check2) slide[petKey].checklist.push(slide[petKey].check2);
            if (slide[petKey].check3) slide[petKey].checklist.push(slide[petKey].check3);
        }
    });
});

let slideIntervalId = null;
let currentSlideIndex = 0;
let isPaused = false;
let pauseRemainingTime = 0;
let pauseStartTime = 0;

// MIGRATION: Add notice if missing
if (!config.notice) {
    config.notice = { enabled: true, title: '📢 매장 공지', content: '<p>공지사항 내용을 입력해주세요.</p>' };
}

// MIGRATION: Add intro if missing
if (!config.intro) {
    config.intro = { title: 'New Arrivals', subtitle: '이번 주 새로운 가족' };
}

// MIGRATION: Update status values to new emotional wording
config.slides.forEach(slide => {
    ['pet1', 'pet2'].forEach(petKey => {
        const status = slide[petKey].status;
        if (status === '분양 가능' || status === '🌸 새싹 피는 중') {
            slide[petKey].status = '🏠 가족 찾는 중';
        } else if (status === '예약 대기') {
            slide[petKey].status = '🌷 꽃단장 중';
        } else if (status === '완료' || status === '분양 완료') {
            slide[petKey].status = '🌻 행복한 집으로';
        }
    });
});

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
// Editor Logic
// ------------------------------------

// Selection Saving Logic
let savedRange = null;

document.addEventListener('DOMContentLoaded', () => {
    const editorCallback = () => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const editor = document.getElementById('notice-content');
            if (editor && editor.contains(range.commonAncestorContainer)) {
                savedRange = range.cloneRange();
            }
        }
    };

    const editor = document.getElementById('notice-content');
    if (editor) {
        editor.addEventListener('keyup', editorCallback);
        editor.addEventListener('mouseup', editorCallback);
        editor.addEventListener('focus', editorCallback);
        // CRITICAL: Save selection when editor loses focus (before clicking toolbar)
        editor.addEventListener('blur', editorCallback);
    }
});

// ------------------------------------
// Notice Editor Functions
// ------------------------------------

function renderNoticeEditor() {
    document.getElementById('notice-enabled').checked = config.notice.enabled;
    document.getElementById('notice-title').value = config.notice.title;
    document.getElementById('notice-content').innerHTML = config.notice.content;
    updateNoticeEditorVisibility();
}

function updateNoticeEditorVisibility() {
    const wrapper = document.getElementById('notice-editor-wrapper');
    if (config.notice.enabled) {
        wrapper.classList.remove('opacity-40', 'pointer-events-none');
    } else {
        wrapper.classList.add('opacity-40', 'pointer-events-none');
    }
}

function toggleNotice(enabled) {
    config.notice.enabled = enabled;
    updateNoticeEditorVisibility();
}

function updateNotice(field, value) {
    config.notice[field] = value;
    // Removed character limit logic as requested
}

function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('notice-content').focus();
}

function setFontSize(size) {
    // Use saved range if available, otherwise current selection
    let range = null;
    const sel = window.getSelection();

    if (savedRange) {
        range = savedRange;
        // Restore selection visually if possible (optional, but good UX)
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
    }

    if (range) {
        // Ensure range is inside editor
        if (!document.getElementById('notice-content').contains(range.commonAncestorContainer)) {
            console.log("Selection outside editor");
            return;
        }

        const span = document.createElement('span');
        span.style.fontSize = size + 'px';

        if (range.collapsed) {
            document.getElementById('notice-content').focus();
            return;
        }

        try {
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);

            // Update State manually since DOM manipulation doesn't trigger input event
            updateNotice('content', document.getElementById('notice-content').innerHTML);

            // Update saved range to include new span
            savedRange = document.createRange();
            savedRange.selectNodeContents(span);
            sel.removeAllRanges();
            sel.addRange(savedRange);
        } catch (e) {
            console.error('Font size application failed:', e);
        }
    }
    document.getElementById('notice-content').focus();
}

function setTextColor(color) {
    // Use saved range if available, otherwise current selection
    let range = null;
    const sel = window.getSelection();

    if (savedRange) {
        range = savedRange;
        // Restore selection visually if possible (optional, but good UX)
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
    }

    if (range) {
        // Ensure range is inside editor
        if (!document.getElementById('notice-content').contains(range.commonAncestorContainer)) {
            console.log("Selection outside editor");
            return;
        }

        const span = document.createElement('span');
        span.style.color = color;

        if (range.collapsed) {
            document.getElementById('notice-content').focus();
            return;
        }

        try {
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);

            // Update State manually since DOM manipulation doesn't trigger input event
            updateNotice('content', document.getElementById('notice-content').innerHTML);

            // Update saved range to include new span
            savedRange = document.createRange();
            savedRange.selectNodeContents(span);
            sel.removeAllRanges();
            sel.addRange(savedRange);
        } catch (e) {
            console.error('Color application failed:', e);
        }
    }
    document.getElementById('notice-content').focus();
}

function setLineHeight(value) {
    let range = null;
    const sel = window.getSelection();

    if (savedRange) {
        range = savedRange;
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
    }

    if (range) {
        if (!document.getElementById('notice-content').contains(range.commonAncestorContainer)) return;

        const span = document.createElement('span');
        span.style.lineHeight = value;

        if (range.collapsed) {
            document.getElementById('notice-content').focus();
            return;
        }

        try {
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);

            updateNotice('content', document.getElementById('notice-content').innerHTML);

            savedRange = document.createRange();
            savedRange.selectNodeContents(span);
            sel.removeAllRanges();
            sel.addRange(savedRange);
        } catch (e) {
            console.error('Line height application failed:', e);
        }
    }
    document.getElementById('notice-content').focus();
}

function setLetterSpacing(value) {
    let range = null;
    const sel = window.getSelection();

    if (savedRange) {
        range = savedRange;
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
    }

    if (range) {
        if (!document.getElementById('notice-content').contains(range.commonAncestorContainer)) return;

        const span = document.createElement('span');
        span.style.letterSpacing = value + 'px';

        if (range.collapsed) {
            document.getElementById('notice-content').focus();
            return;
        }

        try {
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);

            updateNotice('content', document.getElementById('notice-content').innerHTML);

            savedRange = document.createRange();
            savedRange.selectNodeContents(span);
            sel.removeAllRanges();
            sel.addRange(savedRange);
        } catch (e) {
            console.error('Letter spacing application failed:', e);
        }
    }
    document.getElementById('notice-content').focus();
}

function handlePaste(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
}

// ------------------------------------
// Admin UI Rendering
// ------------------------------------

function renderAdminSlides() {
    const container = document.getElementById('admin-slides-list');
    container.innerHTML = '';

    config.slides.forEach((slide, index) => {
        const div = document.createElement('div');
        div.innerHTML = createAdminSlideHTML(slide, index);
        container.appendChild(div);

        restorePreview(slide.id, 'pet1', slide.pet1.image);
        restorePreview(slide.id, 'pet2', slide.pet2.image);
    });
    
    const slideCount = document.getElementById('slide-count');
    if (slideCount) slideCount.textContent = config.slides.length;
    
    lucide.createIcons();
}

function restorePreview(slideId, petKey, imageData) {
    if (imageData) {
        const p = document.getElementById(`preview-${petKey}-${slideId}`);
        if (p) {
            p.style.backgroundImage = `url(${imageData})`;
            const content = p.querySelector('.placeholder-content');
            if (content) content.style.display = 'none';
        }
    }
}

function createAdminSlideHTML(slide, index) {
    return `
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden slide-card" id="slide-block-${slide.id}">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-juo-orange text-white flex items-center justify-center font-black text-sm">
                    ${index + 1}
                </div>
                <h3 class="font-bold text-slate-700">슬라이드 ${index + 1}</h3>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="previewSlide(${slide.id})" class="px-3 py-2 text-slate-500 hover:text-juo-orange hover:bg-orange-50 rounded-lg transition flex items-center gap-2 text-sm font-bold" title="미리보기">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                    <span class="hidden sm:inline">미리보기</span>
                </button>
                <button onclick="removeSlide(${slide.id})" class="px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex items-center gap-2 text-sm font-bold" title="삭제">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
        
        <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            ${createPetInputHTML(slide.id, slide.pet1, 'pet1', 'A', '왼쪽 아이', 'juo-orange')}
            ${createPetInputHTML(slide.id, slide.pet2, 'pet2', 'B', '오른쪽 아이', 'blue-500')}
        </div>
    </div>`;
}

function createPetInputHTML(slideId, petData, petKey, number, title, colorClass) {
    const isHidden = petData.hidden;
    const bgClass = `bg-${colorClass}`;
    const textClass = `text-${colorClass}`;
    const borderClass = `border-${colorClass}`;

    let checklistHTML = '';
    petData.checklist.forEach((item, idx) => {
        checklistHTML += `
            <div class="flex items-center gap-2 mb-2">
                <div class="w-2 h-2 rounded-full ${bgClass} shrink-0"></div>
                <input type="text" value="${item}" class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-${colorClass} focus:ring-2 focus:ring-${colorClass}/20 transition" placeholder="체크리스트 내용" oninput="updateChecklist(${slideId}, '${petKey}', ${idx}, this.value)">
                <button onclick="removeChecklistItem(${slideId}, '${petKey}', ${idx})" class="p-1 text-slate-300 hover:text-red-400 transition"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>`;
    });

    return `
        <div class="relative ${isHidden ? 'opacity-40' : ''}">
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                    <span class="${bgClass} text-white w-6 h-6 rounded-md flex items-center justify-center text-xs font-black">${number}</span> 
                    <h4 class="font-bold text-slate-700">${title}</h4>
                </div>
                <label class="flex items-center gap-2 cursor-pointer select-none">
                    <span class="text-xs font-bold text-slate-400">숨김</span>
                    <div class="relative inline-block w-9 h-5 align-middle select-none">
                        <input type="checkbox" onchange="toggleHidden(${slideId}, '${petKey}', this.checked)" ${isHidden ? 'checked' : ''} 
                            class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-${colorClass}"/>
                        <span class="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"></span>
                    </div>
                </label>
            </div>

            <div id="inputs-${petKey}-${slideId}" class="${isHidden ? 'pointer-events-none' : ''}">
                <div class="flex gap-4 mb-4">
                    <div class="w-32 aspect-[3/4] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 relative cursor-pointer hover:border-${colorClass} hover:bg-slate-50 transition overflow-hidden bg-cover bg-center group"
                         id="preview-${petKey}-${slideId}" onclick="document.getElementById('file-${petKey}-${slideId}').click()">
                        <div class="placeholder-content absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                            <i data-lucide="camera" class="w-6 h-6 mb-1 opacity-50"></i>
                            <span class="text-[10px] font-bold">사진 등록</span>
                        </div>
                        <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-bold">변경</div>
                    </div>
                    <input type="file" id="file-${petKey}-${slideId}" class="hidden" accept="image/*" onchange="handleImageUpload(this, ${slideId}, '${petKey}')">

                    <div class="flex-1 space-y-2">
                        <div>
                            <label class="text-xs font-bold text-slate-400 mb-1 block">견종</label>
                            <input type="text" value="${petData.breed}" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:border-${colorClass} focus:ring-2 focus:ring-${colorClass}/20 transition" placeholder="예: 말티푸" oninput="updateData(${slideId}, '${petKey}', 'breed', this.value)">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="text-xs font-bold text-slate-400 mb-1 block">성별</label>
                                <select class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-${colorClass} focus:ring-2 focus:ring-${colorClass}/20 transition bg-white" onchange="updateData(${slideId}, '${petKey}', 'gender', this.value)">
                                    <option value="여아" ${petData.gender === '여아' ? 'selected' : ''}>여아</option>
                                    <option value="남아" ${petData.gender === '남아' ? 'selected' : ''}>남아</option>
                                    <option value="공주님" ${petData.gender === '공주님' ? 'selected' : ''}>공주님</option>
                                    <option value="왕자님" ${petData.gender === '왕자님' ? 'selected' : ''}>왕자님</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-bold text-slate-400 mb-1 block">상태</label>
                                <select class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-${colorClass} focus:ring-2 focus:ring-${colorClass}/20 transition bg-white" onchange="updateData(${slideId}, '${petKey}', 'status', this.value)">
                                  <option value="🏠 가족 찾는 중" ${petData.status === '🏠 가족 찾는 중' ? 'selected' : ''}>🏠 가족 찾는 중</option>
                                  <option value="🌷 꽃단장 중" ${petData.status === '🌷 꽃단장 중' ? 'selected' : ''}>🌷 꽃단장 중</option>
                                  <option value="🌻 행복한 집으로" ${petData.status === '🌻 행복한 집으로' ? 'selected' : ''}>🌻 행복한 집으로</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="text-xs font-bold text-slate-400 mb-1 block">생일</label>
                            <input type="text" value="${petData.birth}" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-${colorClass} focus:ring-2 focus:ring-${colorClass}/20 transition" placeholder="YYYY.MM.DD" oninput="updateData(${slideId}, '${petKey}', 'birth', this.value)">
                        </div>
                    </div>
                </div>

                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-slate-500 flex items-center gap-1"><i data-lucide="list-checks" class="w-3 h-3"></i> 체크리스트</span>
                        <button onclick="addChecklistItem(${slideId}, '${petKey}')" class="text-xs ${textClass} hover:underline font-bold">+ 항목 추가</button>
                    </div>
                    <div class="space-y-1">
                        ${checklistHTML}
                    </div>
                </div>
            </div>
        </div>`;
}


// ------------------------------------
// Data Management Events
// ------------------------------------

function addNewSlideBlock() {
    config.slides.push({
        id: Date.now(),
        pet1: { hidden: false, image: '', status: '🏠 가족 찾는 중', breed: '', gender: '여아', birth: '', checklist: [''] },
        pet2: { hidden: false, image: '', status: '🏠 가족 찾는 중', breed: '', gender: '남아', birth: '', checklist: [''] }
    });
    renderAdminSlides();
}

function removeSlide(id) {
    if (confirm('정말 이 슬라이드를 삭제하시겠습니까?')) {
        config.slides = config.slides.filter(s => s.id !== id);
        renderAdminSlides();
    }
}

function toggleHidden(slideId, petKey, isHidden) {
    const slide = config.slides.find(s => s.id === slideId);
    if (slide) {
        slide[petKey].hidden = isHidden;
        renderAdminSlides();
    }
}

function updateData(slideId, petKey, field, value) {
    const slide = config.slides.find(s => s.id === slideId);
    if (slide) slide[petKey][field] = value;
}

function updateChecklist(slideId, petKey, idx, value) {
    const slide = config.slides.find(s => s.id === slideId);
    if (slide) slide[petKey].checklist[idx] = value;
}

function addChecklistItem(slideId, petKey) {
    const slide = config.slides.find(s => s.id === slideId);
    if (slide) {
        slide[petKey].checklist.push('');
        renderAdminSlides();
    }
}

function removeChecklistItem(slideId, petKey, idx) {
    const slide = config.slides.find(s => s.id === slideId);
    if (slide) {
        slide[petKey].checklist.splice(idx, 1);
        renderAdminSlides();
    }
}

function handleImageUpload(input, slideId, petKey) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const result = e.target.result;
            const slide = config.slides.find(s => s.id === slideId);
            if (slide) {
                slide[petKey].image = result;
                restorePreview(slideId, petKey, result);
            }
        }
        reader.readAsDataURL(file);
    }
}

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

function previewNotice() {
    const container = document.getElementById('preview-content');
    container.innerHTML = `
        <div class="slide flex flex-col items-center justify-center p-0 bg-slate-50 relative overflow-hidden w-full h-full">
            <div class="absolute inset-0 z-0 opacity-40" style="background-image: radial-gradient(#FF7A00 1px, transparent 1px); background-size: 40px 40px;"></div>
            <div class="absolute top-0 right-0 w-[50vh] h-[50vh] bg-orange-100 rounded-bl-full -z-10 blur-3xl opacity-60"></div>
            <div class="absolute bottom-0 left-0 w-[60vh] h-[60vh] bg-blue-50 rounded-tr-full -z-10 blur-3xl opacity-60"></div>
            <div class="max-w-[92%] w-full h-[88%] z-10 flex flex-col justify-center relative">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-3 rounded-full shadow-lg border border-slate-100 flex items-center gap-3 z-20">
                    <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span class="font-black text-slate-700 tracking-widest text-lg">OFFICIAL NOTICE</span>
                </div>
                <div class="bg-white/80 backdrop-blur-xl rounded-[4rem] w-full h-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 flex flex-col items-center justify-start text-center p-12 pt-40 relative overflow-hidden">
                    <div class="absolute top-0 w-full h-2 bg-gradient-to-r from-juo-orange via-yellow-400 to-juo-orange"></div>
                    <div class="mb-14 relative">
                        <h2 class="text-8xl font-black text-slate-800 leading-tight tracking-tight drop-shadow-sm">${config.notice.title || '공지 제목'}</h2>
                        <div class="w-32 h-2 bg-juo-orange mx-auto mt-8 rounded-full opacity-30"></div>
                    </div>
                    <div class="relative w-full max-w-6xl">
                        <div class="text-6xl leading-[1.6] text-slate-600 font-medium break-all" style="white-space: pre-wrap; word-wrap: break-word;">${config.notice.content || '<p>공지 내용을 입력해주세요.</p>'}</div>
                    </div>
                </div>
            </div>
        </div>`;
    lucide.createIcons();
    document.getElementById('preview-container').classList.remove('hidden');
    document.addEventListener('keydown', handlePreviewEscape);
}

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
    document.addEventListener('keydown', handlePreviewEscape);
}

function handlePreviewEscape(e) {
    if (e.key === 'Escape') {
        closePreview();
    }
}

function closePreview() {
    document.getElementById('preview-container').classList.add('hidden');
    document.getElementById('preview-content').innerHTML = '';
    document.removeEventListener('keydown', handlePreviewEscape);

    if (document.exitFullscreen) {
        document.exitFullscreen().catch((e) => { });
    }
}

// ------------------------------------
// Presentation Logic
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

let controlsTimeoutId = null;

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

    // Notice Slide (Slide 2 - if enabled)
    if (config.notice.enabled && config.notice.title) {
        container.innerHTML += `
            <div id="slide-${slideIndex}" class="slide flex-col items-center justify-center p-0 bg-slate-50 relative overflow-hidden">
                <div class="absolute inset-0 z-0 opacity-40" style="background-image: radial-gradient(#FF7A00 1px, transparent 1px); background-size: 40px 40px;"></div>
                <div class="absolute top-0 right-0 w-[50vh] h-[50vh] bg-orange-100 rounded-bl-full -z-10 blur-3xl opacity-60"></div>
                <div class="absolute bottom-0 left-0 w-[60vh] h-[60vh] bg-blue-50 rounded-tr-full -z-10 blur-3xl opacity-60"></div>
                <div class="max-w-[92%] w-full h-[88%] z-10 flex flex-col justify-center relative">
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-3 rounded-full shadow-lg border border-slate-100 flex items-center gap-3 z-20">
                        <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <span class="font-black text-slate-700 tracking-widest text-lg">OFFICIAL NOTICE</span>
                    </div>
                    <div class="bg-white/80 backdrop-blur-xl rounded-[4rem] w-full h-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/50 flex flex-col items-center justify-start text-center p-12 pt-40 relative overflow-hidden">
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

    // Slide 3
    addStaticSlide(`
        <div class="text-center mb-12">
            <h2 class="text-5xl font-black mb-4">데이터로 증명하는 정직함</h2>
            <p class="text-2xl text-slate-500">주오컴퍼니는 모든 개체의 정보를 디지털로 투명하게 공개합니다.</p>
        </div>
        <div class="grid grid-cols-3 gap-8 mb-12">
            <div class="p-8 bg-slate-50 rounded-3xl text-center">
                <i data-lucide="qr-code" class="w-16 h-16 mx-auto mb-6 text-juo-orange"></i>
                <h4 class="text-2xl font-bold mb-4">개체별 QR 생성</h4>
                <p class="text-slate-600">모든 아이에게 부여된 고유 식별 번호로 위변조 없는 관리</p>
            </div>
            <div class="p-8 bg-slate-50 rounded-3xl text-center border-2 border-juo-orange">
                <i data-lucide="database" class="w-16 h-16 mx-auto mb-6 text-juo-orange"></i>
                <h4 class="text-2xl font-bold mb-4">실시간 건강 기록</h4>
                <p class="text-slate-600">생년월일, 접종 차수, 구충 현황을 현장에서 즉시 확인</p>
            </div>
            <div class="p-8 bg-slate-50 rounded-3xl text-center">
                <i data-lucide="file-check" class="w-16 h-16 mx-auto mb-6 text-juo-orange"></i>
                <h4 class="text-2xl font-bold mb-4">전자 계약 시스템</h4>
                <p class="text-slate-600">계약 시점의 타임스탬프 기록으로 안전한 법적 보호</p>
            </div>
        </div>
        <div class="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between">
            <span class="text-xl font-bold">💡 주오 ERP 시스템은 국가동물보호정보시스템과 연동됩니다.</span>
            <div class="flex gap-4">
                <span class="px-4 py-1 bg-slate-700 rounded-full text-sm">실시간 데이터 연동</span>
                <span class="px-4 py-1 bg-slate-700 rounded-full text-sm">보안 암호화 적용</span>
            </div>
        </div>
    `, 'p-16 bg-white justify-center');

    // Slide 4
    addStaticSlide(`
        <h2 class="text-center text-5xl font-black mb-12 uppercase tracking-tight">주오 멤버십 <span class="text-juo-orange">3대 라인업</span></h2>
            <div class="grid grid-cols-3 gap-8">
                <!-- White -->
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
                <!-- Silver -->
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
                <!-- VIP -->
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
                    <div class="w-12 h-12 bg-juo-orange/20 rounded-xl flex items-center justify-center shrink-0"><i data-lucide="first-aid" class="text-juo-orange"></i></div>
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

function resetData() {
    if (confirm('정말 모든 데이터를 초기화하시겠습니까?\n\n저장된 모든 슬라이드와 설정이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.')) {
        localStorage.removeItem('juoStoreDisplayConfig_v3');
        location.reload();
    }
}

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
