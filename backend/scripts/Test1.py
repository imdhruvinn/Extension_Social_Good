import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pymongo import MongoClient

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB connection string
db = client["extensionDB"]  # Replace with your database name
collection = db["users"]  # Replace with your collection name

# Fetch user details from MongoDB
user = collection.find_one({"email": "kathadumisha@gmail.com"})  # Replace with your query criteria
if not user:
    print("User not found in the database.")
    exit()

full_name = user.get("full_name", "Your Full Name")  # Default if not found
contact_number = user.get("contact_number", "Your Contact Number")  # Default if not found

# Email details
sender_email = "kathadumisha@gmail.com"
sender_password = "xici wkrt otci psbj"
recipient_email = "pipaliyabhargav9@gmail.com"
subject = "Request for Guidance on Managing Depression"

body = f"""
Dear [Helpline Team / Support Services Team],

I am reaching out to request support in managing my mental health, particularly as I am struggling with feelings of depression. I have been experiencing challenges that have started to affect my daily life and overall well-being, and I believe I could benefit from professional guidance.

I would appreciate any information you could provide on available resources, support options, or next steps to help me navigate this difficult time. If there are recommended programs, counseling options, or self-care practices, please let me know.

Thank you for your time and for the work you do to support individuals like myself. I look forward to your response.

Warm regards,  
{full_name}  
{contact_number}
"""

# Set up the email message
message = MIMEMultipart()
message["From"] = sender_email
message["To"] = recipient_email
message["Subject"] = subject
message.attach(MIMEText(body, "plain"))

# Send the email
try:
    # Connect to the SMTP server and log in
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()  # Upgrade to a secure connection
        server.login(sender_email, sender_password)
        server.send_message(message)
    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
