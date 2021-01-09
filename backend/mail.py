import smtplib
import secrets
from email.mime.text import MIMEText


def send_auth_mail_to_reset_password(client_email):
    gmail_user = 'myemail.dawid.wolszczak@gmail.com'
    gmail_password = 'lsnhsegmhfmydclb'
    to = client_email
    subject = 'MySimpleGymLog Password Reminder'
    token = secrets.token_hex(10)
    body = 'Click on this link to restart your password http://msgl.hopto.org/mail/{}/{}'.format(client_email, token)
    message = MIMEText(body)

    message = "From: {}\nTo: {}\nSubject: {}\n{}\n".format(gmail_user, to, subject, message)
    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.ehlo()
        server.login(gmail_user, gmail_password)
        server.sendmail(gmail_user, to, message)
        server.close()
        return token
    except:
        return False


def send_mail_with_new_password(client_email, new_password):
    gmail_user = 'myemail.dawid.wolszczak@gmail.com'
    gmail_password = 'lsnhsegmhfmydclb'
    to = client_email
    subject = 'MySimpleGymLog New Password'
    body = 'Your new password is: {}'.format(new_password)
    message = MIMEText(body)

    message = "From: {}\nTo: {}\nSubject: {}\n{}\n".format(gmail_user, to, subject, message)
    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.ehlo()
        server.login(gmail_user, gmail_password)
        server.sendmail(gmail_user, to, message)
        server.close()
        return True
    except:
        return False