import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './components/Layout';
import Courses from './pages/Courses';
import Tests from './pages/Tests';
import Assignments from './pages/Assignments';
import CompanyQuestions from './pages/CompanyQuestions';
import CompanyDetails from './pages/CompanyDetails';
import Jobs from './pages/Jobs';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import CourseViewer from './pages/CourseViewer';
import ReportIssue from './pages/ReportIssue';
import AskGenz from './pages/AskGenz';
import ProblemDetail from './pages/ProblemDetail';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/courses" element={
              <PrivateRoute>
                <Layout>
                  <Courses />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/courses/:id" element={
              <PrivateRoute>
                <Layout>
                  <CourseViewer />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/tests" element={
              <PrivateRoute>
                <Layout>
                  <Tests />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/assignments" element={
              <PrivateRoute>
                <Layout>
                  <Assignments />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/assignments/:id" element={
              <PrivateRoute>
                <Layout>
                  <ProblemDetail />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/company-questions" element={
              <PrivateRoute>
                <Layout>
                  <CompanyQuestions />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/company-questions/:id" element={
              <PrivateRoute>
                <Layout>
                  <CompanyDetails />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/company/:id" element={
              <PrivateRoute>
                <Layout>
                  <CompanyDetails />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/jobs" element={
              <PrivateRoute>
                <Layout>
                  <Jobs />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/bookmarks" element={
              <PrivateRoute>
                <Layout>
                  <Bookmarks />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/report-issue" element={
              <PrivateRoute>
                <Layout>
                  <ReportIssue />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/ask-genz" element={
              <PrivateRoute>
                <Layout>
                  <AskGenz />
                </Layout>
              </PrivateRoute>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
