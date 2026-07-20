import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import FindGroups from './pages/FindGroups'
import GroupList from './pages/GroupList'
import GroupDetail from './pages/GroupDetail'
import Subjects from './pages/Subjects'
import SyllabusDetail from './pages/SyllabusDetail'
import ProgressTracker from './pages/ProgressTracker'
import Planner from './pages/Planner'
import Notifications from './pages/Notifications'
import NotFound from './pages/NotFound'

// Route table. Public auth routes sit at the top level; everything else is
// nested under a ProtectedRoute + Layout so the shell (navbar/sidebar) is shared
// and unauthenticated users are redirected to /login.
export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected app shell */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/find-groups" element={<FindGroups />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/:subjectId" element={<SyllabusDetail />} />
        <Route path="/progress" element={<ProgressTracker />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
