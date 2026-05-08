import { statusBadge, priorityBadge } from '../utils/helpers'

export function StatusBadge({ status }) {
  return <span className={statusBadge(status)}>{status}</span>
}

export function PriorityBadge({ priority }) {
  return <span className={priorityBadge(priority)}>{priority}</span>
}
