import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import login from './modules/login';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
import { GoogleGenerativeAI } from "@google/generative-ai"
import scrapping from './modules/scrapping';

// middlewares
puppeteer.use(StealthPlugin())

// instances
let page: Page;

// connect to Gemini AI API
const getAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiModel = getAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// launch browser
puppeteer.launch({ headless: false }).then(async (browser: Browser) => {
    page = await browser.newPage();
    page.setViewport({ height: 720, width: 1280 });

    // generate random user agents so not detected as the same user
    const userAgent = require('user-agents');
    console.log("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36");
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36");
    
    // Login
    await login()

    // start commenting
    await scrapping();
})

export { page, geminiModel };