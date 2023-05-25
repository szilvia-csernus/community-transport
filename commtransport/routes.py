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
            is_admin=True,
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
            # ensure hashed password matches user input
            if check_password_hash(
                    existing_member.password, request.form.get("password")):
                session["user"] = generate_password_hash(request.form.get(
                    "email").lower())
                flash("Welcome, {}".format(existing_member.fullname))
                if existing_member.is_admin == True:
                    
                    return redirect(url_for('all_members', member_id=existing_member.id))
                elif existing_member.is_volunteer == True:
                    return redirect(url_for('member_home', member_id=existing_member.id))
                else:
                    return redirect(url_for('member_home', member_id=existing_member.id))
            else:
                # invalid password match
                flash("Incorrect Username or Password!")
                return redirect(url_for("signin"))

        else:
            # username doesn't exist
            flash("Incorrect Username or Password!")
            return redirect(url_for("signin"))

    return render_template("signin.html")


@app.route("/all_members/<int:member_id>", methods=["GET", "POST"])
def all_members(member_id):
    user = Member.query.filter(Member.id == member_id).first()

    is_logged_in = "user" in session and check_password_hash(
        session["user"], user.email)
    
    # grab the session user's hashed email from db
    if is_logged_in == False or user.is_admin == False:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    
    members_list = list(Member.query.all())
    # query address for each member
    members = []
    for member in members_list:
        place = Place.query.filter(Place.id == member.place_id).first()
        members.append([member, place])

    return render_template("all_members.html", user=user, members=members)


@app.route("/member_home/<int:member_id>", methods=["GET", "POST"])
def member_home(member_id):
    member = Member.query.filter(Member.id == member_id).first()

    # check if user logged in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], member.email)
    member_place = Place.query.filter(Place.id==member.place_id).first()

    # Sign out unauthorized user
    if is_logged_in == False:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
   
    return render_template("member_home.html", member=member, place=member_place)


@app.route("/signout")
def signout():
    # remove user from session cookies
    flash("You have been signed out.")
    # session.clear() would clear all cookies related to our app
    session.pop("user")
    return redirect(url_for("signin"))


@app.route("/edit_member/<int:user_id>/<int:member_id>", methods=["GET", "POST"])
def edit_member(user_id, member_id):
    member = Member.query.filter(Member.id==member_id).first()
    user = Member.query.filter(Member.id==user_id).first()

    is_logged_in = "user" in session and check_password_hash(
        session["user"], user.email)
    
    is_authorised = user.is_admin or user_id == member_id

    if is_logged_in == False or is_authorised == False:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    
    place = Place.query.filter(Place.id == member.place_id).first()
    
    if request.method == "POST":
        if member == None:
            flash("Member not registered.")
            return redirect(url_for("signin"))
        
        if place == None:
            flash("Address not recognised.")
            return

        # update place details in Place model (place_id doesn't change!)
        place.google_place_id=request.form.get("address_id"),
        place.address=request.form.get("address"),

        member.fullname = request.form.get("fullname"),
        member.phone_nr = request.form.get("phone_nr"),

        if user.is_admin:
            if request.form.get("is_admin") == 'True':
                member.is_admin = True
            else:
                member.is_admin = False
            if request.form.get("is_volunteer") == 'True':
                member.is_volunteer = True
            else:
                member.is_volunteer = False

        db.session.commit()

        if user.is_admin:
            return redirect(url_for('all_members', member_id=user.id))
        else:
            return redirect(url_for('member_home', member_id=user.id))

    return render_template(
        'edit_member.html', member=member, member_address=place.address, 
        member_address_id=place.google_place_id, user=user)


@app.route("/delete_member/<int:user_id>/<int:member_id>")
def delete_member(user_id, member_id):
    member = Member.query.filter(Member.id == member_id).first()
    user = Member.query.filter(Member.id == user_id).first()
    
    is_logged_in = "user" in session and check_password_hash(
        session["user"], user.email)

    is_authorised = user.is_admin or user_id == member_id

    if is_logged_in == False or is_authorised == False:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    
    db.session.delete(member)
    db.session.commit()

    if user.is_admin:
        return redirect(url_for('all_members', member_id=user.id))
    else:
        return redirect(url_for('home'))
