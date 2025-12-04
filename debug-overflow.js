const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page.goto('http://localhost:3000/contact.html');
  await page.waitForLoadState('networkidle');
  
  const elements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    return all
      .filter(el => el.scrollWidth > 375)
      .map(el => ({
        tag: el.tagName,
        class: el.className,
        id: el.id,
        scrollWidth: el.scrollWidth,
        offsetWidth: el.offsetWidth,
        clientWidth: el.clientWidth
      }))
      .slice(0, 15);
  });
  
  console.log('Elements wider than 375px:');
  console.log(JSON.stringify(elements, null, 2));
  
  await browser.close();
})();
