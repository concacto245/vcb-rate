const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/", (req,res)=>{
res.send("VCB API is running");
});

app.get("/vcb", async (req, res) => {

try{

const browser = await puppeteer.launch({
args: ['--no-sandbox','--disable-setuid-sandbox'],
headless: "new"
});

const page = await browser.newPage();

await page.goto(
"https://www.vietcombank.com.vn/vi-VN/KHCN/Cong-cu-Tien-ich/KHCN---Lai-suat",
{ waitUntil: "networkidle2" }
);

await page.waitForSelector("table");

const data = await page.evaluate(()=>{

const rows=document.querySelectorAll("table tbody tr");

let result=[];

rows.forEach(r=>{

const cols=r.querySelectorAll("td");

result.push({
month: cols[0].innerText,
rate: cols[1].innerText
});

});

return result;

});

await browser.close();

res.json(data);

}catch(e){

res.send(e.toString());

}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>console.log("running"));