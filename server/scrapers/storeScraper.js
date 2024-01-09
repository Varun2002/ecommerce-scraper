const puppeteer = require('puppeteer');
const random_useragent = require('random-useragent');
const proxyChain = require('proxy-chain')
const { v4: uuidv4 } = require('uuid'); // Destructure the import
require('dotenv').config()

let proxyURL = process.env.PROXY

let pageURL = null
let productSelector = null
let URLSelector = null
let titleSelector = null
let infoSelector = null
let multiplePages = false
let nextPageSelector = null
let products = null
let scanCount = null
let endScan = false


class StoreScraper {
    async startScan(store, count) {
        pageURL = store.pageURL;
        productSelector = store.productSelector;
        URLSelector = store.URLSelector;
        titleSelector = store.titleSelector;
        infoSelector = store.infoSelector;
        multiplePages = store.multiplePages;
        nextPageSelector = store.nextPageSelector;
        products = store.products;
        scanCount = count || 0;

        console.log(`Scanning ${pageURL}`)
        if (multiplePages) {
            await this.scanMultiplePages();
        } else {
            await this.scanSinglePage();
        }
        return products;
    }

    async scanSinglePage() {
        const proxy = await proxyChain.anonymizeProxy(proxyURL)

        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1500, height: 1200 },
            args: [`--proxy-server=${proxy}`]
        })

        const page = await browser.newPage();

        try {
            await page.setUserAgent(random_useragent.getRandom());
            await page.goto(pageURL, {
                waitUntil: "domcontentloaded"
            });

            let counter = 1;
            let scannedProducts = [];
            while (!endScan) {
                await page.waitForSelector(productSelector);
                const productContainers = await page.$$(productSelector);

                if (productContainers) {

                    for (const container of productContainers) {
                        const titleElement = await container.$(titleSelector);
                        const linkElement = await container.$(URLSelector);
                        const infoElement = await container.$(infoSelector);

                        let title = null;
                        let link = null;
                        let info = null;

                        if (infoElement) {
                            info = await infoElement.evaluate(x => x.innerText)
                        }

                        if (titleElement) {
                            title = await titleElement.evaluate(x => x.innerText);
                        }

                        if (linkElement) {
                            link = await linkElement.evaluate(a => a.getAttribute('href'));
                        }

                        const product = { id: uuidv4(), title, link, info };
                        scannedProducts.push(product);
                        counter++;
                    }

                    await this.saveData(scannedProducts);
                    scannedProducts = []
                } else {
                    return;
                }

                await page.mouse.wheel({ deltaY: 1000 });
                await page.waitForTimeout(100);
            }
            await this.saveData(scannedProducts);
        } catch (error) {
            console.log(error);
        } finally {
            await browser.close();
        }
    }

    async scanMultiplePages() {
    }

    async saveData(scannedProducts) {
        const uniqueProducts = scannedProducts.filter((scannedProduct) => {
            return !products.some((product) =>
                product.title === scannedProduct.title &&
                product.link === product.link
            );
        });

        products = products.concat(uniqueProducts);
        console.log(`Scanned ${products.length} products`);
    }

    endScan() {
        endScan = true;
        return("Scan ended")
    }
}

module.exports = StoreScraper;
