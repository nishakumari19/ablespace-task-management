# Task Management System — Monorepo

Full Stack Assessment task management application built with **Next.js 14 (App Router)**, **NestJS 10**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas**.

**🔗 Live Demo:** [https://ablespace-task-management-web.vercel.app/login](https://ablespace-task-management-web.vercel.app/login)
**📡 Backend API:** [https://ablespace-task-management-kgjz.onrender.com/api](https://ablespace-task-management-kgjz.onrender.com/api)
**📄 Part 2 Submission:** [AbleSpace Take Data — Product Understanding Document](https://docs.google.com/document/d/1GBcT4Io0xeQCDRoKtQmGSdY9DwopjU88/edit?usp=drive_link&ouid=112792633146963158913&rtpof=true&sd=true)

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
    │   │   ├── schemas/         # Mongoose schemas
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

## 🎨 Implemented Features

### Login (`/login`)
- Card layout matching Figma with logo, heading, and subtext
- **Guest Login** → calls `/api/auth/guest-login`, stores JWT, redirects to `/tasks`
- Google Login button with informative "Coming Soon" toast (OAuth not in scope)

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
- Full-width slide-in detail drawer
- Label chips, Resources, Subtasks table with `+ Add Subtasks`
- Comments & Activity feed
- Right panel: Status, Priority, Members, Dates (real calendar picker), Reporter

### Projects (`/projects`)
- Projects table with nested fields submenu (Status, Priority, Members, etc.)
- Click project → scoped task view with breadcrumb

### Settings (`/settings`)
- Profile tab — editable name, email, username
- Theme tab — Light / Dark mode (persists via `localStorage` + pre-hydration FOUC prevention)
- Color Accent tab — 6 swatches (Amber, Blue, Pink, Rose, Emerald, Black) via CSS variables

---

## 🗂️ Part 2 — AbleSpace Product Understanding

**Submission:** [AbleSpace Take Data — Product Understanding Document](https://docs.google.com/document/d/1GBcT4Io0xeQCDRoKtQmGSdY9DwopjU88/edit?usp=drive_link&ouid=112792633146963158913&rtpof=true&sd=true)

The document covers:
- Step-by-step walkthrough of the **Take Data** feature from the Caseload tab, with screenshots
- **13 identified UX/UI improvements** categorized by impact (High / Medium / Low), including:
  - Keyboard shortcuts for faster data entry during live sessions
  - Offline / low-connectivity support with local data queuing
  - Actionable "Services Not Tracked" warning button
  - AI Notes quick-prompt chips for faster note generation
  - Mobile-optimized Capture tab with larger touch targets
