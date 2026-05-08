import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, Plus, Users, ArrowRight, Calendar } from 'lucide-react'
import { projectsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/helpers'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

function CreateProjectForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await projectsAPI.create(form)
      toast.success('Project created')
      onSuccess()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Project Name *</label>
        <input
          className="input"
          placeholder="e.g. Alpha Launch"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="What is this project about?"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Creating…' : 'Create Project'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
      </div>
    </form>
  )
}

export default function ProjectsPage() {
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const load = () => {
    setLoading(true)
    projectsAPI.list()
      .then(r => setProjects(r.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink-50">Projects</h1>
          <p className="text-sm text-ink-500 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} />
            New Project
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description={isAdmin ? 'Create your first project to get started.' : 'You have not been added to any projects yet.'}
          action={isAdmin && (
            <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
              <Plus size={14} /> New Project
            </button>
          )}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="card p-5 hover:border-ink-600 hover:bg-ink-800/30 transition-all duration-150 group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-glow/10 border border-glow/20 flex items-center justify-center shrink-0">
                  <FolderKanban size={16} className="text-glow" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-ink-100 group-hover:text-glow transition-colors truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-ink-500 mt-0.5 line-clamp-2">
                    {project.description || 'No description'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-ink-600 pt-3 border-t border-ink-800/60">
                <span className="flex items-center gap-1.5">
                  <Users size={12} />
                  {project.members?.length ?? 0} member{project.members?.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {formatDate(project.created_at)}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-ink-600">by {project.creator?.name}</span>
                <ArrowRight size={13} className="text-ink-600 group-hover:text-glow group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Project">
        <CreateProjectForm
          onSuccess={() => { setShowCreate(false); load() }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  )
}
