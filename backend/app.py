from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from utils.db import mongo

from flask import request, jsonify
from models.transaction import Transaction
from bson.objectid import ObjectId

def create_app():
    app = Flask(__name__)
    CORS(app)  # Allow React frontend to talk to Flask backend

    # Load settings from config.py
    app.config.from_object("config")

    # Initialize MongoDB
    mongo.init_app(app)

    # Import and register routes
    from routes.auth_routes import auth_bp
    from routes.transaction_routes import transaction_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(transaction_bp, url_prefix="/api/transactions")

    # ✅ Test route (moved inside create_app)
    @app.route("/api/test")
    def test_mongo_connection():
        try:
            mongo.db.test.insert_one({"ping": "pong"})
            return jsonify(message="MongoDB Atlas connection successful!")
        except Exception as e:
            return jsonify(error=str(e)), 500

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5167)
