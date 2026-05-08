import { useState, useEffect } from 'react'
import { tasksAPI, projectsAPI, usersAPI } from '../services/api'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/helpers'

const STATUSES = ['Todo', 'In Progress', 'Done']
const PRIORITIES = ['Low', 'Medium', 'High']

export default function TaskForm({ task, projectId, onSuccess, onCancel }) {
  const isEdit = !!task
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Todo',
    priority: task?.priority || 'Medium',
    due_date: task?.due_date || '',
    assigned_to: task?.assigned_to || '',
    project_id: task?.project_id || projectId || '',
  })
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isEdit) projectsAPI.list().then(r => setProjects(r.data)).catch(() => {})
    usersAPI.list().then(r => setUsers(r.data)).catch(() => {})
  }, [isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
        project_id: Number(form.project_id),
        due_date: form.due_date || null,
      }
      if (isEdit) {
        await tasksAPI.update(task.id, payload)
        toast.success('Task updated')
      } else {
        await tasksAPI.create(payload)
        toast.success('Task created')
      }
      onSuccess()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Task title" required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Priority</label>
          <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      {!isEdit && (
        <div>
          <label className="label">Project *</label>
          <select className="input" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} required>
            <option value="">Select project…</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Assign To</label>
          <select className="input" value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })}>
            <option value="">Unassigned</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Due Date</label>
          <input type="date" className="input" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving…' : isEdit ? 'Update Task' : 'Create Task'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
      </div>
    </form>
  )
}
