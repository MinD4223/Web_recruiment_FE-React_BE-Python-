from flask import Flask, request, jsonify, Blueprint
from pymongo import MongoClient
from config import Config

login_route = Blueprint("login_route", __name__)
client = MongoClient(Config.MONGO_URL)
db = client['CV_DB']
collection_account = db['account']
collection_profile = db['profile']

@login_route.route('/login-user', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"error": "Missing username or password"}), 400

        username = data['username']
        password = data['password']

        user = collection_account.find_one({"username": username})
        if not user:
            return jsonify({"error": "User not found"}), 404

        if user['password'] != password:
            return jsonify({"error": "Incorrect password"}), 401

        user_id = user['_id'] 
        profile = collection_profile.find_one({"userId": str(user_id)})
        profile_status = "false"
        if profile:
            is_profile_complete = all([
                bool(profile.get("skill")),
                bool(profile.get("description")),
                bool(profile.get("experience"))
            ])
            profile_status = "true" if is_profile_complete else "false"

        response_data = {
            "role": user.get("role"),
            "email": user.get("email"),
            "_id": str(user['_id']),
            "profile": profile_status
        }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@login_route.route('/test-login')
def test_login():
    return "Success login"
