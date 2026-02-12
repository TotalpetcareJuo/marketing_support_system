// js/scenarioContent.js - HTML content for counseling scenarios

export const scenarioContent = {
    // Page 1: Pet Insurance Reality Check
    'membership-01': {
        title: '반려동물 의료비 현실',
        bodyClass: 'body--pet-insurance',
        html: `
    <div class="page page--insurance-premium">
        <!-- Main Content (Header Removed) -->
        <div class="draw-content" style="padding-top: 20px;">
            <!-- Left: Cost Grid -->
            <div class="disease-grid">
                <div class="disease-card disease-card--alert">
                    <div class="disease-icon"><i class="fa-solid fa-bone"></i></div>
                    <div class="disease-name">슬개골 탈구</div>
                    <div class="disease-cost">300<span class="disease-unit">만원~</span></div>
                </div>
                <div class="disease-card disease-card--alert">
                    <div class="disease-icon"><i class="fa-solid fa-disease"></i></div>
                    <div class="disease-name">종양/암 수술</div>
                    <div class="disease-cost">300<span class="disease-unit">만원~</span></div>
                </div>
                <div class="disease-card disease-card--alert">
                    <div class="disease-icon"><i class="fa-solid fa-crutch"></i></div>
                    <div class="disease-name">십자인대</div>
                    <div class="disease-cost">350<span class="disease-unit">만원~</span></div>
                </div>
                <div class="disease-card disease-card--warn">
                    <div class="disease-icon"><i class="fa-solid fa-cookie-bite"></i></div>
                    <div class="disease-name">이물 삼킴(개복)</div>
                    <div class="disease-cost">200<span class="disease-unit">만원~</span></div>
                </div>
                <div class="disease-card disease-card--warn">
                    <div class="disease-icon"><i class="fa-solid fa-allergies"></i></div>
                    <div class="disease-name">난치성 피부병</div>
                    <div class="disease-cost">200<span class="disease-unit">만원/년</span></div>
                </div>
                <div class="disease-card">
                    <div class="disease-icon"><i class="fa-solid fa-tooth"></i></div>
                    <div class="disease-name">치과/발치</div>
                    <div class="disease-cost">100<span class="disease-unit">만원~</span></div>
                </div>
            </div>

            <!-- Right: Reality Check -->
            <div class="reality-panel">
                <div class="reality-title">
                    갑작스러운 목돈 지출<br>
                    <span>보호자 100% 부담</span>입니다.
                </div>

                <div class="comparison-bar">
                    <div class="comp-label"><span>사람 (건강보험 O)</span><span>본인부담 20~30%</span></div>
                    <div class="bar-container">
                        <div class="bar-fill bar-fill--human"></div>
                    </div>
                </div>

                <div class="comparison-bar">
                    <div class="comp-label"><span>반려동물 (보험 X)</span><span>본인부담 100%</span></div>
                    <div class="bar-container">
                        <div class="bar-fill bar-fill--pet"></div>
                    </div>
                    <div class="burden-text">100%</div>
                    <div class="burden-desc">치료비 전액 본인 부담</div>
                </div>

                <div class="avg-total">
                    <div class="avg-label">반려동물 평생 양육 의료비 평균</div>
                    <div class="avg-value">1,300 <small>만원 + @</small></div>
                </div>
            </div>
        </div>
    </div>
        `
    },
    
    // Page 2: Cost Bridge
    'membership-02': {
        title: '양육비 브릿지',
        bodyClass: 'body--cost-bridge', 
        html: `
    <div class="page page--bridge">
        <div class="hook-text">의료비 1,300만원이 부담드시나요?</div>
        <div class="hook-highlight">
            사실 이 금액은<br>
            전체의 <span>20%</span>에 불과합니다.
        </div>

        <div class="chart-container">
            <div class="donut-chart">
                <div class="chart-center-text">
                    <span class="chart-center-label">평생 총 양육비</span>
                    <span class="chart-center-value">6,500</span>
                    <span class="chart-center-label">만원 + @</span>
                </div>
            </div>

            <!-- Labels -->
            <div class="chart-label label-medical">
                의료비 20%
            </div>

            <div class="chart-label label-others">
                일반 양육비 80%
                <div class="others-detail">사료/간식, 중성화, 용품, 기타 의료비 등</div>
            </div>
        </div>
    </div>
        `
    },

    // Page 3: Basic Medical
    'membership-03': {
        title: '기초 의료',
        bodyClass: 'body--care body--care-basic',
        html: `
    <div class="care-page">
        <div class="care-header">
            <h1 class="care-title">기초 의료 비교</h1>
            <p class="care-subtitle">입양 초기 필수적인 예방접종과 수술 지원 혜택</p>
        </div>

        <table class="care-table">
            <thead>
                <tr>
                    <th class="col-benefit care-table__th-benefit">혜택 상세 (Benefits)</th>
                    <th class="col-white white-col">화이트</th>
                    <th class="col-silver silver-col">실버</th>
                    <th class="col-vip vip-col">VIP</th>
                    <th class="col-gold gold-col">골드</th>
                </tr>
            </thead>
            <tbody>
                <!-- Vaccination -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-syringe"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">필수 예방접종</span>
                                <span class="benefit-price">시중가 약 300,000원</span>
                            </div>
                        </div>
                        <div class="care-note care-note--loose">
                            <div class="care-note__row"><span
                                    class="care-note__label">강아지:</span><span>종합백신
                                    1~6차</span></div>
                            <div class="care-note__row care-note__row--spaced"><span
                                    class="care-note__label">고양이:</span><span>종합백신
                                    1~3차</span></div>
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td><i class="fa-solid fa-minus cross-icon"></i></td>
                </tr>

                <!-- Antibody -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-vial"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">항체가 검사</span>
                                <span class="benefit-price">시중가 약 55,000원</span>
                            </div>
                        </div>
                        <div class="care-note">
                            접종 완료 후 항체 생성 여부 확인
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td><i class="fa-solid fa-check check-icon"></i></td>
                </tr>

                <!-- Neutering -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-notes-medical"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">중성화 수술</span>
                                <span class="benefit-price">시중가 약 550,000원</span>
                            </div>
                        </div>
                        <div class="care-note">
                            수술비 전액 지원 (5kg 미만 기준)
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td><i class="fa-solid fa-minus cross-icon"></i></td>
                </tr>

                <!-- Registration -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-id-card"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">동물등록 내장형칩</span>
                                <span class="benefit-price">시중가 약 100,000원</span>
                            </div>
                        </div>
                        <div class="care-note">
                            마이크로칩 시술 및 구청 등록 대행
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td><i class="fa-solid fa-minus cross-icon"></i></td>
                </tr>
            </tbody>
        </table>
    </div>
        `
    },
    
    // Page 4: Ongoing Care
    'membership-04': {
        title: '지속 건강 관리',
        bodyClass: 'body--care body--care-ongoing',
        html: `
    <div class="care-page">
        <div class="care-header">
            <h1 class="care-title">지속 건강 관리 비교</h1>
            <p class="care-subtitle">사랑하는 반려동물의 평생 건강을 위한 체계적인 관리 프로그램</p>
        </div>

        <table class="care-table">
            <thead>
                <tr>
                    <th class="col-benefit care-table__th-benefit">혜택 상세 (Benefits)</th>
                    <th class="col-white white-col">화이트</th>
                    <th class="col-silver silver-col">실버</th>
                    <th class="col-vip vip-col">VIP</th>
                    <th class="col-gold gold-col">골드</th>
                </tr>
            </thead>
            <tbody>
                <!-- Heartworm -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-heart-pulse"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">심장사상충 예방</span>
                                <span class="benefit-price">시중가 약 300,000원</span>
                            </div>
                        </div>
                        <div class="care-note">
                            연 12회 (매월) 정기 관리
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td><i class="fa-solid fa-check check-icon"></i></td>
                </tr>

                <!-- Vaccine + Rabies -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-syringe"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">종합백신 + 광견병</span>
                                <span class="benefit-price">시중가 약 100,000원</span>
                            </div>
                        </div>
                        <div class="care-note">
                            연 1회 추가 접종 (기초 의료 종료 후 전환)
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right">
                        <span class="care-badge care-badge--silver">2년차부터</span>
                    </td>
                    <td class="border-right">
                        <span class="care-badge care-badge--vip">2년차부터</span>
                    </td>
                    <td><i class="fa-solid fa-check check-icon"></i></td>
                </tr>

                <!-- Checkup -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-user-doctor"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">정기 건강검진</span>
                                <span class="benefit-price">25~60만원 상당</span>
                            </div>
                        </div>
                        <div class="care-note">
                            등급별 맞춤형 검진 프로그램 제공
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right">
                        <div class="care-stack">
                            <span class="vip-text care-badge--large">기초 검진 + 키트</span>
                            <span class="care-subnote">(25만원 상당)</span>
                        </div>
                    </td>
                    <td>
                        <div class="care-stack">
                            <span class="gold-text care-badge--large">종합 정밀 검진</span>
                            <span class="care-subnote care-subnote--gold">(60만원 상당)</span>
                        </div>
                    </td>
                </tr>

                <!-- Medical Support -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-hand-holding-medical"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">의료비 통합 마일리지</span>
                                <span class="benefit-price">연 500,000 Point</span>
                            </div>
                        </div>
                        <div class="care-note">
                            쇼핑몰 및 제휴처에서 현금처럼 사용 가능
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td>
                        <span class="gold-text">500,000 P</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
        `
    },
    
    // Page 5: Supply Support
    'membership-05': {
        title: '사료 용품 지원',
        bodyClass: 'body--care body--care-supply',
        html: `
    <div class="care-page">
        <div class="care-header">
            <h1 class="care-title">사료, 용품 지원</h1>
            <p class="care-subtitle">매달 필요한 필수 용품과 합리적인 쇼핑 혜택</p>
        </div>

        <table class="care-table">
            <thead>
                <tr>
                    <th class="col-benefit care-table__th-benefit">혜택 상세 (Benefits)</th>
                    <th class="col-white white-col">화이트</th>
                    <th class="col-silver silver-col">실버</th>
                    <th class="col-vip vip-col">VIP</th>
                    <th class="col-gold gold-col">골드</th>
                </tr>
            </thead>
            <tbody>
                <!-- Feed & Snack -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-box-open"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">유기농 사료 + 패드 + 간식</span>
                                <span class="benefit-price">시중가 약 720,000원 (연간)</span>
                            </div>
                        </div>
                        <div class="care-note care-note--loose">
                            매월 정기 배송 (연 12회)
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td><i class="fa-solid fa-check check-icon"></i></td>
                </tr>

                <!-- Juo Mall -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-store"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">주오몰 추가 할인</span>
                                <span class="benefit-price">멤버십 전용 혜택</span>
                            </div>
                        </div>
                        <div class="care-note">
                            용품 / 간식 / 영양제 상시 추가 할인
                        </div>
                    </td>
                    <td class="border-right"><span class="silver-text silver-text--muted">20%</span></td>
                    <td class="border-right"><span class="silver-text">20%</span></td>
                    <td class="border-right"><span class="vip-text">30% + 무료배송</span></td>
                    <td><span class="gold-text">30% + 무료배송</span></td>
                </tr>
            </tbody>
        </table>
    </div>
        `
    },
    
    // Page 6: Additional Benefits
    'membership-06': {
        title: '추가 혜택',
        bodyClass: 'body--care body--care-additional',
        html: `
    <div class="care-page">
        <div class="care-header">
            <h1 class="care-title">추가 혜택</h1>
            <p class="care-subtitle">전문 훈련사와 함께하는 교육과 프리미엄 케어 서비스</p>
        </div>

        <table class="care-table">
            <thead>
                <tr>
                    <th class="col-benefit care-table__th-benefit">혜택 상세 (Benefits)</th>
                    <th class="col-white white-col">화이트</th>
                    <th class="col-silver silver-col">실버</th>
                    <th class="col-vip vip-col">VIP</th>
                    <th class="col-gold gold-col">골드</th>
                </tr>
            </thead>
            <tbody>
                <!-- Visiting Training -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-chalkboard-user"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">방문 훈련 교육</span>
                                <span class="benefit-price">시중가 약 350,000원</span>
                            </div>
                        </div>
                        <div class="care-note care-note--loose">
                            전문 훈련사 방문 교육
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><i class="fa-solid fa-check check-icon"></i></td>
                    <td><i class="fa-solid fa-minus cross-icon"></i></td>
                </tr>

                <!-- Hygiene/Hoteling -->
                <tr>
                    <td>
                        <div class="benefit-info">
                            <div class="benefit-icon">
                                <i class="fa-solid fa-hotel"></i>
                            </div>
                            <div class="benefit-text">
                                <span class="benefit-name">위생+목욕 6회 / 호텔링 3회</span>
                                <span class="benefit-price">시중가 약 450,000원</span>
                            </div>
                        </div>
                        <div class="care-note">
                            전문 케어 서비스 제공
                        </div>
                    </td>
                    <td class="border-right"><i class="fa-solid fa-minus cross-icon"></i></td>
                    <td class="border-right"><span class="care-badge care-badge--neutral">2년차부터</span>
                    </td>
                    <td class="border-right"><span class="vip-text care-badge">2년차부터</span></td>
                    <td><i class="fa-solid fa-minus cross-icon"></i></td>
                </tr>
            </tbody>
        </table>
    </div>
        `
    },
    
    // Page 7: Membership Details
    'membership-07': {
        title: '멤버십 상세',
        bodyClass: '',
        html: `
    <div class="page">



        <!-- Main Content -->
        <div class="content">
            <!-- Comparison Table -->
            <div class="table-section">
                <table class="comp-table">
                    <thead>
                        <tr>
                            <th>혜택 항목</th>
                            <th class="th-market-price">책정 시중가</th>
                            <th class="th-white">화이트</th>
                            <th class="th-silver">실버</th>
                            <th class="th-vip">VIP</th>
                            <th class="th-gold">골드</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Basic Medical -->
                        <tr class="cat-row">
                            <td colspan="6"><i class="fa-solid fa-stethoscope cat-row__icon"></i> 기초 의료</td>
                        </tr>
                        <tr>
                            <td>필수 예방접종 (6회)</td>
                            <td>300,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                        </tr>
                        <tr>
                            <td>항체가 검사</td>
                            <td>55,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                        </tr>
                        <tr>
                            <td>중성화 수술 (5kg 미만)</td>
                            <td>550,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                        </tr>
                        <tr>
                            <td>동물등록 내장형칩</td>
                            <td>100,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                        </tr>

                        <!-- Ongoing Care -->
                        <tr class="cat-row">
                            <td colspan="6"><i class="fa-solid fa-heart-pulse cat-row__icon"></i> 지속 건강 관리</td>
                        </tr>
                        <tr>
                            <td>심장사상충 (12회)</td>
                            <td>300,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                        </tr>
                        <tr>
                            <td>종합백신 + 광견병<br><span class="table-cell--small">(기초 의료 종료 후)</span></td>
                            <td>100,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><span class="table-cell--phase">2년차부터</span></td>
                            <td><span class="table-cell--phase">2년차부터</span></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                        </tr>
                        <tr>
                            <td>기초 건강 검진</td>
                            <td>250,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                        </tr>
                        <tr>
                            <td>종합 건강검진 (초음파/X-ray)</td>
                            <td>700,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><span class="table-cell--phase table-cell--vip">2년차부터</span></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                        </tr>
                        <tr>
                            <td>질병/상해 의료비 지원</td>
                            <td>500,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><span class="highlight-value">연 50만원</span></td>
                        </tr>

                        <!-- Subscription -->
                        <tr class="cat-row">
                            <td colspan="6"><i class="fa-solid fa-box cat-row__icon"></i> 사료, 용품 지원
                            </td>
                        </tr>
                        <tr>
                            <td>유기농 사료 + 패드 + 수제 간식 배송</td>
                            <td>720,000원</td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                        </tr>
                        <tr>
                            <td>주오몰 추가 할인</td>
                            <td>-</td>
                            <td><span class="value">20%</span></td>
                            <td><span class="value">20%</span></td>
                            <td><span class="value value--compact table-cell--vip">30% +
                                    무료배송</span></td>
                            <td><span class="value value--compact table-cell--gold">30% +
                                    무료배송</span></td>
                        </tr>


                        <!-- Additional -->
                        <tr class="cat-row">
                            <td colspan="6"><i class="fa-solid fa-star cat-row__icon"></i> 추가 혜택
                            </td>
                        </tr>
                        <tr>
                            <td>방문 훈련 교육</td>
                            <td>350,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><i class="fa-solid fa-check check"></i></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                        </tr>
                        <tr>
                            <td>위생+목욕 6회 / 호텔링 3회
                            </td>
                            <td>450,000원</td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                            <td><span class="table-cell--phase">2년차부터</span></td>
                            <td><span class="table-cell--phase table-cell--vip">2년차부터</span></td>
                            <td><i class="fa-solid fa-minus cross"></i></td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- Cost Summary -->
            <div class="cost-section">
                <!-- White -->
                <div class="cost-card cost-card--white">
                    <div class="cost-card__name"><i class="fa-solid fa-circle cost-card__icon"></i>
                        화이트</div>
                    <div class="cost-row"><span>혜택 가치</span><span class="strikethrough">720,000원</span></div>
                    <!-- Monthly Emphasized -->
                    <div class="cost-monthly">50,000<span>원/월</span></div>
                    <div class="cost-annual">(1년 납입금 600,000원)</div>
                    <div class="cost-row cost-row--save"><span>⚡ 평균 양육비</span><span>12만원 SAVE</span>
                    </div>
                </div>
                <div class="cost-card cost-card--silver">
                    <div class="cost-card__name"><i class="fa-solid fa-circle cost-card__icon"></i>
                        실버</div>
                    <div class="cost-row"><span>혜택 가치</span><span class="strikethrough">1,670,000원</span></div>
                    <div class="cost-monthly">100,000<span>원/월</span></div>
                    <div class="cost-annual">(1년 납입금 1,200,000원)</div>
                    <div class="cost-row cost-row--save"><span>⚡ 평균 양육비</span><span>47만원 SAVE</span>
                    </div>
                </div>
                <!-- VIP -->
                <div class="cost-card cost-card--vip">
                    <div class="cost-card__name"><i class="fa-solid fa-crown cost-card__icon--crown"></i> VIP</div>
                    <div class="cost-row"><span>혜택 가치</span><span class="strikethrough">2,570,000원</span></div>
                    <div class="cost-monthly">160,000<span>원/월</span></div>
                    <div class="cost-annual">(1년 납입금 1,920,000원)</div>
                    <div class="cost-row cost-row--save"><span>⚡ 평균 양육비</span><span>65만원 SAVE</span>
                    </div>
                </div>
                <!-- Gold -->
                <div class="cost-card cost-card--gold">
                    <div class="cost-card__name"><i class="fa-solid fa-fire cost-card__icon--fire"></i>
                        골드</div>
                    <div class="cost-row"><span>혜택 가치</span><span class="strikethrough">2,375,000원</span></div>
                    <div class="cost-monthly">120,000<span>원/월</span></div>
                    <div class="cost-annual">(1년 납입금 1,440,000원)</div>
                    <div class="cost-row cost-row--save"><span>⚡ 평균 양육비</span><span>93.5만원 SAVE</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `
    }
};

// Helper function to get scenario content
export function getScenarioContent(contentId) {
    return scenarioContent[contentId] || null;
}
