import os
from werkzeug.utils import secure_filename
from datetime import datetime
import psycopg2
from flask import jsonify

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Database connection


def get_db_connection():
    conn = psycopg2.connect(
        dbname="your_db_name",
        user="your_db_user",
        password="your_db_password",
        host="your_db_host",
        port="your_db_port"
    )
    return conn

# Save CAD file to disk


def save_file(file):
    file_path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
    file.save(file_path)
    return file_path

# Save CAD file info to database


def save_cad_file_to_db(file_name, file_path):
    conn = get_db_connection()
    cursor = conn.cursor()

    user_id = 1  # Replace with actual user ID
    project_id = 1  # Replace with actual project ID
    uploaded_at = datetime.now()

    cursor.execute("""
        INSERT INTO cad_files (file_name, file_path, file_type, user_id, uploaded_at, project_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (file_name, file_path, "dxf", user_id, uploaded_at, project_id))

    conn.commit()
    cursor.close()
    conn.close()

# Handle the CAD file upload and processing


def handle_cad_upload(request):
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if not file.filename.endswith(".dxf"):
        return jsonify({"error": "Only .dxf files are allowed"}), 400

    # Save the file to the uploads folder
    file_path = save_file(file)

    # Save file details to the database
    save_cad_file_to_db(file.filename, file_path)

    return jsonify({"message": "File uploaded successfully", "file_path": file_path})
