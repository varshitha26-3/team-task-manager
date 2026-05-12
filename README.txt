Team Task Manager - Full Stack Web Application
================================================

OVERVIEW
--------
A full-stack web application where users can create projects, assign tasks, 
and track progress with role-based access (Admin/Member).

TECH STACK
----------
Frontend: React (Vite), React Router, Axios
Backend:  Node.js, Express.js
Database: MongoDB (Mongoose)
Auth:     JWT (JSON Web Tokens)
Deploy:   Railway

KEY FEATURES
------------
1. Authentication (Signup / Login with JWT)
2. Role-Based Access Control:
   - Admin: Create/delete projects, create/delete tasks, add members
   - Member: View projects, update task status
3. Project Management: Create projects, add team members
4. Task Management: Create tasks, assign to users, set priority & due date
5. Kanban Board: Todo / In Progress / Done columns per project
6. Dashboard: Stats overview, my tasks, my projects, overdue alerts

PROJECT STRUCTURE
-----------------
team-task-manager/
├── backend/
│   ├── models/         (User, Project, Task schemas)
│   ├── routes/         (auth, projects, tasks, users)
│   ├── middleware/      (JWT auth, role check)
│   └── server.js
└── frontend/
    └── src/
        ├── pages/      (Login, Register, Dashboard, Projects, ProjectDetail)
        ├── components/ (Navbar)
        ├── context/    (AuthContext)
        └── api.js      (Axios instance)

HOW TO RUN LOCALLY
------------------
Backend:
  cd backend
  npm install
  cp .env.example .env   (fill in MONGO_URI and JWT_SECRET)
  npm run dev

Frontend:
  cd frontend
  npm install
  npm run dev

DEPLOYMENT
----------
Deployed on Railway with:
- Backend as a Node.js service
- Frontend as a static site (built with `npm run build`)
- MongoDB Atlas as the database

API ENDPOINTS
-------------
POST   /api/auth/register     - Register user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user

GET    /api/projects          - Get all projects for user
POST   /api/projects          - Create project (Admin)
GET    /api/projects/:id      - Get project by ID
PUT    /api/projects/:id      - Update project
POST   /api/projects/:id/members - Add member to project
DELETE /api/projects/:id      - Delete project (Admin)

GET    /api/tasks             - Get tasks (filter by project)
GET    /api/tasks/my          - Get my assigned tasks
POST   /api/tasks             - Create task
PUT    /api/tasks/:id         - Update task
DELETE /api/tasks/:id         - Delete task (Admin)

GET    /api/users             - Get all users
