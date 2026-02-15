#!/usr/bin/env python3
"""
Work MCP Server - Project and Task Management
Manages freelance projects, tasks, milestones, and time tracking
"""

import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from pathlib import Path


class WorkServer:
    """MCP Server for managing freelance work, projects, and tasks"""
    
    def __init__(self, db_path: str = "work.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the work database schema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Projects table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                client_id INTEGER,
                description TEXT,
                status TEXT DEFAULT 'active',
                start_date TEXT,
                end_date TEXT,
                budget REAL,
                hourly_rate REAL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Tasks table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'todo',
                priority TEXT DEFAULT 'medium',
                estimated_hours REAL,
                actual_hours REAL DEFAULT 0,
                due_date TEXT,
                completed_at TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id)
            )
        """)
        
        # Time entries table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS time_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                task_id INTEGER,
                description TEXT,
                hours REAL NOT NULL,
                date TEXT NOT NULL,
                billable BOOLEAN DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id),
                FOREIGN KEY (task_id) REFERENCES tasks(id)
            )
        """)
        
        # Milestones table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS milestones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                due_date TEXT,
                completed BOOLEAN DEFAULT 0,
                completed_at TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id)
            )
        """)
        
        conn.commit()
        conn.close()
    
    def create_project(self, name: str, client_id: int, description: str = "", 
                      budget: float = 0, hourly_rate: float = 0) -> Dict:
        """Create a new project"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO projects (name, client_id, description, budget, hourly_rate, start_date)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (name, client_id, description, budget, hourly_rate, datetime.now().isoformat()))
        
        project_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": project_id,
            "name": name,
            "client_id": client_id,
            "status": "active",
            "message": "Project created successfully"
        }
    
    def create_task(self, project_id: int, title: str, description: str = "",
                   priority: str = "medium", estimated_hours: float = 0) -> Dict:
        """Create a new task for a project"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO tasks (project_id, title, description, priority, estimated_hours)
            VALUES (?, ?, ?, ?, ?)
        """, (project_id, title, description, priority, estimated_hours))
        
        task_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": task_id,
            "project_id": project_id,
            "title": title,
            "status": "todo",
            "message": "Task created successfully"
        }
    
    def log_time(self, project_id: int, hours: float, description: str = "",
                task_id: Optional[int] = None, billable: bool = True) -> Dict:
        """Log time worked on a project or task"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().date().isoformat()
        
        cursor.execute("""
            INSERT INTO time_entries (project_id, task_id, description, hours, date, billable)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (project_id, task_id, description, hours, today, billable))
        
        entry_id = cursor.lastrowid
        
        # Update task actual hours if task_id provided
        if task_id:
            cursor.execute("""
                UPDATE tasks 
                SET actual_hours = actual_hours + ?
                WHERE id = ?
            """, (hours, task_id))
        
        conn.commit()
        conn.close()
        
        return {
            "id": entry_id,
            "hours": hours,
            "date": today,
            "message": "Time logged successfully"
        }
    
    def get_project_status(self, project_id: int) -> Dict:
        """Get comprehensive project status and metrics"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get project info
        cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
        project = dict(cursor.fetchone())
        
        # Get task statistics
        cursor.execute("""
            SELECT 
                COUNT(*) as total_tasks,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
                SUM(estimated_hours) as total_estimated_hours,
                SUM(actual_hours) as total_actual_hours
            FROM tasks WHERE project_id = ?
        """, (project_id,))
        task_stats = dict(cursor.fetchone())
        
        # Get total billable hours
        cursor.execute("""
            SELECT SUM(hours) as total_billable_hours
            FROM time_entries 
            WHERE project_id = ? AND billable = 1
        """, (project_id,))
        time_stats = dict(cursor.fetchone())
        
        conn.close()
        
        return {
            "project": project,
            "tasks": task_stats,
            "time": time_stats,
            "completion_percentage": (task_stats['completed_tasks'] / task_stats['total_tasks'] * 100) 
                                     if task_stats['total_tasks'] > 0 else 0
        }
    
    def get_weekly_summary(self) -> Dict:
        """Get summary of work for the current week"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Calculate week start (Monday)
        today = datetime.now().date()
        week_start = today - timedelta(days=today.weekday())
        
        cursor.execute("""
            SELECT 
                p.name as project_name,
                SUM(te.hours) as total_hours,
                SUM(CASE WHEN te.billable = 1 THEN te.hours ELSE 0 END) as billable_hours
            FROM time_entries te
            JOIN projects p ON te.project_id = p.id
            WHERE te.date >= ?
            GROUP BY p.id
        """, (week_start.isoformat(),))
        
        projects = [dict(row) for row in cursor.fetchall()]
        
        total_hours = sum(p['total_hours'] for p in projects)
        total_billable = sum(p['billable_hours'] for p in projects)
        
        conn.close()
        
        return {
            "week_start": week_start.isoformat(),
            "total_hours": total_hours,
            "billable_hours": total_billable,
            "projects": projects
        }
    
    def update_task_status(self, task_id: int, status: str) -> Dict:
        """Update task status (todo, in_progress, completed, blocked)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        completed_at = datetime.now().isoformat() if status == 'completed' else None
        
        cursor.execute("""
            UPDATE tasks 
            SET status = ?, completed_at = ?, updated_at = ?
            WHERE id = ?
        """, (status, completed_at, datetime.now().isoformat(), task_id))
        
        conn.commit()
        conn.close()
        
        return {
            "task_id": task_id,
            "status": status,
            "message": "Task status updated successfully"
        }


def main():
    """Main function for CLI testing"""
    server = WorkServer()
    print("Work MCP Server initialized")
    
    # Example usage
    project = server.create_project(
        name="Website Redesign",
        client_id=1,
        description="Complete website redesign for client",
        budget=10000,
        hourly_rate=100
    )
    print(f"Created project: {project}")
    
    task = server.create_task(
        project_id=project['id'],
        title="Design homepage mockup",
        priority="high",
        estimated_hours=8
    )
    print(f"Created task: {task}")
    
    time_entry = server.log_time(
        project_id=project['id'],
        task_id=task['id'],
        hours=4,
        description="Initial homepage design work"
    )
    print(f"Logged time: {time_entry}")
    
    status = server.get_project_status(project['id'])
    print(f"Project status: {json.dumps(status, indent=2)}")


if __name__ == "__main__":
    main()
