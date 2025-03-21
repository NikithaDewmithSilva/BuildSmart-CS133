from flask import Flask, request, jsonify
from flask_cors import CORS
# Import the function from file_upload.py
from file_upload import handle_cad_upload

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return "Hello! Your Flask backend is working!"


# API endpoint for CAD file upload
@app.route("/upload_cad", methods=["POST"])
def upload_cad():
    return handle_cad_upload()


if __name__ == "__main__":
    app.run(debug=True)
