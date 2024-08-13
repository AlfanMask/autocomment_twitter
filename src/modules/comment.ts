import { geminiModel, page } from ".."
import delay from "../helper/delay";
import goHome from "../helper/gohome";
import scrapping from "./scrapping";

export default async function comment(threadMsg: string) {
    // make a prompt with {threadMsg}
    const templatePrompt = 'Ini adalah postingan di twitter. Kamu adalah orang yang sedang bermain sosial media twitter berbahasa Indonesia. Tanggapilah postingan ini sebagai manusia bermain twitter dengan jawaban membantu jika konteksnya adalah postingan serius, tanggapilah dengan jawaban lucu jika konteksnya adalah postingan lucu, humor, atau tidak serius. Tanggapi dengan jawaban yang menjawab, bukan berupa template yang saya harus mengisi sendiri. Gunakan bahasa indonesia yang lugas bahasa seperti orang-orang indonesia di platform twitter. Tanggapi dengan maksimal 250 huruf.'
    const tweetPrompt = `${templatePrompt}: ${threadMsg}`
    console.log(`comment-1: ${tweetPrompt}`)

    // get response from Gemini AI
    try {
        const result = await geminiModel.generateContent(tweetPrompt)
        console.log('comment-2')
        const response = result.response;
        console.log('comment-3')
        const answerText = response.text();
        console.log('comment-4: ', answerText)

        // check the reponse text should be max 250 characters
        if (answerText.length > 250) {
            throw new Error('Answer text is too long. Max 250 characters allowed');
        }

        // put the comment using puppeteer
        // type R on keyboard to reply on the post
        await page.keyboard.type('R')
        await delay(2000)
        console.log('comment-5: is typing..')
    
        await page.keyboard.type(answerText, { delay: 100 });
        await delay(2000)
        console.log('comment-6')

        // type ctrl + enter to post
        page.keyboard.down('ControlLeft');
        page.keyboard.press('Enter');
        await delay(2000)
        await page.keyboard.up('ControlLeft');
    
        await delay(2000)
        await page.screenshot({ path: 'comment.png' });
        console.log('comment-7: COMMENTED!')
    } catch (error) {
        console.log(error)

        // refresh to main page with newly freshed timeline and rescrapping
        await goHome()
        await delay(10000)
        await scrapping()
    }

    
}