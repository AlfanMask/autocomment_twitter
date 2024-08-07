"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = login;
const __1 = require("..");
const delay_1 = __importDefault(require("../helper/delay"));
async function login(email, username, password) {
    // go to twitter login page
    await __1.page.goto('https://twitter.com/login');
    await (0, delay_1.default)(5000);
    // fill email
    await __1.page.locator('input.r-30o5oe').fill(email);
    await (0, delay_1.default)(1000);
    console.log('login-1');
    // click next
    let nextBtn = await __1.page.waitForSelector('::-p-xpath(//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/button[2])') || null;
    await nextBtn?.click();
    await (0, delay_1.default)(1000);
    console.log('login-2');
    // check if need to input username because unusual activity detected
    const spanElements = await __1.page.$$('span');
    console.log('login-3');
    for (const span of spanElements) {
        const textContent = await span.evaluate(el => el.textContent);
        if (textContent?.includes('Enter your phone number or username')) {
            // fill username
            await __1.page.locator('input.r-30o5oe').fill(username);
            await (0, delay_1.default)(1000);
            nextBtn = await __1.page.waitForSelector('::-p-xpath(//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div/div/button)');
            await nextBtn?.click();
            await (0, delay_1.default)(1000);
            console.log('login-3');
            break;
        }
    }
    console.log('login-4');
    await __1.page.locator('input[type="password"]').fill(password);
    await (0, delay_1.default)(1000);
    console.log('login-5');
    nextBtn = await __1.page.waitForSelector('::-p-xpath(//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div[1]/div/div/button)');
    await nextBtn?.click();
    await (0, delay_1.default)(10000);
    console.log('login-6');
    // check if there is a closed button in popup -> close    
    const buttonCount = await __1.page.$$eval('button[aria-label="Close"]', (buttons) => buttons.length);
    console.log('login-7');
    const isAnyCloseBtn = buttonCount > 0;
    console.log('login-8');
    if (isAnyCloseBtn) {
        await __1.page.locator('button[aria-label="Close"]').click();
        await (0, delay_1.default)(1000);
        console.log('login-9');
    }
    console.log('login-10');
    // close bottom popup if any
    await (0, delay_1.default)(5000);
    try {
        const closeBtn = await __1.page.waitForSelector('::-p-xpath(//*[@id="layers"]/div/div[1]/div/div/div/button)');
        await closeBtn?.click();
        console.log('login-11');
    }
    catch (e) {
        console.log(e);
    }
    // if redirected to login again -> relogin
    const span2Elements = await __1.page.$$('span');
    console.log('login-12');
    for (const span of span2Elements) {
        const textContent = await span.evaluate(el => el.textContent);
        if (textContent?.includes('Happening now')) {
            await __1.page.goto('https://twitter.com/login/');
            await (0, delay_1.default)(1000);
            await login(email, username, password);
            break;
        }
    }
    console.log("LOGGED IN..");
}
