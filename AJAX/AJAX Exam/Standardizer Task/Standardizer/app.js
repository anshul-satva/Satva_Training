// Main app controller
const AppState = {
    mappings: {}
};

$(document).ready(async function() {

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }

    try {
        // Load Excel files
        await DataLoader.loadAll();
        
        // Load saved mappings
        loadSavedMappings();
        
        // Initialize UI
        initializeApp();
        
        
    } catch (err) {
        console.error('Failed to initialize:', err);
        alert('Error: Could not load Excel files. Make sure both files are in the same folder and you\'re using a web server (not file://)');
    }
});

function loadSavedMappings() {
    const saved = localStorage.getItem('mappings');
    if (saved) {
        try {
            AppState.mappings = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load mappings:', e);
        }
    }
}

function initializeApp() {
    // Get types and render navbar
    const types = DataLoader.getUniqueTypes();
    UIRenderer.renderTypeNavbar(types);
    
    // Get destination types and render scroller
    const destTypes = DataLoader.getUniqueDestinationTypes();
    UIRenderer.renderDestinationTypeScroller(destTypes);
    
    // Setup search handler
    $('#destinationSearch').on('input', () => UIRenderer.renderDestinationAccounts());
    
    // Setup save button
    $('.submit-btn').on('click', saveAllMappings);
    
    // Setup clear data button
    $('#clearDataBtn').on('click', clearAllData);
}

function clearAllData() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to clear all mappings? This action cannot be undone.')) {
        localStorage.clear();
        window.location.href = "login.html"
    }
}

function saveAllMappings() {
    const data = [];
    Object.keys(AppState.mappings).forEach(key => {
        const m = AppState.mappings[key];
        if (m.mostLikely || m.likely || m.possible) {
            data.push({
                source: `${m.source.number} - ${m.source.name}`,
                type: m.source.type,
                mostLikely: m.mostLikely ? `${m.mostLikely.accountCode} - ${m.mostLikely.accountName}` : null,
                likely: m.likely ? `${m.likely.accountCode} - ${m.likely.accountName}` : null,
                possible: m.possible ? `${m.possible.accountCode} - ${m.possible.accountName}` : null
            });
        }
    });
    
    localStorage.setItem('mappings', JSON.stringify(AppState.mappings));
    
    
    // Show success toast
    $('#toastMsg').text(`Saved ${data.length} mappings!`);
    const toast = new bootstrap.Toast($('#saveToast')[0]);
    toast.show();
}

/* logout */
$("#logoutBtn").click(() => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });