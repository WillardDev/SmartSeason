import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      // Show backend error message if available, otherwise generic message
      const errorMessage = err.response?.data?.message || 'Invalid email or password.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--soil)' }}>

      {/* Left — hero image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="/images/plant.jpg"
          alt="Field"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.55) saturate(1.2)' }}
        />
        {/* Overlay content */}
        <div className="relative z-10 flex flex-col justify-end p-16 pb-20">
          <p className="display-light text-xs mb-4"
            style={{ color: 'var(--green-400)', letterSpacing: '0.3em' }}>
            Field Monitoring System
          </p>
          <h1 className="display text-7xl leading-none mb-6"
            style={{ color: '#fff', lineHeight: '0.9' }}>
            Smart<br />Season
          </h1>
          <p className="text-base font-light max-w-sm" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            Track every field, every stage, every season — from planting to harvest.
          </p>
        </div>

        {/* Green tint gradient */}
        <div className="absolute inset-0 z-0"
          style={{ background: 'linear-gradient(135deg, rgba(5,46,22,0.5) 0%, transparent 60%)' }} />
      </div>

      {/* Right — login form */}
      <div className="w-full lg:w-[460px] flex flex-col justify-center px-10 py-16"
        style={{ background: 'var(--cream)' }}>

        {/* Mobile logo */}
        <div className="mb-12 lg:hidden">
          <p className="display text-3xl" style={{ color: 'var(--green-900)' }}>SmartSeason</p>
          <p className="display-light text-xs mt-1" style={{ color: 'var(--green-700)', fontSize: '10px' }}>
            Field Monitoring System
          </p>
        </div>

        <div className="fade-up fade-up-1">
          <p className="display-light text-xs mb-2"
            style={{ color: 'var(--green-700)', letterSpacing: '0.25em', fontSize: '10px' }}>
            Welcome back
          </p>
          <h2 className="display text-4xl mb-10" style={{ color: 'var(--green-950)' }}>
            Sign In
          </h2>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 fade-up fade-up-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'var(--green-800)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@smartseason.test"
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'var(--green-800)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 rounded-xl disabled:opacity-50"
              style={{ background: 'var(--green-800)', fontSize: '13px' }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </div>
        </form>

        <div className="mt-10 text-xs text-center fade-up fade-up-3 space-y-2">
          <p style={{ color: 'var(--green-800)' }}>
            Don't have an account? <Link to="/signup" className="font-bold hover:underline">Sign up</Link>
          </p>
          <p className="text-gray-400">
            Demo: admin@smartseason.test · agent@smartseason.test
          </p>
        </div>
      </div>
    </div>
  )
}
