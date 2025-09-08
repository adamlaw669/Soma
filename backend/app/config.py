import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Model configuration
MODEL_PATH = os.environ.get(
    "MODEL_PATH",
    str(BASE_DIR / "models" / "soma_model_v1.joblib")
)

# Disable any SQLite usage that might be happening in dependencies
os.environ["SQLALCHEMY_SILENCE_UBER_WARNING"] = "1"

# If using any caching libraries that might use SQLite, disable them
os.environ["TRANSFORMERS_CACHE"] = "/tmp/transformers_cache"
os.environ["HF_HOME"] = "/tmp/huggingface"

# Ensure temp directories are writable
TEMP_DIR = os.environ.get("TEMP_DIR", "/tmp")