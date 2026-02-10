import { supabase } from './supabase.js';
import { materials as mockMaterials, colorMap as mockColorMap, scenarios as mockScenarios } from './data.js';

// 기본적으로 Supabase를 시도하되, 실패 시 Mock 데이터를 사용합니다.
const USE_MOCK_DATA = false;

let materialsCache = null;
let colorMapCache = null;
let scenariosCache = null;

export async function getMaterials() {
    if (materialsCache) {
        return materialsCache;
    }

    if (!USE_MOCK_DATA && supabase) {
        try {
            const { data, error } = await supabase.from('materials').select('*').order('id', { ascending: true });
            if (error) throw error;
            if (data && data.length > 0) {
                materialsCache = data;
                return materialsCache;
            }
        } catch (err) {
            console.warn('Supabase fetch failed, falling back to mock data:', err);
        }
    }

    // Fallback to Mock Data
    await simulateNetworkDelay();
    materialsCache = [...mockMaterials];
    return materialsCache;
}

export async function getColorMap() {
    if (colorMapCache) {
        return colorMapCache;
    }

    // Color map은 현재 정적 UI 설정이므로 Mock 데이터를 기본으로 사용합니다.
    await simulateNetworkDelay(50);
    colorMapCache = { ...mockColorMap };
    return colorMapCache;
}

export async function getScenarios() {
    if (scenariosCache) {
        return scenariosCache;
    }

    if (!USE_MOCK_DATA && supabase) {
        try {
            const { data, error } = await supabase.from('scenarios').select('*');
            if (error) throw error;
            if (data && data.length > 0) {
                scenariosCache = data;
                return scenariosCache;
            }
        } catch (err) {
            console.warn('Supabase fetch failed (scenarios), falling back to mock data:', err);
        }
    }

    // Fallback to Mock Data
    await simulateNetworkDelay();
    scenariosCache = [...mockScenarios];
    return scenariosCache;
}

export async function getNotices() {
    const { notices: mockNotices } = await import('./data.js');

    if (!USE_MOCK_DATA && supabase) {
        try {
            const { data, error } = await supabase
                .from('notices')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform Supabase data to match UI expectation
            return data.map(notice => {
                const dateObj = new Date(notice.created_at);
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');

                return {
                    id: notice.id,
                    title: notice.title,
                    content: notice.content,
                    date: `${year}.${month}.${day}`,
                    type: notice.is_urgent ? 'must-read' : 'general',
                    typeLabel: notice.is_urgent ? '필독' : '일반'
                };
            });
        } catch (err) {
            console.error('Supabase fetch failed (notices):', err);
        }
    }

    // Fallback to Mock Data (Only on error or mock mode)
    return mockNotices || [];
}

export async function getMaterialById(id) {
    const materials = await getMaterials();
    return materials.find(m => m.id === id) || null;
}

export async function getScenarioById(id) {
    const scenarios = await getScenarios();
    return scenarios.find(s => s.id === id) || null;
}

export async function getMaterialsByCategory(category) {
    const materials = await getMaterials();
    if (category === 'all') {
        return materials;
    }
    return materials.filter(m => m.category === category);
}

export async function getContracts(branchFilter = null) {
    const { contracts: mockContracts } = await import('./data.js'); // 동적 임포트로 순환 참조 방지 가능성 고려

    if (!USE_MOCK_DATA && supabase) {
        try {
            let query = supabase.from('contracts').select('*');
            if (branchFilter) {
                query = query.eq('branch_name', branchFilter);
            }
            const { data, error } = await query;
            if (error) throw error;
            if (data) return data;
        } catch (err) {
            console.warn('Supabase fetch failed (contracts), falling back to mock data:', err);
        }
    }

    if (branchFilter) {
        return mockContracts.filter(c => c.branch === branchFilter);
    }
    return mockContracts;
}

export async function getUserProfile(userId) {
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
        console.error('Failed to fetch user profile:', err);
        return null;
    }
}

export function clearCache() {
    materialsCache = null;
    colorMapCache = null;
    scenariosCache = null;
}

export function invalidateMaterialsCache() {
    materialsCache = null;
}

function simulateNetworkDelay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateContractId() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const datePrefix = `C${yyyy}${mm}${dd}`;

    if (!USE_MOCK_DATA && supabase) {
        try {
            // Find the latest contract number for today
            const { data, error } = await supabase
                .from('contracts')
                .select('contract_number')
                .ilike('contract_number', `${datePrefix}%`)
                .order('contract_number', { ascending: false })
                .limit(1);

            if (error) throw error;

            let sequence = 1;
            if (data && data.length > 0) {
                const lastNum = data[0].contract_number;
                const lastSeq = parseInt(lastNum.slice(-3));
                if (!isNaN(lastSeq)) {
                    sequence = lastSeq + 1;
                }
            }
            return `${datePrefix}-${String(sequence).padStart(3, '0')}`;
        } catch (err) {
            console.error('Failed to generate contract ID:', err);
        }
    }

    // Fallback Mock Logic
    return `${datePrefix}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
}

export async function saveContract(contractData) {
    if (USE_MOCK_DATA) {
        // Mock Save
        console.log('Mock Save Contract:', contractData);
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, data: [{ ...contractData, id: contractData.id || 'mock-id-' + Date.now() }] };
    }

    if (!supabase) return { success: false, message: 'Supabase not initialized' };

    try {
        // Map frontend fields to DB columns
        const dbData = {
            id: contractData.id,
            contract_number: contractData.contract_number,
            branch_name: contractData.branch_name,
            status: contractData.status || 'draft',

            // Adopter Info
            adopter_name: contractData.adopter_name || '',
            adopter_phone: contractData.adopter_phone,
            adopter_address: contractData.adopter_address,
            // Mapping: adopter_id_num -> adopter_resident_no
            adopter_resident_no: contractData.adopter_id_num,

            // Pet Info
            // Mapping: pet_name is added via ALTER script
            pet_name: contractData.pet_name || '',
            pet_species: contractData.pet_species,
            pet_breed: contractData.pet_breed,
            pet_color: contractData.pet_color,
            pet_gender: contractData.pet_gender,
            pet_birthdate: contractData.pet_birthdate || null,
            // Mapping: pet_microchip_no -> pet_reg_number
            pet_reg_number: contractData.pet_microchip_no,
            // Mapping: pet_acquisition_date -> pet_intake_date
            pet_intake_date: contractData.pet_acquisition_date || null,

            // Terms & Other
            adoption_fee: parseInt(contractData.adoption_fee || '0'),
            adoption_date: new Date().toISOString().split('T')[0], // Default to today

            // Adoption Manager snapshot
            manager_name: contractData.manager_name,
            manager_phone: contractData.manager_phone,
            manager_branch_name: contractData.manager_branch_name,
            manager_branch_address: contractData.manager_branch_address,

            updated_at: new Date()
        };

        // Remove undefined/null keys if creating new
        if (!dbData.id) delete dbData.id;

        console.log('Saving contract data to Supabase:', dbData);

        const { data, error } = await supabase
            .from('contracts')
            .upsert(dbData)
            .select();

        if (error) throw error;

        if (error) throw error;

        // Invalidate cache
        // cachedContracts is not defined in this scope as a global var in the snippet provided in previous turns.
        // It seems it was intended to be a module-level variable but wasn't declared.
        // However, looking at getContracts, it uses local var or import. 
        // Let's just ignore cache invalidation for now or make it a global if we can see where it is.
        // From previous view, getContracts uses `mockContracts`.
        // There is no `cachedContracts` global variable declared in store.js based on previous view.

        // Correct fix: Remove the line causing error or declare it. 
        // Since we want to refresh, we can just rely on getContracts refetching if it doesn't cache Supabase data permanently.
        // getContracts implementation:
        // if (!USE_MOCK_DATA && supabase) { ... return data; } 
        // It doesn't seem to cache Supabase results in a variable named `cachedContracts`. 
        // It checks `branchFilter` and returns directly.

        return { success: true, data: data };
    } catch (err) {
        console.error('Save Contract Failed:', err);

        // Friendly Hint for missing column
        if (err.message && (err.message.includes('pet_name') || err.message.includes('column "pet_name"'))) {
            return { success: false, message: '데이터베이스에 "pet_name" 컬럼이 없습니다. contracts_schema.sql 스크립트를 실행하여 컬럼을 추가해주세요.' };
        }

        return { success: false, message: err.message };
    }
}
