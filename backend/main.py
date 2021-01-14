from flask import Flask
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})


def create_connection():
    server = 'localhost, 1433'
    database ='MSGL'
    username = 'SA'
    password = '#Woli1995'
    cnxn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + server + ';DATABASE=' + database + ';UID=' + username + ';PWD=' + password)
    return cnxn


import routes

if __name__ == "__main__":
    app.run(host='192.168.0.220', port=4500)
