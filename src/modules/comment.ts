import { geminiModel, page } from ".."
import delay from "../helper/delay";

export default async function comment(threadMsg: string) {
    // make a prompt with {threadMsg}
    const templatePrompt = 'Ini adalah postingan di twitter. Tanggapilah dengan jawaban membantu jika konteksnya adalah postingan serius, tanggapilah dengan jawaban lucu jika konteksnya adalah postingan lucu atau humor. Gunakan bahasa indonesia yang lugas, tidak bertele-tele, dan seperti manusia di sosial media apda umumnya. Tanggapi dengan jawaban yang menjawab, bukan berupa template yang saya harus mengisi sendiri. Tanggapi dengan maksimal 250 huruf.'
    const tweetPrompt = `${templatePrompt}: ${threadMsg}`
    console.log(`comment-1: ${tweetPrompt}`)

    // get response from Gemini AI
    const result = await geminiModel.generateContent(tweetPrompt)
    console.log('comment-2')
    const response = result.response;
    console.log('comment-3')
    const answerText = response.text();
    console.log('comment-4: ', answerText)

    // put the comment using puppeteer
    const inputBtn = await page.waitForSelector('::-p-xpath(//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/div/div/div[2]/div[1]/div/div/div/div[2]/div[1]/div/div/div/div/div/div)');
    await delay(2000)
    console.log('comment-5')
    await inputBtn?.click();
    await delay(2000)
    console.log('comment-6')
    await page.keyboard.type(answerText, { delay: 100 });
    await delay(2000)
    console.log('comment-7')
    const postBtn = await page.waitForSelector('::-p-xpath(//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/div/div/div[2]/div[2]/div/div/div/div[2]/div[2]/div[2]/div/div/div/button)');
    await delay(2000)
    console.log('comment-8')
    await postBtn?.click()
    await delay(2000)
    console.log('comment-9: COMMENTED!')
}