import { page } from "..";
import delay from "../helper/delay";
import goHome from "../helper/gohome";
import comment from "./comment";

export default async function scrapping() {
    // get top thread that is not our thread
    // and then open it
    const articleElements = await page.$$('article');
    console.log('scrapping-1')
    let threadMsgText: string = '';
    await delay(2000)
    for (const article of articleElements) {
      console.log('scrapping-2')
      const textContent = await article.evaluate(el => el.textContent);
      console.log('scrapping-3')
      if (!textContent?.includes(`@${process.env.USERNAME_TWT}`)) {
        console.log('scrapping-4')
        await article?.click()
        console.log('scrapping-5')
        await delay(2000)
        threadMsgText = await page.evaluate(() => {
            return document.querySelector('div[data-testid="tweetText"] span')?.innerHTML || '';
        })
        console.log('scrapping-6')
        await delay(2000)
        break;
      }
    }

    // answer the thread
    await comment(threadMsgText)
    await delay(3000)
    console.log('scrapping-7')

    // if any popup with close button -> click close
    const buttonCount = await page.$$eval('button[aria-label="Close"]', (buttons) => buttons.length);
    console.log('scrapping-8')
    const isAnyCloseBtn = buttonCount > 0;
    if (isAnyCloseBtn) {
        await page.locator('button[aria-label="Close"]').click()
        await delay(2000);
        console.log('scrapping-9": waiting for 5 minutes to repeat the process')
    }

    // wait for 5 minutes
    await delay(300000)

    // refresh to main page with newly freshed timeline
    await goHome()
    console.log('scrapping-10')

    // repeat
    console.log('scrapping-11: SCRAPPING FINISHED!')
    await delay(10000)
    scrapping()
}