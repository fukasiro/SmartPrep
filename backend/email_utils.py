import os
import smtplib
import ssl
from email.message import EmailMessage
from dotenv import load_dotenv


load_dotenv()


SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587")) if os.getenv("SMTP_PORT") else None
SMTP_USER = os.getenv("SMTP_USER") or os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL") or os.getenv("SMTP_FROM_EMAIL") or SMTP_USER

def send_verification_email(to_email: str, code: str) -> None:
    if not SMTP_HOST or not SMTP_PORT or not SMTP_USER or not SMTP_PASSWORD:
        print(f"[email] Verification code for {to_email}: {code} - email_utils.py:19")
        return

    message = EmailMessage()
    message["Subject"] = "【認証コード】アカウント登録の確認"
    message["From"] = FROM_EMAIL 
    message["To"] = to_email
    message.set_content(
        f"以下の認証コードを入力してアカウント登録を完了してください:\n\n{code}\n\nこのコードは30分間有効です。"
    )

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.starttls(context=context)
        smtp.login(SMTP_USER, SMTP_PASSWORD)
        smtp.send_message(message)