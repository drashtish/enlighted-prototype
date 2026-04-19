
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Doubts from './pages/Doubts';
import Batches from './pages/Batches';
import BatchDetail from './pages/BatchDetail';
import PeerLearning from './pages/PeerLearning';
import PeerDiscussionDetail from './pages/PeerDiscussionDetail';
import RevisionNotes from './pages/RevisionNotes';
import Assignments from './pages/Assignments';
import AssignmentTaking from './pages/AssignmentTaking';
import Performance from './pages/Performance';
import Schedule from './pages/Schedule';
import Monitoring from './pages/Monitoring';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import { UserRole } from './types';

// Remaining Placeholder Pages
const Billing = () => <div className="p-8">Billing & Subscriptions - Coming Soon</div>;
const Settings = () => <div className="p-8">Settings - Coming Soon</div>;

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  const handleChangeRole = (role: UserRole) => {
    setUserRole(role);
  };

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout 
        userRole={userRole} 
        onLogout={handleLogout} 
        onChangeRole={handleChangeRole}
      >
        <Routes>
          <Route path="/" element={<Dashboard userRole={userRole} />} />
          <Route path="/doubts" element={<Doubts />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/batches/:id" element={<BatchDetail userRole={userRole} />} />
          <Route path="/peer" element={<PeerLearning userRole={userRole} />} />
          <Route path="/peer/:id" element={<PeerDiscussionDetail userRole={userRole} />} />
          <Route path="/notes" element={<RevisionNotes />} />
          <Route path="/assignments" element={<Assignments userRole={userRole} />} />
          <Route path="/assignment-taking/:id" element={<AssignmentTaking />} />
          <Route path="/performance" element={<Performance userRole={userRole} />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
