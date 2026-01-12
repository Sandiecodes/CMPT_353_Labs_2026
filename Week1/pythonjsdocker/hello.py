from flask import Flask

app = Flask(__name__)

@app.route("/")

def hello_world():
    return """
    <p> Hello World </p>
    <p>Welcome to CMPT 353 Tutorials!</p>

    """
