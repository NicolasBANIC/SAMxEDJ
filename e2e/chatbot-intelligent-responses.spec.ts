import { test, expect } from '@playwright/test';

test.describe('Chatbot - Intelligent Responses', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  });

  async function openChatbot(page: any) {
    const chatbotButton = page.locator('#chatbot-button');
    await chatbotButton.click();
    await page.waitForTimeout(300);
  }

  async function sendMessage(page: any, message: string) {
    const input = page.locator('#chatbot-input');
    await input.fill(message);
    await input.press('Enter');
    await page.waitForTimeout(700);
  }

  async function getLastBotMessage(page: any): Promise<string> {
    const botMessages = page.locator('.chatbot__message--bot');
    const count = await botMessages.count();
    const lastMessage = botMessages.nth(count - 1);
    return await lastMessage.textContent();
  }

  test('Chatbot should open and display welcome message', async ({ page }) => {
    await openChatbot(page);
    
    const panel = page.locator('#chatbot-panel');
    await expect(panel).toHaveClass(/active/);
    
    const welcomeMessage = page.locator('.chatbot__message--bot').first();
    await expect(welcomeMessage).toBeVisible();
  });

  test('Chatbot should close when clicking close button', async ({ page }) => {
    await openChatbot(page);
    
    const closeButton = page.locator('#chatbot-close');
    await closeButton.click({ force: true });
    await page.waitForTimeout(300);
    
    const panel = page.locator('#chatbot-panel');
    await expect(panel).not.toHaveClass(/active/);
  });

  test('Should respond to "bonjour" with greeting', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'bonjour');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('Bonjour');
    expect(response).toContain('assistant Éclat de Jardin');
    expect(response).toContain('piscines');
    expect(response).toContain('aménagements extérieurs');
    expect(response).toContain('containers architecturaux');
  });

  test('Should respond to "merci" with acknowledgment', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'merci beaucoup');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('plaisir');
    expect(response).toContain('étude personnalisée');
  });

  test('Should detect piscine questions (general)', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Je voudrais une piscine');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('coques polyester');
    expect(response).toContain('béton armé');
    expect(response).toContain('containers');
    expect(response).toContain('coque');
    expect(response).toContain('maçonnée');
  });

  test('Should detect piscine + prix question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Quel est le prix d\'une piscine ?');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('budget');
    expect(response).toContain('paramètres');
    expect(response).toContain('coque polyester');
    expect(response).toContain('maçonnée en béton');
    expect(response).toContain('étude personnalisée');
  });

  test('Should detect piscine coque question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Info sur piscine coque');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('coques polyester');
    expect(response).toContain('fabricants reconnus');
    expect(response).toContain('terrassement');
    expect(response).toContain('filtration');
  });

  test('Should detect piscine maçonnée question with accent normalization', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Piscine maçonnée en béton');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('béton armé');
    expect(response).toContain('flexible');
    expect(response).toContain('sur mesure');
    expect(response).toContain('débordement');
  });

  test('Should detect piscine container question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'piscine container');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('containers');
    expect(response).toContain('structure métallique');
    expect(response).toContain('atelier');
    expect(response).toContain('dalle béton');
  });

  test('Should detect filtration question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Quelle filtration pour ma piscine ?');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('filtration');
    expect(response).toContain('pompes à vitesse variable');
    expect(response).toContain('électrolyseur au sel');
  });

  test('Should detect aménagement général', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'aménagement extérieur');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('terrasses');
    expect(response).toContain('escaliers');
    expect(response).toContain('enrochements');
    expect(response).toContain('clôtures');
  });

  test('Should detect terrasse question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Je veux une terrasse');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('terrasses premium');
    expect(response).toContain('bois exotique');
    expect(response).toContain('composite');
    expect(response).toContain('pierre naturelle');
  });

  test('Should detect escalier question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Escalier extérieur');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('escaliers');
    expect(response).toContain('béton');
    expect(response).toContain('pierre');
    expect(response).toContain('éclairage LED');
  });

  test('Should detect clôture question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Amenagement cloture et portail');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('clôtures');
    expect(response).toContain('brise-vues');
    expect(response).toContain('aluminium');
    expect(response).toContain('portails motorisés');
  });

  test('Should detect enrochement question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Amenagement enrochement de talus');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('enrochement');
    expect(response).toContain('talus');
    expect(response).toContain('stabilité');
    expect(response).toContain('drainages');
  });

  test('Should detect container général (non piscine)', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'container architectural');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('containers maritimes');
    expect(response).toContain('pool houses');
    expect(response).toContain('bureaux');
    expect(response).toContain('ateliers');
  });

  test('Should detect pool house container', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Pool house en container');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('pool houses containers');
    expect(response).toContain('douche');
    expect(response).toContain('rangement');
    expect(response).toContain('isolation');
  });

  test('Should detect bureau container', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Container bureau atelier');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('bureaux');
    expect(response).toContain('ateliers');
    expect(response).toContain('studios');
    expect(response).toContain('isolation performante');
  });

  test('Should detect container + prix', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Prix container architectural');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('budget');
    expect(response).toContain('pool house');
    expect(response).toContain('bureau');
    expect(response).toContain('étude personnalisée');
  });

  test('Should detect délais question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Quels sont les délais ?');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('délais');
    expect(response).toContain('piscine coque');
    expect(response).toContain('piscine maçonnée');
    expect(response).toContain('planning');
  });

  test('Should detect zone d\'intervention', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Où intervenez-vous ?');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('Strasbourg');
    expect(response).toContain('Bas-Rhin');
    expect(response).toContain('Grand Est');
  });

  test('Should detect garanties question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Quelles garanties ?');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('garantie décennale');
    expect(response).toContain('assurance');
    expect(response).toContain('responsabilité civile');
  });

  test('Should detect processus/étapes question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Comment ça se passe, les étapes ?');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('étapes');
    expect(response).toContain('Échange et visite');
    expect(response).toContain('conception');
    expect(response).toContain('Terrassement');
  });

  test('Should detect contact/rdv question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Je voudrais un rdv');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('échange personnalisé');
    expect(response).toContain('formulaire de contact');
    expect(response).toContain('numéro');
  });

  test('Should detect company info question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Qui êtes-vous ?');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('Éclat de Jardin');
    expect(response).toContain('Schiltigheim');
    expect(response).toContain('15 ans');
    expect(response).toContain('technicité');
  });

  test('Should normalize accents correctly', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Piscine maçonnée en béton');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('béton armé');
    expect(response).toContain('flexible');
  });

  test('Should handle punctuation and special characters', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Bonjour, je voudrais une piscine !!! Prix ???');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('budget');
    expect(response).toContain('piscine');
  });

  test('Should ask for clarification when message is vague', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'je veux un projet');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('piscine');
    expect(response).toContain('aménagement');
    expect(response).toContain('container');
  });

  test('Should provide fallback for unrecognized messages', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'xyz abc 123');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('assistant Éclat de Jardin');
    expect(response).toContain('piscines');
    expect(response).toContain('aménagements');
    expect(response).toContain('containers');
  });

  test('Should handle single-character message', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'x');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('assistant Éclat de Jardin');
    expect(response).toContain('piscines');
  });

  test('Should work consistently on Piscines page', async ({ page }) => {
    await page.goto('http://localhost:3000/piscines.html', { waitUntil: 'networkidle' });
    await openChatbot(page);
    await sendMessage(page, 'Prix piscine coque');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('budget');
    expect(response).toContain('coque polyester');
  });

  test('Should work consistently on Amenagements page', async ({ page }) => {
    await page.goto('http://localhost:3000/amenagements.html', { waitUntil: 'networkidle' });
    await openChatbot(page);
    await sendMessage(page, 'terrasse bois');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('terrasses premium');
    expect(response).toContain('bois exotique');
  });

  test('Should work consistently on Containers page', async ({ page }) => {
    await page.goto('http://localhost:3000/containers.html', { waitUntil: 'networkidle' });
    await openChatbot(page);
    await sendMessage(page, 'container pool house');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('pool houses containers');
  });

  test('Should work consistently on Contact page', async ({ page }) => {
    await page.goto('http://localhost:3000/contact.html', { waitUntil: 'networkidle' });
    await openChatbot(page);
    await sendMessage(page, 'Garanties décennales');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('garantie décennale');
    expect(response).toContain('assurance');
  });

  test('Should handle complex multi-keyword query', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'Je cherche une piscine maçonnée avec terrasse en bois et pool house');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('béton armé');
    expect(response).toContain('flexible');
    expect(response).toContain('sur mesure');
  });

  test('Should maintain professional tone across responses', async ({ page }) => {
    await openChatbot(page);
    
    await sendMessage(page, 'bonjour');
    let response = await getLastBotMessage(page);
    expect(response.toLowerCase()).not.toContain('super');
    expect(response.toLowerCase()).not.toContain('génial');
    
    await sendMessage(page, 'merci');
    response = await getLastBotMessage(page);
    expect(response).toContain('plaisir');
  });

  test('Should handle case variations correctly', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'PISCINE COQUE');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('coques polyester');
  });

  test('Should detect combined piscine + container question', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'piscine en container');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('containers');
    expect(response).toContain('structure métallique');
  });

  test('Should prioritize piscine over other categories when both detected', async ({ page }) => {
    await openChatbot(page);
    await sendMessage(page, 'piscine et terrasse');
    
    const response = await getLastBotMessage(page);
    expect(response).toContain('piscines');
    expect(response).toContain('coques');
  });
});
