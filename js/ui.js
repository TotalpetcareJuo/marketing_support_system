import { getMaterials, getColorMap, getMaterialsByCategory, getScenarioById, getContracts, getNotices, getBranchStats, getContractStats, deleteContract } from './store.js';
import { getScenarioContent } from './scenarioContent.js';

let currentMaterialIndex = 0;
let filteredMaterials = [];
let materials = [];
let colorMap = {};
let currentScenario = null;
let currentScenarioPage = 0;
let currentDetailData = null;

export const AppState = {
    user: {
        role: 'store', // 'super_admin' or 'store'
        branch_name: 'Unknown Branch'
    }
};

const elements = {
    grid: () => document.getElementById('materials-grid'),
    itemCount: () => document.getElementById('item-count'),
    viewerOverlay: () => document.getElementById('viewer-overlay'),
    viewerCategory: () => document.getElementById('viewer-category'),
    viewerTitle: () => document.getElementById('viewer-title'),
    viewerContent: () => document.getElementById('viewer-content'),
    pageIndicators: () => document.getElementById('page-indicators'),
    contractListView: () => document.getElementById('contracts-list-view')
};

export async function initData() {
    [materials, colorMap] = await Promise.all([
        getMaterials(),
        getColorMap()
    ]);

    await Promise.all([
        renderNotices(),
        renderHomeNotices()
    ]);
}

function showContractDetail(contract) {
    currentDetailData = contract;

    const listView = elements.contractListView();
    const detailView = document.getElementById('contract-detail-view');
    if (listView) listView.classList.add('hidden');
    if (detailView) {
        detailView.classList.remove('hidden');
        detailView.classList.add('flex');
    }

    // Populate fields
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val || '-';
    };

    set('detail-contract-number', contract.contract_number || contract.id);
    set('detail-manager-branch', contract.manager_branch_name);
    set('detail-manager-name', contract.manager_name);
    set('detail-manager-address', contract.manager_branch_address);
    set('detail-manager-phone', contract.manager_phone);

    set('detail-pet-name', contract.pet_name);
    set('detail-pet-species', contract.pet_species);
    set('detail-pet-breed', contract.pet_breed);
    set('detail-pet-color', contract.pet_color);
    const genderMap = { 'Male': '남아', 'Female': '여아', 'male': '남아', 'female': '여아' };
    set('detail-pet-gender', genderMap[contract.pet_gender] || contract.pet_gender);
    set('detail-pet-birthdate', contract.pet_birthdate);

    set('detail-adopter-name', contract.adopter_name);
    set('detail-adopter-phone', contract.adopter_phone);
    set('detail-adopter-id', contract.adopter_resident_no);
    set('detail-adoption-fee', contract.adoption_fee ? `${Number(contract.adoption_fee).toLocaleString()}원` : '-');
    set('detail-adopter-address', contract.adopter_address);

    set('detail-adoption-date', contract.adoption_date);
    set('detail-branch-name', contract.branch_name);

    lucide.createIcons();
    
    history.pushState({ tabId: 'contracts', showDetail: true }, '', '#contracts');
}

function closeContractDetail() {
    currentDetailData = null;
    const listView = elements.contractListView();
    const detailView = document.getElementById('contract-detail-view');
    if (detailView) {
        detailView.classList.add('hidden');
        detailView.classList.remove('flex');
    }
    if (listView) listView.classList.remove('hidden');
}

export async function renderMaterials(category = 'all') {
    const grid = elements.grid();
    if (!grid) return;

    if (materials.length === 0) {
        await initData();
    }

    grid.innerHTML = '';
    filteredMaterials = category === 'all'
        ? materials
        : materials.filter(m => m.category === category);

    elements.itemCount().textContent = filteredMaterials.length + '개';

    filteredMaterials.forEach((material, index) => {
        const colors = colorMap[material.color];
        const card = createMaterialCard(material, colors, index);
        card.addEventListener('click', () => openViewer(index));
        grid.appendChild(card);
    });

    lucide.createIcons();
}

function createMaterialCard(material, colors, index) {
    const card = document.createElement('div');
    card.className = 'material-card group bg-white rounded-3xl border border-slate-200 overflow-hidden cursor-pointer animate-slide-up';
    card.style.animationDelay = (index * 0.05) + 's';
    card.innerHTML = `
        <div class="aspect-[4/3] ${colors.bg} ${colors.hover} flex items-center justify-center relative overflow-hidden transition">
            <i data-lucide="${material.icon}" class="w-12 h-12 md:w-16 md:h-16 ${colors.text}"></i>
            <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span class="bg-white px-4 py-2 rounded-full text-sm font-bold text-slate-700 shadow-lg flex items-center gap-2">
                    <i data-lucide="eye" class="w-4 h-4"></i> 보기
                </span>
            </div>
        </div>
        <div class="p-4 md:p-5 text-center">
            <h3 class="font-bold text-slate-800 mb-1 line-clamp-1 text-sm md:text-base">${material.title}</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">${material.categoryLabel} • ${material.type}</p>
        </div>
    `;
    return card;
}

export function openViewer(index) {
    currentMaterialIndex = index;
    const material = filteredMaterials[index];

    elements.viewerCategory().textContent = material.categoryLabel;
    elements.viewerTitle().textContent = material.title;

    if (material.type === 'SCENARIO' && material.scenarioId) {
        openScenarioViewer(material);
    } else {
        const colors = colorMap[material.color];
        elements.viewerContent().innerHTML = createViewerContent(material, colors);
    }

    updatePageIndicators();

    const overlay = elements.viewerOverlay();
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    lucide.createIcons();
}

async function openScenarioViewer(material) {
    currentScenario = await getScenarioById(material.scenarioId);
    if (!currentScenario) return;

    currentScenarioPage = 0;

    const isHtmlScenario = currentScenario.type === 'HTML_SCENARIO';

    if (isHtmlScenario) {
        renderHtmlScenarioViewer();
    } else {
        renderImageScenarioViewer();
    }
}

function renderHtmlScenarioViewer() {
    const page = currentScenario.pages[currentScenarioPage];
    const content = getScenarioContent(page.contentId);

    if (!content) {
        console.error('Scenario content not found:', page.contentId);
        return;
    }

    elements.viewerContent().innerHTML = `
        <div class="relative w-full h-full max-w-5xl max-h-[85vh] bg-white rounded-2xl animate-fade-in overflow-hidden shadow-2xl flex flex-col">
            <!-- HTML Content Container -->
            <div id="scenario-html-container"
                 class="scenario-html-content flex-1 overflow-auto relative"
                 data-body-class="${content.bodyClass || ''}">
                ${content.html}
            </div>

            <!-- Drawing Canvas Overlay -->
            <canvas id="consult-canvas"
                    class="absolute inset-0 w-full h-full touch-none cursor-crosshair z-10"></canvas>

            <!-- Toolbar -->
            <div data-toolbar="true" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-4 shadow-xl z-20 border border-white/10">
                <button id="tool-pen" class="tool-btn active w-10 h-10 rounded-full flex items-center justify-center bg-white text-slate-900 shadow-lg active:scale-95 transition">
                    <i data-lucide="pen-tool" class="w-5 h-5"></i>
                </button>
                <button id="tool-eraser" class="tool-btn w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 active:scale-95 transition">
                    <i data-lucide="eraser" class="w-5 h-5"></i>
                </button>
                <div class="w-px h-6 bg-white/20"></div>
                <button id="tool-clear" class="tool-btn w-10 h-10 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/30 active:scale-95 transition">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
    `;

    lucide.createIcons();

    const canvas = document.getElementById('consult-canvas');
    const container = document.getElementById('scenario-html-container');
    if (canvas && container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        scaleHtmlContent(container);

        drawingManager = new DrawingManager(canvas);

        // Toolbar Events
        document.getElementById('tool-pen').addEventListener('click', (e) => {
            drawingManager.setTool('pen');
            updateToolUI('pen');
        });
        document.getElementById('tool-eraser').addEventListener('click', (e) => {
            drawingManager.setTool('eraser');
            updateToolUI('eraser');
        });
        document.getElementById('tool-clear').addEventListener('click', () => {
            drawingManager.clear();
        });
    }
}

function renderImageScenarioViewer() {
    elements.viewerContent().innerHTML = `
        <div class="relative w-full h-full max-w-4xl max-h-[80vh] bg-white rounded-2xl flex items-center justify-center animate-fade-in overflow-hidden shadow-2xl">
            <img id="scenario-image" class="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" src="${currentScenario.pages[0]}" alt="Page 1">
            <canvas id="consult-canvas" class="absolute inset-0 w-full h-full touch-none cursor-crosshair"></canvas>

            <div data-toolbar="true" class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-4 shadow-xl z-20 border border-white/10">
                <button id="tool-pen" class="tool-btn active w-10 h-10 rounded-full flex items-center justify-center bg-white text-slate-900 shadow-lg active:scale-95 transition">
                    <i data-lucide="pen-tool" class="w-5 h-5"></i>
                </button>
                <button id="tool-eraser" class="tool-btn w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 active:scale-95 transition">
                    <i data-lucide="eraser" class="w-5 h-5"></i>
                </button>
                <div class="w-px h-6 bg-white/20"></div>
                <button id="tool-clear" class="tool-btn w-10 h-10 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/30 active:scale-95 transition">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
    `;

    lucide.createIcons();

    const canvas = document.getElementById('consult-canvas');
    if (canvas) {
        drawingManager = new DrawingManager(canvas);

        // Toolbar Events
        document.getElementById('tool-pen').addEventListener('click', (e) => {
            drawingManager.setTool('pen');
            updateToolUI('pen');
        });
        document.getElementById('tool-eraser').addEventListener('click', (e) => {
            drawingManager.setTool('eraser');
            updateToolUI('eraser');
        });
        document.getElementById('tool-clear').addEventListener('click', () => {
            drawingManager.clear();
        });
    }
}

// Storyboard Mode Initialization
export async function initCounseling() {
    currentScenario = await getScenarioById('scenario-membership');
    if (!currentScenario) return;
    
    currentScenarioPage = 0;
    
    const overlay = document.getElementById('counseling-overlay');
    const htmlContainer = document.getElementById('counseling-html');
    const img = document.getElementById('counseling-image');
    
    if (!overlay) return;
    
    overlay.classList.remove('hidden');
    
    const isHtmlScenario = currentScenario.type === 'HTML_SCENARIO';
    
    if (isHtmlScenario) {
        const page = currentScenario.pages[currentScenarioPage];
        const content = getScenarioContent(page.contentId);
        
        if (htmlContainer && content) {
            htmlContainer.innerHTML = content.html;
            htmlContainer.classList.remove('hidden');
            if (img) img.classList.add('hidden');
        }
    } else {
        if (img) {
            img.src = currentScenario.pages[0];
            img.classList.remove('hidden');
        }
        if (htmlContainer) htmlContainer.classList.add('hidden');
    }
    
    updateCounselingIndicator();
    lucide.createIcons();
}

export function closeCounseling() {
    const overlay = document.getElementById('counseling-overlay');
    if (overlay) overlay.classList.add('hidden');
    
    currentScenario = null;
    currentScenarioPage = 0;
}

function counselingPrev() {
    if (currentScenario && currentScenarioPage > 0) {
        currentScenarioPage--;
        updateCounselingPage();
    }
}

function counselingNext() {
    if (currentScenario && currentScenarioPage < currentScenario.pages.length - 1) {
        currentScenarioPage++;
        updateCounselingPage();
    }
}

function updateCounselingPage() {
    const htmlContainer = document.getElementById('counseling-html');
    const img = document.getElementById('counseling-image');
    
    const isHtmlScenario = currentScenario.type === 'HTML_SCENARIO';
    
    if (isHtmlScenario) {
        const page = currentScenario.pages[currentScenarioPage];
        const content = getScenarioContent(page.contentId);
        
        if (htmlContainer && content) {
            htmlContainer.innerHTML = content.html;
            htmlContainer.classList.remove('hidden');
            if (img) img.classList.add('hidden');
        }
    } else {
        if (img) {
            img.src = currentScenario.pages[currentScenarioPage];
            img.classList.remove('hidden');
        }
        if (htmlContainer) htmlContainer.classList.add('hidden');
    }
    
    updateCounselingIndicator();
    lucide.createIcons();
}

function updateCounselingIndicator() {
    const indicator = document.getElementById('counseling-page-indicator');
    if (indicator && currentScenario) {
        indicator.textContent = `${currentScenarioPage + 1} / ${currentScenario.pages.length}`;
    }
}

export function setupCounselingEvents() {
    const closeBtn = document.getElementById('counseling-close');
    const prevBtn = document.getElementById('counseling-prev');
    const nextBtn = document.getElementById('counseling-next');
    
    if (closeBtn) closeBtn.addEventListener('click', closeCounseling);
    if (prevBtn) prevBtn.addEventListener('click', counselingPrev);
    if (nextBtn) nextBtn.addEventListener('click', counselingNext);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCounseling();
        if (e.key === 'ArrowLeft') counselingPrev();
        if (e.key === 'ArrowRight') counselingNext();
    });
}

function createViewerContent(material, colors) {
    return `
        <div class="text-center p-8 md:p-12 animate-fade-in">
            <div class="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 ${colors.bg} rounded-3xl flex items-center justify-center">
                <i data-lucide="${material.icon}" class="w-12 h-12 md:w-16 md:h-16 ${colors.text}"></i>
            </div>
            <h4 class="text-xl md:text-2xl font-bold text-slate-800 mb-2">${material.title}</h4>
            <p class="text-slate-500 mb-6">${material.type} • ${material.size} • ${material.date}</p>
            <div class="flex gap-3 justify-center">
                <button class="px-6 py-3 bg-juo-orange text-white rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2">
                    <i data-lucide="eye" class="w-5 h-5"></i> 자료 보기
                </button>
                <button class="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition flex items-center gap-2">
                    <i data-lucide="share-2" class="w-5 h-5"></i> 공유
                </button>
            </div>
        </div>
    `;
}

export function closeViewer() {
    const overlay = elements.viewerOverlay();
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    
    currentScenario = null;
    currentScenarioPage = 0;
}

export function showPrev() {
    if (currentMaterialIndex > 0) {
        openViewer(currentMaterialIndex - 1);
    }
}

export function showNext() {
    if (currentMaterialIndex < filteredMaterials.length - 1) {
        openViewer(currentMaterialIndex + 1);
    }
}

export function switchTab(tabId, pushState = true) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
    
    document.querySelectorAll('section[id^="tab-"]').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`tab-${tabId}`)?.classList.remove('hidden');
    
    if (tabId === 'counseling') {
        initCounseling();
    }
    
    if (tabId === 'contracts') {
        const listView = elements.contractListView();
        const detailView = document.getElementById('contract-detail-view');
        if (listView) listView.classList.remove('hidden');
        if (detailView) {
            detailView.classList.add('hidden');
            detailView.classList.remove('flex');
        }
        renderContracts(AppState.user);
    }
    
    if (pushState) {
        history.pushState({ tabId }, '', `#${tabId}`);
    }
}

/**
 * 계약 목록을 렌더링합니다.
 * @param {Object} user - 현재 로그인한 사용자 정보
 */
export async function renderContracts(user) {
    const listContainer = document.querySelector('#tab-contracts .divide-y');
    if (!listContainer) return;

    // 지점 계정인 경우 본인 지점 데이터만 필터링
    const branchFilter = user.role === 'super_admin' ? null : user.branch_name;
    const contracts = await getContracts(branchFilter);

    listContainer.innerHTML = '';

    if (contracts.length === 0) {
        listContainer.innerHTML = '<div class="p-8 text-center text-slate-400 text-sm">표시할 계약이 없습니다.</div>';
        return;
    }

    contracts.forEach(contract => {
        const item = document.createElement('div');
        item.className = 'p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 transition';

        const isDraft = contract.status === 'draft';
        const isCompleted = contract.status === 'COMPLETED' || contract.status === 'completed';
        const statusLabel = isDraft ? '임시저장' : isCompleted ? '계약 완료' : '서명 대기';
        const statusClass = isDraft ? 'bg-amber-50 text-amber-600' : isCompleted ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600';
        const statusIcon = isDraft ? 'file-edit' : isCompleted ? 'file-check' : 'file-signature';

        item.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <i data-lucide="${statusIcon}" class="w-5 h-5"></i>
                </div>
                <div>
                    <div class="font-bold text-slate-700">${contract.contract_number || contract.id}</div>
                    <div class="text-xs text-slate-400">고객: ${contract.adopter_name || contract.customer} • ${contract.pet_name || contract.pet} • <span class="text-juo-orange">${contract.branch_name || contract.branch}</span></div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded-lg ${statusClass} text-[10px] font-black uppercase tracking-tight">${statusLabel}</span>
                ${isDraft ? '<button class="btn-delete-draft w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition" title="삭제"><i data-lucide="trash-2" class="w-4 h-4"></i></button>' : ''}
            </div>
        `;

        const openMode = isDraft ? 'create' : 'edit';
        item.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete-draft')) return;
            if (!isDraft && isCompleted) {
                showContractDetail(contract);
            } else {
                window.location.href = `contract-create.html?id=${contract.id}`;
            }
        });

        // Delete button for drafts
        if (isDraft) {
            const deleteBtn = item.querySelector('.btn-delete-draft');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (!confirm('임시저장된 계약을 삭제하시겠습니까?')) return;
                    const result = await deleteContract(contract.id);
                    if (result.success) {
                        renderContracts(AppState.user);
                    } else {
                        alert(`삭제 실패: ${result.message || '알 수 없는 오류'}`);
                    }
                });
            }
        }

        listContainer.appendChild(item);
    });

    lucide.createIcons();
}

/**
 * 사용자 권한에 따라 UI 요소를 제어합니다.
 * @param {Object} user - 사용자 정보 (role, branch_name)
 */
export function applyPermissions(user) {
    if (!user) return;

    // AppState 동기화
    AppState.user = { ...AppState.user, ...user };

    const isAdmin = user.role === 'super_admin';
    const adminTab = document.getElementById('nav-tab-admin');

    // 네비게이션 관리자 탭 노출 제어
    if (adminTab) {
        if (isAdmin) {
            adminTab.classList.remove('hidden');
        } else {
            adminTab.classList.add('hidden');
        }
    }

    // 자료 업로드/삭제 등 관리 시스템 버튼 제어 (필요 시 추가)
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    adminOnlyElements.forEach(el => {
        if (isAdmin) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    lucide.createIcons();
    lucide.createIcons();
    // Show user info in header
    const headerUserInfo = document.getElementById('header-user-info');
    if (headerUserInfo && user) {
        headerUserInfo.textContent = `[${user.branch_name}] ${user.name}님`;
    }

    console.log(`Permissions applied for ${user.role} (${user.branch_name})`);

    // Load admin stats if admin
    if (isAdmin) {
        renderAdminStats();
    }
}

export async function renderAdminStats() {
    const [branchStats, contractStats] = await Promise.all([
        getBranchStats(),
        getContractStats()
    ]);

    // Branch count
    const branchCountEl = document.getElementById('admin-branch-count');
    if (branchCountEl) {
        branchCountEl.textContent = `${branchStats.total}개`;
    }

    // Branch list
    const branchListEl = document.getElementById('admin-branch-list');
    if (branchListEl) {
        const entries = Object.entries(branchStats.branches).sort((a, b) => b[1] - a[1]);
        branchListEl.innerHTML = entries.map(([name, count]) => `
            <div class="flex items-center justify-between py-1.5 px-3 bg-slate-50 rounded-lg text-xs">
                <span class="text-slate-600 font-medium">${name}</span>
                <span class="text-slate-400 font-bold">${count}명</span>
            </div>
        `).join('');
    }

    // Contract total
    const contractTotalEl = document.getElementById('admin-contract-total');
    if (contractTotalEl) {
        contractTotalEl.textContent = `${contractStats.total}건`;
    }

    // Contract stats breakdown
    const contractStatsEl = document.getElementById('admin-contract-stats');
    if (contractStatsEl) {
        contractStatsEl.innerHTML = `
            <div class="bg-green-50 rounded-lg p-2.5 text-center">
                <div class="text-[10px] text-green-600 font-bold mb-0.5">완료</div>
                <div class="text-lg font-black text-green-700">${contractStats.completed}</div>
            </div>
            <div class="bg-amber-50 rounded-lg p-2.5 text-center">
                <div class="text-[10px] text-amber-600 font-bold mb-0.5">임시저장</div>
                <div class="text-lg font-black text-amber-700">${contractStats.draft}</div>
            </div>
        `;

        // Per-branch breakdown
        const perBranchEntries = Object.entries(contractStats.perBranch).sort((a, b) => b[1] - a[1]);
        if (perBranchEntries.length > 0) {
            const branchHtml = perBranchEntries.map(([name, count]) => `
                <div class="flex items-center justify-between py-1.5 px-3 bg-slate-50 rounded-lg text-xs">
                    <span class="text-slate-600 font-medium">${name}</span>
                    <span class="text-slate-400 font-bold">${count}건</span>
                </div>
            `).join('');
            contractStatsEl.insertAdjacentHTML('afterend', `
                <div class="mt-3 space-y-1">
                    <p class="text-[10px] text-slate-400 font-bold mb-1">지점별</p>
                    ${branchHtml}
                </div>
            `);
        }
    }
}

export async function renderNotices() {
    const noticeList = document.getElementById('notice-list');
    if (!noticeList) return;

    const notices = await getNotices();
    noticeList.innerHTML = '';

    if (notices.length === 0) {
        noticeList.innerHTML = '<div class="p-6 text-center text-slate-400">등록된 공지사항이 없습니다.</div>';
        return;
    }

    notices.forEach(notice => {
        const typeClass = getNoticeTypeClass(notice.type);
        const item = document.createElement('div');
        item.className = 'p-6 hover:bg-slate-50 transition cursor-pointer border-b border-slate-100 last:border-0';
        item.innerHTML = `
            <div class="flex items-center gap-2 mb-2">
                <span class="${typeClass} text-[10px] font-bold px-2 py-1 rounded">${notice.typeLabel || '일반'}</span>
                <span class="text-sm text-slate-400">${notice.date}</span>
            </div>
            <h4 class="text-lg font-bold text-slate-800 mb-2">${notice.title}</h4>
            <p class="text-sm text-slate-500 line-clamp-2">${notice.content}</p>
        `;
        item.addEventListener('click', () => openNoticeModal(notice));
        noticeList.appendChild(item);
    });
}

function getNoticeTypeClass(type) {
    switch (type) {
        case 'must-read': return 'bg-red-50 text-red-500';
        case 'update': return 'bg-slate-100 text-slate-500';
        default: return 'bg-slate-100 text-slate-500';
    }
}

export async function renderHomeNotices() {
    const list = document.getElementById('home-notice-list');
    if (!list) return;

    const notices = await getNotices();
    list.innerHTML = '';

    if (notices.length === 0) {
        list.innerHTML = '<div class="p-6 text-center text-slate-400"><p class="text-sm">공지사항이 없습니다.</p></div>';
        return;
    }

    // Take top 3
    const recentNotices = notices.slice(0, 3);

    recentNotices.forEach((notice, index) => {
        const typeClass = getNoticeTypeClass(notice.type);
        const li = document.createElement('li');

        // Add border-t class to items except the first one
        const borderClass = index > 0 ? 'border-t border-slate-100' : '';

        li.className = `cursor-pointer group p-4 hover:bg-slate-50 rounded-2xl transition ${borderClass}`;
        li.innerHTML = `
            <div class="flex items-center gap-2 mb-1">
                <span class="${typeClass} text-[10px] font-bold px-1.5 py-0.5 rounded">${notice.typeLabel || '일반'}</span>
                <span class="text-xs text-slate-400">${notice.date}</span>
            </div>
            <p class="text-base text-slate-700 font-bold group-hover:text-juo-orange transition line-clamp-1">${notice.title}</p>
        `;

        // Click to open detail modal
        li.addEventListener('click', () => openNoticeModal(notice));

        list.appendChild(li);
    });
}

function openNoticeModal(notice) {
    const modal = document.getElementById('notice-modal');
    const title = document.getElementById('notice-modal-title');
    const content = document.getElementById('notice-modal-content');
    const date = document.getElementById('notice-modal-date');
    const badge = document.getElementById('notice-modal-badge');
    const closeBtn = document.getElementById('notice-modal-close');

    if (!modal) return;

    title.textContent = notice.title;
    content.textContent = notice.content;
    date.textContent = notice.date;
    badge.textContent = notice.typeLabel || '일반';

    // Reset badge classes
    badge.className = `px-2 py-1 rounded text-xs font-bold ${getNoticeTypeClass(notice.type)}`;

    // Show modal
    modal.classList.remove('hidden');
    // Trigger animation
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    });

    const closeModal = () => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.remove('scale-100');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    };

    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

// Handle browser back/forward
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.tabId) {
        switchTab(event.state.tabId, false);
    } else {
        // Handle initial state or default to home
        switchTab('home', false);
    }
});
