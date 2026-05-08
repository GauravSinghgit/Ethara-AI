import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Users, Plus, Trash2, CheckSquare, UserPlus } from 'lucide-react'
import { projectsAPI, tasksAPI, usersAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/helpers'
import { StatusBadge, PriorityBadge } from '../components/TaskBadges'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import TaskForm from '../components/TaskForm'
import TaskRow from '../components/TaskRow'
import toast from 'react-hot-toast'

function AddMemberForm({ projectId, existingMemberIds, onSuccess, onCancel }) {
  const [users, setUsers] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    usersAPI.list().then(r => {
      setUsers(r.data.filter(u => !existingMemberIds.includes(u.id)))
    }).catch(() => {})
  }, [existingMemberIds])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!selectedId) return
    setLoading(true)
    try {
      await projectsAPI.addMember(projectId, Number(selectedId))
      toast.success('Member added')
      onSuccess()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleAdd} className="space-y-4">
      <div>
        <label className="label">Select User</label>
        <select className="input" value={selectedId} onChange={e => setSelectedId(e.target.value)} required>
          <option value="">Choose a user…</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name} ({u.email}) — {u.role}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading || !selectedId} className="btn-primary flex-1">
          {loading ? 'Adding…' : 'Add Member'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
      </div>
    </form>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { isAdmin, user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const loadProject = () => projectsAPI.get(id).then(r => setProject(r.data))
  const loadTasks = () => tasksAPI.list(Number(id)).then(r => setTasks(r.data))

  useEffect(() => {
    Promise.all([loadProject(), loadTasks()])
      .catch(() => toast.error('Failed to load project'))
      .finally(() => setLoading(false))
  }, [id])

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member?')) return
    try {
      await projectsAPI.removeMember(id, userId)
      toast.success('Member removed')
      loadProject()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to remove member')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return
    try {
      await tasksAPI.delete(taskId)
      toast.success('Task deleted')
      loadTasks()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete task')
    }
  }

  const handleStatusChange = async (taskId, data) => {
    try {
      await tasksAPI.update(taskId, data)
      loadTasks()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update task')
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  )

  if (!project) return (
    <div className="text-center py-20 text-ink-500">Project not found</div>
  )

  const memberIds = project.members?.map(m => m.user_id) || []

  return (
    <div className="space-y-8">
      {/* Back + Header */}
      <div>
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-300 transition-colors mb-4">
          <ArrowLeft size={13} /> Back to Projects
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-700 text-ink-50">{project.title}</h1>
            {project.description && (
              <p className="text-sm text-ink-500 mt-1 max-w-xl">{project.description}</p>
            )}
            <p className="text-xs text-ink-600 mt-2">
              Created by {project.creator?.name} · {formatDate(project.created_at)}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateTask(true)}
              className="btn-primary flex items-center gap-2 shrink-0"
            >
              <Plus size={14} /> Add Task
            </button>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="card">
        <div className="px-5 py-4 border-b border-ink-800 flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink-200 flex items-center gap-2">
            <Users size={14} className="text-glow" />
            Team Members
            <span className="text-xs bg-ink-800 text-ink-400 px-2 py-0.5 rounded-full">{project.members?.length}</span>
          </h2>
          {isAdmin && (
            <button
              onClick={() => setShowAddMember(true)}
              className="btn-ghost text-xs flex items-center gap-1.5 py-1.5"
            >
              <UserPlus size={13} /> Add Member
            </button>
          )}
        </div>
        <div className="divide-y divide-ink-800/50">
          {project.members?.length === 0 && (
            <p className="text-xs text-ink-600 text-center py-6">No members yet</p>
          )}
          {project.members?.map(m => (
            <div key={m.id} className="px-5 py-3 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-ink-700 border border-ink-600 flex items-center justify-center text-xs font-medium text-ink-300">
                  {m.user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-ink-200">{m.user?.name}</p>
                  <p className="text-xs text-ink-600">{m.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  m.user?.role === 'admin'
                    ? 'bg-glow/10 text-glow border-glow/20'
                    : 'bg-ink-800 text-ink-400 border-ink-700'
                }`}>
                  {m.user?.role}
                </span>
                {isAdmin && m.user_id !== project.created_by && (
                  <button
                    onClick={() => handleRemoveMember(m.user_id)}
                    className="p-1.5 text-ink-600 hover:text-red-400 hover:bg-red-900/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="card">
        <div className="px-5 py-4 border-b border-ink-800 flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink-200 flex items-center gap-2">
            <CheckSquare size={14} className="text-glow" />
            Tasks
            <span className="text-xs bg-ink-800 text-ink-400 px-2 py-0.5 rounded-full">{tasks.length}</span>
          </h2>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No tasks yet"
            description={isAdmin ? 'Add the first task for this project.' : 'No tasks have been created for this project.'}
            action={isAdmin && (
              <button onClick={() => setShowCreateTask(true)} className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={14} /> Add Task
              </button>
            )}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-800">
                  {['Task', 'Status', 'Priority', 'Due Date', 'Assignee', ...(isAdmin ? [''] : [])].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-ink-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal open={showAddMember} onClose={() => setShowAddMember(false)} title="Add Team Member">
        <AddMemberForm
          projectId={id}
          existingMemberIds={memberIds}
          onSuccess={() => { setShowAddMember(false); loadProject() }}
          onCancel={() => setShowAddMember(false)}
        />
      </Modal>

      <Modal open={showCreateTask} onClose={() => setShowCreateTask(false)} title="New Task" width="max-w-lg">
        <TaskForm
          projectId={Number(id)}
          onSuccess={() => { setShowCreateTask(false); loadTasks() }}
          onCancel={() => setShowCreateTask(false)}
        />
      </Modal>

      <Modal open={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task" width="max-w-lg">
        <TaskForm
          task={editingTask}
          onSuccess={() => { setEditingTask(null); loadTasks() }}
          onCancel={() => setEditingTask(null)}
        />
      </Modal>
    </div>
  )
}
