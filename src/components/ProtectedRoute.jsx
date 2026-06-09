import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { profile, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-teal"
              style={{ animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // If no profile (name not entered yet), redirect to onboarding
  if (!profile?.name) return <Navigate to="/onboarding/name" replace />

  return children
}
