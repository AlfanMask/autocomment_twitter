"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiModel = exports.page = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const login_1 = __importDefault(require("./modules/login"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const generative_ai_1 = require("@google/generative-ai");
const scrapping_1 = __importDefault(require("./modules/scrapping"));
require('dotenv').config();
// middlewares
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
// instances
let page;
// connect to Gemini AI API
const getAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiModel = getAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
exports.geminiModel = geminiModel;
// launch browser
puppeteer_extra_1.default.launch({ headless: false }).then(async (browser) => {
    exports.page = page = await browser.newPage();
    page.setViewport({ height: 720, width: 1280 });
    // generate random user agents so not detected as the same user
    const userAgent = require('user-agents');
    console.log("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36");
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36");
    // Login
    const email = process.env.EMAIL_TWT || '';
    const username = process.env.USERNAME_TWT || '';
    const password = process.env.PASSWORD_TWT || '';
    await (0, login_1.default)(email, username, password);
    // start commenting
    await (0, scrapping_1.default)();
});
