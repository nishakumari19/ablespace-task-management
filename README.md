# Task Management System — Monorepo

Full Stack Assessment task management application built with **Next.js 14 (App Router)**, **NestJS 10**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas**.

**🔗 Live Demo:** [https://your-app.vercel.app](https://your-app.vercel.app) *(update after deploy)*
**📡 Backend API:** [https://your-api.onrender.com/api](https://your-api.onrender.com/api) *(update after deploy)*
**📄 Part 2 Submission:** [`AbleSpace_Part2_Product_Understanding.docx`](./AbleSpace_Part2_Product_Understanding.docx)

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | NestJS 10, Mongoose, Passport JWT, class-validator |
| **Database** | MongoDB Atlas (cloud) |
| **Auth** | Guest Login → JWT (stateless) |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Repository Structure

```
.
├── package.json                 # Monorepo root (npm workspaces)
├── .gitignore
├── README.md
└── apps/
    ├── api/                     # NestJS Backend
    │   ├── src/
    │   │   ├── schemas/         # Mongoose schemas (User, Task, Project, Label, Comment, ActivityLog)
    │   │   ├── auth/            # Guest login + JWT strategy
    │   │   ├── users/           # User profile CRUD
    │   │   ├── projects/        # Projects CRUD
    │   │   ├── tasks/           # Tasks, subtasks, comments, activity log
    │   │   ├── seed.ts          # Database seed script
    │   │   ├── app.module.ts    # Root NestJS module
    │   │   └── main.ts          # Bootstrap with CORS + validation
    │   ├── .env.example         # ✅ Safe to commit (placeholders only)
    │   └── render.yaml          # Render deployment config
    └── web/                     # Next.js Frontend
        ├── src/
        │   ├── app/             # App Router pages (/login, /tasks, /projects, /settings)
        │   ├── components/      # Reusable UI components
        │   └── lib/             # API client, AuthContext, ThemeContext
        ├── .env.example         # ✅ Safe to commit (placeholders only)
        └── vercel.json          # Vercel deployment config
```

---

## 🛠️ Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
npm install
```

### 2. Configure Environment Variables

**Backend** — copy and fill in your values:
```bash
cp apps/api/.env.example apps/api/.env
```
Edit `apps/api/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>
JWT_SECRET=your-random-secret-here
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**Frontend** — copy and fill in:
```bash
cp apps/web/.env.example apps/web/.env.local
```
Edit `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Seed the Database
```bash
npm run seed
```

### 4. Run Both Servers
```bash
npm run dev
```
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

---

## ☁️ Deployment Guide

### Step 1 — Deploy Backend to Render

1. Push this repo to GitHub (make sure `.env` is **not** committed — it's in `.gitignore`).
2. Go to [https://render.com](https://render.com) → **New → Web Service**.
3. Connect your GitHub repo.
4. Configure:
   | Setting | Value |
   |---|---|
   | **Root Directory** | `apps/api` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `node dist/main` |
   | **Node Version** | 20 |
5. Add **Environment Variables** in the Render dashboard:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long random secret (e.g. from `openssl rand -hex 32`) |
   | `CORS_ORIGIN` | Leave blank for now — add Vercel URL after Step 2 |
   | `NODE_ENV` | `production` |
6. Click **Deploy**. Once live, copy the Render URL (e.g. `https://task-mgmt-api.onrender.com`).

> ⚠️ **MongoDB Atlas Network Access** — In Atlas → Network Access, add `0.0.0.0/0` (Allow from anywhere) so Render's dynamic IPs can connect.

---

### Step 2 — Deploy Frontend to Vercel

1. Go to [https://vercel.com](https://vercel.com) → **New Project**.
2. Import your GitHub repo.
3. Configure:
   | Setting | Value |
   |---|---|
   | **Framework Preset** | Next.js |
   | **Root Directory** | `apps/web` |
   | **Build Command** | `next build` *(auto-detected)* |
4. Add **Environment Variables** in the Vercel dashboard:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://task-mgmt-api.onrender.com/api` (your Render URL + `/api`) |
5. Click **Deploy**. Copy the Vercel URL (e.g. `https://task-mgmt.vercel.app`).

---

### Step 3 — Update CORS on Render

1. Go back to Render → your Web Service → **Environment**.
2. Set `CORS_ORIGIN` to your Vercel URL **exactly** (no trailing slash):
   ```
   CORS_ORIGIN=https://task-mgmt.vercel.app
   ```
3. Render auto-redeploys. Your app is now fully live.

---

### Step 4 — Update README Links

Update the live links at the top of this file:
```markdown
**🔗 Live Demo:** https://task-mgmt.vercel.app
**📡 Backend API:** https://task-mgmt-api.onrender.com/api
```

---

## 🔑 Environment Variables Reference

### Backend (`apps/api/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens |
| `PORT` | ❌ | Server port (Render sets this automatically) |
| `CORS_ORIGIN` | ✅ | Comma-separated list of allowed frontend URLs |

### Frontend (`apps/web/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Full URL of the backend API including `/api` suffix |

---

## 🎨 Implemented Features

### Login (`/login`)
- Card layout matching Figma with logo, heading, and subtext
- **Guest Login** → calls `/api/auth/guest-login`, stores JWT, redirects to `/tasks`
- Google Login button with informative toast (OAuth not in scope)

### App Shell
- Collapsible sidebar with Tasks / Projects navigation
- User avatar dropdown with Settings, Theme Switcher, Logout
- Responsive mobile drawer

### Tasks Page (`/tasks`)
- **Board view** — Kanban columns (To Do, Doing, Completed, On Hold)
- **List view** — collapsible status-grouped accordions
- Live search, Fields visibility toggle (persisted in `localStorage`)
- Inline priority editing from card/row menus

### Task Detail (`/tasks → click task`)
- Full-width slide-in detail view
- Label chips, Resources, Subtasks table with `+ Add Subtasks`
- Comments & Activity feed
- Right panel: Status, Priority, Members, Dates (real calendar picker), Reporter

### Projects (`/projects`)
- Projects table with nested fields submenu (Status, Priority, Members, etc.)
- Click project → scoped task view with breadcrumb

### Settings (`/settings`)
- Profile tab — editable name, email, username
- Theme tab — Light / Dark mode (persists via `localStorage` + pre-hydration script)
- Color Accent tab — 6 swatches (Amber, Blue, Pink, Rose, Emerald, Black) via CSS variables

---

## 📌 Intentional Deviations from Figma

| Deviation | Reason |
|---|---|
| **Inter font** added | Figma uses Inter; applied via Google Fonts for accurate typography |
| **Google OAuth** shows toast | Full OAuth requires a registered app with Google — not in scope for this assessment |
| **Teams field** as label/tag | Avoids building a full multi-tenant team management system out of scope |
| **Resource attachments** | UI affordance present; actual file upload requires S3/cloud storage not in scope |
| **Labels always show text** | Fixed a Tailwind flex layout bug where the Tag icon was collapsing adjacent text spans |

---

## 🗂️ Part 2 — AbleSpace Product Understanding

See [`AbleSpace_Part2_Product_Understanding.docx`](./AbleSpace_Part2_Product_Understanding.docx) for:
- Step-by-step walkthrough of the Take Data feature with screenshots
- 13 identified UX/UI improvements categorized by impact and effort


---

## 🚀 Tech Stack Overview

- **Frontend (`apps/web`)**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Axios.
- **Backend (`apps/api`)**: NestJS 10, Mongoose (`@nestjs/mongoose`), Passport JWT Auth, `class-validator`.
- **Database**: MongoDB Atlas cloud cluster connected via `MONGODB_URI` environment variable.
- **Monorepo Layout**:
  - `apps/web`: Next.js web application on port `3000`.
  - `apps/api`: NestJS backend API on port `3001`.

---

## 📁 Repository Structure

```text
.
├── package.json                 # Monorepo root package.json with npm workspaces
├── README.md                    # Project documentation & setup instructions
├── apps/
│   ├── api/                     # NestJS Backend API
│   │   ├── src/
│   │   │   ├── schemas/         # Mongoose Schemas (User, Workspace, Project, Task, Label, Comment, ActivityLog)
│   │   │   ├── auth/            # Guest authentication & JWT strategy
│   │   │   ├── users/           # User profile & settings API
│   │   │   ├── projects/        # Projects CRUD API
│   │   │   ├── tasks/           # Tasks, subtasks, comments, & activity log API
│   │   │   ├── seed.ts          # Mongoose database seeding script
│   │   │   ├── app.module.ts    # Root NestJS module
│   │   │   └── main.ts          # NestJS entrypoint with CORS enabled
│   │   ├── .env                 # API environment variables (MONGODB_URI, JWT_SECRET, PORT)
│   │   └── .env.example         # Template for environment variables
│   └── web/                     # Next.js Frontend Application
│       ├── src/
│       │   ├── app/             # Next.js App Router pages (/login, /tasks, /projects, /settings)
│       │   ├── components/      # UI components (Kanban Board, Grouped List, Task Detail Drawer, Modals, DatePicker)
│       │   ├── lib/             # API client, ThemeContext (Dark/Light + 6 Accent colors), AuthContext
│       │   └── globals.css      # CSS variables for themes & accent colors
│       ├── tailwind.config.js   # Tailwind CSS configuration
│       └── tsconfig.json        # TypeScript configuration
```

---

## 🛠️ Setup & Running Locally

### 1. Install Dependencies
Run from the workspace root:
```bash
npm install
```

### 2. Seed the MongoDB Database
To populate MongoDB Atlas with initial data (Dexter user profile, workspace, sample projects, and tasks matching the Figma design):
```bash
npm run seed
```

### 3. Run Development Servers
Start both Next.js frontend and NestJS backend concurrently:
```bash
npm run dev
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)

---

## 🎨 Implemented Features & Screens

1. **Login (`/login`)**:
   - Card layout matching Figma design with logo, heading, and subtext.
   - **Guest Login**: Clicking "Continue as Guest" calls `/api/auth/guest-login` to issue a JWT token and redirect to `/tasks`.
   - **Google Login**: UI-only button displaying an inline coming-soon toast notification.

2. **App Shell & Collapsible Sidebar**:
   - Navigation links for **Tasks** and **Projects** with active highlighting.
   - User account menu dropdown for Dexter showing settings, theme switcher, and logout.
   - Collapse button top-left of the content area toggling the sidebar, responsive to mobile drawer view.

3. **Tasks Page (`/tasks`)**:
   - **View Switcher**: Toggle between **Board** (Kanban columns: To Do, Doing, Completed, On Hold) and **List** (collapsible status-grouped accordions).
   - **Live Search**: Filters task titles live as you type.
   - **Fields Visibility Dropdown**: Checkboxes to toggle Priority, Members, Due Date, Labels, Status, Reporter columns (persisted in `localStorage`).
   - **Inline Priority Editing**: Change task priority directly from card or row menus.

4. **Task Detail Drawer (`/tasks/[id]`)**:
   - Slide-over panel featuring title, removable label chips, resources affordance.
   - **Subtasks Table**: Displays subtasks with priority, assignees, and due dates, plus an "+ Add Subtasks" input.
   - **Comments & Activity Feed**: Interactive comment input and real-time activity log feed ("Updates" panel).
   - **Right Details Panel**: Status, Priority, Assignees, Reporter, and a real **Calendar Date-Picker Popover**.

5. **Projects Page (`/projects` & `/projects/[id]`)**:
   - Projects table showing Priority, Lead avatar, Due Date, and Actions.
   - **Nested Fields Submenu**: Nested popovers for Status ▸, Priority ▸, Members ▸, Due Date ▸, Teams ▸, Labels ▸, Reporter ▸.
   - Click a project to view its scoped tasks with breadcrumb navigation (`Projects / Design Homepage`).

6. **Profile & Settings (`/settings`)**:
   - **Profile Tab**: Editable full name, email, username, title, and a "Leave Workspace" danger action card.
   - **Theme Tab**: Light Mode / Dark Mode toggle cards.
   - **Color Accent Tab**: 6 Color swatches (**Amber, Blue, Pink, Rose, Emerald, Black**) driving CSS variables with pre-hydration FOUC prevention.

---

## 📌 Deviations from Figma

- **Google OAuth**: "Login with Google" is present in the UI matching Figma aesthetics, but shows an informative "Coming Soon" toast instead of completing full OAuth consent flows, as specified in the prompt.
- **Teams Field**: The Teams field is rendered in column pickers and property panels as a flexible label/group tag rather than requiring separate multi-tenant team management tables.
- **Resource File Attachments**: The "Add document or link…" button provides the interactive UI affordance for resource attachments.
