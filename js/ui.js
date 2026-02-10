import { getMaterials, getColorMap, getMaterialsByCategory, getScenarioById, getContracts, getNotices } from './store.js';
import { DrawingManager } from './drawing.js';

let currentMaterialIndex = 0;
let filteredMaterials = [];
let materials = [];
let colorMap = {};
let drawingManager = null;
let currentScenario = null;
let currentScenarioPage = 0;

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
    pageIndicators: () => document.getElementById('page-indicators')
};

export async function initData() {
    [materials, colorMap] = await Promise.all([
        getMaterials(),
        getColorMap()
    ]);

    // Render Notices
    await Promise.all([
        renderNotices(),
        renderHomeNotices()
    ]);
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

    // Render Scenario Layout
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

    // Initialize Drawing Manager
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
export async function initStoryboard() {
    if (drawingManager) {
        // Already initialized, just resize for safety
        drawingManager.resize();
        return;
    }

    currentScenario = await getScenarioById('scenario-1');
    if (!currentScenario) return;

    currentScenarioPage = 0;

    // Set initial image
    const img = document.getElementById('sb-image');
    if (img) img.src = currentScenario.pages[0];

    // Initialize Drawing Manager
    const canvas = document.getElementById('sb-canvas');
    if (canvas) {
        drawingManager = new DrawingManager(canvas);

        // Toolbar Events
        const setupTool = (id, tool) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', () => {
                const isAlreadyActive = el.classList.contains('active');
                if (isAlreadyActive) {
                    toggleToolSettings(tool);
                } else {
                    drawingManager.setTool(tool);
                    updateStoryboardToolUI(tool);
                    hideAllToolSettings();
                }
            });
        };

        setupTool('sb-tool-pen', 'pen');
        setupTool('sb-tool-eraser', 'eraser');

        const clearBtn = document.getElementById('sb-tool-clear');
        if (clearBtn) clearBtn.addEventListener('click', () => {
            drawingManager.clear();
            hideAllToolSettings();
        });

        // Pen Settings: Color Swatches
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                const color = swatch.dataset.color;
                drawingManager.setColor(color);

                // UI Update
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
            });
        });

        // Pen Settings: Thickness Slider
        const penSlider = document.getElementById('pen-width-slider');
        if (penSlider) {
            penSlider.addEventListener('input', (e) => {
                const width = e.target.value;
                drawingManager.setLineWidth(width);
                document.getElementById('pen-width-value').textContent = `${width}px`;
            });
        }

        // Eraser Settings: Size Slider
        const eraserSlider = document.getElementById('eraser-size-slider');
        if (eraserSlider) {
            eraserSlider.addEventListener('input', (e) => {
                const size = e.target.value;
                drawingManager.setEraserSize(size);
                document.getElementById('eraser-size-value').textContent = `${size}px`;
            });
        }

        // Click outside to close settings
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#sb-tool-pen') &&
                !e.target.closest('#sb-tool-eraser') &&
                !e.target.closest('#sb-pen-settings') &&
                !e.target.closest('#sb-eraser-settings')) {
                hideAllToolSettings();
            }
        });

        // Navigation Events
        const prevBtn = document.getElementById('sb-prev-btn');
        if (prevBtn) prevBtn.addEventListener('click', sbShowPrev);

        const nextBtn = document.getElementById('sb-next-btn');
        if (nextBtn) nextBtn.addEventListener('click', sbShowNext);

        // Window Resize Handler
        window.addEventListener('resize', () => {
            if (drawingManager) drawingManager.resize();
        });

        updateStoryboardToolUI('pen');
        updateStoryboardPageIndicators();
    }
}

function toggleToolSettings(tool) {
    const penSettings = document.getElementById('sb-pen-settings');
    const eraserSettings = document.getElementById('sb-eraser-settings');

    if (tool === 'pen') {
        penSettings.classList.toggle('hidden');
        eraserSettings.classList.add('hidden');
    } else if (tool === 'eraser') {
        eraserSettings.classList.toggle('hidden');
        penSettings.classList.add('hidden');
    }
}

function hideAllToolSettings() {
    const penSettings = document.getElementById('sb-pen-settings');
    const eraserSettings = document.getElementById('sb-eraser-settings');
    if (penSettings) penSettings.classList.add('hidden');
    if (eraserSettings) eraserSettings.classList.add('hidden');
}

function updateStoryboardToolUI(activeTool) {
    const penBtn = document.getElementById('sb-tool-pen');
    const eraserBtn = document.getElementById('sb-tool-eraser');

    if (!penBtn || !eraserBtn) return;

    if (activeTool === 'pen') {
        penBtn.classList.add('active', 'bg-white', 'text-slate-900', 'shadow-sm');
        penBtn.classList.remove('text-slate-400', 'hover:bg-white/50');

        eraserBtn.classList.remove('active', 'bg-white', 'text-slate-900', 'shadow-sm');
        eraserBtn.classList.add('text-slate-400', 'hover:bg-white/50');
    } else {
        eraserBtn.classList.add('active', 'bg-white', 'text-slate-900', 'shadow-sm');
        eraserBtn.classList.remove('text-slate-400', 'hover:bg-white/50');

        penBtn.classList.remove('active', 'bg-white', 'text-slate-900', 'shadow-sm');
        penBtn.classList.add('text-slate-400', 'hover:bg-white/50');
    }
}

function sbShowPrev() {
    if (currentScenario && currentScenarioPage > 0) {
        currentScenarioPage--;
        updateStoryboardPage();
    }
}

function sbShowNext() {
    if (currentScenario && currentScenarioPage < currentScenario.pages.length - 1) {
        currentScenarioPage++;
        updateStoryboardPage();
    }
}

function updateStoryboardPage() {
    const img = document.getElementById('sb-image');
    if (img) img.src = currentScenario.pages[currentScenarioPage];

    // Clear canvas on page change (but NOT on tab switch)
    if (drawingManager) drawingManager.clear();

    updateStoryboardPageIndicators();
}

function updateStoryboardPageIndicators() {
    const container = document.getElementById('sb-page-indicators');
    if (!container || !currentScenario) return;

    container.innerHTML = '';
    currentScenario.pages.forEach((_, index) => {
        const dot = document.createElement('div');
        const isActive = index === currentScenarioPage;
        dot.className = `h-2 rounded-full transition-all ${isActive ? 'w-6 bg-juo-orange' : 'w-2 bg-slate-300'}`;
        container.appendChild(dot);
    });
}

function updateToolUI(activeTool) {
    const penBtn = document.getElementById('tool-pen');
    const eraserBtn = document.getElementById('tool-eraser');

    if (activeTool === 'pen') {
        penBtn.classList.add('active', 'bg-white', 'text-slate-900', 'shadow-lg');
        penBtn.classList.remove('bg-white/10', 'text-white');

        eraserBtn.classList.remove('active', 'bg-white', 'text-slate-900', 'shadow-lg');
        eraserBtn.classList.add('bg-white/10', 'text-white');
    } else {
        eraserBtn.classList.add('active', 'bg-white', 'text-slate-900', 'shadow-lg');
        eraserBtn.classList.remove('bg-white/10', 'text-white');

        penBtn.classList.remove('active', 'bg-white', 'text-slate-900', 'shadow-lg');
        penBtn.classList.add('bg-white/10', 'text-white');
    }
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

    // Cleanup Drawing Manager
    if (drawingManager) {
        drawingManager = null;
    }
    currentScenario = null;
    currentScenarioPage = 0;
}

function updatePageIndicators() {
    const container = elements.pageIndicators();
    container.innerHTML = '';

    if (currentScenario) {
        // Scenario Page Indicators
        currentScenario.pages.forEach((_, index) => {
            const dot = document.createElement('div');
            const isActive = index === currentScenarioPage;
            dot.className = `page-dot h-2 rounded-full transition-all ${isActive ? 'active w-6 bg-juo-orange' : 'w-2 bg-white/30'}`;
            container.appendChild(dot);
        });
    } else {
        // Material List Indicators
        filteredMaterials.forEach((_, index) => {
            const dot = document.createElement('div');
            const isActive = index === currentMaterialIndex;
            dot.className = `page-dot h-2 rounded-full transition-all ${isActive ? 'active w-6 bg-juo-orange' : 'w-2 bg-white/30'}`;
            container.appendChild(dot);
        });
    }
}

export function showPrev() {
    if (currentScenario) {
        if (currentScenarioPage > 0) {
            currentScenarioPage--;
            updateScenarioPage();
        }
    } else if (currentMaterialIndex > 0) {
        openViewer(currentMaterialIndex - 1);
    }
}

export function showNext() {
    if (currentScenario) {
        if (currentScenarioPage < currentScenario.pages.length - 1) {
            currentScenarioPage++;
            updateScenarioPage();
        }
    } else if (currentMaterialIndex < filteredMaterials.length - 1) {
        openViewer(currentMaterialIndex + 1);
    }
}

function updateScenarioPage() {
    const img = document.getElementById('scenario-image');
    if (img) {
        img.src = currentScenario.pages[currentScenarioPage];
    }

    // Clear canvas on page change
    if (drawingManager) {
        drawingManager.clear();
    }

    updatePageIndicators();
}

export function switchTab(tabId, pushState = true) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');

    document.querySelectorAll('section[id^="tab-"]').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`tab-${tabId}`)?.classList.remove('hidden');

    if (tabId === 'counseling') {
        // Initialize Storyboard Mode
        initStoryboard();
    }

    if (tabId === 'contracts') {
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

        const isCompleted = contract.status === 'COMPLETED';
        const statusLabel = isCompleted ? '계약 완료' : '서명 대기';
        const statusClass = isCompleted ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600';

        item.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <i data-lucide="${isCompleted ? 'file-check' : 'file-signature'}" class="w-5 h-5"></i>
                </div>
                <div>
                    <div class="font-bold text-slate-700">${contract.id}</div>
                    <div class="text-xs text-slate-400">고객: ${contract.customer} • ${contract.pet} • <span class="text-juo-orange">${contract.branch}</span></div>
                </div>
            </div>
            <span class="px-2 py-1 rounded-lg ${statusClass} text-[10px] font-black uppercase tracking-tight">${statusLabel}</span>
        `;
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
