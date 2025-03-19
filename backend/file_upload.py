import os
from flask import request, jsonify

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the 'uploads' folder exists


def handle_cad_upload():
    if "cad_file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["cad_file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save the file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200
