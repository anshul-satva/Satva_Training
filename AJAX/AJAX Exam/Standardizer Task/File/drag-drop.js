// drag-drop.js - Handles drag and drop with chain shift logic

const DragDrop = {
    sortableInstances: [],
    
    initialize() {
        // Destroy existing instances
        this.sortableInstances.forEach(instance => instance.destroy());
        this.sortableInstances = [];
        
        // Make destination accounts draggable
        this.initializeDestinationList();
        
        // Make mapping columns droppable
        this.initializeMappingColumns();
    },
    
    initializeDestinationList() {
        const destinationList = document.getElementById('destinationAccountList');
        if (!destinationList) return;
        
        const sortable = Sortable.create(destinationList, {
            group: {
                name: 'accounts',
                pull: 'clone',
                put: false
            },
            sort: false,
            animation: 150,
            onEnd: (evt) => {
                setTimeout(() => UIRenderer.renderDestinationAccounts(), 100);
            }
        });
        
        this.sortableInstances.push(sortable);
    },
    
    initializeMappingColumns() {
        $('.mapping-column').each((index, element) => {
            const sourceKey = $(element).attr('data-source-key');
            const columnType = $(element).attr('data-column-type');
            
            const sortable = Sortable.create(element, {
                group: {
                    name: 'accounts',
                    pull: true,
                    put: true
                },
                animation: 150,
                filter: '.mapping-column-header',
                onAdd: (evt) => {
                    this.handleAccountDrop(evt, sourceKey, columnType);
                }
            });
            
            this.sortableInstances.push(sortable);
        });
    },
    
    handleAccountDrop(evt, sourceKey, columnType) {
        const item = $(evt.item);
        
        // Extract account data
        let account = this.extractAccountFromElement(item);
        
        if (!account) {
            console.error('Could not extract account data');
            return;
        }
        
        console.log(`Dropped: ${account.accountCode} into ${columnType} for ${sourceKey}`);
        
        // Apply chain shift rule
        this.applyChainShiftRule(sourceKey, columnType, account);
        
        // Re-render the row
        UIRenderer.renderMappingRow(sourceKey);
    },
    
    extractAccountFromElement(item) {
        let account = null;
        
        if (item.hasClass('account-item') || item.hasClass('mapped-account')) {
            const codeText = item.find('.account-code').text().trim();
            const nameText = item.find('.account-name').text().trim();
            account = {
                accountCode: codeText,
                accountName: nameText
            };
        }
        
        return account;
    },
    
    applyChainShiftRule(sourceKey, targetColumn, newAccount) {
        const mapping = AppState.mappings[sourceKey];
        
        if (!mapping) {
            console.error('No mapping found for', sourceKey);
            return;
        }
        
        console.log('BEFORE Chain Shift:', {
            mostLikely: mapping.mostLikely?.accountCode || 'empty',
            likely: mapping.likely?.accountCode || 'empty',
            possible: mapping.possible?.accountCode || 'empty'
        });
        
        if (targetColumn === 'mostLikely') {
            // Shift everything to the right
            const oldMostLikely = mapping.mostLikely;
            const oldLikely = mapping.likely;
            
            mapping.mostLikely = newAccount;
            
            if (oldMostLikely) {
                mapping.likely = oldMostLikely;
                
                if (oldLikely) {
                    mapping.possible = oldLikely;
                    // Old possible is removed
                }
            }
        } else if (targetColumn === 'likely') {
            const oldLikely = mapping.likely;
            
            mapping.likely = newAccount;
            
            if (oldLikely) {
                mapping.possible = oldLikely;
                // Old possible is removed
            }
        } else if (targetColumn === 'possible') {
            // Simply replace possible
            mapping.possible = newAccount;
        }
        
        console.log('AFTER Chain Shift:', {
            mostLikely: mapping.mostLikely?.accountCode || 'empty',
            likely: mapping.likely?.accountCode || 'empty',
            possible: mapping.possible?.accountCode || 'empty'
        });
    }
};
