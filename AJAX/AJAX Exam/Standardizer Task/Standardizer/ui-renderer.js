// UI rendering
const UIRenderer = {
    currentType: "",
    currentDestType: "ALL",
    destTypes: [],
  
    typeMap: {
      Assets: "ASSETS",
      Liabilities: "LIABILITIES",
      Equity: "EQUITY/CAPITAL",
      Revenue: "Professional Service Revenue",
      COGS: "Product Cost",
      "Other Rev & Exp": "OTHER_REV_EXP_SUBACCOUNT",
      Expense: "Labor Expense",
    },
  
    // Find matching dest type
    findDestType(src) {
      const search = this.typeMap[src];
      if (!search) return src.toUpperCase();
      const norm = search.toLowerCase().trim();
  
      // Try exact, contains, then word match
      return (
        this.destTypes.find((t) => {
          const tl = t.toLowerCase().trim();
          return (
            tl === norm ||
            tl.includes(norm) ||
            norm.includes(tl) ||
            norm
              .split(/\s+/)
              .some((sw) =>
                tl.split(/\s+/).some((tw) => tw.includes(sw) || sw.includes(tw))
              )
          );
        }) || src.toUpperCase()
      );
    },
  
    // Initialize content for selected type
    initializeTypeContent(type) {
      this.renderSources();
      this.destTypes = DataLoader.getUniqueDestinationTypes();
      this.currentDestType =
        type === "Other Rev & Exp"
          ? "OTHER_REV_EXP_SUBACCOUNT"
          : this.findDestType(type);
      this.renderDestinationTypeScroller(this.destTypes);
      this.updateDestActive();
      this.renderDests();
    },
  
    // Render type buttons
    renderTypeNavbar(types) {
      const nav = $("#typeNavbar");
      const btns = nav.find(".submit-btn, .clear-btn").detach();
      nav.empty();
  
      types.forEach((t, i) => {
        const btn = $("<button>")
          .addClass("type-btn")
          .text(t)
          .attr("data-type", t)
          .on("click", () => this.changeType(t));
        if ((i === 0 && !this.currentType) || t === this.currentType) {
          btn.addClass("active");
          this.currentType = t;
        }
        nav.append(btn);
      });
      nav.append(btns);
  
      if (this.currentType) {
        this.initializeTypeContent(this.currentType);
      }
    },
  
    // Change type
    changeType(type) {
      $(".type-btn").not(".submit-btn, .clear-btn").removeClass("active");
      $(".type-btn")
        .filter(function () {
          return $(this).data("type") === type;
        })
        .addClass("active");
      this.currentType = type;
      this.initializeTypeContent(type);
    },
  
    // Render sources + mappings
    renderSources() {
      const accounts = DataLoader.getAccountsByType(this.currentType);
      const container = $("#sourceMappingList").empty();
  
      if (!accounts.length) {
        container.html('<div class="empty-state">No accounts found</div>');
        return;
      }
  
      accounts.forEach((acc) => {
        const key = `${acc.type}-${acc.number}`;
        if (!AppState.mappings[key]) {
          AppState.mappings[key] = {
            source: acc,
            mostLikely: null,
            likely: null,
            possible: null,
          };
        }
  
        container.append(
          $("<div>")
            .addClass("source-mapping-row")
            .append(
              $("<div>")
                .addClass("source-account-col bg-light")
                .css({
                  'min-height': '80px',
                  'max-height': '80px',
                  'overflow': 'hidden',
                  'display': 'flex',
                  'flex-direction': 'column',
                  'justify-content': 'center'
                })
                .html(`
                  <span class="account-code text-primary" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${acc.number} - ${acc.name}</span>`),
              $("<div>")
                .addClass("mapping-columns")
                .append(
                  this.mapCol("mostLikely", key),
                  this.mapCol("likely", key),
                  this.mapCol("possible", key)
                )
            )
        );
      });
  
      DragDrop.initialize();
    },
  
    // Create mapping column
    mapCol(type, key) {
      const col = $("<div>")
        .addClass("mapping-column")
        .attr({ "data-column-type": type, "data-source-key": key })
        .css({
          'min-height': '80px',
          'max-height': '80px',
          'overflow': 'hidden',
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center'
        });
      const mapped = AppState.mappings[key]?.[type];
      if (mapped) {
        col.append(
          $("<div>")
            .addClass("mapped-account")
            .attr({
              "data-account-code": mapped.accountCode,
              "data-account-name": mapped.accountName,
            })
            .css({
              'width': '100%',
              'overflow': 'hidden'
            })
            .html(`
              <span class="account-code text-dark " style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${mapped.accountCode} - ${mapped.accountName}</span>`)
        );
      }
      return col;
    },
  
    // Re-render mapping row
    renderMappingRow(key) {
      const row = $(`.source-mapping-row`).filter(function () {
        return $(this).find(`[data-source-key="${key}"]`).length > 0;
      });
      if (!row.length) return;
      row
        .find(".mapping-columns")
        .empty()
        .append(
          this.mapCol("mostLikely", key),
          this.mapCol("likely", key),
          this.mapCol("possible", key)
        );
      DragDrop.initialize();
    },
  
    // Render dest type scroller
    renderDestinationTypeScroller(types) {
      const scroller = $("#destinationTypeScroller").empty();
  
      types.forEach((t) => {
        const btn = $("<button>")
          .addClass("destination-type-btn btn btn-sm btn-outline-success")
          .text(t)
          .attr("data-type", t)
          .on("click", () => this.changeDestType(t));
        if (t === this.currentDestType)
          btn.removeClass("btn-outline-success").addClass("btn-success");
        scroller.append(btn);
      });
  
      $("#scrollLeft, #scrollRight").off("click");
      $("#scrollLeft").on("click", () =>
        scroller.animate({ scrollLeft: scroller.scrollLeft() - 200 }, 80)
      );
      $("#scrollRight").on("click", () =>
        scroller.animate({ scrollLeft: scroller.scrollLeft() + 200 }, 80)
      );
    },
  
    // Update dest button active state
    updateDestButtonActive(type) {
      $(".destination-type-btn")
        .removeClass("btn-success")
        .addClass("btn-outline-success")
        .filter(function () {
          return $(this).data("type") === type;
        })
        .removeClass("btn-outline-success")
        .addClass("btn-success");
    },
  
    // Change dest type
    changeDestType(type) {
      this.updateDestButtonActive(type);
      this.currentDestType = type;
      this.renderDests();
    },
  
    // Update dest active
    updateDestActive() {
      this.updateDestButtonActive(this.currentDestType);
    },
  
    // Get mapped codes
    getMapped() {
      const codes = new Set();
      Object.values(AppState.mappings).forEach((m) => {
        if (m.mostLikely) codes.add(m.mostLikely.accountCode);
        if (m.likely) codes.add(m.likely.accountCode);
        if (m.possible) codes.add(m.possible.accountCode);
      });
      return codes;
    },
  
    // Render destinations
    renderDests() {
      const list = $("#destinationAccountList").empty();
  
      // Get accounts and word contain "Other and revenue or cost"
      let accounts =
        this.currentType === "Other Rev & Exp" ||
        this.currentDestType === "OTHER_REV_EXP_SUBACCOUNT"
          ? DataLoader.getDestinationAccountsByType("ALL").filter((a) => {
              const s = a.subAccountName.toLowerCase();
              return (
                s.includes("other") &&
                (s.includes("revenue") || s.includes("expense"))
              );
            })
          : DataLoader.getDestinationAccountsByType(this.currentDestType);
  
      // Only search filter (removed mapped filter to allow cloning)
      const search = $("#destinationSearch").val().toLowerCase();
      if (search) {
        accounts = accounts.filter(
          (a) =>
            a.accountCode.toLowerCase().includes(search) ||
            a.accountName.toLowerCase().includes(search)
        );
      }
  
      if (!accounts.length) {
        list.html('<div class="empty-state">No accounts available</div>');
        return;
      }
  
      accounts.forEach((a) => {
        list.append(
          $("<div>")
            .addClass("account-item bg-light")
            .attr({
              "data-account-code": a.accountCode,
              "data-account-name": a.accountName,
            })
            .css({
              'min-height': '80px',
              'max-height': '80px',
              'overflow': 'hidden',
              'display': 'flex',
              'flex-direction': 'column',
              'justify-content': 'center'
            })
            .html(`
              <span class="account-code  text-dark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${a.accountCode} - ${a.accountName}</span>`)
        );
      });
  
      DragDrop.initialize();
    },
  
    renderDestinationAccounts(type) {
      if (type && type !== this.currentDestType) {
        this.changeDestType(type);
      } else {
        this.renderDests();
      }
    },
  };