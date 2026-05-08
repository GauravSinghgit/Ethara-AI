from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from app.models.task import TaskStatus, TaskPriority
from app.schemas.auth import UserOut


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.todo
    priority: TaskPriority = TaskPriority.medium
    due_date: Optional[date] = None
    assigned_to: Optional[int] = None
    project_id: int


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[date] = None
    assigned_to: Optional[int] = None


class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: TaskStatus
    priority: TaskPriority
    due_date: Optional[date]
    assigned_to: Optional[int]
    project_id: int
    created_by: int
    created_at: datetime
    assignee: Optional[UserOut] = None
    creator: UserOut

    class Config:
        from_attributes = True
