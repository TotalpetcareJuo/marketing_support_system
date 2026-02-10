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
                query = query.eq('branch', branchFilter);
            }
            const { data, error } = await query;
            if (error) throw error;
            if (data && data.length > 0) return data;
        } catch (err) {
            console.warn('Supabase fetch failed (contracts), falling back to mock data:', err);
        }
    }

    if (branchFilter) {
        return mockContracts.filter(c => c.branch === branchFilter);
    }
    return mockContracts;
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
