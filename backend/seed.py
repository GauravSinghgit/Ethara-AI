"""
Seed script — creates demo users, a sample project, and tasks.
Run with: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, create_tables
from app.models.user import User, UserRole
from app.models.project import Project, ProjectMember
from app.models.task import Task, TaskStatus, TaskPriority
from app.auth.jwt import hash_password
from datetime import date, timedelta


def seed():
    create_tables()
    db = SessionLocal()

    try:
        # Clear existing data
        db.query(Task).delete()
        db.query(ProjectMember).delete()
        db.query(Project).delete()
        db.query(User).delete()
        db.commit()

        # Create users
        admin = User(
            name="Admin User",
            email="admin@test.com",
            password_hash=hash_password("password123"),
            role=UserRole.admin,
        )
        member = User(
            name="Jane Member",
            email="member@test.com",
            password_hash=hash_password("password123"),
            role=UserRole.member,
        )
        db.add_all([admin, member])
        db.commit()
        db.refresh(admin)
        db.refresh(member)

        # Create project
        project = Project(
            title="Alpha Launch",
            description="Ship the v1 product to production",
            created_by=admin.id,
        )
        db.add(project)
        db.commit()
        db.refresh(project)

        # Add members
        db.add_all([
            ProjectMember(project_id=project.id, user_id=admin.id),
            ProjectMember(project_id=project.id, user_id=member.id),
        ])

        # Create tasks
        today = date.today()
        tasks = [
            Task(title="Setup CI/CD pipeline", description="Configure GitHub Actions for auto-deploy", status=TaskStatus.done, priority=TaskPriority.high, due_date=today - timedelta(days=3), assigned_to=admin.id, project_id=project.id, created_by=admin.id),
            Task(title="Design system components", description="Build reusable UI component library", status=TaskStatus.in_progress, priority=TaskPriority.high, due_date=today + timedelta(days=2), assigned_to=member.id, project_id=project.id, created_by=admin.id),
            Task(title="Write API documentation", description="Document all REST endpoints", status=TaskStatus.todo, priority=TaskPriority.medium, due_date=today + timedelta(days=5), assigned_to=member.id, project_id=project.id, created_by=admin.id),
            Task(title="Security audit", description="Review auth flows and pen test", status=TaskStatus.todo, priority=TaskPriority.high, due_date=today - timedelta(days=1), assigned_to=admin.id, project_id=project.id, created_by=admin.id),
            Task(title="Performance testing", description="Load test all critical endpoints", status=TaskStatus.todo, priority=TaskPriority.low, due_date=today + timedelta(days=10), assigned_to=None, project_id=project.id, created_by=admin.id),
        ]
        db.add_all(tasks)
        db.commit()

        print("✅ Seed complete!")
        print("   Admin:  admin@test.com / password123")
        print("   Member: member@test.com / password123")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
