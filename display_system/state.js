// ----------------------------------------------------
// State Module: default data, config initialization, migrations, shared state
// ----------------------------------------------------

const STORAGE_KEY = 'juoStoreDisplayConfig_v3';

const defaultData = {
    interval: 8,
    lastSaved: null,
    intro: {
        title: 'New Arrivals',
        subtitle: '이번 주 새로운 가족'
    },
    shelterMode: false, // New setting for Shelter Mode
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
                image: '', status: '🌷 가족 맞이 준비중', breed: '포메라니안', gender: '남아', birth: '2024.11.20',
                checklist: ['원구충 2회 완료', '기초 접종 진행 중', '부모견 정보 확인 가능']
            }
        }
    ]
};

function initializeConfig() {
    let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;

    // MIGRATION: Add shelterMode if missing
    if (typeof config.shelterMode === 'undefined') {
        config.shelterMode = false;
    }

    // MIGRATION: v2 to v3 (or missing checklist)
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
            } else if (status === '예약 대기' || status === '🌷 꽃단장 중') {
                slide[petKey].status = '🌷 가족 맞이 준비중';
            } else if (status === '완료' || status === '분양 완료') {
                slide[petKey].status = '🌻 행복한 집으로';
            }
        });
    });

    return config;
}

let config = initializeConfig();

let pendingConfig = JSON.parse(JSON.stringify(config));

let slideIntervalId = null;
let currentSlideIndex = 0;
let isPaused = false;
let pauseRemainingTime = 0;
let pauseStartTime = 0;
let controlsTimeoutId = null;

const State = {
    getConfig: () => config,

    saveConfig: (updatedConfig = config) => {
        config = updatedConfig;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    },

    resetToDefault: () => {
        config = JSON.parse(JSON.stringify(defaultData));
        pendingConfig = JSON.parse(JSON.stringify(defaultData));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    },

    getPendingConfig: () => pendingConfig,
    
    resetPendingConfig: () => {
        pendingConfig = JSON.parse(JSON.stringify(config));
    },
    
    commitPendingChanges: () => {
        config = JSON.parse(JSON.stringify(pendingConfig));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    },

    updateTimestamp: () => {
        const now = new Date();
        config.lastSaved = now.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    },

    getSlideIntervalId: () => slideIntervalId,
    setSlideIntervalId: (id) => { slideIntervalId = id; },

    getCurrentSlideIndex: () => currentSlideIndex,
    setCurrentSlideIndex: (idx) => { currentSlideIndex = idx; },

    getIsPaused: () => isPaused,
    setIsPaused: (paused) => { isPaused = paused; },

    getPauseRemainingTime: () => pauseRemainingTime,
    setPauseRemainingTime: (time) => { pauseRemainingTime = time; },

    getPauseStartTime: () => pauseStartTime,
    setPauseStartTime: (time) => { pauseStartTime = time; },

    getControlsTimeoutId: () => controlsTimeoutId,
    setControlsTimeoutId: (id) => { controlsTimeoutId = id; }
};

// Export to window for compatibility with existing inline handlers and non-module scripts
window.State = State;
window.config = config;
window.pendingConfig = pendingConfig;
window.slideIntervalId = slideIntervalId;
window.currentSlideIndex = currentSlideIndex;
window.isPaused = isPaused;
window.pauseRemainingTime = pauseRemainingTime;
window.pauseStartTime = pauseStartTime;
window.controlsTimeoutId = controlsTimeoutId;
