# AetherTodo

A sleek, minimal dark theme productivity application built with Next.js to demonstrate core syllabus concepts.

* **Live Deployed Application**: [todo-seven-phi-78.vercel.app](https://todo-seven-phi-78.vercel.app/)

## Tech Stack
* **Framework**: Next.js 16 (App Router)
* **Runtime / Compiler**: React 19, Turbopack
* **Styling**: Tailwind CSS v4 (CSS-first configuration)
* **Database & ORM**: PostgreSQL, Prisma ORM
* **Language**: TypeScript

## Key Features
* **Create Tasks**: Submitted using Next.js Server Actions with immediate page revalidation.
* **Edit Tasks**: Update title and description using a dedicated dynamic page and API route.
* **Toggle & Custom Delete**: Asynchronous client-side state toggles and custom-built modal deletion confirmations (replacing native browser `confirm()` prompts).
* **Inline Form Error Alerts**: Integrated dismissible warnings within forms to gracefully display server/validation messages (replacing browser native `alert()` popups).
* **Productivity Guides**: Pre-rendered static documentation pages with incremental background regeneration.
* **Premium Design System**: Obsidian dark palette with glassmorphism, responsive grid dashboard, and custom animations.

## Next.js Rendering Strategies Covered
* **Server-Side Rendering (SSR)**: The Home dashboard (`/`) fetches dynamic todo items at request time directly via Prisma.
* **Static Site Generation (SSG)**: The dynamic productivity methodology guides (`/guides/[method]`) are pre-rendered at build time using `generateStaticParams()`.
* **Incremental Static Regeneration (ISR)**: The guides routes export `revalidate = 60` to rebuild static guides in the background every 60 seconds.

## Syllabus Concepts Demonstrated

### 1. File-Based Routing & Layouts
* **Root Layout** ([app/layout.tsx](file:///d:/Abdul%20Samad/For%20Cohort/nextjs-tutorial/app/layout.tsx)): Global CSS structure, font bindings, custom scrollbar styling, and sticky navigation headers/footers.
* **Dashboard Page** ([app/page.tsx](file:///d:/Abdul%20Samad/For%20Cohort/nextjs-tutorial/app/page.tsx)): The entry-point view, dynamically loading lists from the DB.
* **Edit Page** ([app/edit/[id]/page.tsx](file:///d:/Abdul%20Samad/For%20Cohort/nextjs-tutorial/app/edit/[id]/page.tsx)): Uses dynamic slug parameters to retrieve details and update todo titles and descriptions.
* **Guides Page** ([app/guides/[method]/page.tsx](file:///d:/Abdul%20Samad/For%20Cohort/nextjs-tutorial/app/guides/%5Bmethod%5D/page.tsx)): Pre-renders static guides using dynamic path segments.

### 2. API Routes vs Server Actions
* **Server Action** (`createTodoAction` in [app/actions/todoActions.ts](file:///d:/Abdul%20Samad/For%20Cohort/nextjs-tutorial/app/actions/todoActions.ts)):
  * **Use Case**: Best suited for form submissions and mutations that change layout cache.
  * **Behavior**: Reads the `FormData`, runs server validations, inserts record via Prisma, and uses `revalidatePath('/')` to refresh the dashboard cache, pushing down new server data.
* **API Routes** ([app/api/todos](file:///d:/Abdul%20Samad/For%20Cohort/nextjs-tutorial/app/api/todos)):
  * **Use Case**: Used for asynchronous, high-frequency actions where reloading the page/layout is not desired.
  * **End-Points**:
    * `GET /api/todos`: Fetches task items.
    * `PATCH /api/todos/[id]`: Asynchronously toggles completion status.
    * `PUT /api/todos/[id]/edit`: Modifies title and description.
    * `DELETE /api/todos/[id]`: Deletes a task.

### 3. Rendering Strategies
* **Server-Side Rendering (SSR)**: The `/` route performs direct database queries (`prisma.todo.findMany`) on each HTTP request, pre-rendering task items dynamically.
* **Static Site Generation (SSG)**: `/guides/[method]` uses `generateStaticParams()` to pre-compile static HTML assets at build time for GTD (`/guides/gtd`), Pomodoro (`/guides/pomodoro`), and Kanban (`/guides/kanban`).
* **Incremental Static Regeneration (ISR)**: `/guides/[method]` registers `revalidate = 60` to rebuild static guides in the background every 60 seconds.

### 4. Database Integration
* Database clients separated in [lib/db.ts](file:///d:/Abdul%20Samad/For%20Cohort/nextjs-tutorial/lib/db.ts).
* Connected to PostgreSQL using Prisma ORM.

---

## Assumptions & Limitations
* **Authentication**: There is no multi-user authorization layer; tasks are shared in a single database environment.
* **Database**: Assumes a working PostgreSQL database instance is active during runtime.
* **Environment**: Local development requires internet access if connecting to a remote cloud database (e.g. Neon).

---

## How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory using `.env.example` as a template:
```env
DATABASE_URL="your-postgresql-connection-string"
```

### 3. Push Database Schema
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
