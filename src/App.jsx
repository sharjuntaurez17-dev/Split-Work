import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'

import SplashScreen from './pages/SplashScreen'
import LoginScreen from './pages/LoginScreen'
import SignupScreen from './pages/SignupScreen'
import EnterNameScreen from './pages/EnterNameScreen'
import DashboardScreen from './pages/DashboardScreen'
import TasksScreen from './pages/TasksScreen'
import FriendsScreen from './pages/FriendsScreen'
import ActivityScreen from './pages/ActivityScreen'
import AccountScreen from './pages/AccountScreen'
import AddChoreScreen from './pages/AddChoreScreen'
import ScheduleSetupScreen from './pages/ScheduleSetupScreen'
import AddPeopleScreen from './pages/AddPeopleScreen'
import SettingsScreen from './pages/SettingsScreen'
import SettingsOptionsScreen from './pages/SettingsOptionsScreen'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />

            {/* Onboarding */}
            <Route path="/onboarding/name" element={
              <ProtectedRoute><EnterNameScreen /></ProtectedRoute>
            } />

            {/* Main app with nested tabs */}
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardScreen /></ProtectedRoute>
            }>
              <Route index element={<Navigate to="tasks" replace />} />
              <Route path="tasks"    element={<TasksScreen />} />
              <Route path="friends"  element={<FriendsScreen />} />
              <Route path="activity" element={<ActivityScreen />} />
              <Route path="account"  element={<AccountScreen />} />
            </Route>

            {/* Modal / full-page flows */}
            <Route path="/add-chore" element={
              <ProtectedRoute><AddChoreScreen /></ProtectedRoute>
            } />
            <Route path="/add-chore/schedule" element={
              <ProtectedRoute><ScheduleSetupScreen /></ProtectedRoute>
            } />
            <Route path="/add-people" element={
              <ProtectedRoute><AddPeopleScreen /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><SettingsScreen /></ProtectedRoute>
            } />
            <Route path="/settings/:option" element={
              <ProtectedRoute><SettingsOptionsScreen /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
