# StaffHub — Employee Admin Dashboard

A clean, responsive employee admin dashboard built with React (Vite), Tailwind CSS, Redux Toolkit, and React Router.

## Tech Stack
- **React 18** + **Vite**
- **Tailwind CSS 3** (custom config)
- **Redux Toolkit** (state management)
- **React Router v6** (lazy loaded pages)
- **Recharts** (charts)
- **Lucide React** (icons)

## Features
- 📊 Dashboard with KPI cards + charts
- 👥 Employees page with add/edit/delete + 20 fields
- ⚙️ Settings page with toggle switches
- 🌙 Dark mode (persisted in localStorage)
- 📱 Fully responsive: mobile bottom nav, collapsible sidebar, card layouts
- 🔔 Slide-in notification panel
- ⚡ Lazy loaded routes + skeleton loaders

## Setup

```bash
# 1. Navigate to project
cd employee-dashboard

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open http://localhost:5173

## Folder Structure

```
src/
├── store/
│   ├── index.js               # Redux store
│   └── slices/
│       ├── themeSlice.js      # Dark/light mode
│       ├── employeeSlice.js   # Employee CRUD + filters
│       └── uiSlice.js         # Sidebar, modals, notifications
├── components/
│   ├── layout/
│   │   ├── Layout.jsx         # Root layout wrapper
│   │   ├── Sidebar.jsx        # Collapsible sidebar
│   │   ├── Navbar.jsx         # Top navbar
│   │   ├── BottomNav.jsx      # Mobile bottom navigation
│   │   └── NotificationPanel.jsx
│   └── ui/
│       ├── KPICard.jsx
│       ├── Badge.jsx
│       ├── Toggle.jsx
│       ├── Modal.jsx
│       └── SkeletonLoader.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Employees.jsx
│   └── Settings.jsx
├── hooks/
│   └── useMediaQuery.js
├── App.jsx
├── main.jsx
└── index.css
```
