from flask import Flask, request, jsonify, Blueprint
from pymongo import MongoClient
from config import Config

register_route = Blueprint("register_route", __name__)
client = MongoClient(Config.MONGO_URL)
db = client['CV_DB']
collection = db['account']

@register_route.route('/register-user', methods=['POST'])
def register():
    data = request.get_json()
    
    # Kiểm tra các trường bắt buộc
    required_fields = ['username', 'password', 'fullname', 'email', 'phone']
    if not data or any(field not in data for field in required_fields):
        return jsonify({"error": "Missing required fields: username, password, fullname, email, or phone"}), 400
    
    username = data['username']
    password = data['password']
    fullname = data['fullname']
    email = data['email']
    phone = data['phone']
    
    # Kiểm tra định dạng email
    if not email.endswith("@gmail.com"):
        return jsonify({"error": "Email must end with @gmail.com"}), 400  # 400 Bad Request
    
    # Kiểm tra số điện thoại chỉ chứa ký tự từ 0-9
    if not phone.isdigit():
        return jsonify({"error": "Phone number must contain only digits"}), 400  # 400 Bad Request
    
    # Kiểm tra username đã tồn tại chưa
    existing_user = collection.find_one({"username": username})
    if existing_user:
        return jsonify({"error": "Username already exists"}), 409  # 409 Conflict
    
    # Kiểm tra email đã tồn tại chưa
    existing_email = collection.find_one({"email": email})
    if existing_email:
        return jsonify({"error": "Email already exists"}), 409  # 409 Conflict
    
    # Kiểm tra phone đã tồn tại chưa
    existing_phone = collection.find_one({"phone": phone})
    if existing_phone:
        return jsonify({"error": "Phone number already exists"}), 409  # 409 Conflict
    
    # Tạo user mới
    new_user = {
        "username": username,
        "password": password,  # Lưu ý: Nên mã hóa mật khẩu trước khi lưu
        "fullname": fullname,
        "email": email,
        "phone": phone,
        "role": "user"
    }
    collection.insert_one(new_user)
    
    return jsonify({"message": "User registered successfully"}), 201  # 201 Created


@register_route.route('/test-register')
def test_register():
    return "Success register"
