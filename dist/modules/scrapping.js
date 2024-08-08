"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = scrapping;
const __1 = require("..");
const delay_1 = __importDefault(require("../helper/delay"));
const gohome_1 = __importDefault(require("../helper/gohome"));
const comment_1 = __importDefault(require("./comment"));
async function scrapping() {
    // get top thread that is not our thread
    // and then open it
    const articleElements = await __1.page.$$('article');
    console.log('scrapping-1');
    let threadMsgText = '';
    await (0, delay_1.default)(2000);
    for (const article of articleElements) {
        console.log('scrapping-2');
        const textContent = await article.evaluate(el => el.textContent);
        console.log('scrapping-3');
        if (!textContent?.includes(`@${process.env.USERNAME_TWT}`)) {
            console.log('scrapping-4');
            await article?.click();
            console.log('scrapping-5');
            await (0, delay_1.default)(2000);
            threadMsgText = await __1.page.evaluate(() => {
                return document.querySelector('div[data-testid="tweetText"] span')?.innerHTML || '';
            });
            console.log('scrapping-6');
            await (0, delay_1.default)(2000);
            break;
        }
    }
    // answer the thread
    await (0, comment_1.default)(threadMsgText);
    await (0, delay_1.default)(3000);
    console.log('scrapping-7');
    // if any popup with close button -> click close
    const buttonCount = await __1.page.$$eval('button[aria-label="Close"]', (buttons) => buttons.length);
    console.log('scrapping-8');
    const isAnyCloseBtn = buttonCount > 0;
    if (isAnyCloseBtn) {
        await __1.page.locator('button[aria-label="Close"]').click();
        await (0, delay_1.default)(2000);
        console.log('scrapping-9": waiting for 5 minutes to repeat the process');
    }
    // wait for 10 minutes
    await (0, delay_1.default)(600000);
    // refresh to main page with newly freshed timeline
    await (0, gohome_1.default)();
    console.log('scrapping-10');
    // repeat
    console.log('scrapping-11: SCRAPPING FINISHED!');
    await (0, delay_1.default)(10000);
    // TODO: do we need to 'await' to prevent error ? 
    scrapping();
}
