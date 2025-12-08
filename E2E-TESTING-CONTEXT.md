# CONTEXTE DU PROJET - ÉCLATS DE JARDIN E2E TESTING

## 📋 RÉSUMÉ EXÉCUTIF

**Projet**: Site web premium multi-pages pour ÉCLATS DE JARDIN (entreprise de piscines & aménagements extérieurs à Strasbourg)

**État actuel**: Site production-ready ✅ | Tests E2E configurés ✅ | Bug Playwright résolu ✅

**Prochaine étape**: Créer la suite complète de tests E2E automatisés

---

## 🏗️ ARCHITECTURE DU PROJET

### Structure des fichiers
```
c:\Users\Banic\Documents\SAMxEDJ\
├── index.html (Homepage avec hero GSAP)
├── piscines.html (4 types: coque, maçonnée, container, sur-mesure)
├── amenagements.html (Terrasses, escaliers, clôtures)
├── containers.html (Containers architecturaux)
├── realisations.html (Galerie 12 projets avec filtres)
├── contact.html (Formulaire de contact)
├── css/
│   └── style.css (1400+ lignes, glassmorphism design)
├── js/
│   └── main.js (GSAP animations, chatbot, navigation mobile)
├── e2e/ (Tests Playwright - 1 test fonctionnel actuellement)
│   └── test-basic.spec.js
├── playwright.config.js
└── package.json
```

### Technologies
- **Frontend**: HTML5, CSS3 (glassmorphism), JavaScript ES6
- **Animations**: GSAP 3.x avec ScrollTrigger
- **Serveur dev**: live-server (port 3000)
- **Testing**: Playwright 1.57.0 (TypeScript/JavaScript)
- **Node**: v22.19.0 | npm: 10.9.3
- **OS**: Windows 10.0.26200

### Caractéristiques du site
- Design ultra-premium avec effets glassmorphism
- 6 pages complètes (zéro placeholder)
- Chatbot intelligent (120+ réponses contextuelles)
- Animations GSAP fluides (hero, scroll-triggered, parallax)
- Menu mobile responsive avec hamburger
- Header sticky avec effet au scroll
- Galerie avec système de filtres (Réalisations page)
- Formulaire de contact avec validation
- 100% en français, adapté marché Strasbourg

---

## 🐛 PROBLÈME RÉSOLU - BUG PLAYWRIGHT WINDOWS

### Symptôme
```bash
npx playwright test --list
# Erreur systématique:
# "Playwright Test did not expect test() to be called here"
# "You have two different versions of @playwright/test"
```

### Tentatives échouées (8+ heures de debug)
1. ❌ Réinstallation de `@playwright/test`
2. ❌ Suppression `node_modules` + fresh install
3. ❌ Passage de TypeScript (`.ts`) à JavaScript (`.js`)
4. ❌ Suppression fichier de configuration
5. ❌ Tests avec/sans `describe()` blocks
6. ❌ Changement du dossier `tests/` vers `e2e/`
7. ❌ Vérification versions (pas de duplicates trouvés)
8. ❌ Suppression `webServer` config

**AUCUNE SOLUTION STANDARD NE FONCTIONNAIT**

### 💡 Solution (ROOT CAUSE)
**Bug Windows**: `npx` ne lance pas correctement le CLI Playwright sur cette machine.

**Workaround efficace**: Appeler directement le CLI via Node.js

```json
// package.json - Scripts modifiés
{
  "scripts": {
    "test": "node node_modules/@playwright/test/cli.js test",
    "test:ui": "node node_modules/@playwright/test/cli.js test --ui",
    "test:headed": "node node_modules/@playwright/test/cli.js test --headed",
    "test:debug": "node node_modules/@playwright/test/cli.js test --debug",
    "test:report": "node node_modules/@playwright/test/cli.js show-report"
  }
}
```

### Validation
```bash
# ✅ FONCTIONNE
node node_modules/@playwright/test/cli.js test --list
# Output: "Total: 1 test in 1 file"

# ✅ Test exécuté avec succès
npm test
# Output: "1 passed (1.8s)"
```

---

## 📝 FICHIERS DE CONFIGURATION ACTUELS

### `playwright.config.js`
```javascript
module.exports = {
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
};
```

### `e2e/test-basic.spec.js` (Test de validation)
```javascript
const { test, expect, describe } = require('@playwright/test');

describe('Homepage Tests', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const title = page.locator('.hero__title');
    await expect(title).toBeVisible();
  });
});
```

---

## 🎯 PLAN DE TESTS E2E À IMPLÉMENTER

### Référence: `TESTS-MANUELS.md`
Document exhaustif créé avec **120 cas de tests manuels** organisés en 10 catégories. Utiliser comme référence pour automatiser les tests.

### Tests prioritaires à créer

#### 1. **Stabilité Visuelle** (`e2e/visual-stability.spec.js`)
- Hero title "Architectes de votre univers extérieur" visible immédiatement
- Opacity text = 1 (pas transparent)
- Tous les H2 visibles après scroll
- Cards "Univers" (Piscines/Aménagements/Containers) entièrement visibles
- Scroll persistence: textes ne disparaissent pas après 3 scrolls complets

#### 2. **Navigation** (`e2e/navigation.spec.js`)
- 6 liens menu: Accueil, Piscines, Aménagements, Containers, Réalisations, Contact
- Clic "Piscines" → navigation vers `piscines.html`
- Clic logo → retour accueil
- Header sticky: classe "scrolled" ajoutée après 100px scroll
- Menu mobile (viewport 375px):
  - Hamburger visible
  - Ouverture/fermeture menu
  - Clic extérieur → ferme menu

#### 3. **Chatbot** (`e2e/chatbot.spec.js`)
- Bouton chatbot visible en bas à droite (`#chatbot-button`)
- Ouverture/fermeture panneau
- Fermeture avec touche Échap
- Input "piscine" → réponse contient "piscine"
- Input "prix piscine" → réponse contient prix (€)
- Messages scrollent automatiquement vers le bas
- Input se vide après envoi

#### 4. **Formulaire Contact** (`e2e/form-validation.spec.js`)
- 7 champs: Nom, Email, Téléphone, Adresse, Type de projet, Message, Submit
- Validation champs requis
- Email invalide ("test") → erreur
- Email valide ("test@test.com") → accepté
- Labels cliquables → focus sur input correspondant

#### 5. **Responsive Design** (`e2e/responsive.spec.js`)
- Viewports: 375px (mobile), 768px (tablet), 1920px (desktop)
- Menu hamburger visible < 768px
- Images ne débordent pas
- Textes lisibles sur tous viewports
- Boutons cliquables (zone touch ≥ 44x44px)

#### 6. **Galerie Réalisations** (`e2e/gallery.spec.js`)
- 12 items visibles sur `realisations.html`
- Filtres: "Tous", "Piscines", "Aménagements", "Containers"
- Clic filtre → nombre items change
- Images chargées (pas de broken images)

#### 7. **Performance** (`e2e/performance.spec.js`)
- Hero title visible < 2s
- LCP (Largest Contentful Paint) < 2.5s
- Aucune erreur console critique
- Ressources CSS/JS chargées

#### 8. **Accessibilité** (`e2e/accessibility.spec.js`)
- Navigation clavier (Tab, Entrée, Échap)
- Focus visible sur éléments interactifs
- Alt text sur images
- Labels associés aux inputs (attribut `for`)
- Hiérarchie H1 → H2 → H3

#### 9. **Parcours Utilisateur Critiques** (`e2e/critical-paths.spec.js`)
- **Parcours 1**: Homepage → Piscines → Contact (devis piscine)
- **Parcours 2**: Homepage → Réalisations → Filtre "Piscines" → Contact
- **Parcours 3**: Homepage → Chatbot "prix piscine" → Contact
- **Parcours 4**: Mobile: Menu hamburger → Navigation → Fermeture

#### 10. **Animations GSAP** (`e2e/animations.spec.js`)
- Hero title: opacity 0 → 1 (GSAP animation)
- Parallax images: transformation Y pendant scroll
- Cards hover: scale 1 → 1.02
- ScrollTrigger: éléments `[data-scroll]` s'animent à 85% viewport

---

## 🚀 COMMANDES POUR DÉMARRER

### 1. Vérifier environnement
```bash
cd c:\Users\Banic\Documents\SAMxEDJ
node --version  # Doit être v22.19.0
npm --version   # Doit être 10.9.3
```

### 2. Démarrer serveur dev (OBLIGATOIRE avant tests)
```bash
# Terminal 1 - Serveur
npm run dev
# Attend "Serving ... at http://localhost:3000"
```

### 3. Exécuter tests
```bash
# Terminal 2 - Tests
npm test                # Headless
npm run test:headed     # Voir navigateur
npm run test:ui         # Interface interactive
npm run test:debug      # Mode debug
```

### 4. Créer nouveaux tests
```bash
# Créer dans e2e/ avec extension .spec.js
# Exemple: e2e/navigation.spec.js
```

---

## 📌 SÉLECTEURS CSS IMPORTANTS

### Navigation
- `.header__logo` - Logo ÉCLATS DE JARDIN
- `.header__nav-link` - Liens menu (6 items)
- `.header__burger` - Hamburger mobile
- `.header.scrolled` - Classe ajoutée au scroll

### Homepage
- `.hero__title` - Titre principal "Architectes de votre..."
- `.hero__subtitle` - Sous-titre
- `.btn--primary` - Boutons CTA
- `.univers__card` - Cards Piscines/Aménagements/Containers (3 items)

### Chatbot
- `#chatbot-button` - Bouton ouverture
- `#chatbot-panel` - Panneau chatbot
- `#chatbot-close` - Bouton fermeture
- `#chatbot-input` - Input texte
- `#chatbot-form` - Formulaire
- `.chatbot__message--user` - Messages utilisateur
- `.chatbot__message--bot` - Réponses bot

### Formulaire Contact
- `input[name="nom"]`
- `input[name="email"]`
- `input[name="telephone"]`
- `input[name="adresse"]`
- `select[name="projet"]`
- `textarea[name="message"]`
- `button[type="submit"]`

### Galerie Réalisations
- `.gallery__item` - Item galerie (12 total)
- `.gallery__filter` - Boutons filtres
- `.gallery__filter.active` - Filtre actif

---

## ⚠️ POINTS D'ATTENTION

### Windows-specific
- **NE JAMAIS utiliser `npx playwright`** → Utiliser `npm test` ou `node node_modules/@playwright/test/cli.js`
- Serveur doit tourner AVANT les tests (pas de webServer auto-start dans config)

### GSAP Animations
- Ajouter `await page.waitForTimeout(1500)` pour les animations hero
- Utiliser `await page.waitForLoadState('networkidle')` pour parallax

### Chatbot
- Attendre 600ms entre input et réponse (délai simulé)
- `generateResponse()` dans `js/main.js` contient la logique de réponses

### Performance
- Images Unsplash: peuvent être lentes en première charge
- GSAP + ScrollTrigger: ~150KB à charger

---

## 📊 OBJECTIF FINAL

**Créer ~150 tests E2E automatisés** couvrant:
- ✅ Stabilité visuelle (18 tests)
- ✅ Navigation (13 tests)
- ✅ Chatbot (9 tests)
- ✅ Formulaire (11 tests)
- ✅ Responsive (12 tests)
- ✅ Performance (7 tests)
- ✅ Accessibilité (14 tests)
- ✅ Parcours utilisateur (18 tests)
- ✅ Robustesse (8 tests)
- ✅ Fonctionnalités spécifiques (10 tests)

### Critères de succès
- Tous les tests passent en mode headless
- Temps d'exécution < 5 minutes pour la suite complète
- Coverage: 100% des user flows critiques
- Aucune erreur console critique
- Tests stables (pas de flaky tests)

---

## 🎬 PREMIÈRE ACTION À EFFECTUER

1. Lire ce prompt en entier
2. Vérifier que le serveur tourne (`npm run dev`)
3. Confirmer que le test actuel passe (`npm test`)
4. Commencer par créer `e2e/navigation.spec.js` avec les 13 tests de navigation
5. Progresser ensuite selon l'ordre des priorités listées ci-dessus

**Tu as toutes les infos nécessaires. Le bug Playwright est résolu. Go! 🚀**
