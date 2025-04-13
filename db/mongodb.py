from pymongo import MongoClient, ASCENDING
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
# print(f"Connecting to MongoDB at {MONGODB_URI}")
client = MongoClient(MONGODB_URI)
try:
    client.admin.command("ping")
    print("MongoDB connection successful.")
except Exception as e:
    print(f"MongoDB connection failed: {e}")

db = client["noteai_session"]

# Create TTL index on "expires_at" field so that documents expire automatically.
notes_collection = db["notes"]
# This index ensures notes expire as soon as "expires_at" passes.
notes_collection.create_index("expires_at", expireAfterSeconds=0)


def get_expiration_time(hours: int = 2):
    """Return an expiration datetime (default 2 hours from now)."""
    return datetime.utcnow() + timedelta(hours=hours)