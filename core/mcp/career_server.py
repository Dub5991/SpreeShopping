#!/usr/bin/env python3
"""
Career MCP Server - Career Development and Opportunities
Manages professional development, job opportunities, skills, and career goals
"""

import json
import sqlite3
from datetime import datetime
from typing import Dict, List, Optional


class CareerServer:
    """MCP Server for managing career development and opportunities"""
    
    def __init__(self, db_path: str = "career.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the career database schema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Skills table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                category TEXT NOT NULL,
                proficiency INTEGER DEFAULT 1,
                years_experience REAL DEFAULT 0,
                last_used TEXT,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Certifications table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS certifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                issuing_organization TEXT,
                issue_date TEXT,
                expiration_date TEXT,
                credential_id TEXT,
                credential_url TEXT,
                status TEXT DEFAULT 'active',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Learning goals table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS learning_goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                goal TEXT NOT NULL,
                category TEXT,
                priority TEXT DEFAULT 'medium',
                status TEXT DEFAULT 'in_progress',
                target_date TEXT,
                completed_date TEXT,
                resources TEXT,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Job opportunities table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS opportunities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                company TEXT,
                description TEXT,
                rate_min REAL,
                rate_max REAL,
                rate_type TEXT DEFAULT 'hourly',
                location TEXT,
                remote BOOLEAN DEFAULT 0,
                contract_type TEXT,
                status TEXT DEFAULT 'interested',
                source TEXT,
                contact_name TEXT,
                contact_email TEXT,
                url TEXT,
                applied_date TEXT,
                interview_date TEXT,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Professional network table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS network_contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                company TEXT,
                title TEXT,
                email TEXT,
                phone TEXT,
                linkedin_url TEXT,
                relationship TEXT,
                how_met TEXT,
                last_contact TEXT,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Career milestones table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS milestones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                date TEXT NOT NULL,
                category TEXT,
                impact TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Professional development activities
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS professional_development (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                activity_type TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                date TEXT NOT NULL,
                hours REAL,
                cost REAL DEFAULT 0,
                provider TEXT,
                certificate_earned BOOLEAN DEFAULT 0,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        conn.close()
    
    def add_skill(self, name: str, category: str, proficiency: int = 1,
                 years_experience: float = 0) -> Dict:
        """Add a skill to the profile"""
        if proficiency < 1 or proficiency > 5:
            return {"error": "Proficiency must be between 1 and 5"}
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO skills (name, category, proficiency, years_experience)
                VALUES (?, ?, ?, ?)
            """, (name, category, proficiency, years_experience))
            
            skill_id = cursor.lastrowid
            conn.commit()
            
            return {
                "id": skill_id,
                "name": name,
                "category": category,
                "proficiency": proficiency,
                "message": "Skill added successfully"
            }
        except sqlite3.IntegrityError:
            return {"error": "Skill already exists"}
        finally:
            conn.close()
    
    def update_skill_proficiency(self, skill_id: int, proficiency: int) -> Dict:
        """Update skill proficiency level (1-5)"""
        if proficiency < 1 or proficiency > 5:
            return {"error": "Proficiency must be between 1 and 5"}
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE skills 
            SET proficiency = ?, updated_at = ?
            WHERE id = ?
        """, (proficiency, datetime.now().isoformat(), skill_id))
        
        conn.commit()
        conn.close()
        
        return {
            "skill_id": skill_id,
            "proficiency": proficiency,
            "message": "Skill proficiency updated successfully"
        }
    
    def add_certification(self, name: str, issuing_organization: str,
                         issue_date: str = "", expiration_date: str = "",
                         credential_url: str = "") -> Dict:
        """Add a professional certification"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO certifications 
            (name, issuing_organization, issue_date, expiration_date, credential_url)
            VALUES (?, ?, ?, ?, ?)
        """, (name, issuing_organization, issue_date, expiration_date, credential_url))
        
        cert_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": cert_id,
            "name": name,
            "issuing_organization": issuing_organization,
            "message": "Certification added successfully"
        }
    
    def add_learning_goal(self, goal: str, category: str = "", priority: str = "medium",
                         target_date: str = "", resources: str = "") -> Dict:
        """Add a learning goal"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO learning_goals (goal, category, priority, target_date, resources)
            VALUES (?, ?, ?, ?, ?)
        """, (goal, category, priority, target_date, resources))
        
        goal_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": goal_id,
            "goal": goal,
            "priority": priority,
            "message": "Learning goal added successfully"
        }
    
    def complete_learning_goal(self, goal_id: int, notes: str = "") -> Dict:
        """Mark a learning goal as completed"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().date().isoformat()
        
        cursor.execute("""
            UPDATE learning_goals 
            SET status = 'completed', completed_date = ?, notes = ?, updated_at = ?
            WHERE id = ?
        """, (today, notes, datetime.now().isoformat(), goal_id))
        
        conn.commit()
        conn.close()
        
        return {
            "goal_id": goal_id,
            "status": "completed",
            "message": "Learning goal completed successfully"
        }
    
    def add_opportunity(self, title: str, company: str = "", description: str = "",
                       rate_min: float = 0, rate_max: float = 0, remote: bool = False) -> Dict:
        """Add a job opportunity"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO opportunities 
            (title, company, description, rate_min, rate_max, remote)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (title, company, description, rate_min, rate_max, remote))
        
        opp_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": opp_id,
            "title": title,
            "company": company,
            "status": "interested",
            "message": "Opportunity added successfully"
        }
    
    def update_opportunity_status(self, opportunity_id: int, status: str,
                                  notes: str = "") -> Dict:
        """Update opportunity status (interested, applied, interviewing, offered, accepted, declined)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE opportunities 
            SET status = ?, notes = ?, updated_at = ?
            WHERE id = ?
        """, (status, notes, datetime.now().isoformat(), opportunity_id))
        
        conn.commit()
        conn.close()
        
        return {
            "opportunity_id": opportunity_id,
            "status": status,
            "message": "Opportunity status updated successfully"
        }
    
    def add_network_contact(self, name: str, company: str = "", title: str = "",
                           email: str = "", relationship: str = "") -> Dict:
        """Add a professional network contact"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO network_contacts (name, company, title, email, relationship)
            VALUES (?, ?, ?, ?, ?)
        """, (name, company, title, email, relationship))
        
        contact_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": contact_id,
            "name": name,
            "message": "Network contact added successfully"
        }
    
    def log_contact_interaction(self, contact_id: int) -> Dict:
        """Log that you contacted someone in your network"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().date().isoformat()
        
        cursor.execute("""
            UPDATE network_contacts 
            SET last_contact = ?, updated_at = ?
            WHERE id = ?
        """, (today, datetime.now().isoformat(), contact_id))
        
        conn.commit()
        conn.close()
        
        return {
            "contact_id": contact_id,
            "last_contact": today,
            "message": "Contact interaction logged successfully"
        }
    
    def add_milestone(self, title: str, date: str, category: str = "",
                     description: str = "", impact: str = "") -> Dict:
        """Add a career milestone"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO milestones (title, description, date, category, impact)
            VALUES (?, ?, ?, ?, ?)
        """, (title, description, date, category, impact))
        
        milestone_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": milestone_id,
            "title": title,
            "date": date,
            "message": "Milestone added successfully"
        }
    
    def log_professional_development(self, activity_type: str, title: str,
                                    date: str, hours: float = 0, cost: float = 0) -> Dict:
        """Log a professional development activity"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO professional_development (activity_type, title, date, hours, cost)
            VALUES (?, ?, ?, ?, ?)
        """, (activity_type, title, date, hours, cost))
        
        activity_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": activity_id,
            "activity_type": activity_type,
            "title": title,
            "message": "Professional development activity logged successfully"
        }
    
    def get_skills_summary(self) -> Dict:
        """Get summary of skills by category"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT category, COUNT(*) as skill_count, AVG(proficiency) as avg_proficiency
            FROM skills
            GROUP BY category
            ORDER BY category
        """)
        
        categories = [dict(row) for row in cursor.fetchall()]
        
        cursor.execute("SELECT COUNT(*) as total FROM skills")
        total = cursor.fetchone()['total']
        
        conn.close()
        
        return {
            "total_skills": total,
            "categories": categories
        }
    
    def get_active_opportunities(self) -> List[Dict]:
        """Get active job opportunities"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM opportunities 
            WHERE status IN ('interested', 'applied', 'interviewing')
            ORDER BY created_at DESC
        """)
        
        opportunities = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return opportunities
    
    def get_career_dashboard(self) -> Dict:
        """Get comprehensive career dashboard"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Skills count
        cursor.execute("SELECT COUNT(*) as count FROM skills")
        skills_count = cursor.fetchone()['count']
        
        # Active learning goals
        cursor.execute("""
            SELECT COUNT(*) as count FROM learning_goals WHERE status = 'in_progress'
        """)
        active_goals = cursor.fetchone()['count']
        
        # Active opportunities
        cursor.execute("""
            SELECT COUNT(*) as count FROM opportunities 
            WHERE status IN ('interested', 'applied', 'interviewing')
        """)
        active_opps = cursor.fetchone()['count']
        
        # Network size
        cursor.execute("SELECT COUNT(*) as count FROM network_contacts")
        network_size = cursor.fetchone()['count']
        
        # Recent milestones
        cursor.execute("""
            SELECT * FROM milestones 
            ORDER BY date DESC 
            LIMIT 5
        """)
        recent_milestones = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            "skills_count": skills_count,
            "active_learning_goals": active_goals,
            "active_opportunities": active_opps,
            "network_size": network_size,
            "recent_milestones": recent_milestones
        }


def main():
    """Main function for CLI testing"""
    server = CareerServer()
    print("Career MCP Server initialized")
    
    # Add skills
    skills = [
        ("Python", "Programming", 5, 8),
        ("React", "Frontend", 4, 5),
        ("AWS", "Cloud", 3, 3),
    ]
    
    for name, category, proficiency, years in skills:
        skill = server.add_skill(name, category, proficiency, years)
        print(f"Added skill: {skill}")
    
    # Add opportunity
    opp = server.add_opportunity(
        title="Senior Full Stack Developer",
        company="Tech Startup Inc",
        description="Build scalable web applications",
        rate_min=150,
        rate_max=200,
        remote=True
    )
    print(f"Added opportunity: {opp}")
    
    # Get dashboard
    dashboard = server.get_career_dashboard()
    print(f"Career dashboard: {json.dumps(dashboard, indent=2)}")


if __name__ == "__main__":
    main()
