import os
import uuid
import smtplib
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email_validator import validate_email, EmailNotValidError
from flask_cors import CORS  # Import CORS to handle cross-origin requests

# Load environment variables from .env file
load_dotenv()

# Load Gmail credentials from environment
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("GMAIL_USER")
SMTP_PASSWORD = os.getenv("GMAIL_PASSWORD")

# Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Function to send an invitation email via Gmail SMTP
def send_invite_email(to_email, invite_link, description=""):
    try:
        # Create the email content
        subject = "BuildSmart BOQ Project Invitation"
        
        # HTML body with styling
        html_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #130683  ; color: white; padding: 10px; text-align: center; }}
                .content {{ padding: 20px; }}
                 .button {{ background-color: #130683; padding: 10px 20px; color: white;
                          text-decoration: none; display: inline-block; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>BuildSmart</h1>
                </div>
                <div class="content">
                    <h2>BOQ Project Invitation</h2>
                    <p>You have been invited to access a BOQ (Bill of Quantities) project.</p>
                    {'<p><strong>Message:</strong> ' + description + '</p>' if description else ''}
                    <p>Click the button below to view the shared BOQ:</p>
                    <a href="{invite_link}" class="button">View BOQ</a>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text body as fallback
        text_body = f"You have been invited to access a BOQ project. Click the link below to accept the invite:\n\n{invite_link}"
        
        msg = MIMEMultipart('alternative')
        msg['From'] = SMTP_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Attach both plain text and HTML versions
        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        # Connect to Gmail's SMTP server and send the email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()  # Secure the connection using TLS
            server.login(SMTP_USER, SMTP_PASSWORD)  # Log in to Gmail
            server.sendmail(SMTP_USER, to_email, msg.as_string())  # Send the email
        
        print(f"Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

# API: Send Invitation
@app.route("/send-invite", methods=["POST"])
def send_invite():
    try:
        data = request.get_json()
        invitee_email = data.get("invitee_email")
        project_id = data.get("project_id")
        invited_by = data.get("invited_by")
        description = data.get("description", "")  # Optional description

        # Validate email format
        try:
            validate_email(invitee_email)
        except EmailNotValidError:
            return jsonify({"error": "Invalid email format"}), 400

        # Validate UUIDs
        try:
            uuid.UUID(project_id)
            uuid.UUID(invited_by)
        except ValueError:
            return jsonify({"error": "Invalid UUID format"}), 400

        # Generate a unique invite token (in a real implementation, store it in the database)
        invite_token = str(uuid.uuid4())

        # Generate invite link (this would typically link to a frontend page that handles the invitation)
        invite_link = f"http://localhost:3000/output/{project_id}?token={invite_token}"

        # Send the invitation email with the optional description
        if send_invite_email(invitee_email, invite_link, description):
            # In a real implementation, save the invitation details to a database
            return jsonify({
                "message": f"Invitation sent successfully to {invitee_email}",
                "invite_link": invite_link
            })
        else:
            return jsonify({"error": "Failed to send invitation email."}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    if not SMTP_USER or not SMTP_PASSWORD:
        print("WARNING: Email credentials not set. Please set GMAIL_USER and GMAIL_PASSWORD in .env file.")
    app.run(debug=True, port=5000)