const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page.goto('http://localhost:3000/contact.html');
  await page.waitForLoadState('networkidle');
  
  const details = await page.evaluate(() => {
    const contactForm = document.querySelector('.contact-form');
    const infoCard = document.querySelector('.info-card');
    const contactInfo = document.querySelector('.contact-info');
    const contactGrid = document.querySelector('.contact-grid');
    
    const getDetails = (el, name) => {
      if (!el) return null;
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        name,
        width: rect.width,
        offsetWidth: el.offsetWidth,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        paddingLeft: computed.paddingLeft,
        paddingRight: computed.paddingRight,
        marginLeft: computed.marginLeft,
        marginRight: computed.marginRight,
        boxSizing: computed.boxSizing,
        computedWidth: computed.width
      };
    };
    
    return {
      contactForm: getDetails(contactForm, 'contact-form'),
      infoCard: getDetails(infoCard, 'info-card'),
      contactInfo: getDetails(contactInfo, 'contact-info'),
      contactGrid: getDetails(contactGrid, 'contact-grid')
    };
  });
  
  console.log(JSON.stringify(details, null, 2));
  
  await browser.close();
})();
