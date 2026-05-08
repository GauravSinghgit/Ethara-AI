import { Pencil, Trash2, AlertCircle } from 'lucide-react'
import { StatusBadge, PriorityBadge } from './TaskBadges'
import { formatDate, isOverdue } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

export default function TaskRow({ task, onEdit, onDelete, onStatusChange }) {
  const { isAdmin, user } = useAuth()
  const overdue = isOverdue(task.due_date, task.status)
  const canEdit = isAdmin
  const canChangeStatus = isAdmin || task.assigned_to === user?.id

  return (
    <tr className="border-b border-ink-800/50 hover:bg-ink-800/20 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-start gap-2">
          {overdue && <AlertCircle size={13} className="text-red-400 mt-0.5 shrink-0" />}
          <div>
            <p className="text-sm font-medium text-ink-200">{task.title}</p>
            {task.description && <p className="text-xs text-ink-600 truncate max-w-xs mt-0.5">{task.description}</p>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {canChangeStatus ? (
          <select
            className="text-xs bg-transparent border-none outline-none cursor-pointer"
            value={task.status}
            onChange={e => onStatusChange(task.id, { status: e.target.value })}
          >
            {['Todo', 'In Progress', 'Done'].map(s => (
              <option key={s} value={s} className="bg-ink-900">{s}</option>
            ))}
          </select>
        ) : (
          <StatusBadge status={task.status} />
        )}
      </td>
      <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
      <td className="px-4 py-3">
        <span className={`text-xs ${overdue ? 'text-red-400' : 'text-ink-500'}`}>
          {formatDate(task.due_date)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-ink-500">{task.assignee?.name || '—'}</span>
      </td>
      {canEdit && (
        <td className="px-4 py-3">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(task)} className="p-1.5 text-ink-500 hover:text-glow hover:bg-glow/10 rounded-md transition-colors">
              <Pencil size={13} />
            </button>
            <button onClick={() => onDelete(task.id)} className="p-1.5 text-ink-500 hover:text-red-400 hover:bg-red-900/10 rounded-md transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
        </td>
      )}
    </tr>
  )
}
