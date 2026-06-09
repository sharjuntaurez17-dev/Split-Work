import { Outlet } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function DashboardScreen() {
  return (
    <div className="screen bg-app-bg">
      {/* Tab content area with bottom padding so it's not hidden behind nav */}
      <div className="flex-1 overflow-y-auto pb-[72px]">
        <div className="w-full max-w-app mx-auto">
          <Outlet />
        </div>
      </div>

      {/* Fixed bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="w-full max-w-app mx-auto">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
