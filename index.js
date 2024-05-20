const xlsx = require("xlsx");
const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');

console.log('Bem vindo ao Bot conversor 🤖💰');

async function robo() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const moedaBase = readlineSync.question('Informe uma moeda base: ') || 'dolar';
  const moedaFinal = readlineSync.question('Informe uma moeda desejada: ') || 'real';

  const qualquerUrl = `https://www.google.com/search?q=${moedaBase}+para+${moedaFinal}&oq=${moedaBase}+para+${moedaFinal}&aqs=chrome.0.69i59j0l7.1726j0j4&sourceid=chrome&ie=UTF-8`;
  await page.goto(qualquerUrl);

  const resultado = await page.evaluate(() => {
    return document.querySelector('.lWzCpb.a61j6').value;
  });

  const workbook = xlsx.utils.book_new();
  
  var worksheet_data = [
    ["Moeda Base: ", moedaBase],
    ["Moeda Desejada: ", moedaFinal],
    ["Resultado: ", `1 ${moedaBase} = ${resultado} ${moedaFinal}`]
  ];
  var worksheet = xlsx.utils.aoa_to_sheet(worksheet_data);
  const wscols = [
    {wch: 20},
    {wch: 20},
    {wch: 20},
    {wch: 20},
    {wch: 20},
    ];
    worksheet['!cols'] = wscols;

  xlsx.utils.book_append_sheet(workbook, worksheet);

  xlsx.writeFile(workbook, "result.xlsx");

  await browser.close();
}

robo();