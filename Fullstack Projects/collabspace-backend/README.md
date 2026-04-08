# CollabSpace Backend

Backend for the CollabSpace task using Express, TypeScript, Prisma 7, and PostgreSQL.

## What This Backend Includes

- Modular folder structure by feature
- Controller, service, and repository layers inside each module
- Express with TypeScript and `type: module`
- Prisma 7 with PostgreSQL
- JWT authentication
- Zod validation
- Route-level middlewares
- Universal error handling
- Standard API response format
- Multi-organization data isolation
- Organization role checks
- Project board API with tasks grouped by status
- Task status workflow validation
- Activity log for status/comment actions
- Assignment history tracking
- Soft-delete behavior for projects by archiving tasks
- Postman collection in [`docs/collabspace.postman_collection.json`](./docs/collabspace.postman_collection.json)

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM 7
- PostgreSQL
- Zod
- JWT

## Final Folder Structure

```text
src
  app.ts
  server.ts
  config
    env.ts
    prisma.ts
  constants
    app.constant.ts
  middlewares
    access.middleware.ts
    auth.middleware.ts
    error.middleware.ts
    validate.middleware.ts
  modules
    activities
      activity.controller.ts
      activity.repository.ts
      activity.routes.ts
      activity.schema.ts
      activity.service.ts
    auth
      auth.controller.ts
      auth.repository.ts
      auth.routes.ts
      auth.schema.ts
      auth.service.ts
    comments
      comment.controller.ts
      comment.repository.ts
      comment.routes.ts
      comment.schema.ts
      comment.service.ts
    organizations
      organization.controller.ts
      organization.repository.ts
      organization.routes.ts
      organization.schema.ts
      organization.service.ts
    projects
      project.controller.ts
      project.repository.ts
      project.routes.ts
      project.schema.ts
      project.service.ts
    tags
      tag.controller.ts
      tag.repository.ts
      tag.routes.ts
      tag.schema.ts
      tag.service.ts
    tasks
      task.controller.ts
      task.repository.ts
      task.routes.ts
      task.schema.ts
      task.service.ts
  routes
    index.ts
  types
    express.d.ts
  utils
    async-handler.util.ts
    bcrypt.util.ts
    jwt.util.ts
    membership.util.ts
    response.util.ts
    status-workflow.util.ts
prisma
  schema.prisma
docs
  collabspace.postman_collection.json
```

## API Response Format

All JSON responses follow this shape:

```json
{
  "ResponseStatus": 1,
  "Message": "Success message",
  "Result": {}
}
```

Response enum values used in the project:

- `Success = 1`
- `Error = 0`
- `NoContent = 204`
- `Unauthorized = 401`
- `Forbidden = 403`
- `NotFound = 404`
- `ValidationError = 422`

## PostgreSQL Version Guidance

Use PostgreSQL 16 for this project.

Why:

- Prisma 7 works well with PostgreSQL 16
- You already have PostgreSQL 16 installed
- There is no backend requirement here that needs PostgreSQL 18 specifically

Important:

- Do **not** use your existing `task_manager_db`
- Create a **new database** for this backend
- Recommended database name: `collabspace_db`

If you prefer PostgreSQL 18, this backend should still work, but PostgreSQL 16 is the simpler choice for now.

## Step-by-Step Setup

### 1. Open the project

```powershell
cd "C:\Users\Admin\Desktop\Training\Fullstack Projects\collabspace-backend"
```

### 2. Install dependencies

If `node_modules` is already present, you can skip this.

```powershell
npm install
```

### 3. Create a new PostgreSQL database

Do not use `task_manager_db`.

Use a new database like this:

```sql
CREATE DATABASE collabspace_db;
```

If you are using `psql`, a common command is:

```powershell
psql -U postgres
```

Then run:

```sql
CREATE DATABASE collabspace_db;
```

### 4. Update `.env`

Current `.env` is already changed to a clean local example:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/collabspace_db?schema=public
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=7d
```

Change:

- `postgres:postgres` to your real PostgreSQL username/password
- `JWT_SECRET` to your own secure secret

### 5. Generate Prisma client

```powershell
npx prisma generate
```

### 6. Apply database schema

Use migrations if you want migration history:

```powershell
npm run db:migrate
```

Or push schema directly for quick development:

```powershell
npm run db:push
```

### 7. Start the backend

```powershell
npm run dev
```

Server runs at:

```text
http://localhost:5000
```

Health route:

```text
GET /health
```

## Available Scripts

- `npm run dev` starts the server with `tsx watch`
- `npm run start` runs the server directly from TypeScript
- `npm run check` runs TypeScript type checking
- `npm run db:generate` generates Prisma client
- `npm run db:migrate` runs Prisma migrations
- `npm run db:push` pushes schema without creating migration files
- `npm run db:studio` opens Prisma Studio

## Main API Modules

- `auth`
- `organizations`
- `projects`
- `tasks`
- `comments`
- `tags`
- `activities`

## Main Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Organizations

- `GET /api/organizations`
- `POST /api/organizations`
- `GET /api/organizations/:organizationId`
- `PATCH /api/organizations/:organizationId`
- `GET /api/organizations/:organizationId/members`
- `POST /api/organizations/:organizationId/members`
- `PATCH /api/organizations/:organizationId/members/:memberId`
- `DELETE /api/organizations/:organizationId/members/:memberId`

### Projects

- `GET /api/organizations/:organizationId/projects`
- `POST /api/organizations/:organizationId/projects`
- `GET /api/projects/:projectId`
- `PATCH /api/projects/:projectId`
- `DELETE /api/projects/:projectId`

### Tasks

- `GET /api/projects/:projectId/tasks`
- `GET /api/projects/:projectId/board`
- `POST /api/projects/:projectId/tasks`
- `GET /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

### Comments

- `GET /api/tasks/:taskId/comments`
- `POST /api/tasks/:taskId/comments`

### Tags

- `GET /api/organizations/:organizationId/tags`
- `POST /api/organizations/:organizationId/tags`
- `PATCH /api/tags/:tagId`
- `DELETE /api/tags/:tagId`

### Activities

- `GET /api/tasks/:taskId/activities`
- `GET /api/tasks/:taskId/assignment-history`

## Important Design Decisions

### Layered module structure

- `controller` handles request and response only
- `service` contains business logic and rules
- `repository` contains Prisma database queries
- `routes` attach validation and middleware
- `schema` contains Zod validation

### 1. How organizations are separated

- Every organization-owned record is tied to an organization
- Membership is stored in `OrganizationMember`
- Access middleware checks whether the logged-in user belongs to the organization before controller logic runs
- This prevents users from seeing data from organizations they do not belong to

### 2. How roles and permissions are enforced

- Roles are stored on `OrganizationMember`
- Supported roles:
  - `ADMIN`
  - `MANAGER`
  - `MEMBER`
- Role checks are enforced in route middlewares, not inside controllers
- Example:
  - only `ADMIN` or `MANAGER` can create projects
  - only `ADMIN` can change organization member roles

### 3. How task status validation works

- Statuses are:
  - `TODO`
  - `IN_PROGRESS`
  - `IN_REVIEW`
  - `DONE`
- The backend blocks direct movement from `TODO` to `DONE`
- This ensures a task must pass through at least one intermediate stage before final completion

### 4. How activity logs are recorded

- When task status changes, an `ActivityLog` row is created
- When a comment is added, an `ActivityLog` row is created
- Each record stores:
  - user
  - task
  - project
  - previous status
  - new status
  - timestamp

### 5. How assignment history is recorded

- When a task is assigned or reassigned, an `AssignmentHistory` row is created
- Each record stores:
  - task
  - previous assigned user
  - new assigned user
  - changed by
  - changed at

### 6. Project deletion behavior

- Projects are not hard-deleted from the app flow
- When a project is deleted:
  - the project gets `deletedAt`
  - related tasks get `archivedAt`
- Archived tasks stay in the database for reporting/history
- Archived tasks are hidden from normal board and list APIs

## Notes About Optional Fields

You asked to keep fields optional so future changes do not break the app.

Professional handling used here:

- Request payloads are flexible where possible
- Some descriptive fields default to values like `Untitled Project` or `Untitled Task`
- Core relational fields are still required in the database

This is important because making every database field optional would break:

- data integrity
- organization isolation
- access control
- task/project ownership rules

## Frontend Note

You asked for backend only right now. So this repo currently focuses only on backend APIs.

When you want the frontend prompt later, I can generate a clean prompt for Stitch AI that matches this backend and uses Ant Design.

## Current Verification

- `npm run check` passes
- Prisma client generation completed
- Prisma schema validation may still require network access depending on Prisma engine availability on your machine
