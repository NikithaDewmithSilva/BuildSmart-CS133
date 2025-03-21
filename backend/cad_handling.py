import os
from werkzeug.utils import secure_filename
from datetime import datetime
import psycopg2
from flask import jsonify, request
from dotenv import load_dotenv
from supabase_client import create_client, Client

import tempfile

# Load environment variables
load_dotenv()

# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")


def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print("❌ Database connection failed:", e)
        return None

# Function to upload file to Supabase Storage


def upload_to_supabase(file):
    bucket_name = "cad-files"
    file_name = secure_filename(file.filename)
    file_path = f"{bucket_name}/{file_name}"

    # Save the file in a temporary directory
    # This will get a valid temp directory for your OS
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, file_name)

    file.save(temp_path)  # Save the uploaded file temporarily

    try:
        # Upload to Supabase storage
        with open(temp_path, "rb") as f:
            response = supabase.storage.from_(bucket_name).upload(file_path, f)

        if response:
            file_url = f"{SUPABASE_URL}/storage/v1/object/public/{file_path}"
            return file_url
        else:
            print("❌ File upload failed")
            return None
    except Exception as e:
        print("❌ Supabase upload error:", e)
        return None
    finally:
        os.remove(temp_path)  # Delete temp file after upload


# Function to store CAD file details in the database


def save_cad_file_to_db(file_name, file_url):
    conn = get_db_connection()
    cursor = conn.cursor()
    user_id = "d8ae41c3-ac1e-42fe-b2b4-51ee497e309f"
    project_id = "106307de-07b1-400e-a9de-1659396ff7f5"
    uploaded_at = datetime.now()

    try:
        cursor.execute("""
            INSERT INTO cad_files (file_name, file_path, file_type, user_id, uploaded_at, project_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (file_name, file_url, "dxf", user_id, uploaded_at, project_id))

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "File uploaded and saved to database successfully", "file_url": file_url}), 201
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({"error": "Failed to save file to database", "details": str(e)}), 500

# API route to handle CAD file uploads


def handle_cad_upload():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if not file.filename.endswith(".dxf"):
        return jsonify({"error": "Only .dxf files are allowed"}), 400

    # Upload file to Supabase
    file_url = upload_to_supabase(file)
    if not file_url:
        return jsonify({"error": "File upload to Supabase failed"}), 500

    # Save file details to the database
    return save_cad_file_to_db(file.filename, file_url)
