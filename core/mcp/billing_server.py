#!/usr/bin/env python3
"""
Billing/Stripe MCP Server - Invoicing and Payment Processing
Manages invoices, payments, Stripe integration, and financial tracking
"""

import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from decimal import Decimal


class BillingServer:
    """MCP Server for billing, invoicing, and payment processing"""
    
    def __init__(self, db_path: str = "billing.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the billing database schema"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Invoices table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_number TEXT UNIQUE NOT NULL,
                client_id INTEGER NOT NULL,
                project_id INTEGER,
                amount REAL NOT NULL,
                tax_rate REAL DEFAULT 0,
                tax_amount REAL DEFAULT 0,
                total_amount REAL NOT NULL,
                currency TEXT DEFAULT 'USD',
                status TEXT DEFAULT 'draft',
                issue_date TEXT NOT NULL,
                due_date TEXT NOT NULL,
                paid_date TEXT,
                notes TEXT,
                stripe_invoice_id TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Invoice line items table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS invoice_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER NOT NULL,
                description TEXT NOT NULL,
                quantity REAL DEFAULT 1,
                unit_price REAL NOT NULL,
                amount REAL NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (invoice_id) REFERENCES invoices(id)
            )
        """)
        
        # Payments table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                payment_method TEXT,
                transaction_id TEXT,
                stripe_payment_id TEXT,
                payment_date TEXT NOT NULL,
                notes TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (invoice_id) REFERENCES invoices(id)
            )
        """)
        
        # Expenses table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                amount REAL NOT NULL,
                description TEXT,
                vendor TEXT,
                project_id INTEGER,
                date TEXT NOT NULL,
                receipt_path TEXT,
                tax_deductible BOOLEAN DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Stripe customers table (cache)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS stripe_customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER UNIQUE NOT NULL,
                stripe_customer_id TEXT UNIQUE NOT NULL,
                email TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        conn.close()
    
    def generate_invoice_number(self) -> str:
        """Generate a unique invoice number"""
        today = datetime.now()
        prefix = f"INV-{today.year}{today.month:02d}"
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT COUNT(*) FROM invoices 
            WHERE invoice_number LIKE ?
        """, (f"{prefix}%",))
        
        count = cursor.fetchone()[0]
        conn.close()
        
        return f"{prefix}-{count + 1:04d}"
    
    def create_invoice(self, client_id: int, amount: float, due_days: int = 30,
                      project_id: Optional[int] = None, tax_rate: float = 0,
                      notes: str = "") -> Dict:
        """Create a new invoice"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        invoice_number = self.generate_invoice_number()
        issue_date = datetime.now().date()
        due_date = issue_date + timedelta(days=due_days)
        
        tax_amount = amount * tax_rate
        total_amount = amount + tax_amount
        
        cursor.execute("""
            INSERT INTO invoices 
            (invoice_number, client_id, project_id, amount, tax_rate, tax_amount, 
             total_amount, issue_date, due_date, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (invoice_number, client_id, project_id, amount, tax_rate, tax_amount,
              total_amount, issue_date.isoformat(), due_date.isoformat(), notes))
        
        invoice_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": invoice_id,
            "invoice_number": invoice_number,
            "amount": amount,
            "total_amount": total_amount,
            "due_date": due_date.isoformat(),
            "status": "draft",
            "message": "Invoice created successfully"
        }
    
    def add_invoice_item(self, invoice_id: int, description: str,
                        quantity: float, unit_price: float) -> Dict:
        """Add a line item to an invoice"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        amount = quantity * unit_price
        
        cursor.execute("""
            INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount)
            VALUES (?, ?, ?, ?, ?)
        """, (invoice_id, description, quantity, unit_price, amount))
        
        item_id = cursor.lastrowid
        
        # Update invoice total
        cursor.execute("""
            SELECT SUM(amount) FROM invoice_items WHERE invoice_id = ?
        """, (invoice_id,))
        total = cursor.fetchone()[0] or 0
        
        cursor.execute("""
            UPDATE invoices 
            SET amount = ?, total_amount = amount + tax_amount, updated_at = ?
            WHERE id = ?
        """, (total, datetime.now().isoformat(), invoice_id))
        
        conn.commit()
        conn.close()
        
        return {
            "id": item_id,
            "invoice_id": invoice_id,
            "amount": amount,
            "message": "Invoice item added successfully"
        }
    
    def send_invoice(self, invoice_id: int) -> Dict:
        """Mark invoice as sent (ready for payment)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE invoices 
            SET status = 'sent', updated_at = ?
            WHERE id = ?
        """, (datetime.now().isoformat(), invoice_id))
        
        conn.commit()
        conn.close()
        
        return {
            "invoice_id": invoice_id,
            "status": "sent",
            "message": "Invoice sent successfully"
        }
    
    def record_payment(self, invoice_id: int, amount: float,
                      payment_method: str = "bank_transfer",
                      transaction_id: str = "") -> Dict:
        """Record a payment for an invoice"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        payment_date = datetime.now().date().isoformat()
        
        cursor.execute("""
            INSERT INTO payments (invoice_id, amount, payment_method, transaction_id, payment_date)
            VALUES (?, ?, ?, ?, ?)
        """, (invoice_id, amount, payment_method, transaction_id, payment_date))
        
        payment_id = cursor.lastrowid
        
        # Check if invoice is fully paid
        cursor.execute("""
            SELECT i.total_amount, COALESCE(SUM(p.amount), 0) as paid_amount
            FROM invoices i
            LEFT JOIN payments p ON i.id = p.invoice_id
            WHERE i.id = ?
            GROUP BY i.id
        """, (invoice_id,))
        
        result = cursor.fetchone()
        if result:
            total, paid = result
            if paid >= total:
                cursor.execute("""
                    UPDATE invoices 
                    SET status = 'paid', paid_date = ?, updated_at = ?
                    WHERE id = ?
                """, (payment_date, datetime.now().isoformat(), invoice_id))
        
        conn.commit()
        conn.close()
        
        return {
            "id": payment_id,
            "invoice_id": invoice_id,
            "amount": amount,
            "payment_date": payment_date,
            "message": "Payment recorded successfully"
        }
    
    def get_invoice_details(self, invoice_id: int) -> Dict:
        """Get complete invoice details with line items and payments"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get invoice
        cursor.execute("SELECT * FROM invoices WHERE id = ?", (invoice_id,))
        invoice_row = cursor.fetchone()
        if not invoice_row:
            conn.close()
            return {"error": "Invoice not found"}
        
        invoice = dict(invoice_row)
        
        # Get line items
        cursor.execute("SELECT * FROM invoice_items WHERE invoice_id = ?", (invoice_id,))
        items = [dict(row) for row in cursor.fetchall()]
        
        # Get payments
        cursor.execute("SELECT * FROM payments WHERE invoice_id = ?", (invoice_id,))
        payments = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        total_paid = sum(p['amount'] for p in payments)
        balance = invoice['total_amount'] - total_paid
        
        return {
            "invoice": invoice,
            "items": items,
            "payments": payments,
            "total_paid": total_paid,
            "balance": balance
        }
    
    def get_outstanding_invoices(self) -> List[Dict]:
        """Get all outstanding (unpaid) invoices"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM invoices 
            WHERE status IN ('sent', 'overdue')
            ORDER BY due_date
        """)
        
        invoices = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return invoices
    
    def record_expense(self, category: str, amount: float, description: str = "",
                      vendor: str = "", project_id: Optional[int] = None) -> Dict:
        """Record a business expense"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        today = datetime.now().date().isoformat()
        
        cursor.execute("""
            INSERT INTO expenses (category, amount, description, vendor, project_id, date)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (category, amount, description, vendor, project_id, today))
        
        expense_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "id": expense_id,
            "category": category,
            "amount": amount,
            "date": today,
            "message": "Expense recorded successfully"
        }
    
    def get_financial_summary(self, start_date: str = None, end_date: str = None) -> Dict:
        """Get financial summary for a date range"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if not start_date:
            start_date = (datetime.now().date().replace(day=1)).isoformat()
        if not end_date:
            end_date = datetime.now().date().isoformat()
        
        # Total revenue (paid invoices)
        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0) as total_revenue
            FROM payments
            WHERE payment_date BETWEEN ? AND ?
        """, (start_date, end_date))
        revenue = cursor.fetchone()[0]
        
        # Total expenses
        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0) as total_expenses
            FROM expenses
            WHERE date BETWEEN ? AND ?
        """, (start_date, end_date))
        expenses = cursor.fetchone()[0]
        
        # Outstanding invoices
        cursor.execute("""
            SELECT COALESCE(SUM(total_amount), 0) as outstanding
            FROM invoices
            WHERE status IN ('sent', 'overdue')
        """)
        outstanding = cursor.fetchone()[0]
        
        conn.close()
        
        profit = revenue - expenses
        
        return {
            "period": {
                "start": start_date,
                "end": end_date
            },
            "revenue": revenue,
            "expenses": expenses,
            "profit": profit,
            "outstanding_invoices": outstanding,
            "profit_margin": (profit / revenue * 100) if revenue > 0 else 0
        }
    
    def create_stripe_customer(self, client_id: int, email: str,
                               stripe_customer_id: str) -> Dict:
        """Store Stripe customer mapping"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO stripe_customers (client_id, stripe_customer_id, email)
                VALUES (?, ?, ?)
            """, (client_id, stripe_customer_id, email))
            
            conn.commit()
            return {
                "client_id": client_id,
                "stripe_customer_id": stripe_customer_id,
                "message": "Stripe customer created successfully"
            }
        except sqlite3.IntegrityError:
            return {"error": "Stripe customer already exists for this client"}
        finally:
            conn.close()


def main():
    """Main function for CLI testing"""
    server = BillingServer()
    print("Billing MCP Server initialized")
    
    # Example usage
    invoice = server.create_invoice(
        client_id=1,
        amount=5000,
        due_days=30,
        project_id=1,
        tax_rate=0.08,
        notes="Website redesign - Phase 1"
    )
    print(f"Created invoice: {invoice}")
    
    if 'id' in invoice:
        item = server.add_invoice_item(
            invoice_id=invoice['id'],
            description="Frontend development",
            quantity=40,
            unit_price=125
        )
        print(f"Added invoice item: {item}")
        
        sent = server.send_invoice(invoice['id'])
        print(f"Sent invoice: {sent}")
        
        payment = server.record_payment(
            invoice_id=invoice['id'],
            amount=5400,
            payment_method="bank_transfer",
            transaction_id="TXN123456"
        )
        print(f"Recorded payment: {payment}")
        
        details = server.get_invoice_details(invoice['id'])
        print(f"Invoice details: {json.dumps(details, indent=2)}")
        
        summary = server.get_financial_summary()
        print(f"Financial summary: {json.dumps(summary, indent=2)}")


if __name__ == "__main__":
    main()
