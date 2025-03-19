import os
from werkzeug.utils import secure_filename
from datetime import datetime
import psycopg2
from flask import jsonify, request
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database connection URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# Set the folder where uploaded CAD files will be stored
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Function to connect to the database


def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print("❌ Database connection failed:", e)
        return None

# Function to save the uploaded CAD file to disk


def save_file(file):
    file_path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
    file.save(file_path)
    return file_path

# Function to store CAD file details in the database


def save_cad_file_to_db(file_name, file_path):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor()
    user_id = 1  # Replace with actual user ID
    project_id = 1  # Replace with actual project ID
    uploaded_at = datetime.now()

    try:
        cursor.execute("""
            INSERT INTO cad_files (file_name, file_path, file_type, user_id, uploaded_at, project_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (file_name, file_path, "dxf", user_id, uploaded_at, project_id))

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 201
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

    # Save file to disk
    file_path = save_file(file)

    # Save file details to database
    return save_cad_file_to_db(file.filename, file_path)
