# ProjectPulse

**Agile Project & Team Collaboration Suite** — a full-stack MERN application for software and business teams to manage portfolios, projects, milestones, sprints, tasks, issues, comments, and team workload.

Built as a capstone project demonstrating REST APIs, MongoDB data modeling, React routing/state management, server-side validation, secure role-based authorization, and a responsive UI.

## Tech stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, `@hello-pangea/dnd` (drag-and-drop), Axios, lucide-react
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT authentication, bcrypt
- **Database:** MongoDB Atlas

## Features

- Authentication, organization membership, project-scoped role-based access control (RBAC), and an invitation workflow
- Organizations ? Projects ? Sprints / Milestones ? Tasks, with full CRUD throughout
- Kanban board with drag-and-drop status changes and optimistic UI updates
- Sprint planning, backlog management, story points, priorities, and task dependencies
- Project timeline with milestones and due-date tracking
- Workload dashboard showing task completion by team member
- Issue/bug tracking with severity, reproduction steps, and status history (audit trail)
- Comments with @mentions and notifications
- Project-wide activity feed
- Search, filtering, sorting, and pagination on the task list

## Roles

| Role | Responsibilities |
|---|---|
| Organization Admin | Manage organization users, teams, projects, roles, and configuration |
| Project Manager | Plan projects, manage milestones, sprints, assignments, and reports |
| Team Lead | Manage team workload, review tasks, resolve blockers |
| Developer / Member | Work on assigned tasks, update progress, comment, attach files |
| Stakeholder | View authorized project progress, milestones, and reports (read-only) |

## Project structure

```
projectpulse/
+-- backend/          Express API, Mongoose models, RBAC middleware
+-- frontend/         React app (Vite + Tailwind)
```

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev
```

Runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies API calls to the backend.

### Environment variables

See `backend/.env.example` for the required variables (`MONGO_URI`, `JWT_SECRET`, etc). A free-tier [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster is sufficient.

## License

This project is for educational/capstone purposes.
