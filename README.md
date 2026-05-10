# Team Task Manager

A full-stack team collaboration and task management platform built using Next.js, Prisma ORM, and NextAuth.js.

The application allows teams to manage projects, assign tasks, monitor progress, and collaborate efficiently with secure role-based access control.

---

# Features

## Authentication & Security
- User Registration and Login
- Secure password hashing using bcrypt
- Session-based authentication with NextAuth.js
- Protected routes and APIs

---

## Role-Based Access Control

### Admin
- Create and manage projects
- Add team members
- Create and assign tasks
- Update project details
- Reassign tasks between members

### Member
- View assigned projects
- View assigned tasks
- Update task status
- Track project progress

---

# Project Management
- Create multiple projects
- Add project descriptions
- Assign project owners
- Track project timelines

---

# Task Management
- Create tasks with:
  - Title
  - Description
  - Due Date
  - Status
- Task statuses:
  - TODO
  - IN_PROGRESS
  - DONE
- Assign tasks to members

---

# Dashboard
- Task overview
- Progress tracking
- Pending and completed tasks
- Overdue task indicators

---

# Tech Stack

## Frontend
- Next.js
- React
- Tailwind CSS
- Lucide React

## Backend
- Next.js App Router APIs
- REST API architecture

## Database
- PostgreSQL
- Prisma ORM

## Authentication
- NextAuth.js

## Deployment
- Railway

---

# Local Development Setup

## 1. Clone Repository

```bash
git clone <your-repository-url>
cd team-task-manager
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the root folder.

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/teamtaskdb"

NEXTAUTH_SECRET="your_secret_key"

NEXTAUTH_URL="http://localhost:3000"
```

---

## 4. Prisma Database Setup

Run the following command:

```bash
npx prisma db push
```

Generate Prisma client:

```bash
npx prisma generate
```

(Optional) Open Prisma Studio:

```bash
npx prisma studio
```

---

## 5. Run Development Server

```bash
npm run dev
```

Application runs at:

```bash
http://localhost:3000
```

---

# Railway Deployment Guide

## Step 1 — Push Code to GitHub

Push your project to a GitHub repository.

---

## Step 2 — Create Railway Project

Open:
https://railway.app/dashboard

Create:
- New Project
- Deploy from GitHub Repo

---

## Step 3 — Add PostgreSQL Service

Inside Railway:
- Click **New**
- Add **PostgreSQL**

Railway automatically creates database credentials.

---

## Step 4 — Configure Variables

Inside your Next.js Railway service → Variables:

Add:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}

NEXTAUTH_SECRET=your_random_secret

NEXTAUTH_URL=https://your-app.up.railway.app
```

Important:
- Use Railway's internal Postgres reference
- Do NOT use public proxy URLs for production

---

## Step 5 — Update package.json Build Script

```json
"build": "prisma generate && prisma db push && next build"
```

---

## Step 6 — Deploy

Railway automatically:
- installs dependencies
- pushes Prisma schema
- builds app
- deploys application

---

# Common Errors & Fixes

## Prisma P1001 Error

### Error
```bash
Can't reach database server
```

### Fix
Use Railway internal database URL:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

instead of:

```env
viaduct.proxy.rlwy.net
```

---

## API Returning 500 Error

Usually caused by:
- Invalid DATABASE_URL
- Prisma client not generated
- Database not connected

Run:

```bash
npx prisma generate
npx prisma db push
```

Then redeploy Railway.

---

# Folder Structure

```bash
app/
 ├── api/
 ├── dashboard/
 ├── login/
 ├── register/

lib/
 ├── prisma.ts

prisma/
 ├── schema.prisma
```

---

# Future Improvements
- Real-time notifications
- File uploads
- Team chat system
- Activity logs
- Email notifications
- Kanban board
- Dark mode
- Analytics dashboard

---

# Demo Video

Add your project demo video link here.

Example:

```md
https://youtu.be/your-demo-link
```

---

# Author

Developed by Thoutu Akshaya.
