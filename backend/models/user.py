# models/user.py

from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, username, email, password, _id=None):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password) if password else None
        self._id = ObjectId(_id) if _id else None

    def to_dict(self):
        return {
            "_id": str(self._id) if self._id else None,
            "username": self.username,
            "email": self.email,
            "password": self.password
        }

    @staticmethod
    def verify_password(hashed_password, password):
        return check_password_hash(hashed_password, password)
