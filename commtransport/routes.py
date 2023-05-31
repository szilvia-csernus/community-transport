from flask import flash, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from commtransport import app, db
from commtransport.models import Member, Place, Approval, Request
from datetime import datetime


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

        member = Member(
            # create new member
            fullname=request.form.get("fullname"),
            phone_nr=request.form.get("phone_nr"),
            place_id = place.id,
            email=request.form.get("email").lower(),
            # approved=True,
            # is_admin=True,
            is_volunteer=bool(True if user_type == "volunteer" else False),
            password=generate_password_hash(request.form.get("password"))
        )
        db.session.add(member)
        db.session.commit()

        approval = Approval(
            # create new approval request for new member 
            requestor_id = member.id,
            status = "outstanding"
            # status = "approved"
        )
        db.session.add(approval)
        db.session.commit()

        # add new approval_id to new member
        member.approval_id = approval.id

        db.session.commit()

        flash("Thank you for signing up! Your registration is yet to be \
              approved. Please wait until we get in touch!")
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
                    flash("Your registration is yet to be approved. \
                          Please wait until we get in touch.")
                    return redirect(url_for('home'))
                else:
                    # if approval was granted, create a hashed session cookie
                    session["user"] = generate_password_hash(request.form.get(
                        "email").lower())
                    flash("Welcome, {}".format(existing_member.fullname))
                    if existing_member.is_admin == True:
                        # if user is admin, redirect to the admin page
                        return redirect(
                            url_for('all_members', user_id=existing_member.id))
                    elif existing_member.is_volunteer == True:
                        # if user is a volunteer, redirect to the volunteer page
                        return redirect(
                            url_for('volunteer_profile', user_id=existing_member.id))
                    else:
                        # all other users redirect to the member's page
                        return redirect(
                            url_for('member_profile', user_id=existing_member.id))
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
    # clear all cookies related to the app.
    session.clear()
    # session.pop("user") would only clear the "user" cookie
    return redirect(url_for("signin"))


# Member routes 

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
    
    unapproved_members = list(Member.query.filter(Member.approved==False))
    unapproved_members_count = Member.query.filter(
        Member.approved==False).count()
    
    approved_members = list(
        Member.query.filter(Member.approved == True))
    
    now = datetime.now()
    future_outstanding_requests_count = Request.query.filter(
        Request.request_time > now).count()

    return render_template(
        "all_members.html",
        user=user,
        approved_members=approved_members,
        unapproved_members=unapproved_members,
        unapproved_members_count=unapproved_members_count,
        future_outstanding_requests_count=future_outstanding_requests_count)


@app.route("/member_profile/<int:user_id>", methods=["GET", "POST"])
def member_profile(user_id):
    member = Member.query.filter(Member.id == user_id).first()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], member.email)
    # check if user's account is approved
    is_approved = member.approved

    # Sign out unauthorized user
    if not is_logged_in or not is_approved:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
   
    return render_template("member_profile.html", user=member, 
                           place=member.place)


@app.route("/volunteer_profile/<int:user_id>", methods=["GET", "POST"])
def volunteer_profile(user_id):
    member = Member.query.filter(Member.id == user_id).first()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], member.email)
    
    # check if user's account is approved
    is_approved = member.approved

    # Sign out unauthorized user
    if not is_logged_in or not is_approved:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
   
    return render_template("volunteer_profile.html", user=member, 
                           place=member.place)


@app.route("/admin_profile/<int:user_id>", methods=["GET", "POST"])
def admin_profile(user_id):
    member = Member.query.filter(Member.id == user_id).first()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], member.email)
    # check if user's account is approved
    is_approved = member.approved

    # Sign out unauthorized user
    if not is_logged_in or not is_approved or not member.is_admin:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    
    unapproved_members_count = Member.query.filter(
        Member.approved == False).count()

    now = datetime.now()
    future_outstanding_requests_count = Request.query.filter(
        Request.request_time > now).count()

    return render_template("admin_profile.html", user=member,
        unapproved_members_count=unapproved_members_count,
        future_outstanding_requests_count=future_outstanding_requests_count,
        place=member.place)


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
    
    if request.method == "POST":
        if member == None:
            flash("Member not registered.")
            return redirect(url_for("signin"))
        
        if member.place == None:
            flash("Address not recognised.")
            return

        # update place details in Place model (place_id doesn't change!)
        member.place.google_place_id=request.form.get("google_address_id"),
        member.place.address=request.form.get("address"),

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
            return redirect(url_for('all_members', user_id=user.id))
        elif user.is_volunteer:
            return redirect(url_for('volunteer_profile', user_id=user.id))
        else:
            return redirect(url_for('member_profile', user_id=user.id))

    return render_template(
        'edit_member.html', user=user, member=member,
        google_address_id=member.place.google_place_id)


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
#         return redirect(url_for('member_profile', member_id=user.id))
    

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

    # Superuser's approved status should not be edited
    is_superuser = member.fullname == "Superuser"

    if not is_approved or not is_logged_in or not is_authorised:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    
    if is_superuser:
        flash("Superuser should not be deleted.")
        return redirect(request.referrer)
    
    # for all the approvals the person made in the past, reset the reviewer_id to
    # none, the status to "outstanding" and the member's approved status to False
    # so that another admin can approve this person again.
    for approval in approvals:
        approval.reviewer_id = None
        approval.status = "outstanding"
        approved_person = Member.query.filter(
            Member.approval_id==approval.id).first()
        approved_person.approved = False

    db.session.delete(member)
    db.session.commit()

    if user.is_admin:
        return redirect(url_for(
            'all_members', user_id=user.id, member_id=user.id))
    else:
        return redirect(url_for('home'))
    

@app.route("/confirm_delete'/<int:user_id>/<int:member_id>")
def confirm_delete(user_id, member_id):
    member = Member.query.filter(Member.id == member_id).first()
    user = Member.query.filter(Member.id == user_id).first()

    # check if user signed in
    is_logged_in = "user" in session and check_password_hash(
        session["user"], user.email)

    # check if user's account is approved
    is_approved = user.approved

    is_authorised = user.is_admin or user_id == member_id

    # Superuser's should not be deleted
    is_superuser = member.fullname == "Superuser"

    if not is_approved or not is_logged_in or not is_authorised:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    
    if is_superuser:
        flash("Superuser should not be deleted.")
        return redirect(request.referrer)
    
    return render_template('confirm_delete.html', user=user, member=member)
    

@app.route("/approve/<int:user_id>/<int:approval_id>/<action>")
def approve(user_id, approval_id, action):
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

    # Superuser's approved status should not be edited
    is_superuser = member.fullname == "Superuser"

    if not is_approved or not is_logged_in or not is_authorised:
        flash("Unauthorized access!")
        return redirect(url_for("signout"))
    if is_superuser:
        flash("Superuser's status should not be edited.")
        return redirect(request.referrer)

    if not approval:
        flash("Approval request not recognised.")
        return redirect(request.referrer)
    
    if action == 'decline':
        approval.status = "declined"
        member.approved = False 
        approval.reviewer_id = user.id
        db.session.commit()
        return redirect(request.referrer)
    elif action == 'approve':
        approval.status = "approved"
        member.approved = True
        approval.reviewer_id = user.id
        db.session.commit()
        return redirect(request.referrer)
    else:
        flash("Approval request not recognised.")
        return redirect(request.referrer)


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
    
    # place = Place.query.filter(Place.id == user.place_id).first()

    if user.place == None:
        flash("Your address is not recognised. Please update your address \
              before initiating new transport request.")
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
            requestor_id = user.id,
            request_time = request.form.get("date"),
            start_location_id = pickup.id,
            end_location_id = dropoff.id
        )

        db.session.add(new_request)
        db.session.commit()

        flash("We registered your request, our volunteers will be notified. \
              Please wait until someone gets in touch.")
        return redirect(url_for('member_profile', user_id=user.id))

    return render_template(
        'new_request.html', user=user, user_address=user.place.address,
        google_address_id=user.place.google_place_id)


@app.route("/all_requests/<int:user_id>")
def all_requests(user_id):
    """ Page listing all future & past requests """
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
    
    unapproved_members_count = Member.query.filter(
        Member.approved == False).count()

    now = datetime.now()
    future_requests = list(Request.query.filter(
        Request.request_time > now).order_by(Request.request_time).all())
    expired_requests = list(Request.query.filter(
        Request.request_time < now ).order_by(Request.request_time).all())

    future_outstanding_requests_count = Request.query.filter(
        Request.request_time > now).count()

    return render_template('all_requests.html',
        user=user,
        unapproved_members_count=unapproved_members_count,
        future_outstanding_requests_count=future_outstanding_requests_count,
        future_requests=future_requests,
        expired_requests=expired_requests)


@app.route("/member_requests/<int:user_id>")
def member_requests(user_id):
    """ Page listing member's future & past requests """
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

    now = datetime.now()
    future_requests = list(Request.query.filter(
        Request.request_time > now and Request.requestor_id==user.id)
        .order_by(Request.request_time).all())
    expired_requests = list(Request.query.filter(
        Request.request_time < now and Request.requestor_id == user.id)
        .order_by(Request.request_time).all())

    return render_template('member_requests.html',
                           user=user,
                           future_requests=future_requests,
                           expired_requests=expired_requests)
