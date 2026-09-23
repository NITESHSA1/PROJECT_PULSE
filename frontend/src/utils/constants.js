export const STATUS_COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: 'status-backlog' },
  { id: 'todo', label: 'To Do', color: 'status-todo' },
  { id: 'in_progress', label: 'In Progress', color: 'status-progress' },
  { id: 'in_review', label: 'In Review', color: 'status-review' },
  { id: 'blocked', label: 'Blocked', color: 'status-blocked' },
  { id: 'done', label: 'Done', color: 'status-done' },
];

export const STATUS_DOT = {
  backlog: 'bg-status-backlog',
  todo: 'bg-status-todo',
  in_progress: 'bg-status-progress',
  in_review: 'bg-status-review',
  blocked: 'bg-status-blocked',
  done: 'bg-status-done',
};

export const PRIORITY_COLOR = {
  lowest: 'bg-priority-lowest',
  low: 'bg-priority-low',
  medium: 'bg-priority-medium',
  high: 'bg-priority-high',
  highest: 'bg-priority-highest',
};

export const PRIORITY_LABEL = {
  lowest: 'Lowest',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  highest: 'Highest',
};

export const ORG_ROLE_LABEL = {
  admin: 'Admin',
  project_manager: 'Project Manager',
  team_lead: 'Team Lead',
  member: 'Member',
  stakeholder: 'Stakeholder',
};
