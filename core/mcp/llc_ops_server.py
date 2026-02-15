#!/usr/bin/env python3
"""
LLC Operations MCP Server - Business Operations and Compliance
Manages LLC operations, compliance, tax tracking, and business administration
"""

import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional


class LLCOpsServer:
    """MCP Server for LLC operations, compliance, and administration"""
    
    def __init__(self, db_path: str = "llc_ops.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the LLC operations database schema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Business entities table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS business_entity (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                legal_name TEXT NOT NULL,
                dba_name TEXT,
                entity_type TEXT DEFAULT 'LLC',
                ein TEXT,
                state TEXT NOT NULL,
                formation_date TEXT,
                address TEXT,
                phone TEXT,
                email TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Compliance deadlines table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS compliance_deadlines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                due_date TEXT NOT NULL,
                category TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                completed_date TEXT,
                recurrence TEXT,
                reminder_days INTEGER DEFAULT 30,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Tax records table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tax_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                quarter INTEGER,
                type TEXT NOT NULL,
                amount_paid REAL DEFAULT 0,
                filing_date TEXT,
                status TEXT DEFAULT 'pending',
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Business licenses table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS licenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                license_number TEXT,
                issuing_authority TEXT,
                issue_date TEXT,
                expiration_date TEXT,
                status TEXT DEFAULT 'active',
                renewal_fee REAL,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Insurance policies table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS insurance_policies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                policy_type TEXT NOT NULL,
                provider TEXT NOT NULL,
                policy_number TEXT,
                coverage_amount REAL,
                premium REAL,
                premium_frequency TEXT DEFAULT 'annual',
                start_date TEXT,
                renewal_date TEXT,
                status TEXT DEFAULT 'active',
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Business meetings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS meetings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                meeting_type TEXT NOT NULL,
                date TEXT NOT NULL,
                attendees TEXT,
                agenda TEXT,
                minutes TEXT,
                decisions TEXT,
                action_items TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Operating agreements / amendments
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                document_type TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                file_path TEXT,
                version TEXT DEFAULT '1.0',
                effective_date TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        conn.close()
    
    def setup_business_entity(self, legal_name: str, state: str, ein: str = "",
                             formation_date: str = "", address: str = "") -> Dict:
        """Set up or update business entity information"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Check if entity exists
        cursor.execute("SELECT id FROM business_entity LIMIT 1")
        exists = cursor.fetchone()
        
        if exists:
            cursor.execute("""
                UPDATE business_entity 
                SET legal_name = ?, state = ?, ein = ?, formation_date = ?, address = ?, updated_at = ?
                WHERE id = ?
            """, (legal_name, state, ein, formation_date, address, 
                  datetime.now().isoformat(), exists[0]))
            entity_id = exists[0]
        else:
            cursor.execute("""
                INSERT INTO business_entity (legal_name, state, ein, formation_date, address)
                VALUES (?, ?, ?, ?, ?)
            """, (legal_name, state, ein, formation_date, address))
            entity_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        return {
            "id": entity_id,
            "legal_name": legal_name,
            "state": state,
            "message": "Business entity configured successfully"
        }
    
    def add_compliance_deadline(self, title: str, due_date: str, category: str,
                               description: str = "", recurrence: str = "") -> Dict:
        """Add a compliance deadline (tax filing, annual report, etc.)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO compliance_deadlines (title, description, due_date, category, recurrence)
            VALUES (?, ?, ?, ?, ?)
        """, (title, description, due_date, category, recurrence))
        
        deadline_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": deadline_id,
            "title": title,
            "due_date": due_date,
            "category": category,
            "message": "Compliance deadline added successfully"
        }
    
    def get_upcoming_deadlines(self, days: int = 90) -> List[Dict]:
        """Get upcoming compliance deadlines"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        today = datetime.now().date()
        future_date = today + timedelta(days=days)
        
        cursor.execute("""
            SELECT * FROM compliance_deadlines 
            WHERE status = 'pending' 
            AND due_date BETWEEN ? AND ?
            ORDER BY due_date
        """, (today.isoformat(), future_date.isoformat()))
        
        deadlines = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return deadlines
    
    def complete_deadline(self, deadline_id: int) -> Dict:
        """Mark a compliance deadline as completed"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().date().isoformat()
        
        cursor.execute("""
            UPDATE compliance_deadlines 
            SET status = 'completed', completed_date = ?
            WHERE id = ?
        """, (today, deadline_id))
        
        conn.commit()
        conn.close()
        
        return {
            "deadline_id": deadline_id,
            "status": "completed",
            "message": "Deadline marked as completed"
        }
    
    def add_license(self, name: str, license_type: str, license_number: str = "",
                   expiration_date: str = "", renewal_fee: float = 0) -> Dict:
        """Add a business license or permit"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().date().isoformat()
        
        cursor.execute("""
            INSERT INTO licenses (name, type, license_number, issue_date, expiration_date, renewal_fee)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (name, license_type, license_number, today, expiration_date, renewal_fee))
        
        license_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": license_id,
            "name": name,
            "type": license_type,
            "message": "License added successfully"
        }
    
    def add_insurance_policy(self, policy_type: str, provider: str, policy_number: str = "",
                            coverage_amount: float = 0, premium: float = 0,
                            renewal_date: str = "") -> Dict:
        """Add an insurance policy"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().date().isoformat()
        
        cursor.execute("""
            INSERT INTO insurance_policies 
            (policy_type, provider, policy_number, coverage_amount, premium, start_date, renewal_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (policy_type, provider, policy_number, coverage_amount, premium, today, renewal_date))
        
        policy_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": policy_id,
            "policy_type": policy_type,
            "provider": provider,
            "message": "Insurance policy added successfully"
        }
    
    def record_tax_filing(self, year: int, tax_type: str, amount_paid: float = 0,
                         quarter: Optional[int] = None) -> Dict:
        """Record a tax filing"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().date().isoformat()
        
        cursor.execute("""
            INSERT INTO tax_records (year, quarter, type, amount_paid, filing_date, status)
            VALUES (?, ?, ?, ?, ?, 'filed')
        """, (year, quarter, tax_type, amount_paid, today))
        
        tax_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": tax_id,
            "year": year,
            "type": tax_type,
            "amount": amount_paid,
            "message": "Tax filing recorded successfully"
        }
    
    def record_meeting(self, meeting_type: str, date: str, attendees: str = "",
                      agenda: str = "", minutes: str = "", decisions: str = "") -> Dict:
        """Record a business meeting (required for some LLC types)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO meetings (meeting_type, date, attendees, agenda, minutes, decisions)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (meeting_type, date, attendees, agenda, minutes, decisions))
        
        meeting_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": meeting_id,
            "meeting_type": meeting_type,
            "date": date,
            "message": "Meeting recorded successfully"
        }
    
    def get_compliance_status(self) -> Dict:
        """Get overall compliance status"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Upcoming deadlines
        today = datetime.now().date()
        next_30_days = today + timedelta(days=30)
        
        cursor.execute("""
            SELECT COUNT(*) as count FROM compliance_deadlines 
            WHERE status = 'pending' AND due_date BETWEEN ? AND ?
        """, (today.isoformat(), next_30_days.isoformat()))
        upcoming = cursor.fetchone()['count']
        
        # Overdue items
        cursor.execute("""
            SELECT COUNT(*) as count FROM compliance_deadlines 
            WHERE status = 'pending' AND due_date < ?
        """, (today.isoformat(),))
        overdue = cursor.fetchone()['count']
        
        # Licenses expiring soon
        next_90_days = today + timedelta(days=90)
        cursor.execute("""
            SELECT COUNT(*) as count FROM licenses 
            WHERE status = 'active' AND expiration_date BETWEEN ? AND ?
        """, (today.isoformat(), next_90_days.isoformat()))
        expiring_licenses = cursor.fetchone()['count']
        
        # Insurance renewals
        cursor.execute("""
            SELECT COUNT(*) as count FROM insurance_policies 
            WHERE status = 'active' AND renewal_date BETWEEN ? AND ?
        """, (today.isoformat(), next_90_days.isoformat()))
        insurance_renewals = cursor.fetchone()['count']
        
        conn.close()
        
        return {
            "upcoming_deadlines": upcoming,
            "overdue_items": overdue,
            "expiring_licenses": expiring_licenses,
            "insurance_renewals": insurance_renewals,
            "status": "needs_attention" if (overdue > 0 or upcoming > 0) else "good"
        }
    
    def add_document(self, document_type: str, title: str, file_path: str,
                    description: str = "", effective_date: str = "") -> Dict:
        """Add a business document (operating agreement, amendment, etc.)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO documents (document_type, title, description, file_path, effective_date)
            VALUES (?, ?, ?, ?, ?)
        """, (document_type, title, description, file_path, effective_date))
        
        doc_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": doc_id,
            "document_type": document_type,
            "title": title,
            "message": "Document added successfully"
        }


def main():
    """Main function for CLI testing"""
    server = LLCOpsServer()
    print("LLC Operations MCP Server initialized")
    
    # Example usage
    entity = server.setup_business_entity(
        legal_name="TechConsulting LLC",
        state="Delaware",
        ein="12-3456789",
        formation_date="2024-01-01",
        address="123 Tech Street, Dover, DE 19901"
    )
    print(f"Set up business entity: {entity}")
    
    deadline = server.add_compliance_deadline(
        title="Annual Report Filing",
        due_date="2024-12-31",
        category="state_compliance",
        description="File annual report with Secretary of State",
        recurrence="annual"
    )
    print(f"Added deadline: {deadline}")
    
    license = server.add_license(
        name="Business License",
        license_type="general_business",
        license_number="BL-2024-001",
        expiration_date="2025-12-31",
        renewal_fee=150.00
    )
    print(f"Added license: {license}")
    
    status = server.get_compliance_status()
    print(f"Compliance status: {json.dumps(status, indent=2)}")


if __name__ == "__main__":
    main()
