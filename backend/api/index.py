"""
Vercel Serverless Function Entry Point.

This file adapts the Flask app for Vercel's Python serverless runtime.
Vercel automatically discovers this file at api/index.py and uses the
exported `app` variable as the WSGI handler.
"""

import sys
import os

# Add the backend directory to Python path so all existing imports work
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import and create the Flask app
from api import create_app

app = create_app()
