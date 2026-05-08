import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckSquare, Clock, AlertTriangle, User, BarChart3, ArrowRight } from 'lucide-react'
import { dashboardAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { StatusBadge, PriorityBadge } from '../components/TaskBadges'
import { formatDate, isOverdue } from '../utils/helpers'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-2xl font-display font-700 text-ink-50">{value}</p>
        <p className="text-xs text-ink-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-ink-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.get()
      .then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <LoadingSpinner size="lg" />
    </div>
  )

  const completion = stats?.total_tasks
    ? Math.round((stats.completed_tasks / stats.total_tasks) * 100)
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-700 text-ink-50">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="text-glow">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-sm text-ink-500 mt-1">Here's your team's progress overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BarChart3} label="Total Tasks" value={stats?.total_tasks ?? 0} color="bg-glow/10 text-glow" />
        <StatCard icon={CheckSquare} label="Completed" value={stats?.completed_tasks ?? 0} color="bg-emerald-900/30 text-emerald-400" sub={`${completion}% done`} />
        <StatCard icon={Clock} label="Pending" value={stats?.pending_tasks ?? 0} color="bg-blue-900/30 text-blue-400" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats?.overdue_tasks ?? 0} color="bg-red-900/30 text-red-400" />
      </div>

      {/* My tasks + progress */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Tasks */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={15} className="text-glow" />
            <h2 className="text-sm font-medium text-ink-200">Assigned to me</h2>
            <span className="ml-auto text-xs bg-glow/10 text-glow border border-glow/20 px-2 py-0.5 rounded-full font-medium">
              {stats?.my_tasks ?? 0}
            </span>
          </div>
          <Link to="/tasks" className="btn-ghost w-full text-xs flex items-center justify-center gap-1.5">
            View my tasks <ArrowRight size={12} />
          </Link>
        </div>

        {/* Completion bar */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-medium text-ink-200 mb-4">Overall Completion</h2>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-3xl font-display font-700 text-ink-50">{completion}%</span>
            <span className="text-sm text-ink-500 mb-1">{stats?.completed_tasks} of {stats?.total_tasks} tasks done</span>
          </div>
          <div className="w-full h-2 bg-ink-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-glow to-glow-light rounded-full transition-all duration-700"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent + Overdue */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="card">
          <div className="px-5 py-4 border-b border-ink-800 flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink-200">Recent Tasks</h2>
            <Link to="/tasks" className="text-xs text-glow hover:text-glow-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-ink-800/50">
            {stats?.recent_tasks?.length === 0 && (
              <p className="text-xs text-ink-600 text-center py-8">No tasks yet</p>
            )}
            {stats?.recent_tasks?.map(task => (
              <div key={task.id} className="px-5 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-ink-200 truncate">{task.title}</p>
                  <p className="text-xs text-ink-600 mt-0.5">{formatDate(task.due_date)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="card">
          <div className="px-5 py-4 border-b border-ink-800 flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink-200 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-400" />
              Overdue
            </h2>
          </div>
          <div className="divide-y divide-ink-800/50">
            {stats?.overdue_task_list?.length === 0 && (
              <p className="text-xs text-ink-600 text-center py-8">No overdue tasks 🎉</p>
            )}
            {stats?.overdue_task_list?.map(task => (
              <div key={task.id} className="px-5 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-red-300 truncate">{task.title}</p>
                  <p className="text-xs text-red-500/70 mt-0.5">Due {formatDate(task.due_date)}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
