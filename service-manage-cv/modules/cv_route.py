from flask import Flask, request, jsonify, Blueprint
from pymongo import MongoClient
from config import Config
from bson import ObjectId
from datetime import datetime

cv_route = Blueprint("cv_route", __name__)
client = MongoClient(Config.MONGO_URL)
db = client['CV_DB']
collection_jobs = db['jobs']
collection_account = db['account']
collection_profile = db['profile']
collection_apply = db['apply']

@cv_route.route('/get-job/<job_id>', methods=['GET'])
def get_job(job_id):
    try:
        # Kiểm tra xem job_id có tồn tại không
        if not job_id:
            return jsonify({'error': 'Job ID is required'}), 400

        # Tìm công việc dựa trên job_id
        job = collection_jobs.find_one({'_id': ObjectId(job_id)})
        
        # Kiểm tra nếu công việc không tồn tại
        if not job:
            return jsonify({'error': 'Job not found'}), 404

        # Xây dựng dữ liệu trả về
        job_data = {
            "_id": str(job['_id']),
            "name": job.get("name"),
            "type": job.get("type"),
            "category": job.get("category"),
            "level": job.get("level"),
            "salary": job.get("salary"),
            "content": {
                "description": job.get("content", {}).get("description", ""),
                "requirements": job.get("content", {}).get("requirements", ""),
                "benefits": job.get("content", {}).get("benefits", "")
            },
            "city": job.get("city"),
            "dateFrom": job.get("dateFrom").strftime("%Y-%m-%d") if job.get("dateFrom") else None,
            "dateTo": job.get("dateTo").strftime("%Y-%m-%d") if job.get("dateTo") else None
        }

        return jsonify({"job": job_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@cv_route.route('/list-jobs')
def list_jobs():
    try:
        current_date = datetime.utcnow()

        collection_jobs.update_many(
            {"dateTo": {"$lt": current_date}},
            {"$set": {"status": "close"}}
        )
        collection_jobs.update_many(
            {"dateTo": {"$gte": current_date}},
            {"$set": {"status": "open"}}
        )

        jobs = collection_jobs.find({})
        job_list = [
            {
                "_id": str(job["_id"]),
                "name": job.get("name"),
                "type": job.get("type"),
                "category": job.get("category"),
                "level": job.get("level"),
                "salary": job.get("salary"),
                "content": job.get("content"),
                "city": job.get("city"),
                "dateFrom": job.get("dateFrom"),
                "dateTo": job.get("dateTo"),
                "status": job.get("status")
            }
            for job in jobs
        ]

        return jsonify({"jobs": job_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500     
    
@cv_route.route('/unsubmit-profile/<user_id>', methods=['DELETE'])
def unsubmit_profile(user_id):
    try:
        result = collection_apply.update_one(
            {"user.userId": user_id},
            {"$pull": {"user": {"userId": user_id}}} 
        )

        print(result)
        if result.modified_count == 0:
            return jsonify({"error": "User not found in the 'user' list"}), 404

        return jsonify({"message": "User profile removed successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@cv_route.route('/test-cv')
def test_cv():
    return "This is route CV"
