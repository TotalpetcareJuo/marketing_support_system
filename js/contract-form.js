import { supabase } from './supabase.js';
import { saveContract, generateContractId, getUserProfile } from './store.js';

const AppState = {
    user: {
        role: 'store',
        branch_name: 'Unknown Branch',
        id: null
    }
};

let currentContractStep = 1;
let currentContractId = null;
let currentContractNumber = null;

async function init() {
    lucide.createIcons();
    await handleAuth();
    setupEventListeners();
    autoFillManagerInfo();
    autoFillAdoptionDate();
}

async function handleAuth() {
    try {
        if (!supabase) {
            console.warn('Supabase client missing.');
            return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
            const { user } = session;
            const profile = await fetchProfile(user.id);

            if (profile) {
                AppState.user = {
                    id: user.id,
                    role: profile.role || 'store',
                    branch_name: profile.branch_name || 'Unknown Branch',
                    name: profile.user_name || user.email
                };
            }
        }
    } catch (err) {
        console.error('Auth error:', err);
    }
}

async function fetchProfile(userId) {
    if (!supabase) return null;
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Profile fetch failed:', err);
        return null;
    }
}

function setupEventListeners() {
    const btnNext = document.getElementById('btn-next-step');
    const btnPrev = document.getElementById('btn-prev-step');
    const btnSave = document.getElementById('btn-save-contract');
    const btnDraft = document.getElementById('btn-draft-save');
    const btnCancel = document.getElementById('btn-cancel');
    const btnPrint = document.getElementById('btn-print-contract');
    const btnClosePreview = document.getElementById('btn-close-preview');

    if (btnNext) btnNext.addEventListener('click', handleNextStep);
    if (btnPrev) btnPrev.addEventListener('click', handlePrevStep);
    if (btnSave) btnSave.addEventListener('click', saveContractForm);
    if (btnDraft) btnDraft.addEventListener('click', draftSaveContract);
    if (btnCancel) btnCancel.addEventListener('click', () => history.back());
    
    if (btnPrint) btnPrint.addEventListener('click', () => {
        document.body.classList.add('printing');
        setTimeout(() => {
            window.print();
            document.body.classList.remove('printing');
        }, 100);
    });
    
    if (btnClosePreview) btnClosePreview.addEventListener('click', () => {
        window.location.replace('materials.html#contracts');
    });
}

function autoFillAdoptionDate() {
    const form = document.getElementById('contract-form');
    if (!form) return;
    
    const today = new Date().toISOString().split('T')[0];
    const dateInput = form.querySelector('[name="pet_acquisition_date"]');
    if (dateInput && !dateInput.value) {
        dateInput.value = today;
    }
}

async function autoFillManagerInfo() {
    if (!AppState.user.id) return;
    
    const profile = await getUserProfile(AppState.user.id);
    if (!profile) return;
    
    const form = document.getElementById('contract-form');
    if (!form) return;
    
    const managerFields = {
        'manager_name': profile.user_name || AppState.user.name,
        'manager_branch_name': profile.branch_name || AppState.user.branch_name,
        'manager_branch_address': profile.branch_address || '',
        'manager_phone': profile.phone_number || ''
    };
    
    Object.entries(managerFields).forEach(([name, value]) => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input && !input.value && value) {
            input.value = value;
        }
    });
}

async function handleNextStep() {
    const currentStepDiv = document.querySelector(`.form-step[data-step="${currentContractStep}"]`);
    if (!currentStepDiv) return;

    const inputs = currentStepDiv.querySelectorAll('input, select, textarea');
    let isValid = true;

    for (const input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
            break;
        }
    }

    if (!isValid) return;

    if (currentContractStep < 3) {
        currentContractStep++;
        updateContractStepUI();
    }
}

function handlePrevStep() {
    if (currentContractStep > 1) {
        currentContractStep--;
        updateContractStepUI();
    }
}

async function saveContractForm() {
    const form = document.getElementById('contract-form');
    const formData = new FormData(form);
    const contractData = Object.fromEntries(formData.entries());

    contractData.branch_name = AppState.user.branch_name;

    if (currentContractId) {
        contractData.id = currentContractId;
        if (currentContractNumber) {
            contractData.contract_number = currentContractNumber;
        }
        contractData.updated_at = new Date();
    } else {
        contractData.contract_number = await generateContractId();
        contractData.status = 'completed';
        contractData.created_at = new Date();
    }

    const btnSave = document.getElementById('btn-save-contract');
    const originalText = btnSave.innerHTML;
    btnSave.disabled = true;
    btnSave.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin inline mr-1"></i> 저장 중...`;
    lucide.createIcons();

    const result = await saveContract(contractData);

    if (result.success) {
        showContractPreview(contractData);
    } else {
        console.error('Save failed:', result.message);
        alert(`저장에 실패했습니다: ${result.message || '알 수 없는 오류'}`);
    }

    btnSave.disabled = false;
    btnSave.innerHTML = originalText;
    lucide.createIcons();
}

async function draftSaveContract() {
    const form = document.getElementById('contract-form');
    const formData = new FormData(form);
    const contractData = Object.fromEntries(formData.entries());

    contractData.branch_name = AppState.user.branch_name;
    contractData.status = 'draft';

    if (currentContractId) {
        contractData.id = currentContractId;
        if (currentContractNumber) {
            contractData.contract_number = currentContractNumber;
        }
    } else {
        contractData.contract_number = await generateContractId();
    }

    const btnDraft = document.getElementById('btn-draft-save');
    const originalText = btnDraft.innerHTML;
    btnDraft.disabled = true;
    btnDraft.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin inline mr-1"></i> 저장 중...`;
    lucide.createIcons();

    const result = await saveContract(contractData);

    if (result.success) {
        alert('임시저장 되었습니다.');
        window.location.replace('materials.html#contracts');
    } else {
        alert(`임시저장 실패: ${result.message || '알 수 없는 오류'}`);
    }

    btnDraft.disabled = false;
    btnDraft.innerHTML = originalText;
    lucide.createIcons();
}

function updateContractStepUI() {
    const progressBar = document.getElementById('step-progress-bar');
    if (progressBar) {
        const percentage = ((currentContractStep - 1) / 2) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    document.querySelectorAll('.step-item').forEach(item => {
        const step = parseInt(item.dataset.step);
        const circle = item.querySelector('.step-circle');
        const label = item.querySelector('.step-label');

        if (step < currentContractStep) {
            item.classList.add('active');
            circle.classList.remove('bg-slate-100', 'text-slate-400', 'border-slate-300');
            circle.classList.add('bg-juo-orange', 'text-white', 'border-juo-orange');
            circle.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
            label.classList.add('text-juo-orange');
        } else if (step === currentContractStep) {
            item.classList.add('active');
            circle.classList.remove('bg-slate-100', 'text-slate-400', 'border-slate-300', 'bg-juo-orange', 'text-white', 'border-juo-orange');
            circle.classList.add('bg-white', 'text-juo-orange', 'border-juo-orange', 'ring-4', 'ring-orange-100');
            circle.textContent = step;
            label.classList.add('text-juo-orange');
        } else {
            item.classList.remove('active');
            circle.className = 'w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-400 flex items-center justify-center text-xs font-bold transition-all duration-300 step-circle';
            circle.textContent = step;
            label.className = 'text-[10px] font-bold text-slate-400 uppercase step-label';
        }
    });

    document.querySelectorAll('.form-step').forEach(stepDiv => {
        if (parseInt(stepDiv.dataset.step) === currentContractStep) {
            stepDiv.classList.remove('hidden');
        } else {
            stepDiv.classList.add('hidden');
        }
    });

    const btnNext = document.getElementById('btn-next-step');
    const btnPrev = document.getElementById('btn-prev-step');
    const btnSave = document.getElementById('btn-save-contract');

    if (currentContractStep === 1) {
        btnPrev.classList.add('hidden');
        btnNext.classList.remove('hidden');
        btnSave.classList.add('hidden');
    } else if (currentContractStep === 2) {
        btnPrev.classList.remove('hidden');
        btnNext.classList.remove('hidden');
        btnSave.classList.add('hidden');
    } else if (currentContractStep === 3) {
        btnPrev.classList.remove('hidden');
        btnNext.classList.add('hidden');
        btnSave.classList.remove('hidden');
    }

    lucide.createIcons();
}

function showContractPreview(contractData) {
    const overlay = document.getElementById('contract-preview-overlay');
    if (!overlay) return;

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '-';
    };

    setText('preview-contract-number', `계약번호: ${contractData.contract_number || ''}`);
    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    setText('preview-date', dateStr);

    setText('preview-manager-branch', contractData.manager_branch_name || '');
    setText('preview-manager-address', contractData.manager_branch_address || '');
    setText('preview-manager-name', contractData.manager_name || '');
    setText('preview-manager-phone', contractData.manager_phone || '');

    setText('preview-pet-name', contractData.pet_name || '');
    setText('preview-pet-species', contractData.pet_species || '');
    setText('preview-pet-breed', contractData.pet_breed || '');
    setText('preview-pet-color', contractData.pet_color || '');

    const genderMap = { 'Male': '남아', 'Female': '여아', 'male': '남아', 'female': '여아' };
    setText('preview-pet-gender', genderMap[contractData.pet_gender] || contractData.pet_gender || '');
    setText('preview-pet-birthdate', contractData.pet_birthdate || '');
    setText('preview-pet-intake', contractData.pet_acquisition_date || contractData.pet_intake_date || '');

    setText('preview-adopter-name', contractData.adopter_name || '');
    setText('preview-adopter-phone', contractData.adopter_phone || '');
    setText('preview-adopter-id', contractData.adopter_id_num || contractData.adopter_resident_no || '');
    setText('preview-adopter-address', contractData.adopter_address || '');

    const fee = contractData.adoption_fee;
    setText('preview-adoption-fee', fee ? `${Number(fee).toLocaleString()}원` : '-');

    setText('preview-signer-name', contractData.adopter_name || '');
    setText('preview-manager-signer-name', contractData.manager_name || '');

    overlay.classList.remove('hidden');
    lucide.createIcons();
}

init();
