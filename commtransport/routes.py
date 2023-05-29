from flask import flash, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from commtransport import app, db
from commtransport.models import Member, Place, Approval, Request


@app.route("/")
def home():
    if "user" in session:
        flash("You have been signed out.")
        session.pop("user")
    return render_template("base.html")


@app.route("/map")
def map():
    return render_template("map.html")


@app.route("/register/<user_type>", methods=["GET", "POST"])
def register(user_type):
    if request.method == "POST":
        # check if email/username already exists in db
        existing_member = Member.query.filter(Member.email ==
                                           request.form.get("email").lower()).all()

        if existing_member:
            flash("This email has already been registered. Please sign in.")
            return redirect(url_for("signin"))
        
        place = Place(
            google_place_id = request.form.get("google_address_id"),
            address = request.form.get("address"),  
        )

        db.session.add(place)
        db.session.commit()

        if place == None:
            flash("Address registration unsucessful.")
            return render_template('register.html')
        
        volunteer = True if user_type == "volunteer" else False

        member = Member(
            # create new member
            fullname=request.form.get("fullname"),
            phone_nr=request.form.get("phone_nr"),
            place_id = place.id,
            email=request.form.get("email").lower(),
            is_volunteer=volunteer,
            password=generate_password_hash(request.form.get("password"))
        )
        db.session.add(member)
        db.session.commit()

        approval = Approval(
            # create new approval request for new member 
            requester_id = member.id,
            status = "outstanding"
        )
        db.session.add(approval)
        db.session.commit()

        # add new approval_id to new member
        member.approval_id = approval.id

        db.session.commit()

        flash("Thank you for signing up! Your registration is yet to be approved. Please wait until we get in touch!")
        return redirect(url_for('home'))

    return render_template("register.html", user_type=user_type)


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
                
                if not existing_member.approved:
                    # if user's registration has not been approved
                    flash("Your registration is yet to be approved. Please wait until we get in touch.")
                    return redirect(url_for('home'))
                else:
                    # if approval was granted, create a hashed session cookie
                    session["user"] = generate_password_hash(request.form.get(
                        "email").lower())
                    flash("Welcome, {}".format(existing_member.fullname))
                    if existing_member.is_admin == True:
                        # if user is admin, redirect to the admin page
                        return redirect(url_for('all_members', user_id=existing_member.id))
                    elif existing_member.is_volunteer == True:
                        # if user is a volunteer, redirect to the volunteer page
                        return redirect(url_for('volunteer_home', user_id=existing_member.id))
                    else:
                        # all other users redirect to the member's page
                        return redirect(url_for('member_home', user_id=existing_member.id))
            else:
                # invalid password match
                flash("Incorrect Username or Password!")
                return redirect(url_for("signin"))

        else:
            # username doesn't exist
            flash("Incorrect Username or Password!")
            return redirect(url_for("signin"))

    return render_template("signin.html")


@app.route("/signout")
def signout():
    flash("You have been signed out.")
    # remove user from session cookies
    # session.clear() would clear all cookies related to our app
    session.pop("user")
    return redirect(url_for("signin"))


# Admin pages 

@app.route("/all_members/<int:user_id>", methods=["GET", "POST"])
def all_members(user_id):
    """ Page listing all approved & unapproved members """
    user = Member.query.filter(Member.id == user_id).first()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], user.email)
    
    # check if user's account is approved
    is_approved = user.approved

    # grab the session user's hashed email from db
    if not is_approved or not is_logged_in or not user.is_admin:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    
    members_list = list(Member.query.all())
    unapproved_members_count = Member.query.filter(Member.approved==False).count()
    # query address for each member and sort them into approved & unapproved lists.
    approved_members = []
    unapproved_members = []
    for member in members_list:
        place = Place.query.filter(Place.id == member.place_id).first()
        if member.approved:
            approved_members.append([member, place])
        else:
            unapproved_members.append([member, place])

    return render_template(
        "all_members.html",
        user=user,
        approved_members=approved_members,
        unapproved_members=unapproved_members,
        unapproved_members_count=unapproved_members_count)


# Member pages 

@app.route("/member_home/<int:user_id>", methods=["GET", "POST"])
def member_home(user_id):
    member = Member.query.filter(Member.id == user_id).first()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], member.email)
    # check if user's account is approved
    is_approved = member.approved

    # grab member's place record
    member_place = Place.query.filter(Place.id==member.place_id).first()

    # Sign out unauthorized user
    if not is_logged_in or not is_approved:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
   
    return render_template("member_home.html", user=member, 
                           place=member_place)


@app.route("/volunteer_home/<int:user_id>", methods=["GET", "POST"])
def volunteer_home(user_id):
    member = Member.query.filter(Member.id == user_id).first()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], member.email)
    # check if user's account is approved
    is_approved = member.approved

    # grab member's place record
    member_place = Place.query.filter(Place.id==member.place_id).first()

    # Sign out unauthorized user
    if not is_logged_in or not is_approved:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
   
    return render_template("volunteer_home.html", user=member, 
                           place=member_place)


@app.route("/edit_member/<int:user_id>/<int:member_id>>",
           methods=["GET", "POST"])
def edit_member(user_id, member_id):
    member = Member.query.filter(Member.id==member_id).first()
    user = Member.query.filter(Member.id==user_id).first()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], user.email)
    
    # check if user's account is approved
    is_approved = user.approved
    
    # either admin can edit profile data or the user herself/himself
    is_authorised = user.is_admin or user_id == member_id

    if not is_approved or not is_logged_in or not is_authorised:
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
        place.google_place_id=request.form.get("google_address_id"),
        place.address=request.form.get("address"),

        member.fullname = request.form.get("fullname"),
        member.phone_nr = request.form.get("phone_nr"),

        if user.is_admin:
            if request.form.get("approved") == 'True':
                member.approved = True
                member.approved_by = user.id
            else:
                member.is_volunteer = False
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
            return redirect(url_for('all_members', user_id=user.id))
        else:
            return redirect(url_for('member_home', member_id=user.id))

    return render_template(
        'edit_member.html', user=user, member=member, member_address=place.address,
        google_address_id=place.google_place_id)


# @app.route("/cancel_edit_member/<int:user_id>/<int:member_id>")
# def cancel_edit_member(user_id, member_id):
#     member = Member.query.filter(Member.id==member_id).first()
#     user = Member.query.filter(Member.id==user_id).first()

#     # check if user signed in
#     is_logged_in = "user" in session and check_password_hash(
#         session["user"], user.email)
    
#     # check if user's account is approved
#     is_approved = user.approved
    
#     # either admin can edit profile data or the user herself/himself
#     is_authorised = user.is_admin or user.id == member.id

#     if not is_approved or not is_logged_in or not is_authorised:
#         flash("Unauthorized access!")
#         return redirect(url_for("signout"))
    
#     if user.is_admin:
#         return redirect(url_for('all_members', user_id=user.id))
#     else:
#         return redirect(url_for('member_home', member_id=user.id))
    

@app.route("/delete_member/<int:user_id>/<int:member_id>")
def delete_member(user_id, member_id):
    member = Member.query.filter(Member.id == member_id).first()
    user = Member.query.filter(Member.id == user_id).first()
    approvals = Approval.query.filter(Approval.reviewer_id==member.id).all()
    
    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], user.email)
    
    # check if user's account is approved
    is_approved = user.approved

    is_authorised = user.is_admin or user_id == member_id

    if not is_approved or not is_logged_in or not is_authorised:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    
    # for all the approvals the person made in the past, reset the reviewer_id to
    # none, the status to "outstanding" and the member's approved status to False
    # so that another admin can approve this person again.
    for approval in approvals:
        approval.reviewer_id = None
        approval.status = "outstanding"
        approved_person = Member.query.filter(Member.approval_id==approval.id).first()
        approved_person.approved = False

    db.session.delete(member)
    db.session.commit()

    if user.is_admin:
        return redirect(url_for('all_members', user_id=user.id, member_id=user.id))
    else:
        return redirect(url_for('home'))
    

@app.route("/confirm_delete'/<int:user_id>/<int:member_id>")
def confirm_delete(user_id, member_id):
    member = Member.query.filter(Member.id == member_id).first()
    user = Member.query.filter(Member.id == user_id).first()
    approvals = Approval.query.filter(Approval.reviewer_id == member.id).all()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], user.email)

    # check if user's account is approved
    is_approved = user.approved

    is_authorised = user.is_admin or user_id == member_id

    if not is_approved or not is_logged_in or not is_authorised:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    return render_template('confirm_delete.html', user=user, member=member)
    

@app.route("/approve/<int:user_id>/<int:approval_id>/<decision>")
def approve(user_id, approval_id, decision):
    approval = Approval.query.filter(Approval.id==approval_id).first()
    member = Member.query.filter(Member.approval_id==approval_id).first()
    user = Member.query.filter(Member.id==user_id).first()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], user.email)
    
    # check if user's (the admin's) account is approved
    is_approved = user.approved

    # only admin can approve other accounts, but not her/his own.
    is_authorised = user.is_admin and user.id != member.id

    if not is_approved:
        flash("user is not approved")
        return redirect(url_for("signout"))
    if not is_logged_in:
        flash("user is not logged in")
        return redirect(url_for("signout"))
    if not is_authorised:
        flash("user is not admin or user = member")
        return redirect(url_for("signout"))

    if not approval:
        flash("Approval request not recognised.")
        return redirect(url_for('all_members', member_id=user.id))

    if decision == 'decline':
        approval.status = "declined"
        member.approved = False
    elif decision == 'approve':
        approval.status = "approved"
        member.approved = True
    else:
        flash("Approval request not recognised.")
        return redirect(url_for('all_members', member_id=user.id))
    
    approval.reviewer_id = user.id

    db.session.commit()

    return redirect(url_for('all_members', user_id=user.id, member_id=user.id))


# Request routes 

@app.route("/new_request/<int:user_id>", methods=["GET", "POST"])
def new_request(user_id):
    user = Member.query.filter(Member.id==user_id).first()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], user.email)
    
    # check if user's account is approved
    is_approved = user.approved

    if not is_approved or not is_logged_in:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    
    place = Place.query.filter(Place.id == user.place_id).first()

    if place == None:
        flash("Address not recognised. Please update your address!")
        return redirect(url_for(
            'edit_member', user_id=user.id, member_id=user.id))
    
    if request.method == "POST":
        if user == None:
            flash("User not registered.")
            return redirect(url_for("signin"))
        
        pickup = Place.query.filter(
            Place.google_place_id==request.form.get(
                'pickup_google_place_id')).first()
        
        # if pickup location isn't in the database yet:
        if not pickup:
            pickup = Place(
                google_place_id = request.form.get('pickup_google_place_id'),
                address = request.form.get('pickup_address'),
            )

            db.session.add(pickup)
            db.session.commit()

        dropoff = Place.query.filter(
            Place.google_place_id == request.form.get(
                'dropoff_google_place_id')).first()

        # if dropoff location isn't in the database yet:
        if not dropoff:
            dropoff = Place(
                google_place_id=request.form.get('dropoff_google_place_id'),
                address=request.form.get('dropoff_address'),
            )

            db.session.add(dropoff)
            db.session.commit()
        
        new_request = Request(
            requester_id = user.id,
            request_time = request.form.get("date"),
            location_id = pickup.id,
            destination_id = dropoff.id
        )

        db.session.add(new_request)
        db.session.commit()

        flash("We registered your request, our volunteers will be notified. \
              Please wait until someone gets in touch.")
        return redirect(url_for('member_home', user_id=user.id))

    return render_template(
        'new_request.html', user=user, user_address=place.address,
        google_address_id=place.google_place_id)
