from flask import render_template
from commtransport import app, db
from commtransport.models import User, Place, Approval, Request


@app.route("/")
def home():
    return render_template("base.html")