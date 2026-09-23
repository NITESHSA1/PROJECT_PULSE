projectpulse/
¦
+-- backend/
¦   +-- models/                      # Mongoose schemas (DONE)
¦   ¦   +-- User.js
¦   ¦   +-- Organization.js
¦   ¦   +-- Membership.js            # org-level RBAC
¦   ¦   +-- Invitation.js
¦   ¦   +-- Project.js
¦   ¦   +-- ProjectMember.js         # project-level RBAC
¦   ¦   +-- Sprint.js
¦   ¦   +-- Milestone.js
¦   ¦   +-- Label.js
¦   ¦   +-- Task.js                  # covers tasks + bugs/issues
¦   ¦   +-- StatusHistory.js
¦   ¦   +-- Comment.js
¦   ¦   +-- Attachment.js
¦   ¦   +-- Activity.js
¦   ¦   +-- Notification.js
¦   ¦
¦   +-- controllers/                 # business logic per resource
¦   ¦   +-- authController.js
¦   ¦   +-- organizationController.js
¦   ¦   +-- invitationController.js
¦   ¦   +-- projectController.js
¦   ¦   +-- sprintController.js
¦   ¦   +-- milestoneController.js
¦   ¦   +-- taskController.js
¦   ¦   +-- commentController.js
¦   ¦   +-- attachmentController.js
¦   ¦   +-- activityController.js
¦   ¦   +-- notificationController.js
¦   ¦
¦   +-- routes/                      # Express route definitions
¦   ¦   +-- authRoutes.js
¦   ¦   +-- organizationRoutes.js
¦   ¦   +-- invitationRoutes.js
¦   ¦   +-- projectRoutes.js
¦   ¦   +-- sprintRoutes.js
¦   ¦   +-- milestoneRoutes.js
¦   ¦   +-- taskRoutes.js
¦   ¦   +-- commentRoutes.js
¦   ¦   +-- attachmentRoutes.js
¦   ¦   +-- activityRoutes.js
¦   ¦   +-- notificationRoutes.js
¦   ¦
¦   +-- middleware/
¦   ¦   +-- auth.js                  # verifies JWT, attaches req.user
¦   ¦   +-- requireOrgRole.js        # RBAC: checks Membership role
¦   ¦   +-- requireProjectRole.js    # RBAC: checks ProjectMember role
¦   ¦   +-- errorHandler.js          # centralized error handling
¦   ¦   +-- validate.js              # wraps express-validator checks
¦   ¦   +-- upload.js                # multer/cloudinary config
¦   ¦
¦   +-- utils/
¦   ¦   +-- generateToken.js         # JWT sign/verify helpers
¦   ¦   +-- asyncHandler.js          # wraps async route handlers
¦   ¦   +-- logActivity.js           # helper to write Activity entries
¦   ¦   +-- sendEmail.js             # invite emails (or console-log stub)
¦   ¦   +-- apiFeatures.js           # search/filter/sort/paginate helper
¦   ¦
¦   +-- config/
¦   ¦   +-- db.js                    # Mongoose connection
¦   ¦
¦   +-- seed/
¦   ¦   +-- seed.js                  # meaningful test data generator
¦   ¦
¦   +-- .env                         # secrets (not committed)
¦   +-- .env.example
¦   +-- server.js                    # app entry point
¦   +-- package.json
¦
+-- frontend/
¦   +-- public/
¦   +-- src/
¦   ¦   +-- api/                     # axios instance + per-resource API calls
¦   ¦   ¦   +-- axiosClient.js
¦   ¦   ¦   +-- authApi.js
¦   ¦   ¦   +-- orgApi.js
¦   ¦   ¦   +-- projectApi.js
¦   ¦   ¦   +-- taskApi.js
¦   ¦   ¦   +-- ...
¦   ¦   ¦
¦   ¦   +-- components/
¦   ¦   ¦   +-- common/               # Button, Modal, Avatar, Badge, Spinner...
¦   ¦   ¦   +-- layout/               # Sidebar, Topbar, CommandPalette
¦   ¦   ¦   +-- kanban/               # Board, Column, TaskCard (drag-and-drop)
¦   ¦   ¦   +-- sprint/               # BacklogList, SprintPlanner
¦   ¦   ¦   +-- timeline/             # MilestoneTimeline
¦   ¦   ¦   +-- dashboard/            # WorkloadChart, StatsCards
¦   ¦   ¦   +-- task/                 # TaskDetailPanel, CommentThread, FileUpload
¦   ¦   ¦   +-- activity/             # ActivityFeed
¦   ¦   ¦
¦   ¦   +-- pages/
¦   ¦   ¦   +-- auth/                 # Login, Signup, AcceptInvite
¦   ¦   ¦   +-- org/                  # OrgDashboard, OrgSettings, MemberManagement
¦   ¦   ¦   +-- project/              # ProjectOverview, ProjectSettings
¦   ¦   ¦   +-- board/                # KanbanBoardPage
¦   ¦   ¦   +-- backlog/              # BacklogPage
¦   ¦   ¦   +-- timeline/             # TimelinePage
¦   ¦   ¦   +-- workload/             # WorkloadDashboardPage
¦   ¦   ¦   +-- task/                 # TaskDetailPage
¦   ¦   ¦
¦   ¦   +-- context/ (or store/)      # AuthContext, OrgContext — or Redux/Zustand store
¦   ¦   +-- hooks/                    # useAuth, usePermissions, useDebounce...
¦   ¦   +-- routes/                   # AppRouter, ProtectedRoute, RoleGuard
¦   ¦   +-- utils/                    # formatDate, permissionCheck, constants
¦   ¦   +-- styles/                   # Tailwind config, design tokens
¦   ¦   +-- App.jsx
¦   ¦   +-- main.jsx
¦   ¦
¦   +-- index.html
¦   +-- tailwind.config.js
¦   +-- vite.config.js
¦   +-- package.json
¦
+-- README.md
