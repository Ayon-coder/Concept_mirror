"""
Run script for the AI Assistant backend server.

Usage:
    python run.py
"""

import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Now import and run
from api import create_app, run_server
from config import config
from ai_client import ai, get_ai_client

if __name__ == "__main__":
    print("=" * 60)
    print("AI Assistant API Server")
    print("=" * 60)
    print(f"Provider: {config.active_provider}")
    print(f"Model: {config.active_model or 'default'}")
    print(f"API Key: {'configured' if config.has_api_key() else 'NOT configured (demo mode)'}")
    print(f"Demo Mode: {config.demo_mode}")
    print("=" * 60)
    print(f"Starting server at http://{config.flask_host}:{config.flask_port}")
    print("=" * 60)
    
    run_server()
