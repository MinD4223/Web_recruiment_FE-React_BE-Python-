from flask import Flask, request, jsonify, Blueprint
from pymongo import MongoClient
from config import Config
from gridfs import GridFS
from bson import ObjectId

user_route = Blueprint("user_route", __name__)
# Kết nối tới MongoDB
client = MongoClient(Config.MONGO_URL)
db = client['CV_DB']
collection_profile = db['profile']
collection_jobs = db['jobs']
collection_apply = db['apply']
fs = GridFS(db)

@user_route.route('/create-profile-org', methods=['POST'])
def create_profile_org():
    data = request.form
    file_cv = request.files.get('file_cv')

    # Kiểm tra các trường bắt buộc
    if not all(k in data for k in ('userId', 'skill', 'description', 'experience')) or not file_cv:
        return jsonify({'status': 'failed', 'message': 'Thiếu thông tin cần thiết'}), 400

    # Kiểm tra định dạng file
    if not file_cv.filename.endswith('.pdf'):
        return jsonify({'status': 'failed', 'message': 'File không hợp lệ, chỉ chấp nhận PDF'}), 400

    # Đọc nội dung file PDF
    pdf_data = file_cv.read()
    pdf_id = fs.put(pdf_data, filename=file_cv.filename)

    # Dữ liệu CV mới
    cv_data = {
        'userId': data['userId'],
        'skill': data['skill'],
        'description': data['description'],
        'experience': data['experience'],
        'file_cv': pdf_id
    }
    
    # Lưu vào MongoDB
    collection_profile.insert_one(cv_data)
    return jsonify({'status': 'success', 'message': 'CV đã được lưu thành công', 'file_id': str(pdf_id)}), 201

@user_route.route('/create-profile', methods=['POST'])
def create_profile():
    data = request.get_json()
    
    if not all(k in data for k in ('userId', 'skill', 'description', 'experience')):
        return jsonify({'status': 'failed', 'message': 'Thiếu thông tin cần thiết'}), 400

    # Dữ liệu CV mới
    cv_data = {
        'userId': data['userId'],
        'skill': data['skill'],
        'description': data['description'],
        'experience': data['experience']
    }
    
    existing_profile = collection_profile.find_one({'userId': data['userId']})
    
    if existing_profile:
        # Nếu đã tồn tại, cập nhật dữ liệu
        collection_profile.update_one(
            {'userId': data['userId']}, 
            {'$set': cv_data}
        )
        return jsonify({'status': 'success', 'message': 'CV đã được cập nhật thành công'}), 200
    else:
        # Nếu không tồn tại, thêm mới dữ liệu
        collection_profile.insert_one(cv_data)
        return jsonify({'status': 'success', 'message': 'CV đã được lưu thành công'}), 201


@user_route.route('/submit-profile', methods=['POST'])
def submit_profile():
    try:
        data = request.get_json()    
        job_id = data.get('job_id')
        user_id = data.get('user_id')
        
        if not job_id or not user_id:
            return jsonify({"error": "Missing job_id or user_id"}), 400
        
        # Tìm thông tin người dùng từ collection 'profile'
        user_profile = collection_profile.find_one({"userId": user_id})
        
        if not user_profile:
            return jsonify({"error": "User not found in profile"}), 404
        
        # Lấy thông tin skill, description, experience từ thông tin người dùng
        skill = user_profile.get("skill", "")
        description = user_profile.get("description", "")
        experience = user_profile.get("experience", "")

        # Cập nhật công việc với jobId, thêm user vào mảng 'user' với thông tin skill, description, experience
        result = collection_apply.update_one(
            {"jobId": job_id},
            {
                "$push": {
                    "user": {
                        "userId": user_id,  
                        "status": "unapproval",
                        "date": "",
                        "score": {
                            "attitude": "", 
                            "skill": "",
                            "knowledge": "",
                            "total":""
                        },
                        "location": {
                            "floor": "",
                            "room": "",
                            "time": ""
                        }
                    }
                }
            }
        )

        if result.matched_count == 0:
            return jsonify({"error": "Job not found"}), 404
        
        return jsonify({"message": "Profile submitted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_route.route('/view-interview/<user_id>', methods=['GET'])
def view_interview(user_id):
    try:
        # Tìm thông tin của user trong collection_apply
        result = collection_apply.find_one(
            {"user.userId": user_id},  # Tìm user theo userId
            {"user.$": 1}  # Lấy chỉ user có userId trùng khớp
        )

        if not result:
            return jsonify({"error": "User not found in apply collection"}), 404

        # Trích xuất thông tin location của user
        user_data = result.get("user", [{}])[0]
        date = user_data.get("date", {})
        location = user_data.get("location", {})

        return jsonify({"location": location, "date": date}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_route.route('/accept-interview/<user_id>', methods=['GET'])
def accept_interview(user_id):
    try:
        result = collection_apply.update_one(
            {"user.userId": user_id},  
            {"$set": {"user.$.status": "interview"}}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "User not found in apply collection"}), 404

        return jsonify({"message": "User status updated to 'interview'"}), 200

    except Exception as e:
        return jsonify({"error": str(e)})
    
@user_route.route('/reject-interview/<user_id>', methods=['GET'])
def reject_interview(user_id):
    try:
        result = collection_apply.update_one(
            {"user.userId": user_id},  
            {"$set": {"user.$.status": "reject"}}
        )
        print(result)
        if result.matched_count == 0:
            return jsonify({"error": "User not found in apply collection"}), 404

        return jsonify({"message": "User status updated to 'reject'"}), 200

    except Exception as e:
        return jsonify({"error": str(e)})
    
@user_route.route('/check-spam/<user_id>', methods=['GET'])
def check_spam(user_id):
    job = collection_apply.find_one({"user.userId": user_id})
    
    if job:
        for user in job['user']:
            if user['userId'] == str(user_id):
                user_status = user['status'] 
                break
                    
        return jsonify({
            "check_spam": "false",
            "status": user_status
        }), 200
    else:
        return jsonify({
            "check_spam": "true",
            "status": None
        }), 200
    
    
@user_route.route('/test-user')
def test_user():
    return "This is route User"
