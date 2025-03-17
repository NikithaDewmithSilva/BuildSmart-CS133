from flask import Flask, request, jsonify
from cad_handling import handle_cad_upload

app = Flask(__name__)


@app.route("/upload", methods=["POST"])
def upload_file():
    return handle_cad_upload(request)


if __name__ == "__main__":
    app.run(debug=True)
