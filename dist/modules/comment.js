"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = comment;
const __1 = require("..");
const delay_1 = __importDefault(require("../helper/delay"));
const gohome_1 = __importDefault(require("../helper/gohome"));
const scrapping_1 = __importDefault(require("./scrapping"));
async function comment(threadMsg) {
    // make a prompt with {threadMsg}
    const templatePrompt = 'Ini adalah postingan di twitter. Tanggapilah dengan jawaban membantu jika konteksnya adalah postingan serius, tanggapilah dengan jawaban lucu jika konteksnya adalah postingan lucu atau humor. Gunakan bahasa indonesia yang lugas, tidak bertele-tele, dan seperti manusia di sosial media apda umumnya. Tanggapi dengan jawaban yang menjawab, bukan berupa template yang saya harus mengisi sendiri. Tanggapi dengan maksimal 250 huruf.';
    const tweetPrompt = `${templatePrompt}: ${threadMsg}`;
    console.log(`comment-1: ${tweetPrompt}`);
    // get response from Gemini AI
    try {
        const result = await __1.geminiModel.generateContent(tweetPrompt);
        console.log('comment-2');
        const response = result.response;
        console.log('comment-3');
        const answerText = response.text();
        console.log('comment-4: ', answerText);
        // put the comment using puppeteer
        // type R on keyboard to reply on the post
        await __1.page.keyboard.type('R');
        await (0, delay_1.default)(2000);
        console.log('comment-5');
        await __1.page.keyboard.type(answerText, { delay: 100 });
        await (0, delay_1.default)(2000);
        console.log('comment-6');
        // type ctrl + enter to post
        __1.page.keyboard.down('ControlLeft');
        __1.page.keyboard.press('Enter');
        await (0, delay_1.default)(2000);
        await __1.page.keyboard.up('ControlLeft');
        await (0, delay_1.default)(2000);
        await __1.page.screenshot({ path: 'comment.png' });
        console.log('comment-7: COMMENTED!');
    }
    catch (error) {
        console.log(error);
        // refresh to main page with newly freshed timeline and rescrapping
        await (0, gohome_1.default)();
        await (0, delay_1.default)(10000);
        (0, scrapping_1.default)();
    }
}
