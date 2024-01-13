const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function searchForText(url, searchText, outputPath) {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  
  // Open a new page
  const page = await browser.newPage();
  
  // Navigate to the provided URL
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 }); // Set timeout to 0 to disable it

  // Search for the specified text on the webpage
  const result = await page.evaluate((searchText) => {
    const matchingTexts = [];
    const elements = document.querySelectorAll('h1');//*:not(script):not(style)
    
    elements.forEach(element => {
      const textContent = element.textContent.trim();
      if (textContent.includes(searchText)) {
        matchingTexts.push(textContent);
      }
    });

    return matchingTexts;
  }, searchText);

  // Close the browser
  await browser.close();

  // Write the result to a JSON file
  await fs.writeFile(outputPath, JSON.stringify(result, null, 2), 'utf-8');

  console.log('Matching texts:', result);
  console.log('Result written to:', outputPath);
}

module.exports = searchForText;
