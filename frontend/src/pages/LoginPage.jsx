import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      login(data.access_token, data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@test.com', password: 'password123' })
    else setForm({ email: 'member@test.com', password: 'password123' })
  }

  return (
    <div className="min-h-screen bg-ink-950 grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 bg-glow rounded-xl flex items-center justify-center glow-dot">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-display font-700 text-2xl text-ink-50 tracking-tight">TaskFlow</span>
        </div>

        <div className="card p-7">
          <h1 className="font-display text-xl font-700 text-ink-50 mb-1">Sign in</h1>
          <p className="text-sm text-ink-500 mb-6">Enter your credentials to continue</p>

          {/* Demo buttons */}
          <div className="flex gap-2 mb-5">
            <button onClick={() => fillDemo('admin')} className="flex-1 text-xs py-1.5 px-2 rounded-md bg-glow/10 border border-glow/20 text-glow hover:bg-glow/20 transition-colors font-medium">
              Demo Admin
            </button>
            <button onClick={() => fillDemo('member')} className="flex-1 text-xs py-1.5 px-2 rounded-md bg-ink-800 border border-ink-700 text-ink-400 hover:text-ink-200 hover:border-ink-600 transition-colors font-medium">
              Demo Member
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-ink-800" />
            <span className="text-xs text-ink-600">or</span>
            <div className="flex-1 h-px bg-ink-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-500 mt-5">
          No account?{' '}
          <Link to="/signup" className="text-glow hover:text-glow-light transition-colors font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
