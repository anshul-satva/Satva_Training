// app.js - Main application controller

const AppState = {
    mappings: {},
    
    saveMappings() {
        const savedMappings = [];
        
        Object.keys(this.mappings).forEach(key => {
            const mapping = this.mappings[key];
            
            if (mapping.mostLikely || mapping.likely || mapping.possible) {
                savedMappings.push({
                    sourceAccount: `${mapping.source.number} - ${mapping.source.name}`,
                    sourceType: mapping.source.type,
                    mostLikely: mapping.mostLikely 
                        ? `${mapping.mostLikely.accountCode} - ${mapping.mostLikely.accountName}` 
                        : null,
                    likely: mapping.likely 
                        ? `${mapping.likely.accountCode} - ${mapping.likely.accountName}` 
                        : null,
                    possible: mapping.possible 
                        ? `${mapping.possible.accountCode} - ${mapping.possible.accountName}` 
                        : null
                });
            }
        });
        
        localStorage.setItem('accountMappings', JSON.stringify(savedMappings));
        localStorage.setItem('currentType', UIRenderer.currentType);
        localStorage.setItem('mappingsData', JSON.stringify(this.mappings));
        
        console.log(`Saved ${savedMappings.length} mappings to localStorage`);
        
        return savedMappings;
    },
    
    loadMappings() {
        const savedMappingsData = localStorage.getItem('mappingsData');
        const savedType = localStorage.getItem('currentType');
        
        if (savedMappingsData) {
            try {
                this.mappings = JSON.parse(savedMappingsData);
                console.log(`Loaded ${Object.keys(this.mappings).length} mappings from localStorage`);
            } catch (e) {
                console.error('Error loading mappings:', e);
                this.mappings = {};
            }
        }
        
        if (savedType) {
            UIRenderer.currentType = savedType;
            console.log('Restored type:', savedType);
        }
    }
};

// Initialize Application
$(document).ready(async function() {
    console.log('=================================');
    console.log('Standardizer App Starting...');
    console.log('=================================');
    
    // Load data from JSON files
    await DataLoader.loadAll();
    
    // Load saved mappings
    AppState.loadMappings();
    
    // Render Type Navbar
    const types = DataLoader.getUniqueTypes();
    UIRenderer.renderTypeNavbar(types);
    
    // Render Destination Type Scroller
    const destTypes = DataLoader.getUniqueDestinationTypes();
    UIRenderer.renderDestinationTypeScroller(destTypes);
    
    // Render initial destination accounts
    UIRenderer.renderDestinationAccounts();
    
    // Setup event handlers
    setupEventHandlers();
    
    console.log('=================================');
    console.log('✓ App Initialized Successfully!');
    console.log('=================================');
});

function setupEventHandlers() {
    // Submit button
    $('#submitBtn').on('click', handleSubmit);
    
    // Scroll buttons
    $('#scrollLeft').on('click', () => {
        $('.type-scroller-container').animate({ scrollLeft: '-=200' }, 300);
    });
    
    $('#scrollRight').on('click', () => {
        $('.type-scroller-container').animate({ scrollLeft: '+=200' }, 300);
    });
    
    // Search input
    $('#destinationSearch').on('input', () => {
        UIRenderer.renderDestinationAccounts();
    });
    
    // Navbar links (no action)
    $('#journalLink, #adminLink').on('click', (e) => {
        e.preventDefault();
    });
    
    $('#coaLink').on('click', (e) => {
        e.preventDefault();
    });
}

function handleSubmit() {
    const savedMappings = AppState.saveMappings();
    
    // Show update notice
    $('#updateNotice')
        .addClass('show')
        .html(`<i class="fas fa-check-circle"></i> Successfully saved ${savedMappings.length} account mappings!`);
    
    setTimeout(() => {
        $('#updateNotice').removeClass('show');
    }, 3000);
    
    alert(`✓ Successfully saved ${savedMappings.length} account mappings!`);
    
    console.log('Submitted Mappings:', savedMappings);
}
