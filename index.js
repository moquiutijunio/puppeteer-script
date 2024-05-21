const xlsx = require("xlsx");
const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');

console.log('\nBem vindo ao Bot conversor 🤖💰');

async function robo() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const valorParaConversao = readlineSync.question(`Informe o valor para conversão: `) || 1;
  const moedaBase = readlineSync.question('Informe uma moeda base: ') || 'real';
  const moedaFinal = readlineSync.question('Informe uma moeda desejada: ') || 'dolar';

  const qualquerUrl = `https://www.google.com/search?q=${moedaBase}+para+${moedaFinal}&oq=${moedaBase}+para+${moedaFinal}&aqs=chrome.0.69i59j0l7.1726j0j4&sourceid=chrome&ie=UTF-8`;
  await page.goto(qualquerUrl);

  const moedaFinalCotacao = await page.evaluate(() => {
    return document.querySelector('.lWzCpb.a61j6').value;
  });

  const workbook = xlsx.utils.book_new();
  const resultadoConversao = parseInt(moedaFinalCotacao * valorParaConversao)
  const dataConversao = new Date();

  var worksheet_data = [
    [`Dia da cotação: `, `${dataConversao.toString()}`],
    [`Cotação ${moedaBase}: `, "1"],
    [`Cotação ${moedaFinal}: `, `${moedaFinalCotacao}`],
    [`${valorParaConversao} ${moedaBase} convertido: `, `${resultadoConversao} em ${moedaFinal}`]
  ];
  var worksheet = xlsx.utils.aoa_to_sheet(worksheet_data);

  worksheet['!cols'] = [
    {wch: 30},
    {wch: 30},
    {wch: 30},
    {wch: 30}
  ];

  xlsx.utils.book_append_sheet(workbook, worksheet);
  xlsx.writeFile(workbook, "result.xlsx");

  console.log(`Valor convertido e exportado para o arquivo result.xlsx\n`)

  await browser.close();
}

robo();