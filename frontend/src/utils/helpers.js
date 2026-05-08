import { format, isPast, parseISO } from 'date-fns'

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try { return format(parseISO(dateStr), 'MMM d, yyyy') } catch { return dateStr }
}

export const isOverdue = (dateStr, status) => {
  if (!dateStr || status === 'Done') return false
  try { return isPast(parseISO(dateStr)) } catch { return false }
}

export const statusBadge = (status) => {
  const map = {
    'Todo': 'badge-todo',
    'In Progress': 'badge-progress',
    'Done': 'badge-done',
  }
  return map[status] || 'badge-todo'
}

export const priorityBadge = (priority) => {
  const map = { Low: 'priority-low', Medium: 'priority-medium', High: 'priority-high' }
  return map[priority] || 'priority-low'
}

export const getErrorMessage = (err) =>
  err?.response?.data?.detail || err?.message || 'Something went wrong'
