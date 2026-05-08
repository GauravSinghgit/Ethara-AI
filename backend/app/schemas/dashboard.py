from pydantic import BaseModel
from typing import List
from app.schemas.task import TaskOut


class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
    my_tasks: int
    recent_tasks: List[TaskOut] = []
    overdue_task_list: List[TaskOut] = []
