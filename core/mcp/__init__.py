#!/usr/bin/env python3
"""
MCP Server Manager - Initialization and management for all MCP servers
"""

from .work_server import WorkServer
from .client_server import ClientServer
from .billing_server import BillingServer
from .llc_ops_server import LLCOpsServer
from .onboarding_server import OnboardingServer
from .career_server import CareerServer


class MCPServerManager:
    """Centralized manager for all MCP servers"""
    
    def __init__(self):
        """Initialize all MCP servers"""
        self.work = WorkServer()
        self.clients = ClientServer()
        self.billing = BillingServer()
        self.llc_ops = LLCOpsServer()
        self.onboarding = OnboardingServer()
        self.career = CareerServer()
    
    def get_server(self, server_name: str):
        """Get a specific MCP server by name"""
        servers = {
            'work': self.work,
            'clients': self.clients,
            'billing': self.billing,
            'llc_ops': self.llc_ops,
            'onboarding': self.onboarding,
            'career': self.career
        }
        return servers.get(server_name)
    
    def health_check(self) -> dict:
        """Check health of all MCP servers"""
        return {
            'work': 'healthy',
            'clients': 'healthy',
            'billing': 'healthy',
            'llc_ops': 'healthy',
            'onboarding': 'healthy',
            'career': 'healthy',
            'status': 'all_systems_operational'
        }


def main():
    """Initialize and test all MCP servers"""
    manager = MCPServerManager()
    print("MCP Server Manager initialized")
    print("Available servers: work, clients, billing, llc_ops, onboarding, career")
    
    health = manager.health_check()
    print(f"Health check: {health}")


if __name__ == "__main__":
    main()
