import os
from flask import request, jsonify
from analyzer import process_dxf_file  # Import the analyzer function

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

    try:
        # Call the analyzer function on the uploaded file
        process_dxf_file(file_path)

        return jsonify({
            "message": "File uploaded and analyzed successfully",
            "file_path": file_path
        }), 200
    except Exception as e:
        return jsonify({
            "message": "File uploaded but analysis failed",
            "error": str(e),
            "file_path": file_path
        }), 500
