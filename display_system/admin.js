// ------------------------------------
// Admin UI Rendering
// ------------------------------------

function renderAdminSlides() {
    const container = document.getElementById('admin-slides-list');
    container.innerHTML = '';

    pendingConfig.slides.forEach((slide, index) => {
        const div = document.createElement('div');
        div.innerHTML = createAdminSlideHTML(slide, index);
        container.appendChild(div);

        restorePreview(slide.id, 'pet1', slide.pet1.image);
        restorePreview(slide.id, 'pet2', slide.pet2.image);
    });

    const slideCount = document.getElementById('slide-count');
    if (slideCount) slideCount.textContent = pendingConfig.slides.length;

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
                <button onclick="previewSlide(${slide.id})" class="px-4 py-2 text-slate-500 hover:text-juo-orange hover:bg-orange-50 rounded-xl transition flex items-center gap-2 text-sm font-bold" title="미리보기">
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
                                  <option value="🌷 가족 맞이 준비중" ${petData.status === '🌷 가족 맞이 준비중' ? 'selected' : ''}>🌷 가족 맞이 준비중</option>
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
    pendingConfig.slides.push({
        id: Date.now(),
        pet1: { hidden: false, image: '', status: '🏠 가족 찾는 중', breed: '', gender: '여아', birth: '', checklist: [''] },
        pet2: { hidden: false, image: '', status: '🏠 가족 찾는 중', breed: '', gender: '남아', birth: '', checklist: [''] }
    });
    renderAdminSlides();
}

function removeSlide(id) {
    if (confirm('정말 이 슬라이드를 삭제하시겠습니까?')) {
        pendingConfig.slides = pendingConfig.slides.filter(s => s.id !== id);
        renderAdminSlides();
    }
}

function toggleHidden(slideId, petKey, isHidden) {
    const slide = pendingConfig.slides.find(s => s.id === slideId);
    if (slide) {
        slide[petKey].hidden = isHidden;
        renderAdminSlides();
    }
}

function updateData(slideId, petKey, field, value) {
    const slide = pendingConfig.slides.find(s => s.id === slideId);
    if (slide) slide[petKey][field] = value;
}

function updateChecklist(slideId, petKey, idx, value) {
    const slide = pendingConfig.slides.find(s => s.id === slideId);
    if (slide) slide[petKey].checklist[idx] = value;
}

function addChecklistItem(slideId, petKey) {
    const slide = pendingConfig.slides.find(s => s.id === slideId);
    if (slide) {
        slide[petKey].checklist.push('');
        renderAdminSlides();
    }
}

function removeChecklistItem(slideId, petKey, idx) {
    const slide = pendingConfig.slides.find(s => s.id === slideId);
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
            const slide = pendingConfig.slides.find(s => s.id === slideId);
            if (slide) {
                slide[petKey].image = result;
                restorePreview(slideId, petKey, result);
            }
        };
        reader.readAsDataURL(file);
    }
}

window.renderAdminSlides = renderAdminSlides;
window.restorePreview = restorePreview;
window.createAdminSlideHTML = createAdminSlideHTML;
window.createPetInputHTML = createPetInputHTML;
window.addNewSlideBlock = addNewSlideBlock;
window.removeSlide = removeSlide;
window.toggleHidden = toggleHidden;
window.updateData = updateData;
window.updateChecklist = updateChecklist;
window.addChecklistItem = addChecklistItem;
window.removeChecklistItem = removeChecklistItem;
window.handleImageUpload = handleImageUpload;
