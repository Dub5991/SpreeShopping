#!/bin/bash

# AI-Powered Freelance LLC Operating System - Installation Script
# This script sets up the complete system including MCP servers and PARA vault

set -e  # Exit on error

echo "======================================"
echo "AI-Powered Freelance LLC Operating System"
echo "Installation Script"
echo "======================================"
echo ""

# Check Python version
echo "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "Error: Python 3.8 or higher is required"
    echo "Current version: $python_version"
    exit 1
fi
echo "✓ Python $python_version detected"
echo ""

# Check if pip is installed
echo "Checking pip..."
if ! command -v pip3 &> /dev/null; then
    echo "Error: pip3 is not installed"
    echo "Please install pip3 and try again"
    exit 1
fi
echo "✓ pip3 is available"
echo ""

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt --quiet
echo "✓ Dependencies installed"
echo ""

# Create necessary directories
echo "Creating directory structure..."
mkdir -p core/mcp
mkdir -p .claude/skills
mkdir -p PARA/Projects
mkdir -p PARA/Areas
mkdir -p PARA/Resources
mkdir -p PARA/Archives
mkdir -p data/backups
echo "✓ Directory structure created"
echo ""

# Initialize MCP Server databases
echo "Initializing MCP Server databases..."

echo "  • Work Server..."
python3 -c "import sys; sys.path.insert(0, 'core/mcp'); from work_server import WorkServer; WorkServer()" > /dev/null 2>&1
echo "    ✓ work.db initialized"

echo "  • Client Server..."
python3 -c "import sys; sys.path.insert(0, 'core/mcp'); from client_server import ClientServer; ClientServer()" > /dev/null 2>&1
echo "    ✓ clients.db initialized"

echo "  • Billing Server..."
python3 -c "import sys; sys.path.insert(0, 'core/mcp'); from billing_server import BillingServer; BillingServer()" > /dev/null 2>&1
echo "    ✓ billing.db initialized"

echo "  • LLC Operations Server..."
python3 -c "import sys; sys.path.insert(0, 'core/mcp'); from llc_ops_server import LLCOpsServer; LLCOpsServer()" > /dev/null 2>&1
echo "    ✓ llc_ops.db initialized"

echo "  • Onboarding Server..."
python3 -c "import sys; sys.path.insert(0, 'core/mcp'); from onboarding_server import OnboardingServer; OnboardingServer()" > /dev/null 2>&1
echo "    ✓ onboarding.db initialized"

echo "  • Career Server..."
python3 -c "import sys; sys.path.insert(0, 'core/mcp'); from career_server import CareerServer; CareerServer()" > /dev/null 2>&1
echo "    ✓ career.db initialized"

echo ""
echo "✓ All databases initialized"
echo ""

# Verify MCP Server Manager
echo "Verifying MCP Server Manager..."
python3 core/mcp/__init__.py > /dev/null 2>&1
echo "✓ MCP Server Manager operational"
echo ""

# Create .env template if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env template..."
    cat > .env << 'EOF'
# Business Configuration
LLC_NAME=Your LLC Name
EIN=12-3456789
STATE=DE

# Financial Settings
HOURLY_RATE=150
TAX_RATE=0.08

# Database Settings
DB_PATH=core/mcp/

# Backup Settings
BACKUP_PATH=data/backups/

# Optional: Stripe Integration
# STRIPE_API_KEY=your_stripe_api_key
# STRIPE_WEBHOOK_SECRET=your_webhook_secret
EOF
    echo "✓ .env template created"
    echo "  ⚠ Please edit .env with your business information"
    echo ""
fi

# Create backup script
echo "Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash
# Backup script for AI-Powered Freelance LLC OS

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="data/backups"

echo "Creating backup..."
mkdir -p "$BACKUP_DIR"

# Backup databases
tar -czf "$BACKUP_DIR/databases_$TIMESTAMP.tar.gz" core/mcp/*.db
echo "✓ Databases backed up"

# Backup PARA vault
tar -czf "$BACKUP_DIR/para_vault_$TIMESTAMP.tar.gz" PARA/
echo "✓ PARA vault backed up"

# Keep only last 30 days of backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete
echo "✓ Old backups cleaned up"

echo "Backup complete: $BACKUP_DIR"
EOF
chmod +x backup.sh
echo "✓ Backup script created (backup.sh)"
echo ""

# Print success message
echo "======================================"
echo "Installation Complete! ✓"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit .env with your business information"
echo "2. Read CLAUDE.md for comprehensive documentation"
echo "3. Explore Claude skills in .claude/skills/"
echo "4. Start using MCP servers:"
echo ""
echo "   python3 -c 'from core.mcp import MCPServerManager; m = MCPServerManager(); print(m.health_check())'"
echo ""
echo "5. Run backups regularly:"
echo "   ./backup.sh"
echo ""
echo "6. Organize your work using the PARA method:"
echo "   - Projects: Active work with deadlines"
echo "   - Areas: Ongoing responsibilities"
echo "   - Resources: Reference material"
echo "   - Archives: Completed work"
echo ""
echo "For detailed usage, see CLAUDE.md"
echo ""
echo "Happy freelancing! 🚀"
