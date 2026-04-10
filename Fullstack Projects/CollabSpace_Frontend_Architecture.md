# CollabSpace Frontend Architecture Guide

This document serves as the comprehensive architectural guide for the frontend codebase of CollabSpace. It is meant to prepare you for any code reviews or group discussions, providing a deep dive strictly into the frontend logic, folder structures, layouts, routing, states, and API bridges.

## 1. High-Level Folder Structure Overview

Your application resides entirely within the `src/` directory. It uses **Vite** as the build tool and **React (TypeScript)** as the library. The structure enforces a Domain-Driven separation of concerns:

```text
src/
├── app/               # Initial application setups (Router, Dark Mode Theme Config)
├── components/        # Reusable standard UI and layout containers
│   ├── common/        # Shared buttons, cards, empty states, Role Badges
│   ├── layout/        # AppShell (Sidebar & Topbar)
│   └── routing/       # ProtectedRoute logic
├── features/          # Domain-specific pages and their internal logic
│   └── pages/         # Dashboard, Membership, Projects, Auth files
├── hooks/             # Global Application State (Auth Context, Color Mode Context)
├── lib/               # Utility libraries (Local Storage helpers)
├── services/          # Axios API communication bridges
├── types/             # Typescript Entities aligning to Backend Schemas
├── App.tsx            # The master layout wrapper injected with AntD ConfigProviders
└── main.tsx           # React DOM Entry point mounting the overall app router
```

---

## 2. Core Application Lifecycle (Entry & Routing)

### `main.tsx`
This is where the React tree mounts to the DOM `#root`. It simply grabs `appRouter` and renders it.

### `app/router.tsx`
CollabSpace natively relies on the modern `react-router-dom` module (specifically `createBrowserRouter`).
It dictates exactly which UI is drawn for specific URLs:

*   **Public Routes:** Paths like `/login` and `/register` bypass constraints.
*   **Protected Routes:** Anything inside the `<ProtectedRoute />` wrapper checks. If a user is not authenticated natively, it forces them entirely back natively to the `/login` screen.
*   **AppShell Wrapper:** Pages like `/dashboard`, `/projects`, `/organizations` are magically rendered exactly *inside* the massive Sidebar Layout configured in `AppShell`.

### `components/layout/app-shell.tsx`
**Purpose:** This component acts as the global Master UI. It physically paints the responsive sidebar and top navigation title section. 
**Key Mechanism:** All inner pages are injected dynamically into the shell using React Router's `<Outlet />` tag. When you change pages, the Sidebar stays perfectly still, and only the `<Outlet />` refreshes!
**Security Logic Details:**
*   You implemented a brilliant global rule here. The main sidebar dropdown is natively mapped strictly to `setActiveOrganizationId`. Switching it forces a completely secure kick back to the `/dashboard`.

---

## 3. Global Application State (Hooks)

CollabSpace avoids overly complex state managers (like Redux) in favor of modern **React Contexts**.

### `hooks/auth-provider.tsx` & `use-auth.ts`
This is the neurological center for authentication handling.
1.  **State Management:** Holds the `user` payload perfectly via `useState`.
2.  **Bootstrap Phase:** Checks `lib/storage.ts` initially to see if an active JWT access-token is stored in `localStorage`. If yes, it attempts to stealth refresh user data.
3.  **Active Workspace Sync:** Contains `syncActiveOrganization()`. By default, it aggressively checks if your selected organization from `localStorage` matches your existing memberships. This natively guards against a scenario where your admin access was revoked!

### `hooks/use-color-mode.tsx`
Configures exactly the boolean CSS state to toggle 'light' or 'dark' themes.

---

## 4. API Communication (The `services/` Folder)

The entire frontend interacts with your NodeJS backend purely via Axios modules inside the `services/` directory.

### `services/api.ts`
The cornerstone file initializing your Axios client instance.
1.  **Interceptor Magic:** It heavily intercepts *every single outgoing request*, natively looking into `storage.getToken()` and pasting it onto the request under precisely the header: `Authorization: Bearer <TOKEN>`.
2.  **Error Unwrapping:** `getErrorMessage()` extracts exactly what backend `AppError()` spit out so you can blindly pipe it to Ant Design UI success/error toasts!

### End-Point Implementations (`tasks.ts`, `auth.ts`, `organizations.ts`, etc.)
These completely map exactly onto your backend routes:
```typescript
// Example from organizations.ts
async updateMemberRole(
  organizationId: string,
  memberId: string,
  payload: { role: OrganizationRole },
) {
  // Patches against: PUT /api/organizations/:id/members/:memberId
  const { data } = await apiClient.patch(`/organizations/${organizationId}/members/${memberId}`, payload);
  return data.Result;
}
```

---

## 5. Domain Features & Pages (`features/pages/`)

Instead of throwing 20 separate page views inside `src/pages`, everything is neatly encapsulated within `features/pages`. Features export complex DOM logic natively. 

Here are the critical architectural pillars inside your pages:

### Authenticated Spaces (`dashboard-page.tsx`, `projects-page.tsx`)
These files leverage precisely the `useSelectedOrganization()` hook to pull the active Workspace ID that was enforced by your sidebar constraints. They pass this exactly to the Axios services to grab data:
```typescript
// Example of fetching logic pattern
const loadProjects = async () => {
    if (!activeOrganizationId) return;
    const items = await projectService.list(activeOrganizationId);
    setProjects(items);
};
```

### The Safety Locks inside Members & Details (`organizations-page.tsx`, `members-page.tsx`)
This encapsulates exactly the business-logic constraint you built!
*   **Organizations List:** The `[...memberships].sort()` forces your active Dropdown choice strictly to index 0 visually natively. It completely strips away the "Open Tasks" or "Members" buttons purely until you select that Organization in the list.
*   **Members List UI Constraint:** Your strict logic blocks unauthorized bypasses by strictly demanding `if (organizationId !== activeOrganizationId) return <ErrorState ... />`.
*   **Dynamic Modals:** To reuse UI heavily, "Create..." or "Edit..." workflows rely heavily natively on `Modal` overlays tied to local booleans (e.g., `setAddOpen(true)`). 

### Form Handling (Ant Design)
CollabSpace runs exclusively heavily on **Ant Design Form** wrappers.
Every `<Form>` relies upon `Form.useForm()` for internal mutation handling without bleeding state into standard React contexts! Wait until the form triggers the `onFinish={...}` event listener—it outputs completely validated JSON values exactly matching your TypeScript signatures heavily to be shipped to your `services/`.
```typescript
// Add Member magic implementation with strict AntD overrides!
<Form.Item name="memberType" label="User Type">
  <Select value={memberType} onChange={setMemberType} />
</Form.Item>

// Dynamic Logic natively evaluated
<Input.Password disabled={memberType === 'existing'} />
```

---

## 6. Type Definitions (`types/entities.ts` & `types/api.ts`)

Instead of blindly guessing what a JSON payload looks like from the backend, your `types/` folder precisely holds interfaces identically mapped against your PostgreSQL Prisma schemas!
*   `AuthUser`: Detailed blueprint mapping user properties.
*   `OrganizationMembership`: Bridges user IDs heavily with their Active ENUM Role.
*   `ApiResponse<T>`: Strict generic typing enforcing the `.Result` and `.message` JSON object that your backend exclusively sends.

## Summary Checklist for Discussion
When your mentor asks about frontend scalability, enforce these points:
1.  **"We centralized API token management uniquely via Axios Interceptors dynamically instead of doing it identically in every view file."**
2.  **"We enforced Route Security dynamically utilizing `ProtectedRoute` strictly mapping `useAuth()` contexts."**
3.  **"Business context (which organization is selected) acts powerfully as a globally synced Single Source Of Truth via the Sidebar, fully overriding local URL params natively to prevent security context leakages."**
