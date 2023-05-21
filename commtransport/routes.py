from flask import flash, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from commtransport import app, db
from commtransport.models import User, Place, Approval, Request


@app.route("/")
def home():
    return render_template("base.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # check if username already exists in db
        existing_user = User.query.filter(User.user_name ==
                                           request.form.get("username").lower()).all()

        if existing_user:
            flash("Username already exists")
            return redirect(url_for("register"))

        user = User(
            user_name=request.form.get("username").lower(),
            password=generate_password_hash(request.form.get("password"))
        )

        db.session.add(user)
        db.session.commit()

        # put the new user into 'session' cookie
        session["user"] = request.form.get("username").lower()
        flash("Registration Successful!")
        return redirect(url_for("profile", username=session["user"]))

    return render_template("register.html")


@app.route("/signin", methods=["GET", "POST"])
def signin():
    if request.method == "POST":
        # check if username exists in db
        existing_user = User.query.filter(User.user_name ==
                                           request.form.get("username").lower()).all()

        if existing_user:
            print(request.form.get("username"))
            # ensure hashed password matches user input
            if check_password_hash(
                    existing_user[0].password, request.form.get("password")):
                session["user"] = request.form.get("username").lower()
                flash("Welcome, {}".format(
                    request.form.get("username")))
                return redirect(url_for(
                    "profilePage", username=session["user"]))
            else:
                # invalid password match
                flash("Incorrect Username and/or Password")
                return redirect(url_for("signin"))

        else:
            # username doesn't exist
            flash("Incorrect Username and/or Password")
            return redirect(url_for("signin"))

    return render_template("signin.html")


@app.route("/profile-page/<username>", methods=["GET", "POST"])
def profilePage(username):
    # grab the session user's username from db
    if "user" in session:
        return render_template("profile.html", username=session["user"])

    return redirect(url_for("login"))


@app.route("/signout")
def signout():
    # remove user from session cookies
    flash("You have been signed out.")
    # session.clear() would clear all cookies related to our app
    session.pop("user")
    return redirect(url_for("signin"))