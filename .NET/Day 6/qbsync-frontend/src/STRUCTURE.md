src/
  app/                 # App-level setup such as Redux store
  shared/
    api/               # Shared API client
    components/        # Reusable UI/layout components
  features/
    auth/
      pages/
      store/
    account/
      pages/
    customer/
      pages/
    dashboard/
      pages/
    invoice/
      pages/
      store/
    item/
      pages/
    quickbooks/
      pages/

Legacy import paths under src/api, src/components, and the top level of each feature
are kept as compatibility wrappers so the current app keeps working while the codebase
adopts a cleaner structure.
