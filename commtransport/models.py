from commtransport import db
from sqlalchemy.orm import relationship


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
    # handle the case when approval gets deleted - when approving person
    # gets deleted to get admins to approve member again
    approval_id = db.Column(db.Integer, db.ForeignKey("approval.id"))

    # one-to-many relationship, one Member can have one address but one address
    # can belong to more Members.
    place = relationship(
        "Place", back_populates="members_of_address")
    
    # many-to-one relationship, one many requests can belong to one Member
    requests = relationship(
        "Request",
        primaryjoin="Member.id==Request.requestor_id",
        back_populates="requestor")
    
    # many-to-one relationship, one many requests can belong to one Member
    voluntary_offers = relationship(
        "Request",
        primaryjoin="Member.id==Request.volunteer_id",
        back_populates="volunteer")

    # one-to-one relationship, one Member can have one Approval
    # own_approval = relationship(
    #     "Approval",
    #     foreign_keys=[approval_id],
    #     back_populates="requestor", 
    #     uselist=False)

    # one-to-many relationship, one Member can be reviewer of many Approvals
    # reviewed_approvals = relationship(
    #     "Approval", back_populates="reviewer")

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return f"{self.id} - Name: {self.fullname}, - email: {self.email}"
    

class Place(db.Model):
    # schema for the Place model
    # only Google-verified addresses get stored
    id = db.Column(db.Integer, primary_key=True)
    google_place_id = db.Column(db.String)
    address = db.Column(db.String(300))

    # many-to-one relationship, many members can have the same address
    members_of_address = relationship("Member", back_populates="place")

    # many-to-one relationship, one Request has one location, but
    # more requests can be initiated to the same location.
    # start_locations = relationship("Request", back_populates="start_location")

    # many-to-one relationship, one Request has one destination, but
    # more requests can be initiated to the same end_location.
    # end_locations = relationship("Request", back_populates="end_location")

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return self.address


class Approval(db.Model):
    # schema for approving new members
    id = db.Column(db.Integer, primary_key=True)
    # delete approval if the requesting person gets deleted
    requestor_id = db.Column(db.Integer, db.ForeignKey(
        "member.id", ondelete="CASCADE"))
    status = db.Column(db.String, default="outstanding")
    # if reviewer gets deleted, update status programmatically!
    reviewer_id = db.Column(
        db.Integer, db.ForeignKey("member.id"), default=None)
    
    # one-to-one relationship, one Member can have one Approval
    # requestor = relationship(
    #     "Member", 
    #     foreign_keys=[requestor_id])

    # many-to-one relationship, one Member can be reviewer of many Approvals
    # but one Approval can have only one reviewer
    # reviewer = relationship(
    #     "Member",
    #     foreign_keys=[reviewer_id])

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return self


class Request(db.Model):
    # schema for transport requests
    id = db.Column(db.Integer, primary_key=True)
    # delete request if the requesting person gets deleted
    request_time = db.Column(db.Date, nullable=False)
    requestor_id = db.Column(db.Integer, db.ForeignKey(
        "member.id", ondelete="CASCADE"))
    # handle programmatically if a place gets deleted!
    start_location_id = db.Column(db.Integer, db.ForeignKey("place.id"))
    end_location_id = db.Column(db.Integer, db.ForeignKey("place.id"))
    volunteer_id = db.Column(
        db.Integer, db.ForeignKey("member.id"), default=None)
    message = db.Column(db.String(500))

    # one-to-many relationship, one Request can have only one requestor
    # but many requests can belong to one Member
    requestor = relationship(
        "Member",
        foreign_keys=[requestor_id],
        back_populates="requests")
    
    # one-to-many relationship, one Request can have only one volunteer
    # but many requests can belong to one Volunteer
    volunteer = relationship(
        "Member",
        foreign_keys=[volunteer_id],
        back_populates="voluntary_offers")

    # one-to-many relationship, one Request has one location, but
    # more requests can be initiated to the same location. 
    start_location = relationship(
        "Place",
        foreign_keys=[start_location_id])

    # one-to-many relationship, one Request has one location, but
    # more requests can be initiated to the same location.
    end_location = relationship(
        "Place",
        foreign_keys=[end_location_id])

    def __repr__(self):
        # __repr__ to represent itself in the form of a string
        return self
    

