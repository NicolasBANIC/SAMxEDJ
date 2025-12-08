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
    if (!header) return;
    // On cherche la section héros : home (.hero) ou pages internes (.page-hero)
    const heroSection = document.querySelector('.hero, .page-hero');
    // Si pas de héros, on garde le comportement actuel en fallback
    if (!heroSection || !('IntersectionObserver' in window)) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        return;
    }
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Tant que la section héros est visible → liens blancs
                    header.classList.remove('scrolled');
                } else {
                    // Dès qu'on sort de la section héros → liens anthracite
                    header.classList.add('scrolled');
                }
            });
        },
        {
            threshold: 0.3
        }
    );
    observer.observe(heroSection);
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
    
    function openChatbot() {
        chatbotPanel.classList.add('active');
        chatbotButton.setAttribute('aria-expanded', 'true');
        if (chatbotInput) {
            chatbotInput.focus();
        }
    }

    function closeChatbot() {
        chatbotPanel.classList.remove('active');
        chatbotButton.setAttribute('aria-expanded', 'false');
    }

    // Bouton flottant : toggle ouvert/fermé
    chatbotButton.addEventListener('click', () => {
        const isActive = chatbotPanel.classList.contains('active');
        if (isActive) {
            closeChatbot();
        } else {
            openChatbot();
        }
    });

    // Bouton de fermeture dans le header du chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener('click', () => {
            closeChatbot();
        });
    }

    // Clic à l'extérieur : fermeture
    document.addEventListener('click', (event) => {
        if (!chatbotPanel.classList.contains('active')) return;
        const clickInsidePanel = chatbotPanel.contains(event.target);
        const clickOnButton = chatbotButton.contains(event.target);
        if (!clickInsidePanel && !clickOnButton) {
            closeChatbot();
        }
    });

    // Touche Échap : fermeture
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && chatbotPanel.classList.contains('active')) {
            closeChatbot();
        }
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
        const raw = (message || '').trim();
        if (!raw) {
            return "Je n'ai pas bien compris votre message. Pouvez-vous reformuler en quelques mots votre projet ou votre question ?";
        }

        function normalize(str) {
            return str
                .toLowerCase()
                .replace(/[.,;:!?()"'`´]/g, " ")
                .replace(/[àáâãäå]/g, "a")
                .replace(/[ç]/g, "c")
                .replace(/[èéêë]/g, "e")
                .replace(/[ìíîï]/g, "i")
                .replace(/[òóôõö]/g, "o")
                .replace(/[ùúûü]/g, "u")
                .replace(/[ÿ]/g, "y")
                .replace(/\s+/g, " ")
                .trim();
        }

        const msg = normalize(raw);

        function includesAny(keywords) {
            return keywords.some(kw => msg.includes(kw));
        }

        const isPiscine = includesAny(["piscine", "bassin"]);
        const isAmenagement = includesAny(["amenagement", "terrasse", "exterieur", "exterieure", "exterieurs"]);
        const isContainer = includesAny(["container", "conteneur"]);

        const asksPrice = includesAny(["prix", "tarif", "cout", "budget"]);
        const asksDelay = includesAny(["delai", "delais", "duree", "combien de temps"]);
        const asksZone = includesAny(["zone", "secteur", "region", "ou intervenez", "intervention", "strasbourg", "bas rhin", "grand est"]);
        const asksGuarantee = includesAny(["garantie", "garanties", "assurance", "decennale"]);
        const asksProcess = includesAny(["etapes", "deroulement", "comment ca se passe", "processus", "accompagnement"]);
        const asksCompany = includesAny(["qui etes", "qui êtes", "eclat de jardin", "entreprise", "societe", "showroom"]);
        const asksContact = includesAny(["contact", "rappel", "rappelez", "rappeler", "rdv", "rendez vous", "visite", "devis", "estimation", "etude"]);

        if (includesAny(["bonjour", "bonsoir", "salut", "hello", "coucou"])) {
            return "Bonjour, je suis l'assistant Éclat de Jardin. Je peux vous renseigner sur nos piscines, aménagements extérieurs, containers architecturaux, délais, budget, garanties ou zone d'intervention. Souhaitez-vous parler plutôt d'une piscine, d'un aménagement extérieur ou d'un container architectural ?";
        }

        if (includesAny(["merci", "merci beaucoup", "thanks"])) {
            return "Avec plaisir, c'est un plaisir de vous accompagner. Si vous le souhaitez, nous pouvons aller plus loin avec une étude personnalisée de votre projet via le formulaire de contact ou par téléphone.";
        }

        if (asksContact) {
            return "Pour aller plus loin, nous vous proposons un échange personnalisé : vous pouvez nous appeler directement au numéro indiqué sur le site ou remplir le formulaire de contact en précisant votre type de projet (piscine, aménagement extérieur, container) et quelques informations sur le terrain, le budget envisagé et le délai souhaité. Nous revenons ensuite vers vous pour affiner le projet et, si besoin, organiser une visite sur place.";
        }

        if (asksDelay) {
            return "Les délais dépendent du type de projet et de la période : une fois l'étude validée, une piscine coque ou container peut être réalisée en quelques semaines, tandis qu'une piscine maçonnée ou un aménagement extérieur complet nécessite plusieurs mois, en fonction du terrassement, du génie civil et des finitions. Lors de l'étude personnalisée, nous vous remettons un planning prévisionnel détaillé et réaliste.";
        }

        if (asksZone) {
            return "Nous sommes basés près de Strasbourg et intervenons principalement dans le Bas-Rhin et le Grand Est : Eurométropole de Strasbourg, Bas-Rhin, une partie du Haut-Rhin, de la Moselle et des Vosges pour des projets d'envergure. Pour les projets plus lointains, nous étudions les demandes au cas par cas en fonction de la nature du chantier.";
        }

        if (asksGuarantee) {
            return "Nos réalisations sont couvertes par les garanties et assurances obligatoires pour ce type de travaux : garantie décennale sur les ouvrages concernés (génie civil, structure, étanchéité) et assurance responsabilité civile professionnelle. Nous travaillons avec des fournisseurs et marques reconnues pour la fiabilité des équipements (filtration, traitement, chauffage, couvertures, etc.). Les détails sont précisés lors de l'étude et du devis.";
        }

        if (asksProcess) {
            return "Un projet Éclat de Jardin se déroule en plusieurs grandes étapes :\n\n1) Échange et visite sur site pour comprendre votre mode de vie, vos contraintes et le contexte (maison, terrain, accès).\n2) Étude et conception : plans, dimensionnement technique, choix des matériaux et équipements, intégration paysagère.\n3) Terrassement et VRD : préparation du terrain, gestion des réseaux, évacuations, plateforme.\n4) Génie civil et structure : radier, voiles béton, murs de soutènement si nécessaires.\n5) Hydraulique et équipements : filtration, traitement de l'eau, chauffage, couvertures ou volets.\n6) Revêtements et finitions : liner armé ou membrane PVC, margelles, plages, terrasses et aménagements paysagers.\n\nNous vous accompagnons de la conception à la livraison, avec un interlocuteur dédié.";
        }

        if (asksCompany) {
            return "Éclat de Jardin est une entreprise basée à Schiltigheim (près de Strasbourg), spécialisée depuis plus de 15 ans dans la conception et la réalisation de piscines premium, d'aménagements extérieurs et de containers architecturaux. Nous combinons technicité (terrassement, génie civil, hydraulique, revêtements) et vision architecturale pour créer des projets sur mesure. Nous vous recevons sur rendez-vous pour étudier votre projet en détail.";
        }

        if (isPiscine) {
            if (asksPrice) {
                return "Le budget d'une piscine dépend de nombreux paramètres : typologie (coque polyester, piscine maçonnée en béton, piscine container ou bassin entièrement sur mesure), dimensions, niveau de finition, équipements (filtration, traitement automatique, chauffage, couverture, fonds mobiles, etc.) et contraintes de votre terrain. Nous travaillons sur des projets sur mesure, généralement à partir de plusieurs dizaines de milliers d'euros selon la complexité. Le plus simple est de réaliser une étude personnalisée : un échange téléphonique ou une visite nous permet de définir un budget précis adapté à votre projet.";
            }
            if (includesAny(["container"])) {
                return "Nos piscines containers combinent une structure métallique renforcée, une préparation complète en atelier (étanchéité, isolation, équipements de filtration) et une installation sur dalle béton préparée. Elles sont particulièrement adaptées aux terrains contraints ou aux projets contemporains. Nous proposons des finitions premium et des équipements haut de gamme. Une étude de site est nécessaire pour valider l'implantation, l'accès et le budget global.";
            }
            if (includesAny(["coque"])) {
                return "Les piscines coques polyester que nous installons sont issues de fabricants reconnus, avec des formes modernes et une structure renforcée. Elles permettent un chantier plus rapide qu'une piscine maçonnée, tout en offrant un confort d'usage élevé. Nous intégrons l'ensemble : terrassement, dalle ou radier, raccordements, filtration, margelles et finitions paysagères autour du bassin.";
            }
            if (includesAny(["maconnee", "beton"])) {
                return "La piscine maçonnée en béton armé est la solution la plus flexible pour un projet sur mesure : forme, dimensions, profondeur, intégration à la maison ou au paysage, débordement, plage immergée, etc. Nous gérons le gros œuvre (radier, voiles, structure), l'étanchéité (liner armé, membrane PVC, carrelage selon le projet), l'hydraulique, ainsi que les plages et aménagements extérieurs. C'est la solution privilégiée pour les projets architecturaux exigeants.";
            }
            if (includesAny(["filtration", "traitement", "pompe", "hydraulique"])) {
                return "Nous dimensionnons et installons des systèmes de filtration haut de gamme : pompes à vitesse variable, filtres à sable ou à verre, traitement automatique (électrolyseur au sel, régulation pH et désinfection), chauffage par pompe à chaleur, couvertures automatiques ou volets immergés. L'objectif est d'obtenir une eau claire, saine et facile à entretenir, avec une installation durable et silencieuse.";
            }

            return "Nous concevons et réalisons trois grandes typologies de piscines : coques polyester, bassins maçonnés en béton armé et piscines containers, ainsi que des projets entièrement sur mesure (bords à débordement, plages immergées, bassins architecturaux). Nous intégrons la partie technique (génie civil, hydraulique, étanchéité, revêtements) et l'aménagement des abords. Dites-moi : vous envisagez plutôt une piscine coque, une piscine maçonnée ou une piscine container ?";
        }

        if (isAmenagement) {
            if (includesAny(["terrasse", "deck"])) {
                return "Nous créons des terrasses premium en bois exotique, bois composite ou pierre naturelle, avec une attention particulière portée aux détails : structure porteuse adaptée, gestion des eaux pluviales, finitions soignées (nez de marche, joints, intégration avec les seuils de la maison). Nous pouvons intégrer l'éclairage, les jardinières, les escaliers et les éléments de mobilier extérieur.";
            }
            if (includesAny(["escalier"])) {
                return "Nous réalisons des escaliers extérieurs sur mesure : béton habillé de pierre ou carrelage, marches en bois, intégration dans un talus ou un enrochement, sécurisation des circulations. Il est possible d'intégrer un éclairage LED dans les contremarches ou les mains courantes pour un rendu très qualitatif.";
            }
            if (includesAny(["cloture", "portail", "brise vue", "brisevue"])) {
                return "Nous proposons des clôtures et brise-vues haut de gamme : aluminium, acier, lames composites, panneaux ajourés, gabions, etc. Nous veillons à la cohérence avec l'architecture de la maison et les réglementations locales (PLU), et pouvons intégrer des portails motorisés et portillons coordonnés.";
            }
            if (includesAny(["enrochement", "talus"])) {
                return "L'enrochement paysager permet de traiter les différences de niveau et les talus en combinant stabilité et esthétique. Nous sélectionnons les blocs, mettons en place les drainages nécessaires et pouvons végétaliser l'ensemble avec des plantations adaptées (plantes rupestres, couvre-sols, arbustes).";
            }

            return "Nos aménagements extérieurs englobent terrasses, escaliers, murets, enrochements, plantations, éclairage, clôtures et portails. L'objectif est de créer un ensemble cohérent autour de votre maison et de votre piscine, tant sur le plan technique qu'esthétique. Quel type d'aménagement souhaitez-vous prioriser : terrasse, jardin, accès, clôture, enrochement… ?";
        }

        if (isContainer && !isPiscine) {
            if (includesAny(["pool house", "poolhouse"])) {
                return "Nos pool houses containers sont pensés comme de véritables extensions d'espace autour de la piscine : rangement du matériel, douche, WC, coin détente, bar, salon extérieur abrité… Le container est entièrement transformé : isolation, menuiseries alu, habillage intérieur, électricité, éclairage, éventuellement chauffage réversible. Nous livrons un ensemble prêt à être raccordé, sur une dalle ou des plots béton.";
            }
            if (includesAny(["bureau", "atelier", "studio", "cabinet"])) {
                return "Nous transformons des containers maritimes en bureaux, ateliers ou studios : isolation performante, menuiseries aluminium, électricité complète, chauffage/climatisation, revêtements de sol et murs soignés. Cela permet de créer un espace de travail ou de création indépendant, contemporain, souvent avec des délais plus courts qu'une construction traditionnelle.";
            }
            if (asksPrice) {
                return "Le budget d'un container architectural dépend de l'usage (pool house, bureau, atelier, studio invité), des niveaux de finition (extérieur et intérieur), du niveau d'isolation, des équipements (sanitaires, cuisine, chauffage, climatisation) et des contraintes de préparation de la plateforme (dalle, plots, accès grue). Une étude personnalisée est nécessaire pour définir un budget fidèle à votre projet.";
            }

            return "Nous transformons des containers maritimes en espaces architecturaux contemporains : pool houses, bureaux, ateliers, studios. Chaque projet est étudié sur mesure : isolation, menuiseries, aménagement intérieur, intégration paysagère. Quel type de container avez-vous en tête : pool house, bureau, atelier ou autre ?";
        }

        if (isPiscine || isAmenagement || isContainer) {
            return "J'ai bien compris que votre question concerne " + (isPiscine ? "une piscine" : isAmenagement ? "un aménagement extérieur" : "un container architectural") + ". Pouvez-vous préciser ce qui vous intéresse le plus : budget, délais, type de solution, garanties, ou déroulement du projet ? Je pourrai alors vous répondre de façon plus ciblée.";
        }

        return "Je suis l'assistant Éclat de Jardin. Je peux vous informer sur nos piscines, aménagements extérieurs, containers architecturaux, nos délais, budgets, garanties, zone d'intervention et notre manière de travailler. N'hésitez pas à me dire en quelques mots si vous souhaitez parler d'une piscine, d'un aménagement extérieur ou d'un container, et si vous avez une question sur le budget, le délai ou la faisabilité.";
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
