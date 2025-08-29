import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import ChatbotPage from './pages/ChatbotPage';
import UsersPage from './pages/UsersPage';
import SubscriptionPage from './pages/SubscriptionPage';
import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/leads" element={
          <ProtectedRoute allowedRoles={['system_admin', 'org_admin', 'employee']}>
            <LeadsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/complaints" element={
          <ProtectedRoute>
            <ComplaintsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/chatbot" element={
          <ProtectedRoute>
            <ChatbotPage />
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['system_admin', 'org_admin']}>
            <UsersPage />
          </ProtectedRoute>
        } />
        
        <Route path="/subscription" element={
          <ProtectedRoute allowedRoles={['system_admin', 'org_admin']}>
            <SubscriptionPage />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;