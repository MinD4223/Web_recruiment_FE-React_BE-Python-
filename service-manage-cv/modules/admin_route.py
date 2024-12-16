from flask import Flask, request, jsonify, Blueprint
from pymongo import MongoClient
from config import Config
from bson import ObjectId
from datetime import datetime
from collections import defaultdict

admin_route = Blueprint("admin_route", __name__)
client = MongoClient(Config.MONGO_URL)
db = client['CV_DB']
collection_jobs= db['jobs']
collection_profile= db['profile']
collection_account= db['account']
collection_apply= db['apply']
collection_filter= db['filter']

@admin_route.route('/create-job', methods=['POST'])
def create_job():
    try:
        data = request.get_json()
        
        if not data.get('name') or not data.get('type') or not data.get('category'):
            return jsonify({"error": "Missing required fields"}), 400

        date_from = data.get('dateFrom')
        date_to = data.get('dateTo')

        if date_from:
            try:
                date_from = datetime.strptime(date_from, "%Y-%m-%d")
            except ValueError:
                return jsonify({"error": "Invalid dateFrom format, use YYYY-MM-DD"}), 400

        if date_to:
            try:
                date_to = datetime.strptime(date_to, "%Y-%m-%d")
            except ValueError:
                return jsonify({"error": "Invalid dateTo format, use YYYY-MM-DD"}), 400

        content = data.get("content", {})
        description = content.get("description", "")
        requirements = content.get("requirements", "")
        benefits = content.get("benefits", "")

        job = {
            "name": data.get("name"),
            "type": data.get("type"),
            "category": data.get("category"),
            "level": data.get("level", ""),
            "salary": data.get("salary", ""),
            "city": data.get("city", ""),
            "dateFrom": date_from,
            "dateTo": date_to,
            "content": {
                "description": description,
                "requirements": requirements,
                "benefits": benefits
            },
            "status": "open"
        }
        
        job_result = collection_jobs.insert_one(job)

        # Lấy jobId của công việc vừa thêm
        job_id = str(job_result.inserted_id)
        apply_entry = {
            "jobId": job_id
        }
        collection_apply.insert_one(apply_entry)
        
        return jsonify({"message": "Job created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_route.route('/update-job', methods=['POST'])
def update_job():
    try:
        data = request.get_json()
        required_fields = ['_id', 'name', 'type', 'category', 'level', 'salary', 'content', 'city', 'dateFrom', 'dateTo']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({"error": "Missing required fields", "missing_fields": missing_fields}), 400

        date_from = data.get('dateFrom')
        date_to = data.get('dateTo')

        if date_from:
            try:
                date_from = datetime.strptime(date_from, "%Y-%m-%d")
            except ValueError:
                return jsonify({"error": "Invalid dateFrom format, use YYYY-MM-DD"}), 400

        if date_to:
            try:
                date_to = datetime.strptime(date_to, "%Y-%m-%d")
            except ValueError:
                return jsonify({"error": "Invalid dateTo format, use YYYY-MM-DD"}), 400

        content = data.get("content", {})
        description = content.get("description", "")
        requirements = content.get("requirements", "")
        benefits = content.get("benefits", "")

        job_data = {
            "name": data.get("name"),
            "type": data.get("type"),
            "category": data.get("category"),
            "level": data.get("level", ""),
            "salary": data.get("salary", ""),
            "content": {
                "description": description,
                "requirements": requirements,
                "benefits": benefits
            },
            "city": data.get("city"),
            "dateFrom": date_from,
            "dateTo": date_to
        }

        result = collection_jobs.update_one(
            {"_id": ObjectId(data['_id'])},
            {"$set": job_data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Job not found"}), 404
        
        return jsonify({"message": "Job updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_route.route('/count-jobs')
def count_job():
    try:
        total_jobs = collection_jobs.count_documents({})
        pipeline = [
            {
                "$group": {
                    "_id": "$level",  # Nhóm theo trường 'level'
                    "count": {"$sum": 1}  # Đếm số lượng của từng giá trị 'level'
                }
            },
            {
                "$sort": {"count": -1}  # Sắp xếp kết quả theo số lượng giảm dần
            }
        ]
        
        # Sử dụng aggregate và chuyển kết quả thành danh sách
        result = list(collection_jobs.aggregate(pipeline))
        
        # Tạo danh sách kết quả
        counts = [{"level": item["_id"], "count": item["count"]} for item in result]

        # Trả về kết quả bao gồm tổng số công việc và số lượng công việc theo từng level
        return jsonify({
            "total_jobs": total_jobs,
            "count_jobs": counts
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_route.route('/get-user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        user_account = collection_account.find_one({'_id': ObjectId(user_id)})
        if not user_account:
            return jsonify({'error': 'User not found in account'}), 404

        user_profile = collection_profile.find_one({'userId': user_id})

        user_data = {
            "account": {
                "fullname": user_account.get('fullname', ''),
                "email": user_account.get('email', ''),
                "phone": user_account.get('phone', '')
            },
            "profile": {
                "skill": user_profile.get('skill', '') if user_profile else '',
                "description": user_profile.get('description', '') if user_profile else '',
                "experience": user_profile.get('experience', '') if user_profile else ''
            }
        }

        return jsonify({"user_data": user_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_route.route('/interview', methods=['POST'])
def interview():
    try:
        data = request.json
        user_id = data.get('userId')
        date = data.get('date')
        floor = data.get('floor')
        room = data.get('room')
        time = data.get('time') 

        if not user_id or not date:
            return jsonify({"error": "Missing 'userId' or 'date' in request"}), 400

        try:
            parsed_date = datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Invalid date format. Use 'YYYY-MM-DD'"}), 400

        result = collection_apply.update_one(
            {"user.userId": user_id},  # Tìm document chứa userId trong mảng user
            {
                "$set": {
                    "user.$.date": parsed_date.strftime('%Y-%m-%d'),
                    "user.$.status": "waiting",                
                    "user.$.location.floor": floor,                
                    "user.$.location.room": room,                    
                    "user.$.location.time": time                             
                }
            }
        )

        if result.matched_count == 0:
            return jsonify({"error": "User not found in apply collection"}), 404

        return jsonify({"message": "Date updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_route.route('/rate-user', methods=['POST'])
def rate_user():
    try:
        data = request.json
        
        user_id = data.get('user_id')
        attitude = data.get('attitude')
        skill = data.get('skill')
        knowledge = data.get('knowledge')
        
        if not all([attitude, skill, knowledge]):
            return jsonify({"error": "Missing required score fields: attitude, skill, or knowledge"}), 400

        total = (float(attitude) + float(skill) + float(knowledge))
        score_document = collection_filter.find_one({"name": "score"})

        if not score_document:
            return jsonify({"error": "Score document not found in the database"}), 404

        max_score = float(score_document.get("score")) 
        
        if total < max_score:
            status = "fail"
            result = collection_apply.update_one(
                {"user.userId": user_id},
                {"$pull": {"user": {"userId": user_id}}}
            )
            if result.modified_count == 0:
                return jsonify({"error": "User not found in apply collection to delete"}), 404
            return jsonify({"message": "User " + status}), 200
        else:
            status = "pass"
            result = collection_apply.update_one(
                {"user.userId": user_id},
                {
                    "$set": {
                        "user.$.score": {
                            "attitude": attitude,
                            "skill": skill,
                            "knowledge": knowledge,
                            "total": round(total, 2)  
                        },
                        "user.$.status": status
                    }
                }
            )
            
            if result.matched_count == 0:
                return jsonify({"error": "User not found in apply collection"}), 404

            return jsonify({"message": "User "+status}), 200


    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_route.route('/score', methods=['POST'])
def score():
    try:
        data = request.get_json()

        if 'score' not in data:
            return jsonify({"error": "Missing required field: score"}), 400

        score_value = data['score']

        result = collection_filter.update_one(
            {"name": "score"},  # Tìm tài liệu có name="score"
            {"$set": {"score": score_value}},  # Cập nhật score mới
            upsert=True  # Nếu không tìm thấy tài liệu thì tạo mới
        )

        if result.modified_count == 0 and result.upserted_id is None:
            return jsonify({"message": "No changes were made to the score"}), 200

        return jsonify({"message": "Score updated or created successfully", "score": score_value}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
  
@admin_route.route('/list-users/<job_id>', methods=['GET'])
def list_users(job_id):
    try:
        # Tìm document có jobId phù hợp
        document = collection_apply.find_one({'jobId': job_id}, {'user.userId': 1, '_id': 0})
        if not document:
            return jsonify({'status': 'error', 'message': 'No document found with this jobId'}), 404

        user_ids = [user['userId'] for user in document.get('user', [])]
        object_ids = [ObjectId(uid) for uid in user_ids]

        # Truy vấn đồng thời hai collection
        accounts_cursor = collection_account.find({'_id': {'$in': object_ids}})
        profiles_cursor = collection_profile.find({'userId': {'$in': user_ids}})

        # Tạo từ điển ánh xạ
        accounts_data = {str(account['_id']): account for account in accounts_cursor}
        profiles_data = {profile['userId']: profile for profile in profiles_cursor}

        job_document = collection_jobs.find_one({'_id': ObjectId(job_id)})
        job_name = job_document.get('name')

        users_data = []
        for user_id in user_ids:
            account = accounts_data.get(user_id, {})
            profile = profiles_data.get(user_id, {})
            status = collection_apply.find_one({"user.userId":str(user_id)})
            if status:
                for user in status['user']:
                    if user['userId'] == str(user_id):
                        user_status = user['status'] 
                        break
                    
            user_data = {
                '_id': user_id,
                'email': account.get('email'),
                'fullname': account.get('fullname'),
                'phone': account.get('phone'),
                'skill': profile.get('skill'),
                'description': profile.get('description'),
                'experience': profile.get('experience'),
                'status': user_status
            }
            users_data.append(user_data)

        return jsonify({'status': 'success', 'jobName': job_name, 'users': users_data}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@admin_route.route('/dashboard', methods=['GET'])
def dashboard():
    # Lấy dữ liệu ứng tuyển
    apply_data = list(collection_apply.find({}, {"jobId": 1, "user": 1}))

    job_user_count = defaultdict(int)
    pass_user_count = 0  # Biến đếm số lượng user có trạng thái "pass"

    # Xử lý dữ liệu ứng tuyển
    for record in apply_data:
        job_id = record.get("jobId")
        users = record.get("user", [])
        job_user_count[job_id] += len(users)

        # Đếm số lượng user có trạng thái "pass"
        for user in users:
            if user.get("status") == "pass":
                pass_user_count += 1

    # Lấy dữ liệu công việc
    jobs_data = list(collection_jobs.find({}, {"_id": 1, "name": 1, "level": 1}))
    level_count = defaultdict(int)
    for job in jobs_data:
        level = job.get("level", "Unknown")  # Gán giá trị mặc định "Unknown" nếu không có "level"
        level_count[level] += 1

    # Tổng hợp dữ liệu công việc
    result_jobs = []
    for job in jobs_data:
        job_id = str(job["_id"])
        result_jobs.append({
            "jobId": job_id,
            "name": job.get("name", "Unknown"),
            "userCount": job_user_count.get(job_id, 0)
        })

    # Tổng hợp dữ liệu cấp độ công việc
    job_level_summary = [{"level": level, "count": count} for level, count in level_count.items()]

    # Tính tổng số lượng userCount và count
    total_user_count = sum(job.get("userCount", 0) for job in result_jobs)
    total_level_count = sum(level.get("count", 0) for level in job_level_summary)

    # Thêm một trường mới chứa 3 thuộc tính trong summary
    summary = {
        "total_user": total_user_count,
        "total_job": total_level_count,
        "user_pass": pass_user_count
    }

    # Kết quả tổng hợp
    result = {
        "users": result_jobs,
        "job_level": job_level_summary,
        "summary": summary
    }
    return jsonify(result)

@admin_route.route('/delete-job/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    try:
        result_jobs = collection_jobs.delete_one({"_id": ObjectId(job_id)})
        result_apply = collection_apply.delete_one({"jobId": str(job_id)})
        
        if result_jobs.deleted_count == 0:
            return jsonify({"error": "Job in db jobs not found"}), 404
    
        if result_apply.deleted_count == 0:
            return jsonify({"error": "Job in db apply not found"}), 404

        return jsonify({"message": "Job deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@admin_route.route('/test-admin')
def test_admin():
    return "This is route Admin"
