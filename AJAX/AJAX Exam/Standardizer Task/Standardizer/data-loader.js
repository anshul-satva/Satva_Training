// Loading data from Excel files
const DataLoader = {
  masterData: [],
  destinationData: [],
  masterFileLoaded: false,
  destinationFileLoaded: false,

  async loadMasterFile() {
    try {
      const response = await fetch(
        "./ExcelSheets/Master_Chart_of_account.xlsx"
      );
      if (!response.ok) throw new Error("Failed to load Master Excel");

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // Type, Number, Name will come from MASTER EXCEL
      this.masterData = jsonData
        .filter((row) => row.Number && row.Name)
        .map((row, index) => ({
          id: "master_" + index,
          number: String(row.Number).trim(),
          name: String(row.Name).trim(),
          type: String(row.Type || "Other").trim(),
          group: row.Group || "",
          subGroup: row["Sub-Group"] || "",
        }));

      this.masterFileLoaded = true;
      return this.masterData;
    } catch (error) {
      console.error("Error loading master Excel:", error);
      throw error;
    }
  },

  async loadDestinationFile() {
    try {
      const response = await fetch(
        "./ExcelSheets/destination_chart_of_account.xlsx"
      );
      if (!response.ok) throw new Error("Failed to load Destination Excel");

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // AccountTypeName, AccountCode, AccountName, SubAccountName will come from DESTINATION EXCEL
      this.destinationData = jsonData
        .filter((row) => row.AccountCode && row.AccountName)
        .map((row, index) => ({
          id: "dest_" + index,
          accountCode: String(row.AccountCode).trim(),
          accountName: String(row.AccountName).trim(),
          accountTypeName: String(row.AccountTypeName || "").trim(),
          subAccountName: String(row.SubAccountName || "").trim(),
        }));

      this.destinationFileLoaded = true;
      return this.destinationData;
    } catch (error) {
      console.error("Error loading destination Excel:", error);
      throw error;
    }
  },

  async loadAll() {
    try {
      await Promise.all([this.loadMasterFile(), this.loadDestinationFile()]);

      return {
        master: this.masterData,
        destination: this.destinationData,
      };
    } catch (error) {
      console.error("Failed to load Excel files:", error);
      throw error;
    }
  },

  // Check if both files are loaded
  isReady() {
    return this.masterFileLoaded && this.destinationFileLoaded;
  },

  // Get master data (SOURCE accounts from Master Excel)
  getMasterData() {
    return this.masterFileLoaded ? this.masterData : [];
  },

  // Get destination data (DESTINATION accounts from Destination Excel)
  getDestinationData() {
    return this.destinationFileLoaded ? this.destinationData : [];
  },

  // Get unique types from Master Excel (for main navbar buttons)
  getUniqueTypes() {
    const types = [...new Set(this.masterData.map((item) => item.type))].filter(
      (t) => t
    );
    return types;
  },

  // Get unique destination types (for destination type scroll)
  getUniqueDestinationTypes() { const types = ['ALL', ...new Set(this.destinationData.map(item => item.accountTypeName))].filter(t => t); return types; },

  // Get accounts by type from Master Excel
  getAccountsByType(type) {
    if (!this.masterFileLoaded) return [];
    return this.masterData.filter((acc) => acc.type === type);
  },

  // Get destination accounts by type from Destination Excel 
  getDestinationAccountsByType(type) {
    if (!this.destinationFileLoaded) return [];

    if (type === "ALL") {
      return this.destinationData;
    }

    return this.destinationData.filter((acc) => acc.accountTypeName === type);
  },
};
