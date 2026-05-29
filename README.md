# ⚡ BIPOLAR FACTORY

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **Wild imagination. Brutal execution.**  
> Custom software + ready-made tools. Based in Coimbatore, India.

A complete, production-ready company website operating as a lightweight Single Page Application (SPA). It uses a zero-build vanilla HTML/JS frontend paired with a fast Node.js/Express backend, locally powered by SQLite.

---

## 🛠 What's Different? (The Upgrade)

The original site was a generic template. We rebuilt it from scratch to act like a true engineering studio.

| Problem with Old Site | Our Solution |
|---|---|
| **Generic Wix Template** | Custom dark design system with an antigravity aesthetic. |
| **Vague corporate copy** | Plain-English, zero-jargon messaging. |
| **No visual hierarchy** | Clear flow: Hero → Products → Services → Proof → Contact. |
| **Credibility buried** | Case studies elevated as hero-level proof with live stats. |
| **Multi-page drop-offs** | Single-page continuous scroll with a floating navigation dock. |
| **Felt static & boring** | Animated elements, custom cursor, and dynamic telemetry status bar. |
| **Weak "Contact Us" CTA** | Replaced with a commanding `[ ESTABLISH CONNECTION ]` protocol. |

---

## ✨ Key Features

- 🎯 **Antigravity Cursor:** Custom geometric tracking dot (not a boring circle).
- 📡 **Telemetry Status Bar:** Live typewriter logs responding to user hovers and clicks.
- 🎨 **Dual-Accent Design System:** Pink (`#FF0066`) for Products, Green (`#00FF66`) for Custom Services.
- 🚀 **Zero-Build Frontend:** No Webpack, no Vite. Just plain HTML, CSS (Tailwind CDN), and JS.
- 🗄️ **SQLite Local Database:** Zero setup required for local development.
- 🛡️ **Hardened Backend:** Includes Helmet headers, rate-limiting, and express-validator.

---

## 🏗 Tech Stack

- **Frontend:** HTML5, Vanilla JS, Tailwind CSS (via CDN)
- **Backend API:** Node.js, Express.js
- **Database (Local):** SQLite (via Prisma ORM)
- **Design Typography:** Bebas Neue, DM Sans, JetBrains Mono

---

## 💻 Local Setup (Zero Configuration)

We use **SQLite** locally, meaning there's no need to install bulky database servers.

**1. Clone and install backend dependencies**
```bash
cd backend
npm install
```

**2. Set up your environment**
```bash
cp .env.example .env
```
*(No need to edit the database URL; it defaults to a local `dev.db` file).*

**3. Build and Seed the Database**
```bash
npm run db:push
npm run db:seed
```

**4. Start the Backend API**
```bash
npm run dev
```
*API is now live at: `http://localhost:4000`*

**5. Start the Frontend**
Open a new terminal window:
```bash
cd frontend
npx serve public -p 3000
```

---

## 📁 Folder Structure

```
bipolar-factory/
├── backend/               ← Node.js + Express API server
│   ├── prisma/            ← SQLite DB, schema, and seed file
│   ├── routes/            ← API route handlers
│   ├── server.js          ← Main entry point
│   ├── package.json       
│   └── .env.example       
├── frontend/              
│   └── public/            
│       ├── index.html     ← Complete SPA (Zero build step)
│       └── config.js      ← API base URL configuration
├── README.md
└── .gitignore
```

---

## 🚀 Deployment

Both the frontend and backend are designed to be easily deployed on **Render**.

### 1. Backend (Render Web Service)
- Deploy as a **Web Service** on [Render](https://bipolar-factory-backend.onrender.com).
- **Root Directory:** `backend`
- **Build Command:** `npm install && npx prisma generate && npx prisma db push`
- **Start Command:** `node server.js`
- **Environment Variables:** Add `DATABASE_URL=file:./dev.db`, `NODE_ENV=production`, and `ALLOWED_ORIGINS` (your frontend URL, added after step 3).

### 2. Frontend (Render Static Site)
- Deploy as a **Static Site** on [Render](https://bipolar-factory-33lt.onrender.com).
- **Root Directory:** `frontend/public`
- Before deploying, update `frontend/public/config.js` to point to your new Render API URL.
- Once deployed, update your backend's `ALLOWED_ORIGINS` to include your new static site URL.

---

## ⚙️ Environment Variables

Add these to your `backend/.env` file:

| Variable | Description | Default (Local) |
|---|---|---|
| `DATABASE_URL` | Connection string for the database | `file:./dev.db` |
| `PORT` | API server port | `4000` |
| `NODE_ENV` | Environment context | `development` |

---
*Built by Bipolar Factory — Coimbatore, India.*
