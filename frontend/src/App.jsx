import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import ComingSoonPage from './pages/ComingSoonPage'
import ChatPage from './pages/ChatPage'
import StudyPage from './pages/StudyPage'
import FlashcardsPage from './pages/FlashcardsPage'
import QuizzesPage from './pages/QuizzesPage'
import PlannerPage from './pages/PlannerPage'
import SettingsPage from './pages/SettingsPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'

/**
 * Root App component.
 *
 * All routes are nested inside the DashboardLayout shell.
 * Feature pages will replace the ComingSoonPage placeholders.
 */
export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Dashboard Shell */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="study" element={<StudyPage />} />
        <Route path="flashcards" element={<FlashcardsPage />} />
        <Route path="planner" element={<PlannerPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="quizzes" element={<QuizzesPage />} />
        <Route path="history" element={<ComingSoonPage title="History" />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
