console.log("SERVER START");

const express = require("express");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const app = express();

app.get("/", (req,res)=>{

res.send("OK");

});

app.get("/vcb", async (req,res)=>{

try{

const browser = await puppeteer.launch({

args: [
...chromium.args,
'--no-sandbox',
'--disable-setuid-sandbox',
'--disable-dev-shm-usage',
'--disable-http2', // ⭐ QUAN TRỌNG
'--disable-gpu'
],

executablePath: await chromium.executablePath(),

headless: chromium.headless,

});

const page = await browser.newPage();

// ⭐ giả lập browser thật
await page.setUserAgent(
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
);

await page.setExtraHTTPHeaders({

"accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7"

});

await page.goto(
"https://www.vietcombank.com.vn/vi-VN/KHCN/Cong-cu-Tien-ich/KHCN---Lai-suat",
{ waitUntil: "domcontentloaded", timeout: 120000 }
);

await page.waitForSelector("table");

const data = await page.evaluate(()=>{

return Array.from(document.querySelectorAll("table tbody tr"))
.map(r=>{

const t=r.querySelectorAll("td");

return {

month:t[0]?.innerText,
rate:t[1]?.innerText

};

});

});

await browser.close();

res.json(data);

}catch(e){

res.status(500).send(e.toString());

}

});

const PORT=process.env.PORT||3000;

app.listen(PORT,()=>console.log("RUNNING"));