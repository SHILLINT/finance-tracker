# models/transaction.py

from bson.objectid import ObjectId

class Transaction:
    def __init__(self, user_id, txn_type, category, amount, date, note="", _id=None):
        self.user_id = ObjectId(user_id)
        self.type = txn_type  # "income" or "expense"
        self.category = category
        self.amount = float(amount)
        self.date = date
        self.note = note
        self._id = ObjectId(_id) if _id else None

    def to_dict(self):
        return {
            "_id": str(self._id) if self._id else None,
            "user_id": str(self.user_id),
            "type": self.type,
            "category": self.category,
            "amount": self.amount,
            "date": self.date,
            "note": self.note
        }
