document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    function renderGallery(filter = 'all') {
        galleryGrid.innerHTML = '';
        
        const filteredData = filter === 'all' 
            ? realisationsData 
            : realisationsData.filter(item => item.category === filter);

        filteredData.forEach((realisation, index) => {
            const coverImage = `assets/medias-realisations/${encodeURIComponent(realisation.folder)}/${encodeURIComponent(realisation.images[0])}`;
            
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item animated';
            galleryItem.dataset.category = realisation.category;
            
            galleryItem.innerHTML = `
                <div class="gallery-item__image">
                    <img src="${coverImage}" alt="${realisation.title}" loading="lazy">
                </div>
                <div class="gallery-item__overlay">
                    <span class="gallery-item__category">${getCategoryLabel(realisation.category)}</span>
                    <h3 class="gallery-item__title">${realisation.title}</h3>
                    <p class="gallery-item__location">${realisation.city} (${realisation.city.includes('Strasbourg') || realisation.city.includes('Metz') ? getPostalCode(realisation.city) : '67'})</p>
                </div>
            `;
            
            galleryItem.addEventListener('click', () => openModal(realisation));
            galleryGrid.appendChild(galleryItem);
        });
        
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    function getCategoryLabel(category) {
        const labels = {
            'piscine': 'Piscine',
            'amenagement': 'Aménagement Extérieur',
            'container': 'Container'
        };
        return labels[category] || category;
    }

    function getPostalCode(city) {
        if (city.includes('Metz')) return '57';
        if (city.includes('Strasbourg')) return '67';
        return '67';
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            currentFilter = filter;
            renderGallery(filter);
        });
    });

    function openModal(realisation) {
        const modal = document.createElement('div');
        modal.className = 'modal-realisation';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        
        const imagesHTML = realisation.images
            .filter(img => !img.endsWith('.mp4'))
            .map((img, idx) => {
                const imagePath = `assets/medias-realisations/${encodeURIComponent(realisation.folder)}/${encodeURIComponent(img)}`;
                return `
                    <div class="modal-carousel__slide ${idx === 0 ? 'active' : ''}">
                        <img src="${imagePath}" alt="${realisation.title} - Photo ${idx + 1}">
                    </div>
                `;
            }).join('');
        
        modal.innerHTML = `
            <div class="modal-realisation__overlay"></div>
            <div class="modal-realisation__content glass">
                <button class="modal-realisation__close" aria-label="Fermer">&times;</button>
                
                <div class="modal-realisation__body">
                    <div class="modal-carousel">
                        <button class="modal-carousel__btn modal-carousel__btn--prev" aria-label="Image précédente">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        
                        <div class="modal-carousel__track">
                            ${imagesHTML}
                        </div>
                        
                        <button class="modal-carousel__btn modal-carousel__btn--next" aria-label="Image suivante">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                        
                        <div class="modal-carousel__counter">
                            <span class="current">1</span> / <span class="total">${realisation.images.filter(img => !img.endsWith('.mp4')).length}</span>
                        </div>
                    </div>
                    
                    <div class="modal-realisation__info">
                        <h2 class="modal-realisation__title">${realisation.title}</h2>
                        <p class="modal-realisation__city">${realisation.city}</p>
                        <p class="modal-realisation__description">${realisation.description}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => modal.classList.add('active'), 10);
        
        const closeBtn = modal.querySelector('.modal-realisation__close');
        const overlay = modal.querySelector('.modal-realisation__overlay');
        const prevBtn = modal.querySelector('.modal-carousel__btn--prev');
        const nextBtn = modal.querySelector('.modal-carousel__btn--next');
        const slides = modal.querySelectorAll('.modal-carousel__slide');
        const currentCounter = modal.querySelector('.modal-carousel__counter .current');
        
        let currentSlide = 0;
        
        function updateCarousel() {
            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === currentSlide);
            });
            currentCounter.textContent = currentSlide + 1;
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        }
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => modal.remove(), 300);
        }
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        document.addEventListener('keydown', function handleKeyPress(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeyPress);
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        let touchStartX = 0;
        let touchEndX = 0;
        
        const carouselTrack = modal.querySelector('.modal-carousel__track');
        
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    }

    renderGallery();
});
