"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = scrapping;
const __1 = require("..");
const delay_1 = __importDefault(require("../helper/delay"));
const comment_1 = __importDefault(require("./comment"));
async function scrapping() {
    // get top thread that is not our thread
    // and then open it
    const articleElements = await __1.page.$$('article');
    let threadMsgText = '';
    await (0, delay_1.default)(2000);
    for (const article of articleElements) {
        const textContent = await article.evaluate(el => el.textContent);
        if (!textContent?.includes(`@${process.env.USERNAME_TWT}`)) {
            await article?.click();
            await (0, delay_1.default)(2000);
            threadMsgText = await __1.page.evaluate(() => {
                return document.querySelector('div[data-testid="tweetText"] span')?.innerHTML || '';
            });
            await (0, delay_1.default)(2000);
        }
    }
    // answer the thread
    await (0, comment_1.default)(threadMsgText);
    await (0, delay_1.default)(3000);
    // wait for 5 minutes
    await (0, delay_1.default)(300000);
    // refresh to main page with newly freshed timeline
    await __1.page.goto('https://twitter.com/');
    // repeat
    await (0, delay_1.default)(10000);
    scrapping();
}
