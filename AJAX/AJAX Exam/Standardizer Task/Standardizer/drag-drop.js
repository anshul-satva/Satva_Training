const DragDrop = {
  sortableInstances: [],

  // Destroy old instances and reinitialize
  initialize() {
    this.sortableInstances.forEach((instance) => {
      try {
        instance.destroy();
      } catch (e) {}
    });
    this.sortableInstances = [];
    this.initializeDestinationList();
    this.initializeMappingColumns();
  },

  // Make destination list draggable with CLONE
  initializeDestinationList() {
    const list = document.getElementById("destinationAccountList");
    if (!list) return;

    const sortable = Sortable.create(list, {
      group: {
        name: "accounts",
        pull: "clone", // Clone when dragging out
        put: true, // Allow items to be dropped back
      },
      sort: false,
      animation: 150,
      draggable: ".account-item",
      onStart: (evt) => $(evt.item).addClass("dragging"),
      onEnd: (evt) => {
        $(evt.item).removeClass("dragging");
      },
      onAdd: (evt) => this.handleAccountReturn(evt),
    });

    this.sortableInstances.push(sortable);
  },

  // Make mapping columns droppable
  initializeMappingColumns() {
    $(".mapping-column").each((i, el) => {
      const sourceKey = $(el).attr("data-source-key");
      const columnType = $(el).attr("data-column-type");

      const sortable = Sortable.create(el, {
        group: { name: "accounts", pull: true, put: true },
        animation: 150,
        draggable: ".account-item, .mapped-account",
        onAdd: (evt) => this.handleDrop(evt, sourceKey, columnType),
        onRemove: (evt) => this.handleRemove(evt, sourceKey, columnType),
      });

      this.sortableInstances.push(sortable);
    });
  },

  // Handle account drop into mapping column
  handleDrop(evt, sourceKey, columnType) {
    const item = $(evt.item);
    const account = this.extractAccount(item);

    if (!account?.accountCode || account.number) {
      item.remove();
      return;
    }

    // Check for duplicate in SAME row
    if (this.isDuplicateInSameRow(sourceKey, account.accountCode)) {
      alert(`Account ${account.accountCode} is already mapped in this row!`);
      item.remove();
      return;
    }

    if (this.applyChainShift(sourceKey, columnType, account)) {
      item.remove();
      UIRenderer.renderMappingRow(sourceKey);
    } else {
      item.remove();
    }
  },

  // Check if account already exists in the SAME row
  isDuplicateInSameRow(sourceKey, accountCode) {
    const mapping = AppState.mappings[sourceKey];
    if (!mapping) return false;

    return (
      mapping.mostLikely?.accountCode === accountCode ||
      mapping.likely?.accountCode === accountCode ||
      mapping.possible?.accountCode === accountCode
    );
  },

  // Extract account data from element
  extractAccount(item) {
    if (!item.hasClass("account-item") && !item.hasClass("mapped-account"))
      return null;

    return {
      accountCode: item.find(".account-code").text().trim(),
      accountName: item.find(".account-name").text().trim(),
    };
  },

  // Handle account removal from mapping column
  handleRemove(evt, sourceKey, columnType) {
    const item = $(evt.item);
    const account = this.extractAccount(item);
    if (!account) return;

    const mapping = AppState.mappings[sourceKey];
    if (mapping) mapping[columnType] = null;

    item.remove();
    setTimeout(() => {
      UIRenderer.renderMappingRow(sourceKey);
    }, 50);
  },

  // Handle account dropped back to destination list (unmapping)
  handleAccountReturn(evt) {
    const item = $(evt.item);
    const account = this.extractAccount(item);
    if (!account) {
      item.remove();
      return;
    }

    // Find which specific mapping column this item came from
    const fromElement = evt.from;

    if (fromElement && fromElement.classList.contains("mapping-column")) {
      const sourceKey = $(fromElement).attr("data-source-key");
      const columnType = $(fromElement).attr("data-column-type");

      // Only remove from the specific column it came from
      const mapping = AppState.mappings[sourceKey];
      if (mapping && mapping[columnType]?.accountCode === account.accountCode) {
        mapping[columnType] = null;
        setTimeout(() => UIRenderer.renderMappingRow(sourceKey), 10);
      }
    }

    item.remove();
  },

  // Apply chain shift when dropping account
  applyChainShift(sourceKey, targetCol, newAccount) {
    const mapping = AppState.mappings[sourceKey];
    if (!mapping) return false;

    // Chain shift logic
    if (targetCol === "mostLikely") {
      const old = {
        m: mapping.mostLikely,
        l: mapping.likely,
        p: mapping.possible,
      };
      mapping.mostLikely = newAccount;
      if (old.m) {
        mapping.likely = old.m;
        if (old.l) mapping.possible = old.l;
      }
    } else if (targetCol === "likely") {
      const old = { l: mapping.likely, p: mapping.possible };
      mapping.likely = newAccount;
      if (old.l) mapping.possible = old.l;
    } else {
      mapping.possible = newAccount;
    }

    return true;
  },
};
