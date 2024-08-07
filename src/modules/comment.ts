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
    await page.screenshot({ path: 'ss/comment-4.png' })

    // put the comment using puppeteer
    try {
        // ERROR
        // const inputBtn = await page.waitForSelector('::-p-xpath(//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/div/div/div[2]/div[1]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div/div/div/div/div/div[1]/div/div/div/div/div/div[2]/div/div/div/div)');
        const inputBtn = await page.waitForSelector('::-p-xpath(//*[@id="id__q3de2c8ns8n"]/div[1]/button')
        await delay(2000)
        console.log('comment-5')
        await inputBtn?.click();
    } catch (erroc) {
        console.log(erroc)
    }
    await page.screenshot({ path: 'ss/comment-5.png' })
    await delay(2000)
    console.log('comment-6')
    await page.screenshot({ path: 'ss/comment-6.png' })
    await page.keyboard.type(answerText, { delay: 100 });
    await delay(2000)
    console.log('comment-7')
    await page.screenshot({ path: 'ss/comment-7.png' })
    try {
        // ERROR
        // const postBtn = await page.waitForSelector('::-p-xpath(//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div/div/div/div/div[2]/div[2]/div/div/div/div[2]/div[2]/div[2]/div/div/div/button)');
        const postBtn = await page.waitForSelector('::-p-xpath(//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div/div[3]/div[2]/div[2]/div/div/div/div[2]/div[2]/div/div/div/button)');
        await delay(2000)
        await postBtn?.click()
    } catch (error) {
        console.log(error)
    }
    console.log('comment-8')
    await page.screenshot({ path: 'ss/comment-8.png' })
    await delay(2000)
    console.log('comment-9: COMMENTED!')
    await page.screenshot({ path: 'ss/comment-9.png' })
}