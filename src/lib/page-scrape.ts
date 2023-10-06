import type { Browser, Page } from 'puppeteer-core';
import { connect } from 'puppeteer-core';
import { exec } from 'child_process';

async function openDevtools(page: any, client: any) {
    const frameId = page.mainFrame()._id
    const {url: inspectUrl} = await client.send('Page.inspect', {frameId: frameId});

    exec(`open -a "Google Chrome" "${inspectUrl}"`, error => {
        if (error)
            throw `Unable to open devtools: ${error}`
    });
}

export type ScrapeResult = { browser: Browser, page: Page}
export const scapePage = async(debug = false): Promise<ScrapeResult | undefined> => {
    
    console.log('connecting to browser', process.env.BRIGHT_UNBLOCK_PASSWORD);
    //const blocker = await PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch)

    const auth = `${process.env.BRIGHT_UNBLOCK_USER}:${process.env.BRIGHT_UNBLOCK_PASSWORD}`;

    let browser: Browser | undefined;
    try {
        browser = await connect({browserWSEndpoint: `wss://${auth}@${process.env.BRIGHT_UNBLOCK_HOST}`});
        const page = await browser.newPage();
    
        //blocker.enableBlockingInPage(page as any);

        await page.setRequestInterception(true);

        const rejectRequestPattern = [
            "googlesyndication.com",
            "/*.doubleclick.net",
            "/*.amazon-adsystem.com",
            "/*.adnxs.com",
        ];
        const blockList: Array<string> = [];
        
        page.on("request", (request) => {
            if (rejectRequestPattern.find((pattern) => request.url().match(pattern))) {
            blockList.push((request).url());
            request.abort();
             } else request.continue();
        });

        if (debug) {
            const client = await page.target().createCDPSession();
            await openDevtools(page, client);
        }
        page.setDefaultNavigationTimeout(10*60*1000);

        return { browser, page }
    } 
    catch(e) {
        console.error('run failed', e);
    }
}