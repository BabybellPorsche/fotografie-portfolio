/**
 * Samuel Ketels Fotografie - Main JavaScript
 * Een strakke, responsieve website voor fotografie portfolio
 */

document.addEventListener('DOMContentLoaded', function() {
    // Pagina transitie effect
    document.body.classList.add('page-transition');
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Initialiseer alles nadat de pagina volledig geladen is
    window.addEventListener('load', function() {
        // Initialiseer functies
        initMobileMenu();
        initResponsiveNavigation();
        
        // Voeg extra fade-in animaties toe
        addFadeInAnimations();
        
        // Alleen op pagina's met gallery-items
        if (document.querySelector('.gallery-item')) {
            initLightbox();
        }
        
        // Alleen op pagina's met grid-container
        if (document.querySelector('.photo-grid')) {
            initPhotoGrid();
        }
    });
    
    /**
     * Responsive header navigatie en actieve link highlighter
     */
    function initResponsiveNavigation() {
        // Markeer de actieve link in de navigatie op basis van het huidige pad
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            // Controleer of het pad overeenkomt of dat we op de homepage zijn
            if (currentPath === linkPath || 
               (currentPath.includes(linkPath) && linkPath !== '/' && linkPath !== '/index.html') ||
               (currentPath === '/' && (linkPath === '/index.html' || linkPath === '/'))) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * Mobiel menu functionaliteit
     */
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.querySelector('.menu-icon');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                if (mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    menuIcon.classList.remove('open');
                    document.body.style.overflow = 'auto'; // Maak scrollen weer mogelijk
                } else {
                    mobileMenu.classList.add('open');
                    menuIcon.classList.add('open');
                    document.body.style.overflow = 'hidden'; // Voorkom scrollen op achtergrond
                }
            });
            
            // Sluit mobile menu wanneer er op een link wordt geklikt
            const mobileMenuLinks = mobileMenu.querySelectorAll('a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('open');
                    menuIcon.classList.remove('open');
                    document.body.style.overflow = 'auto';
                });
            });
            
            // Sluit mobile menu wanneer er buiten het menu wordt geklikt
            document.addEventListener('click', function(event) {
                if (mobileMenu.classList.contains('open') && 
                    !mobileMenu.contains(event.target) && 
                    event.target !== mobileMenuButton &&
                    !mobileMenuButton.contains(event.target)) {
                    mobileMenu.classList.remove('open');
                    menuIcon.classList.remove('open');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }
    
    /**
     * Lightbox initialisatie voor afbeeldinggalerijen
     */
    function initLightbox() {
        // Geavanceerde Lightbox configuratie
        let lightbox = new SimpleLightbox('.gallery-item', {
            captionsData: 'alt',
            captionDelay: 250,
            animationSpeed: 300,
            fadeSpeed: 150,
            showCounter: true,
            loop: true,
            navText: ['←', '→'],
            closeText: '×',
            preloading: true,
            widthRatio: 0.9,
            heightRatio: 0.9,
            scaleImageToRatio: true,
            disableRightClick: false,
            alertError: true
        });
    }
    
    /**
     * Responsive fotogrid met dynamische hoogte berekening
     */
    function initPhotoGrid() {
        const grid = document.querySelector('.photo-grid');
        const items = document.querySelectorAll('.grid-item');
        
        // Initialiseer het resizen van grid items op basis van hun afbeeldingsgrootte
        imagesLoaded(grid, function() {
            resizeGridItems();
            // Initialiseer filtering als er filter buttons zijn
            if (document.querySelector('.filter-btn')) {
                initFilterButtons();
            }
            // Toon de grid nadat alles geladen is
            grid.style.opacity = 1;
        });
        
        // Voeg class toe aan elk item als het geladen is
        items.forEach(item => {
            const img = item.querySelector('img');
            img.classList.add('loading');
            img.onload = function() {
                img.classList.remove('loading');
            };
        });
        
        // Herbereken grid bij window resize
        window.addEventListener('resize', debounce(function() {
            resizeGridItems();
        }, 150));
        
        // Resize grid items op basis van afbeeldingshoogte
        function resizeGridItems() {
            items.forEach(item => {
                const rowHeight = parseInt(getComputedStyle(grid).getPropertyValue('grid-auto-rows'), 10);
                const rowGap = parseInt(getComputedStyle(grid).getPropertyValue('grid-gap'), 10);
                const contentHeight = item.querySelector('img').getBoundingClientRect().height;
                // Bereken het aantal rijen dat het item zou moeten innemen
                const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
                // Zet grid-row-end eigenschap
                item.style.gridRowEnd = `span ${rowSpan}`;
            });
        }
        
        // Filter functionaliteit
        function initFilterButtons() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Verwijder actieve class van alle knoppen
                    filterButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Voeg actieve class toe aan de aangeklikte knop
                    this.classList.add('active');
                    
                    // Pas filtering toe
                    const filterValue = this.getAttribute('data-filter');
                    
                    items.forEach(item => {
                        if (filterValue === '*' || item.classList.contains(filterValue)) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    
                    // Herbereken de grid layout na filtering
                    setTimeout(resizeGridItems, 100);
                });
            });
        }
    }
    
    /**
     * Voeg fade-in animaties toe aan pagina-elementen
     */
    function addFadeInAnimations() {
        // Selecteer elementen voor animatie
        const animateElements = document.querySelectorAll('.animate-fade-in');
        
        // Voeg klassen toe met vertraging
        animateElements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.classList.add(`delay-${(index % "300") + 100}`);
        });
    }
    
    /**
     * Utility: Debounce functie voor performance
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    /**
     * Polyfill voor imagesLoaded als het niet beschikbaar is
     */
    if (typeof imagesLoaded === 'undefined') {
        window.imagesLoaded = function(container, callback) {
            const images = container.querySelectorAll('img');
            let loadedCount = 0;
            const totalImages = images.length;
            
            if (totalImages === 0) {
                callback();
                return;
            }
            
            function imageLoaded() {
                loadedCount++;
                if (loadedCount === totalImages) {
                    callback();
                }
            }
            
            images.forEach(img => {
                if (img.complete) {
                    imageLoaded();
                } else {
                    img.addEventListener('load', imageLoaded);
                    img.addEventListener('error', imageLoaded);
                }
            });
        };
    }
});