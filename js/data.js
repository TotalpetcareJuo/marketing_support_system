// 자료 데이터
export const materials = [
    { id: 1, title: '신규 입양 고객 상담', category: 'adoption', categoryLabel: '입양 상담', type: 'SCENARIO', scenarioId: 'scenario-1', size: 'Unknown', date: '2024.02.10', color: 'orange', icon: 'message-circle' },
    { id: 2, title: 'JUO 멤버십 안내', category: 'adoption', categoryLabel: '입양 상담', type: 'SCENARIO', scenarioId: 'scenario-membership', size: '7 Pages', date: '2024.02.12', color: 'blue', icon: 'shield-check' },
    { id: 3, title: '초보 견주를 위한 첫 2주 케어', category: 'adoption', categoryLabel: '입양 상담', type: 'SCENARIO', scenarioId: 'scenario-3', size: '5.8 MB', date: '2023.12.10', color: 'green', icon: 'book-open' },
    { id: 4, title: '매장 홍보용 이미지 소스', category: 'etc', categoryLabel: '기타', type: 'ZIP', size: '24.5 MB', date: '2023.11.05', color: 'slate', icon: 'image' },
    { id: 5, title: '배변 훈련 교육 영상', category: 'etc', categoryLabel: '교육 영상', type: 'MP4', size: '120 MB', date: '2024.01.02', color: 'purple', icon: 'play-circle' },
    { id: 6, title: '분양 계약서 양식', category: 'contract', categoryLabel: '계약 서식', type: 'PDF', size: '0.5 MB', date: '2024.01.10', color: 'red', icon: 'file-signature' },
    { id: 8, title: '반려동물 등록 안내', category: 'adoption', categoryLabel: '입양 상담', type: 'PDF', size: '1.8 MB', date: '2024.01.22', color: 'orange', icon: 'id-card' }
];

export const scenarios = [
    {
        id: 'scenario-1',
        title: '신규 입양 고객 상담',
        pages: [
            '/assets/placeholder-1.webp',
            '/assets/placeholder-2.webp',
            '/assets/placeholder-3.webp'
        ]
    },
    {
        id: 'scenario-2',
        title: '멤버십 업그레이드 제안',
        pages: [
            '/assets/placeholder-1.webp',
            '/assets/placeholder-2.webp'
        ]
    },
    {
        id: 'scenario-3',
        title: '반려동물 건강 관리 프로그램',
        pages: [
            '/assets/placeholder-1.webp',
            '/assets/placeholder-2.webp',
            '/assets/placeholder-3.webp',
            '/assets/placeholder-4.webp'
        ]
    },
    {
        id: 'scenario-membership',
        title: '멤버십 안내',
        type: 'HTML_SCENARIO',
        pages: [
            { type: 'html', contentId: 'membership-01', title: '펫 보험 안내' },
            { type: 'html', contentId: 'membership-02', title: '비용 브릿지' },
            { type: 'html', contentId: 'membership-03', title: '기초 의료' },
            { type: 'html', contentId: 'membership-04', title: '지속 건강 관리' },
            { type: 'html', contentId: 'membership-05', title: '사료 용품 지원' },
            { type: 'html', contentId: 'membership-06', title: '추가 혜택' },
            { type: 'html', contentId: 'membership-07', title: '멤버십 상세' }
        ]
    }
];

// 색상 매핑
export const colorMap = {
    orange: { bg: 'bg-orange-50', hover: 'group-hover:bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-50' },
    blue: { bg: 'bg-blue-50', hover: 'group-hover:bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-50' },
    green: { bg: 'bg-green-50', hover: 'group-hover:bg-green-100', text: 'text-green-600', badge: 'bg-green-50' },
    slate: { bg: 'bg-slate-100', hover: 'group-hover:bg-slate-200', text: 'text-slate-600', badge: 'bg-slate-100' },
    purple: { bg: 'bg-purple-50', hover: 'group-hover:bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-50' },
    red: { bg: 'bg-red-50', hover: 'group-hover:bg-red-100', text: 'text-red-600', badge: 'bg-red-50' }
};

// 계약 데이터 (Mock)
export const contracts = [
    { id: 'C20240210-001', customer: '김주오', pet: '폼피츠', branch: '가맹점 A', status: 'COMPLETED', date: '2024.02.10' },
    { id: 'C20240210-002', customer: '이주오', pet: '벤갈', branch: '가맹점 B', status: 'PENDING', date: '2024.02.10' },
    { id: 'C20240210-003', customer: '박주오', pet: '말티즈', branch: '가맹점 A', status: 'COMPLETED', date: '2024.02.09' }
];

