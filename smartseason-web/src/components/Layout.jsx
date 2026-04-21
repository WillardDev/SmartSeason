import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const nav = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Fields',    path: '/fields' },
    ...(user?.role === 'admin' ? [{ label: '+ New Field', path: '/fields/new' }] : []),
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>

      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div
            onClick={() => navigate('/dashboard')}
            className="cursor-pointer flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--green-800)' }}>
                <img src="/images/kfms.png" alt="Logo" className="w-15 h-10" />
            </div>
            <span className="display text-base" style={{ color: 'var(--green-900)', letterSpacing: '-0.02em' }}>
              SmartSeason
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {nav.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-150 ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={location.pathname === item.path
                  ? { background: 'var(--green-800)' } : {}}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold" style={{ color: 'var(--green-900)' }}>
                {user?.name}
              </p>
              <p className="text-xs capitalize" style={{ color: 'var(--green-700)' }}>
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold uppercase tracking-widest text-gray-400
                hover:text-red-500 transition-colors border border-gray-300 px-3 py-1.5 rounded-full"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center">
        <p className="display-light text-xs" style={{ color: 'var(--green-800)', fontSize: '10px' }}>
          SmartSeason &nbsp;·&nbsp; Field Monitoring System
        </p>
      </footer>
    </div>
  )
}