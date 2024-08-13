import { ElementHandle, NodeFor } from "puppeteer";
import { page } from "..";
import delay from "../helper/delay";

export default async function login(email: string, username: string, password: string) {
    // go to twitter login page
    await page.goto('https://twitter.com/login');
    await delay(5000);
    
    // fill email
    await page.locator('input.r-30o5oe').fill(email);
    await delay(1000);
    console.log('login-1')
  
    // click next
    let nextBtn: ElementHandle<NodeFor<any>> | null = await page.waitForSelector('::-p-xpath(//*[@id="layers"]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/button[2])') || null;
    await nextBtn?.click()
    await delay(1000);
    console.log('login-2')
    
    // check if need to input username because unusual activity detected
    const spanElements = await page.$$('span');
    console.log('login-3')
    for (const span of spanElements) {
      const textContent = await span.evaluate(el => el.textContent);
      if (textContent?.includes('Enter your phone number or username')) {
        // fill username
        await page.locator('input.r-30o5oe').fill(username);
        await delay(1000);

        nextBtn = await page.waitForSelector('::-p-xpath(//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div/div/button)');
        await nextBtn?.click()
        await delay(1000);
        console.log('login-3')
        break;
      }
    }
    console.log('login-4')
    
    await page.locator('input[type="password"]').fill(password)
    await delay(1000);
    console.log('login-5')

    nextBtn = await page.waitForSelector('::-p-xpath(//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div[1]/div/div/button)');
    await nextBtn?.click()
    await delay(10000);
    console.log('login-6')
  
    // check if there is a closed button in popup -> close    
    const buttonCount = await page.$$eval('button[aria-label="Close"]', (buttons) => buttons.length);
    console.log('login-7')
    const isAnyCloseBtn = buttonCount > 0;
    console.log('login-8')
    if (isAnyCloseBtn) {
      await page.locator('button[aria-label="Close"]').click()
      await delay(1000);
      console.log('login-9')
    }
    console.log('login-10')
  
    // close bottom popup if any
    await delay(5000);
    try{
      const closeBtn = await page.waitForSelector('::-p-xpath(//*[@id="layers"]/div/div[1]/div/div/div/button)');
      await closeBtn?.click()
      console.log('login-11')
    } catch (e) {
      console.log(e)
    }

    // if redirected to login again -> relogin
    const span2Elements = await page.$$('span');
    console.log('login-12')
    for (const span of span2Elements) {
      const textContent = await span.evaluate(el => el.textContent);
      if (textContent?.includes('Happening now')) {
        await page.goto('https://twitter.com/login/');
        await delay(1000);
        await login(email, username, password);
        break;
      }
    }

    console.log("LOGGED IN..")
  }