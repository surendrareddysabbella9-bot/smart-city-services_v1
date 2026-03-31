import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkerListing from './pages/WorkerListing';
import Booking from './pages/Booking';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import WorkerPerformanceDashboard from './pages/WorkerPerformanceDashboard';
import CommunitySubscriptionsPage from './pages/CommunitySubscriptionsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardLayout from './components/DashboardLayout';
import WorkerProfile from './pages/WorkerProfile';

const queryClient = new QueryClient();

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/workers" element={<WorkerListing />} />
          <Route path="/book/:workerId" element={<PrivateRoute><Booking /></PrivateRoute>} />
          <Route path="/worker/:id" element={<WorkerProfile />} />
          <Route path="/dashboard/customer" element={<PrivateRoute role="Customer"><DashboardLayout><CustomerDashboard /></DashboardLayout></PrivateRoute>} />
          <Route path="/dashboard/worker" element={<PrivateRoute role="Worker"><DashboardLayout><WorkerDashboard /></DashboardLayout></PrivateRoute>} />
          <Route path="/dashboard/admin" element={<PrivateRoute role="Admin"><DashboardLayout><AdminDashboard /></DashboardLayout></PrivateRoute>} />
          <Route path="/dashboard/admin/analytics" element={<PrivateRoute role="Admin"><DashboardLayout><AnalyticsDashboard /></DashboardLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><DashboardLayout><ProfilePage /></DashboardLayout></PrivateRoute>} />
          <Route path="/dashboard/worker/performance" element={<PrivateRoute role="Worker"><DashboardLayout><WorkerPerformanceDashboard /></DashboardLayout></PrivateRoute>} />
          <Route path="/dashboard/customer/subscriptions" element={<PrivateRoute role="Customer"><DashboardLayout><CommunitySubscriptionsPage /></DashboardLayout></PrivateRoute>} />
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
