import os
import uuid
from flask import request, jsonify

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the 'uploads' folder exists


def handle_cad_upload():
    if "cad_file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["cad_file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.endswith(".dxf"):
        return jsonify({"error": "Invalid file type. Only .dxf files are allowed"}), 400

    # Generate a unique filename
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(file_path)

    # Call the analyzer function (if implemented)
    # try:
    #     process_dxf_file(file_path)
    #     return jsonify({"message": "File uploaded and analyzed successfully", "file_path": file_path}), 200
    # except Exception as e:
    #     return jsonify({"message": "File uploaded but analysis failed", "error": str(e), "file_path": file_path}), 500

    return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200
