from commtransport import db


class Member(db.Model):
    # schema for the Member model
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(300), nullable=False)
    # handle the case when place gets deleted! (ask member for new address)
    place_id = db.Column(db.Integer, db.ForeignKey("place.id")) 

    phone_nr = db.Column(db.String(13))
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    is_volunteer = db.Column(db.Boolean, default=False, nullable=False)
    approved = db.Column(db.Boolean, default=False, nullable=False)
    # handle the case when approval gets deleted - when approving person gets deleted
    # to get admins to approve member again
    approval_id = db.Column(db.Integer, db.ForeignKey("approval.id"))
    

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        # return f"#{self.id} - Name: #{self.member_name}, - email: #{self.email}"
        return self
    

class Place(db.Model):
    # schema for the Place model
    # only Google-verified addresses get stored
    id = db.Column(db.Integer, primary_key=True)
    google_place_id = db.Column(db.String)
    address = db.Column(db.String(300))

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return self.address


class Approval(db.Model):
    # schema for approving new members
    id = db.Column(db.Integer, primary_key=True)
    # delete approval if the requesting person gets deleted
    requester_id = db.Column(db.Integer, db.ForeignKey(
        "member.id", ondelete="CASCADE"), nullable=False)
    status = db.Column(db.String, default="outstanding")
    # if reviewer gets deleted, update status programmatically!
    reviewer_id = db.Column(db.Integer, db.ForeignKey("member.id"), default=None)

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return self


class Request(db.Model):
    # schema for transport requests
    id = db.Column(db.Integer, primary_key=True)
    # delete request if the requesting person gets deleted
    requester_id = db.Column(db.Integer, db.ForeignKey(
        "member.id", ondelete="CASCADE"), nullable=False)
    request_time = db.Column(db.Date, nullable=False)
    # handle programmatically if a place gets deleted!
    location_id = db.Column(db.Integer, db.ForeignKey("place.id"))
    destination_id = db.Column(db.Integer, db.ForeignKey("place.id"))
    volunteer_id = db.Column(
        db.Integer, db.ForeignKey("member.id"), default=None)
    message = db.Column(db.String(500))

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return self
    

