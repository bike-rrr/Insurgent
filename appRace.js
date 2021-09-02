const puppeteer = require("puppeteer")
const vonageFunctions = require('./vonage.js');
const textMessage = vonageFunctions.textNumber;

const URL = 'https://www.evil-bikes.com/a/bikes/insurgent';

async function scrape() {

    const getData = new Promise(async (resolve, reject) => {

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(URL)

        const sizesAvailability = await page.evaluate(() => {
            const sizeList = document.querySelector("#size");

            if (sizeList) {
                const sizes = [];
                for (let i = 0; i < sizeList.length; i++) {
                    sizes.push(sizeList[i].innerText)
                }
                const reFormatted = sizes.map(item => item = item.replace(/\s+/g, ' ').trim().toLowerCase());
                return reFormatted;
            }
        })
        await browser.close();

        if (sizesAvailability) {
            resolve(sizesAvailability)
        } else {
            reject("query FAILED");
        }
    });

    const time_Limit = new Promise(resolve => {
        setTimeout(() => {
            resolve('too slow')
        }, 5000)
    });

    return Promise.race([getData, time_Limit]);
}

let inventory = ["fasle", "false", "false", "false"];

async function main() {

    scrape().then((resp) => {
        if (resp === "couldnt queryselect element") {
            console.log('query failed');
            console.log('--------------------')
            setTimeout(main, 5000);
        }
        else if (resp === "too slow") {
            console.log("too slow");
            console.log('--------------------')
            setTimeout(main, 5000);
        }
        // check each size
        else {
            for (let i = 0; i < resp.length; i++) {
                if (resp[i].includes("out of stock")) {
                    console.log(resp[i]);
                }
                else if (inventory[i] === "false") {
                    console.log("in stock")
                    textMessage('https://www.evil-bikes.com/a/bikes/insurgent');
                    inventory[i] = true;
                }
            }
            setTimeout(main, 5000);
            console.log('--------------------')
        }
    }).catch((err) => {
        console.log(err);
        console.log("--------------------------------------------------------------------")
        setTimeout(main, 5000);
    })
}
// run program
main()
