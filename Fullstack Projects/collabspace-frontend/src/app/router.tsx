import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/app-shell';
import { ProtectedRoute } from '../components/routing/protected-route';
import App from '../App';
import {
  BoardRedirectPage,
  BoardPage,
  DashboardPage,
  LoginPage,
  OrganizationDetailPage,
  MembersPage,
  OrganizationsPage,
  ProjectDetailPage,
  ProjectsPage,
  RegisterPage,
  SettingsPage,
  TagsPage,
  TaskDetailPage,
} from '../features/pages';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppShell />,
            children: [
              { path: 'dashboard', element: <DashboardPage /> },
              { path: 'organizations', element: <OrganizationsPage /> },
              { path: 'organizations/:organizationId', element: <OrganizationDetailPage /> },
              { path: 'organizations/:organizationId/members', element: <MembersPage /> },
              { path: 'projects', element: <ProjectsPage /> },
              { path: 'board', element: <BoardRedirectPage /> },
              { path: 'projects/:projectId', element: <ProjectDetailPage /> },
              { path: 'projects/:projectId/board', element: <BoardPage /> },
              { path: 'tasks/:taskId', element: <TaskDetailPage /> },
              { path: 'tags', element: <TagsPage /> },
              { path: 'settings', element: <SettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
