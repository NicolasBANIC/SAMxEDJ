# Plan de Tests Manuels - Éclat de Jardin

## Instructions d'exécution

1. Démarrer le serveur: `npm run dev`
2. Ouvrir http://localhost:3000
3. Suivre chaque section ci-dessous
4. Cocher [x] si test OK, noter les problèmes

---

## 1. STABILITÉ VISUELLE

### 1.1 Page Accueil
- [ ] Titre hero "Architectes de votre univers extérieur" visible immédiatement
- [ ] Texte hero opacity = 1 (pas transparent)
- [ ] Tous les H2 de la page visibles après scroll
- [ ] Cards "Univers" (Piscines/Aménagements/Containers) entièrement visibles
- [ ] Scroll de haut en bas 3x: aucun texte ne disparaît

### 1.2 Page Piscines
- [ ] Titre de page visible < 2s
- [ ] Les 4 types de piscines visibles après scroll complet
- [ ] Textes des sections "Coque", "Maçonnée", "Container", "Sur mesure" tous lisibles
- [ ] Images parallax restent dans leurs conteneurs

### 1.3 Autres Pages
- [ ] Aménagements: titre + première section visibles rapidement
- [ ] Containers: titre + première typologie visible
- [ ] Réalisations: 12 items de galerie affichés
- [ ] Contact: formulaire visible < 2s

---

## 2. NAVIGATION

### 2.1 Menu Principal (Desktop)
- [ ] Logo "ÉCLAT DE JARDIN" visible en haut à gauche
- [ ] 6 liens menu: Accueil, Piscines, Aménagements, Containers, Réalisations, Contact
- [ ] Clic "Piscines" → navigue vers piscines.html
- [ ] Clic "Contact" → navigue vers contact.html
- [ ] Clic logo → retour à l'accueil

### 2.2 Header Sticky
- [ ] Scroller 200px vers le bas
- [ ] Header reste visible en haut (position fixed)
- [ ] Background du header devient plus opaque (classe "scrolled")

### 2.3 Menu Mobile (375px)
- [ ] Réduire fenêtre à 375px de large
- [ ] Hamburger menu (3 lignes) visible en haut à droite
- [ ] Clic hamburger → menu s'ouvre
- [ ] Clic hamburger à nouveau → menu se ferme
- [ ] Clic en dehors du menu → menu se ferme
- [ ] Navigation fonctionne depuis menu mobile

---

## 3. CHATBOT

### 3.1 Ouverture/Fermeture
- [ ] Bouton chatbot (bulle) visible en bas à droite
- [ ] Clic bouton → panneau chatbot s'ouvre
- [ ] Clic "X" → panneau se ferme
- [ ] Touche Échap → panneau se ferme

### 3.2 Interactions
- [ ] Taper "piscine" + Entrée → réponse apparaît
- [ ] Réponse contient le mot "piscine"
- [ ] Taper "prix piscine" → réponse contient des prix (€)
- [ ] Taper "container" → réponse mentionne containers
- [ ] Taper "terrasse" → réponse mentionne terrasses
- [ ] Taper "contact" → réponse avec coordonnées

### 3.3 UX
- [ ] Input se vide après envoi
- [ ] Messages scrollent automatiquement vers le bas
- [ ] Ne peut pas envoyer de message vide

---

## 4. FORMULAIRE CONTACT

### 4.1 Champs Visibles
- [ ] Label + input "Nom" visible et activé
- [ ] Label + input "Email" visible et activé
- [ ] Label + input "Téléphone" visible et activé
- [ ] Label + input "Adresse" visible et activé
- [ ] Select "Type de projet" avec options
- [ ] Textarea "Message" visible et activé
- [ ] Bouton "Envoyer" visible et cliquable

### 4.2 Validation
- [ ] Clic "Envoyer" sans remplir → champs requis marqués en erreur
- [ ] Entrer email invalide ("test") → erreur de format
- [ ] Entrer email valide ("test@test.com") → accepté
- [ ] Remplir tous les champs → formulaire se soumet (ou affiche message)

### 4.3 Labels Cliquables
- [ ] Clic sur label "Nom" → focus sur input nom
- [ ] Clic sur label "Email" → focus sur input email

### 4.4 Google Maps
- [ ] Iframe Google Maps visible
- [ ] Carte centrée sur "1 Rue Kellermann, 67300 Schiltigheim"

---

## 5. RESPONSIVE DESIGN

### 5.1 Mobile (375px)
- [ ] Aucun scroll horizontal (pas de débordement)
- [ ] Texte taille minimum 14px lisible
- [ ] Boutons min 44px hauteur (touch-friendly)
- [ ] Images s'adaptent à la largeur (max 375px)
- [ ] Header visible avec hamburger
- [ ] Formulaire contact empilé verticalement

### 5.2 Tablet (768px)
- [ ] Layout adapté (2 colonnes si applicable)
- [ ] Navigation desktop visible
- [ ] Grilles réduites à 2 colonnes max

### 5.3 Desktop (1920px)
- [ ] Contenu centré (max-width ~1400px)
- [ ] Marges gauche/droite égales
- [ ] Images HD nettes
- [ ] Espaces généreux entre sections

---

## 6. PERFORMANCE

### 6.1 Temps de Chargement
- [ ] Accueil: Hero visible < 3 secondes
- [ ] Piscines: Titre visible < 3 secondes
- [ ] Contact: Formulaire visible < 3 secondes

### 6.2 Navigation Menu
- [ ] Header visible < 1 seconde
- [ ] Liens menu disponibles < 1.5 secondes

### 6.3 Images Progressives
- [ ] Texte visible avant que toutes les images soient chargées
- [ ] Pas d'écran blanc > 2 secondes

---

## 7. ACCESSIBILITÉ

### 7.1 Structure HTML
- [ ] Chaque page a exactement 1 H1
- [ ] Hiérarchie titres logique (H1 → H2 → H3, pas de saut)
- [ ] Attribut lang="fr" sur `<html>`
- [ ] Balise `<main>` présente
- [ ] Balise `<nav>` présente

### 7.2 Images
- [ ] Images de contenu ont attribut alt descriptif
- [ ] Images décoratives ont alt="" ou role="presentation"

### 7.3 Navigation Clavier
- [ ] Touche Tab: parcourt liens, boutons, inputs
- [ ] Focus visible (outline ou box-shadow)
- [ ] Entrée: active liens et boutons
- [ ] Échap: ferme chatbot
- [ ] Shift+Tab: navigation inverse

### 7.4 ARIA
- [ ] Hamburger menu a aria-label="Menu"
- [ ] Boutons sans texte ont aria-label

---

## 8. PARCOURS UTILISATEUR COMPLET

### 8.1 Découverte Produit
- [ ] Démarrer sur Accueil
- [ ] Lire section hero
- [ ] Scroller jusqu'aux 3 univers
- [ ] Cliquer "Piscines"
- [ ] Lire description piscine coque
- [ ] Scroller jusqu'aux options de filtration
- [ ] Cliquer CTA "Demander une étude"
- [ ] Arrivée sur page Contact

### 8.2 Demande de Devis
- [ ] Remplir formulaire:
  - Nom: "Jean Dupont"
  - Email: "jean.dupont@example.com"  
  - Téléphone: "0652211072"
  - Message: "Je souhaite une piscine coque 8x4m"
- [ ] Cliquer "Envoyer"
- [ ] Confirmation ou message de succès

### 8.3 Exploration Mobile
- [ ] Réduire fenêtre à 375px
- [ ] Ouvrir hamburger menu
- [ ] Naviguer vers Réalisations
- [ ] Ouvrir chatbot
- [ ] Poser question: "prix piscine"
- [ ] Lire réponse
- [ ] Fermer chatbot
- [ ] Retour Accueil via logo

---

## 9. ROBUSTESSE

### 9.1 Console JavaScript (F12)
- [ ] Accueil: Aucune erreur rouge dans console
- [ ] Piscines: Aucune erreur rouge
- [ ] Contact: Aucune erreur rouge
- [ ] Pas d'erreur 404 sur CSS/JS/images
- [ ] Pas d'erreur réseau (sauf analytics tiers OK)

### 9.2 Ressources
- [ ] Fichier style.css charge (200 OK)
- [ ] Fichier main.js charge (200 OK)
- [ ] GSAP CDN charge (200 OK)
- [ ] Google Fonts chargent (200 OK)

---

## 10. FONCTIONNALITÉS SPÉCIFIQUES

### 10.1 Galerie Réalisations
- [ ] 12 items visibles
- [ ] Filtres: "Tous", "Piscines", "Aménagements", "Containers"
- [ ] Clic "Piscines" → affiche seulement projets piscines
- [ ] Clic "Tous" → affiche les 12 items
- [ ] Hover sur item → overlay apparaît

### 10.2 Animations GSAP
- [ ] Hero: titre fade-in + slide-up
- [ ] Sections: fade-in au scroll
- [ ] Cards: scale 1.02 au hover
- [ ] Parallax images: mouvement subtil au scroll
- [ ] Pas de "flicker" (clignotement)

### 10.3 CTA & Conversions
- [ ] Bouton hero "Découvrir nos réalisations" fonctionne
- [ ] Bouton "Demander une étude" → Contact
- [ ] Lien téléphone "06 52 21 10 72" est cliquable (tel:)
- [ ] CTAs visibles sur toutes les pages

---

## RÉSUMÉ DES TESTS

**Total tests**: ~120  
**Tests OK**: ___  
**Tests KO**: ___  
**Problèmes critiques**: ___  

### Problèmes identifiés
1. 
2. 
3. 

### Recommandations
1. 
2. 
3. 

---

**Testeur**: _______________  
**Date**: _______________  
**Navigateur**: _______________  
**Résolution**: _______________
