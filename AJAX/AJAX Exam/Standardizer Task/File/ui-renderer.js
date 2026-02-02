// ui-renderer.js - Handles all UI rendering

const UIRenderer = {
    currentType: '',
    currentDestinationType: 'ALL',
    allSourceAccounts: [],
    
    renderTypeNavbar(types) {
        console.log('Rendering type navbar with', types.length, 'types');
        const typeNavbar = $('#typeNavbar');
        const submitBtn = typeNavbar.find('.submit-btn').detach();
        typeNavbar.empty();
        
        types.forEach((type, index) => {
            const btn = $('<button>')
                .addClass('type-btn')
                .text(type)
                .attr('data-type', type);
            
            if (index === 0 && !this.currentType) {
                btn.addClass('active');
                this.currentType = type;
            } else if (type === this.currentType) {
                btn.addClass('active');
            }
            
            btn.on('click', () => {
                this.handleTypeChange(type);
            });
            
            typeNavbar.append(btn);
        });
        
        typeNavbar.append(submitBtn);
        
        // Auto-render for first type
        if (this.currentType && types.includes(this.currentType)) {
            this.renderSourceAccounts();
            this.renderMappingGrid();
            
            if (!this.currentDestinationType || this.currentDestinationType === 'ALL') {
                this.currentDestinationType = this.currentType.toUpperCase();
            }
            this.updateDestinationTypeActive();
            this.renderDestinationAccounts();
        }
    },
    
    handleTypeChange(type) {
        console.log('Type changed to:', type);
        $('.type-btn').not('.submit-btn').removeClass('active');
        $(`.type-btn[data-type="${type}"]`).addClass('active');
        this.currentType = type;
        
        // Update UI
        this.renderSourceAccounts();
        this.renderMappingGrid();
        
        // Update destination to match
        this.currentDestinationType = type.toUpperCase();
        this.updateDestinationTypeActive();
        this.renderDestinationAccounts();
    },
    
    renderSourceAccounts() {
        const sourceList = $('#sourceAccountList');
        sourceList.empty();
        
        this.allSourceAccounts = DataLoader.getAccountsByType(this.currentType);
        console.log(`Rendering ${this.allSourceAccounts.length} source accounts for type: ${this.currentType}`);
        
        if (this.allSourceAccounts.length === 0) {
            sourceList.html('<div class="empty-state">No accounts found for this type</div>');
            return;
        }
        
        this.allSourceAccounts.forEach(account => {
            const accountItem = $('<div>')
                .addClass('account-item source-account-item')
                .attr('data-account-number', account.number)
                .html(`
                    <span class="account-code">${account.number}</span>
                    <span class="account-name">${account.name}</span>
                `);
            
            sourceList.append(accountItem);
        });
    },
    
    renderMappingGrid() {
        const mappingContainer = $('#mappingContainer');
        mappingContainer.empty();
        
        if (this.allSourceAccounts.length === 0) {
            mappingContainer.html('<div class="empty-state">No accounts to map</div>');
            return;
        }
        
        console.log(`Rendering mapping grid for ${this.allSourceAccounts.length} accounts`);
        
        this.allSourceAccounts.forEach((account) => {
            const accountKey = `${account.type}-${account.number}`;
            
            // Initialize mapping if not exists
            if (!AppState.mappings[accountKey]) {
                AppState.mappings[accountKey] = {
                    source: account,
                    mostLikely: null,
                    likely: null,
                    possible: null
                };
            }
            
            // Create source label
            const sourceLabel = $('<div>')
                .addClass('source-label')
                .html(`
                    <span class="account-code">${account.number}</span>
                    <span class="account-name">${account.name}</span>
                `);
            
            // Create mapping row
            const mappingRow = $('<div>')
                .addClass('mapping-row')
                .attr('data-source-key', accountKey);
            
            // Create three columns
            const mostLikelyCol = this.createMappingColumn('mostLikely', accountKey);
            const likelyCol = this.createMappingColumn('likely', accountKey);
            const possibleCol = this.createMappingColumn('possible', accountKey);
            
            mappingRow.append(mostLikelyCol, likelyCol, possibleCol);
            mappingContainer.append(sourceLabel, mappingRow);
        });
        
        // Initialize drag & drop
        DragDrop.initialize();
    },
    
    createMappingColumn(columnType, sourceKey) {
        const columnLabels = {
            mostLikely: 'Most Likely',
            likely: 'Likely',
            possible: 'Possible'
        };
        
        const col = $('<div>')
            .addClass('mapping-column')
            .attr('data-column-type', columnType)
            .attr('data-source-key', sourceKey)
            .html(`<div class="mapping-column-header ${columnType}">${columnLabels[columnType]}</div>`);
        
        // If there's a mapped account, render it
        const mappedAccount = AppState.mappings[sourceKey] ? AppState.mappings[sourceKey][columnType] : null;
        if (mappedAccount) {
            const accountDiv = this.createMappedAccountElement(mappedAccount);
            col.append(accountDiv);
        }
        
        return col;
    },
    
    createMappedAccountElement(account) {
        return $('<div>')
            .addClass('mapped-account')
            .attr('data-account-code', account.accountCode)
            .attr('data-account-name', account.accountName)
            .html(`
                <span class="account-code">${account.accountCode}</span>
                <span class="account-name">${account.accountName}</span>
            `);
    },
    
    renderMappingRow(sourceKey) {
        const row = $(`.mapping-row[data-source-key="${sourceKey}"]`);
        
        if (row.length === 0) {
            console.error('Row not found for', sourceKey);
            return;
        }
        
        row.empty();
        
        const mapping = AppState.mappings[sourceKey];
        
        const mostLikelyCol = this.createMappingColumn('mostLikely', sourceKey);
        const likelyCol = this.createMappingColumn('likely', sourceKey);
        const possibleCol = this.createMappingColumn('possible', sourceKey);
        
        row.append(mostLikelyCol, likelyCol, possibleCol);
        
        DragDrop.initialize();
    },
    
    renderDestinationTypeScroller(types) {
        console.log('Rendering destination type scroller with', types.length, 'types');
        const scroller = $('#destinationTypeScroller');
        scroller.empty();
        
        types.forEach((type) => {
            const btn = $('<button>')
                .addClass('destination-type-btn')
                .text(type)
                .attr('data-type', type);
            
            if (type === this.currentDestinationType) {
                btn.addClass('active');
            }
            
            btn.on('click', () => {
                this.handleDestinationTypeChange(type);
            });
            
            scroller.append(btn);
        });
    },
    
    handleDestinationTypeChange(type) {
        console.log('Destination type changed to:', type);
        $('.destination-type-btn').removeClass('active');
        $(`.destination-type-btn[data-type="${type}"]`).addClass('active');
        this.currentDestinationType = type;
        this.renderDestinationAccounts();
    },
    
    updateDestinationTypeActive() {
        $('.destination-type-btn').removeClass('active');
        $(`.destination-type-btn[data-type="${this.currentDestinationType}"]`).addClass('active');
    },
    
    renderDestinationAccounts() {
        const destList = $('#destinationAccountList');
        destList.empty();
        
        let filteredAccounts = DataLoader.getDestinationAccountsByType(this.currentDestinationType);
        
        // Apply search filter
        const searchTerm = $('#destinationSearch').val().toLowerCase();
        if (searchTerm) {
            filteredAccounts = filteredAccounts.filter(acc => 
                String(acc.accountCode).toLowerCase().includes(searchTerm) ||
                acc.accountName.toLowerCase().includes(searchTerm)
            );
        }
        
        console.log(`Rendering ${filteredAccounts.length} destination accounts`);
        
        if (filteredAccounts.length === 0) {
            destList.html('<div class="empty-state">No accounts found</div>');
            return;
        }
        
        filteredAccounts.forEach(account => {
            const accountItem = $('<div>')
                .addClass('account-item')
                .attr('data-account-code', account.accountCode)
                .attr('data-account-name', account.accountName)
                .html(`
                    <span class="account-code">${account.accountCode}</span>
                    <span class="account-name">${account.accountName}</span>
                `);
            
            destList.append(accountItem);
        });
        
        DragDrop.initialize();
    }
};
