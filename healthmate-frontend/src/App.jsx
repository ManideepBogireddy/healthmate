import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotUsername from "./pages/ForgotUsername";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import CompleteProfile from "./pages/CompleteProfile";
import WorkoutTracker from "./pages/WorkoutTracker";
import MealTracker from "./pages/MealTracker";
import HealthTracker from "./pages/HealthTracker";
import GoalSetter from "./pages/GoalSetter";
import HelpCenter from "./pages/HelpCenter";
import BlogStudio from "./pages/BlogStudio";
import BlogDetail from "./pages/BlogDetail";
import ModerationCenter from "./pages/ModerationCenter";
import TrainerMatch from "./pages/TrainerMatch";
import TrainerProfile from "./pages/TrainerProfile";
import Chatbot from "./components/Chatbot";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-username" element={<ForgotUsername />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />
            <Route path="/complete-profile" element={
              <PrivateRoute><CompleteProfile /></PrivateRoute>
            } />
            {/* ✅ Moved inside Routes */}
            <Route path="/workout-tracker" element={
              <PrivateRoute><WorkoutTracker /></PrivateRoute>
            } />
            <Route path="/meal-tracker" element={
              <PrivateRoute><MealTracker /></PrivateRoute>
            } />
            <Route path="/health-tracker" element={
              <PrivateRoute><HealthTracker /></PrivateRoute>
            } />
            <Route path="/goal-center" element={
              <PrivateRoute><GoalSetter /></PrivateRoute>
            } />
            <Route path="/help-center" element={
              <PrivateRoute><HelpCenter /></PrivateRoute>
            } />
            <Route path="/blog-studio" element={
              <PrivateRoute><BlogStudio /></PrivateRoute>
            } />
            <Route path="/blog/:id" element={
              <PrivateRoute><BlogDetail /></PrivateRoute>
            } />
            <Route path="/moderation-center" element={
              <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_TRAINER']}><ModerationCenter /></PrivateRoute>
            } />
            <Route path="/trainer-match" element={
              <PrivateRoute><TrainerMatch /></PrivateRoute>
            } />
            <Route path="/trainer/:id" element={
              <PrivateRoute><TrainerProfile /></PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <Chatbot />
      </AuthProvider>
    </Router>
  );
}

export default App;
