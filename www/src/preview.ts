import * as results from './results.json';
const testList: TestList = results;

const testSelector: HTMLSelectElement | null = document.querySelector('#test_selector');
const browserSelector: HTMLSelectElement | null = document.querySelector('#browser_selector');
const previewImage: HTMLImageElement | null = document.querySelector('#preview_image');
const testLink: HTMLAnchorElement | null = document.querySelector('#test_link');

interface Test {
    windowWidth: number;
    windowHeight: number;
    platform: {
        name: string;
        version: string;
    };
    devicePixelRatio: number;
    id: string;
    screenshot: string;
}

type TestList = {[key: string]: Test[]};

function onTestChange(browserTests: Test[]) {
    if (browserSelector) {
        while (browserSelector.firstChild) {
            browserSelector.firstChild.remove();
        }
        browserTests.forEach((browser, i) => {
            if (i === 0) {
                onBrowserChange(browser);
            }
            const option = document.createElement('option');
            option.value = browser.id;
            option.textContent = browser.id.replace(/_/g, ' ');
            browserSelector.appendChild(option);
        });
    }
}

function onBrowserChange(browserTest: Test) {
    if (previewImage) {
        previewImage.src = `/results/${browserTest.screenshot}.png`;
        if (browserTest.devicePixelRatio > 1) {
            previewImage.style.transform = `scale(${1 / browserTest.devicePixelRatio})`;
        } else {
            previewImage.style.transform = '';
        }
    }
}

function selectTest(testName: string) {
    if (testLink) {
        testLink.textContent = testLink.href = testName;
    }
    onTestChange(testList[testName]);
}

const UP_ARROW = 38;
const DOWN_ARROW = 40;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

window.addEventListener('keydown', e => {
    if (testSelector && browserSelector) {
        if (e.keyCode === UP_ARROW) {
            testSelector.selectedIndex = Math.max(0, testSelector.selectedIndex - 1);
            const event = new Event('change');
            testSelector.dispatchEvent(event);
            e.preventDefault();
        } else if (e.keyCode === DOWN_ARROW) {
            testSelector.selectedIndex = Math.min(testSelector.children.length - 1, testSelector.selectedIndex + 1);
            const event = new Event('change');
            testSelector.dispatchEvent(event);
            e.preventDefault();
        } else if (e.keyCode === LEFT_ARROW) {
            browserSelector.selectedIndex = Math.max(0, browserSelector.selectedIndex - 1);
            const event = new Event('change');
            browserSelector.dispatchEvent(event);
            e.preventDefault();
        } else if (e.keyCode === RIGHT_ARROW) {
            browserSelector.selectedIndex = Math.min(
                browserSelector.children.length - 1,
                browserSelector.selectedIndex + 1
            );
            const event = new Event('change');
            browserSelector.dispatchEvent(event);
            e.preventDefault();
        }
    }
});

if (testSelector && browserSelector) {
    testSelector.addEventListener(
        'change',
        () => {
            selectTest(testSelector.value);
        },
        false
    );

    browserSelector.addEventListener(
        'change',
        () => {
            testList[testSelector.value].some(browser => {
                if (browser.id === browserSelector.value) {
                    if (browser) {
                        onBrowserChange(browser);
                    }
                    return true;
                }
                return false;
            });
        },
        false
    );

    const tests: string[] = Object.keys(testList);
    tests.forEach((testName, i) => {
        if (i === 0) {
            selectTest(testName);
        }
        const option = document.createElement('option');
        option.value = testName;
        option.textContent = testName;

        testSelector.appendChild(option);
    });
}
