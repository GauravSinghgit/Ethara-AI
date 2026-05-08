from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models.user import User, UserRole
from app.models.task import Task, TaskStatus
from app.models.project import ProjectMember
from app.schemas.dashboard import DashboardStats
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardStats)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()

    if current_user.role == UserRole.admin:
        base_query = db.query(Task)
    else:
        memberships = db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()
        project_ids = [m.project_id for m in memberships]
        base_query = db.query(Task).filter(Task.project_id.in_(project_ids))

    all_tasks = base_query.all()
    total = len(all_tasks)
    completed = sum(1 for t in all_tasks if t.status == TaskStatus.done)
    pending = sum(1 for t in all_tasks if t.status != TaskStatus.done)
    overdue = sum(1 for t in all_tasks if t.due_date and t.due_date < today and t.status != TaskStatus.done)
    my_tasks = sum(1 for t in all_tasks if t.assigned_to == current_user.id)

    recent = base_query.order_by(Task.created_at.desc()).limit(5).all()
    overdue_list = base_query.filter(
        Task.due_date < today,
        Task.status != TaskStatus.done
    ).limit(5).all()

    return DashboardStats(
        total_tasks=total,
        completed_tasks=completed,
        pending_tasks=pending,
        overdue_tasks=overdue,
        my_tasks=my_tasks,
        recent_tasks=recent,
        overdue_task_list=overdue_list,
    )
