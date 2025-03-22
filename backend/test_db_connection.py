import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL
DATABASE_URL = os.getenv("DATABASE_URL")

try:
    # Try to connect to the database
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute("SELECT 1;")
    result = cursor.fetchone()
    print("✅ Database connection successful!", result)
    cursor.close()
    conn.close()
except Exception as e:
    print("❌ Database connection failed:", e)
