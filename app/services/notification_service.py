# app/services/notification_service.py
from app.core.email import send_email
import smtplib
from email.mime.text import MIMEText
from app.core.config import settings

class NotificationService:
    @staticmethod
    def send_temporary_password(email: str, temp_password: str, first_name: str):
        subject = "Your Temporary Password for Smart CRM"
        body = f"""
Hi {first_name},

Your account has been created in Smart CRM.

Temporary password: {temp_password}

Please login and change your password immediately.

Regards,
Smart CRM Team
"""
        send_email(email, subject, body)
