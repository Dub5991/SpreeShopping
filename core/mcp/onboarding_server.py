#!/usr/bin/env python3
"""
Onboarding MCP Server - Client Onboarding Workflows
Manages client onboarding process, checklists, and documentation
"""

import json
import sqlite3
from datetime import datetime
from typing import Dict, List, Optional


class OnboardingServer:
    """MCP Server for managing client onboarding workflows"""
    
    def __init__(self, db_path: str = "onboarding.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the onboarding database schema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Onboarding sessions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS onboarding_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL,
                project_id INTEGER,
                status TEXT DEFAULT 'in_progress',
                start_date TEXT NOT NULL,
                completion_date TEXT,
                assigned_to TEXT,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Onboarding checklist templates
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS checklist_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                category TEXT DEFAULT 'general',
                is_active BOOLEAN DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Checklist items for templates
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS template_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                template_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                order_index INTEGER DEFAULT 0,
                required BOOLEAN DEFAULT 1,
                estimated_time INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (template_id) REFERENCES checklist_templates(id)
            )
        """)
        
        # Onboarding checklist items
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS checklist_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'pending',
                assigned_to TEXT,
                completed_by TEXT,
                completed_at TEXT,
                notes TEXT,
                order_index INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES onboarding_sessions(id)
            )
        """)
        
        # Onboarding documents
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS onboarding_documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER NOT NULL,
                document_type TEXT NOT NULL,
                title TEXT NOT NULL,
                file_path TEXT,
                status TEXT DEFAULT 'pending',
                uploaded_at TEXT,
                signed_at TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES onboarding_sessions(id)
            )
        """)
        
        # Client questionnaire responses
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS questionnaire_responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER NOT NULL,
                question TEXT NOT NULL,
                answer TEXT,
                category TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES onboarding_sessions(id)
            )
        """)
        
        conn.commit()
        conn.close()
    
    def create_checklist_template(self, name: str, description: str = "",
                                 category: str = "general") -> Dict:
        """Create a reusable onboarding checklist template"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO checklist_templates (name, description, category)
            VALUES (?, ?, ?)
        """, (name, description, category))
        
        template_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": template_id,
            "name": name,
            "category": category,
            "message": "Checklist template created successfully"
        }
    
    def add_template_item(self, template_id: int, title: str, description: str = "",
                         order_index: int = 0, required: bool = True) -> Dict:
        """Add an item to a checklist template"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO template_items (template_id, title, description, order_index, required)
            VALUES (?, ?, ?, ?, ?)
        """, (template_id, title, description, order_index, required))
        
        item_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": item_id,
            "template_id": template_id,
            "title": title,
            "message": "Template item added successfully"
        }
    
    def start_onboarding(self, client_id: int, project_id: Optional[int] = None,
                        template_id: Optional[int] = None, assigned_to: str = "") -> Dict:
        """Start a new onboarding session for a client"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().date().isoformat()
        
        cursor.execute("""
            INSERT INTO onboarding_sessions (client_id, project_id, start_date, assigned_to)
            VALUES (?, ?, ?, ?)
        """, (client_id, project_id, today, assigned_to))
        
        session_id = cursor.lastrowid
        
        # If template provided, copy items to this session
        if template_id:
            cursor.execute("""
                INSERT INTO checklist_items (session_id, title, description, order_index)
                SELECT ?, title, description, order_index
                FROM template_items
                WHERE template_id = ?
                ORDER BY order_index
            """, (session_id, template_id))
        
        conn.commit()
        conn.close()
        
        return {
            "id": session_id,
            "client_id": client_id,
            "status": "in_progress",
            "start_date": today,
            "message": "Onboarding session started successfully"
        }
    
    def add_checklist_item(self, session_id: int, title: str, description: str = "",
                          assigned_to: str = "", order_index: int = 0) -> Dict:
        """Add a checklist item to an onboarding session"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO checklist_items (session_id, title, description, assigned_to, order_index)
            VALUES (?, ?, ?, ?, ?)
        """, (session_id, title, description, assigned_to, order_index))
        
        item_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": item_id,
            "session_id": session_id,
            "title": title,
            "message": "Checklist item added successfully"
        }
    
    def complete_checklist_item(self, item_id: int, completed_by: str = "",
                               notes: str = "") -> Dict:
        """Mark a checklist item as completed"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().isoformat()
        
        cursor.execute("""
            UPDATE checklist_items 
            SET status = 'completed', completed_by = ?, completed_at = ?, notes = ?
            WHERE id = ?
        """, (completed_by, today, notes, item_id))
        
        conn.commit()
        conn.close()
        
        return {
            "item_id": item_id,
            "status": "completed",
            "message": "Checklist item completed successfully"
        }
    
    def add_document(self, session_id: int, document_type: str, title: str,
                    file_path: str = "") -> Dict:
        """Add a required document to onboarding"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO onboarding_documents (session_id, document_type, title, file_path)
            VALUES (?, ?, ?, ?)
        """, (session_id, document_type, title, file_path))
        
        doc_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": doc_id,
            "session_id": session_id,
            "title": title,
            "message": "Document added successfully"
        }
    
    def mark_document_signed(self, document_id: int) -> Dict:
        """Mark a document as signed"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().isoformat()
        
        cursor.execute("""
            UPDATE onboarding_documents 
            SET status = 'signed', signed_at = ?
            WHERE id = ?
        """, (today, document_id))
        
        conn.commit()
        conn.close()
        
        return {
            "document_id": document_id,
            "status": "signed",
            "message": "Document marked as signed"
        }
    
    def add_questionnaire_response(self, session_id: int, question: str,
                                  answer: str, category: str = "") -> Dict:
        """Add a questionnaire response"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO questionnaire_responses (session_id, question, answer, category)
            VALUES (?, ?, ?, ?)
        """, (session_id, question, answer, category))
        
        response_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": response_id,
            "session_id": session_id,
            "message": "Response recorded successfully"
        }
    
    def get_onboarding_status(self, session_id: int) -> Dict:
        """Get comprehensive onboarding status"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get session info
        cursor.execute("SELECT * FROM onboarding_sessions WHERE id = ?", (session_id,))
        session_row = cursor.fetchone()
        if not session_row:
            conn.close()
            return {"error": "Onboarding session not found"}
        
        session = dict(session_row)
        
        # Get checklist statistics
        cursor.execute("""
            SELECT 
                COUNT(*) as total_items,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_items
            FROM checklist_items WHERE session_id = ?
        """, (session_id,))
        checklist_stats = dict(cursor.fetchone())
        
        # Get pending items
        cursor.execute("""
            SELECT * FROM checklist_items 
            WHERE session_id = ? AND status = 'pending'
            ORDER BY order_index
        """, (session_id,))
        pending_items = [dict(row) for row in cursor.fetchall()]
        
        # Get document status
        cursor.execute("""
            SELECT 
                COUNT(*) as total_docs,
                SUM(CASE WHEN status = 'signed' THEN 1 ELSE 0 END) as signed_docs
            FROM onboarding_documents WHERE session_id = ?
        """, (session_id,))
        doc_stats = dict(cursor.fetchone())
        
        conn.close()
        
        completion_pct = (checklist_stats['completed_items'] / checklist_stats['total_items'] * 100) \
                        if checklist_stats['total_items'] > 0 else 0
        
        return {
            "session": session,
            "checklist": checklist_stats,
            "documents": doc_stats,
            "pending_items": pending_items,
            "completion_percentage": completion_pct
        }
    
    def complete_onboarding(self, session_id: int, notes: str = "") -> Dict:
        """Mark onboarding session as completed"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().date().isoformat()
        
        cursor.execute("""
            UPDATE onboarding_sessions 
            SET status = 'completed', completion_date = ?, notes = ?, updated_at = ?
            WHERE id = ?
        """, (today, notes, datetime.now().isoformat(), session_id))
        
        conn.commit()
        conn.close()
        
        return {
            "session_id": session_id,
            "status": "completed",
            "completion_date": today,
            "message": "Onboarding completed successfully"
        }
    
    def get_active_onboardings(self) -> List[Dict]:
        """Get all active onboarding sessions"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM onboarding_sessions 
            WHERE status = 'in_progress'
            ORDER BY start_date DESC
        """)
        
        sessions = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return sessions


def main():
    """Main function for CLI testing"""
    server = OnboardingServer()
    print("Onboarding MCP Server initialized")
    
    # Create a template
    template = server.create_checklist_template(
        name="Standard Client Onboarding",
        description="Standard checklist for new client onboarding",
        category="general"
    )
    print(f"Created template: {template}")
    
    # Add template items
    items = [
        "Initial consultation call",
        "Send NDA and service agreement",
        "Receive signed contracts",
        "Set up project workspace",
        "Schedule kickoff meeting",
        "Create project timeline"
    ]
    
    for idx, item_title in enumerate(items):
        item = server.add_template_item(
            template_id=template['id'],
            title=item_title,
            order_index=idx
        )
        print(f"Added template item: {item_title}")
    
    # Start onboarding
    session = server.start_onboarding(
        client_id=1,
        project_id=1,
        template_id=template['id'],
        assigned_to="John Doe"
    )
    print(f"Started onboarding: {session}")
    
    # Get status
    status = server.get_onboarding_status(session['id'])
    print(f"Onboarding status: {json.dumps(status, indent=2)}")


if __name__ == "__main__":
    main()
