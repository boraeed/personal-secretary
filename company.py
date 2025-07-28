from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    commercial_register = db.Column(db.String(50), unique=True, nullable=False)
    contact_person = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    address = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, inprogress, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقات
    reminders = db.relationship('Reminder', backref='company', lazy=True, cascade='all, delete-orphan')
    actions = db.relationship('Action', backref='company', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Company {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'commercial_register': self.commercial_register,
            'contact_person': self.contact_person,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Reminder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    reminder_type = db.Column(db.String(20), nullable=False)  # call, review, deadline
    reminder_date = db.Column(db.DateTime, nullable=False)
    is_completed = db.Column(db.Boolean, default=False)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Reminder {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'reminder_type': self.reminder_type,
            'reminder_date': self.reminder_date.isoformat() if self.reminder_date else None,
            'is_completed': self.is_completed,
            'company_id': self.company_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Action(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    action_type = db.Column(db.String(20), nullable=False)  # call, review, important
    action_date = db.Column(db.DateTime, default=datetime.utcnow)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Action {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'action_type': self.action_type,
            'action_date': self.action_date.isoformat() if self.action_date else None,
            'company_id': self.company_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

