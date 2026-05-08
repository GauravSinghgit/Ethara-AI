from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.auth import UserOut


class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None


class ProjectMemberAdd(BaseModel):
    user_id: int


class ProjectMemberOut(BaseModel):
    id: int
    user_id: int
    user: UserOut

    class Config:
        from_attributes = True


class ProjectOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    created_by: int
    created_at: datetime
    creator: UserOut
    members: List[ProjectMemberOut] = []

    class Config:
        from_attributes = True


class ProjectList(BaseModel):
    id: int
    title: str
    description: Optional[str]
    created_by: int
    created_at: datetime
    creator: UserOut
    member_count: int = 0

    class Config:
        from_attributes = True
