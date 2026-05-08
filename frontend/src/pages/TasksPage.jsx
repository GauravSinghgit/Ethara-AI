import { useState, useEffect, useMemo } from 'react'
import { CheckSquare, Plus, Filter } from 'lucide-react'
import { tasksAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import TaskForm from '../components/TaskForm'
import TaskRow from '../components/TaskRow'
import toast from 'react-hot-toast'

const STATUSES = ['All', 'Todo', 'In Progress', 'Done']
const PRIORITIES = ['All', 'High', 'Medium', 'Low']

export default function TasksPage() {
  const { isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    tasksAPI.list()
      .then(r => setTasks(r.data))
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filterStatus !== 'All' && t.status !== filterStatus) return false
      if (filterPriority !== 'All' && t.priority !== filterPriority) return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [tasks, filterStatus, filterPriority, search])

  const handleDelete = async (id) => {
    if (!confirm('Delete this task permanently?')) return
    try {
      await tasksAPI.delete(id)
      toast.success('Task deleted')
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete task')
    }
  }

  const handleStatusChange = async (id, data) => {
    try {
      await tasksAPI.update(id, data)
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed')
    }
  }

  // Stats
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'Done').length
  const inProgress = tasks.filter(t => t.status === 'In Progress').length
  const todo = tasks.filter(t => t.status === 'Todo').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink-50">Tasks</h1>
          <p className="text-sm text-ink-500 mt-1">{total} total · {done} done · {inProgress} in progress · {todo} to do</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> New Task
          </button>
        )}
      </div>

      {/* Mini stat pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'All', count: total, active: filterStatus === 'All', onClick: () => setFilterStatus('All') },
          { label: 'Todo', count: todo, active: filterStatus === 'Todo', onClick: () => setFilterStatus('Todo') },
          { label: 'In Progress', count: inProgress, active: filterStatus === 'In Progress', onClick: () => setFilterStatus('In Progress') },
          { label: 'Done', count: done, active: filterStatus === 'Done', onClick: () => setFilterStatus('Done') },
        ].map(({ label, count, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              active
                ? 'bg-glow/10 text-glow border-glow/20'
                : 'bg-ink-900 text-ink-500 border-ink-800 hover:border-ink-600 hover:text-ink-300'
            }`}
          >
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-glow/20' : 'bg-ink-800'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          className="input max-w-xs text-sm py-2"
          placeholder="Search tasks…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="input w-auto text-sm py-2"
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
        >
          {PRIORITIES.map(p => <option key={p}>{p === 'All' ? 'All priorities' : p}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
          description={tasks.length === 0
            ? isAdmin ? 'Create your first task to get started.' : 'No tasks have been assigned to your projects.'
            : 'Try adjusting your search or filters.'}
          action={isAdmin && tasks.length === 0 && (
            <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={14} /> New Task
            </button>
          )}
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-800">
                {['Task', 'Status', 'Priority', 'Due Date', 'Assignee', ...(isAdmin ? ['Actions'] : [])].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-ink-800/50 text-xs text-ink-600">
            Showing {filtered.length} of {total} tasks
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Task" width="max-w-lg">
        <TaskForm
          onSuccess={() => { setShowCreate(false); load() }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>

      <Modal open={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task" width="max-w-lg">
        <TaskForm
          task={editingTask}
          onSuccess={() => { setEditingTask(null); load() }}
          onCancel={() => setEditingTask(null)}
        />
      </Modal>
    </div>
  )
}
