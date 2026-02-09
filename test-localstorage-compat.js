// Playwright test for localStorage compatibility and migration
const { chromium } = require('playwright');

const LEGACY_DATA = {
    interval: 5,
    lastSaved: "2024-01-01 12:00:00",
    intro: {
        title: 'Legacy Title',
        subtitle: 'Legacy Subtitle'
    },
    shelterMode: false,
    notice: {
        enabled: true,
        title: '📢 Test Notice',
        content: '<p>Test content</p>'
    },
    slides: [
        {
            id: 12345,
            pet1: {
                hidden: false,
                image: '',
                status: '분양 가능',  // OLD status - should migrate to 🏠 가족 찾는 중
                breed: 'Legacy Breed 1',
                gender: '여아',
                birth: '2024.01.01',
                // OLD checklist format - should migrate to checklist array
                check1: 'Legacy Check 1',
                check2: 'Legacy Check 2',
                check3: '',  // Empty - should not be included
            },
            pet2: {
                hidden: false,
                image: '',
                status: '예약 대기',  // OLD status - should migrate to 🌷 가족 맞이 준비중
                breed: 'Legacy Breed 2',
                gender: '남아',
                birth: '2024.02.02',
                // OLD checklist format
                check1: 'Pet2 Check 1',
                check2: '',  // Empty - should not be included
                check3: 'Pet2 Check 3',
            }
        }
    ]
};

async function runTest() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const results = {
        testDate: new Date().toISOString(),
        storageKey: null,
        migrationResults: {},
        errors: []
    };

    try {
        // Step 1: Navigate to the page
        await page.goto('http://localhost:8000/display_system.html');
        await page.waitForLoadState('networkidle');

        // Step 2: Inject legacy data
        await page.evaluate((data) => {
            localStorage.setItem('juoStoreDisplayConfig_v3', JSON.stringify(data));
        }, LEGACY_DATA);

        // Step 3: Reload page to trigger migration
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Step 4: Verify the config object
        const configCheck = await page.evaluate(() => {
            return {
                hasConfig: typeof window.config !== 'undefined',
                storageKeyUsed: 'juoStoreDisplayConfig_v3',
                slidesCount: window.config.slides.length,
                pet1Status: window.config.slides[0]?.pet1?.status,
                pet2Status: window.config.slides[0]?.pet2?.status,
                pet1Checklist: window.config.slides[0]?.pet1?.checklist,
                pet2Checklist: window.config.slides[0]?.pet2?.checklist,
                hasCheck1: 'check1' in (window.config.slides[0]?.pet1 || {}),
                hasCheck2: 'check2' in (window.config.slides[0]?.pet1 || {}),
            };
        });

        results.storageKey = 'juoStoreDisplayConfig_v3';
        results.migrationResults = configCheck;

        // Validate migration
        results.migrationResults.statusMigrationCorrect = 
            configCheck.pet1Status === '🏠 가족 찾는 중' &&
            configCheck.pet2Status === '🌷 가족 맞이 준비중';

        results.migrationResults.checklistMigrationCorrect = 
            Array.isArray(configCheck.pet1Checklist) &&
            configCheck.pet1Checklist.length === 2 &&
            configCheck.pet1Checklist.includes('Legacy Check 1') &&
            configCheck.pet1Checklist.includes('Legacy Check 2');

        results.migrationResults.pet2ChecklistCorrect = 
            Array.isArray(configCheck.pet2Checklist) &&
            configCheck.pet2Checklist.length === 2 &&
            configCheck.pet2Checklist.includes('Pet2 Check 1') &&
            configCheck.pet2Checklist.includes('Pet2 Check 3');

        results.passed = 
            results.migrationResults.statusMigrationCorrect &&
            results.migrationResults.checklistMigrationCorrect &&
            results.migrationResults.pet2ChecklistCorrect;

        console.log('Test Results:', JSON.stringify(results, null, 2));

        // Take screenshot
        await page.screenshot({ 
            path: '.sisyphus/evidence/dod-localstorage-compat.png',
            fullPage: true 
        });

    } catch (error) {
        results.errors.push(error.message);
        results.passed = false;
        console.error('Test failed:', error);
    }

    await browser.close();

    // Write results to JSON file
    const fs = require('fs');
    fs.mkdirSync('.sisyphus/evidence', { recursive: true });
    fs.writeFileSync(
        '.sisyphus/evidence/dod-localstorage-compat.json',
        JSON.stringify(results, null, 2)
    );

    process.exit(results.passed ? 0 : 1);
}

runTest();
