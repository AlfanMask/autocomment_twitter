import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import login from './modules/login';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
import { GoogleGenerativeAI } from "@google/generative-ai"
import scrapping from './modules/scrapping';
require('dotenv').config()

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
    console.log(userAgent.random().toString());
    await page.setUserAgent(userAgent.random().toString());
    
    // Login
    const email: string = process.env.EMAIL_TWT || '';
    const username: string = process.env.USERNAME_TWT || '';
    const password: string = process.env.PASSWORD_TWT || '';
    await login(email, username, password)

    // start commenting
    await scrapping();
})

export { page, geminiModel };