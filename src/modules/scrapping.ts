import { page } from "..";
import delay from "../helper/delay";
import goHome from "../helper/gohome";
import isBetween9AMAnd9PM from "../helper/workingHours";
import comment from "./comment";

export default async function scrapping() {
    // do task if on working hours (9am - 9pm)
    const isOnWorkingHours = isBetween9AMAnd9PM();
    if(!isOnWorkingHours){
        console.log('Oppps.. Not on working hours. Delay for 12 hours')
        await delay(12 * 60 * 60 * 1000)
        return;
    }

    // get top thread that is not our thread
    // and then open it
    const articleElements = await page.$$('article');
    console.log('scrapping-1')
    let threadMsgText: string = '';
    await delay(2000)
    for (const article of articleElements) {
      // only get if article is not contains image/video
      const articleHTML = await article.evaluate(el => el.innerHTML);
      console.log('scrapping-2')
      if (articleHTML?.includes('<div aria-label="Image"') || articleHTML?.includes('<div data-testid="videoComponent"')) {
        console.log("CONTAINS IMAGE/VIDEO! Will rescrape...")
        await goHome()
        await delay(10000)
        await scrapping()
        return;
      }

      console.log('scrapping-3')
      const textContent = await article.evaluate(el => el.textContent);
      console.log('scrapping-4')
      if (!textContent?.includes(`@${process.env.USERNAME_TWT}`)) {
        console.log('scrapping-5')
        await article?.click()
        console.log('scrapping-6')
        await delay(2000)
        threadMsgText = await page.evaluate(() => {
            return document.querySelector('div[data-testid="tweetText"] span')?.innerHTML || '';
        })
        console.log('scrapping-7')
        await delay(2000)
        break;
      }
    }

    // answer the thread
    await comment(threadMsgText)
    await delay(3000)
    console.log('scrapping-8: waiting for 10 minutes to repeat the process')

    // if any popup with close button -> click close
    const buttonCount = await page.$$eval('button[aria-label="Close"]', (buttons) => buttons.length);
    console.log('scrapping-9')
    const isAnyCloseBtn = buttonCount > 0;
    if (isAnyCloseBtn) {
        await page.locator('button[aria-label="Close"]').click()
        await delay(2000);
        console.log('scrapping-10')
    }

    // wait for 10 minutes
    await delay(600000)

    // refresh to main page with newly freshed timeline
    await goHome()
    console.log('scrapping-11')

    // repeat
    console.log('scrapping-12: SCRAPPING FINISHED!')
    await delay(10000)
    await scrapping()
}