import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import MyApplications from './pages/MyApplications';
import PostJob from './pages/PostJob';
import MyPostings from './pages/MyPostings';
import JobApplicants from './pages/JobApplicants';
import Profile from './pages/Profile';

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'RECRUITER' ? '/recruiter' : '/jobseeker'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/jobseeker"
            element={
              <ProtectedRoute allowedRole="JOB_SEEKER">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRole="JOB_SEEKER">
                <JobSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobseeker/applications"
            element={
              <ProtectedRoute allowedRole="JOB_SEEKER">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post-job/:id"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/postings"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <MyPostings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <JobApplicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
