// data-loader.js - Handles loading data from JSON files

const DataLoader = {
    masterData: [],
    destinationData: [],
    
    async loadMasterData() {
        try {
            console.log('Loading Master Data...');
            const response = await fetch('master_data.json');
            if (!response.ok) throw new Error('Failed to load master data');
            this.masterData = await response.json();
            console.log(`✓ Loaded ${this.masterData.length} master accounts`);
            return this.masterData;
        } catch (error) {
            console.error('Error loading master data:', error);
            return [];
        }
    },
    
    async loadDestinationData() {
        try {
            console.log('Loading Destination Data...');
            const response = await fetch('destination_data.json');
            if (!response.ok) throw new Error('Failed to load destination data');
            this.destinationData = await response.json();
            console.log(`✓ Loaded ${this.destinationData.length} destination accounts`);
            return this.destinationData;
        } catch (error) {
            console.error('Error loading destination data:', error);
            return [];
        }
    },
    
    async loadAll() {
        console.log('=== Starting Data Load ===');
        await Promise.all([
            this.loadMasterData(),
            this.loadDestinationData()
        ]);
        console.log('=== Data Load Complete ===');
        return {
            master: this.masterData,
            destination: this.destinationData
        };
    },
    
    getMasterData() {
        return this.masterData;
    },
    
    getDestinationData() {
        return this.destinationData;
    },
    
    getUniqueTypes() {
        const types = [...new Set(this.masterData.map(item => item.type))].filter(t => t);
        console.log('Unique Types:', types);
        return types;
    },
    
    getUniqueDestinationTypes() {
        const types = ['ALL', ...new Set(this.destinationData.map(item => item.accountTypeName))].filter(t => t);
        console.log('Unique Destination Types:', types);
        return types;
    },
    
    getAccountsByType(type) {
        return this.masterData.filter(acc => acc.type === type);
    },
    
    getDestinationAccountsByType(type) {
        if (type === 'ALL') return this.destinationData;
        return this.destinationData.filter(acc => acc.accountTypeName === type);
    }
};
