# 🚀 AI-Powered Freelance LLC Operating System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)

**A complete, AI-powered operating system for managing your freelance LLC business**

[Features](#features) • [Installation](#installation) • [Documentation](#documentation) • [Usage](#usage)

</div>

---

## 📋 Overview

This is a comprehensive operating system for freelance LLC businesses, combining **MCP (Model Context Protocol) servers** for data management, **Claude AI skills** for intelligent assistance, and the **PARA method** for knowledge organization.

Inspired by [davekilleen/Dex](https://github.com/davekilleen/Dex) and built with complete, working Python code—not stubs.

## ✨ Features

### 🔧 6 MCP Servers

Complete Python servers with SQLite databases for:

1. **Work Server** - Project & task management, time tracking
2. **Client Server** - CRM, communications, relationship management
3. **Billing Server** - Invoicing, payments, Stripe integration
4. **LLC Ops Server** - Compliance, licenses, tax tracking
5. **Onboarding Server** - Client onboarding workflows
6. **Career Server** - Skills, certifications, opportunities

### 🧠 9 Claude AI Skills

Intelligent assistance for:

1. **Project Management** - Plans, tasks, deliverables
2. **Client Communication** - Professional correspondence
3. **Contract Generation** - Agreements, NDAs, SOWs
4. **Invoice Creation** - Professional invoicing
5. **Time Tracking** - Productivity analytics
6. **Tax Preparation** - Compliance and filing
7. **Business Analytics** - KPIs and reporting
8. **Meeting Notes** - Agendas and action items
9. **Knowledge Management** - PARA organization

### 📁 PARA Vault

Organized file structure based on Tiago Forte's PARA method:

- **Projects**: Active work with deadlines
- **Areas**: Ongoing responsibilities
- **Resources**: Reference material
- **Archives**: Completed work

---

## 🎯 Who Is This For?

- 🏢 **Freelancers** operating as an LLC
- 💼 **Consultants** managing multiple clients
- 🛠️ **Solo entrepreneurs** running service businesses
- 👨‍💻 **Independent developers** and designers
- 📊 **Anyone** needing comprehensive business management

---

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Dub5991/SpreeShopping.git
cd SpreeShopping

# Run installation script
chmod +x install.sh
./install.sh
```

The installer will:
- ✅ Verify Python version
- ✅ Install dependencies
- ✅ Create directory structure
- ✅ Initialize all databases
- ✅ Set up configuration
- ✅ Create backup scripts

### Configuration

Edit `.env` with your business information:

```env
LLC_NAME=Your LLC Name
EIN=12-3456789
STATE=DE
HOURLY_RATE=150
TAX_RATE=0.08
```

---

## 📖 Documentation

### Comprehensive Guides

- **[CLAUDE.md](CLAUDE.md)** - Complete system documentation
- **[.claude/skills/](/.claude/skills/)** - Individual skill documentation
- **[PARA/](PARA/)** - PARA method implementation

### MCP Server Documentation

Each server is fully documented with:
- Database schema
- API methods
- Usage examples
- Integration points

See [CLAUDE.md](CLAUDE.md) for detailed information.

---

## 💻 Usage

### Start MCP Servers

```python
from core.mcp import MCPServerManager

# Initialize all servers
manager = MCPServerManager()

# Health check
print(manager.health_check())

# Access specific servers
work = manager.get_server('work')
clients = manager.get_server('clients')
billing = manager.get_server('billing')
```

### Work Server Example

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

# Add tasks
task = server.create_task(
    project_id=project['id'],
    title="Design homepage mockup",
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
print(f"Completion: {status['completion_percentage']}%")
```

### Client Server Example

```python
from core.mcp.client_server import ClientServer

server = ClientServer()

# Create a client
client = server.create_client(
    name="John Smith",
    email="john@techcorp.com",
    company="TechCorp Inc",
    industry="Technology"
)

# Log communication
server.log_communication(
    client_id=client['id'],
    type="email",
    subject="Project kickoff",
    content="Discussed timeline and deliverables"
)

# Get client profile
profile = server.get_client_profile(client['id'])
```

### Billing Server Example

```python
from core.mcp.billing_server import BillingServer

server = BillingServer()

# Create invoice
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

## 🗂️ System Architecture

```
AI-Powered Freelance LLC OS
│
├── core/mcp/                    # MCP Servers
│   ├── work_server.py          # Project & task management
│   ├── client_server.py        # Client relationship management
│   ├── billing_server.py       # Invoicing & payments
│   ├── llc_ops_server.py       # Business operations
│   ├── onboarding_server.py    # Client onboarding
│   ├── career_server.py        # Professional development
│   └── __init__.py             # Server manager
│
├── .claude/skills/              # Claude AI Skills
│   ├── project_management.md
│   ├── client_communication.md
│   ├── contract_generation.md
│   ├── invoice_creation.md
│   ├── time_tracking.md
│   ├── tax_preparation.md
│   ├── business_analytics.md
│   ├── meeting_notes.md
│   └── knowledge_management.md
│
├── PARA/                        # Knowledge organization
│   ├── Projects/               # Active work
│   ├── Areas/                  # Ongoing responsibilities
│   ├── Resources/              # Reference material
│   └── Archives/               # Completed work
│
├── CLAUDE.md                    # Complete documentation
├── install.sh                   # Installation script
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

---

## 🔐 Security

- 🔒 **Database Security**: SQLite databases with sensitive business data
- 🛡️ **Environment Variables**: Configuration stored in `.env`
- 📁 **Git Ignore**: Databases and sensitive files excluded
- 💾 **Regular Backups**: Automated backup scripts included
- 🔐 **Encryption**: Support for encrypted backups

---

## 📊 Key Features

### Project Management
- Track multiple projects simultaneously
- Break down work into tasks and subtasks
- Log time with billable/non-billable tracking
- Generate project status reports
- Monitor budget vs. actuals

### Client Management
- Maintain detailed client profiles
- Track all communications
- Store client documents
- Rate and categorize clients
- Calculate lifetime value

### Financial Management
- Professional invoice generation
- Payment tracking and reminders
- Expense management
- Tax-deductible expense tracking
- Financial reports and analytics

### Business Operations
- Compliance deadline tracking
- License and permit management
- Insurance policy tracking
- Tax record keeping
- Business meeting documentation

### Professional Development
- Skill tracking and proficiency levels
- Certification management
- Learning goals and progress
- Job opportunity tracking
- Professional network management

---

## 🔄 Backup

### Automated Backups

Run the included backup script:

```bash
./backup.sh
```

This will:
- Backup all databases
- Backup PARA vault
- Create timestamped archives
- Clean up old backups (30+ days)

### Manual Backup

```bash
# Backup databases
tar -czf backup-$(date +%Y%m%d).tar.gz core/mcp/*.db

# Backup PARA vault
tar -czf para-backup-$(date +%Y%m%d).tar.gz PARA/
```

---

## 📈 Analytics & Reporting

The system provides comprehensive analytics:

- **Revenue Reports**: Track income by client, project, period
- **Profit Analysis**: Calculate profit margins and effective rates
- **Time Analysis**: Billable vs. non-billable breakdown
- **Client Metrics**: Lifetime value, retention rates
- **Project Performance**: On-time completion, budget adherence
- **Financial Health**: Cash flow, receivables, expenses

---

## 🛠️ Customization

### Adding New Servers

1. Create server file in `core/mcp/`
2. Define database schema
3. Implement methods
4. Add to `__init__.py`
5. Create corresponding skill

### Adding New Skills

1. Create markdown in `.claude/skills/`
2. Define capabilities
3. Add examples
4. Document integration

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 Best Practices

### Daily
- ✅ Log time entries
- ✅ Update task status
- ✅ Check communications

### Weekly
- ✅ Review project status
- ✅ Send client updates
- ✅ Plan upcoming week
- ✅ Backup data

### Monthly
- ✅ Generate financial reports
- ✅ Review client relationships
- ✅ Update skills and goals
- ✅ Archive completed work

### Quarterly
- ✅ Business performance review
- ✅ Strategic planning
- ✅ Deep system cleanup
- ✅ Process improvements

---

## 🐛 Troubleshooting

### Database Issues

```bash
# Verify database integrity
sqlite3 core/mcp/work.db "PRAGMA integrity_check;"

# Reset database
rm core/mcp/work.db
python3 core/mcp/work_server.py
```

### Import Errors

```bash
# Set Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- Inspired by [davekilleen/Dex](https://github.com/davekilleen/Dex)
- PARA method by [Tiago Forte](https://fortelabs.com/blog/para/)
- Built for use with [Claude AI](https://claude.ai)

---

## 📞 Support

- 📖 **Documentation**: [CLAUDE.md](CLAUDE.md)
- 💬 **Issues**: [GitHub Issues](https://github.com/Dub5991/SpreeShopping/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/Dub5991/SpreeShopping/discussions)

---

<div align="center">

**Built with ❤️ for freelancers by freelancers**

⭐ Star this repo if you find it helpful!

</div>
