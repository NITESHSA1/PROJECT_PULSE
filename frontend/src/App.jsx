import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrgProvider } from './context/OrgContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AcceptInvite from './pages/auth/AcceptInvite';
import OrgList from './pages/org/OrgList';
import ProjectList from './pages/project/ProjectList';
import ProjectLayout from './pages/project/ProjectLayout';
import BoardPage from './pages/board/BoardPage';
import BacklogPage from './pages/backlog/BacklogPage';
import TimelinePage from './pages/timeline/TimelinePage';
import WorkloadPage from './pages/workload/WorkloadPage';
import ActivityPage from './pages/activity/ActivityPage';
import TeamPage from './pages/team/TeamPage';

export default function App() {
  return (
    <AuthProvider>
      <OrgProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/invitations/accept" element={<AcceptInvite />} />

            <Route
              path="/orgs"
              element={
                <ProtectedRoute>
                  <OrgList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orgs/:orgId/projects"
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orgs/:orgId/projects/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="board" replace />} />
              <Route path="board" element={<BoardPage />} />
              <Route path="backlog" element={<BacklogPage />} />
              <Route path="timeline" element={<TimelinePage />} />
              <Route path="workload" element={<WorkloadPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="activity" element={<ActivityPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/orgs" replace />} />
            <Route path="*" element={<Navigate to="/orgs" replace />} />
          </Routes>
        </BrowserRouter>
      </OrgProvider>
    </AuthProvider>
  );
}
