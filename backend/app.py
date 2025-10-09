#Initial

from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

from flask import request, jsonify
from models.transaction import Transaction
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)




app.config.from_object("config")

mongo = PyMongo(app)
db = mongo.db

@app.route("/api/test")
def test():
    try:
        db.test.insert_one({"ping": "pong"})
        return jsonify(message="MongoDB Atlas connection successful!")
    except Exception as e:
        return jsonify(error=str(e)), 500
    
@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    try:
        data = request.get_json()
        txn = Transaction(
            user_id=data["user_id"],
            txn_type=data["type"],
            category=data["category"],
            amount=data["amount"],
            date=data["date"],
            note=data.get("note", "")
        )
        result = db.transactions.insert_one(txn.to_dict())
        txn._id = result.inserted_id
        return jsonify(txn.to_dict()), 201
    except Exception as e:
        return jsonify(error=str(e)), 500




if __name__ == "__main__":
    app.run(debug=True, port=5001)
