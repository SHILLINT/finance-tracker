from flask import Blueprint, request, jsonify
from utils.db import mongo
from bson import ObjectId

transaction_bp = Blueprint("transactions", __name__)

@transaction_bp.route("/", methods=["GET"])
def get_transactions():
    username = request.args.get("username")
    transactions = list(mongo.db.transactions.find({"username": username}))
    for t in transactions:
        t["_id"] = str(t["_id"])  # convert ObjectId to string
    return jsonify(transactions)

@transaction_bp.route("/", methods=["POST"])
def add_transaction():
    data = request.get_json()
    required_fields = ["username", "amount", "category", "type", "date"]

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing fields"}), 400

    mongo.db.transactions.insert_one(data)
    return jsonify({"message": "Transaction added"}), 201

@transaction_bp.route("/<id>", methods=["DELETE"])
def delete_transaction(id):
    mongo.db.transactions.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Transaction deleted"}), 200
