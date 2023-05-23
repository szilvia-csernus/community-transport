from commtransport import db


class User(db.Model):
    # schema for the User model
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(260), nullable=False)
    # handle the case when place gets deleted! (ask user for new address)
    place_id = db.Column(db.Integer, db.ForeignKey("place.id")) 
    phone_nr = db.Column(db.String(13))
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    is_volunteer = db.Column(db.Boolean, default=False, nullable=False)
    approved = db.Column(db.Boolean, default=False, nullable=False)
    # handle the case when approval gets deleted - when approving person gets deleted
    # to get admins to approve user again
    approval_id = db.Column(db.Integer, db.ForeignKey("approval.id"))

    # populate own_requests and delete them if user gets deleted
    own_requests = db.relationship(
        "Request", backref="user", cascade="all, delete", lazy=True)
    # populate volunteer_offers but don't delete request if volunteer user gets deleted
    volunteer_offers = db.relationship(
        "Request", backref="user", lazy=True)
    

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return f"#{self.id} - Name: #{self.user_name}, - username: #{self.user_username}"
    

class Place(db.Model):
    # schema for the Place model
    # id is Google place's id, address and coordinates come from Google
    # only Google-verified addresses get stored
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(300))
    coordinates_lat = db.String(25)
    coordinates_long = db.String(25)

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return self.address


class Approval(db.Model):
    # schema for approving new users
    id = db.Column(db.Integer, primary_key=True)
    # delete approval if the requesting person gets deleted
    requester_id = db.Column(db.Integer, db.ForeignKey(
        "user.id", ondelete="CASCADE"), nullable=False)
    status = db.Column(db.String, default="outstanding")
    # if reviewer gets deleted, update status programmatically!
    reviewer_id = db.Column(db.Integer, db.ForeignKey("user.id"), default=None)

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return self


class Request(db.Model):
    # schema for transport requests
    id = db.Column(db.Integer, primary_key=True)
    # delete request if the requesting person gets deleted
    requester_id = db.Column(db.Integer, db.ForeignKey(
        "user.id", ondelete="CASCADE"), nullable=False)
    request_time = db.Column(db.Date, nullable=False)
    # handle programmatically if a place gets deleted!
    location_id = db.Column(db.Integer, db.ForeignKey("place.id"))
    destination_id = db.Column(db.Integer, db.ForeignKey("place.id"))
    volunteer_id = db.Column(
        db.Integer, db.ForeignKey("user.id"), default=None)
    message = db.Column(db.String(500))

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return self
    

