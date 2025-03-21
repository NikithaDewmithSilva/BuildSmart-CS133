from flask import Flask
from flask_cors import CORS

# Import modules
from app import app as app_main
from jsonFiles import app as app_json

# Create the main Flask app
main_app = Flask(__name__)
CORS(main_app)

# Register blueprints
main_app.register_blueprint(app_main)
main_app.register_blueprint(app_json)

if __name__ == "__main__":
    main_app.run(debug=True, host='0.0.0.0', port=5000)
