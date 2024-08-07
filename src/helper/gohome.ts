import { page } from "..";

export default async function goHome() {
    await page.goto('https://twitter.com/')
}