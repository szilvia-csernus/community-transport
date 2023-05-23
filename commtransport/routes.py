from flask import flash, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from commtransport import app, db
from commtransport.models import Member, Place, Approval, Request


@app.route("/")
def home():
    return render_template("base.html")


@app.route("/map")
def map():
    return render_template("map.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # check if email/username already exists in db
        existing_member = Member.query.filter(Member.email ==
                                           request.form.get("email").lower()).all()

        if existing_member:
            flash("This email has already been registered. Please sign in.")
            return redirect(url_for("signin"))
        
        place = Place(
            google_place_id = request.form.get("address_id"),
            address = request.form.get("address"),  
        )

        db.session.add(place)
        db.session.commit()

        if place == None:
            flash("Address registration unsucessful.")
            return render_template('register.html')

        member = Member(
            fullname=request.form.get("fullname"),
            phone_nr=request.form.get("phone_nr"),
            place_id = place.id,
            email=request.form.get("email").lower(),
            is_admin=False,
            is_volunteer=False,
            password=generate_password_hash(request.form.get("password"))
        )

        db.session.add(member)
        db.session.commit()

        # put the new member into 'session' cookie
        session["member"] = request.form.get("member_name")
        flash("Your registration is yet to be approved. Please wait until we get in touch!")
        return redirect(url_for('home'))

    return render_template("register.html")


@app.route("/signin", methods=["GET", "POST"])
def signin():
    if request.method == "POST":
        # check if email/username exists in db
        existing_member = Member.query.filter(
            Member.email==request.form.get("email").lower()).first()

        if existing_member:
            print(request.form.get("email"))
            # ensure hashed password matches user input
            if check_password_hash(
                    existing_member.password, request.form.get("password")):
                session["user"] = request.form.get("email").lower()
                flash("Welcome, {}".format(request.form.get("fullname")))
                if existing_member.is_admin == True:
                    members = list(Member.query.all())
                    return redirect(url_for('admin_home', member=existing_member, members=members))
                elif existing_member.is_volunteer == True:
                    return render_template('admin_home.html', member=existing_member)
                else:
                    members = list(Member.query.all())
                    return redirect(url_for('admin_home', member=existing_member, members=members))
                    # return render_template('member_home.html', member=existing_member)
            else:
                # invalid password match
                flash("Incorrect Username and/or Password")
                return redirect(url_for("signin"))

        else:
            # username doesn't exist
            flash("Incorrect Username and/or Password")
            return redirect(url_for("signin"))

    return render_template("signin.html")


@app.route("/member_home/<email>", methods=["GET", "POST"])
def member_home(email):
    # grab the session user's username from db
    if "user" in session:
        member = Member.query.filter(Member.email==email)
        return render_template("member_home.html", member=member)

    return redirect(url_for("login"))


@app.route("/signout")
def signout():
    # remove user from session cookies
    flash("You have been signed out.")
    # session.clear() would clear all cookies related to our app
    session.pop("user")
    return redirect(url_for("signin"))


@app.route("/edit_member/<int:member_id>", methods=["GET", "POST"])
def edit_member(member_id):
    member = Member.query.filter(Member.id==member_id).first()
    place = Place.query.filter(Place.id==member.place_id).first()
    if request.method == "POST":
        
        if member == None:
            flash("Member not registered.")
            return redirect(url_for("signin"))
        
        if place == None:
            flash("Address not recognised.")
            return redirect(url_for("signin"))

        # update place details in Place model (place_id doesn't change!)
        place.google_place_id=request.form.get("address_id"),
        place.address=request.form.get("address"),

        member.fullname = request.form.get("fullname"),
        member.phone_nr = request.form.get("phone_nr"),
        member.email = request.form.get("email").lower(),

        db.session.commit()

    return render_template(
        'edit_member.html', member=member, member_address=place.address, 
        member_address_id=place.google_place_id)


@app.route("/delete_member/<int:member_id>", methods=["POST"])
def delete_member(member_id):
    member = Member.query.get_or_404(member_id)
    db.session.delete(member)
    db.session.commit()
    return redirect(url_for('home'))
