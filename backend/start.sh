#!/bin/bash

# Ensure temp directories exist and are writable
mkdir -p /tmp/transformers_cache
mkdir -p /tmp/huggingface
mkdir -p /tmp/matplotlib

# Set environment variables to prevent SQLite usage
export SQLALCHEMY_SILENCE_UBER_WARNING=1
export SHAP_PLOTS_DISABLE=1
export TRANSFORMERS_CACHE=/tmp/transformers_cache
export HF_HOME=/tmp/huggingface

# Set matplotlib to use non-interactive backend
export MPLBACKEND=Agg
export MPLCONFIGDIR=/tmp/matplotlib

# Disable any IPython SQLite history
export IPYTHONDIR=/tmp/ipython

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT