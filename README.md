# Team Task Manager

A full-stack web application built with Next.js, Prisma, and NextAuth.js. It allows users to create projects, assign tasks, and track progress with role-based access control (Admin/Member).

## Features
- **Authentication**: Signup and Login functionality with credential validation (Bcrypt).
- **Role-Based Access Control**:
  - **Admins**: Can create projects, add tasks, reassign tasks, and manage project details.
  - **Members**: Can view assigned projects, and update the status of their assigned tasks.
- **Project Management**: Create, view, and manage projects.
- **Task Management**: Create tasks, assign them to team members, set due dates, and update statuses (TODO, IN_PROGRESS, DONE).
- **Dashboard**: Overview of tasks, progress tracking, and overdue task indicators.
- **REST APIs**: Full RESTful structure via Next.js App Router API handlers.

## Tech Stack
- **Frontend**: Next.js 15 (React), Tailwind CSS, Lucide React
- **Backend**: Next.js App Router API routes
- **Database**: SQLite (local) / PostgreSQL (production), Prisma ORM
- **Authentication**: NextAuth.js v4

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Ensure your `.env` file looks like this:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Initialize the database:**
   ```bash
   npx prisma db push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Railway

This app is ready to be deployed to [Railway](https://railway.app/).

1. Push your code to a GitHub repository.
2. In Railway, create a new project and select "Deploy from GitHub repo".
3. Add a PostgreSQL database service in Railway.
4. **Important Schema Change**: In `prisma/schema.prisma`, change the provider from `"sqlite"` to `"postgresql"`.
5. Connect your repository to Railway.
6. Under your Next.js service variables, add:
   - `DATABASE_URL` (Reference it from the PostgreSQL service)
   - `NEXTAUTH_SECRET` (A secure random string)
   - `NEXTAUTH_URL` (Your Railway app domain, e.g., `https://your-app.up.railway.app`)
7. Add a deploy command to automatically migrate your database schema on deploy by modifying the `build` script in `package.json`:
   ```json
   "build": "npx prisma generate && npx prisma db push && next build"
   ```
8. Deploy! The app will automatically build and start.

## Demo Video
*(Please record your 2-5 min demo video showcasing signup, admin project creation, task assignment, and member task status updating, then link it here)*
