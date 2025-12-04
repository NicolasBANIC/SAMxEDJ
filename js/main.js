gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initParallax();
    initChatbot();
});

function initHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('active');
            }
        });
    }
}

function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    scrollElements.forEach((el, index) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleClass: 'animated',
                once: true
            },
            opacity: 1,
            y: 0,
            duration: 0.3,
            delay: index * 0.03,
            ease: 'power3.out'
        });
    });
    
    gsap.from('.hero__title', {
        opacity: 0,
        y: 15,
        duration: 0.35,
        delay: 0.1,
        ease: 'power3.out'
    });
    
    gsap.from('.hero__subtitle', {
        opacity: 0,
        y: 12,
        duration: 0.3,
        delay: 0.2,
        ease: 'power3.out'
    });
    
    gsap.from('.hero__cta', {
        opacity: 0,
        y: 12,
        duration: 0.3,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('.hero__scroll', {
        opacity: 0,
        duration: 0.3,
        delay: 0.4,
        ease: 'power3.out'
    });
}

function initParallax() {
    const parallaxImages = document.querySelectorAll('.parallax-img img');
    
    parallaxImages.forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.closest('.parallax-img'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: '3.5%',
            ease: 'none'
        });
    });
    
    const cards = document.querySelectorAll('.univers__card, .technicite__item, .engagements__card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

function initChatbot() {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotPanel = document.getElementById('chatbot-panel');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    if (!chatbotButton || !chatbotPanel) return;
    
    chatbotButton.addEventListener('click', () => {
        chatbotPanel.classList.add('active');
        chatbotInput.focus();
    });
    
    chatbotClose.addEventListener('click', () => {
        chatbotPanel.classList.remove('active');
    });
    
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatbotInput.value.trim();
        
        if (message) {
            addMessage(message, 'user');
            chatbotInput.value = '';
            
            setTimeout(() => {
                const response = generateResponse(message);
                addMessage(response, 'bot');
            }, 600);
        }
    });
    
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot__message chatbot__message--${type}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function generateResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('piscine') || msg.includes('bassin')) {
            if (msg.includes('prix') || msg.includes('coût') || msg.includes('tarif')) {
                return "Le budget d'une piscine varie considérablement selon la typologie choisie. Pour une piscine coque polyester, comptez entre 25 000€ et 45 000€ tout compris. Une piscine maçonnée béton armé se situe entre 35 000€ et 70 000€ selon dimensions et finitions. Les piscines containers démarrent à 30 000€. Je vous invite à demander une étude personnalisée gratuite pour obtenir un chiffrage précis adapté à votre projet.";
            }
            if (msg.includes('container')) {
                return "Nos piscines containers sont réalisées à partir de containers maritimes 20 ou 40 pieds transformés en bassins étanches. La structure acier est découpée, renforcée et traitée anti-corrosion. L'intérieur reçoit un traitement époxy alimentaire puis un revêtement liner armé. Nous intégrons filtration, chauffage et éclairage LED. Livraison par convoi exceptionnel et installation sur dalle béton préparée. Délai moyen : 8 à 12 semaines.";
            }
            if (msg.includes('coque')) {
                return "Les piscines coques polyester que nous installons sont fabriquées en France par nos partenaires certifiés. Garantie 10 ans structure. Nous réalisons l'excavation, le terrassement, la pose sur lit de sable stabilisé, le raccordement hydraulique complet, le local technique avec filtration et la finition des abords. Avantages : rapidité d'installation (3 à 4 semaines), étanchéité garantie, surface lisse facilitant l'entretien.";
            }
            if (msg.includes('maçonnée') || msg.includes('béton')) {
                return "La piscine maçonnée en béton armé offre une liberté totale de forme et dimensions. Nous réalisons le ferraillage sur plan ingénieur, le coffrage bois ou alu, le coulage béton C25/30 vibré, l'application d'un enduit hydraulique multicouche, puis la pose du revêtement final (liner armé, membrane PVC ou carrelage émaux). Construction noble, pérenne, adaptée aux terrains complexes et projets architecturaux exigeants.";
            }
            if (msg.includes('filtration')) {
                return "Nous proposons plusieurs systèmes de filtration premium : filtration à sable avec média filtrant haute performance (finesse 30 microns), filtration à diatomées (finesse 5 microns, eau cristalline), ou filtration à cartouche polyester. Pompes à vitesse variable pour optimisation énergétique. Options : traitement UV, électrolyse au sel, régulation pH/chlore automatique, chauffage par pompe à chaleur inverter.";
            }
            return "Nous concevons trois typologies de piscines : coques polyester (installation rapide, garantie 10 ans), piscines maçonnées béton armé (liberté de forme, pérennité maximale) et piscines containers (design contemporain, rapidité). Chaque projet inclut l'étude de sol, le terrassement, la structure, la filtration premium, le local technique et les finitions. Quelle typologie vous intéresse ?";
        }
        
        if (msg.includes('aménagement') || msg.includes('terrasse') || msg.includes('extérieur')) {
            if (msg.includes('terrasse')) {
                return "Nos terrasses premium se déclinent en plusieurs matériaux : bois exotiques (ipé, cumaru, teck), composites haute qualité (résistance UV, sans échardes), pierre naturelle (travertin, granit, grès cérame 20mm). Nous réalisons l'étude de nivellement, la structure porteuse (lambourdes alu ou bois classe 4), le drainage, la pose avec joints calibrés et la finition invisible ou apparente selon esthétique souhaitée.";
            }
            if (msg.includes('escalier')) {
                return "Nous créons des escaliers extérieurs sur mesure en pierre massive (granit, calcaire), béton architectonique brut ou ciré, ou structure métallique avec marches bois. Étude d'ergonomie (giron, hauteur), calcul de structure, fondations adaptées au terrain, main courante inox brossé ou garde-corps verre. Intégration d'éclairage LED dans contremarches ou mains courantes possible.";
            }
            if (msg.includes('clôture')) {
                return "Notre gamme de clôtures haut de gamme comprend : panneaux bois claire-voie (red cedar, mélèze), lames composites coextrudées (garantie 25 ans), claustra aluminium thermolaqué (RAL au choix), gabions pierre naturelle, ou clôture végétale sur structure acier. Toutes nos clôtures respectent le PLU et intègrent portails motorisés sur demande.";
            }
            if (msg.includes('enrochement')) {
                return "L'enrochement paysager combine fonction structurelle (soutènement, stabilisation de talus) et esthétique minérale. Nous utilisons des blocs de pierre locale (grès des Vosges, calcaire, granit) de 200 à 800 kg. Étude géotechnique préalable, terrassement en gradins, pose mécanique, drainage arrière, intégration de plantes rupestres. Particulièrement adapté aux terrains en pente.";
            }
            return "Nos aménagements extérieurs englobent : terrasses bois nobles ou composite, dallages pierre naturelle, pavages authentiques, escaliers structurants, enrochements décoratifs, clôtures design, drainage professionnel, plantations architecturées et éclairage paysager LED. Chaque projet est conçu sur mesure en fonction de votre terrain et de votre vision. Quel type d'aménagement envisagez-vous ?";
        }
        
        if (msg.includes('container') && !msg.includes('piscine')) {
            if (msg.includes('pool house')) {
                return "Le pool house container est notre réalisation phare : container 20 pieds (6m) ou 40 pieds (12m), découpe de larges baies vitrées aluminium, isolation thermique 120mm laine de roche, bardage bois (mélèze, douglas) ou composite, électricité complète, chauffage réversible, sol carrelage grand format. Aménagement intérieur : douche, WC, rangement matériel piscine, coin détente. Livraison clé en main. Délai : 10 semaines.";
            }
            if (msg.includes('bureau') || msg.includes('atelier')) {
                return "Nos containers bureaux/ateliers sont transformés en véritables espaces de travail : isolation thermique et acoustique renforcée, menuiseries aluminium double vitrage, électricité tertiaire (prises data, éclairage LED), revêtement sol stratifié ou béton ciré, climatisation réversible, accès PMR possible. Configurations de 15m² à 60m² par assemblage modulaire. Installation sur plots béton réglables.";
            }
            if (msg.includes('prix') || msg.includes('coût')) {
                return "Le prix d'un container architectural varie selon niveau d'aménagement : container brut isolé (15 000€ à 22 000€), container semi-aménagé électricité+isolation (25 000€ à 35 000€), container clé en main pool house ou bureau (35 000€ à 55 000€). Ces tarifs incluent la structure, la transformation, le transport et l'installation. Je vous recommande une étude personnalisée pour un chiffrage précis.";
            }
            return "Nous transformons des containers maritimes en espaces architecturaux contemporains : pool houses (équipés douche, rangements, coin détente), ateliers d'artiste, bureaux de jardin, studios indépendants, espaces de stockage premium. Structure acier, isolation thermique 120mm, menuiseries alu, électricité, bardage au choix. Garantie décennale, RT2012 compatible. Quel usage envisagez-vous ?";
        }
        
        if (msg.includes('délai') || msg.includes('durée') || msg.includes('combien de temps')) {
            return "Les délais moyens de réalisation sont : piscine coque (3 à 4 semaines), piscine maçonnée (6 à 10 semaines), piscine container (8 à 12 semaines), terrasse (2 à 4 semaines), aménagement complet (6 à 12 semaines), container architectural (8 à 12 semaines). Ces délais incluent les études préalables, les travaux et les finitions. Planning détaillé fourni lors de l'étude personnalisée.";
        }
        
        if (msg.includes('zone') || msg.includes('secteur') || msg.includes('où') || msg.includes('région')) {
            return "Éclat de Jardin intervient sur l'ensemble du Bas-Rhin (67) et départements limitrophes : Haut-Rhin (68), Moselle (57), Vosges (88), secteur de Sarrebourg, Saverne, Haguenau, Sélestat, Colmar, Mulhouse. Notre siège est situé à Schiltigheim, aux portes de Strasbourg. Pour des projets d'envergure, nous étudions les demandes Grand Est et régions limitrophes. N'hésitez pas à nous solliciter.";
        }
        
        if (msg.includes('contact') || msg.includes('rdv') || msg.includes('rencontre') || msg.includes('visite')) {
            return "Pour échanger sur votre projet, plusieurs options : appelez-nous au 06 52 21 10 72 (disponibilité 9h-18h du lundi au vendredi), envoyez-nous un email via le formulaire de contact, ou prenez rendez-vous à notre bureau de Schiltigheim (1 Rue Kellermann, 67300). Nous nous déplaçons gratuitement pour une visite technique sur site et une étude personnalisée. Premier échange sans engagement.";
        }
        
        if (msg.includes('garantie') || msg.includes('assurance')) {
            return "Tous nos chantiers bénéficient d'une couverture complète : garantie décennale tous risques chantiers (structure, étanchéité), garantie biennale (équipements techniques), garantie parfait achèvement (1 an), assurance responsabilité civile professionnelle. Nous travaillons avec des assureurs reconnus (Allianz, AXA). Attestations fournies avant démarrage des travaux. Votre investissement est protégé intégralement.";
        }
        
        if (msg.includes('bonjour') || msg.includes('hello') || msg.includes('salut')) {
            return "Bonjour et bienvenue ! Je suis ravie de vous accompagner dans votre réflexion. Éclat de Jardin conçoit et réalise des piscines premium, aménagements extérieurs et containers architecturaux à Strasbourg et dans tout le Bas-Rhin. Avez-vous un projet particulier en tête ? Je suis à votre écoute pour répondre à toutes vos questions techniques, tarifaires ou organisationnelles.";
        }
        
        if (msg.includes('merci')) {
            return "Je vous en prie, c'est avec plaisir. N'hésitez pas si vous avez d'autres questions concernant nos prestations. L'équipe d'Éclat de Jardin reste à votre disposition pour approfondir votre projet et vous accompagner de la conception à la réalisation. À très bientôt !";
        }
        
        return "Je suis à votre disposition pour répondre à vos questions sur nos piscines (coque, maçonnée, container), nos aménagements extérieurs (terrasses, pavages, escaliers, clôtures) et nos containers architecturaux (pool house, atelier, bureau). Vous pouvez également m'interroger sur nos délais, tarifs, zones d'intervention ou garanties. Comment puis-je vous aider précisément ?";
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
