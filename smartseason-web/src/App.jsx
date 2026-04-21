import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import FieldsListPage from './pages/FieldsListPage'
import FieldDetailPage from './pages/FieldDetailPage'
import CreateFieldPage from './pages/CreateFieldPage'
import SignupPage from './pages/SignupPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/fields" element={
        <ProtectedRoute><FieldsListPage /></ProtectedRoute>
      } />
      <Route path="/fields/new" element={
        <ProtectedRoute adminOnly><CreateFieldPage /></ProtectedRoute>
      } />
      <Route path="/fields/:id" element={
        <ProtectedRoute><FieldDetailPage /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
