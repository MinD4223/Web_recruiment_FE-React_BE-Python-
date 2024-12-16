from flask import Flask, request, jsonify, send_file
import requests
from config import Config
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/')
def index():
    return "This is API Service"

@app.route('/api/register-user', methods=['POST'])
def api_register_user():
    try:
        user_data = request.get_json()
        if not user_data:
            return jsonify({"message": "ERROR: No data provided"}), 400
        
        register_url = Config.UAA + "/register-user"
        response = requests.post(register_url, json=user_data)
        
        if response.status_code == 201:
            return jsonify({"message": "User registered successfully", "uaa_response": response.json()}), 200
        else:
            return jsonify({"message": "Failed to register user", "uaa_response": response.json()}), response.status_code
    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500
    
@app.route('/api/login-user', methods=['POST'])
def api_login_user():
    try:
        user_data = request.get_json()
        if not user_data:
            return jsonify({"error": "No data provided"}), 400
        
        login_url = Config.UAA + "/login-user"
        response = requests.post(login_url, json=user_data)
        
        if response.status_code == 200:
            return jsonify({"message": "User login successfully", "uaa_response": response.json()}), 200
        else:
            return jsonify({"message": "Failed to login user", "uaa_response": response.json()}), response.status_code
    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500
    
@app.route('/api/create-profile', methods=['POST'])
def api_create_profile():
    try:
        user_data = request.json
        #file_cv = request.files.get('file_cv')
        #file_data = {'file_cv': (file_cv.filename, file_cv.stream, file_cv.mimetype)}
        
        create_profile_url = Config.MANAGE + "/create-profile"
        #response = requests.post(create_profile_url, files=file_data, data=user_data)
        response = requests.post(create_profile_url, json=user_data)

        if response.status_code == 201:
            return jsonify({"message": "Profile created successfully", "response_data": response.json()}), 200
        else:
            return jsonify({"message": "Failed to create profile", "response_data": response.json()}), response.status_code
    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500

@app.route('/api/create-job', methods=['POST'])
def api_create_job():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400

        create_job_url = Config.MANAGE + "/create-job"
        response = requests.post(create_job_url, json=data)
        
        if response.status_code == 201:
            return jsonify({"message": "Create job successfully", "response_data": response.json()}), 200
        else:
            return jsonify({"message": "Failed to create job", "response_data": response.json()}), response.status_code
    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500

@app.route('/api/delete-job/<job_id>', methods=['DELETE'])
def api_delete_job(job_id):
    try:
        if not job_id:
            return jsonify({"error": "User ID is required"}), 400

        delete_job_url = f"{Config.MANAGE}/delete-job/{job_id}"  
        
        response = requests.delete(delete_job_url)
        if response.status_code == 200:
            return jsonify({
                "message": "Delete job successfully",
                "response_data": response.json()
            }), 200
        else:
            return jsonify({
                "message": "Failed to delete job",
                "response_data": response.json()
            }), response.status_code
    except Exception as e:
        return jsonify({
            "message": f"ERROR: {str(e)}"
        }), 500    
        
@app.route('/api/list-jobs', methods=['GET'])
def api_list_jobs():
    try:
        url = Config.MANAGE + "/list-jobs"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            return jsonify(data), 200
        else:
            return jsonify({"message": f"Failed to fetch data. Status code: {response.status_code}"}), response.status_code

    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500
    
@app.route('/api/list-users/<job_id>', methods=['GET'])
def api_list_users(job_id):
    try:
        if not job_id:
            return jsonify({"error": "Job ID is required"}), 400

        list_user_url = f"{Config.MANAGE}/list-users/{job_id}"  
        
        response = requests.get(list_user_url)
        if response.status_code == 200:
            return jsonify({
                "message": "List user successfully",
                "response_data": response.json()
            }), 200
        else:
            return jsonify({
                "message": "Failed to list user",
                "response_data": response.json()
            }), response.status_code
    except Exception as e:
        return jsonify({
            "message": f"ERROR: {str(e)}"
        }), 500
        

@app.route('/api/get-job/<job_id>', methods=['GET'])
def api_get_job(job_id):
    try:
        if not job_id:
            return jsonify({"error": "Job ID is required"}), 400

        get_job_url = f"{Config.MANAGE}/get-job/{job_id}"  
        
        response = requests.get(get_job_url)
        if response.status_code == 200:
            return jsonify({
                "message": "Get job successfully",
                "response_data": response.json()
            }), 200
        else:
            return jsonify({
                "message": "Failed to get job",
                "response_data": response.json()
            }), response.status_code
    except Exception as e:
        return jsonify({
            "message": f"ERROR: {str(e)}"
        }), 500
        
@app.route('/api/get-user/<user_id>', methods=['GET'])
def api_get_user(user_id):
    try:
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        get_user_url = f"{Config.MANAGE}/get-user/{user_id}"  
        
        response = requests.get(get_user_url)
        if response.status_code == 200:
            return jsonify({
                "message": "Get user successfully",
                "response_data": response.json()
            }), 200
        else:
            return jsonify({
                "message": "Failed to get user",
                "response_data": response.json()
            }), response.status_code
    except Exception as e:
        return jsonify({
            "message": f"ERROR: {str(e)}"
        }), 500
    
@app.route('/api/update-job', methods=['POST'])
def api_update_job():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400

        list_user_url = Config.MANAGE + "/update-job"
        response = requests.post(list_user_url, json=data)
        
        if response.status_code == 200:
            return jsonify({"message": "Update job successfully", "response_data": response.json()}), 200
        else:
            return jsonify({"message": "Failed to update job", "response_data": response.json()}), response.status_code
    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500

@app.route('/api/count-jobs', methods=['GET'])
def api_count_jobs():
    try:
        url = Config.MANAGE + "/count-jobs"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            return jsonify(data), 200
        else:
            return jsonify({"message": f"Failed to fetch data. Status code: {response.status_code}"}), response.status_code

    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500
    
@app.route('/api/submit-profile', methods=['POST'])
def api_submit_profile():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400

        submit_profile_url = Config.MANAGE + "/submit-profile"
        response = requests.post(submit_profile_url, json=data)
        
        if response.status_code == 200:
            return jsonify({"message": "Submit job successfully", "response_data": response.json()}), 200
        else:
            return jsonify({"message": "Failed to submit job", "response_data": response.json()}), response.status_code
    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500
    
@app.route('/api/interview', methods=['POST'])
def api_interview():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400

        submit_profile_url = Config.MANAGE + "/interview"
        response = requests.post(submit_profile_url, json=data)
        
        if response.status_code == 200:
            return jsonify({"message": "Interview successfully", "response_data": response.json()}), 200
        else:
            return jsonify({"message": "Failed to interview", "response_data": response.json()}), response.status_code
    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500

@app.route('/api/view-interview/<user_id>', methods=['GET'])
def api_view_interview(user_id):
    try:
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        view_interview_url = f"{Config.MANAGE}/view-interview/{user_id}"  
        
        response = requests.get(view_interview_url)
        if response.status_code == 200:
            return jsonify({
                "message": "Get user successfully",
                "response_data": response.json()
            }), 200
        else:
            return jsonify({
                "message": "Failed to get user",
                "response_data": response.json()
            }), response.status_code
    except Exception as e:
        return jsonify({
            "message": f"ERROR: {str(e)}"
        }), 500

@app.route('/api/accept-interview/<user_id>', methods=['GET'])
def api_accept_interview(user_id):
    try:
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        accept_interview_url = f"{Config.MANAGE}/accept-interview/{user_id}"  
        
        response = requests.get(accept_interview_url)
        if response.status_code == 200:
            return jsonify({
                "message": "Get user successfully",
                "response_data": response.json()
            }), 200
        else:
            return jsonify({
                "message": "Failed to get user",
                "response_data": response.json()
            }), response.status_code
    except Exception as e:
        return jsonify({
            "message": f"ERROR: {str(e)}"
        }), 500
        
@app.route('/api/reject-interview/<user_id>', methods=['GET'])
def api_reject_interview(user_id):
    try:
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        reject_interview_url = f"{Config.MANAGE}/reject-interview/{user_id}"  
        
        response = requests.get(reject_interview_url)
        if response.status_code == 200:
            return jsonify({
                "message": "Get user successfully",
                "response_data": response.json()
            }), 200
        else:
            return jsonify({
                "message": "Failed to get user",
                "response_data": response.json()
            }), response.status_code
    except Exception as e:
        return jsonify({
            "message": f"ERROR: {str(e)}"
        }), 500

@app.route('/api/rate-user', methods=['POST'])
def api_rate_user():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400

        submit_profile_url = Config.MANAGE + "/rate-user"
        response = requests.post(submit_profile_url, json=data)
        
        if response.status_code == 200:
            return jsonify({"message": "Rate user successfully", "response_data": response.json()}), 200
        else:
            return jsonify({"message": "Failed to interview", "response_data": response.json()}), response.status_code
    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500 
    
@app.route('/api/score', methods=['POST'])
def api_score():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400

        score_url = Config.MANAGE + "/score"
        response = requests.post(score_url, json=data)
        
        if response.status_code == 200:
            return jsonify({"message": "Rate user successfully", "response_data": response.json()}), 200
        else:
            return jsonify({"message": "Failed to rate", "response_data": response.json()}), response.status_code
    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500 

@app.route('/api/dashboard', methods=['GET'])
def api_dashboard():
    try:
        url = Config.MANAGE + "/dashboard"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            return jsonify(data), 200
        else:
            return jsonify({"message": f"Failed to fetch data. Status code: {response.status_code}"}), response.status_code

    except Exception as e:
        return jsonify({"message": "ERROR: "+str(e)}), 500
     

@app.route('/api/check-spam/<user_id>', methods=['GET'])
def api_check_spam(user_id):
    try:
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        check_spam_url = f"{Config.MANAGE}/check-spam/{user_id}"  
        
        response = requests.get(check_spam_url)
        if response.status_code == 200:
            return jsonify({
                "message": "Check spam successfully",
                "response_data": response.json()
            }), 200
        else:
            return jsonify({
                "message": "Failed to check spam",
                "response_data": response.json()
            }), response.status_code
    except Exception as e:
        return jsonify({
            "message": f"ERROR: {str(e)}"
        }), 500    

@app.route('/api/unsubmit-profile/<user_id>', methods=['DELETE'])
def api_unsubmit_profile(user_id):
    try:
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        unsubmit_profile_url = f"{Config.MANAGE}/unsubmit-profile/{user_id}"  
        
        response = requests.delete(unsubmit_profile_url)
        if response.status_code == 200:
            return jsonify({
                "message": "Unsubmit profile successfully",
                "response_data": response.json()
            }), 200
        else:
            return jsonify({
                "message": "Failed to unsubmit profile",
                "response_data": response.json()
            }), response.status_code
    except Exception as e:
        return jsonify({
            "message": f"ERROR: {str(e)}"
        }), 500   
         
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8021, debug=True)