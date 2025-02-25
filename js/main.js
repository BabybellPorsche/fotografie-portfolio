document.addEventListener('DOMContentLoaded', function() {
    // Initialiseer Lightbox
    let lightbox = new SimpleLightbox('.gallery-item', {
        captionsData: 'alt',
        captionDelay: 250
    });
    
    // Initialiseer Isotope voor filtering
    let grid = document.querySelector('.grid-container');
    let iso;
    
    if (grid) {
        iso = new Isotope(grid, {
            itemSelector: '.grid-item',
            percentPosition: true,
            layoutMode: 'masonry'
        });
        
        // Filterknoppen
        let filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Actieve klasse verwijderen van alle knoppen
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.add('bg-gray-200');
                    btn.classList.remove('bg-primary', 'text-white');
                });
                
                // Actieve klasse toevoegen aan geklikte knop
                this.classList.add('active', 'bg-primary', 'text-white');
                this.classList.remove('bg-gray-200');
                
                // Filter data ophalen
                let filterValue = this.getAttribute('data-filter');
                
                if (filterValue === '*') {
                    iso.arrange({ filter: '*' });
                } else {
                    iso.arrange({ filter: '.' + filterValue });
                }
            });
        });
    }
    
    // Mobiel menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
        });
    }
});