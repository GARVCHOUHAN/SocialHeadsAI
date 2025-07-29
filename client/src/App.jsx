

import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import DashboardPage from "./pages/Dashboard"; // This now points to your new dashboard
import ScriptAssistant from './components/ScriptAssistant';
import Planner from "./pages/Planner";
import AnalyticsPage from "./pages/Analytics";
import { EarningsPage } from "./pages/EarningPage";
import { LogisticsPage } from "./pages/LogisticPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotificationsPage } from "./pages/NotificationPage";

// Helper to check for token
const isAuthenticated = () => !!localStorage.getItem("token");

// A component to protect routes that require a user to be logged in
// PrivateRoute component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/script-assistant" element={<ScriptAssistant />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/earn" element={<EarningsPage />} />
        <Route path="/logistic" element={<LogisticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notification" element={<NotificationsPage />} />


        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <PrivateRoute>
              <AnalyticsPage />
            </PrivateRoute>
          } 
        />

        {/* Default route redirects to dashboard if logged in, otherwise to login */}
        <Route 
          path="/" 
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
        
      </Routes>
    </Router>
  );
}

export default App;
