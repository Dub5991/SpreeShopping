#!/usr/bin/env python3
"""
Client MCP Server - Client Relationship Management
Manages client information, communications, and relationship tracking
"""

import json
import sqlite3
from datetime import datetime
from typing import Dict, List, Optional


class ClientServer:
    """MCP Server for managing client relationships and communications"""
    
    def __init__(self, db_path: str = "clients.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the client database schema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Clients table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                company TEXT,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                address TEXT,
                website TEXT,
                industry TEXT,
                status TEXT DEFAULT 'active',
                rating INTEGER DEFAULT 0,
                lifetime_value REAL DEFAULT 0,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Communications table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS communications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                subject TEXT,
                content TEXT,
                direction TEXT DEFAULT 'outbound',
                date TEXT NOT NULL,
                follow_up_date TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id)
            )
        """)
        
        # Contacts table (multiple contacts per client)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                title TEXT,
                email TEXT,
                phone TEXT,
                is_primary BOOLEAN DEFAULT 0,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id)
            )
        """)
        
        # Client documents table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS client_documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                type TEXT,
                file_path TEXT,
                description TEXT,
                uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (client_id) REFERENCES clients(id)
            )
        """)
        
        conn.commit()
        conn.close()
    
    def create_client(self, name: str, email: str, company: str = "",
                     phone: str = "", industry: str = "") -> Dict:
        """Create a new client"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO clients (name, company, email, phone, industry)
                VALUES (?, ?, ?, ?, ?)
            """, (name, company, email, phone, industry))
            
            client_id = cursor.lastrowid
            conn.commit()
            
            return {
                "id": client_id,
                "name": name,
                "email": email,
                "status": "active",
                "message": "Client created successfully"
            }
        except sqlite3.IntegrityError:
            return {
                "error": "Client with this email already exists"
            }
        finally:
            conn.close()
    
    def add_contact(self, client_id: int, name: str, email: str = "",
                   phone: str = "", title: str = "", is_primary: bool = False) -> Dict:
        """Add a contact person for a client"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO contacts (client_id, name, title, email, phone, is_primary)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (client_id, name, title, email, phone, is_primary))
        
        contact_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": contact_id,
            "client_id": client_id,
            "name": name,
            "message": "Contact added successfully"
        }
    
    def log_communication(self, client_id: int, type: str, subject: str = "",
                         content: str = "", direction: str = "outbound") -> Dict:
        """Log a communication with a client"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().isoformat()
        
        cursor.execute("""
            INSERT INTO communications (client_id, type, subject, content, direction, date)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (client_id, type, subject, content, direction, today))
        
        comm_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": comm_id,
            "client_id": client_id,
            "type": type,
            "date": today,
            "message": "Communication logged successfully"
        }
    
    def get_client_profile(self, client_id: int) -> Dict:
        """Get comprehensive client profile with all related data"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get client info
        cursor.execute("SELECT * FROM clients WHERE id = ?", (client_id,))
        client_row = cursor.fetchone()
        if not client_row:
            conn.close()
            return {"error": "Client not found"}
        
        client = dict(client_row)
        
        # Get contacts
        cursor.execute("SELECT * FROM contacts WHERE client_id = ?", (client_id,))
        contacts = [dict(row) for row in cursor.fetchall()]
        
        # Get recent communications
        cursor.execute("""
            SELECT * FROM communications 
            WHERE client_id = ? 
            ORDER BY date DESC 
            LIMIT 10
        """, (client_id,))
        communications = [dict(row) for row in cursor.fetchall()]
        
        # Get documents
        cursor.execute("SELECT * FROM client_documents WHERE client_id = ?", (client_id,))
        documents = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            "client": client,
            "contacts": contacts,
            "recent_communications": communications,
            "documents": documents
        }
    
    def search_clients(self, query: str) -> List[Dict]:
        """Search clients by name, company, or email"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        search_pattern = f"%{query}%"
        cursor.execute("""
            SELECT * FROM clients 
            WHERE name LIKE ? OR company LIKE ? OR email LIKE ?
        """, (search_pattern, search_pattern, search_pattern))
        
        results = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return results
    
    def update_client_rating(self, client_id: int, rating: int) -> Dict:
        """Update client rating (1-5 stars)"""
        if rating < 1 or rating > 5:
            return {"error": "Rating must be between 1 and 5"}
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE clients 
            SET rating = ?, updated_at = ?
            WHERE id = ?
        """, (rating, datetime.now().isoformat(), client_id))
        
        conn.commit()
        conn.close()
        
        return {
            "client_id": client_id,
            "rating": rating,
            "message": "Client rating updated successfully"
        }
    
    def get_active_clients(self) -> List[Dict]:
        """Get all active clients"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, name, company, email, phone, industry, rating, lifetime_value
            FROM clients 
            WHERE status = 'active'
            ORDER BY name
        """)
        
        clients = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return clients
    
    def add_document(self, client_id: int, name: str, file_path: str,
                    doc_type: str = "", description: str = "") -> Dict:
        """Add a document for a client"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO client_documents (client_id, name, type, file_path, description)
            VALUES (?, ?, ?, ?, ?)
        """, (client_id, name, doc_type, file_path, description))
        
        doc_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": doc_id,
            "client_id": client_id,
            "name": name,
            "message": "Document added successfully"
        }


def main():
    """Main function for CLI testing"""
    server = ClientServer()
    print("Client MCP Server initialized")
    
    # Example usage
    client = server.create_client(
        name="John Smith",
        email="john@techcorp.com",
        company="TechCorp Inc",
        phone="555-0123",
        industry="Technology"
    )
    print(f"Created client: {client}")
    
    if 'id' in client:
        contact = server.add_contact(
            client_id=client['id'],
            name="Jane Doe",
            title="CTO",
            email="jane@techcorp.com",
            phone="555-0124",
            is_primary=True
        )
        print(f"Added contact: {contact}")
        
        comm = server.log_communication(
            client_id=client['id'],
            type="email",
            subject="Project kickoff discussion",
            content="Discussed project timeline and deliverables",
            direction="outbound"
        )
        print(f"Logged communication: {comm}")
        
        profile = server.get_client_profile(client['id'])
        print(f"Client profile: {json.dumps(profile, indent=2)}")


if __name__ == "__main__":
    main()
