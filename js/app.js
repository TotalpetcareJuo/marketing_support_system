import { supabase } from './supabase.js';
import { renderMaterials, openViewer, closeViewer, showPrev, showNext, switchTab, initData, applyPermissions, AppState } from './ui.js';

async function init() {
    await initData();
    lucide.createIcons();

    // Check Authentication & Load Profile
    await handleAuth();

    await renderMaterials();
    setupEventListeners();

    // Handle initial tab from hash or default to home
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'counseling', 'tools', 'contracts', 'admin'].includes(hash)) {
        switchTab(hash, false);
        history.replaceState({ tabId: hash }, '', `#${hash}`);
    } else {
        switchTab('home', false);
        history.replaceState({ tabId: 'home' }, '', '#home');
    }
}

async function handleAuth() {
    const loginOverlay = document.getElementById('login-overlay');

    try {
        if (!supabase) {
            console.warn('Supabase client missing. Showing login overlay for manual entry (Mock Mode disabled).');
            loginOverlay.classList.remove('hidden');
            loginOverlay.classList.add('flex');
            return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
            // Logged in
            loginOverlay.classList.add('hidden');
            loginOverlay.classList.remove('flex');

            const { user } = session;
            const profile = await fetchProfile(user.id);

            if (profile) {
                applyPermissions({
                    role: profile.role || 'store',
                    branch_name: profile.branch_name || 'Unknown Branch',
                    name: profile.user_name || user.email.split('@')[0]
                });
            } else {
                // Profile missing fallback
                console.warn('Profile not found for user:', user.id);
                applyPermissions({
                    role: 'store',
                    branch_name: 'Unknown Branch',
                    name: user.email ? user.email.split('@')[0] : 'User'
                });
            }
        } else {
            // Not logged in
            loginOverlay.classList.remove('hidden');
            loginOverlay.classList.add('flex');
        }
    } catch (err) {
        console.error('Authentication check failed:', err);
        loginOverlay.classList.remove('hidden');
        loginOverlay.classList.add('flex');
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');
    const loginBtn = e.target.querySelector('button');
    const originalBtnText = loginBtn.innerText;

    errorMsg.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.innerText = '로그인 중...';

    try {
        if (!supabase) throw new Error('Supabase client not initialized');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Login successful
        window.location.reload();
    } catch (err) {
        console.error('Login failed:', err);
        errorMsg.textContent = '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
        errorMsg.classList.remove('hidden');
        loginBtn.disabled = false;
        loginBtn.innerText = originalBtnText;
    }
}

async function handleLogout() {
    try {
        if (!supabase) {
            window.location.reload();
            return;
        }

        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        window.location.reload();
    } catch (err) {
        console.error('Logout failed:', err);
        alert('로그아웃 중 오류가 발생했습니다.');
    }
}

async function fetchProfile(userId) {
    try {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('profiles')
            .select('role, branch_name, user_name')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    } catch (err) {
        console.warn('Profile fetch failed, using defaults:', err);
        return null;
    }
}

function setupEventListeners() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    document.querySelectorAll('.lib-filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickActionClick);
    });

    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

    document.getElementById('viewer-close').addEventListener('click', closeViewer);

    // Login Form Listener
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    document.addEventListener('keydown', handleKeyDown);

    setupTouchSwipe();
}

function handleQuickActionClick(e) {
    const action = e.currentTarget.dataset.action;

    switch (action) {
        case 'go-to-adoption':
            switchTab('counseling');
            triggerFilterClick('adoption');
            break;
        case 'go-to-membership':
            switchTab('counseling');
            triggerFilterClick('membership');
            break;
        case 'go-to-contracts':
            switchTab('contracts');
            break;
        case 'go-to-tools':
            switchTab('tools');
            break;
    }
}

function triggerFilterClick(category) {
    const filterBtn = document.querySelector(`.lib-filter-btn[data-lib="${category}"]`);
    if (filterBtn) {
        filterBtn.click();
    }
}

async function handleFilterClick(e) {
    const btn = e.currentTarget;
    const category = btn.dataset.lib;

    document.querySelectorAll('.lib-filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-orange-50', 'text-juo-orange', 'border-juo-orange/20');
        b.classList.add('bg-white', 'text-slate-500', 'border-slate-200');
    });
    btn.classList.add('active', 'bg-orange-50', 'text-juo-orange', 'border-juo-orange/20');
    btn.classList.remove('bg-white', 'text-slate-500', 'border-slate-200');

    await renderMaterials(category);
}

function handleKeyDown(e) {
    const overlay = document.getElementById('viewer-overlay');
    if (overlay.classList.contains('hidden')) return;

    switch (e.key) {
        case 'Escape': closeViewer(); break;
        case 'ArrowLeft': showPrev(); break;
        case 'ArrowRight': showNext(); break;
    }
}

function setupTouchSwipe() {
    let touchStartX = 0;
    const viewerContent = document.getElementById('viewer-content');

    viewerContent.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewerContent.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? showNext() : showPrev();
        }
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', init);
