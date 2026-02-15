# CLAUDE.md - AI-Powered Freelance LLC Operating System

## Overview

This is a comprehensive AI-powered operating system for managing a freelance LLC business. It combines MCP (Model Context Protocol) servers for data management, Claude AI skills for intelligent assistance, and the PARA method for knowledge organization.

## System Architecture

### Core Components

1. **MCP Servers** (`core/mcp/`)
   - Modular Python servers for different business domains
   - SQLite databases for persistent storage
   - RESTful API design patterns
   - Complete working code, not stubs

2. **Claude Skills** (`.claude/skills/`)
   - AI-powered assistance for common business tasks
   - Integrated with MCP servers
   - Context-aware recommendations
   - Reusable templates and workflows

3. **PARA Vault** (`PARA/`)
   - Projects: Active work with deadlines
   - Areas: Ongoing responsibilities
   - Resources: Reference material
   - Archives: Completed/inactive items

## MCP Servers

### Work Server (`core/mcp/work_server.py`)
**Purpose**: Project and task management, time tracking

**Features**:
- Create and manage projects
- Break down work into tasks
- Log time entries (billable/non-billable)
- Track milestones and deadlines
- Generate project status reports
- Calculate completion percentages
- Monitor budget vs. actuals

**Database**: `work.db`
- projects table
- tasks table
- time_entries table
- milestones table

**Example Usage**:
```python
from core.mcp.work_server import WorkServer

server = WorkServer()

# Create a project
project = server.create_project(
    name="Website Redesign",
    client_id=1,
    budget=10000,
    hourly_rate=100
)

# Add a task
task = server.create_task(
    project_id=project['id'],
    title="Design homepage",
    estimated_hours=8
)

# Log time
server.log_time(
    project_id=project['id'],
    task_id=task['id'],
    hours=4,
    description="Initial design work"
)

# Get project status
status = server.get_project_status(project['id'])
```

---

### Client Server (`core/mcp/client_server.py`)
**Purpose**: Client relationship management

**Features**:
- Maintain client profiles
- Track multiple contacts per client
- Log communications (email, call, meeting)
- Store client documents
- Rate and categorize clients
- Search and filter clients
- Calculate client lifetime value

**Database**: `clients.db`
- clients table
- contacts table
- communications table
- client_documents table

**Example Usage**:
```python
from core.mcp.client_server import ClientServer

server = ClientServer()

# Create a client
client = server.create_client(
    name="John Smith",
    email="john@techcorp.com",
    company="TechCorp Inc"
)

# Add a contact
server.add_contact(
    client_id=client['id'],
    name="Jane Doe",
    title="CTO",
    is_primary=True
)

# Log communication
server.log_communication(
    client_id=client['id'],
    type="email",
    subject="Project update",
    content="Discussed timeline"
)
```

---

### Billing Server (`core/mcp/billing_server.py`)
**Purpose**: Invoicing, payments, and financial tracking

**Features**:
- Generate professional invoices
- Add line items to invoices
- Track invoice status (draft, sent, paid, overdue)
- Record payments
- Calculate taxes
- Manage expenses
- Financial summaries and reports
- Stripe integration support

**Database**: `billing.db`
- invoices table
- invoice_items table
- payments table
- expenses table
- stripe_customers table

**Example Usage**:
```python
from core.mcp.billing_server import BillingServer

server = BillingServer()

# Create an invoice
invoice = server.create_invoice(
    client_id=1,
    amount=5000,
    due_days=30,
    tax_rate=0.08
)

# Add line items
server.add_invoice_item(
    invoice_id=invoice['id'],
    description="Web development",
    quantity=40,
    unit_price=125
)

# Send invoice
server.send_invoice(invoice['id'])

# Record payment
server.record_payment(
    invoice_id=invoice['id'],
    amount=5400,
    payment_method="bank_transfer"
)
```

---

### LLC Operations Server (`core/mcp/llc_ops_server.py`)
**Purpose**: Business operations, compliance, and administration

**Features**:
- Business entity management
- Compliance deadline tracking
- License and permit management
- Insurance policy tracking
- Tax record keeping
- Business meeting documentation
- Document management
- Compliance status dashboard

**Database**: `llc_ops.db`
- business_entity table
- compliance_deadlines table
- tax_records table
- licenses table
- insurance_policies table
- meetings table
- documents table

**Example Usage**:
```python
from core.mcp.llc_ops_server import LLCOpsServer

server = LLCOpsServer()

# Set up business entity
server.setup_business_entity(
    legal_name="TechConsulting LLC",
    state="Delaware",
    ein="12-3456789"
)

# Add compliance deadline
server.add_compliance_deadline(
    title="Annual Report Filing",
    due_date="2024-12-31",
    category="state_compliance"
)

# Track license
server.add_license(
    name="Business License",
    license_type="general_business",
    expiration_date="2025-12-31"
)
```

---

### Onboarding Server (`core/mcp/onboarding_server.py`)
**Purpose**: Client onboarding workflows and checklists

**Features**:
- Create onboarding templates
- Start onboarding sessions
- Track checklist completion
- Manage onboarding documents
- Collect questionnaire responses
- Monitor onboarding progress
- Generate completion reports

**Database**: `onboarding.db`
- onboarding_sessions table
- checklist_templates table
- template_items table
- checklist_items table
- onboarding_documents table
- questionnaire_responses table

**Example Usage**:
```python
from core.mcp.onboarding_server import OnboardingServer

server = OnboardingServer()

# Create a template
template = server.create_checklist_template(
    name="Standard Onboarding",
    category="general"
)

# Add template items
server.add_template_item(
    template_id=template['id'],
    title="Send NDA and contract"
)

# Start onboarding
session = server.start_onboarding(
    client_id=1,
    template_id=template['id']
)

# Complete checklist item
server.complete_checklist_item(item_id=1)
```

---

### Career Server (`core/mcp/career_server.py`)
**Purpose**: Professional development and opportunity management

**Features**:
- Track skills and proficiency levels
- Manage certifications
- Set and track learning goals
- Track job opportunities
- Maintain professional network
- Record career milestones
- Log professional development
- Generate career dashboard

**Database**: `career.db`
- skills table
- certifications table
- learning_goals table
- opportunities table
- network_contacts table
- milestones table
- professional_development table

**Example Usage**:
```python
from core.mcp.career_server import CareerServer

server = CareerServer()

# Add a skill
server.add_skill(
    name="Python",
    category="Programming",
    proficiency=5,
    years_experience=8
)

# Add opportunity
server.add_opportunity(
    title="Senior Developer",
    company="Tech Startup",
    rate_min=150,
    rate_max=200,
    remote=True
)

# Track learning goal
server.add_learning_goal(
    goal="Learn AWS certification",
    priority="high",
    target_date="2024-06-30"
)
```

---

## Claude Skills

### 1. Project Management
Manages projects, tasks, and deliverables. Integrates with Work Server.

**Use cases**:
- Create projects with budgets and timelines
- Break down work into manageable tasks
- Track progress and completion
- Generate status reports

---

### 2. Client Communication
Handles all client communications and relationship management. Integrates with Client Server.

**Use cases**:
- Log client calls and meetings
- Draft professional emails
- Track communication history
- Schedule follow-ups

---

### 3. Contract Generation
Creates legal documents and agreements. Integrates with Client Server.

**Use cases**:
- Generate service agreements
- Create NDAs
- Draft statements of work
- Add standard clauses

---

### 4. Invoice Creation
Creates and manages invoices. Integrates with Billing Server.

**Use cases**:
- Generate itemized invoices
- Calculate taxes
- Send payment reminders
- Track payment status

---

### 5. Time Tracking
Accurately tracks time and analyzes productivity. Integrates with Work Server.

**Use cases**:
- Log time entries
- Generate timesheets
- Analyze billable vs. non-billable time
- Calculate utilization rates

---

### 6. Tax Preparation
Helps with tax compliance and preparation. Integrates with Billing and LLC Ops Servers.

**Use cases**:
- Calculate quarterly taxes
- Track deductible expenses
- Generate P&L statements
- Maintain tax records

---

### 7. Business Analytics
Provides insights and reporting. Integrates with all MCP servers.

**Use cases**:
- Generate financial reports
- Analyze client profitability
- Track KPIs
- Forecast revenue

---

### 8. Meeting Notes
Captures and organizes meeting information. Integrates with Client and Work Servers.

**Use cases**:
- Create meeting agendas
- Take structured notes
- Track action items
- Send meeting summaries

---

### 9. Knowledge Management
Organizes information using the PARA method. Integrates with PARA vault.

**Use cases**:
- Organize documentation
- Build knowledge base
- Search and retrieve information
- Maintain project documentation

---

## PARA Method Implementation

### Projects (`PARA/Projects/`)
Active projects with defined outcomes and deadlines.

**Structure**:
```
Projects/
  [ProjectName]/
    README.md
    requirements.md
    design/
    documentation/
    meeting_notes/
    deliverables/
    lessons_learned.md
```

---

### Areas (`PARA/Areas/`)
Ongoing responsibilities and standards to maintain.

**Categories**:
- Client Management
- Business Development
- Financial Management
- Professional Development
- Health & Wellness
- Work-Life Balance

---

### Resources (`PARA/Resources/`)
Topics of interest and reference material.

**Categories**:
- Technical resources (by technology)
- Business resources (templates, guides)
- Design resources
- Learning resources

---

### Archives (`PARA/Archives/`)
Inactive items from other categories.

**Organization**: By year and category
- Completed projects
- Former clients
- Outdated resources

---

## Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Git

### Quick Install
```bash
chmod +x install.sh
./install.sh
```

### Manual Install
```bash
# Install Python dependencies
pip install -r requirements.txt

# Initialize databases
python core/mcp/work_server.py
python core/mcp/client_server.py
python core/mcp/billing_server.py
python core/mcp/llc_ops_server.py
python core/mcp/onboarding_server.py
python core/mcp/career_server.py

# Verify installation
python core/mcp/__init__.py
```

---

## Usage

### Starting MCP Servers
```python
from core.mcp import MCPServerManager

# Initialize all servers
manager = MCPServerManager()

# Health check
status = manager.health_check()

# Access specific server
work = manager.get_server('work')
clients = manager.get_server('clients')
billing = manager.get_server('billing')
```

### Working with Claude Skills
Each skill is documented in `.claude/skills/` with:
- Description and capabilities
- Example usage
- Integration details
- Best practices

### Organizing with PARA
1. Start new work in `Projects/`
2. Define ongoing areas in `Areas/`
3. Collect resources in `Resources/`
4. Archive completed work in `Archives/`

---

## Configuration

### Environment Variables
Create a `.env` file:
```
LLC_NAME=Your LLC Name
EIN=12-3456789
STATE=DE
HOURLY_RATE=150
TAX_RATE=0.08
```

### Database Configuration
By default, databases are stored in the `core/mcp/` directory:
- `work.db`
- `clients.db`
- `billing.db`
- `llc_ops.db`
- `onboarding.db`
- `career.db`

---

## Backup and Data Management

### Backup Strategy
```bash
# Backup databases
tar -czf backup-$(date +%Y%m%d).tar.gz core/mcp/*.db

# Backup PARA vault
tar -czf para-backup-$(date +%Y%m%d).tar.gz PARA/
```

### Data Export
Each server supports data export:
```python
# Export project data
server.export_data(format='json', output='data/export.json')
```

---

## Security Considerations

1. **Database Security**: Databases contain sensitive business data. Keep secure and backed up.
2. **Access Control**: Implement authentication if exposing as API.
3. **Data Privacy**: Client data should be handled according to privacy laws.
4. **Backups**: Regular encrypted backups are essential.
5. **Git**: Never commit sensitive data to version control.

---

## Extending the System

### Adding New MCP Servers
1. Create new server file in `core/mcp/`
2. Define database schema
3. Implement server methods
4. Add to `__init__.py`
5. Create corresponding Claude skill

### Adding New Claude Skills
1. Create markdown file in `.claude/skills/`
2. Define capabilities and usage
3. Add integration details
4. Update this documentation

---

## Troubleshooting

### Database Issues
```bash
# Verify database integrity
sqlite3 core/mcp/work.db "PRAGMA integrity_check;"

# Reset database
rm core/mcp/work.db
python core/mcp/work_server.py
```

### Import Errors
```bash
# Verify Python path
export PYTHONPATH="${PYTHONPATH}:/path/to/project"

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## Best Practices

1. **Daily**: Log time, update tasks, check calendar
2. **Weekly**: Review projects, update clients, plan ahead
3. **Monthly**: Financial review, backup data, update goals
4. **Quarterly**: Business review, archive projects, strategic planning

---

## Support and Resources

### Documentation
- This file (CLAUDE.md)
- Individual skill documentation (`.claude/skills/`)
- PARA vault README files

### Community
- GitHub Issues for bug reports
- Discussions for questions and ideas

### Contributing
Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Submit pull request
4. Follow existing code style

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

Inspired by davekilleen/Dex and the PARA method by Tiago Forte.

Built with Python, SQLite, and designed for use with Claude AI.
