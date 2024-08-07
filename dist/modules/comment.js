"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = comment;
const __1 = require("..");
const delay_1 = __importDefault(require("../helper/delay"));
async function comment(threadMsg) {
    // make a prompt with {threadMsg}
    const templatePrompt = 'Ini adalah postingan di twitter. Tanggapilah dengan jawaban membantu jika konteksnya adalah postingan serius, tanggapilah dengan jawaban lucu jika konteksnya adalah postingan lucu atau humor. Gunakan bahasa indonesia yang lugas, tidak bertele-tele, dan seperti manusia di sosial media apda umumnya. Tanggapi dengan maksimal 250 huruf.';
    const tweetPrompt = `${templatePrompt}: ${threadMsg}`;
    // get response from Gemini AI
    const result = await __1.geminiModel.generateContent(tweetPrompt);
    const response = result.response;
    const answerText = response.text();
    // put the comment using puppeteer
    const inputBtn = await __1.page.waitForSelector('::-p-xpath(//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/div/div/div[2]/div[1]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div/div/div/div/div/div[1]/div/div/div/div/div/div[2]/div/div/div/div)');
    await (0, delay_1.default)(2000);
    await inputBtn?.click();
    await (0, delay_1.default)(2000);
    await __1.page.keyboard.type(answerText, { delay: 100 });
    await (0, delay_1.default)(2000);
    const postBtn = await __1.page.waitForSelector('::-p-xpath(//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/div/div/div[2]/div[2]/div/div/div/div[2]/div[2]/div[2]/div/div/div/button)');
    await (0, delay_1.default)(2000);
    await postBtn?.click();
    await (0, delay_1.default)(2000);
}
