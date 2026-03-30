import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkerListing from './pages/WorkerListing';
import Booking from './pages/Booking';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workers" element={<WorkerListing />} />
        <Route path="/book/:workerId" element={<PrivateRoute role="Customer"><Booking /></PrivateRoute>} />
        <Route path="/dashboard/customer" element={<PrivateRoute role="Customer"><CustomerDashboard /></PrivateRoute>} />
        <Route path="/dashboard/worker" element={<PrivateRoute role="Worker"><WorkerDashboard /></PrivateRoute>} />
        <Route path="/dashboard/admin" element={<PrivateRoute role="Admin"><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
