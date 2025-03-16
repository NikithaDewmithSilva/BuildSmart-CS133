import os
import uuid
import smtplib
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load environment variables from .env file
load_dotenv()

# Load Gmail credentials from environment
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("GMAIL_USER")
SMTP_PASSWORD = os.getenv("GMAIL_PASSWORD")

# FastAPI app
app = FastAPI()

# Pydantic models for request body validation
class InviteRequest(BaseModel):
    invitee_email: EmailStr
    project_id: uuid.UUID
    invited_by: uuid.UUID


# Function to send an invitation email via Gmail SMTP
def send_invite_email(to_email, invite_link):
    try:
        # Create the email content
        subject = "BOQ Project Invitation"
        body = f"You have been invited to access a BOQ project. Click the link below to accept the invite:\n\n{invite_link}"

        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        # Connect to Gmail's SMTP server and send the email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()  # Secure the connection using TLS
            server.login(SMTP_USER, SMTP_PASSWORD)  # Log in to Gmail
            server.sendmail(SMTP_USER, to_email, msg.as_string())  # Send the email
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send invitation email.")

# API: Send Invitation
@app.post("/send-invite")
def send_invite(request: InviteRequest):
    # Generate a unique invite token (in a real implementation, store it in the database)
    invite_token = str(uuid.uuid4())

    # Generate invite link (this would typically link to a frontend page that handles the invitation)
    invite_link = f"http://localhost:3000/accept-invite?token={invite_token}"

    # Send the invitation email
    send_invite_email(request.invitee_email, invite_link)

    return {"message": "Invitation sent successfully.", "invite_link": invite_link}
