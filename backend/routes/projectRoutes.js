const express = require('express');
const protect = require('../middleware/auth');
const requireProjectRole = require('../middleware/requireProjectRole');
const {
  getProject,
  updateProject,
  archiveProject,
  getProjectMembers,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
} = require('../controllers/projectController');
const {
  createSprint,
  getSprints,
  getSprint,
  updateSprint,
  deleteSprint,
} = require('../controllers/sprintController');
const {
  createMilestone,
  getMilestones,
  updateMilestone,
  deleteMilestone,
} = require('../controllers/milestoneController');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  reorderTasks,
  archiveTask,
  getTaskHistory,
} = require('../controllers/taskController');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const { getProjectActivity } = require('../controllers/activityController');

const router = express.Router();

router.use(protect);

// --- Project detail ---
router.get('/:projectId', requireProjectRole(), getProject); // any project member or org admin
router.patch('/:projectId', requireProjectRole('project_manager'), updateProject);
router.delete('/:projectId', requireProjectRole('project_manager'), archiveProject);

// --- Project members ---
router.get('/:projectId/members', requireProjectRole(), getProjectMembers);
router.post('/:projectId/members', requireProjectRole('project_manager'), addProjectMember);
router.patch('/:projectId/members/:memberId', requireProjectRole('project_manager'), updateProjectMemberRole);
router.delete('/:projectId/members/:memberId', requireProjectRole('project_manager'), removeProjectMember);

// --- Sprints ---
router.post(
  '/:projectId/sprints',
  requireProjectRole('project_manager', 'team_lead'),
  createSprint
);
router.get('/:projectId/sprints', requireProjectRole(), getSprints);
router.get('/:projectId/sprints/:sprintId', requireProjectRole(), getSprint);
router.patch(
  '/:projectId/sprints/:sprintId',
  requireProjectRole('project_manager', 'team_lead'),
  updateSprint
);
router.delete('/:projectId/sprints/:sprintId', requireProjectRole('project_manager'), deleteSprint);

// --- Milestones ---
router.post('/:projectId/milestones', requireProjectRole('project_manager'), createMilestone);
router.get('/:projectId/milestones', requireProjectRole(), getMilestones);
router.patch('/:projectId/milestones/:milestoneId', requireProjectRole('project_manager'), updateMilestone);
router.delete('/:projectId/milestones/:milestoneId', requireProjectRole('project_manager'), deleteMilestone);

// --- Tasks ---
router.post(
  '/:projectId/tasks',
  requireProjectRole('project_manager', 'team_lead', 'member'),
  createTask
);
router.get('/:projectId/tasks', requireProjectRole(), getTasks); // includes stakeholders (read-only)
router.post(
  '/:projectId/tasks/reorder',
  requireProjectRole('project_manager', 'team_lead', 'member'),
  reorderTasks
);
router.get('/:projectId/tasks/:taskId', requireProjectRole(), getTask);
router.patch(
  '/:projectId/tasks/:taskId',
  requireProjectRole('project_manager', 'team_lead', 'member'),
  updateTask
);
router.patch(
  '/:projectId/tasks/:taskId/status',
  requireProjectRole('project_manager', 'team_lead', 'member'),
  updateTaskStatus
);
router.delete(
  '/:projectId/tasks/:taskId',
  requireProjectRole('project_manager', 'team_lead'),
  archiveTask
);
router.get('/:projectId/tasks/:taskId/history', requireProjectRole(), getTaskHistory);

// --- Comments ---
router.post(
  '/:projectId/tasks/:taskId/comments',
  requireProjectRole('project_manager', 'team_lead', 'member'),
  createComment
);
router.get('/:projectId/tasks/:taskId/comments', requireProjectRole(), getComments);
router.patch(
  '/:projectId/tasks/:taskId/comments/:commentId',
  requireProjectRole('project_manager', 'team_lead', 'member'),
  updateComment
);
router.delete(
  '/:projectId/tasks/:taskId/comments/:commentId',
  requireProjectRole('project_manager', 'team_lead', 'member'),
  deleteComment
);

// --- Activity feed ---
router.get('/:projectId/activity', requireProjectRole(), getProjectActivity);

module.exports = router;
